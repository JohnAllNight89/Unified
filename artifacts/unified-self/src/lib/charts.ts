/**
 * Western tropical wheel + Vedic North Indian diamond chart generators.
 *
 * Adapted from the user-provided `westernvediccharts.js` (Blueprint Calculator
 * project, templates/index.html) — inline SVG generators, no dependencies.
 * Both functions are pure and return an SVG markup string ready to render via
 * `dangerouslySetInnerHTML`.
 */

// The `_da()` click-to-detail hook is a safe no-op stub, as shipped in the
// source file — no click-detail modal is wired up for v1.
function _da(_obj: Record<string, unknown>): string {
  return "";
}

// ============================================================================
// WESTERN TROPICAL WHEEL
// ============================================================================

export interface WesternWheelInput {
  angles: {
    ascendant: { longitude: number };
    descendant: { longitude: number };
    midheaven: { longitude: number };
    imum_coeli: { longitude: number };
  };
  houses: { house: number; longitude: number }[];
  planets: {
    name: string;
    longitude: number;
    glyph: string;
    sign?: string;
    sign_glyph?: string;
    position?: string;
    retrograde?: boolean;
  }[];
  aspects?: { bodies: [string, string]; aspect: string }[];
}

const ASPECT_COLORS: Record<string, string> = {
  conjunction: "#d4af37", sextile: "#5fb3a3", trine: "#5fb3a3",
  square: "#c15b5b", opposition: "#c15b5b",
};

export function buildWesternWheel(western: WesternWheelInput): string {
  const cx = 300, cy = 300;
  const rZodiacOuter = 280, rZodiacInner = 250, rHouse = 228, rPlanetBase = 195, rAspect = 150;
  const ascLon = western.angles.ascendant.longitude;

  function toXY(lon: number, r: number): [number, number] {
    const rad = (180 - (lon - ascLon)) * Math.PI / 180;
    return [cx + r * Math.cos(rad), cy - r * Math.sin(rad)];
  }
  function angDiff(a: number, b: number): number {
    const d = Math.abs(a - b) % 360;
    return d > 180 ? 360 - d : d;
  }

  let svg = "";
  ([[rZodiacOuter, "#3a3448", 1.5], [rZodiacInner, "#3a3448", 1], [rHouse, "#2a2536", 1], [rAspect, "#2a2536", 1]] as const)
    .forEach(([r, stroke, w]) => {
      svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="${w}"/>`;
    });

  const SIGN_GLYPHS_ORDER = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
  for (let i = 0; i < 12; i++) {
    const lon = i * 30;
    const [x1, y1] = toXY(lon, rZodiacInner), [x2, y2] = toXY(lon, rZodiacOuter);
    svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#4a4458"/>`;
    const [gx, gy] = toXY(lon + 15, (rZodiacOuter + rZodiacInner) / 2);
    svg += `<text x="${gx.toFixed(1)}" y="${gy.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="16" fill="#c9a94f">${SIGN_GLYPHS_ORDER[i]}</text>`;
  }

  const angleLons: Record<string, number> = {
    ASC: western.angles.ascendant.longitude, DSC: western.angles.descendant.longitude,
    MC: western.angles.midheaven.longitude, IC: western.angles.imum_coeli.longitude,
  };

  western.houses.forEach((house) => {
    const isAngular = [1, 4, 7, 10].includes(house.house);
    const [x1, y1] = toXY(house.longitude, rAspect), [x2, y2] = toXY(house.longitude, rHouse);
    svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${isAngular ? '#d4af37' : '#5a5468'}" stroke-width="${isAngular ? 1.5 : 1}"/>`;
  });
  western.houses.forEach((house, i) => {
    const next = western.houses[(i + 1) % 12];
    const span = (next.longitude - house.longitude + 360) % 360;
    const [nx, ny] = toXY(house.longitude + span / 2, rHouse - 16);
    svg += `<text x="${nx.toFixed(1)}" y="${ny.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#6a6478">${house.house}</text>`;
  });

  Object.entries(angleLons).forEach(([label, lon]) => {
    const [lx, ly] = toXY(lon, rZodiacOuter + 16);
    svg += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="10" fill="#d4af37" font-weight="600">${label}</text>`;
  });

  const lonByName: Record<string, number> = {};
  western.planets.forEach((p) => { lonByName[p.name] = p.longitude; });
  (western.aspects || []).forEach((asp) => {
    const [a, b] = asp.bodies;
    if (!(a in lonByName) || !(b in lonByName)) return;
    const [x1, y1] = toXY(lonByName[a], rAspect), [x2, y2] = toXY(lonByName[b], rAspect);
    const color = ASPECT_COLORS[asp.aspect] || "#5a5468";
    svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="0.75" opacity="0.55"/>`;
  });

  const sortedPlanets = [...western.planets].sort((a, b) => a.longitude - b.longitude);
  const placed: { lon: number; radius: number }[] = [];
  let planetMarkup = "";
  sortedPlanets.forEach((planet) => {
    let radius = rPlanetBase, nudges = 0;
    while (nudges < 3 && placed.some((p) => angDiff(p.lon, planet.longitude) < 5 && Math.abs(p.radius - radius) < 22)) {
      radius -= 22;
      nudges++;
    }
    placed.push({ lon: planet.longitude, radius });
    const [x, y] = toXY(planet.longitude, radius);
    const dAttr = _da({ type: "planet", glyph: planet.glyph, name: planet.name, sign: planet.sign, sign_glyph: planet.sign_glyph, position: planet.position, longitude: planet.longitude, retrograde: planet.retrograde, _title: `${planet.name} in ${planet.sign}`, _subtitle: "Western · Tropical Astrology" });
    planetMarkup += `<g ${dAttr} class="cursor-pointer">
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="#1a1626" stroke="${planet.retrograde ? '#c9a94f' : '#7a6fa8'}" stroke-width="1.5"/>
      <text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="13" fill="#e8dfc8">${planet.glyph}</text>
    </g>`;
  });
  svg += planetMarkup;

  return `<svg viewBox="-25 -25 650 650" class="mx-auto w-full max-w-[520px]">${svg}</svg>`;
}

// ============================================================================
// VEDIC NORTH INDIAN (DIAMOND) CHART
// ============================================================================

export interface VedicDiamondInput {
  lagna: { rashi_index: number };
  grahas: {
    rashi_index: number;
    glyph: string;
    name: string;
    rashi?: string;
    sign?: string;
    position?: string;
    nakshatra?: string;
    nakshatra_lord?: string;
    pada?: number;
    retrograde?: boolean;
  }[];
}

const NORTH_INDIAN_HOUSE_ANCHORS: Record<number, [number, number]> = {
  1: [200, 95], 2: [300, 45], 3: [355, 100], 4: [300, 200], 5: [355, 300],
  6: [300, 355], 7: [200, 305], 8: [100, 355], 9: [45, 300], 10: [100, 200],
  11: [45, 100], 12: [100, 45],
};

export function buildVedicNorthIndianChart(vedic: VedicDiamondInput): string {
  const lagnaRashiIdx = vedic.lagna.rashi_index;
  if (lagnaRashiIdx === undefined || lagnaRashiIdx === null) return "";

  const byHouse: Record<number, VedicDiamondInput["grahas"]> = {};
  for (let h = 1; h <= 12; h++) byHouse[h] = [];
  vedic.grahas.forEach((g) => {
    if (g.rashi_index === undefined || g.rashi_index === null) return;
    const house = ((g.rashi_index - lagnaRashiIdx + 12) % 12) + 1;
    byHouse[house].push(g);
  });

  let svg = `<path d="M0,0 L400,0 L400,400 L0,400 Z" fill="none" stroke="#3a3448" stroke-width="1.5"/>`;
  svg += `<path d="M0,0 L400,400 M400,0 L0,400" fill="none" stroke="#3a3448" stroke-width="1"/>`;
  svg += `<path d="M200,0 L400,200 L200,400 L0,200 Z" fill="none" stroke="#3a3448" stroke-width="1"/>`;

  for (let house = 1; house <= 12; house++) {
    const [ax, ay] = NORTH_INDIAN_HOUSE_ANCHORS[house];
    const rashiNum = ((lagnaRashiIdx + house - 1) % 12) + 1;
    svg += `<text x="${ax}" y="${ay - 12}" text-anchor="middle" font-size="11" fill="#5a5468">${rashiNum}</text>`;
    if (house === 1) {
      svg += `<text x="${ax}" y="${ay + 26}" text-anchor="middle" font-size="8" fill="#7a6fa8" letter-spacing="1">LAGNA</text>`;
    }

    const grahasHere = byHouse[house];
    grahasHere.forEach((g, i) => {
      const dAttr = _da({ type: "vedic_graha", glyph: g.glyph, name: g.name, rashi: g.rashi, sign: g.sign, position: g.position, nakshatra: g.nakshatra, nakshatra_lord: g.nakshatra_lord, pada: g.pada, retrograde: g.retrograde, _title: `${g.name} in ${g.rashi}`, _subtitle: "Vedic · Sidereal Astrology" });
      const gx = ax - (grahasHere.length - 1) * 9 + i * 18;
      svg += `<g ${dAttr} class="cursor-pointer">
        <text x="${gx}" y="${ay + 10}" text-anchor="middle" font-size="13" fill="#c9a94f">${g.glyph}</text>
      </g>`;
    });
  }

  return `<svg viewBox="0 0 400 400" class="mx-auto w-full max-w-[380px]">${svg}</svg>`;
}
