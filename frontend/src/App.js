import { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const rotas = [
    { nome: 'Av. Paralela', coords: [[-12.912, -38.345], [-12.932, -38.37], [-12.947, -38.398], [-12.962, -38.42], [-12.975, -38.445], [-12.985, -38.465]], status: 'congestionado', co2: '4.2 kg' },
    { nome: 'Av. ACM', coords: [[-12.96, -38.48], [-12.97, -38.485], [-12.984, -38.49], [-12.995, -38.47]], status: 'moderado', co2: '2.1 kg' },
    { nome: 'Bonocô', coords: [[-12.956, -38.481], [-12.968, -38.487], [-12.978, -38.491]], status: 'moderado', co2: '2.5 kg' },
    { nome: 'Suburbana', coords: [[-12.87, -38.466], [-12.90, -38.475], [-12.92, -38.487], [-12.94, -38.494], [-12.97, -38.505]], status: 'livre', co2: '1.2 kg' },
    // ORLA - AV. OTÁVIO MANGABEIRA - BEIRANDO CURVA POR CURVA
    { nome: 'Orla - Av. Otávio Mangabeira', coords: [
      [-12.935, -38.358], // Itapuã
      [-12.944, -38.368], // Piatã
      [-12.952, -38.376], // Patamares início
      [-12.960, -38.385], // Patamares meio
      [-12.967, -38.393], // Jaguaribe
      [-12.974, -38.401], // Pituaçu
      [-12.981, -38.410], // Boca do Rio início
      [-12.987, -38.420], // Boca do Rio
      [-12.992, -38.430], // Imbuí / Armação
      [-12.997, -38.440], // Armação
      [-13.002, -38.451], // Costa Azul
      [-13.006, -38.460], // Pituba
      [-13.010, -38.470], // Amaralina início
      [-13.014, -38.482], // Amaralina
      [-13.016, -38.493], // Rio Vermelho início
      [-13.015, -38.503], // Rio Vermelho
      [-13.012, -38.513], // Ondina início
      [-13.008, -38.523], // Ondina
      [-13.004, -38.531], // Barra início
      [-13.010, -38.533]  // Farol da Barra
    ], status: 'livre', co2: '0.9 kg' },
    { nome: 'Centro', coords: [[-12.971, -38.512], [-12.975, -38.514], [-12.978, -38.511]], status: 'congestionado', co2: '3.8 kg' },
    { nome: 'Garibaldi', coords: [[-13.002, -38.514], [-12.996, -38.51], [-12.988, -38.503]], status: 'moderado', co2: '2.0 kg' },
    { nome: 'Centenário / Barra', coords: [[-12.99, -38.505], [-12.998, -38.515], [-13.005, -38.525]], status: 'livre', co2: '1.0 kg' },
  ];

  const [filtro, setFiltro] = useState('todas');
  const filtradas = filtro === 'todas' ? rotas : rotas.filter(r => r.status === filtro);
  const cor = (s) => s === 'livre' ? '#16a34a' : s === 'moderado' ? '#f59e0b' : '#dc2626';

  return (
    <div style={{ fontFamily: 'Arial', padding: '10px' }}>
      <h2>Cidades Inteligentes - Salvador</h2>
      <p>Legenda: <span style={{color: '#16a34a'}}>● Verde=livre</span> <span style={{color: '#f59e0b'}}>● Amarelo=moderado</span> <span style={{color: '#dc2626'}}>● Vermelho=engarrafado</span></p>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setFiltro('todas')}>Todas</button>
        <button onClick={() => setFiltro('livre')} style={{marginLeft:5}}>Livres</button>
        <button onClick={() => setFiltro('moderado')} style={{marginLeft:5}}>Moderadas</button>
        <button onClick={() => setFiltro('congestionado')} style={{marginLeft:5}}>Engarrafadas</button>
      </div>
      <MapContainer center={[-12.97, -38.44]} zoom={12} style={{ height: '75vh', width: '100%', borderRadius: '12px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filtradas.map((r, i) => (
          <Polyline key={i} positions={r.coords} color={cor(r.status)} weight={7} opacity={0.95}>
            <Popup><b>{r.nome}</b><br/>{r.status}<br/>CO2: {r.co2}</Popup>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
}
export default App;