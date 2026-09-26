import { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const rotas = [
    { nome: 'Av. Paralela', coords: [[-12.912, -38.345], [-12.932, -38.37], [-12.947, -38.398], [-12.962, -38.42], [-12.975, -38.445], [-12.985, -38.465]], status: 'congestionado', co2: '4.2 kg' },
    { nome: 'Av. ACM', coords: [[-12.96, -38.48], [-12.97, -38.485], [-12.984, -38.49], [-12.995, -38.47]], status: 'moderado', co2: '2.1 kg' },
    { nome: 'Bonocô', coords: [[-12.956, -38.481], [-12.968, -38.487], [-12.978, -38.491]], status: 'moderado', co2: '2.5 kg' },

    // SUBURBANA - agora seguindo a orla da Baía de Todos os Santos (lado oeste da península)
    {
      nome: 'Suburbana',
      coords: [
        [-12.9718, -38.5117], // Comércio
        [-12.9600, -38.5100], // Calçada
        [-12.9470, -38.5075], // Roma
        [-12.9330, -38.5000], // Boa Vista de Lobato
        [-12.9150, -38.4930], // Lobato
        [-12.8980, -38.4855], // Plataforma
        [-12.8850, -38.4780], // Itacaranha
        [-12.8680, -38.4670], // Periperi
        [-12.8500, -38.4560], // Paripe
        [-12.8320, -38.4430], // Praia Grande
        [-12.8150, -38.4300], // Base Naval
      ],
      status: 'livre',
      co2: '1.2 kg',
    },

    // ORLA - agora seguindo a orla atlântica real, da Barra até Itapuã
    {
      nome: 'Orla - Barra / Itapuã',
      coords: [
        [-13.0103, -38.5326], // Farol da Barra
        [-13.0060, -38.5230], // Porto da Barra
        [-13.0028, -38.5133], // Ondina
        [-12.9958, -38.4959], // Rio Vermelho
        [-12.9890, -38.4802], // Amaralina
        [-12.9836, -38.4630], // Pituba (orla)
        [-12.9727, -38.4459], // Boca do Rio
        [-12.9680, -38.4330], // Armação / Costa Azul
        [-12.9560, -38.4050], // Jaguaribe / Piatã (trecho)
        [-12.9450, -38.3780], // Piatã
        [-12.9330, -38.3480], // Itapuã
      ],
      status: 'livre',
      co2: '0.9 kg',
    },

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
      <MapContainer center={[-12.92, -38.45]} zoom={11.5} style={{ height: '75vh', width: '100%', borderRadius: '12px' }}>
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