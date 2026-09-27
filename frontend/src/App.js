import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchRoadGeometry, fetchFlowColor, midpoint } from './trafficService';

// ⚠️ Cole aqui sua chave GRATUITA da TomTom (developer.tomtom.com -> plano Freemium)
const TOMTOM_API_KEY = 'eMaHo8a9Dyf4xzmYt0E8FRDjaTAhU24S';

// Cada grupo busca a via real no OpenStreetMap pelo nome (regex).
// Se algum trecho não aparecer, confira como ele está grafado no OpenStreetMap
// (openstreetmap.org) e ajuste o regex.
const ROUTE_GROUPS = [
  {
    id: 'suburbana',
    label: 'Cidade Baixa / Suburbana (até Periperi)',
    nameRegex: 'Avenida Afrânio Peixoto|Suburbana',
  },
  {
    id: 'orla',
    label: 'Orla (Oceânica + Otávio Mangabeira)',
    nameRegex: 'Avenida Oceânica|Otávio Mangabeira|Avenida Presidente Vargas',
  },
  {
    id: 'paralela',
    label: 'Av. Luiz Viana Filho (Paralela)',
    nameRegex: 'Luiz Viana Filho|Paralela',
  },
];

const REFRESH_MS = 3 * 60 * 1000; // atualiza o trânsito a cada 3 minutos

function App() {
  const [ways, setWays] = useState({}); // { groupId: [{id, coords, color}] }
  const [ativos, setAtivos] = useState(ROUTE_GROUPS.map((g) => g.id));
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // 1) Busca a geometria real das vias uma única vez (OpenStreetMap)
  useEffect(() => {
    let cancelado = false;

    async function carregarGeometrias() {
      setCarregando(true);
      try {
        const resultado = {};
        for (const grupo of ROUTE_GROUPS) {
          const trechos = await fetchRoadGeometry(grupo.nameRegex);
          resultado[grupo.id] = trechos.map((t) => ({ ...t, color: '#9ca3af' }));
        }
        if (!cancelado) setWays(resultado);
      } catch (e) {
        if (!cancelado) setErro('Não foi possível carregar as vias do OpenStreetMap.');
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregarGeometrias();
    return () => {
      cancelado = true;
    };
  }, []);

  // 2) Atualiza o status de tráfego (TomTom) periodicamente
  const atualizarTrafego = useCallback(async () => {
    if (!TOMTOM_API_KEY || TOMTOM_API_KEY === 'SUA_CHAVE_AQUI') return;

    for (const grupo of ROUTE_GROUPS) {
      const trechos = ways[grupo.id];
      if (!trechos) continue;

      for (const trecho of trechos) {
        const [lat, lon] = midpoint(trecho.coords);
        const cor = await fetchFlowColor(lat, lon, TOMTOM_API_KEY);
        setWays((atual) => ({
          ...atual,
          [grupo.id]: atual[grupo.id].map((t) =>
            t.id === trecho.id ? { ...t, color: cor } : t
          ),
        }));
        // pequena pausa entre chamadas pra não estourar a cota gratuita
        await new Promise((r) => setTimeout(r, 150));
      }
    }
  }, [ways]);

  useEffect(() => {
    if (Object.keys(ways).length === 0) return;
    atualizarTrafego();
    const intervalo = setInterval(atualizarTrafego, REFRESH_MS);
    return () => clearInterval(intervalo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(ways).length]);

  const toggleGrupo = (id) => {
    setAtivos((atual) =>
      atual.includes(id) ? atual.filter((g) => g !== id) : [...atual, id]
    );
  };

  return (
    <div style={{ padding: '10px', fontFamily: 'Arial' }}>
      <h2>Cidades Inteligentes - Salvador</h2>
      <p>
        <span style={{ color: '#16a34a' }}>● Livre</span>{' '}
        <span style={{ color: '#f59e0b' }}>● Lento</span>{' '}
        <span style={{ color: '#dc2626' }}>● Congestionado</span>{' '}
        <span style={{ color: '#9ca3af' }}>● Sem dado</span>
      </p>

      {!TOMTOM_API_KEY || TOMTOM_API_KEY === 'SUA_CHAVE_AQUI' ? (
        <p style={{ color: '#b91c1c' }}>
          Cole sua chave gratuita da TomTom no topo do arquivo para ativar o tráfego em tempo real.
        </p>
      ) : null}
      {erro && <p style={{ color: '#b91c1c' }}>{erro}</p>}
      {carregando && <p>Carregando traçado real das vias...</p>}

      <div style={{ marginBottom: 10 }}>
        {ROUTE_GROUPS.map((g) => (
          <button
            key={g.id}
            onClick={() => toggleGrupo(g.id)}
            style={{ marginRight: 5, opacity: ativos.includes(g.id) ? 1 : 0.4 }}
          >
            {g.label}
          </button>
        ))}
      </div>

      <MapContainer
        center={[-12.93, -38.4]}
        zoom={12}
        zoomSnap={0.1}
        style={{ height: '80vh', width: '100%', borderRadius: '12px' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {ROUTE_GROUPS.filter((g) => ativos.includes(g.id)).map((g) =>
          (ways[g.id] || []).map((trecho) => (
            <Polyline
              key={trecho.id}
              positions={trecho.coords}
              pathOptions={{ color: trecho.color, weight: 6 }}
            />
          ))
        )}
      </MapContainer>
    </div>
  );
}

export default App;
