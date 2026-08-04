import { useState } from "react";
import { calculate as calculateNumerology, getMeaning } from "@/lib/numerology";
import {
  calculateChart,
  calculateChartAngles,
  computeUtcOffset,
  PLANET_MEANINGS,
  type ChartResult,
  type PlanetPosition,
} from "@/lib/astro";
import {
  calculateVedicChart,
  LAGNA_MEANINGS,
  SUN_RASHI_MEANINGS,
  MOON_RASHI_MEANINGS,
  NAKSHATRA_MEANINGS,
} from "@/lib/vedic";
import { buildWesternWheel, buildVedicNorthIndianChart } from "@/lib/charts";
import "./calculator-modal.css";

export type CalculatorSystem = "numerology" | "western" | "vedic";

interface CalculatorModalProps {
  system: CalculatorSystem;
  onClose: () => void;
}

const SYSTEM_META: Record<CalculatorSystem, { title: string; eyebrow: string; accent: string }> = {
  numerology: { title: "Numerology Calculator", eyebrow: "See My Numerology", accent: "cm-num" },
  western: { title: "Western Astrology Calculator", eyebrow: "See My Birth Chart", accent: "cm-west" },
  vedic: { title: "Vedic Astrology Calculator", eyebrow: "See My Vedic Chart", accent: "cm-vedic" },
};

const NUMEROLOGY_TECHNICAL: Record<string, string> = {
  lifePath: "Life Path Number — the sum of every digit in your birth date, reduced to a single digit or preserved as a Master Number (11, 22, 33).",
  expression: "Expression Number — the sum of the numeric value of every letter in your full birth name, reduced the same way.",
  soulUrge: "Soul Urge Number — the sum of the vowels in your full birth name only.",
  personality: "Personality Number — the sum of the consonants in your full birth name only.",
  birthDay: "Birth Day Number — the day-of-month you were born, reduced to a single digit or Master Number.",
};

const NUMEROLOGY_LABELS: Record<string, string> = {
  lifePath: "Life Path",
  expression: "Expression",
  soulUrge: "Soul Urge",
  personality: "Personality",
  birthDay: "Birth Day",
};

const PLANET_TECHNICAL: Record<string, string> = {
  Sun: "Sun — the tropical zodiac position of the Sun at your exact moment of birth, governing core identity and life force.",
  Moon: "Moon — the tropical position of the Moon, governing your emotional nature and instinctive responses.",
  Rising: "Ascendant (Rising) — the zodiac degree on the eastern horizon at your exact birth time and location.",
  Mercury: "Mercury — the tropical position of Mercury, governing communication and how you process information.",
  Venus: "Venus — the tropical position of Venus, governing love, beauty, and what you're drawn to.",
  Mars: "Mars — the tropical position of Mars, governing drive, desire, and how you take action.",
  Jupiter: "Jupiter — the tropical position of Jupiter, governing expansion, growth, and abundance.",
  Saturn: "Saturn — the tropical position of Saturn, governing discipline, structure, and your area of mastery.",
  Uranus: "Uranus — the tropical position of Uranus, a generational placement governing innovation and disruption.",
  Neptune: "Neptune — the tropical position of Neptune, a generational placement governing dreams and spirituality.",
  Pluto: "Pluto — the tropical position of Pluto, a generational placement governing transformation and power.",
};

const PLANET_ORDER: (keyof ChartResult)[] = ["sun", "moon", "rising", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];

type FormState = "idle" | "submitting" | "results" | "error";

interface ResultItem {
  label: string;
  technical: string;
  plain: string;
}

async function geocodePlace(place: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } },
    );
    const data = await resp.json();
    if (data && data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    // fall through
  }
  return null;
}

async function resolveUtcOffset(lat: number, lng: number, birthDate: string): Promise<number> {
  try {
    const geotz = await import("geo-tz");
    const zones: string[] = geotz.find(lat, lng);
    if (zones.length > 0) return computeUtcOffset(zones[0], birthDate);
  } catch {
    // fall through
  }
  return 0;
}

export function CalculatorModal({ system, onClose }: CalculatorModalProps) {
  const meta = SYSTEM_META[system];
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [chartSvg, setChartSvg] = useState<string | null>(null);

  const needsPlace = system === "western" || system === "vedic";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("submitting");
    setErrorMsg("");
    setChartSvg(null);

    try {
      if (system === "numerology") {
        if (!fullName.trim() || !birthDate) throw new Error("Please enter your full name and birth date.");
        const nums = calculateNumerology(fullName, birthDate);
        const items: ResultItem[] = (Object.keys(nums) as (keyof typeof nums)[]).map((key) => {
          const value = nums[key];
          const meaning = getMeaning(value);
          return {
            label: `${NUMEROLOGY_LABELS[key]} — ${value}`,
            technical: NUMEROLOGY_TECHNICAL[key],
            plain: meaning.teaser,
          };
        });
        setResults(items);
        setFormState("results");
        return;
      }

      if (!birthDate) throw new Error("Please enter your birth date.");

      let lat: number | null = null, lng: number | null = null, utcOffset = 0;
      if (birthPlace.trim()) {
        const geo = await geocodePlace(birthPlace.trim());
        if (!geo) throw new Error("We couldn't find that location. Try a nearby major city.");
        lat = geo.lat;
        lng = geo.lng;
        if (birthTime) utcOffset = await resolveUtcOffset(lat, lng, birthDate);
      }

      if (system === "western") {
        const chart = calculateChart(birthDate, birthTime || null, lat, lng, utcOffset);
        const items: ResultItem[] = [];
        for (const key of PLANET_ORDER) {
          const pos = chart[key] as PlanetPosition | null;
          if (!pos) continue;
          const info = PLANET_MEANINGS[pos.planet];
          const signMeaning = info?.signMeanings[pos.sign];
          items.push({
            label: `${pos.planet} — ${pos.sign} ${pos.degree}°`,
            technical: PLANET_TECHNICAL[pos.planet] || `${pos.planet} at ${pos.degree}° ${pos.sign}.`,
            plain: signMeaning?.teaser || `${pos.planet} in ${pos.sign}.`,
          });
        }
        setResults(items);

        if (birthTime && lat !== null && lng !== null) {
          const angles = calculateChartAngles(birthDate, birthTime, lat, lng, utcOffset);
          const wheelPlanets = PLANET_ORDER
            .map((key) => chart[key] as PlanetPosition | null)
            .filter((p): p is PlanetPosition => !!p)
            .map((p) => ({ name: p.planet, longitude: p.longitude, glyph: PLANET_MEANINGS[p.planet]?.symbol || "●", sign: p.sign, retrograde: p.retrograde }));
          const wheelHouses = angles.houseCusps.map((longitude, i) => ({ house: i + 1, longitude }));
          setChartSvg(buildWesternWheel({
            angles: {
              ascendant: { longitude: angles.ascendant.longitude },
              descendant: { longitude: angles.descendant.longitude },
              midheaven: { longitude: angles.midheaven.longitude },
              imum_coeli: { longitude: angles.imumCoeli.longitude },
            },
            houses: wheelHouses,
            planets: wheelPlanets,
          }));
        }
        setFormState("results");
        return;
      }

      // vedic
      const chart = calculateVedicChart(birthDate, birthTime || null, lat, lng, utcOffset);
      const items: ResultItem[] = [];
      if (chart.lagna) {
        const m = LAGNA_MEANINGS[chart.lagna.rashiName];
        items.push({ label: `Lagna (Ascendant) — ${chart.lagna.rashiName}`, technical: m.technical, plain: m.plain });
      }
      const sunM = SUN_RASHI_MEANINGS[chart.sun.rashiName];
      items.push({ label: `Sun Rashi — ${chart.sun.rashiName}`, technical: sunM.technical, plain: sunM.plain });
      const moonM = MOON_RASHI_MEANINGS[chart.moon.rashiName];
      items.push({ label: `Moon Rashi — ${chart.moon.rashiName}`, technical: moonM.technical, plain: moonM.plain });
      const nakM = NAKSHATRA_MEANINGS[chart.moon.nakshatra.nakshatraName];
      items.push({
        label: `Moon Nakshatra — ${chart.moon.nakshatra.nakshatraName} (Pada ${chart.moon.nakshatra.pada}, Lord: ${chart.moon.nakshatra.lord})`,
        technical: nakM.technical,
        plain: nakM.plain,
      });
      setResults(items);

      if (chart.lagna) {
        const grahas = [
          { rashi_index: chart.sun.rashiIndex, glyph: "☉", name: "Sun", rashi: chart.sun.rashiName },
          { rashi_index: chart.moon.rashiIndex, glyph: "☽", name: "Moon", rashi: chart.moon.rashiName, nakshatra: chart.moon.nakshatra.nakshatraName, nakshatra_lord: chart.moon.nakshatra.lord, pada: chart.moon.nakshatra.pada },
        ];
        setChartSvg(buildVedicNorthIndianChart({ lagna: { rashi_index: chart.lagna.rashiIndex }, grahas }));
      }
      setFormState("results");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMsg(msg);
      setFormState("error");
    }
  }

  function reset() {
    setFormState("idle");
    setResults([]);
    setChartSvg(null);
    setErrorMsg("");
  }

  return (
    <div className="cm-overlay" role="dialog" aria-modal="true" aria-label={meta.title} onClick={onClose}>
      <div className={`cm-panel ${meta.accent}`} onClick={(e) => e.stopPropagation()}>
        <button className="cm-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="cm-eyebrow">Free Calculator</div>
        <h2 className="cm-title">{meta.title}</h2>

        {(formState === "idle" || formState === "submitting" || formState === "error") && (
          <form className="cm-form" onSubmit={handleSubmit}>
            {system === "numerology" && (
              <div className="cm-field">
                <label className="cm-label" htmlFor="cm-name">Full Birth Name</label>
                <input id="cm-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name at birth" required />
              </div>
            )}
            <div className="cm-field">
              <label className="cm-label" htmlFor="cm-date">Birth Date</label>
              <input id="cm-date" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
            </div>
            {needsPlace && (
              <>
                <div className="cm-field">
                  <label className="cm-label" htmlFor="cm-time">
                    Birth Time <span className="cm-label-opt">(optional — enables Ascendant &amp; chart)</span>
                  </label>
                  <input id="cm-time" type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />
                </div>
                <div className="cm-field">
                  <label className="cm-label" htmlFor="cm-place">
                    Birth Place <span className="cm-label-opt">(city)</span>
                  </label>
                  <input id="cm-place" type="text" value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} placeholder="e.g. Atlanta, GA" />
                </div>
              </>
            )}

            {formState === "error" && <div className="cm-error">{errorMsg}</div>}

            <button type="submit" className="cm-submit" disabled={formState === "submitting"}>
              {formState === "submitting" ? "Calculating…" : "✦   Calculate"}
            </button>
          </form>
        )}

        {formState === "results" && (
          <div className="cm-results">
            {chartSvg && <div className="cm-chart-wrap" dangerouslySetInnerHTML={{ __html: chartSvg }} />}
            <div className="cm-results-list">
              {results.map((r) => (
                <div className="cm-result-item" key={r.label}>
                  <div className="cm-result-label">{r.label}</div>
                  <div className="cm-result-technical">{r.technical}</div>
                  <div className="cm-result-plain">{r.plain}</div>
                </div>
              ))}
            </div>
            <button className="cm-recalc" onClick={reset}>← Calculate Again</button>
          </div>
        )}
      </div>
    </div>
  );
}
