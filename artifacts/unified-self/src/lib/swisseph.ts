/**
 * Thin wrapper around the Swiss Ephemeris WASM module (@fusionstrings/swisseph-wasi).
 *
 * Uses the library's built-in Moshier semi-analytic ephemeris — no external
 * data files required, runs entirely in the browser. Both tropical (Western)
 * and sidereal (Vedic/Lahiri) positions are exposed through the same API.
 */
import { Constants, createSwissEph } from "@fusionstrings/swisseph-wasi/browser";

let ephSingleton: ReturnType<typeof createSwissEph> | null = null;

function getEph() {
  if (!ephSingleton) ephSingleton = createSwissEph();
  return ephSingleton;
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
export function julianDayUT(year: number, month: number, day: number, utcHour: number): number {
  return getEph().swe_julday(year, month, day, utcHour, Constants.SE_GREG_CAL);
}

/** Tropical (Western) longitude + retrograde flag for one body. */
export function tropicalPosition(jd: number, body: BodyName): RawPosition {
  const { xx } = getEph().swe_calc_ut(jd, BODY_IDS[body], Constants.SEFLG_SPEED | Constants.SEFLG_MOSEPH);
  return { longitude: mod360(xx[0]), retrograde: xx[3] < 0 };
}

/** Sidereal (Vedic, Lahiri ayanamsa) longitude + retrograde flag for one body. */
export function siderealPosition(jd: number, body: BodyName): RawPosition {
  const eph = getEph();
  eph.swe_set_sid_mode(Constants.SE_SIDM_LAHIRI, 0, 0);
  const { xx } = eph.swe_calc_ut(
    jd,
    BODY_IDS[body],
    Constants.SEFLG_SPEED | Constants.SEFLG_MOSEPH | Constants.SEFLG_SIDEREAL,
  );
  return { longitude: mod360(xx[0]), retrograde: xx[3] < 0 };
}

/** Current Lahiri ayanamsa value (degrees) at a given Julian Day. */
export function lahiriAyanamsa(jd: number): number {
  const eph = getEph();
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
export function houses(jd: number, latDeg: number, lonDeg: number): HouseResult {
  const { cusps, ascmc } = getEph().swe_houses(jd, latDeg, lonDeg, "P".charCodeAt(0));
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
