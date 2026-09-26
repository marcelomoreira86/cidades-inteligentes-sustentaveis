# 🌿 Cidades Inteligentes e Sustentáveis - Salvador

Projeto que usa mapa interativo para monitorar tráfego e reduzir emissão de CO2, alinhado aos ODS da ONU.

**Tecnologias:** React.js + Leaflet + Node.js + OpenStreetMap

**Funcionalidades:**
1.  **Mapa em tempo real:** Mostra a cidade de Salvador com dados reais do OpenStreetMap.
2.  **Filtro de Tráfego:** O sistema classifica as vias por cor:
    *   🟢 Verde = Rua Livre (baixa emissão)
    *   🔴 Vermelho = Congestionada (alta emissão)
3.  **Cálculo de CO2:** Ao clicar na rota, exibe a estimativa de CO2 emitido naquele trecho.
4.  **Rota Ecológica:** O usuário pode escolher o caminho menos poluente.

**Impacto Sustentável:**
O projeto ajuda o cidadão e a prefeitura a evitar engarrafamentos, diminuindo o tempo no trânsito, o consumo de combustível e a poluição do ar.

**Como rodar:**
- `backend`: npm install && node server.js
- `frontend`: npm install && npm start