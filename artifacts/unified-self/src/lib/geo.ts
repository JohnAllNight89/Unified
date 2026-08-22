// Geocoding + UTC-offset helpers for the astrology chart pages (the free
// /discover calculator and the paid Portal chart pages all share this).

export async function geocodePlace(place: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await resp.json();
    if (data && data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    // fall through
  }
  return null;
}

// Resolves lat/lng + a birth date to a UTC offset (hours), via the backend's
// /api/timezone endpoint. Timezone-boundary lookup (the `geo-tz` package)
// reads a local data file via Node's `fs` module, so it can only run
// server-side -- calling it directly from the browser (as this used to do)
// throws on every request and was silently swallowed, leaving every chart
// calculated as if birth time were already UTC. Returns null (rather than a
// bare 0) if the lookup fails, so callers can distinguish "genuinely UTC"
// from "lookup failed" and fall back accordingly.
export async function getUtcOffset(lat: number, lng: number, dateStr: string): Promise<number | null> {
  try {
    const resp = await fetch(`/api/timezone?lat=${lat}&lng=${lng}&date=${dateStr}`, { credentials: "include" });
    if (!resp.ok) return null;
    const data = await resp.json();
    return typeof data.offsetHours === "number" ? data.offsetHours : null;
  } catch {
    return null;
  }
}
