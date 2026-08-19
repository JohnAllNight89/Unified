// Geocoding + UTC-offset helpers for the free /discover calculators.
//
// Ported from Portal.tsx's geocodePlace() and AstroChart.tsx's
// computeUtcOffset()/geo-tz pattern rather than importing from those files
// directly, so this new, additive feature can't regress the existing paid
// pages that already use these patterns. Worth deduping into a single
// shared module later; not bundled into this change.

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

// Returns the UTC offset (hours) for an IANA timezone on a given date,
// accounting for the DST rules that were historically in effect on that day.
function computeUtcOffset(ianaTimezone: string, dateStr: string): number {
  const [y, mo, d] = dateStr.split("-").map(Number);
  // Use noon UTC on the birth date — safely avoids DST transition ambiguity
  const ref = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: ianaTimezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(ref);
    const g = (type: string) => parseInt(parts.find(p => p.type === type)?.value ?? "0");
    const h = g("hour") === 24 ? 0 : g("hour");
    const local = new Date(Date.UTC(g("year"), g("month") - 1, g("day"), h, g("minute")));
    return (local.getTime() - ref.getTime()) / 3_600_000;
  } catch {
    return 0;
  }
}

// Resolves lat/lng to a UTC offset (hours) for the given birth date, via the
// IANA timezone at that location. Returns 0 (treated as UTC) if lookup
// fails for any reason — callers already treat a missing/zero offset as
// "best effort" the same way AstroChart.tsx does.
export async function getUtcOffset(lat: number, lng: number, dateStr: string): Promise<number> {
  try {
    const geotz = await import("geo-tz");
    const zones: string[] = geotz.find(lat, lng);
    if (zones.length > 0) return computeUtcOffset(zones[0], dateStr);
  } catch {
    // fall through
  }
  return 0;
}
