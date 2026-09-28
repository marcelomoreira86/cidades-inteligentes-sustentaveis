import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ROTAS_REAIS, fetchFlowColor, midpoint } from './trafficService';

// ⚠️ Substitua pela SUA chave da TomTom. Não deixe uma chave real commitada
// em repositório público — use variável de ambiente (.env) quando possível.
const TOMTOM_API_KEY = 'oGkRoqCswxDbhToFYUwEuq5LTSDSC8iX';

const COR_LIVRE = '#16a34a';
const COR_LENTO = '#f59e0b';
const COR_ENGARRAFADO = '#dc2626';
const COR_SEM_DADO = '#9ca3af';

const ATUALIZACAO_MS = 3 * 60 * 1000; // 3 min — ajuste conforme sua cota da TomTom

function statusDaCor(cor) {
  if (cor === COR_LIVRE) return 'livre';
  if (cor === COR_LENTO) return 'moderado';
  if (cor === COR_ENGARRAFADO) return 'engarrafado';
  return 'sem dado';
}

export default function App() {
  const [filtro, setFiltro] = useState('todas');
  const [cores, setCores] = useState(
    Object.fromEntries(Object.keys(ROTAS_REAIS).map((id) => [id, COR_SEM_DADO]))
  );
  const [stats, setStats] = useState({ livre: 0, lento: 0, engarrafado: 0, semDado: 0, co2: 0 });

  async function atualizar() {
    const novas = {};
    let livre = 0, lento = 0, eng = 0, semDado = 0;

    for (const id in ROTAS_REAIS) {
      const [lat, lon] = midpoint(ROTAS_REAIS[id].coords);
      const cor = await fetchFlowColor(lat, lon, TOMTOM_API_KEY);
      novas[id] = cor;
      if (cor === COR_LIVRE) livre++;
      else if (cor === COR_LENTO) lento++;
      else if (cor === COR_ENGARRAFADO) eng++;
      else semDado++;
    }

    setCores(novas);
    const co2 = Number((eng * 2.5 + lento * 0.8).toFixed(1));
    setStats({ livre, lento, engarrafado: eng, semDado, co2 });
  }

  useEffect(() => {
    atualizar();
    const t = setInterval(atualizar, ATUALIZACAO_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mostrar =
    filtro === 'todas' ? Object.keys(ROTAS_REAIS)
    : filtro === 'livres' ? Object.keys(ROTAS_REAIS).filter((k) => cores[k] === COR_LIVRE)
    : filtro === 'engarrafadas' ? Object.keys(ROTAS_REAIS).filter((k) => cores[k] === COR_ENGARRAFADO)
    : [filtro];

  return (
    <div style={{ fontFamily: 'Arial' }}>
      <h3 style={{ textAlign: 'center', marginBottom: 2 }}>Cidades Inteligentes - Salvador</h3>
      <p style={{ textAlign: 'center', margin: 2, fontSize: 13 }}>
        ● <span style={{ color: COR_LIVRE }}>Verde=livre</span>{' '}
        ● <span style={{ color: COR_LENTO }}>Amarelo=moderado</span>{' '}
        ● <span style={{ color: COR_ENGARRAFADO }}>Vermelho=engarrafado</span>{' '}
        ● <span style={{ color: COR_SEM_DADO }}>Cinza=sem dado</span>
      </p>

      <div style={{ textAlign: 'center', margin: '6px 0' }}>
        <button onClick={() => setFiltro('todas')} style={{ margin: 2, background: filtro === 'todas' ? 'black' : '#ddd', color: filtro === 'todas' ? 'white' : 'black' }}>Todas</button>
        <button onClick={() => setFiltro('livres')} style={{ margin: 2, background: filtro === 'livres' ? 'black' : '#ddd', color: filtro === 'livres' ? 'white' : 'black' }}>Livres</button>
        <button onClick={() => setFiltro('engarrafadas')} style={{ margin: 2, background: filtro === 'engarrafadas' ? 'black' : '#ddd', color: filtro === 'engarrafadas' ? 'white' : 'black' }}>Engarrafadas</button>
        <button onClick={atualizar} style={{ marginLeft: 6 }}>🔄</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
        <div style={{ border: '1px solid #16a34a', padding: '5px 8px', borderRadius: 6, background: '#eaffea', fontSize: 12 }}>✅ Livres: <b>{stats.livre}</b></div>
        <div style={{ border: '1px solid #f59e0b', padding: '5px 8px', borderRadius: 6, background: '#fff8e1', fontSize: 12 }}>⚠️ Lentos: <b>{stats.lento}</b></div>
        <div style={{ border: '1px solid #dc2626', padding: '5px 8px', borderRadius: 6, background: '#ffe4e6', fontSize: 12 }}>🚗 Engarrafados: <b>{stats.engarrafado}</b></div>
        <div style={{ border: '1px solid #9ca3af', padding: '5px 8px', borderRadius: 6, background: '#f3f4f6', fontSize: 12 }}>❔ Sem dado: <b>{stats.semDado}</b></div>
        <div style={{ border: '2px solid green', padding: '5px 8px', borderRadius: 6, background: '#dcfce7', fontSize: 12 }}>
          🌱 CO₂/h: <b>{stats.co2} kg</b> | {stats.co2 > 5 ? 'Crítico - Sugerir desvio' : 'Sustentável'}
        </div>
      </div>

      <MapContainer center={[-12.92, -38.45]} zoom={11} style={{ height: '65vh', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {mostrar.map((id) => (
          <Polyline key={id} positions={ROTAS_REAIS[id].coords} color={cores[id]} weight={7} opacity={0.9} smoothFactor={1}>
            <Tooltip sticky>{ROTAS_REAIS[id].label}: {statusDaCor(cores[id])}</Tooltip>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
}
