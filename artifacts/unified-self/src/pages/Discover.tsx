import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./shared.css";

const TOPICS = [
  {
    href: "/discover/numerology",
    icon: "◯",
    title: "Numerology",
    accent: "var(--gold)",
    desc: "The ancient science of numbers — from Pythagoras to the Chaldeans, and how your name and birth date encode the blueprint of your personality, purpose, and path.",
  },
  {
    href: "/discover/astrology",
    icon: "☽",
    title: "Astrology",
    accent: "var(--cobalt)",
    desc: "Five thousand years of reading the sky — from Babylonian omens to Vedic Jyotish to the modern natal chart. Understand the planets, signs, houses, and aspects that shape your cosmic fingerprint.",
  },
  {
    href: "/discover/human-design",
    icon: "◈",
    title: "Human Design",
    accent: "var(--teal)",
    desc: "A synthesis of the I Ching, Kabbalah, Hindu-Brahmin Chakras, and Western Astrology — transmitted in 1987 and now one of the most precise systems for understanding your energy, strategy, and authority.",
  },
  {
    href: "/discover/gene-keys",
    icon: "✦",
    title: "The Gene Keys",
    accent: "var(--rose)",
    desc: "64 archetypes encoded in your DNA — each containing a Shadow, a Gift, and a Siddhi. A contemplative path from limitation to genius, created by Richard Rudd.",
  },
];

export default function Discover() {
  return (
    <div className="tus-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />
      <main id="main-content" style={{ maxWidth: 960, margin: "0 auto", padding: "6rem 1.5rem 3rem", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="tag">Discover</span>
          <h1 className="sec-title">
            The Four Systems
          </h1>
          <p style={{ color: "var(--text)", maxWidth: 620, margin: "0 auto", lineHeight: 1.8, fontSize: "1.05rem" }}>
            Every soul blueprint draws from four ancient wisdom traditions. Each one reveals a different layer of who you are. Explore their origins, principles, and how they work together.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {TOPICS.map((t) => (
            <Link key={t.href} href={t.href} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: "2rem 1.5rem", cursor: "pointer", height: "100%", display: "flex", flexDirection: "column", borderTop: `2px solid ${t.accent}` }}>
                <div style={{ fontSize: "2.2rem", marginBottom: "0.8rem", color: t.accent }}>{t.icon}</div>
                <h2 style={{ color: t.accent, fontSize: "1.3rem", marginBottom: "0.6rem", fontFamily: "'Cinzel', serif" }}>{t.title}</h2>
                <p style={{ color: "var(--text)", fontSize: "1rem", lineHeight: 1.8, flex: 1 }}>{t.desc}</p>
                <div style={{ color: t.accent, fontSize: "0.95rem", marginTop: "1rem", fontWeight: 600 }}>
                  Read More →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <p style={{ color: "var(--text)", fontSize: "1rem", marginBottom: "1rem" }}>
            Ready to see what your own data reveals?
          </p>
          <Link href="/sign-up" className="hero-btn">
            Create Your Free Profile
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
