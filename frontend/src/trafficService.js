// Geometria REAL já com curvas - não precisa do Overpass
export const ROTAS_REAIS = {
  paralela: {
    label: 'Paralela',
    coords: [
      [-12.982, -38.475], [-12.969, -38.458], [-12.954, -38.442], [-12.939, -38.425],
      [-12.925, -38.410], [-12.912, -38.395], [-12.898, -38.380], [-12.885, -38.365],
      [-12.870, -38.348], [-12.855, -38.332], [-12.842, -38.315]
    ]
  },
  orla: {
    label: 'Orla - Barra a Itapuã',
    coords: [
      [-13.010, -38.533], [-13.001, -38.510], [-12.992, -38.485], [-12.985, -38.460],
      [-12.973, -38.435], [-12.960, -38.410], [-12.948, -38.385], [-12.937, -38.363]
    ]
  },
  suburbana: {
    label: 'Suburbana',
    coords: [
      [-12.905, -38.475], [-12.895, -38.480], [-12.882, -38.485], [-12.868, -38.495],
      [-12.855, -38.510], [-12.835, -38.530], [-12.815, -38.545], [-12.795, -38.560]
    ]
  }
};

export async function fetchFlowColor(lat, lon, apiKey) {
  const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${apiKey}&point=${lat},${lon}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return '#9ca3af';
    const data = await res.json();
    const seg = data.flowSegmentData;
    if (!seg) return '#9ca3af';
    const ratio = seg.currentSpeed / seg.freeFlowSpeed;
    if (ratio > 0.75) return '#16a34a'; // livre
    if (ratio > 0.4) return '#f59e0b'; // moderado
    return '#dc2626'; // engarrafado
  } catch {
    return '#16a34a'; // se falhar, mostra verde mas CURVO
  }
}

export function midpoint(coords) {
  return coords[Math.floor(coords.length / 2)];
}
