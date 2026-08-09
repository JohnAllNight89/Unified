import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { handleCheckout } from "@/lib/checkout";
import { useSEO } from "@/hooks/useSEO";
import "./shared.css";
import "./insights.css";

export default function InsightsCouplesBlueprint() {
  useSEO({
    title: "What Is the Couples Blueprint? Reading Two Designs Together",
    description: "Two individual Soul Blueprints tell you who each person is. The Couples Blueprint tells you what happens when those two specific designs meet: where you amplify each other, where friction lives, and why.",
    path: "/insights/couples-blueprint-explained",
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
          <h1>What Is the Couples Blueprint?<br />Reading Two Designs Together.</h1>
        </section>

        <article className="in-article">
          <Link href="/insights" className="in-back">← Back to Insights</Link>

          <p>Two people can each get an individual Soul Blueprint and still be missing the most useful part: what happens when their two specific designs actually meet.</p>

          <p>Knowing your own Human Design Type, your own Life Path, your own Gene Keys shadow patterns tells you a great deal about yourself in isolation. It doesn't tell you what happens when your particular way of processing decisions runs into someone else's particular way of processing decisions. That's a different question, and it needs a different kind of reading.</p>

          <h2>Not two reports side by side</h2>

          <p>The Couples Blueprint starts with two complete Soul Blueprints, one built from each person's individual birth data. But the part that actually answers the question two people are usually asking, "why does this work the way it works between us," is the compatibility synthesis layered on top: a full cross-examination of both designs across all five systems, run against each other rather than read separately.</p>

          <div className="in-pull">
            <p>"Two individual readings tell you who you each are. The synthesis tells you what you're building together."</p>
          </div>

          <h2>What the synthesis actually looks at</h2>

          <p>Where do your energies amplify each other, and where is friction structurally built into the two designs rather than being a communication problem either person could simply fix? If one person's Human Design Authority requires time and space to reach a decision, and the other's is wired for instant clarity, that's not a flaw in either person; it's a mechanical difference worth understanding before it turns into a repeated argument neither of you can quite name.</p>

          <p>The same cross-examination runs through Numerology (where your Life Paths support or challenge each other), both astrology systems (where your charts create harmony or tension), and Gene Keys (where one person's Shadow pattern might be sitting directly across from the other's Gift, in either direction). None of this is about compatibility scores or percentage matches. It's about naming, specifically, what two particular people are working with.</p>

          <h2>Not only for romantic partners</h2>

          <p>The Couples Blueprint is written for romantic partners, but the same synthesis is genuinely useful for close friendships and business partnerships. A business partnership where one person is built to initiate and the other is built to respond needs to understand that dynamic structurally, not just personally, or it tends to surface as resentment instead of a workable division of roles.</p>

          <h2>What you actually receive</h2>

          <p>Two complete Soul Blueprints, 75+ pages each, plus the full synastry synthesis: where you amplify each other, where friction lives and why, and what you're specifically positioned to build together. It also includes a 52-week Synastry Alignment &amp; Shadow Journal built from your combined data, one theme a week, written for your relationship's specific design rather than generic relationship prompts.</p>
        </article>

        <div className="in-cta">
          <h3>Read your design together.</h3>
          <p>The Couples Blueprint includes two complete Soul Blueprints plus a full compatibility synthesis, available for partners, friendships, and business relationships.</p>
          <div className="in-cta-links">
            <Link href="/reports" className="in-cta-btn in-cta-btn--outline">See All Reports</Link>
            <button className="in-cta-btn in-cta-btn--gold" onClick={() => handleCheckout("couples_blueprint")} style={{ border: "none", cursor: "pointer" }}>
              Read Our Blueprint ($333)
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
