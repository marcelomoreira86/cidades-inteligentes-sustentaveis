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
            // ORLA - 50 PONTOS CORRIGIDO - SEM ZIGUE-ZAGUE
    {
      nome: 'Orla - Barra / Itapuã',
      coords: [
        [-13.0100, -38.5330], [-13.0080, -38.5280], [-13.0060, -38.5230], [-13.0040, -38.5180], [-13.0020, -38.5130],
        [-13.0000, -38.5080], [-12.9980, -38.5030], [-12.9963, -38.4980], [-12.9940, -38.4920], [-12.9920, -38.4860],
        [-12.9900, -38.4800], [-12.9880, -38.4740], [-12.9860, -38.4680], [-12.9840, -38.4620], [-12.9820, -38.4560],
        [-12.9800, -38.4500], [-12.9780, -38.4440], [-12.9760, -38.4380], [-12.9740, -38.4320], [-12.9720, -38.4260],
        [-12.9700, -38.4200], [-12.9680, -38.4140], [-12.9660, -38.4080], [-12.9640, -38.4020], [-12.9620, -38.3960],
        [-12.9600, -38.3900], [-12.9580, -38.3840], [-12.9560, -38.3780], [-12.9540, -38.3720], [-12.9520, -38.3660],
        [-12.9500, -38.3600], [-12.9480, -38.3540], [-12.9460, -38.3480], [-12.9440, -38.3420], [-12.9420, -38.3360],
        [-12.9400, -38.3300], [-12.9380, -38.3240], [-12.9360, -38.3180], [-12.9340, -38.3120], [-12.9320, -38.3060],
        [-12.9300, -38.3000], [-12.9280, -38.2940], [-12.9260, -38.2880], [-12.9240, -38.2820], [-12.9220, -38.2760],
        [-12.9200, -38.2700], [-12.9180, -38.2640], [-12.9160, -38.2580], [-12.9140, -38.2520], [-12.9120, -38.2460],
      ],
      status: 'livre', co2: '0.9 kg',
    },
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