// Free-calculator Western Astrology chart engine.
//
// Deliberately separate from astro.ts's existing calculateChart(): this is a
// new, additive code path for the free /discover calculator only. The paid
// Astro pages (AstroChart.tsx, AstroInterpretation.tsx, Portal.tsx) keep
// using astro.ts's original hand-rolled math, untouched.
//
// Built on `astronomia` (MIT, pure JS, VSOP87 planetary theory) instead of a
// WASM Swiss Ephemeris binding -- see /root/.claude/plans for the full story
// of why. Verified to build and run cleanly in real headless Chromium before
// this file was written.
import { CalendarGregorianToJD } from "astronomia/julian";
import { apparentVSOP87 } from "astronomia/solar";
import { position as moonPosition } from "astronomia/moonposition";
import { Planet } from "astronomia/planetposition";
import { apparent as apparentSiderealTime } from "astronomia/sidereal";
import { meanObliquity } from "astronomia/nutation";
import { heliocentric as plutoHeliocentric } from "astronomia/pluto";

import vsop87Dearth from "astronomia/data/vsop87Dearth";
import vsop87Dmercury from "astronomia/data/vsop87Dmercury";
import vsop87Dvenus from "astronomia/data/vsop87Dvenus";
import vsop87Dmars from "astronomia/data/vsop87Dmars";
import vsop87Djupiter from "astronomia/data/vsop87Djupiter";
import vsop87Dsaturn from "astronomia/data/vsop87Dsaturn";
import vsop87Duranus from "astronomia/data/vsop87Duranus";
import vsop87Dneptune from "astronomia/data/vsop87Dneptune";

import { SIGNS, SIGN_SYMBOLS, signFromDegree, PLANET_MEANINGS, type PlanetPosition } from "./astro";

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;
function sind(deg: number) { return Math.sin(deg * DEG); }
function cosd(deg: number) { return Math.cos(deg * DEG); }
function tand(deg: number) { return Math.tan(deg * DEG); }
function atan2d(y: number, x: number) { return Math.atan2(y, x) * RAD; }
function mod360(n: number) { return ((n % 360) + 360) % 360; }

// `astronomia`'s bundled VSOP87 data for Uranus and Neptune contains a
// handful of corrupted NaN coefficient rows in their highest-order (T^4)
// periodic terms -- a data-generation artifact in the upstream package. Left
// alone, a single NaN term poisons the entire series sum for that body, and
// `astronomia`'s own Coord constructor (`this._ra = ra || 0`) silently turns
// the resulting NaN longitude into an incorrect 0 (Aries 0 deg) instead of
// erroring, so the corruption goes unnoticed. Strip any non-finite term
// before constructing the Planet -- each affected term's amplitude is
// already near the sub-arcsecond level, so dropping it outright has no
// meaningful effect on accuracy.
function sanitizeVsop87(data: any): any {
  const clean: any = { ...data };
  for (const series of ["L", "B", "R"]) {
    if (!data[series]) continue;
    const cleanSeries: any = {};
    for (const key of Object.keys(data[series])) {
      cleanSeries[key] = data[series][key].filter(
        (term: number[]) => term.every((v) => Number.isFinite(v))
      );
    }
    clean[series] = cleanSeries;
  }
  return clean;
}

// Cache one Planet instance per body across calls -- the VSOP87 series data
// is static, only jde changes per calculation.
const earthPlanet = new Planet(vsop87Dearth);
const VSOP_PLANETS: Record<string, unknown> = {
  Mercury: vsop87Dmercury,
  Venus: vsop87Dvenus,
  Mars: vsop87Dmars,
  Jupiter: vsop87Djupiter,
  Saturn: vsop87Dsaturn,
  Uranus: sanitizeVsop87(vsop87Duranus),
  Neptune: sanitizeVsop87(vsop87Dneptune),
};
const planetInstances: Record<string, any> = {};
for (const [name, data] of Object.entries(VSOP_PLANETS)) {
  planetInstances[name] = new Planet(data);
}

function toXYZ(lonRad: number, latRad: number, range: number): [number, number, number] {
  const cl = Math.cos(lonRad), sl = Math.sin(lonRad);
  const cb = Math.cos(latRad), sb = Math.sin(latRad);
  return [range * cb * cl, range * cb * sl, range * sb];
}

// Geocentric ecliptic longitude via first-order rectangular-coordinate
// subtraction (Meeus ch. 33): no light-time/aberration iteration. That's a
// small refinement (arc-minutes at most) not needed for a free teaser tool,
// and matches the precision level astro.ts's existing hand-rolled math
// already operates at.
function geocentricLongitudeDeg(bodyXYZ: [number, number, number], earthXYZ: [number, number, number]): number {
  const gx = bodyXYZ[0] - earthXYZ[0];
  const gy = bodyXYZ[1] - earthXYZ[1];
  return mod360(atan2d(gy, gx));
}

function makePlanet(name: string, lonDeg: number): PlanetPosition {
  const s = signFromDegree(lonDeg);
  return { planet: name, longitude: lonDeg, ...s };
}

export interface WesternHouseCusp {
  house: number;
  longitude: number;
  sign: string;
  symbol: string;
}

export interface WesternChartResult {
  sun: PlanetPosition;
  moon: PlanetPosition;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
  rising: PlanetPosition | null;
  midheaven: PlanetPosition | null;
  houses: WesternHouseCusp[] | null;
  wheelSvg: string | null;
}

function julianDayUT(birthDate: string, birthTime: string | null | undefined, utcOffsetHours: number): number {
  const [y, m, d] = birthDate.split("-").map(Number);
  let hour = 12;
  if (birthTime) {
    const timePart = birthTime.split(/[+-]\d/)[0].trim();
    const [h, min] = timePart.split(":").map(Number);
    hour = h + (min || 0) / 60;
  }
  const utHour = hour - utcOffsetHours;
  return CalendarGregorianToJD(y, m, d + utHour / 24);
}

export function calculateWesternChart(
  birthDate: string,
  birthTime: string | null | undefined,
  birthLat: number | null,
  birthLng: number | null,
  utcOffsetHours = 0,
): WesternChartResult {
  const jd = julianDayUT(birthDate, birthTime, utcOffsetHours);

  const earthPos = earthPlanet.position(jd);
  const earthXYZ = toXYZ(earthPos.lon, earthPos.lat, earthPos.range);

  const sunCoord = apparentVSOP87(earthPlanet, jd);
  const sun = makePlanet("Sun", mod360(sunCoord.lon * RAD));

  const moonPos = moonPosition(jd);
  const moon = makePlanet("Moon", mod360(moonPos.lon * RAD));

  const planets: Record<string, PlanetPosition> = {};
  for (const name of Object.keys(VSOP_PLANETS)) {
    const pos = planetInstances[name].position(jd);
    const xyz = toXYZ(pos.lon, pos.lat, pos.range);
    planets[name] = makePlanet(name, geocentricLongitudeDeg(xyz, earthXYZ));
  }

  // Pluto: J2000 heliocentric frame, so subtract Earth's own J2000
  // heliocentric position (position2000) rather than the equinox-of-date
  // position used above, keeping both sides of the subtraction consistent.
  const plutoHelio = plutoHeliocentric(jd);
  const earthJ2000 = earthPlanet.position2000(jd);
  const plutoXYZ = toXYZ(plutoHelio.lon, plutoHelio.lat, plutoHelio.range);
  const earthJ2000XYZ = toXYZ(earthJ2000.lon, earthJ2000.lat, earthJ2000.range);
  const pluto = makePlanet("Pluto", geocentricLongitudeDeg(plutoXYZ, earthJ2000XYZ));

  let rising: PlanetPosition | null = null;
  let midheaven: PlanetPosition | null = null;
  let houses: WesternHouseCusp[] | null = null;
  let wheelSvg: string | null = null;

  if (birthTime && birthLat !== null && birthLng !== null) {
    const obliquityDeg = meanObliquity(jd) * RAD;
    const gstSeconds = apparentSiderealTime(jd); // seconds of time, [0, 86400)
    const gstDeg = (gstSeconds / 240) % 360; // 240 = 86400s / 360deg
    const lstDeg = mod360(gstDeg + birthLng);

    const ascDeg = mod360(atan2d(cosd(lstDeg), -sind(lstDeg) * cosd(obliquityDeg) - tand(birthLat) * sind(obliquityDeg)));
    const mcDeg = mod360(atan2d(sind(lstDeg), cosd(lstDeg) * cosd(obliquityDeg)));

    rising = makePlanet("Rising", ascDeg);
    midheaven = makePlanet("Midheaven", mcDeg);

    // Whole Sign houses: house 1 = the Ascendant's whole sign, each
    // subsequent house is the next whole sign in zodiac order.
    const ascSignIdx = Math.floor(ascDeg / 30);
    houses = Array.from({ length: 12 }, (_, i) => {
      const signIdx = (ascSignIdx + i) % 12;
      return {
        house: i + 1,
        longitude: signIdx * 30,
        sign: SIGNS[signIdx],
        symbol: SIGN_SYMBOLS[signIdx],
      };
    });

    wheelSvg = buildWesternWheel({
      ascendant: ascDeg,
      midheaven: mcDeg,
      houses,
      planets: [sun, moon, ...Object.values(planets), pluto],
    });
  }

  return {
    sun,
    moon,
    mercury: planets.Mercury,
    venus: planets.Venus,
    mars: planets.Mars,
    jupiter: planets.Jupiter,
    saturn: planets.Saturn,
    uranus: planets.Uranus,
    neptune: planets.Neptune,
    pluto,
    rising,
    midheaven,
    houses,
    wheelSvg,
  };
}

// One technical one-liner per point type, for the free calculator's results
// list. The plain-English sentence for each point reuses
// PLANET_MEANINGS[planet].signMeanings[sign].teaser, already in astro.ts.
export const WESTERN_TECHNICAL: Record<string, string> = {
  Sun: "Sun — the sign the Sun occupied in the sky at your exact birth moment; your core identity and conscious will.",
  Moon: "Moon — the Moon's position at your birth moment; your emotional instincts and inner needs.",
  Rising: "Rising (Ascendant) — the zodiac sign on the eastern horizon at your exact birth time and place; how you meet the world.",
  Midheaven: "Midheaven (MC) — the highest point of the chart at your birth moment; your public path and vocation.",
  Mercury: "Mercury — the sign Mercury occupied at your birth; how your mind processes and communicates.",
  Venus: "Venus — the sign Venus occupied at your birth; what you're drawn to in love, beauty, and value.",
  Mars: "Mars — the sign Mars occupied at your birth; how you assert yourself and take action.",
  Jupiter: "Jupiter — the sign Jupiter occupied at your birth; where you're built to grow and expand.",
  Saturn: "Saturn — the sign Saturn occupied at your birth; your area of discipline and long-term mastery.",
  Uranus: "Uranus — the sign Uranus occupied at your birth (shared by your generation); where you break convention.",
  Neptune: "Neptune — the sign Neptune occupied at your birth (shared by your generation); your relationship to the unseen.",
  Pluto: "Pluto — the sign Pluto occupied at your birth (shared by your generation); your generation's deepest transformation.",
};

// --- SVG wheel chart -------------------------------------------------------
// Freshly authored for v1: 12 sign wedges, Whole Sign house numbers, the
// ASC/MC/DESC/IC angle markers, and planet glyphs by longitude. No aspect
// lines -- kept deliberately simple.

interface WheelInput {
  ascendant: number;
  midheaven: number;
  houses: WesternHouseCusp[];
  planets: PlanetPosition[];
}

function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  // Chart angle 0 = Aries 0 point, drawn at the 9 o'clock position (like the
  // Ascendant traditionally sits at the left), increasing counter-clockwise
  // to match the zodiac's natural direction as seen from Earth.
  const a = (180 - angleDeg) * DEG;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function buildWesternWheel(input: WheelInput): string {
  const size = 420;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 195;
  const signRingR = 170;
  const houseNumR = 148;
  const planetR = 120;
  const innerR = 60;

  let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Western astrology wheel chart">`;
  svg += `<circle cx="${cx}" cy="${cy}" r="${outerR}" fill="none" stroke="currentColor" stroke-opacity="0.35" />`;
  svg += `<circle cx="${cx}" cy="${cy}" r="${innerR}" fill="none" stroke="currentColor" stroke-opacity="0.35" />`;

  // 12 sign wedge dividers + symbols, fixed at 30-degree zodiac boundaries.
  for (let i = 0; i < 12; i++) {
    const lon = i * 30;
    const [x1, y1] = polar(cx, cy, innerR, lon);
    const [x2, y2] = polar(cx, cy, outerR, lon);
    svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="currentColor" stroke-opacity="0.2" />`;
    const [sx, sy] = polar(cx, cy, signRingR, lon + 15);
    svg += `<text x="${sx.toFixed(1)}" y="${sy.toFixed(1)}" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="currentColor" opacity="0.8">${SIGN_SYMBOLS[i]}</text>`;
  }

  // Whole Sign house numbers, one per sign wedge.
  for (const h of input.houses) {
    const [hx, hy] = polar(cx, cy, houseNumR, h.longitude + 15);
    svg += `<text x="${hx.toFixed(1)}" y="${hy.toFixed(1)}" font-size="10" text-anchor="middle" dominant-baseline="middle" fill="currentColor" opacity="0.5">${h.house}</text>`;
  }

  // ASC / MC / DESC / IC angle markers.
  const angles: [string, number][] = [
    ["ASC", input.ascendant],
    ["MC", input.midheaven],
    ["DESC", mod360(input.ascendant + 180)],
    ["IC", mod360(input.midheaven + 180)],
  ];
  for (const [label, lon] of angles) {
    const [x1, y1] = polar(cx, cy, innerR, lon);
    const [x2, y2] = polar(cx, cy, outerR + 12, lon);
    svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="currentColor" stroke-opacity="0.6" stroke-width="1.5" />`;
    const [lx, ly] = polar(cx, cy, outerR + 22, lon);
    svg += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="9" text-anchor="middle" dominant-baseline="middle" fill="currentColor" opacity="0.7">${label}</text>`;
  }

  // Planet glyphs by longitude.
  for (const p of input.planets) {
    const meaning = PLANET_MEANINGS[p.planet];
    const glyph = meaning?.symbol || p.symbol;
    const [px, py] = polar(cx, cy, planetR, p.longitude);
    svg += `<text x="${px.toFixed(1)}" y="${py.toFixed(1)}" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="currentColor">${glyph}</text>`;
  }

  svg += `</svg>`;
  return svg;
}
