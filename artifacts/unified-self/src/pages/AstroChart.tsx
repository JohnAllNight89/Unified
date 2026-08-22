import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { calculateChart, type ChartResult, type PlanetPosition } from "@/lib/astro";
import { PLANET_MEANINGS } from "@/lib/astro";
import { getUtcOffset } from "@/lib/geo";
import "./shared.css";
import "./portal.css";
import "./astro.css";

interface Profile {
  fullName: string;
  birthDate: string;
  birthTime?: string;
  birthPlace: string;
  birthLat?: string;
  birthLng?: string;
}

const PLANET_ORDER: (keyof ChartResult)[] = [
  "sun","moon","rising","mercury","venus","mars","jupiter","saturn","uranus","neptune","pluto"
];

function PlanetRow({ pos, isRising }: { pos: PlanetPosition; isRising?: boolean }) {
  const info = PLANET_MEANINGS[pos.planet];
  return (
    <div className="astro-planet-row">
      <div className="astro-planet-symbol" title={pos.planet}>{info?.symbol || "●"}</div>
      <div className="astro-planet-name">{pos.planet}</div>
      <div className="astro-planet-sign">
        <span className="astro-sign-symbol">{pos.symbol}</span>
        <span className="astro-sign-name">{pos.sign}</span>
        <span className="astro-sign-degree">{pos.degree}°</span>
      </div>
      {isRising && <div className="astro-rising-badge">Rising</div>}
    </div>
  );
}

export default function AstroChartPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [chart, setChart] = useState<ChartResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [subStatus, setSubStatus] = useState("inactive");

  useEffect(() => {
    (async () => {
      try {
        const [profRes, subRes] = await Promise.all([
          fetch("/api/profile", { credentials: "include" }),
          fetch("/api/stripe/subscription-status", { credentials: "include" }),
        ]);
        const profData = await profRes.json();
        const subData = await subRes.json();
        if (profData.profile) {
          setProfile(profData.profile);
          const p = profData.profile;
          const lat = p.birthLat ? parseFloat(p.birthLat) : null;
          const lng = p.birthLng ? parseFloat(p.birthLng) : null;
          const timeStr = p.birthTime || null;

          // Derive timezone from stored coordinates (DST-aware, historically accurate)
          let utcOffset = 0;
          if (lat !== null && lng !== null) {
            const resolved = await getUtcOffset(lat, lng, p.birthDate);
            if (resolved !== null) {
              utcOffset = resolved;
            } else {
              // fallback: any offset encoded in a previous birthTime value
              const m = (timeStr ?? "").match(/([+-]\d+(?:\.\d+)?)\s*$/);
              if (m) utcOffset = parseFloat(m[1]);
            }
          }

          const calc = calculateChart(p.birthDate, timeStr, lat, lng, utcOffset);
          setChart(calc);
        }
        setSubStatus(subData.status || "inactive");
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  const isSubscribed = subStatus === "active" || subStatus === "trialing";

  async function handleSubscribe() {
    const origin = window.location.origin;
    const base = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
    const res = await fetch("/api/stripe/subscribe", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        successUrl: `${origin}${base}/portal/astro-interpretation`,
        cancelUrl: `${origin}${base}/portal/astro`,
      }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Unable to start checkout.");
  }

  async function handleBuyReport() {
    const origin = window.location.origin;
    const base = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productKey: "astro_reading",
        successUrl: `${origin}${base}/portal`,
        cancelUrl: `${origin}${base}/portal/astro`,
      }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Unable to start checkout.");
  }

  if (loading) {
    return (
      <div className="tus-page">
        <Starfield fixed />
        <Nav />
        <div className="portal-loading">
          <div className="portal-spinner" />
          <p>Calculating your chart…</p>
        </div>
      </div>
    );
  }

  if (!profile || !chart) {
    return (
      <div className="tus-page">
        <Starfield fixed />
        <Nav />
        <div className="portal-loading">
          <p>No profile found. <Link href="/portal" style={{ color: "var(--goldL)" }}>Create your profile →</Link></p>
        </div>
      </div>
    );
  }

  const hasRising = !!chart.rising;

  return (
    <div className="tus-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />
      <main id="main-content" className="portal-main">

        <div className="num-back">
          <Link href="/portal" className="outline-btn" style={{ fontSize: ".72rem", padding: "8px 18px" }}>
            ← Back to Portal
          </Link>
        </div>

        <div className="portal-greeting">
          <span className="tag">Your Natal Chart</span>
          <h1 className="portal-greeting-name" style={{ fontSize: "clamp(1.6rem, 5vw, 2.8rem)" }}>
            {profile.fullName}
          </h1>
          <p className="portal-greeting-sub">
            Born {new Date(profile.birthDate + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            {profile.birthTime ? ` · ${profile.birthTime.replace(/[+-]\d+(?:\.\d+)?\s*$/, "")}` : " · time unknown"}
            {" · "}{profile.birthPlace}
          </p>
        </div>

        {!hasRising && (
          <div className="astro-no-time-note">
            <span>✦</span>
            <p>
              Your <strong>Rising sign</strong> requires your birth time. <Link href="/portal" style={{ color: "var(--goldL)" }}>Edit your profile</Link> to add it, since many insights in your chart depend on accurate timing.
            </p>
          </div>
        )}

        {/* ── CHART DATA ──────────────────────────── */}
        <section className="portal-section" style={{ marginTop: 32 }}>
          <div className="astro-chart-card card">
            <div className="astro-chart-header">
              <h2 className="astro-chart-title">Your Planetary Positions</h2>
              <p className="astro-chart-sub">
                This is your map. Every planet. Every sign. Every degree. What does it all mean? That is the question your chart is quietly asking you.
              </p>
            </div>

            <div className="astro-planets-list">
              {PLANET_ORDER.map((key) => {
                const pos = chart[key];
                if (!pos) return null;
                return (
                  <PlanetRow
                    key={key}
                    pos={pos}
                    isRising={key === "rising"}
                  />
                );
              })}
            </div>

            <div className="astro-silence-note">
              <p>
                The data above is yours. The meaning is waiting for you to unlock it.
              </p>
            </div>
          </div>
        </section>

        {/* ── SUBSCRIPTION CTA ────────────────────── */}
        <section className="portal-section">
          <div className="astro-unlock-card card">
            <div className="astro-unlock-icon">☽</div>
            <h3>What Does Your Chart Actually Mean?</h3>
            <p>
              You now have the data. But a natal chart without interpretation is like a map without a legend: the terrain is all there, but you cannot read where you are.
            </p>
            <p>
              The monthly membership unlocks the full interpretation of your chart: what each placement means, the mythology and history behind each planetary archetype, and how these energies show up in your real, lived life.
            </p>

            <div className="astro-unlock-features">
              {[
                "What your Sun sign reveals about your core identity and life purpose",
                "What your Moon sign says about your emotional world and what you need to feel safe",
                "What your Rising sign says about how you arrive in the world and what others first perceive",
                "The meaning of every other planetary placement in your chart",
                "The origins and mythology behind each planet's archetypal energy",
                "How this all pertains to your specific life, generalized but accurate to your chart",
              ].map((f) => (
                <div key={f} className="astro-unlock-feature">
                  <span>✦</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {isSubscribed ? (
              <Link href="/portal/astro-interpretation" className="hero-btn" style={{ marginTop: 24 }}>
                ✦ &nbsp;Read My Chart Interpretation →
              </Link>
            ) : (
              <div className="astro-unlock-ctas">
                <div className="astro-unlock-sub">
                  <div className="astro-unlock-price">
                    <span className="portal-sub-amount">$3.99</span>
                    <span className="portal-sub-period">/month</span>
                  </div>
                  <button className="hero-btn" onClick={handleSubscribe}>
                    ✦ &nbsp;Unlock My Chart: $3.99/mo
                  </button>
                  <p className="portal-sub-note">Includes 20% off all reports. Cancel any time.</p>
                </div>
                <div className="astro-unlock-or">or</div>
                <div className="astro-unlock-report">
                  <p style={{ color: "var(--muted)", fontSize: ".85rem", marginBottom: 12 }}>
                    Want the full written interpretation in one report?
                  </p>
                  <button className="outline-btn" onClick={handleBuyReport}>
                    Get the In-depth Astro Reading: $14.99
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
