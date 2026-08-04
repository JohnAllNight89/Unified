/**
 * Thin wrapper around the Swiss Ephemeris WASM module (@fusionstrings/swisseph-wasi).
 *
 * Uses the library's built-in Moshier semi-analytic ephemeris — no external
 * data files required, runs entirely in the browser. Both tropical (Western)
 * and sidereal (Vedic/Lahiri) positions are exposed through the same API.
 *
 * IMPORTANT: this module must stay side-effect-free at import time. The
 * package's `/browser` subpath eagerly runs a *synchronous*
 * `new WebAssembly.Module(...)` compile of a 1.2MB+ binary the instant it's
 * imported — browsers cap synchronous main-thread WASM compilation at a few
 * KB, so that path throws and (because this app bundles into a single JS
 * chunk) takes down the entire site on load. We import the plain `SwissEph`
 * class from the package's main entry instead (no top-level side effects)
 * and do our own async fetch + `WebAssembly.compile` — the async compile API
 * has no such size restriction — only on first actual use.
 */
import { Constants, SwissEph } from "@fusionstrings/swisseph-wasi";
// Vite asset import: resolves to a fetchable URL, not an eager import of the binary.
import wasmUrl from "@fusionstrings/swisseph-wasi/wasm?url";

let ephPromise: Promise<SwissEph> | null = null;

function getEph(): Promise<SwissEph> {
  if (!ephPromise) {
    ephPromise = (async () => {
      const bytes = await (await fetch(wasmUrl)).arrayBuffer();
      const module = await WebAssembly.compile(bytes);
      return new SwissEph(module);
    })();
  }
  return ephPromise;
}

export const BODY_IDS = {
  Sun: Constants.SE_SUN,
  Moon: Constants.SE_MOON,
  Mercury: Constants.SE_MERCURY,
  Venus: Constants.SE_VENUS,
  Mars: Constants.SE_MARS,
  Jupiter: Constants.SE_JUPITER,
  Saturn: Constants.SE_SATURN,
  Uranus: Constants.SE_URANUS,
  Neptune: Constants.SE_NEPTUNE,
  Pluto: Constants.SE_PLUTO,
} as const;

export type BodyName = keyof typeof BODY_IDS;

export interface RawPosition {
  longitude: number;
  retrograde: boolean;
}

/** Julian Day (UT) from a UTC calendar date/time. */
export async function julianDayUT(year: number, month: number, day: number, utcHour: number): Promise<number> {
  const eph = await getEph();
  return eph.swe_julday(year, month, day, utcHour, Constants.SE_GREG_CAL);
}

/** Tropical (Western) longitude + retrograde flag for one body. */
export async function tropicalPosition(jd: number, body: BodyName): Promise<RawPosition> {
  const eph = await getEph();
  const { xx } = eph.swe_calc_ut(jd, BODY_IDS[body], Constants.SEFLG_SPEED | Constants.SEFLG_MOSEPH);
  return { longitude: mod360(xx[0]), retrograde: xx[3] < 0 };
}

/** Sidereal (Vedic, Lahiri ayanamsa) longitude + retrograde flag for one body. */
export async function siderealPosition(jd: number, body: BodyName): Promise<RawPosition> {
  const eph = await getEph();
  eph.swe_set_sid_mode(Constants.SE_SIDM_LAHIRI, 0, 0);
  const { xx } = eph.swe_calc_ut(
    jd,
    BODY_IDS[body],
    Constants.SEFLG_SPEED | Constants.SEFLG_MOSEPH | Constants.SEFLG_SIDEREAL,
  );
  return { longitude: mod360(xx[0]), retrograde: xx[3] < 0 };
}

/** Current Lahiri ayanamsa value (degrees) at a given Julian Day. */
export async function lahiriAyanamsa(jd: number): Promise<number> {
  const eph = await getEph();
  eph.swe_set_sid_mode(Constants.SE_SIDM_LAHIRI, 0, 0);
  return eph.swe_get_ayanamsa_ut(jd);
}

export interface HouseResult {
  /** 12 house cusp longitudes, index 0 = house 1. */
  cusps: number[];
  ascendant: number;
  midheaven: number;
  descendant: number;
  imumCoeli: number;
}

/** Placidus house cusps + angles (Ascendant/MC/Descendant/IC). Tropical. */
export async function houses(jd: number, latDeg: number, lonDeg: number): Promise<HouseResult> {
  const eph = await getEph();
  const { cusps, ascmc } = eph.swe_houses(jd, latDeg, lonDeg, "P".charCodeAt(0));
  const ascendant = mod360(ascmc[0]);
  const midheaven = mod360(ascmc[1]);
  return {
    cusps: Array.from({ length: 12 }, (_, i) => mod360(cusps[i + 1])),
    ascendant,
    midheaven,
    descendant: mod360(ascendant + 180),
    imumCoeli: mod360(midheaven + 180),
  };
}

function mod360(n: number): number {
  return ((n % 360) + 360) % 360;
}
