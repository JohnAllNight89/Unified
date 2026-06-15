import { useEffect } from "react";
import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./shared.css";
import "./home.css";

export default function Home() {
  useEffect(() => {
    document.title = "The Unified Spirit — Soul Blueprint";
  }, []);

  return (
    <div className="tus-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />
      <main id="main-content">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="hm-hero" aria-labelledby="hm-hero-heading">
          <div className="hm-hero-glow" aria-hidden="true" />
          <div className="hm-eyebrow">The Unified Spirit</div>
          <h1 id="hm-hero-heading">
            You Were Built<br />
            With a Blueprint.<br />
            <em>We Can Prove It.</em>
          </h1>
          <p className="hm-hero-body">
            You were not an accident. You were not a random combination of circumstances.
            You arrived with a specific design, a specific purpose, and a specific set of gifts
            that belong to no one else on earth. This is the document that shows you exactly
            what that looks like.
          </p>
          <Link href="/reports" className="hm-hero-btn">✦&nbsp;&nbsp; See What&rsquo;s Available</Link>
          <div className="hm-scroll-hint" aria-hidden="true">
            <span className="hm-scroll-label">Read</span>
            <div className="hm-scroll-line" />
          </div>
        </section>

        {/* ── MISSION ──────────────────────────────────────────── */}
        <section className="hm-mission" aria-labelledby="hm-mission-heading">
          <div className="hm-mission-inner">
            <div className="hm-eyebrow">Why We Do This</div>
            <h2 id="hm-mission-heading">
              Most people spend their entire lives feeling like they are almost there.<br />
              <em>Almost aligned. Almost free. Almost themselves.</em>
            </h2>
            <p>
              Not because they are not trying. Because they do not have a map. They are navigating
              the most important terrain of their lives — who they are, what they are here for, why
              they work the way they work — with no instrument precise enough to tell them what they
              are actually looking at.
            </p>
            <p>That is what The Unified Spirit exists to change.</p>
            <p>
              We believe every person arrives in this life with a specific design. A specific purpose.
              A specific set of gifts that are unlike anyone else&rsquo;s — and a specific set of patterns
              that have been getting in the way of those gifts expressing themselves fully. We believe
              those things are not abstract. They are encoded. In the mathematics of your name, in the
              sky at the moment you were born, in the architecture of your energy body, in the
              frequencies of your DNA.
            </p>
            <p>
              We believe that when those four systems are read together — when they are cross-examined
              against each other and synthesized into a single coherent document written specifically
              for one person — something happens that does not happen any other way. People stop feeling
              like they are broken. They stop feeling like something is wrong with them. They start
              recognizing themselves — maybe for the first time — in something that tells the truth
              about who they actually are.
            </p>
            <p>
              That recognition is not a product. It is a turning point. And that is what every Soul
              Blueprint is written to produce.
            </p>
          </div>
        </section>

        {/* ── PULL QUOTE ───────────────────────────────────────── */}
        <section className="hm-pull" aria-label="Featured statement">
          <div className="hm-pull-inner">
            <p>
              &ldquo;We are not here to give you a personality type.<br />
              We are here to give you <em>yourself.</em>&rdquo;
            </p>
          </div>
        </section>

        {/* ── SYSTEMS BRIEF ────────────────────────────────────── */}
        <section className="hm-systems" aria-labelledby="hm-systems-heading">
          <div className="hm-systems-inner">
            <div className="hm-eyebrow">The Four Systems</div>
            <h2 id="hm-systems-heading">
              Four ancient disciplines.<br />
              <em>One integrated truth about you.</em>
            </h2>
            <p className="hm-systems-body">
              Each system was developed independently, in a different time and tradition. Each one
              sees a different dimension of what makes a human being who they are. No single system
              sees the whole picture. But when all four are applied simultaneously to the specific
              data of one person&rsquo;s birth — and synthesized into a single document — they produce
              something none of them can produce alone.
            </p>
            <div className="hm-systems-grid" role="list">
              {[
                { icon: "○", name: "Numerology",    desc: "The mathematics of your name and birth — the frequency you were sent here to carry." },
                { icon: "☽", name: "Astrology",     desc: "Vedic and Tropical charts synthesized — the sky at the exact moment of your birth." },
                { icon: "◆", name: "Human Design",  desc: "The mechanics of your energy body — how you are built to decide and move." },
                { icon: "✦", name: "Gene Keys",     desc: "The shadow and the gift encoded in your DNA — the path from fear to your highest expression." },
              ].map(({ icon, name, desc }) => (
                <div key={name} className="hm-sys-pill" role="listitem">
                  <div className="hm-sys-pill-icon" aria-hidden="true">{icon}</div>
                  <div>
                    <div className="hm-sys-pill-name">{name}</div>
                    <div className="hm-sys-pill-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────── */}
        <section className="hm-reviews" aria-labelledby="hm-reviews-heading">
          <div className="hm-reviews-inner">
            <div className="hm-eyebrow">What People Are Saying</div>
            <h2 id="hm-reviews-heading">
              These are not reviews<br />
              <em>of a product.</em>
            </h2>
            <p className="hm-reviews-body">
              These are moments of recognition. People encountering themselves — sometimes for
              the first time — in something that tells the truth.
            </p>

            {[
              {
                quote: "I've never felt so exposed, so open, so called out — and so seen in my life. I knew what I felt wasn't crazy. It's insane to think that off data alone... off numbers... it tells me there is a purpose and a design. That things are the way they are for a reason. And that I'm not broken. I've never felt so loved and so absolutely sure about everything. Thank you so much.",
                attr: "Shandel P. — Mesa, AZ",
              },
              {
                quote: "This said the quiet part out loud. The things I'd never tell anyone — this called me out when no one else would have. And it allowed me to stop and think. To perceive myself in another light. It gave me insight into my own thought process. And wow. I'm speechless.",
                attr: "Aaron I. — Nashville, TN",
              },
              {
                quote: "I believe God gave us tools to recognize truth in all things. Jesus didn't come to start a religion — he came to guide us and show us the way. This is one of the greatest things I've ever come across. The 52-week shadow journal was made from my own data, and each question, each day, only gets more in depth. It gives me the opportunity for insight into my mind — and understanding of why God, the universe, whatever you want to call our creator, is guiding us back to ourselves.",
                attr: "Jacob L. — Texas",
              },
              {
                quote: "I have spent years trying to understand myself. This did in 72 hours what years of searching could not. I read it three times and cried twice. I finally feel seen — not by someone who knows me, but by something that knows me completely.",
                attr: "Kayla M. — Atlanta, GA",
              },
              {
                quote: "I kept telling myself I would figure it out eventually. This report showed me that I already had. I just did not have the language for it yet. Everything I have always quietly known — it was all in there.",
                attr: "Marcus T. — Houston, TX",
              },
              {
                quote: "I ordered this for myself and then immediately ordered one for my sister. Some things in here I have never said to another living person. It knew anyway. I don't have a framework for what this is, but I know it's real. I've been sitting with it for two weeks and I keep finding new things.",
                attr: "Renee D. — Portland, OR",
              },
              {
                quote: "I was skeptical. I want to say that first. I am a logical person and I needed this to earn my trust. It did. Every single section. The way it described the way I process decisions, the way I move through relationships, the thing I have been avoiding — I don't know how numbers and a birth chart do this. But they did.",
                attr: "Daniel W. — Chicago, IL",
              },
              {
                quote: "My whole life I thought the way I was wired was a problem to solve. This was the first time anything told me it wasn't. It showed me why I'm built this way. What it's actually for. I cried reading the Gene Keys section because it named the exact fear I've been living inside of — and then it showed me what's on the other side of it.",
                attr: "Simone R. — Denver, CO",
              },
            ].map(({ quote, attr }) => (
              <blockquote key={attr} className="hm-review">
                <div className="hm-review-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <p className="hm-review-quote">&ldquo;{quote}&rdquo;</p>
                <footer className="hm-review-attr">{attr}</footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────── */}
        <section className="hm-cta" aria-labelledby="hm-cta-heading">
          <div className="hm-cta-inner">
            <div className="hm-eyebrow">A Final Word</div>
            <h2 id="hm-cta-heading">
              You were built with<br />
              a purpose. <em>Intentionally.</em>
            </h2>
            <p>
              The way you are wired is not a mistake. The intensity you carry belongs somewhere.
              The things you have always felt about yourself but could never prove — this document
              proves them. Not with opinion. With the precise mathematics of who you are. That is
              what a Soul Blueprint actually is.
            </p>
            <Link href="/reports" className="hm-btn-gold">✦&nbsp;&nbsp; See What&rsquo;s Available</Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
