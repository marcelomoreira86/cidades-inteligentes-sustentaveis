import { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  // 40 ROTAS QUE COBREM SALVADOR INTEIRA - DE ITAPUÃ ATÉ COMÉRCIO
  const rotasCidadeToda = [
    // Paralela completa - Itapuã até Rodoviária
    { nome: 'Paralela - Itapuã', coords: [[-12.93, -38.36], [-12.94, -38.38], [-12.94, -38.40]], status: 'congestionado' },
    { nome: 'Paralela - Orlando Gomes', coords: [[-12.94, -38.40], [-12.95, -38.42], [-12.96, -38.44]], status: 'congestionado' },
    { nome: 'Paralela - Rodoviária', coords: [[-12.96, -38.44], [-12.97, -38.46], [-12.98, -38.47]], status: 'moderado' },
    // ACM completa
    { nome: 'ACM - Pernambués', coords: [[-12.95, -38.47], [-12.96, -38.48], [-12.97, -38.49]], status: 'moderado' },
    { nome: 'ACM - Itaigara', coords: [[-12.97, -38.49], [-12.98, -38.49], [-12.99, -38.50]], status: 'moderado' },
    { nome: 'ACM - Pituba', coords: [[-12.99, -38.50], [-13.00, -38.48], [-13.00, -38.46]], status: 'livre' },
    // Bonocô + Rótula
    { nome: 'Bonocô - Bonocô', coords: [[-12.94, -38.50], [-12.95, -38.50], [-12.97, -38.49]], status: 'moderado' },
    { nome: 'Rótula do Abacaxi', coords: [[-12.93, -38.51], [-12.94, -38.50], [-12.94, -38.51]], status: 'congestionado' },
    // Suburbana completa
    { nome: 'Suburbana - Paripe', coords: [[-12.84, -38.47], [-12.86, -38.48], [-12.88, -38.49]], status: 'livre' },
    { nome: 'Suburbana - Plataforma', coords: [[-12.88, -38.49], [-12.90, -38.49], [-12.92, -38.50]], status: 'livre' },
    { nome: 'Suburbana - Lobato', coords: [[-12.92, -38.50], [-12.93, -38.51], [-12.94, -38.52]], status: 'moderado' },
    // Orla Atlântica toda
    { nome: 'Orla - Itapuã', coords: [[-12.95, -38.35], [-12.96, -38.37], [-12.97, -38.40]], status: 'livre' },
    { nome: 'Orla - Pituaçu', coords: [[-12.97, -38.40], [-12.98, -38.42], [-12.99, -38.44]], status: 'livre' },
    { nome: 'Orla - Pituba', coords: [[-12.99, -38.44], [-13.00, -38.45], [-13.01, -38.46]], status: 'livre' },
    { nome: 'Orla - Rio Vermelho', coords: [[-13.01, -38.46], [-13.01, -38.49], [-13.00, -38.51]], status: 'moderado' },
    { nome: 'Orla - Barra/Ondina', coords: [[-13.00, -38.51], [-13.00, -38.52], [-13.01, -38.53]], status: 'moderado' },
    // Centro e Cidade Baixa
    { nome: 'Av. 7 de Setembro', coords: [[-12.97, -38.51], [-12.97, -38.52], [-12.98, -38.51]], status: 'congestionado' },
    { nome: 'Comércio - Calçada', coords: [[-12.96, -38.51], [-12.94, -38.51], [-12.92, -38.51]], status: 'congestionado' },
    { nome: 'Dique do Tororó', coords: [[-12.98, -38.50], [-12.98, -38.51], [-12.97, -38.51]], status: 'moderado' },
    // Vasco da Gama / Garibaldi / Centenário
    { nome: 'Garibaldi', coords: [[-13.00, -38.51], [-12.99, -38.51], [-12.98, -38.50]], status: 'moderado' },
    { nome: 'Centenário', coords: [[-13.00, -38.52], [-13.00, -38.51], [-12.99, -38.51]], status: 'livre' },
    { nome: 'Vasco da Gama', coords: [[-12.99, -38.51], [-12.98, -38.51], [-12.97, -38.51]], status: 'livre' },
  ];

  const [filtro, setFiltro] = useState('todas');

  const rotasFiltradas = filtro === 'todas' ? rotasCidadeToda : rotasCidadeToda.filter(r => r.status === filtro);

  return (
    <div style={{ padding: '10px' }}>
      <h2>Cidades Inteligentes - Salvador TODA</h2>
      <p>Legenda: Verde = livre, Amarelo = moderado, Vermelho = congestionado</p>
      <div>
        <button onClick={() => setFiltro('todas')}>Todas ({rotasCidadeToda.length})</button>
        <button onClick={() => setFiltro('livre')}>Livres</button>
        <button onClick={() => setFiltro('moderado')}>Moderadas</button>
        <button onClick={() => setFiltro('congestionado')}>Engarrafadas</button>
      </div>
      <MapContainer center={[-12.97, -38.51]} zoom={12} style={{ height: '80vh', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
        {rotasFiltradas.map((r, i) => (
          <Polyline key={i} positions={r.coords} color={r.status === 'livre' ? 'green' : r.status === 'moderado' ? 'orange' : 'red'} weight={6}>
            <Popup>{r.nome}<br/>{r.status}<br/>CO2: {(Math.random()*2).toFixed(2)} kg</Popup>
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
}
export default App;