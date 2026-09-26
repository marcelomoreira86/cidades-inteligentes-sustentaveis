import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
function App() {
  const orla = [[-13.01,-38.533],[-13.008,-38.528],[-13.006,-38.523],[-13.004,-38.518],[-13.002,-38.513],[-13.0,-38.508],[-12.998,-38.503],[-12.996,-38.498],[-12.994,-38.492],[-12.992,-38.486],[-12.99,-38.48],[-12.988,-38.474],[-12.986,-38.468],[-12.984,-38.462],[-12.982,-38.456],[-12.98,-38.45],[-12.978,-38.444],[-12.976,-38.438],[-12.974,-38.432],[-12.972,-38.426],[-12.97,-38.42],[-12.968,-38.414],[-12.966,-38.408],[-12.964,-38.402],[-12.962,-38.396],[-12.96,-38.39],[-12.958,-38.384],[-12.956,-38.378]];
  const suburbana = [[-12.97,-38.51],[-12.945,-38.504],[-12.92,-38.495],[-12.895,-38.482],[-12.87,-38.47],[-12.845,-38.455]];
  return (
    <div style={{padding:'10px'}}>
      <h2>Cidades Inteligentes - Salvador</h2>
      <MapContainer center={[-12.96,-38.46]} zoom={11} style={{height:'80vh',width:'100%'}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={orla} color="green" weight={6} />
        <Polyline positions={suburbana} color="green" weight={6} />
      </MapContainer>
    </div>
  );
}
export default App;