import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ROTAS_REAIS, fetchFlowColor, midpoint } from './trafficService';

const TOMTOM_API_KEY = 'eMaHo8a9Dyf4xzmytoE8FRDjaTAhU24S';

function AjustarMapa({ coords }) {
  const map = useMap();
  useEffect(() => { if (coords.length) map.fitBounds(coords); }, [coords, map]);
  return null;
}

export default function App() {
  const [filtro, setFiltro] = useState('todas');
  const [cores, setCores] = useState({ paralela: '#16a34a', orla: '#16a34a', suburbana: '#16a34a' });
  const [stats, setStats] = useState({ livre: 2, lento: 0, congestionado: 0, co2: '1.2', status: 'Carregando...' });
  const [carregando, setCarregando] = useState(true);

  const todasCoords = Object.values(ROTAS_REAIS).flatMap(r => r.coords);

  async function atualizarTrafego() {
    setCarregando(true);
    let livre = 0, lento = 0, congestionado = 0;
    const novasCores = {};
    for (const id of Object.keys(ROTAS_REAIS)) {
      const [lat, lon] = midpoint(ROTAS_REAIS[id].coords);
      const cor = await fetchFlowColor(lat, lon, TOMTOM_API_KEY);
      novasCores[id] = cor;
      if (cor === '#16a34a') livre++;
      else if (cor === '#f59e0b') lento++;
      else congestionado++;
    }
    setCores(novasCores);
    const co2 = (congestionado * 2.5 + lento * 0.9 + livre * 0.2).toFixed(1);
    const status = congestionado >= 2? 'Crítico - Sugerir desvio' : congestionado === 1? 'Atenção - Lento' : 'Fluindo bem - Sustentável';
    setStats({ livre, lento, congestionado, co2, status });
    setCarregando(false);
  }

  useEffect(() => {
    atualizarTrafego();
    const t = setInterval(atualizarTrafego, 60000); // atualiza a cada 1 min
    return () => clearInterval(t);
  }, []);

  const rotasFiltradas = filtro === 'todas'? Object.keys(ROTAS_REAIS) : [filtro];

  return (
    <div style={{ fontFamily: 'Arial', padding: 5 }}>
      <h3 style={{ textAlign: 'center', margin: '5px 0' }}>Cidades Inteligentes - Salvador</h3>
      <p style={{ textAlign: 'center', margin: '5px 0', fontSize: 14 }}>
        <span style={{ color: '#16a34a' }}>● Verde=livre</span> <span style={{ color: '#f59e0b' }}>● Amarelo=moderado</span> <span style={{ color: '#dc2626' }}>● Vermelho=engarrafado</span>
        {carregando && ' | Atualizando...'}
      </p>

      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <button onClick={() => setFiltro('todas')} style={{ margin: 3, padding: '5px 10px', background: filtro === 'todas'? '#111' : '#eee', color: filtro === 'todas'? '#fff' : '#000' }}>Todas</button>
        <button onClick={() => setFiltro('orla')} style={{ margin: 3, padding: '5px 10px', background: filtro === 'orla'? '#111' : '#eee', color: filtro === 'orla'? '#fff' : '#000' }}>Livres</button>
        <button onClick={() => setFiltro('paralela')} style={{ margin: 3, padding: '5px 10px', background: filtro === 'paralela'? '#111' : '#eee', color: filtro === 'paralela'? '#fff' : '#000' }}>Engarrafadas</button>
        <button onClick={atualizarTrafego} style={{ marginLeft: 8 }}>🔄</button>
      </div>

      {/* PAINEL SUSTENTABILIDADE EM TEMPO REAL */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <div style={{ border: '1px solid #16a34a', padding: '6px 10px', borderRadius: 6, background: '#f0fdf4', fontSize: 13 }}>✅ Livres: <b>{stats.livre}</b></div>
        <div style={{ border: '1px solid #f59e0b', padding: '6px 10px', borderRadius: 6, background: '#fffbeb', fontSize: 13 }}>⚠️ Lentos: <b>{stats.lento}</b></div>
        <div style={{ border: '1px solid #dc2626', padding: '6px 10px', borderRadius: 6, background: '#fef2f2', fontSize: 13 }}>🚗 Engarrafados: <b>{stats.congestionado}</b></div>
        <div style={{ border: '2px solid #16a34a', padding: '6px 10px', borderRadius: 6, background: '#dcfce7', fontSize: 13 }}>🌱 CO₂/h: <b>{stats.co2} kg</b> | {stats.status}</div>
      </div>

      <MapContainer center={[-12.93, -38.45]} zoom={11} style={{ height: '60vh', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <AjustarMapa coords={todasCoords} />
        {rotasFiltradas.map(id => (
          <Polyline key={id} positions={ROTAS_REAIS[id].coords} color={cores[id]} weight={7} opacity={0.9}>
            <Tooltip>{ROTAS_REAIS[id].label} - {cores[id] === '#16a34a'? 'livre' : cores[id] === '#f59e0b'? 'moderado' : 'engarrafado'}</Tooltip>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
}
