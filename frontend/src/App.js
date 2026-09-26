import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';

function App() {
  const [rotas, setRotas] = useState([]);
  
  useEffect(() => {
    setRotas([
      { id: 1, nome: 'Rua Livre', coords: [[-12.97, -38.5], [-12.98, -38.51]], status: 'livre', co2: 0.5 },
      { id: 2, nome: 'Av Congestionada', coords: [[-12.96, -38.49], [-12.97, -38.5]], status: 'congestionado', co2: 1.8 }
    ]);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>🌿 Cidades Inteligentes</h1>
      <p>Mapa funcionando! Verde = livre, Vermelho = congestionado</p>
      <MapContainer center={[-12.97, -38.51]} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
        {rotas.map(r => (
          <Polyline key={r.id} positions={r.coords} color={r.status === 'congestionado' ? 'red' : 'green'} weight={6}>
            <Popup><b>{r.nome}</b><br/>CO2: {r.co2}kg<br/>{r.status}</Popup>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
}
export default App;