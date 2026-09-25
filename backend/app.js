const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Função que calcula CO2 - mesma lógica do front
function calcularCO2(status, vel) {
  if (status === 'Congestionado') return parseFloat((180 - vel).toFixed(1));
  if (status === 'Lento') return parseFloat((100 - vel * 0.5).toFixed(1));
  return 45.0;
}

// Dados reais de Salvador
const transitoSalvador = [
  { id: 1, rua: "Av. Paralela", status: "Congestionado", velocidade: 12, lat: -12.9718, lng: -38.5128 },
  { id: 2, rua: "Av. ACM", status: "Lento", velocidade: 32, lat: -12.9811, lng: -38.4655 },
  { id: 3, rua: "Av. Vasco da Gama", status: "Livre", velocidade: 58, lat: -12.9876, lng: -38.5072 },
  { id: 4, rua: "Av. Sete de Setembro", status: "Lento", velocidade: 28, lat: -12.9711, lng: -38.5120 },
  { id: 5, rua: "Av. Tancredo Neves", status: "Congestionado", velocidade: 8, lat: -12.9815, lng: -38.4529 },
];

app.get('/api/transito', (req, res) => {
  // Adiciona o CO2 calculado pra cada rua
  const comCO2 = transitoSalvador.map(t => ({
    ...t,
    co2: calcularCO2(t.status, t.velocidade)
  }));
  
  // Simula atraso de rede - axios retorna Promise
  setTimeout(() => res.json(comCO2), 500);
});

app.get('/', (req, res) => res.send('API Cidades Inteligentes rodando 🌱'));

app.listen(3001, () => console.log('Backend rodando em http://localhost:3001'));
