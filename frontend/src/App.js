import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchRoadGeometry, fetchFlowColor, midpoint } from './trafficService';

const TOMTOM_API_KEY = 'eMaHo8a9Dyf4xzmytoE8FRDjaTAhU24S';

const ROTAS = [
  { id: 'paralela', label: 'Paralela', nameRegex: 'Luis Viana Filho|Paralela' },
  { id: 'suburbana', label: 'Orla + Suburbana', nameRegex: 'Suburbana|Afranio Peixoto|Octavio Mangabeira' },
  { id: 'br324', label: 'Todas', nameRegex: 'BR-324|Paralela|Suburbana' }, // usado só para o botão Todas
];

function AjustarMapa({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 2) map.fitBounds(coords, { padding: [20, 20] });
  }, [coords, map]);
  return null;
}

export default function App() {
  const [filtro, setFiltro] = useState('br324'); // br324 = Todas
  const [trafego, setTrafego] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [stats, setStats] = useState({ livre: 0, lento: 0, congestionado: 0, co2: 0 });
  const intervalRef = useRef(null);

  const rotasParaMostrar = filtro === 'br324'? ROTAS.slice(0, 2) : ROTAS.filter(r => r.id === filtro);

  async function atualizarTrafego() {
    setCarregando(true);
    const novoTrafego = {};
    let livre = 0, lento = 0, congestionado = 0;

    for (const rota of rotasParaMostrar) {
      try {
        const trechos = await fetchRoadGeometry(rota.nameRegex);
        const trechosComCor = [];
        for (const trecho of trechos.slice(0, 25)) { // pega só 25 pra não travar
          const [lat, lon] = midpoint(trecho.coords);
          const cor = await fetchFlowColor(lat, lon, TOMTOM_API_KEY);
          if (cor === '#16a34a') livre++;
          else if (cor === '#f59e0b') lento++;
          else if (cor === '#dc2626') congestionado++;
          trechosComCor.push({...trecho, cor });
        }
        novoTrafego[rota.id] = trechosComCor;
      } catch (e) {
        console.error(e);
        novoTrafego[rota.id] = [];
      }
    }
    // Cálculo CO2 simples: cada trecho congestionado = + 0.8kg CO2/h
    const co2 = (congestionado * 0.8 + lento * 0.3).toFixed(1);
    setStats({ livre, lento, congestionado, co2 });
    setTrafego(novoTrafego);
    setCarregando(false);
  }

  useEffect(() => {
    atualizarTrafego();
    intervalRef.current = setInterval(atualizarTrafego, 5 * 60 * 1000);
    return () => clearInterval(intervalRef.current);
  }, [filtro]);

  const todasCoords = Object.values(trafego).flat().flatMap(t => t.coords);

  return (
    <div style={{ fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center', margin: '10px 0' }}>Cidades Inteligentes - Salvador</h2>
      <p style={{ textAlign: 'center', margin: 0 }}>Legenda: <span style={{color:'#16a34a'}}>● Verde=livre</span> <span style={{color:'#dc2626'}}>● Vermelho=Paralela engarrafada</span> {carregando && ' | Carregando tráfego...'}</p>

      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <button onClick={() => setFiltro('br324')} style={{margin:2, background: filtro==='br324'?'#333':'#ddd', color: filtro==='br324'?'white':'black'}}>Todas</button>
        <button onClick={() => setFiltro('suburbana')} style={{margin:2, background: filtro==='suburbana'?'#333':'#ddd', color: filtro==='suburbana'?'white':'black'}}>Orla + Suburbana</button>
        <button onClick={() => setFiltro('paralela')} style={{margin:2, background: filtro==='paralela'?'#333':'#ddd', color: filtro==='paralela'?'white':'black'}}>Paralela</button>
        <button onClick={atualizarTrafego} style={{marginLeft:10}}>🔄 Atualizar</button>
      </div>

      {/* PAINEL SUSTENTABILIDADE DE VOLTA */}
      <div style={{ display:'flex', justifyContent:'center', gap:15, marginBottom:10, flexWrap:'wrap' }}>
        <div style={{ border:'1px solid #ccc', padding: '8px 15px', borderRadius:8, background:'#f0fdf4' }}>✅ Trechos Livres: <b>{stats.livre}</b></div>
        <div style={{ border:'1px solid #ccc', padding: '8px 15px', borderRadius:8, background:'#fffbeb' }}>⚠️ Lentos: <b>{stats.lento}</b></div>
        <div style={{ border:'1px solid #ccc', padding: '8px 15px', borderRadius:8, background:'#fef2f2' }}>🚗 Congestionados: <b>{stats.congestionado}</b></div>
        <div style={{ border:'1px solid #16a34a', padding: '8px 15px', borderRadius:8, background:'#dcfce7' }}>🌱 CO₂ Estimado: <b>{stats.co2} kg/h</b></div>
      </div>

      <MapContainer center={[-12.95, -38.45]} zoom={11} style={{ height: '65vh', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {todasCoords.length > 0 && <AjustarMapa coords={todasCoords} />}
        {Object.entries(trafego).map(([rotaId, trechos]) =>
          trechos.map((trecho) => (
            <Polyline key={`${rotaId}-${trecho.id}`} positions={trecho.coords} color={trecho.cor} weight={6} opacity={0.9}>
              <Tooltip>{trecho.name} - {trecho.cor === '#16a34a'? 'Livre' : trecho.cor === '#f59e0b'? 'Lento' : 'Congestionado'}</Tooltip>
            </Polyline>
          ))
        )}
      </MapContainer>
      <p style={{textAlign:'center', fontSize:12, marginTop:5}}><b>Inteligência:</b> Se CO₂ &gt; 10kg/h, sugerir rota alternativa pela Suburbana. Dados via TomTom + OpenStreetMap.</p>
    </div>
  );
}
