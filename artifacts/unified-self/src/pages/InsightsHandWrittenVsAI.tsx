import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { handleCheckout } from "@/lib/checkout";
import { useSEO } from "@/hooks/useSEO";
import "./shared.css";
import "./insights.css";

export default function InsightsHandWrittenVsAI() {
  useSEO({
    title: "Hand-Written vs. AI-Generated Soul Reports: What's Actually Different",
    description: "Free instant soul blueprints and AI birth chart tools are everywhere now. Here's the real difference between a template applied to your data and a document written by a person who actually read it.",
    path: "/insights/hand-written-vs-ai-soul-blueprint",
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
          <h1>Hand-Written vs. AI-Generated<br />Soul Reports: What's Actually Different.</h1>
        </section>

        <article className="in-article">
          <Link href="/insights" className="in-back">← Back to Insights</Link>

          <p>You can get a free "soul blueprint" in about two minutes now. Enter your birth date, time, and place, and an algorithm hands you a multi-section report covering your energy type, your love blueprint, your career path, your shadow work. It looks thorough. It arrives instantly. And it was never written by anyone.</p>

          <p>That's worth understanding clearly, not as a knock on free tools, but because the difference matters for what you actually get back.</p>

          <h2>What an automated report is doing</h2>

          <p>An AI-generated reading takes your birth data, runs it through the same calculations everyone's data runs through, then pulls pre-written paragraphs that match your specific placements. Your Sun in a particular sign triggers a block of text written once and served to every person who shares that placement. Layer four or five systems together and the tool is really just stitching several of those template blocks into one document. It's fast. It's often accurate at the level of "people with this placement tend to." What it can't do is read your data as a whole, specific person and notice what only shows up when your Life Path number, your Human Design Authority, and your Gene Keys Shadow are held in the same hand at the same time.</p>

          <div className="in-pull">
            <p>"A template describes people who share your placement. A person can describe you."</p>
          </div>

          <h2>What a hand-written report is actually doing</h2>

          <p>When a Soul Blueprint is written by a person, your birth data doesn't trigger a lookup. It gets read. Someone runs your full Numerology profile, your Western and Vedic charts, your Human Design, and your Gene Keys, then sits with all five at once and asks what they're saying about you specifically, not about the category of people who share one of your placements. Where the systems agree, that agreement becomes the spine of your document. Where they create tension with each other, that tension gets named and explained, because it's usually pointing at something true and specific about how you actually live.</p>

          <p>This is also why it takes longer. Every Soul Blueprint here is delivered within 72 hours, not instantly, because the document is being written, not generated. Nothing in it is copied from a previous report. There's no library of pre-written paragraphs waiting to be assembled.</p>

          <h2>How to tell the difference before you buy</h2>

          <p>A few honest questions to ask any service before you order: Is the report delivered instantly, or does it take real time? Does the provider say anywhere that it's automated, AI-generated, or algorithmic? Does the sample look identical in structure to what every other customer received, just with different placements swapped in? None of these are bad on their own; a fast, free, automated tool has real value as a starting point. But if what you're looking for is a document that reads like someone actually looked at your specific data and wrote to you, those are the questions that tell you which one you're getting.</p>

          <p>You can see exactly what a hand-written Soul Blueprint looks like on the <Link href="/sample">Sample Report</Link> page: real pages, real structure, written from one specific person's birth data, not a template.</p>
        </article>

        <div className="in-cta">
          <h3>See the difference for yourself.</h3>
          <p>Preview a real, hand-written Soul Blueprint, or order your own from your exact birth data.</p>
          <div className="in-cta-links">
            <Link href="/sample" className="in-cta-btn in-cta-btn--outline">See a Sample Report</Link>
            <button className="in-cta-btn in-cta-btn--gold" onClick={() => handleCheckout("soul_blueprint")} style={{ border: "none", cursor: "pointer" }}>
              Order Your Blueprint ($222)
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
