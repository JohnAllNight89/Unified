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
              <p className="rp-product-desc">10 complete chapters. 75+ pages. Every sentence written from your specific birth data — synthesizing all five systems into a single, integrated document that teaches you about who you are and what you were built for.</p>
              <ul className="rp-checks">
                <li>Numerology — Life Path, Expression, Soul Urge, karmic architecture, pinnacles, and cycles</li>
                <li>Western Astrology — every planet and house interpreted for your specific life and inner world</li>
                <li>Vedic Astrology — sidereal placements, nakshatras, dashas, and your soul's karmic dharmic blueprint</li>
                <li>Human Design — Type, Strategy, Authority, Profile, defined and open Centers, Not-Self theme</li>
                <li>Gene Keys — Life's Work, Evolution, Radiance, Purpose — Shadow through Gift toward Siddhi</li>
                <li>Full Synthesis — all five systems cross-examined into one coherent picture of you</li>
                <li>Where you are NOW — your blueprint applied to this specific arc in your life</li>
              </ul>
              <div className="rp-addon-promo">
                <div className="rp-addon-promo-badge">★ LIMITED TIME — FREE ADD ON</div>
                <div className="rp-addon-promo-title">52-Week Alignment &amp; Shadow Journal</div>
                <ul className="rp-addon-promo-list">
                  <li>1 theme per week — drawn from your specific blueprint</li>
                  <li>1 question per day — written entirely for you</li>
                  <li>Every theme, every question specific to YOU</li>
                </ul>
              </div>
              <button className="rp-btn-gold" onClick={() => handleCheckout("soul_blueprint")}>
                ✦ &nbsp; Reveal My Blueprint — $222
              </button>
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
              <p className="rp-product-desc">Two complete Soul Blueprints plus a full synastry compatibility synthesis — showing how your designs interact, where you amplify each other, where friction lives and why, and what you are uniquely positioned to build together. Available for romantic partners, close friendships, and business partnerships.</p>
              <ul className="rp-checks">
                <li>Two complete Soul Blueprints — 75+ pages each, built from each person's individual data</li>
                <li>Full compatibility synthesis across all 5 systems — how your designs interact at every level</li>
                <li>Where you amplify each other's strengths and where friction is built into your designs</li>
                <li>What you are specifically designed to create together</li>
              </ul>
              <div className="rp-addon-promo">
                <div className="rp-addon-promo-badge">★ LIMITED TIME — FREE ADD ON</div>
                <div className="rp-addon-promo-title">52-Week Synastry Alignment &amp; Shadow Journal</div>
                <ul className="rp-addon-promo-list">
                  <li>1 theme per week — built from your Synastry Blueprint</li>
                  <li>1 question per day — written for your relationship's specific design</li>
                  <li>Every theme, every question specific to YOUR RELATIONSHIP BLUEPRINT</li>
                </ul>
              </div>
              <button className="rp-btn-outline" onClick={() => handleCheckout("couples_blueprint")}>
                ✦ &nbsp; Read Our Blueprint — $333
              </button>
            </div>
          </div>

          <div className="rp-divider" />

          {/* FOCUSED THREE-SYSTEM READINGS */}
          <span className="rp-section-label">Three Systems · One Convergence</span>

          <div className="rp-product-primary">
            <div className="rp-product-top">
              <div>
                <div className="rp-product-tag">Numerology · Human Design · Gene Keys</div>
                <div className="rp-product-title">The Gate Reading</div>
              </div>
              <div className="rp-product-price">$99</div>
            </div>
            <div className="rp-product-body">
              <p className="rp-product-desc">The same 64 gates, spoken in two different languages. The mechanics of how you are built, and the myth of what you are becoming.</p>
              <p className="rp-product-subdesc">Human Design tells you your Type and your Strategy. Gene Keys tells you your Life's Work carries a shadow and a gift and something higher waiting past both. Almost no one has been shown these two systems read together, from the same gates, as one instrument instead of two. This is that reading — layered with your Numerology so the pattern is confirmed in a third, entirely independent language.</p>
              <ul className="rp-checks">
                <li>Your full Numerology profile — Life Path, Expression, Soul Urge, Personality, and the Master Numbers or Karmic Debts carried in your name and birth date</li>
                <li>Your Human Design chart — Type, Strategy, Authority, Profile, and your defined centers, translated into how you actually move through decisions and relationships</li>
                <li>Your Gene Keys profile — Life's Work, Evolution, Radiance, and Purpose, each read through its Shadow, Gift, and Siddhi</li>
                <li>A synthesis naming where all three systems agree, and what that agreement is telling you</li>
              </ul>
              <p className="rp-product-upgrade-note">What this does not yet show you: the celestial architecture of the sky at the moment you were born, read through both the Western and Vedic lens. That is where the full Soul Blueprint picks up.</p>
              <button className="rp-btn-gold" onClick={() => handleCheckout("gate_reading")}>
                ✦ &nbsp; Get The Gate Reading — $99
              </button>
            </div>
          </div>

          <div className="rp-divider" />

          <div className="rp-product-primary">
            <div className="rp-product-top">
              <div>
                <div className="rp-product-tag">Numerology · Western Astrology · Vedic Astrology</div>
                <div className="rp-product-title">The Blueprint Foundation</div>
              </div>
              <div className="rp-product-price">$99</div>
            </div>
            <div className="rp-product-body">
              <p className="rp-product-desc">The mathematics of your name. The sky at the moment you arrived, read twice — once through the tropical lens and once through the sidereal. Three systems, one convergence.</p>
              <p className="rp-product-subdesc">You already know your sun sign. You have probably never been shown what it actually means when it is placed next to your Life Path number and your Vedic Moon nakshatra, and asked to explain itself. This is where your reading begins — not a horoscope, not a personality quiz. A hand-written synthesis of three precise systems, each one independently confirming what the others already found.</p>
              <ul className="rp-checks">
                <li>Your full Numerology profile — Life Path, Expression, Soul Urge, Personality, and the Master Numbers or Karmic Debts carried in your name and birth date</li>
                <li>Your Western Astrology chart — Sun, Moon, Rising, and the personal planets, translated into how they actually move through your daily life</li>
                <li>Your Vedic Astrology chart — Sun, Moon, and Rising by nakshatra, plus the karmic themes your sidereal placements are structured around</li>
                <li>A synthesis naming where all three systems agree, and what that agreement is telling you</li>
              </ul>
              <p className="rp-product-upgrade-note">What this does not yet show you: the energetic mechanics of how you are built to make decisions and hold energy (Human Design), or the shadow-to-gift architecture that names what you are here to become (Gene Keys). Those two systems complete the picture in the full Soul Blueprint.</p>
              <button className="rp-btn-gold" onClick={() => handleCheckout("blueprint_foundation")}>
                ✦ &nbsp; Get The Blueprint Foundation — $99
              </button>
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
