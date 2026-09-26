import { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const rotas = [
    // PARALELA
    { nome: 'Av. Paralela', coords: [[-12.908, -38.322], [-12.945, -38.39], [-12.98, -38.46]], status: 'congestionado', co2: '4.2 kg' },
    // ACM
    { nome: 'Av. ACM', coords: [[-12.96, -38.48], [-12.978, -38.491], [-12.995, -38.47]], status: 'moderado', co2: '2.1 kg' },
    { nome: 'Bonocô', coords: [[-12.956, -38.481], [-12.965, -38.485], [-12.978, -38.491]], status: 'moderado', co2: '2.5 kg' },
    // SUBURBANA - agora curta e certa
    { nome: 'Suburbana Norte', coords: [[-12.86, -38.485], [-12.89, -38.49]], status: 'livre', co2: '1.2 kg' },
    { nome: 'Suburbana Sul', coords: [[-12.895, -38.49], [-12.924, -38.508], [-12.94, -38.51]], status: 'livre', co2: '1.0 kg' },
    // ORLA - coladinha na praia
    { nome: 'Orla Itapuã', coords: [[-12.946, -38.362], [-12.978, -38.395], [-12.988, -38.415]], status: 'livre', co2: '0.9 kg' },
    { nome: 'Orla Pituba', coords: [[-12.988, -38.415], [-12.999, -38.44], [-13.009, -38.465]], status: 'livre', co2: '0.8 kg' },
    { nome: 'Orla Barra', coords: [[-13.009, -38.465], [-13.012, -38.50], [-13.005, -38.53]], status: 'moderado', co2: '1.5 kg' },
    // CENTRO
    { nome: 'Centro', coords: [[-12.971, -38.512], [-12.978, -38.511]], status: 'congestionado', co2: '3.8 kg' },
    { nome: 'Garibaldi', coords: [[-13.002, -38.514], [-12.988, -38.503]], status: 'moderado', co2: '2.0 kg' },
  ];

  const [filtro, setFiltro] = useState('todas');
  const filtradas = filtro === 'todas' ? rotas : rotas.filter(r => r.status === filtro);
  const cor = (s) => s === 'livre' ? '#16a34a' : s === 'moderado' ? '#f59e0b' : '#dc2626';

  return (
    <div style={{ fontFamily: 'Arial', padding: '10px' }}>
      <h2>Cidades Inteligentes - Salvador</h2>
      <p>Legenda: <span style={{color: '#16a34a'}}>● Verde=livre</span> <span style={{color: '#f59e0b'}}>● Amarelo=moderado</span> <span style={{color: '#dc2626'}}>● Vermelho=engarrafado</span></p>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setFiltro('todas')}>Todas ({rotas.length})</button>
        <button onClick={() => setFiltro('livre')} style={{marginLeft:5}}>Livres</button>
        <button onClick={() => setFiltro('moderado')} style={{marginLeft:5}}>Moderadas</button>
        <button onClick={() => setFiltro('congestionado')} style={{marginLeft:5}}>Engarrafadas</button>
      </div>
      <MapContainer center={[-12.97, -38.51]} zoom={11.5} style={{ height: '75vh', width: '100%', borderRadius: '12px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filtradas.map((r, i) => (
          <Polyline key={i} positions={r.coords} color={cor(r.status)} weight={6} opacity={0.9}>
            <Popup><b>{r.nome}</b><br/>Status: {r.status}<br/>CO2: {r.co2}</Popup>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
}
export default App;