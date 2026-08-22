import { Router } from "express";
import { find as findTimeZones } from "geo-tz";

const router = Router();

// Resolves lat/lng + a birth date to a UTC offset (hours), via the IANA
// timezone at that location and the DST rules historically in effect on
// that date. Runs server-side because the underlying `geo-tz` package reads
// a local timezone-boundary file via Node's `fs` module -- it cannot run in
// a browser, which is exactly the bug this endpoint replaces (client code
// used to `await import("geo-tz")` directly and silently fall back to a
// UTC offset of 0 whenever that failed).
router.get("/timezone", (req, res) => {
  const lat = parseFloat(String(req.query.lat));
  const lng = parseFloat(String(req.query.lng));
  const date = String(req.query.date || "");

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "lat, lng, and date (YYYY-MM-DD) query params are required" });
    return;
  }

  try {
    const zones = findTimeZones(lat, lng);
    if (zones.length === 0) {
      res.json({ offsetHours: 0, timezone: null });
      return;
    }
    const ianaTimezone = zones[0];

    // Use noon UTC on the birth date as the reference instant -- safely
    // avoids DST transition ambiguity -- then read that instant's wall
    // clock in the target timezone to derive the offset.
    const [y, mo, d] = date.split("-").map(Number);
    const ref = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: ianaTimezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(ref);
    const get = (type: string) => parseInt(parts.find((p) => p.type === type)?.value ?? "0");
    const hour = get("hour") === 24 ? 0 : get("hour");
    const local = new Date(Date.UTC(get("year"), get("month") - 1, get("day"), hour, get("minute")));
    const offsetHours = (local.getTime() - ref.getTime()) / 3_600_000;

    res.json({ offsetHours, timezone: ianaTimezone });
  } catch (err) {
    req.log.error({ err }, "Timezone lookup failed");
    res.status(500).json({ error: "Timezone lookup failed" });
  }
});

export default router;
