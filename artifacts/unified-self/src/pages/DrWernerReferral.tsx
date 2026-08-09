import { useEffect, useRef } from "react";
import { handleCheckout } from "@/lib/checkout";
import "./drwerner.css";

function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = document.body.scrollHeight;
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const count = Math.floor((canvas!.width * canvas!.height) / 5500);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas!.width;
        const y = Math.random() * canvas!.height;
        const r = Math.random() * 1.1;
        const alpha = Math.random() * 0.45 + 0.08;
        const gold = Math.random() > 0.6;
        ctx!.beginPath();
        ctx!.arc(x, y, r, 0, Math.PI * 2);
        ctx!.fillStyle = gold
          ? `rgba(201,168,76,${alpha})`
          : `rgba(240,236,228,${alpha * 0.55})`;
        ctx!.fill();
      }
    }

    resize();
    draw();

    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => { resize(); draw(); }, 200);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

const DR_WERNER_URL = "https://www.anandahealth.care/";

export default function DrWernerReferral() {
  return (
    <div className="dw-page">
      <StarCanvas />

      {/* ── REFERRAL BAR ── */}
      <div className="dw-ref-bar">
        <div className="dw-ref-bar-inner">
          <div className="dw-ref-left">
            <div className="dw-ref-diamond">✦</div>
            <div className="dw-ref-text">
              You were personally referred by{" "}
              <a href={DR_WERNER_URL} target="_blank" rel="noopener noreferrer">
                <strong style={{ whiteSpace: "nowrap" }}>Dr. Mykayla Werner, ND</strong>
              </a>
              . This page and the rate on it were made exclusively for her patients.
            </div>
          </div>
          <div className="dw-ref-brand">The Unified Spirit</div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="dw-hero" style={{ position: "relative", zIndex: 1 }}>
        <div className="dw-hero-glow" />
        <div className="dw-hero-eyebrow">A Gift From Dr. Werner</div>
        <h1>
          You have always known<br />more than you knew<br />how to <em>explain.</em>
        </h1>
        <p className="dw-hero-sub">
          Dr. Werner sent you here because she believes you're ready for this. What follows is a complete map of who you were built to be: built from your name, your birthdate, and four ancient systems applied simultaneously to your specific data.
        </p>
        <div className="dw-hero-cta">
          <a href="#framework" className="dw-cta-btn">✦ &nbsp; See What's Inside</a>
          <div className="dw-hero-meta">Scroll to explore &nbsp;·&nbsp; Price at the bottom</div>
        </div>
        <div className="dw-scroll-hint">
          <span>Read</span>
          <div className="dw-scroll-line" />
        </div>
      </section>

      {/* ── WELCOME FROM DR. WERNER ── */}
      <div className="dw-welcome">
        <div className="dw-welcome-inner">
          <img
            src="/dr-werner.jpg"
            alt="Dr. Mykayla Werner, ND"
            className="dw-dr-photo"
          />
          <div className="dw-welcome-text">
            Welcome! You were referred by <em style={{ whiteSpace: "nowrap" }}>Dr. Werner, ND.</em><br />
            This page is exclusively for you.
          </div>
          <p className="dw-welcome-sub">
            Dr. Werner created space for you to receive this because she knows that understanding who you are at the root level is part of healing. This report was designed to meet exactly that: not as a supplement to her care, but as a companion to it.
          </p>
          <a
            href={DR_WERNER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="dw-dr-link"
          >
            ✦ &nbsp; Visit Dr. Werner's Practice
          </a>
        </div>
      </div>

      {/* ── FRAMEWORK ── */}
      <div className="dw-framework-panel" id="framework">
        <div className="dw-framework-inner">

          {/* PHASE 1 */}
          <div className="dw-phase">
            <div>
              <div className="dw-phase-num">01</div>
              <div className="dw-phase-tag">Phase One<br />The Deep-Dives</div>
            </div>
            <div>
              <div className="dw-phase-title">The Isolated Deep-Dives</div>
              <p className="dw-phase-body">Four exhaustive standalone audits, run against the exact mathematical coordinates of your birth and name, to isolate the core elements of your mechanics.</p>
              <div className="dw-systems-grid">
                <div className="dw-sys-card">
                  <div className="dw-sys-name">Numerology</div>
                  <div className="dw-sys-desc">The mathematics of your name and the moment you arrived.</div>
                  <p className="dw-sys-body">Your Life Path, Expression, Soul Urge, and the karmic architecture running underneath every decision you make.</p>
                </div>
                <div className="dw-sys-card">
                  <div className="dw-sys-name">Astrology</div>
                  <div className="dw-sys-desc">The sky at the exact moment you took your first breath.</div>
                  <p className="dw-sys-body">Not your sun sign. The full natal chart: every planet, every house, every tension and gift in your specific sky.</p>
                </div>
                <div className="dw-sys-card">
                  <div className="dw-sys-name">Human Design</div>
                  <div className="dw-sys-desc">How your body was designed to move through the world.</div>
                  <p className="dw-sys-body">Your energy type, strategy, and authority, and why ignoring them has cost you the most.</p>
                </div>
                <div className="dw-sys-card">
                  <div className="dw-sys-name">Gene Keys</div>
                  <div className="dw-sys-desc">The shadow you carry and the gift hidden inside it.</div>
                  <p className="dw-sys-body">The patterns holding you back are not random. They are coded, and when named precisely, become the material your highest expression is made from.</p>
                </div>
              </div>
            </div>
          </div>

          {/* PHASE 2 */}
          <div className="dw-phase">
            <div>
              <div className="dw-phase-num">02</div>
              <div className="dw-phase-tag">Phase Two<br />The Synthesis</div>
            </div>
            <div>
              <div className="dw-phase-title">The Cross-System Synthesis</div>
              <p className="dw-phase-body">We cross-examine all four systems simultaneously to find where they intersect, eliminating conflicting generalities and weaving the fragments into a single, cohesive master operating manual. Not four reports stitched together. One integrated narrative of who you are and what you were built to build.</p>
            </div>
          </div>

          {/* PHASE 3 */}
          <div className="dw-phase">
            <div>
              <div className="dw-phase-num">03</div>
              <div className="dw-phase-tag">Phase Three<br />The Practice</div>
            </div>
            <div>
              <div className="dw-phase-title">The 52-Week Custom Alignment &amp; Shadow Work Journal</div>
              <p className="dw-phase-body">Reading your map is only half the battle. Living it is where the transformation happens.</p>
              <div className="dw-journal-card">
                <div className="dw-journal-card-header">
                  <span className="dw-included-badge">Included</span>
                  <span className="dw-journal-card-title">52-Week Integration Journal</span>
                </div>
                <div className="dw-journal-card-body">
                  <ul className="dw-journal-bullets">
                    <li><span><strong>Zero Generic Prompts.</strong> Every page built directly from your shadow triggers, genetic gifts, and structural design.</span></li>
                    <li><span><strong>1 Weekly Theme.</strong> A targeted, data-backed focus drawn from your primary evolutionary lessons, life path cycles, and energetic boundaries.</span></li>
                    <li><span><strong>1 Daily Prompt.</strong> A specific deep-dive question every day, designed to dismantle your specific shadows and return you to your highest alignment.</span></li>
                  </ul>
                  <div className="dw-journal-stats">
                    <div className="dw-jstat">
                      <div className="dw-jstat-val">52</div>
                      <div className="dw-jstat-label">Custom weekly themes</div>
                    </div>
                    <div className="dw-jstat">
                      <div className="dw-jstat-val">365</div>
                      <div className="dw-jstat-label">Daily prompts for you alone</div>
                    </div>
                    <div className="dw-jstat">
                      <div className="dw-jstat-val">2</div>
                      <div className="dw-jstat-label">PDFs in your inbox</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── TESTIMONIAL ── */}
      <div className="dw-testimonial-panel">
        <div className="dw-stars">★★★★★</div>
        <blockquote>"I have spent years trying to understand myself. This did in 24 hours what years of searching could not. I read it three times and cried twice. I finally feel seen, not by someone who knows me, but by something that knows me completely."</blockquote>
        <div className="dw-attr">Kayla M. &nbsp;·&nbsp; Atlanta, GA</div>
      </div>

      {/* ── CLOSING ── */}
      <div className="dw-close-panel">
        <h2>This is your map.<br />It has always been yours.</h2>
        <p>Give us your birth details at checkout. Your complete Soul Blueprint and 52-week journal arrive in your inbox within 24 hours: hand-crafted, never automated, written to you alone.</p>
        <div className="dw-price-block">
          <div className="dw-price-row">
            <span className="dw-price-was">$222</span>
            <span className="dw-price-now">$150</span>
          </div>
          <div className="dw-price-note">Exclusive rate for patients of{" "}
            <a href={DR_WERNER_URL} target="_blank" rel="noopener noreferrer" className="dw-dr-close-link">
              Dr. Mykayla Werner, ND
            </a>
          </div>
        </div>
        <button className="dw-cta-btn" onClick={() => handleCheckout("werner_blueprint")}>
          ✦ &nbsp; Reveal My Blueprint
        </button>
        <div className="dw-close-meta">
          PDF delivered to your email &nbsp;·&nbsp; Personal to you alone &nbsp;·&nbsp; Within 24 hours
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="dw-footer">
        <span>The Unified Spirit</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}
