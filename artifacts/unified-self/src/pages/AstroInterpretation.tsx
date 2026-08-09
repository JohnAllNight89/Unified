import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { calculateChart, type ChartResult, type PlanetPosition, PLANET_MEANINGS } from "@/lib/astro";
import "./shared.css";
import "./portal.css";
import "./astro.css";

function computeUtcOffset(ianaTimezone: string, dateStr: string): number {
  const [y, mo, d] = dateStr.split("-").map(Number);
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

function InterpCard({ pos }: { pos: PlanetPosition }) {
  const [open, setOpen] = useState(false);
  const info = PLANET_MEANINGS[pos.planet];
  if (!info) return null;
  const signData = info.signMeanings?.[pos.sign];

  return (
    <div className="astro-interp-planet-section card">
      <div className="astro-interp-header" onClick={() => setOpen(o => !o)}>
        <div className="astro-interp-symbol-wrap">{info.symbol}</div>
        <div>
          <div className="astro-interp-heading">
            <span className="astro-interp-planet-label">{pos.planet}</span>
            <span className="astro-interp-planet-name">{info.archetype}</span>
            <span className="astro-interp-archetype">{info.keywords}</span>
          </div>
          <div className="astro-interp-placement">
            <span className="astro-interp-sign-sym">{pos.symbol}</span>
            <span className="astro-interp-sign-name">{pos.sign}</span>
            <span className="astro-interp-degree">{pos.degree}°</span>
          </div>
        </div>
      </div>

      {open && (
        <div className="astro-interp-body">
          <div className="astro-interp-origin">
            <h4>Origins &amp; Mythology</h4>
            <p>{info.origin}</p>
          </div>
          <div className="astro-interp-meaning">
            <h4>Your {pos.planet} in {pos.sign}</h4>
            {signData ? (
              <>
                <p style={{ fontStyle: "italic", color: "var(--goldL)", marginBottom: 14 }}>{signData.teaser}</p>
                <p>{signData.deep}</p>
              </>
            ) : (
              <p style={{ color: "var(--muted)", fontStyle: "italic" }}>
                This placement is rare. It carries a unique synthesis of {pos.planet}'s archetypal energy expressed through the lens of {pos.sign}, a combination worth exploring in your personal Soul Blueprint.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AstroInterpretationPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [chart, setChart] = useState<ChartResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [profRes, subRes] = await Promise.all([
          fetch("/api/profile", { credentials: "include" }),
          fetch("/api/stripe/subscription-status", { credentials: "include" }),
        ]);
        const profData = await profRes.json();
        const subData = await subRes.json();
        const status = subData.status || "inactive";
        setIsSubscribed(status === "active" || status === "trialing");
        if (profData.profile) {
          setProfile(profData.profile);
          const p = profData.profile;
          const lat = p.birthLat ? parseFloat(p.birthLat) : null;
          const lng = p.birthLng ? parseFloat(p.birthLng) : null;
          let utcOffset = 0;
          if (lat !== null && lng !== null) {
            try {
              const geotz = await import("geo-tz");
              const zones: string[] = geotz.find(lat, lng);
              if (zones.length > 0) {
                utcOffset = computeUtcOffset(zones[0], p.birthDate);
              }
            } catch {
              const m = (p.birthTime ?? "").match(/([+-]\d+(?:\.\d+)?)\s*$/);
              if (m) utcOffset = parseFloat(m[1]);
            }
          }
          setChart(calculateChart(p.birthDate, p.birthTime || null, lat, lng, utcOffset));
        }
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

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

  if (loading) {
    return (
      <div className="tus-page">
        <Starfield fixed />
        <Nav />
        <div className="portal-loading">
          <div className="portal-spinner" />
          <p>Loading your interpretation…</p>
        </div>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="tus-page">
        <Starfield fixed />
        <Nav />
        <div className="portal-main">
          <div className="portal-greeting">
            <span className="tag">Members Only</span>
            <h1 className="portal-greeting-name" style={{ fontSize: "clamp(1.6rem,5vw,2.5rem)" }}>
              This Content Is for Members
            </h1>
            <p className="portal-greeting-sub">
              Unlock the full interpretation of your chart for $3.99/month.
            </p>
          </div>
          <div className="portal-section" style={{ textAlign: "center" }}>
            <button className="hero-btn" onClick={handleSubscribe}>
              ✦ &nbsp;Start My Membership: $3.99/mo
            </button>
            <br /><br />
            <Link href="/portal/astro" className="outline-btn">View My Raw Chart →</Link>
          </div>
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

  return (
    <div className="tus-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />
      <main id="main-content" className="portal-main">

        <div className="num-back">
          <Link href="/portal/astro" className="outline-btn" style={{ fontSize: ".72rem", padding: "8px 18px" }}>
            ← View Raw Chart
          </Link>
        </div>

        <div className="portal-greeting">
          <span className="tag">Chart Interpretation</span>
          <h1 className="portal-greeting-name" style={{ fontSize: "clamp(1.5rem,5vw,2.6rem)" }}>
            {profile.fullName}
          </h1>
          <p className="portal-greeting-sub">
            Born {new Date(profile.birthDate + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            {profile.birthTime ? ` · ${profile.birthTime}` : " · time unknown"}
          </p>
        </div>

        <section className="portal-section" style={{ marginTop: 32 }}>
          <p className="portal-section-sub" style={{ marginBottom: 40 }}>
            Each planet is a different facet of your soul. Tap any to read what it means: where it came from, and how it lives in your specific life. Take your time. This is your map.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PLANET_ORDER.map((key) => {
              const pos = chart[key];
              if (!pos) return null;
              return <InterpCard key={key} pos={pos} />;
            })}
          </div>
        </section>

        {/* ── SOUL BLUEPRINT CTA ───────────────────── */}
        <section className="portal-section">
          <div className="num-report-cta card">
            <div className="num-report-icon">✦</div>
            <h3>You Are Reading the Outline. The Soul Blueprint Is the Full Story.</h3>
            <p>
              What you have here is a genuine beginning, a real, accurate interpretation of your chart. What lives inside your <strong>Soul Blueprint</strong> is the synthesis: your Astrology, your Numerology, your Human Design, and your Gene Keys, all five systems woven together into one complete portrait of exactly who you were designed to be. 75+ pages, personally written from your specific data.
            </p>
            <a className="hero-btn" href="/#order">
              ✦ &nbsp;Get My Soul Blueprint: $222.00
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
