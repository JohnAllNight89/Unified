import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { handleCheckout } from "@/lib/checkout";
import { useSEO } from "@/hooks/useSEO";
import "./shared.css";
import "./insights.css";

export default function InsightsWhatIsASoulBlueprint() {
  useSEO({
    title: "What Is a Soul Blueprint? Why One System Is Never Enough | The Unified Spirit",
    description: "A true Soul Blueprint isn't another reading of one system, it's the deliberate synthesis of Numerology, Western Astrology, Vedic Astrology, Human Design, and Gene Keys into one coherent portrait of who you were designed to be.",
    path: "/insights/what-is-a-soul-blueprint",
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
          <h1>What Is a Soul Blueprint?<br />Why One System Is Never Enough.</h1>
        </section>

        <article className="in-article">
          <Link href="/insights" className="in-back">← Back to Insights</Link>

          <p>You can feel when something is missing.</p>

          <p>You have your Human Design chart. You've looked at your Gene Keys. You've calculated your Life Path. You've studied your birth chart, maybe more than once, maybe from more than one astrologer. And still, something doesn't fully click. Each reading tells you something true, and each one leaves a gap right next to it.</p>

          <p>That gap isn't a flaw in any single system; it's the absence of synthesis between them.</p>

          <h2>What a Soul Blueprint actually is</h2>

          <p>A true Soul Blueprint isn't another reading of one system, it's the deliberate weaving of five complete wisdom systems, <strong>Numerology, Western Astrology, Vedic Astrology, Human Design, and Gene Keys</strong>, into one coherent, living portrait of who you were designed to be.</p>

          <p>Most people receive fragments. A numerology report that names a Life Path number. A birth chart reading that describes a Sun sign and a Rising sign. A Human Design summary that names a Type and a Strategy. Each one is accurate as far as it goes. None of them, on their own, tells you the whole truth about who you are.</p>

          <div className="in-pull">
            <p>"Most people receive fragments. A Soul Blueprint gives you the whole."</p>
          </div>

          <h2>Why single-system readings leave gaps</h2>

          <p>Every system was built by a different tradition, in a different era, looking at a different layer of the same person. Numerology reads the mathematics encoded in your name and birth date. Astrology reads the sky at the exact moment you arrived: Western Astrology through the tropical lens of your psychology, Vedic Astrology through the sidereal lens of your soul's karmic path. Human Design reads the mechanics of how your energy actually operates. Gene Keys reads the evolutionary spectrum running from your shadow toward your gift.</p>

          <p>None of these systems was designed to see what the others see, which is exactly why each one stays precise within its own domain. But it means a single reading, however accurate, is a description of one layer of a five-layer person.</p>

          <h2>What each system uniquely contributes</h2>

          <p><strong>Numerology</strong> names the mathematical arc your entire life is organized around: the frequency encoded in your name and your birth date, before anyone had an opinion about who you were.</p>

          <p><strong>Western Astrology</strong> maps your inner world: the planets, houses, and aspects that shape your psychology and the patterns that surface in how you relate to people.</p>

          <p><strong>Vedic Astrology</strong> reads a different layer entirely: the karmic contract, the dharma, the soul-level lessons encoded in the sidereal sky at your birth, roughly 23 degrees behind the tropical placements most people already know.</p>

          <p><strong>Human Design</strong> maps the mechanics: how your energy body actually operates, how you're built to make decisions, and what happens when you override your own design.</p>

          <p><strong>Gene Keys</strong> maps the frequency spectrum each part of your design is moving through, from Shadow through Gift toward Siddhi, not flaws to fix, but your highest expression waiting at a different frequency.</p>

          <h2>How they illuminate each other</h2>

          <p>The real value of a Soul Blueprint isn't in any single system's answer, it's in what happens when all five are cross-examined against each other. The places where they agree become the spine of the document: the parts of you that are true no matter which lens you look through. The places where they tension each other reveal the specific, textured dynamics that have actually shaped your experience: how you're perceived versus how you perceive yourself, what alignment costs you, what your specific version of purpose actually requires.</p>

          <p>That cross-examination is what a single-system reading structurally cannot produce. It requires holding all five systems simultaneously and asking, at every step, what they're saying about the same specific person, not what each one says about people in general who share a placement, a number, or a gate.</p>

          <h2>What a complete synthesis actually contains</h2>

          <p>A real Soul Blueprint isn't five reports stapled together; it's one integrated narrative (ten complete chapters, 75+ hand-written pages) covering each system in full, then a dedicated synthesis chapter naming exactly where they agree and where they don't, and a final chapter applying the whole picture to the specific arc your life is in right now. It also includes a 52-week Alignment &amp; Shadow Journal built entirely from your own data, not generic prompts, but questions written for your specific shadow patterns and design.</p>

          <p>You can see exactly what this looks like on the <Link href="/sample">Sample Report</Link> page: real chapters, real structure, no guesswork about what arrives in your inbox.</p>

          <h2>The difference between a template and a portrait</h2>

          <p>Free online readings and automated reports are generated by software and applied to everyone born under the same sign, number, or gate. They describe a type. A genuine Soul Blueprint is written personally, from your specific birth data, by someone holding all five systems at once, which is the only way the synthesis is actually possible. Nothing is copied. Nothing is templated. What arrives is a document that reads like someone has known you your whole life and is introducing you, for the first time, to the real you.</p>
        </article>

        <div className="in-cta">
          <h3>Ready to see your own synthesis?</h3>
          <p>Explore what's included in the complete Soul Blueprint, or preview a real sample report first.</p>
          <div className="in-cta-links">
            <Link href="/sample" className="in-cta-btn in-cta-btn--outline">See a Sample Report</Link>
            <button className="in-cta-btn in-cta-btn--gold" onClick={() => handleCheckout("soul_blueprint")} style={{ border: "none", cursor: "pointer" }}>
              Order Your Blueprint: $222
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
