// trafficService.js
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const BBOX = '-13.05,-38.55,-12.75,-38.30';

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
  if (!res.ok) throw new Error('Falha ao consultar OpenStreetMap');
  const data = await res.json();
  return data.elements
    .filter((el) => el.geometry && el.geometry.length > 1)
    .map((el) => ({
      id: el.id,
      name: el.tags?.name || nameRegex,
      coords: el.geometry.map((p) => [p.lat, p.lon]),
    }));
}

export async function fetchFlowColor(lat, lon, apiKey) {
  const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${apiKey}&point=${lat},${lon}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return '#9ca3af';
    const data = await res.json();
    const seg = data.flowSegmentData;
    if (!seg || !seg.freeFlowSpeed) return '#9ca3af';
    const ratio = seg.currentSpeed / seg.freeFlowSpeed;
    if (ratio > 0.75) return '#16a34a';
    if (ratio > 0.4) return '#f59e0b';
    return '#dc2626';
  } catch {
    return '#9ca3af';
  }
}

export function midpoint(coords) {
  return coords[Math.floor(coords.length / 2)];
}
