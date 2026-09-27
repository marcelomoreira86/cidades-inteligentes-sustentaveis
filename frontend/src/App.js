import { useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function App() {
  const rotas = [
    { nome: 'Suburbana', coords: [[-12.97, -38.51], [-12.945, -38.504], [-12.92, -38.495], [-12.895, -38.482], [-12.87, -38.47], [-12.845, -38.455]], status: 'livre' },
    
    // ORLA - 100% pela praia, Barra -> Itapuã
    { nome: 'Orla - Barra a Itapuã', coords: [[-13.0105,-38.5335],[-13.0075,-38.5260],[-13.0045,-38.5180],[-13.0020,-38.5085],[-12.9995,-38.4985],[-12.9965,-38.4890],[-12.9930,-38.4785],[-12.9885,-38.4670],[-12.9840,-38.4555],[-12.9790,-38.4440],[-12.9745,-38.4325],[-12.9690,-38.4210],[-12.9640,-38.4100],[-12.9585,-38.3980],[-12.9530,-38.3860],[-12.9470,-38.3740],[-12.9410,-38.3620],[-12.9350,-38.3500],[-12.9290,-38.3380],[-12.9230,-38.3260],[-12.9170,-38.3140],[-12.9110,-38.3020]], status: 'livre' },
    
    // PARALELA - Agora em cima da Av. Luiz Viana Filho
    { nome: 'Av. Paralela - Luiz Viana Filho', coords: [[-12.9815,-38.4645],[-12.9750,-38.4520],[-12.9655,-38.4355],[-12.9550,-38.4190],[-12.9455,-38.4035],[-12.9360,-38.3890],[-12.9265,-38.3730],[-12.9170,-38.3570],[-12.9075,-38.3420],[-12.8980,-38.3280],[-12.8895,-38.3140]], status: 'congestionado' },
  ];

  const [filtro, setFiltro] = useState('todas');
  const filtradas = filtro === 'todas' ? rotas : rotas.filter(r => r.status === filtro);
  const cor = (s) => s === 'livre' ? '#16a34a' : '#dc2626';

  return (
    <div style={{ padding: '10px', fontFamily: 'Arial' }}>
      <h2>Cidades Inteligentes - Salvador</h2>
      <p>Legenda: <span style={{color: '#16a34a'}}>● Verde=livre</span> <span style={{color: '#dc2626'}}>● Vermelho=engarrafado (Paralela)</span></p>
      <div style={{marginBottom:10}}><button onClick={()=>setFiltro('todas')}>Todas</button><button onClick={()=>setFiltro('livre')} style={{marginLeft:5}}>Livres</button><button onClick={()=>setFiltro('congestionado')} style={{marginLeft:5}}>Paralela</button></div>
      <MapContainer center={[-12.95, -38.42]} zoom={11.5} style={{ height: '75vh', width: '100%', borderRadius: '12px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filtradas.map((r,i)=><Polyline key={i} positions={r.coords} color={cor(r.status)} weight={7} opacity={0.9} />)}
      </MapContainer>
    </div>
  );
}
export default App;
