import { useEffect } from "react";
import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { handleCheckout } from "@/lib/checkout";
import "./shared.css";
import "./sample.css";

function useFadeIn() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const SECTIONS = [
  {
    num: "01",
    title: "Your Personal Opening Letter",
    tag: "Where It Begins",
    desc: "Your report opens with a letter written directly to you. Not a template, not a greeting — a personal acknowledgment of who you are, what you carry, and why this document exists. By the time you finish the first page, you will know this was written for you and only you.",
    highlights: [
      "Written to you by name",
      "Speaks directly to your specific energetic signature",
      "Sets the tone for everything that follows",
    ],
  },
  {
    num: "02",
    title: "In-Depth System Breakdowns",
    tag: "The Four Lenses",
    desc: "Each of the four systems is explored in full depth — not summaries, not overviews. For every calculation, you receive a complete explanation of what it means, how it applies to your specific life, and exactly how it shows up in your patterns, relationships, decisions, and energy. This section alone runs dozens of pages.",
    highlights: [
      "Human Design: your Type, Strategy, Authority, Profile, defined and open Centers — explained in full, applied to your life",
      "Astrology: your Sun, Moon, Rising, and key planetary placements — what each one means and where you live it",
      "Numerology: your Life Path, Expression, Soul Urge, and more — the numbers that govern your path and purpose",
      "Gene Keys: your Shadow patterns, Gifts, and highest expression — what you are here to move through and become",
    ],
  },
  {
    num: "03",
    title: "Your 25+ Key Aspects",
    tag: "The Core Truths",
    desc: "Over 25 statements drawn from the intersection of all four systems — the aspects of you that no single system could reveal on its own. These are the truths you have always carried but may have never had the language for. The ones that will make you feel, finally, completely understood.",
    highlights: [
      "Each aspect is specific to your exact birth data",
      "Covers your energy, emotional patterns, gifts, purpose, relationships, and shadows",
      "Includes the ones you most need to hear",
    ],
  },
  {
    num: "04",
    title: "The Full Synthesis",
    tag: "The Mirror",
    desc: "This is where all four systems come together into one complete picture of you. Not four separate readings placed side by side — a true synthesis. This section goes into depth on three things most readings never touch: how others perceive you, how you perceive yourself, and what your life looks like when you are in alignment versus when you are not.",
    highlights: [
      "How others experience you — the impression you leave, the energy you project, what people feel in your presence",
      "How you experience yourself — your internal world, your self-perception, where it matches and where it diverges from your design",
      "Life in alignment — what it looks, feels, and moves like when you are fully living your blueprint",
      "Life out of alignment — the patterns, feelings, and recurring experiences that signal you have drifted from yourself",
    ],
  },
  {
    num: "05",
    title: "52-Week Alignment Workbook",
    tag: "The Living Practice",
    desc: "Your report does not end when you finish reading it. Included is a complete 52-week alignment workbook — one focused topic per week, with daily personal inquiry questions drawn directly from your profile. Every question was written for you, about you, to reach you in the way your soul has needed. This is a year of guided inner work built entirely from who you are.",
    highlights: [
      "52 weeks of deep personal inquiry — one theme per week",
      "Daily questions written from your specific design, not generic prompts",
      "Covers your shadow work, gifts, relationships, purpose, and alignment",
      "A living document you will return to throughout the year",
    ],
  },
];

export default function Sample() {
  useFadeIn();

  return (
    <div className="tus-page">
      <Starfield fixed />
      <Nav />

      {/* ── HERO ── */}
      <section className="sample-hero">
        <div className="inner-sm" style={{ textAlign: "center" }}>
          <span className="tag fade-in">What's Inside</span>
          <h1 className="sec-title fade-in" style={{ fontSize: "clamp(1.8rem,5vw,3rem)", marginBottom: 20 }}>
            Your Soul Blueprint,<br />In Full.
          </h1>
          <p className="sec-body fade-in" style={{ marginBottom: 36 }}>
            This is not a reading. It is an introduction to yourself — in more depth, more clarity,
            and more truth than you have likely ever received. Here is exactly what is inside.
          </p>
          <div className="sample-stats fade-in">
            <div className="sample-stat"><span>4</span>Systems, In Depth</div>
            <div className="sample-stat"><span>25+</span>Key Aspects</div>
            <div className="sample-stat"><span>75+</span>Pages</div>
            <div className="sample-stat"><span>52</span>Week Workbook</div>
          </div>
        </div>
      </section>

      <div className="rule"><span>✦</span></div>

      {/* ── SECTIONS ── */}
      <section>
        <div className="inner">
          {SECTIONS.map(({ num, title, tag, desc, highlights }) => (
            <div key={num} className="report-section fade-in">
              <div className="report-num">{num}</div>
              <div className="report-content">
                <div className="report-tag">{tag}</div>
                <h3 className="report-title">{title}</h3>
                <p className="report-desc">{desc}</p>
                <ul className="report-highlights">
                  {highlights.map((h) => (
                    <li key={h}>
                      <span className="check">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="rule"><span>✦</span></div>

      {/* ── WORKBOOK CALLOUT ── */}
      <section>
        <div className="inner-sm">
          <div className="workbook-callout fade-in">
            <div className="workbook-icon">◯</div>
            <h3 className="workbook-title">A Year of Knowing Yourself.</h3>
            <p className="workbook-body">
              Most people read something like this once, feel seen for a moment, and then return to living
              the same way they always have. The alignment workbook exists so that does not happen.
              Fifty-two weeks. One theme at a time. Daily questions that go exactly where your design
              asks you to go. Written entirely for you — not adapted, not personalized from a template.
              Written <em>for you</em>, from your profile, because that is the only way these questions
              will actually reach you.
            </p>
          </div>
        </div>
      </section>

      <div className="rule"><span>✦</span></div>

      {/* ── TESTIMONIAL PULL ── */}
      <section>
        <div className="inner-sm">
          <div className="sample-quote fade-in">
            <div className="sample-quote-stars">★★★★★</div>
            <p className="sample-quote-text">
              "I have spent years trying to understand myself. This report did in 24 hours what years
              of searching could not. I read it three times and cried twice. I finally feel seen —
              not by someone who knows me, but by something that knows me completely."
            </p>
            <div className="sample-quote-name">Kayla M. &nbsp;·&nbsp; <span>Atlanta, GA</span></div>
          </div>
        </div>
      </section>

      <div className="rule"><span>✦</span></div>

      {/* ── CTA ── */}
      <section style={{ textAlign: "center" }}>
        <div className="inner-sm">
          <span className="tag fade-in">Ready?</span>
          <h2 className="sec-title fade-in">This Is Your Map.<br />It Has Always Been Yours.</h2>
          <p className="sec-body fade-in">
            Provide your birth details at checkout. Your complete Soul Blueprint — 75+ pages plus
            your 52-week alignment workbook — is delivered to your email within 24 hours.
          </p>
          <div className="sample-cta-row fade-in">
            <button className="hero-btn" onClick={() => handleCheckout("soul_blueprint")}>
              ✦ &nbsp;Reveal My Blueprint — $49.95
            </button>
            <Link href="/faq" className="outline-btn">View FAQ</Link>
          </div>
          <p className="sample-guarantee fade-in">
            ✓ &nbsp;PDF delivered to your email &nbsp;·&nbsp; ✓ &nbsp;Hand-crafted, never automated
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
