import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function App() {
  const [transito, setTransito] = useState([]);
  const [filtro, setFiltro] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  // PASSO 1: axios retorna uma Promise
  useEffect(() => {
    axios.get('http://localhost:3000/api/transito')
      .then(res => {
        setTransito(res.data);
        setLoading(false);
      })
      .catch(() => {
        // fallback se o backend estiver offline
        setTransito([
          { id: 1, rua: "Av. Paulista", status: "Congestionado", lat: -23.561, lng: -46.656, velocidade: 10 },
          { id: 2, rua: "Av. Brasil", status: "Lento", lat: -23.550, lng: -46.633, velocidade: 35 },
          { id: 3, rua: "Rua Augusta", status: "Livre", lat: -23.555, lng: -46.658, velocidade: 60 },
        ]);
        setLoading(false);
      });
  }, []);

  const calcularCO2 = (status, vel) => {
    if (status === 'Congestionado') return (180 - vel).toFixed(1);
    if (status === 'Lento') return (100 - vel * 0.5).toFixed(1);
    return "45.0";
  };

  // Otimização: useMemo = mesma ideia do FlatList, só calcula quando muda
  const filtrados = useMemo(() => {
    return transito.filter(d => {
      const passaFiltro = filtro === 'Todos' || d.status === filtro;
      const passaBusca = d.rua.toLowerCase().includes(busca.toLowerCase());
      return passaFiltro && passaBusca;
    });
  }, [transito, filtro, busca]);

  // renderItem da web - como cada item será renderizado na lista
  const renderItem = (item) => (
    <div key={item.id} style={{padding:'10px', margin:'5px 0', borderRadius:'8px', background: item.status==='Congestionado'?'#fee2e2': item.status==='Lento'?'#fef3c7':'#d1fae5'}}>
      <b>{item.rua}</b> - {item.status} | CO2: {calcularCO2(item.status, item.velocidade)} g/km
    </div>
  );

  if (loading) return <div style={{padding:20}}>Carregando tráfego...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🌿 Cidades Inteligentes e Sustentáveis</h1>
      <p>Dashboard em tempo real - {filtrados.length} vias monitoradas</p>
      
      <input placeholder="Buscar rua..." value={busca} onChange={e=>setBusca(e.target.value)} style={{padding: '8px', marginRight: '10px', borderRadius:'6px'}} />
      <select value={filtro} onChange={e=>setFiltro(e.target.value)} style={{padding: '8px', borderRadius:'6px'}}>
        <option>Todos</option><option>Livre</option><option>Lento</option><option>Congestionado</option>
      </select>

      <MapContainer center={[-23.555, -46.656]} zoom={13} style={{ height: '400px', width: '100%', borderRadius: '12px', marginTop:'15px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filtrados.map(p => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <b>{p.rua}</b><br/>
              Status: {p.status}<br/>
              <b style={{color: p.status==='Congestionado'?'red':'green'}}>♻️ CO2: {calcularCO2(p.status, p.velocidade)} g/km</b>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <h3 style={{marginTop:'20px'}}>Lista detalhada (renderItem)</h3>
      {filtrados.map(renderItem)}
    </div>
  );
}

export default App;
