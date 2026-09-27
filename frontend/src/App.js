import { useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const rotas = [
    // SUBURBANA / CIDADE BAIXA - 25 pontos colada na Av. Afrânio Peixoto
    { nome: 'Cidade Baixa - Suburbana', coords: [
      [-12.9735,-38.5105],[-12.9660,-38.5080],[-12.9580,-38.5050],[-12.9480,-38.5020],
      [-12.9385,-38.4985],[-12.9285,-38.4950],[-12.9185,-38.4910],[-12.9090,-38.4865],
      [-12.9000,-38.4820],[-12.8915,-38.4775],[-12.8830,-38.4720],[-12.8750,-38.4660],
      [-12.8670,-38.4585],[-12.8590,-38.4490],[-12.8515,-38.4385],[-12.8440,-38.4280],
      [-12.8375,-38.4170],[-12.8310,-38.4060],[-12.8250,-38.3950],[-12.8190,-38.3840]
    ], status: 'livre' },

    // ORLA - 35 pontos grudada na praia
    { nome: 'Orla - Barra a Itapuã', coords: [
      [-13.0112,-38.5330],[-13.0085,-38.5255],[-13.0055,-38.5180],[-13.0030,-38.5105],
      [-13.0010,-38.5030],[-12.9985,-38.4955],[-12.9958,-38.4880],[-12.9930,-38.4805],
      [-12.9900,-38.4730],[-12.9865,-38.4650],[-12.9825,-38.4565],[-12.9785,-38.4480],
      [-12.9745,-38.4395],[-12.9700,-38.4310],[-12.9655,-38.4225],[-12.9605,-38.4140],
      [-12.9555,-38.4055],[-12.9505,-38.3970],[-12.9450,-38.3885],[-12.9395,-38.3800],
      [-12.9340,-38.3715],[-12.9285,-38.3630],[-12.9230,-38.3545],[-12.9175,-38.3460],
      [-12.9120,-38.3375],[-12.9065,-38.3290],[-12.9010,-38.3205],[-12.8955,-38.3120],
      [-12.8900,-38.3035],[-12.8845,-38.2950],[-12.8790,-38.2865],[-12.8735,-38.2780],
      [-12.8680,-38.2695],[-12.8625,-38.2610],[-12.8570,-38.2525]
    ], status: 'livre' },

    // PARALELA - 28 pontos em cima da Luiz Viana Filho
    { nome: 'Av. Paralela', coords: [
      [-12.9825,-38.4660],[-12.9785,-38.4595],[-12.9740,-38.4515],[-12.9690,-38.4430],
      [-12.9635,-38.4345],[-12.9580,-38.4260],[-12.9525,-38.4175],[-12.9470,-38.4090],
      [-12.9415,-38.4005],[-12.9360,-38.3920],[-12.9305,-38.3835],[-12.9250,-38.3750],
      [-12.9195,-38.3665],[-12.9140,-38.3580],[-12.9085,-38.3495],[-12.9030,-38.3410],
      [-12.8975,-38.3325],[-12.8920,-38.3240],[-12.8865,-38.3155],[-12.8810,-38.3070],
      [-12.8755,-38.2985],[-12.8700,-38.2900],[-12.8645,-38.2815],[-12.8590,-38.2730],
      [-12.8535,-38.2645],[-12.8480,-38.2560],[-12.8425,-38.2475],[-12.8370,-38.2390]
    ], status: 'congestionado' },
  ];

  const [filtro, setFiltro] = useState('todas');
  const filtradas = filtro === 'todas' ? rotas : rotas.filter(r => r.status === filtro);
  const cor = (s) => s === 'livre' ? '#16a34a' : '#dc2626';

  return (
    <div style={{ padding: '10px', fontFamily: 'Arial' }}>
      <h2>Cidades Inteligentes - Salvador</h2>
      <p>Legenda: <span style={{color: '#16a34a'}}>● Verde=livre</span> <span style={{color: '#dc2626'}}>● Vermelho=Paralela engarrafada</span></p>
      <div style={{marginBottom:10}}>
        <button onClick={()=>setFiltro('todas')}>Todas</button>
        <button onClick={()=>setFiltro('livre')} style={{marginLeft:5}}>Orla + Suburbana</button>
        <button onClick={()=>setFiltro('congestionado')} style={{marginLeft:5}}>Paralela</button>
      </div>
      <MapContainer center={[-12.93, -38.40]} zoom={11.8} style={{ height: '80vh', width: '100%', borderRadius: '12px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filtradas.map((r,i)=><Polyline key={i} positions={r.coords} pathOptions={{color: cor(r.status), weight: 6}} />)}
      </MapContainer>
    </div>
  );
}
export default App;
