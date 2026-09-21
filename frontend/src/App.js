import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <div>
      <h1 style={{textAlign: 'center', background: '#0d5a36', color: 'white', padding: '20px'}}>
        Capim Grosso - Cidade Inteligente e Sustentável
      </h1>
      <MapContainer center={[-11.38, -40.012]} zoom={14} style={{ height: '600px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[-11.38, -40.012]}>
          <Popup>Centro - Fluxo Livre - Baixo CO2</Popup>
        </Marker>
        <Marker position={[-11.385, -40.015]}>
          <Popup>Rodoviária - Fluxo Lento - Alto CO2</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
export default App;
