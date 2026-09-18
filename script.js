const map = L.map('map').setView([-11.3806, -40.0126], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
L.marker([-11.3806, -40.0126]).addTo(map).bindPopup("<b>Centro - Capim Grosso</b><br>Fluxo moderado").openPopup();
L.marker([-11.3818, -40.0105]).addTo(map).bindPopup("Ponto de Ônibus Inteligente");
L.marker([-11.378, -40.015]).addTo(map).bindPopup("Sensor de Qualidade do Ar - Boa");

// Simulação tempo real
setInterval(()=>{
  const traf = document.getElementById('trafego');
  if(traf){ traf.innerText = Math.random()>0.5 ? "Leve (45 km/h)" : "Moderado (28 km/h)"; }
}, 4000);
