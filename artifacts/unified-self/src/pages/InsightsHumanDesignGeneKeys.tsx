import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { handleCheckout } from "@/lib/checkout";
import { useSEO } from "@/hooks/useSEO";
import "./shared.css";
import "./insights.css";

export default function InsightsHumanDesignGeneKeys() {
  useSEO({
    title: "Human Design + Gene Keys: How They Work Together | The Unified Spirit",
    description: "The same 64 gates, spoken in two different languages: Human Design tells you your Type and Strategy, Gene Keys tells you the shadow and gift each gate carries. Here's what changes when you read them as one instrument.",
    path: "/insights/human-design-and-gene-keys",
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
          <h1>Human Design + Gene Keys:<br />How They Work Together.</h1>
        </section>

        <article className="in-article">
          <Link href="/insights" className="in-back">← Back to Insights</Link>

          <p>Almost no one has been shown these two systems read together.</p>

          <p>Most people encounter Human Design and Gene Keys as two separate things: two different websites, two different charts, two different vocabularies. You get a Human Design report that tells you your Type and your Strategy. Separately, maybe years later, you get a Gene Keys profile that tells you your Life's Work carries a Shadow, a Gift, and a Siddhi. Both are accurate, and both are incomplete on their own, because both systems are reading <em>the same 64 gates</em>, just in two different languages.</p>

          <h2>The shared foundation: 64 gates</h2>

          <p>Human Design and Gene Keys were both built on the same underlying structure: the 64 hexagrams of the I Ching, mapped against your exact birth data. Human Design was synthesized in 1987 from the I Ching, the Kabbalah, the Hindu-Brahmin chakra system, and Western Astrology. Gene Keys, developed later by Richard Rudd, uses the identical 64-gate architecture but reads it through an evolutionary lens instead of a mechanical one.</p>

          <p>This is the part almost nobody explains clearly: your Gene Keys profile and your Human Design chart are not two unrelated readings. They are two different instruments pointed at the same exact gates in your design. Read separately, you get two partial descriptions. Read together, from the same gates, they become one instrument instead of two.</p>

          <div className="in-pull">
            <p>"The mechanics of how you are built, and the myth of what you are becoming, read from the same gates."</p>
          </div>

          <h2>What Human Design tells you</h2>

          <p>Human Design is mechanical. It maps how your energy body actually operates: your <strong>Type</strong> (one of five, determining whether your energy is sustainable, built for bursts, or something else entirely), your <strong>Strategy</strong> (the way you're specifically designed to engage with life), your <strong>Authority</strong> (the exact internal signal your body uses to make decisions that are correct for you, not correct by logic), your <strong>Profile</strong>, and your defined and open energy Centers, where your energy is reliable and where you're porous to the energy of everyone around you.</p>

          <p>This is the "how." It tells you the operating instructions for the vehicle you're driving.</p>

          <h2>What Gene Keys tells you</h2>

          <p>Gene Keys is evolutionary. It takes the same gates and reads them as a spectrum (Shadow, Gift, Siddhi) for four specific sequences: your <strong>Life's Work</strong>, your <strong>Evolution</strong>, your <strong>Radiance</strong>, and your <strong>Purpose</strong>. The Shadow isn't a flaw so much as the same energy operating at the frequency of fear, before it's released into the Gift and, eventually, at its fullest expression, the Siddhi.</p>

          <p>This is the "why" and the "toward what." It tells you what the vehicle was actually built to become.</p>

          <h2>Why reading them together changes everything</h2>

          <p>When you read your Human Design Type and Strategy next to your Gene Keys Life's Work Gate (from the same gate, not a different one), the mechanics and the myth start explaining each other. The specific way you're built to make decisions turns out to be directly connected to the specific shadow pattern you've been circling your whole life, and to the specific gift waiting on the other side of it. Your Not-Self theme in Human Design and your Shadow frequency in Gene Keys are often naming the exact same experience from two different vocabularies.</p>

          <p>Layer in your <strong>Numerology</strong> (your Life Path, your Expression, your Soul Urge) and the pattern gets confirmed in a third, entirely independent language, built from completely different math. When three unrelated systems converge on the same underlying truth about you, that convergence is the signal worth paying attention to.</p>

          <h2>What this reading does not yet show you</h2>

          <p>Numerology, Human Design, and Gene Keys together give you the mechanics of how you're built and the myth of what you're becoming, confirmed three ways. What it doesn't yet show you is the celestial architecture of the sky at the exact moment you were born, read through both the Western and Vedic lens. That's where the full <Link href="/reports">Soul Blueprint</Link> picks up, adding your inner psychology and your soul's karmic contract to complete the five-system picture.</p>

          <p>If you want to start with exactly this convergence (Numerology, Human Design, and Gene Keys, read as one instrument), that's <Link href="/reports">The Gate Reading</Link>, built specifically around this exact synthesis.</p>
        </article>

        <div className="in-cta">
          <h3>See your gates read as one instrument.</h3>
          <p>The Gate Reading combines Numerology, Human Design, and Gene Keys from your exact birth data, or go all the way with the complete five-system Soul Blueprint.</p>
          <div className="in-cta-links">
            <Link href="/reports" className="in-cta-btn in-cta-btn--outline">See All Reports</Link>
            <button className="in-cta-btn in-cta-btn--gold" onClick={() => handleCheckout("gate_reading")} style={{ border: "none", cursor: "pointer" }}>
              Get The Gate Reading: $99
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
