jsx
// App.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const getIcone = (status) => {
let cor;
if (status === 'Congestionado') cor = 'red';
else if (status === 'Lento') cor = 'orange';
else cor = 'green';

return L.divIcon({
className: 'custom-icon',
html: <div style="background-color: ${cor}; width: 10px; height: 10px; border-radius: 50%;"></div>
});
};

function App() {
const [dadosTransito, setDadosTransito] = useState([]);
const [filtro, setFiltro] = useState('Todos');
const [buscaRua, setBuscaRua] = useState('');
const [centroMapa, setCentroMapa] = useState([-23.5489, -46.6388]);

useEffect(() => {
fetch('http://localhost:3000/transito')
.then(res => res.json())
.then(data => setDadosTransito(data.pontos || []));
}, []);

const filtrados = dadosTransito.filter(p =>
(filtro === 'Todos' || p.status === filtro) &&
p.rua.toLowerCase().includes(buscaRua.toLowerCase())
);

const buscarRua = (e) => {
e.preventDefault();
const rua = dadosTransito.find(p => p.rua.toLowerCase().includes(buscaRua.toLowerCase()));
if (rua) setCentroMapa([rua.lat, rua.lng]);
};

return (


<div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, background: 'white', padding: 5 }}>

<input
type="text"
placeholder="Buscar rua..."
value={buscaRua}
onChange={e => setBuscaRua(e.target.value)}
/>
Buscar

<select value={filtro} onChange={e => setFiltro(e.target.value)}>
Todos
Livre
Lento
Congestionado


<MapContainer center={centroMapa} zoom={13} style={{ height: '100vh' }}>

{filtrados.map((ponto, index) => (
<Marker key={index} position={[ponto.lat, ponto.lng]} icon={getIcone(ponto.status)}>

{ponto.rua}

Status: {ponto.status}

Velocidade média: {ponto.velocidade} km/h


))}
<div style={{ position: 'absolute', bottom: 10, left: 10, background: 'white', padding: 5, borderRadius: 5 }}>
Legenda:

<span style={{ color: 'green' }}>● Livre

<span style={{ color: 'orange' }}>● Lento

<span style={{ color: 'red' }}>● Congestionado




);
}
export default App;
