// trafficService.js
// Funções para buscar a geometria REAL das vias (OpenStreetMap / Overpass API)
// e o status de tráfego em tempo real (TomTom Traffic Flow - plano gratuito).

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

// Bounding box aproximado de Salvador + Lauro de Freitas (south,west,north,east).
// Ajuste se precisar cobrir mais área.
const BBOX = '-13.05,-38.55,-12.75,-38.30';

/**
 * Busca no OpenStreetMap todas as vias (ways) cujo nome bate com o regex informado,
 * dentro da área de Salvador. Retorna os trechos já com a geometria real (lat/lng
 * seguindo a rua de verdade), sem precisar digitar coordenada na mão.
 *
 * IMPORTANTE: o resultado vem em vários "ways" separados (a via é cortada em pedaços
 * no OSM). Cada way é desenhado como uma polyline própria — por isso não tentamos
 * concatenar tudo numa linha só, o que evitaria "pulos" entre pontas de trechos
 * que não se conectam na ordem certa.
 */
export async function fetchRoadGeometry(nameRegex) {
  const query = `
    [out:json][timeout:25];
    (
      way["highway"]["name"~"${nameRegex}",i](${BBOX});
    );
    out geom;
  `;

  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: 'data=' + encodeURIComponent(query),
  });

  if (!res.ok) throw new Error('Falha ao consultar OpenStreetMap (Overpass)');

  const data = await res.json();

  return data.elements
    .filter((el) => el.geometry && el.geometry.length > 1)
    .map((el) => ({
      id: el.id,
      name: el.tags?.name || nameRegex,
      coords: el.geometry.map((p) => [p.lat, p.lon]),
    }));
}

/**
 * Consulta a TomTom Flow Segment Data API (plano gratuito) para o ponto informado
 * e retorna a cor do trecho conforme a razão velocidade atual / velocidade livre.
 */
export async function fetchFlowColor(lat, lon, apiKey) {
  const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${apiKey}&point=${lat},${lon}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return '#9ca3af'; // cinza = sem dado
    const data = await res.json();
    const seg = data.flowSegmentData;
    if (!seg || !seg.freeFlowSpeed) return '#9ca3af';

    const ratio = seg.currentSpeed / seg.freeFlowSpeed;
    if (ratio > 0.75) return '#16a34a'; // livre
    if (ratio > 0.4) return '#f59e0b'; // lento
    return '#dc2626'; // congestionado
  } catch {
    return '#9ca3af';
  }
}

/** Ponto aproximado do meio de um trecho, usado para consultar o TomTom. */
export function midpoint(coords) {
  return coords[Math.floor(coords.length / 2)];
}
