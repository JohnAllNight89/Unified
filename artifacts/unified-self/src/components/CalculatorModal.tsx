import { useEffect, useState } from "react";
import {
  lifePathNumber,
  soulUrgeNumber,
  expressionNumber,
  attitudeNumber,
  personalityNumber,
  getMeaning,
} from "@/lib/numerology";
import { calculateWesternChart, WESTERN_TECHNICAL, type WesternChartResult } from "@/lib/westernChart";
import { PLANET_MEANINGS, type PlanetPosition } from "@/lib/astro";
import { geocodePlace, getUtcOffset } from "@/lib/geo";

type System = "numerology" | "western";
type CalcState = "idle" | "calculating" | "results" | "error";

const NUMEROLOGY_TECHNICAL: Record<string, string> = {
  lifePath: "Life Path — the sum of every digit in your full birth date, reduced to a single digit or preserved as a Master Number (11, 22, 33). The core arc of your life.",
  soulUrge: "Soul Urge — the sum of the vowels in your full birth name. What you want at the deepest level, beneath what you show.",
  expression: "Expression — the sum of every letter in your full birth name. The natural talents and abilities you arrived with.",
  attitude: "Attitude — the sum of your birth month and day. The lens you instinctively view life through, before anyone gets to know you.",
  personality: "Personality — the sum of the consonants in your full birth name. The impression you make before you speak.",
};

const NUMEROLOGY_LABELS: Record<string, string> = {
  lifePath: "Life Path",
  soulUrge: "Soul Urge",
  expression: "Expression",
  attitude: "Attitude",
  personality: "Personality",
};

interface NumerologyResults {
  lifePath: number;
  soulUrge: number;
  expression: number;
  attitude: number;
  personality: number;
}

interface CalculatorModalProps {
  system: System | null;
  onClose: () => void;
}

export function CalculatorModal({ system, onClose }: CalculatorModalProps) {
  const [state, setState] = useState<CalcState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");

  const [numResults, setNumResults] = useState<NumerologyResults | null>(null);
  const [westResults, setWestResults] = useState<WesternChartResult | null>(null);

  useEffect(() => {
    // Reset the form each time a different calculator is opened.
    setState("idle");
    setErrorMsg("");
    setFullName("");
    setBirthDate("");
    setBirthTime("");
    setBirthPlace("");
    setNumResults(null);
    setWestResults(null);
  }, [system]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (!system) return undefined;
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [system, onClose]);

  if (!system) return null;

  const handleNumerologySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !birthDate) return;
    setState("calculating");
    setErrorMsg("");
    try {
      setNumResults({
        lifePath: lifePathNumber(birthDate),
        soulUrge: soulUrgeNumber(fullName),
        expression: expressionNumber(fullName),
        attitude: attitudeNumber(birthDate),
        personality: personalityNumber(fullName),
      });
      setState("results");
    } catch {
      setErrorMsg("Something went wrong calculating your numbers. Please check your inputs and try again.");
      setState("error");
    }
  };

  const handleWesternSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;
    setState("calculating");
    setErrorMsg("");
    try {
      let lat: number | null = null;
      let lng: number | null = null;
      let utcOffset = 0;
      if (birthPlace.trim()) {
        const geo = await geocodePlace(birthPlace.trim());
        if (geo) {
          lat = geo.lat;
          lng = geo.lng;
          if (birthTime) utcOffset = await getUtcOffset(geo.lat, geo.lng, birthDate);
        }
      }
      const result = calculateWesternChart(birthDate, birthTime || null, lat, lng, utcOffset);
      setWestResults(result);
      setState("results");
    } catch {
      setErrorMsg("Something went wrong calculating your chart. Please check your inputs and try again.");
      setState("error");
    }
  };

  const title = system === "numerology" ? "Free Numerology Calculator" : "Free Western Astrology Calculator";

  return (
    <div className="dh-modal-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="dh-modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="dh-modal-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="dh-modal-header">
          <div className="dh-modal-eyebrow">Try It Free</div>
          <h3>{title}</h3>
        </div>

        {state === "results" && system === "numerology" && numResults && (
          <div className="dh-modal-results">
            {(Object.keys(numResults) as (keyof NumerologyResults)[]).map((key) => {
              const value = numResults[key];
              const meaning = getMeaning(value);
              return (
                <div className="dh-result-card" key={key}>
                  <div className="dh-result-head">
                    <span className="dh-result-label">{NUMEROLOGY_LABELS[key]}</span>
                    <span className="dh-result-value">{value}{meaning.title ? ` — ${meaning.title}` : ""}</span>
                  </div>
                  <p className="dh-result-technical">{NUMEROLOGY_TECHNICAL[key]}</p>
                  <p className="dh-result-plain">{meaning.teaser}</p>
                </div>
              );
            })}
            <button className="dh-modal-retry" onClick={() => setState("idle")}>Calculate Another</button>
          </div>
        )}

        {state === "results" && system === "western" && westResults && (
          <div className="dh-modal-results">
            {westResults.wheelSvg && (
              <div className="dh-wheel-container" dangerouslySetInnerHTML={{ __html: westResults.wheelSvg }} />
            )}
            {WesternPointList(westResults)}
            {!westResults.rising && (
              <p className="dh-modal-note">Add your exact birth time and place above to see your Rising sign, Midheaven, houses, and wheel chart.</p>
            )}
            <button className="dh-modal-retry" onClick={() => setState("idle")}>Calculate Another</button>
          </div>
        )}

        {(state === "idle" || state === "calculating" || state === "error") && system === "numerology" && (
          <form onSubmit={handleNumerologySubmit} noValidate>
            <div className="dh-field">
              <label className="dh-label" htmlFor="calc-fullname">Full Birth Name <span className="dh-label-req">*</span></label>
              <input id="calc-fullname" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="As it appears on your birth certificate" required autoComplete="name" />
            </div>
            <div className="dh-field">
              <label className="dh-label" htmlFor="calc-birthdate">Birth Date <span className="dh-label-req">*</span></label>
              <input id="calc-birthdate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
            </div>
            {state === "error" && <div className="dh-modal-error">{errorMsg}</div>}
            <button type="submit" className="dh-modal-submit" disabled={state === "calculating" || !fullName.trim() || !birthDate}>
              {state === "calculating" ? "Calculating…" : "Calculate My Numbers"}
            </button>
          </form>
        )}

        {(state === "idle" || state === "calculating" || state === "error") && system === "western" && (
          <form onSubmit={handleWesternSubmit} noValidate>
            <div className="dh-field">
              <label className="dh-label" htmlFor="calc-w-birthdate">Birth Date <span className="dh-label-req">*</span></label>
              <input id="calc-w-birthdate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
            </div>
            <div className="dh-field">
              <label className="dh-label" htmlFor="calc-w-birthtime">Birth Time <span className="dh-label-opt">(optional — needed for Rising, houses & wheel)</span></label>
              <input id="calc-w-birthtime" type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />
            </div>
            <div className="dh-field">
              <label className="dh-label" htmlFor="calc-w-birthplace">Birth Place <span className="dh-label-opt">(optional — needed with birth time)</span></label>
              <input id="calc-w-birthplace" type="text" value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} placeholder="City, Country" autoComplete="off" />
            </div>
            {state === "error" && <div className="dh-modal-error">{errorMsg}</div>}
            <button type="submit" className="dh-modal-submit" disabled={state === "calculating" || !birthDate}>
              {state === "calculating" ? "Calculating…" : "Calculate My Chart"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function WesternPointList(result: WesternChartResult) {
  const points: [string, PlanetPosition | null][] = [
    ["Sun", result.sun],
    ["Moon", result.moon],
    ["Rising", result.rising],
    ["Midheaven", result.midheaven],
    ["Mercury", result.mercury],
    ["Venus", result.venus],
    ["Mars", result.mars],
    ["Jupiter", result.jupiter],
    ["Saturn", result.saturn],
    ["Uranus", result.uranus],
    ["Neptune", result.neptune],
    ["Pluto", result.pluto],
  ];
  return (
    <>
      {points.filter(([, p]) => p !== null).map(([name, p]) => {
        const planet = p as PlanetPosition;
        const meaning = PLANET_MEANINGS[name === "Rising" ? "Rising" : name]?.signMeanings?.[planet.sign];
        return (
          <div className="dh-result-card" key={name}>
            <div className="dh-result-head">
              <span className="dh-result-label">{name}</span>
              <span className="dh-result-value">{planet.symbol} {planet.sign} {planet.degree}°</span>
            </div>
            <p className="dh-result-technical">{WESTERN_TECHNICAL[name]}</p>
            {meaning && <p className="dh-result-plain">{meaning.teaser}</p>}
          </div>
        );
      })}
    </>
  );
}
