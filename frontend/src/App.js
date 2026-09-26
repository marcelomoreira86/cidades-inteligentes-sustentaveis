import { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const rotas = [
    { nome: 'Av. Paralela', coords: [[-12.912, -38.345], [-12.932, -38.37], [-12.947, -38.398], [-12.962, -38.42], [-12.975, -38.445], [-12.985, -38.465]], status: 'congestionado', co2: '4.2 kg' },
    { nome: 'Av. ACM', coords: [[-12.96, -38.48], [-12.97, -38.485], [-12.984, -38.49], [-12.995, -38.47]], status: 'moderado', co2: '2.1 kg' },
    { nome: 'Bonocô', coords: [[-12.956, -38.481], [-12.968, -38.487], [-12.978, -38.491]], status: 'moderado', co2: '2.5 kg' },
    { nome: 'Suburbana', coords: [[-12.970, -38.510], [-12.945, -38.504], [-12.920, -38.495], [-12.895, -38.482], [-12.870, -38.470], [-12.845, -38.455]], status: 'livre', co2: '1.2 kg' },
    {
      nome: 'Orla - Barra / Itapuã',
      coords: [
        [-13.0100, -38.5300], [-13.0085, -38.5250], [-13.0063, -38.4588], [-13.0040, -38.4520], [-13.0015, -38.4470],
        [-12.9963, -38.4428], [-12.9930, -38.4350], [-12.9900, -38.4280], [-12.9865, -38.4210], [-12.9830, -38.4150],
        [-12.9800, -38.4100], [-12.9770, -38.4050], [-12.9735, -38.4000], [-12.9700, -38.3950], [-12.9687, -38.4076],
        [-12.9650, -38.3920], [-12.9620, -38.3880], [-12.9590, -38.3840], [-12.9560, -38.3800], [-12.9541, -38.3835],
        [-12.9540, -38.3834], [-12.9539, -38.3815], [-12.9515, -38.3770], [-12.9490, -38.3730], [-12.9465, -38.3690],
        [-12.9440, -38.3650], [-12.9415, -38.3610], [-12.9390, -38.3570], [-12.9365, -38.3530], [-12.9340, -38.3490],
        [-12.9315, -38.3450], [-12.9290, -38.3410], [-12.9265, -38.3370], [-12.9240, -38.3330], [-12.9215, -38.3290],
        [-12.9190, -38.3250], [-12.9165, -38.3210], [-12.9140, -38.3170], [-12.9115, -38.3130], [-12.9090, -38.3090],
        [-12.9065, -38.3050], [-12.9040, -38.3010], [-12.9015, -38.2970], [-12.8990, -38.2930], [-12.8965, -38.2890],
        [-12.8940, -38.2850], [-12.8915, -38.2810], [-12.8890, -38.2770], [-12.8865, -38.2730], [-12.8840, -38.2690],
      ],
      status: 'livre', co2: '0.9 kg',
    },
    { nome: 'Centro', coords: [[-12.971, -38.512], [-12.975, -38.514], [-12.978, -38.511]], status: 'congestionado', co2: '3.8 kg' },
    { nome: 'Garibaldi', coords: [[-13.002, -38.514], [-12.996, -38.51], [-12.988, -38.503]], status: 'moderado', co2: '2.0 kg' },
    { nome: 'Centenário / Barra', coords: [[-12.99, -38.505], [-12.998, -38.515], [-13.005, -38.525]], status: 'livre', co2: '1.0 kg' },
  ];
  const [filtro, setFiltro] = useState('todas');
  const filtradas = filtro === 'todas'? rotas : rotas.filter(r => r.status === filtro);
  const cor = (s) => s === 'livre'? '#16a34a' : s === 'moderado'? '#f59e0b' : '#dc2626';
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
      <MapContainer center={[-12.96, -38.46]} zoom={11.5} style={{ height: '75vh', width: '100%', borderRadius: '12px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filtradas.map((r, i) => (
          <Polyline key={i} positions={r.coords} color={cor(r.status)} weight={6} opacity={0.95}>
            <Popup><b>{r.nome}</b><br/>{r.status}<br/>CO2: {r.co2}</Popup>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
}
export default App;