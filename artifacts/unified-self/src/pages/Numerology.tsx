import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { calculate, getMeaning, type NumerologyResult } from "@/lib/numerology";
import "./shared.css";
import "./portal.css";
import "./numerology.css";

interface Profile {
  fullName: string;
  birthDate: string;
  birthPlace: string;
}

const NUMBER_LABELS: { key: keyof NumerologyResult; label: string; icon: string; desc: string }[] = [
  { key: "lifePath",   label: "Life Path",    icon: "◯", desc: "The master theme of your life: your soul's primary purpose and the gifts you are here to develop." },
  { key: "expression", label: "Expression",   icon: "✦", desc: "The totality of who you are, your natural talents, abilities, and how you are designed to move through the world." },
  { key: "soulUrge",   label: "Soul Urge",    icon: "☽", desc: "The heart's deepest longing: what motivates you at the level below words, the internal compass of your desire." },
  { key: "personality",label: "Personality",  icon: "◈", desc: "The face you show to the world, how others first perceive you before they know your full depth." },
  { key: "birthDay",   label: "Birth Day",    icon: "⬆", desc: "A specific gift embedded in the exact day you arrived, a talent that is immediately available to you and requires no development." },
];

function NumberCard({ num, entry, icon, desc, expanded, onToggle }: {
  num: number; entry: { label: string };
  icon: string; desc: string;
  expanded: boolean; onToggle: () => void;
}) {
  const meaning = getMeaning(num);
  return (
    <div className={`num-card card${expanded ? " expanded" : ""}`} onClick={onToggle}>
      <div className="num-card-header">
        <div className="num-card-icon-wrap">
          <span className="num-card-icon">{icon}</span>
        </div>
        <div className="num-card-meta">
          <div className="num-card-label">{entry.label}</div>
          <div className="num-card-title">{num}: {meaning.title}</div>
        </div>
        <div className="num-card-toggle">{expanded ? "▲" : "▼"}</div>
      </div>
      <p className="num-card-desc">{desc}</p>
      <p className="num-card-teaser">{meaning.teaser}</p>
      {expanded && (
        <div className="num-card-deep">
          <div className="num-card-divider" />
          <p>{meaning.deep}</p>
          <div className="num-card-locked">
            <span className="num-locked-icon">✦</span>
            <p>
              Your <strong>In-depth Numerology Report</strong> goes significantly further, delivering a complete, personal portrait of how each of these numbers expresses specifically in your life, your relationships, your career, and your recurring patterns.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NumerologyPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>("lifePath");
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
          const calc = calculate(profData.profile.fullName, profData.profile.birthDate);
          setResult(calc);
        }
        setSubStatus(subData.status || "inactive");
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  const isSubscribed = subStatus === "active" || subStatus === "trialing";

  async function handleBuyReport() {
    const origin = window.location.origin;
    const base = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productKey: "numerology_report",
        successUrl: `${origin}${base}/portal`,
        cancelUrl: `${origin}${base}/portal/numerology`,
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
          <p>Calculating your numbers…</p>
        </div>
      </div>
    );
  }

  if (!profile || !result) {
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
          <Link href="/portal" className="outline-btn" style={{ fontSize: ".72rem", padding: "8px 18px" }}>
            ← Back to Portal
          </Link>
        </div>

        <div className="portal-greeting">
          <span className="tag">Your Numerology</span>
          <h1 className="portal-greeting-name" style={{ fontSize: "clamp(1.6rem, 5vw, 2.8rem)" }}>
            {profile.fullName}
          </h1>
          <p className="portal-greeting-sub">Born {new Date(profile.birthDate + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>

        <section className="portal-section" style={{ marginTop: 32 }}>
          <p className="portal-section-sub" style={{ marginBottom: 40 }}>
            Five numbers. Five distinct frequencies. Each one revealing a layer of who you were designed to be. Tap any card to read deeper.
          </p>

          <div className="num-grid">
            {NUMBER_LABELS.map(({ key, label, icon, desc }) => (
              <NumberCard
                key={key}
                num={result[key]}
                entry={{ label }}
                icon={icon}
                desc={desc}
                expanded={expanded === key}
                onToggle={() => setExpanded(expanded === key ? null : key)}
              />
            ))}
          </div>
        </section>

        {/* ── REPORT CTA ──────────────────────────── */}
        <section className="portal-section">
          <div className="num-report-cta card">
            <div className="num-report-icon">✦</div>
            <h3>This Is Just the Beginning</h3>
            <p>
              What you've seen here are the core frequencies of your numerological design: the numbers and their essential meanings. Your <strong>In-depth Numerology Report</strong> goes much further: it traces each number through your personal history, your relationships, your career patterns, and your recurring life themes, written personally from your specific name and birth date.
            </p>
            <div className="num-report-features">
              <div>✓ Complete analysis of all five numbers, written for you specifically</div>
              <div>✓ How your numbers interact and where they create tension or harmony</div>
              <div>✓ Your personal year cycles: what this year is asking of you</div>
              <div>✓ Shadow patterns: the unconscious ways your numbers can work against you</div>
              <div>✓ Delivered to your email within 72 hours</div>
            </div>
            <div className="num-report-price">
              <span className="price-orig" aria-label="Original price">
                {isSubscribed ? "$14.99" : null}
              </span>
              <span className="num-report-amount">${isSubscribed ? "11.99" : "14.99"}</span>
              {isSubscribed && <span className="num-report-badge">Member price: 20% off</span>}
            </div>
            <button className="hero-btn" onClick={handleBuyReport}>
              ✦ &nbsp;Get My Numerology Report
            </button>
            {!isSubscribed && (
              <p className="num-report-sub-note">
                <Link href="/portal" style={{ color: "var(--goldL)" }}>Members save 20%</Link>, join for $3.99/month
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
