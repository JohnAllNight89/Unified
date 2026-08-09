import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { handleCheckout } from "@/lib/checkout";
import { useSEO } from "@/hooks/useSEO";
import "./shared.css";
import "./insights.css";

export default function InsightsWesternVsVedic() {
  useSEO({
    title: "Western vs. Vedic Astrology: Why Your Sun Sign Isn't the Whole Story",
    description: "Your Western Sun sign and your Vedic Sun sign are usually different. Here's why: the tropical and sidereal zodiacs measure the sky differently, and what each one actually reveals about you.",
    path: "/insights/western-vs-vedic-astrology",
  });

  return (
    <div className="in-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />

      <main id="main-content">
        <section className="in-hero">
          <div className="in-hero-glow" />
          <div className="in-eyebrow">Insights</div>
          <h1>Western vs. Vedic Astrology:<br />Why Your Sun Sign Isn't the Whole Story.</h1>
        </section>

        <article className="in-article">
          <Link href="/insights" className="in-back">← Back to Insights</Link>

          <p>Here's something that surprises most people the first time they hear it: your Western Sun sign and your Vedic Sun sign are usually not the same sign.</p>

          <p>You've known your Western Sun sign for most of your life. Maybe you've never questioned it. Then someone runs your chart through the Vedic system, and suddenly you're told you're a different sign entirely. That's not a mistake, and it's not a competing opinion. Both are correct. They're measuring the sky in two fundamentally different ways.</p>

          <h2>Two zodiacs, two starting points</h2>

          <p>Western Astrology uses the <strong>tropical zodiac</strong>. It's anchored to the seasons: 0 degrees Aries is fixed at the spring equinox, every year, regardless of where the actual stars sit behind it. This is why Western astrology reads primarily as psychology. It tracks your relationship to the earth's seasonal cycle, the rhythm you were born into.</p>

          <p>Vedic Astrology (Jyotish) uses the <strong>sidereal zodiac</strong>. It's anchored to the actual, physical position of the stars. Because of a slow wobble in the earth's rotation called precession, the tropical and sidereal zodiacs have drifted apart over the centuries. Today they're separated by roughly 23 to 24 degrees, the ayanamsa. That drift is why your Vedic placements often land in the sign just before your Western ones.</p>

          <div className="in-pull">
            <p>"Neither system is wrong. They're reading two different layers of the same person."</p>
          </div>

          <h2>What each one is actually built to reveal</h2>

          <p>Western Astrology reads your <strong>inner world</strong>: your psychology, your patterns, your relational instincts, the personal planets and aspects that shape how you move through daily life. It's the system most people in the West grew up with, and it's genuinely good at what it does.</p>

          <p>Vedic Astrology reads something deeper: your <strong>karmic contract</strong>. Your dharma. The specific lessons your soul is structured to walk through in this lifetime. Where Western astrology asks "what shaped your personality," Vedic astrology asks "what did your soul agree to before you got here." The nakshatras, the 27 lunar mansions Vedic astrology uses to place your Moon with far more precision than the twelve Western signs allow, have no real equivalent in the tropical system. Neither does the concept of a planetary dasha, the specific multi-year period your life is currently moving through.</p>

          <h2>Why one without the other is an incomplete picture</h2>

          <p>If you've only ever had a Western reading, you have a real and useful map of your psychology. What you don't have is the karmic layer underneath it: why this particular personality, built this particular way, showed up now, in this life, walking toward this particular dharma. If you've only had a Vedic reading, you have the soul-level architecture, but not the specific psychological texture of how that architecture actually plays out day to day.</p>

          <p>Read together, from the same exact birth data, the two systems stop competing and start confirming each other. Where your tropical Saturn and your sidereal Saturn point toward the same lesson from two different angles, that convergence is worth paying attention to. That's the entire premise behind reading both traditions inside one document instead of picking a side.</p>

          <h2>Where to see both, side by side</h2>

          <p>The full <Link href="/reports">Soul Blueprint</Link> includes complete Western and Vedic Astrology chapters, built from your exact birth data and read in conversation with Numerology, Human Design, and Gene Keys. If you want to start with just the astrological layer, <Link href="/reports">The Blueprint Foundation</Link> combines Numerology with both Western and Vedic Astrology on their own, tropical and sidereal, side by side.</p>
        </article>

        <div className="in-cta">
          <h3>See both traditions read together.</h3>
          <p>The Blueprint Foundation combines Numerology, Western Astrology, and Vedic Astrology from your exact birth data.</p>
          <div className="in-cta-links">
            <Link href="/reports" className="in-cta-btn in-cta-btn--outline">See All Reports</Link>
            <button className="in-cta-btn in-cta-btn--gold" onClick={() => handleCheckout("blueprint_foundation")} style={{ border: "none", cursor: "pointer" }}>
              Get The Blueprint Foundation ($99)
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
