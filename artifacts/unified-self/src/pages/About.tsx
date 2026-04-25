import { useEffect } from "react";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { handleCheckout } from "@/lib/checkout";
import "./shared.css";
import "./about.css";

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

const SYSTEMS = [
  {
    name: "Human Design",
    desc: "Your energetic blueprint — how you are designed to make decisions, use your energy, and move through the world without resistance.",
    icon: "⬡",
  },
  {
    name: "Astrology",
    desc: "The cosmic imprint of your birth moment — your Sun, Moon, Rising, and the planetary patterns woven into your character and life path.",
    icon: "☽",
  },
  {
    name: "Numerology",
    desc: "The numerical codes embedded in your birth date — your Life Path, Expression, and Soul Urge numbers that reveal your deeper purpose.",
    icon: "✦",
  },
  {
    name: "Gene Keys",
    desc: "The shadow patterns and gifts encoded in your DNA — the journey from your deepest wounds to your highest expression.",
    icon: "◯",
  },
];

export default function About() {
  useFadeIn();
  useEffect(() => { document.title = "About — The Unified Spirit"; }, []);

  return (
    <div className="tus-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />
      <main id="main-content">

      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="inner-sm" style={{ textAlign: "center" }}>
          <span className="tag fade-in">The Practitioner</span>
          <h1 className="sec-title fade-in" style={{ fontSize: "clamp(1.8rem,5vw,3rem)", marginBottom: 24 }}>
            Behind Every Blueprint<br />Is a Real Person.
          </h1>
          <p className="sec-body fade-in" style={{ marginBottom: 0 }}>
            I did not set out to do this work. I found it the way most people find their purpose —
            through the long way around. Through years of feeling out of place. Through searching
            in places that were never going to have my answers. And eventually, through the systems
            that finally gave me the language for everything I had always felt but could never explain.
          </p>
        </div>
      </section>

      <div className="rule" aria-hidden="true"><span>✦</span></div>

      {/* ── STORY ── */}
      <section>
        <div className="inner-sm">
          <span className="tag fade-in">My Story</span>
          <h2 className="sec-title fade-in">I Know What It Feels Like<br />To Not Have Your Map.</h2>
          <div className="about-story fade-in">
            <p>
              For most of my life, I operated from borrowed frameworks. The goals I was supposed to
              want. The way I was supposed to show up. The version of success that looked right from
              the outside and felt hollow on the inside.
            </p>
            <p>
              The turning point came when I stopped trying to fix what I thought was wrong with me
              and started asking a different question: <em>What if nothing is wrong with me?
              What if I simply have not been given the right map?</em>
            </p>
            <p>
              That question led me to Human Design. Then to Astrology. Then to Numerology and the
              Gene Keys. And what I discovered — across years of study and personal application —
              is that these four systems, when read together, do something that no single system
              can do on its own.
            </p>
            <p>
              They see you whole. They confirm what you have always quietly known. And they give you
              the language to finally live from that knowing — rather than around it.
            </p>
            <p>
              The Soul Blueprint is not a product I built. It is the report I wish someone had
              handed me at the beginning. Every person who receives one gets what took me years
              to piece together — synthesized, personalized, and delivered in 24 hours.
            </p>
          </div>
        </div>
      </section>

      <div className="rule" aria-hidden="true"><span>✦</span></div>

      {/* ── SYSTEMS ── */}
      <section>
        <div className="inner">
          <span className="tag fade-in">The Methodology</span>
          <h2 className="sec-title fade-in">Four Systems.<br />One Complete Picture.</h2>
          <p className="sec-body fade-in">
            Most readings give you one lens. The Soul Blueprint integrates four — because no single
            system captures the full complexity of who you are.
          </p>
          <div className="systems-grid">
            {SYSTEMS.map(({ name, desc, icon }) => (
              <div key={name} className="card system-card fade-in">
                <div className="system-icon">{icon}</div>
                <div className="system-name">{name}</div>
                <p className="system-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rule" aria-hidden="true"><span>✦</span></div>

      {/* ── WHAT YOU GET ── */}
      <section className="about-promise">
        <div className="inner-sm" style={{ textAlign: "center" }}>
          <span className="tag fade-in">My Promise To You</span>
          <h2 className="sec-title fade-in">Every Word Is Written For You.</h2>
          <p className="sec-body fade-in">
            Nothing in your report is copied from a template. Every sentence is written from your
            specific birth data — your exact date, time, and place. What arrives in your inbox
            is a document that will feel like someone has known you your entire life sat down
            and put you into words.
          </p>
          <div className="promise-stats fade-in">
            <div className="promise-stat">
              <div className="promise-num">4</div>
              <div className="promise-label">Systems, In Depth</div>
            </div>
            <div className="promise-stat">
              <div className="promise-num">25+</div>
              <div className="promise-label">Key Aspects</div>
            </div>
            <div className="promise-stat">
              <div className="promise-num">75+</div>
              <div className="promise-label">Pages, Hand-Written</div>
            </div>
            <div className="promise-stat">
              <div className="promise-num">52</div>
              <div className="promise-label">Week Workbook</div>
            </div>
          </div>
          <button
            className="hero-btn fade-in"
            onClick={() => handleCheckout("soul_blueprint")}
            style={{ margin: "0 auto" }}
          >
            ✦ &nbsp;Reveal My Blueprint
          </button>
        </div>
      </section>

      </main>
      <Footer />
    </div>
  );
}
