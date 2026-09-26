import { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const rotas = [
    { nome: 'Av. Paralela', coords: [[-12.912, -38.345], [-12.932, -38.37], [-12.947, -38.398], [-12.962, -38.42], [-12.975, -38.445], [-12.985, -38.465]], status: 'congestionado', co2: '4.2 kg' },
    { nome: 'Suburbana', coords: [[-12.97, -38.51], [-12.945, -38.504], [-12.92, -38.495], [-12.895, -38.482], [-12.87, -38.47], [-12.845, -38.455]], status: 'livre', co2: '1.2 kg' },
    { 
      nome: 'Orla - Barra até Itapuã',
      coords: [
        [-13.0105, -38.5335],
        [-13.0075, -38.5260],
        [-13.0045, -38.5180],
        [-13.0020, -38.5085],
        [-12.9995, -38.4985],
        [-12.9965, -38.4890],
        [-12.9930, -38.4785],
        [-12.9885, -38.4670],
        [-12.9840, -38.4555],
        [-12.9790, -38.4440],
        [-12.9745, -38.4325],
        [-12.9690, -38.4210],
        [-12.9640, -38.4100],
        [-12.9585, -38.3980],
        [-12.9530, -38.3860],
        [-12.9470, -38.3740],
        [-12.9410, -38.3620],
        [-12.9350, -38.3500],
        [-12.9290, -38.3380],
        [-12.9230, -38.3260],
        [-12.9170, -38.3140],
        [-12.9110, -38.3020]
      ],
      status: 'livre', co2: '0.9 kg'
    },
    { nome: 'ACM', coords: [[-12.96, -38.48], [-12.97, -38.485], [-12.984, -38.49], [-12.995, -38.47]], status: 'moderado', co2: '2.1 kg' },
    { nome: 'Bonocô', coords: [[-12.956, -38.481], [-12.968, -38.487], [-12.978, -38.491]], status: 'moderado', co2: '2.5 kg' },
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
        <button onClick={() => setFiltro('livre')} style={{marginLeft: 5}}>Livres</button>
        <button onClick={() => setFiltro('moderado')} style={{marginLeft: 5}}>Moderadas</button>
        <button onClick={() => setFiltro('congestionado')} style={{marginLeft: 5}}>Engarrafadas</button>
      </div>
      <MapContainer center={[-12.97, -38.46]} zoom={11.5} style={{ height: '75vh', width: '100%', borderRadius: '12px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filtradas.map((r, i) => (
          <Polyline key={i} positions={r.coords} color={cor(r.status)} weight={6} opacity={0.9}>
            <Popup><b>{r.nome}</b><br/>{r.status}<br/>CO2: {r.co2}</Popup>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
}
export default App;
