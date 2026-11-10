export const DELIVERY_ORIGIN = { lat: 52.53517, lon: 13.19977, label: 'Rathaus Spandau' }
export const DELIVERY_TIERS = [
  { maxKm: 5, fee: 1 },
  { maxKm: 10, fee: 2 },
]
export const MAX_DELIVERY_KM = DELIVERY_TIERS[DELIVERY_TIERS.length - 1].maxKm

export const deliveryFee = (km) => DELIVERY_TIERS.find((t) => km <= t.maxKm)?.fee ?? null

export function distanceKm(a, b) {
  const rad = (d) => (d * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLon = rad(b.lon - a.lon)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}

// OpenStreetMap Nominatim: free, but limited to about one request per second, so callers debounce.
async function search(query, signal) {
  const params = new URLSearchParams({
    format: 'jsonv2',
    limit: '1',
    countrycodes: 'de',
    viewbox: '12.95,52.70,13.80,52.33',
    'accept-language': 'de',
    q: query,
  })
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { signal })
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`)
  const [hit] = await res.json()
  return hit ? { lat: Number(hit.lat), lon: Number(hit.lon), label: hit.display_name } : null
}

export async function geocodeAddress(address, signal) {
  const hit = await search(address, signal)
  if (hit || /berlin|\b\d{5}\b/i.test(address)) return hit
  return search(`${address}, Berlin`, signal)
}

export async function quoteDelivery(address, signal) {
  const place = await geocodeAddress(address, signal)
  if (!place) return { state: 'not-found' }
  const km = Math.round(distanceKm(DELIVERY_ORIGIN, place) * 10) / 10
  const fee = deliveryFee(km)
  return fee === null ? { state: 'too-far', km, label: place.label } : { state: 'ok', km, fee, label: place.label }
}
