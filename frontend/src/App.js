import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchRoadGeometry, fetchFlowColor, midpoint } from './trafficService';

const TOMTOM_API_KEY = 'eMaHo8a9Dyf4xzmytoE8FRDjaTAhU24S';

const ROTAS = [
  {
    id: 'paralela',
    label: 'Paralela',
    nameRegex: 'Avenida Luís Viana Filho|Paralela',
  },
  {
    id: 'suburbana',
    label: 'Cidade Baixa / Suburbana',
    nameRegex: 'Avenida Afrânio Peixoto|Suburbana',
  },
  {
    id: 'br324',
    label: 'Acesso BR-324',
    nameRegex: 'BR-324',
  },
];

function AjustarMapa({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      map.fitBounds(coords);
    }
  }, [coords, map]);
  return null;
}

export default function App() {
  const [filtro, setFiltro] = useState('todas');
  const [trafego, setTrafego] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const intervalRef = useRef(null);

  const rotasParaMostrar = filtro === 'todas' ? ROTAS : ROTAS.filter(r => r.id === filtro);

  async function atualizarTrafego() {
    setCarregando(true);
    setErro(null);
    const novoTrafego = {};
    try {
      for (const rota of rotasParaMostrar) {
        try {
          const trechos = await fetchRoadGeometry(rota.nameRegex);
          const trechosComCor = [];
          for (const trecho of trechos) {
            const [lat, lon] = midpoint(trecho.coords);
            const cor = await fetchFlowColor(lat, lon, TOMTOM_API_KEY);
            trechosComCor.push({ ...trecho, cor });
          }
          novoTrafego[rota.id] = trechosComCor;
        } catch (e) {
          console.error(`Erro rota ${rota.id}`, e);
          novoTrafego[rota.id] = [];
        }
      }
      setTrafego(novoTrafego);
    } catch (e) {
      setErro('Erro ao buscar dados: ' + e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    atualizarTrafego();
    intervalRef.current = setInterval(atualizarTrafego, 5 * 60 * 1000);
    return () => clearInterval(intervalRef.current);
  }, [filtro]);

  const todasCoords = Object.values(trafego).flat().flatMap(t => t.coords);

  return (
    <div>
      <h2 style={{textAlign:'center'}}>Cidades Inteligentes - Salvador</h2>
      
      <div style={{textAlign:'center', marginBottom:10}}>
        <button onClick={() => setFiltro('todas')}>Todas</button>
        <button onClick={() => setFiltro('paralela')}>Paralela</button>
        <button onClick={() => setFiltro('suburbana')}>Suburbana</button>
        <button onClick={() => setFiltro('br324')}>BR-324</button>
        <button onClick={atualizarTrafego}>Atualizar agora</button>
      </div>

      {carregando && <p style={{textAlign:'center'}}>Carregando tráfego...</p>}
      {erro && <p style={{textAlign:'center', color:'red'}}>{erro}</p>}

      <MapContainer center={[-12.9, -38.4]} zoom={11} style={{ height: '80vh', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {todasCoords.length > 0 && <AjustarMapa coords={todasCoords} />}
        
        {Object.entries(trafego).map(([rotaId, trechos]) =>
          trechos.map((trecho) => (
            <Polyline key={`${rotaId}-${trecho.id}`} positions={trecho.coords} color={trecho.cor} weight={6} opacity={0.9}>
              <Tooltip>{trecho.name}</Tooltip>
            </Polyline>
          ))
        )}
      </MapContainer>

      <div style={{textAlign:'center', marginTop:10}}>
        <span style={{color:'#16a34a'}}>● Livre</span> {' '}
        <span style={{color:'#f59e0b'}}>● Lento</span> {' '}
        <span style={{color:'#dc2626'}}>● Congestionado</span>
      </div>
    </div>
  );
}
