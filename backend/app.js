const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
    res.json({ mensagem: 'API Cidades Inteligentes - Capim Grosso funcionando!' });
});

// Rota de dados de mobilidade
app.get('/api/mobilidade', (req, res) => {
    res.json([
        { local: 'Centro - Av. ACM', status: 'Fluindo', velocidade: '40km/h' },
        { local: 'Rodoviária', status: 'Moderado', velocidade: '25km/h' },
        { local: 'Bairro Oliveira', status: 'Fluindo', velocidade: '35km/h' }
    ]);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
