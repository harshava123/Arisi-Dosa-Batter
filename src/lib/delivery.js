export const DELIVERY_ORIGIN = { lat: 52.53517, lon: 13.19977, label: 'Rathaus Spandau' }
export const DELIVERY_TIERS = [
  { maxKm: 5, fee: 1 },
  { maxKm: 10, fee: 2 },
]
export const MAX_DELIVERY_KM = DELIVERY_TIERS[DELIVERY_TIERS.length - 1].maxKm

export const deliveryFee = (km) => DELIVERY_TIERS.find((t) => km <= t.maxKm)?.fee ?? null

// Public OSRM servers (fair-use, no key). The second is only tried if the first fails.
const ROUTERS = ['https://routing.openstreetmap.de/routed-car', 'https://router.project-osrm.org']

export async function roadDistanceKm(from, to, signal) {
  for (const base of ROUTERS) {
    try {
      const res = await fetch(`${base}/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=false`, { signal })
      if (!res.ok) continue
      const data = await res.json()
      if (data.code === 'Ok' && data.routes?.length) return data.routes[0].distance / 1000
    } catch (err) {
      if (err.name === 'AbortError') throw err
    }
  }
  throw new Error('Routing failed')
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
  const km = Math.round((await roadDistanceKm(DELIVERY_ORIGIN, place, signal)) * 10) / 10
  const fee = deliveryFee(km)
  return fee === null ? { state: 'too-far', km, label: place.label } : { state: 'ok', km, fee, label: place.label }
}
