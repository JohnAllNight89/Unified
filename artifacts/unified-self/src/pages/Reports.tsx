import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { handleCheckout } from "@/lib/checkout";
import { useSEO } from "@/hooks/useSEO";
import "./shared.css";
import "./reports.css";

export default function Reports() {
  useSEO({
    title: "Soul Blueprint Reports & Readings — The Unified Spirit",
    description: "Order your Soul Blueprint, Couples Blueprint, Numerology, or Astrology reading. Each report is hand-crafted from your birth data using Numerology, Astrology, Human Design, and Gene Keys.",
    path: "/reports",
  });

  return (
    <div className="tus-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />

      <main id="main-content">

        {/* HERO */}
        <section className="rp-hero" aria-labelledby="rp-heading">
          <div className="rp-hero-glow" />
          <div className="rp-eyebrow">Reports</div>
          <h1 id="rp-heading">Every report is built<br />from your data alone.</h1>
          <p>Hand-crafted, never automated. Written specifically to you, from the precise coordinates of your birth. Delivered within 72 hours.</p>
        </section>

        <div className="rp-wrap">

          {/* SOUL BLUEPRINT */}
          <span className="rp-section-label">The Complete Blueprint</span>

          <div className="rp-product-primary">
            <div className="rp-product-top">
              <div>
                <div className="rp-product-tag">Most Complete</div>
                <div className="rp-product-title">The Soul Blueprint</div>
              </div>
              <div className="rp-product-price">$222</div>
            </div>
            <div className="rp-product-body">
              <p className="rp-product-desc">Six complete chapters. 150+ pages. Every sentence written from your specific birth data — synthesizing all four systems into a single, integrated document that tells the truth about who you are and what you were built for.</p>
              <ul className="rp-checks">
                <li>Numerology — Life Path, Expression, Soul Urge, karmic architecture, pinnacles, and cycles</li>
                <li>Astrology — Vedic and Tropical charts synthesized, every planet and house interpreted for your specific life</li>
                <li>Human Design — Type, Strategy, Authority, Profile, defined and open Centers, Not-Self theme</li>
                <li>Gene Keys — Life's Work, Evolution, Radiance, Purpose — Shadow through Gift toward Siddhi</li>
                <li>Full Synthesis — all four systems cross-examined into one coherent picture of you</li>
                <li>The Path — your blueprint applied to the specific arc your life is asking you to walk</li>
                <li>52-Week Alignment & Shadow Work Journal — 365 daily prompts built from your data, included</li>
              </ul>
              <button className="rp-btn-gold" onClick={() => handleCheckout("soul_blueprint")}>
                ✦ &nbsp; Reveal My Blueprint — $222
              </button>
            </div>
          </div>

          {/* Current Life Reading addon */}
          <div className="rp-addon">
            <div className="rp-addon-label">+ Optional Add-On · Individual</div>
            <div className="rp-addon-title">Current Life Reading</div>
            <p className="rp-addon-desc">A synthesized reading of where you are right now — built from your Vedic and Tropical astrology charts and numerology profile. Not who you are by design, but what this specific season is asking of you. What cycles are active, where your energy is being called, and what the moment you are in is actually for.</p>
            <div className="rp-addon-footer">
              <div className="rp-addon-price">$77</div>
              <button className="rp-addon-btn" onClick={() => handleCheckout("current_life")}>Add This — $77</button>
            </div>
          </div>

          <div className="rp-divider" />

          {/* COUPLES BLUEPRINT */}
          <span className="rp-section-label">For Two</span>

          <div className="rp-product-primary">
            <div className="rp-product-top">
              <div>
                <div className="rp-product-tag">Couples</div>
                <div className="rp-product-title">The Couples Blueprint</div>
              </div>
              <div className="rp-product-price">$333</div>
            </div>
            <div className="rp-product-body">
              <p className="rp-product-desc">Two complete Soul Blueprints plus a full compatibility synthesis — showing how your designs interact, where you amplify each other, where friction lives and why, and what you are uniquely positioned to build together. Available for romantic partners, close friendships, and business partnerships.</p>
              <ul className="rp-checks">
                <li>Two complete Soul Blueprints — 150+ pages each, built from each person's individual data</li>
                <li>Full compatibility synthesis across all four systems — how your designs interact at every level</li>
                <li>Where you amplify each other's strengths and where friction is built into your designs</li>
                <li>What you are specifically designed to create together</li>
                <li>Two 52-Week Alignment Journals — one for each person</li>
              </ul>
              <button className="rp-btn-outline" onClick={() => handleCheckout("couples_blueprint")}>
                ✦ &nbsp; Read Our Blueprint — $333
              </button>
            </div>
          </div>

          {/* Couples Current Life Reading addon */}
          <div className="rp-addon">
            <div className="rp-addon-label">+ Optional Add-On · Couples</div>
            <div className="rp-addon-title">Couples Current Life Reading</div>
            <p className="rp-addon-desc">Both people's current seasons synthesized together — built from both Vedic and Tropical astrology charts and both numerology profiles. Where your current cycles intersect, where they diverge, and what this specific season is asking of you as two people moving through it together.</p>
            <div className="rp-addon-footer">
              <div className="rp-addon-price">$99</div>
              <button className="rp-addon-btn" onClick={() => handleCheckout("couples_life")}>Add This — $99</button>
            </div>
          </div>

          <div className="rp-divider" />

          {/* STANDALONE */}
          <span className="rp-section-label">Focused Reports — One System</span>

          <div className="rp-standalone-grid">
            <div className="rp-standalone-card">
              <div className="rp-standalone-icon">○</div>
              <div className="rp-standalone-tag">Standalone</div>
              <div className="rp-standalone-title">Numerology Profile</div>
              <p className="rp-standalone-desc">All five core numbers explored in full depth — Life Path, Expression, Soul Urge, Personality, and Birth Day — with shadow patterns, karmic debt, life cycles, and your current personal year.</p>
              <div className="rp-standalone-price">$77</div>
              <button className="rp-standalone-btn" onClick={() => handleCheckout("numerology_report")}>Get This Report</button>
            </div>
            <div className="rp-standalone-card">
              <div className="rp-standalone-icon">☽</div>
              <div className="rp-standalone-tag">Standalone</div>
              <div className="rp-standalone-title">Astro Chart Reading</div>
              <p className="rp-standalone-desc">Your complete natal chart interpreted across both Vedic and Tropical traditions — every planet, every sign, every house — read through the lens of your actual life and experience.</p>
              <div className="rp-standalone-price">$77</div>
              <button className="rp-standalone-btn" onClick={() => handleCheckout("astro_reading")}>Get This Report</button>
            </div>
          </div>

          <div className="rp-divider rp-divider--mb" />

          <p className="rp-delivery-note">
            All reports are hand-crafted, never automated, and delivered within 72 hours.<br />
            Birth time and exact place of birth required for all reports except Numerology.<br />
            Questions? <a href="mailto:4pointspirit@gmail.com">4pointspirit@gmail.com</a>
          </p>

        </div>
      </main>
      <Footer />
    </div>
  );
}
