import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrige ícone do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const dadosIniciais = [
  { id: 1, rua: "Av. Paulista", status: "Congestionado", lat: -23.561, lng: -46.656, velocidade: 10 },
  { id: 2, rua: "Av. Brasil", status: "Lento", lat: -23.550, lng: -46.633, velocidade: 35 },
  { id: 3, rua: "Rua Augusta", status: "Livre", lat: -23.555, lng: -46.658, velocidade: 60 },
];

function App() {
  const [filtro, setFiltro] = useState('Todos');
  const [busca, setBusca] = useState('');

  const calcularCO2 = (status, vel) => {
    if (status === 'Congestionado') return (180 - vel).toFixed(1);
    if (status === 'Lento') return (100 - vel * 0.5).toFixed(1);
    return "45.0";
  };

  const filtrados = dadosIniciais.filter(d => {
    const passaFiltro = filtro === 'Todos' || d.status === filtro;
    const passaBusca = d.rua.toLowerCase().includes(busca.toLowerCase());
    return passaFiltro && passaBusca;
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🌿 Cidades Inteligentes e Sustentáveis</h1>
      <p>Tráfego + Emissão de CO2 em tempo real</p>
      
      <input placeholder="Buscar rua..." value={busca} onChange={e=>setBusca(e.target.value)} style={{padding: '8px', marginRight: '10px'}} />
      <select value={filtro} onChange={e=>setFiltro(e.target.value)} style={{padding: '8px'}}>
        <option>Todos</option><option>Livre</option><option>Lento</option><option>Congestionado</option>
      </select>

      <div style={{display:'flex', gap:'15px', margin: '15px 0'}}>
        <div style={{background: '#d4edda', padding:'10px', borderRadius:'8px'}}>🌱 CO2 Baixo: 45g/km</div>
        <div style={{background: '#fff3cd', padding:'10px', borderRadius:'8px'}}>⚠️ CO2 Médio: 80g/km</div>
        <div style={{background: '#f8d7da', padding:'10px', borderRadius:'8px'}}>🚨 CO2 Alto: 170g/km</div>
      </div>

      <MapContainer center={[-23.555, -46.656]} zoom={13} style={{ height: '500px', width: '100%', borderRadius: '12px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filtrados.map(p => (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <b>{p.rua}</b><br/>
              Status: {p.status}<br/>
              Velocidade: {p.velocidade} km/h<br/>
              <b style={{color: p.status==='Congestionado'?'red':'green'}}>♻️ CO2: {calcularCO2(p.status, p.velocidade)} g/km</b><br/>
              {p.status==='Congestionado' && <span>💡 Sugestão: Usar rota alternativa economiza 60% CO2</span>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
export default App;
