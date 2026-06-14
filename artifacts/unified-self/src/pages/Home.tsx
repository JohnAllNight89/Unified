import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useUser } from "@clerk/react";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { handleCheckout, handleSubscribe } from "@/lib/checkout";
import "./shared.css";
import "./home.css";

function useSubscriptionStatus() {
  const { isSignedIn } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);
  useEffect(() => {
    if (!isSignedIn) { setIsSubscribed(false); return; }
    fetch("/api/stripe/subscription-status", { credentials: "include" })
      .then((r) => r.ok ? r.json() : { status: "inactive" })
      .then((data: { status?: string }) => {
        setIsSubscribed(data.status === "active" || data.status === "trialing");
      })
      .catch(() => setIsSubscribed(false));
  }, [isSignedIn]);
  return isSubscribed;
}

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


export default function Home() {
  const [stickyHidden, setStickyHidden] = useState(false);
  const orderRef = useRef<HTMLElement>(null);
  const isSubscribed = useSubscriptionStatus();
  useFadeIn();

  const scrollToOrder = () => orderRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const handleScroll = () => {
      if (!orderRef.current) return;
      setStickyHidden(orderRef.current.getBoundingClientRect().top < window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="tus-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />
      <main id="main-content">

      {/* ── ANNOUNCEMENT BAR ─────────────────────────────────── */}
      <div className="announcement-bar" role="status" aria-label="Limited availability notice">
        <span>Four openings remain at founding price. &nbsp;When they close, this work returns to its full value.</span>
      </div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">You Were Designed With a Purpose</div>
        <h1 className="hero-h1" id="hero-heading">
          You Have Always Felt<br /><em>There Was More.</em>
        </h1>
        <div className="hero-lines" aria-label="Core truths">
          <p>You are not too much.</p>
          <p>You are not behind.</p>
          <p>You are not broken.</p>
          <p className="hero-final">You have simply been living without your map.</p>
        </div>
        <p className="hero-sub">It&rsquo;s time to read it.</p>
        <div className="hero-btns">
          <button className="hero-btn" onClick={() => handleCheckout("soul_blueprint")}>
            ✦ &nbsp;Reveal My Blueprint
          </button>
          <Link href="/sign-up" className="outline-btn">Join Free — Explore Your Data</Link>
        </div>
        <p className="hero-trust">
          ✓ &nbsp;Hand-crafted &nbsp;·&nbsp; ✓ &nbsp;Delivered in 24 hrs &nbsp;·&nbsp; ✓ &nbsp;Personal to you alone
        </p>
      </section>

      <div className="rule" aria-hidden="true"><span>✦</span></div>

      {/* ── SOUL CARDS ───────────────────────────────────────── */}
      <section aria-labelledby="soul-heading">
        <div className="inner">
          <span className="tag fade-in">We See You</span>
          <h2 className="sec-title fade-in" id="soul-heading">This Is For The One<br />Who Knows There Is More.</h2>
          <p className="sec-body fade-in">
            The one who has always felt different. Who feels things deeper than most people around
            them. Who is tired of almost — almost aligned, almost fulfilled, almost free.
          </p>
          <div className="soul-grid" role="list">
            {[
              { icon: "✦", title: "You Are Not Too Much", body: "The intensity you carry. The depth you feel. The knowing that arrives before you can explain it. That is not a flaw in your design. That is your design." },
              { icon: "◯", title: "You Are Not Behind",   body: "The detours. The seasons that broke you open. None of it was a mistake. All of it was building something in you that could not have been built any other way." },
              { icon: "☽", title: "You Were Built For This", body: "There is a version of you fully aligned with who you actually are. She is already in you. This report is going to introduce you to her." },
            ].map(({ icon, title, body }) => (
              <div key={title} className="soul-card card fade-in" role="listitem">
                <span className="soul-icon" aria-hidden="true">{icon}</span>
                <div className="soul-card-title">{title}</div>
                <p className="soul-card-text">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rule" aria-hidden="true"><span>✦</span></div>

      {/* ── PORTAL CTA ───────────────────────────────────────── */}
      <section aria-labelledby="portal-heading">
        <div className="inner">
          <span className="tag fade-in">Free Member Portal</span>
          <h2 className="sec-title fade-in" id="portal-heading">Start Here — for Free.</h2>
          <p className="sec-body fade-in">
            Create your free account and explore your soul data. Your numerology numbers, your natal chart, and the
            education behind the systems — all there for you the moment you join. No payment required to begin.
          </p>
          <div className="portal-preview-grid fade-in">
            <div className="portal-preview-card card">
              <div className="portal-prev-icon">◯</div>
              <div className="portal-prev-name">Numerology Calculator</div>
              <p className="portal-prev-desc">Your five core numbers — Life Path, Expression, Soul Urge, Personality, and Birth Day — with their meanings.</p>
            </div>
            <div className="portal-preview-card card">
              <div className="portal-prev-icon">☽</div>
              <div className="portal-prev-name">Natal Chart</div>
              <p className="portal-prev-desc">Every planetary position at the moment of your birth. Sun, Moon, Rising, and all eight planets — calculated from your data.</p>
            </div>
            <div className="portal-preview-card card">
              <div className="portal-prev-icon">◈</div>
              <div className="portal-prev-name">Human Design &amp; Gene Keys</div>
              <p className="portal-prev-desc">Deep introductions to both systems — what they are, how they work, and what they reveal about your design.</p>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link href="/sign-up" className="hero-btn fade-in">✦ &nbsp;Join Free — Explore Your Data</Link>
          </div>
        </div>
      </section>

      <div className="rule" aria-hidden="true"><span>✦</span></div>

      {/* ── TRUTH LINES ──────────────────────────────────────── */}
      <section className="truth-section" aria-labelledby="truth-heading">
        <span className="tag fade-in">What Your Report Will Confirm</span>
        <h2 className="sec-title fade-in" id="truth-heading">The Truths You Have<br />Always Carried.</h2>
        <div className="truth-lines">
          {[
            ["The things you have always felt about yourself — ", "they are real."],
            ["The patterns that keep repeating in your life — ", "they are not random."],
            ["The feeling that you are meant for something significant — ", "it is not ego."],
            ["The depth that most people around you cannot match — ", "it is your greatest gift."],
            ["The hardest seasons you have lived through — ", "they were building something."],
            ["You were not broken. You were not behind. ", "You were being prepared."],
          ].map(([pre, em], i) => (
            <div key={i} className="truth-line fade-in">
              <span className="truth-check" aria-hidden="true">✓</span>
              <span>{pre}<strong style={{ color: "var(--goldL)" }}>{em}</strong></span>
            </div>
          ))}
        </div>
      </section>

      <div className="rule" aria-hidden="true"><span>✦</span></div>

      {/* ── ABOUT TEASER ─────────────────────────────────────── */}
      <section className="about-teaser" aria-labelledby="about-heading">
        <div className="inner">
          <div className="about-teaser-inner fade-in">
            <div className="about-teaser-text">
              <span className="tag" style={{ textAlign: "left", marginBottom: 12 }}>The Practitioner</span>
              <h2 id="about-heading" style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.3rem,3.5vw,2rem)", color: "#fff", lineHeight: 1.3, marginBottom: 16 }}>
                Behind Every Blueprint<br />Is a Real Person.
              </h2>
              <p style={{ color: "var(--text)", fontSize: ".95rem", lineHeight: 1.95, fontWeight: 300, marginBottom: 24 }}>
                After years of studying Human Design, Astrology, Numerology, and the Gene Keys, I
                created the Soul Blueprint to give others what it took me years to piece together —
                synthesized, personal, and delivered within 24 hours. Every word is written by hand.
                Nothing is generated or automated.
              </p>
              <Link href="/about" className="outline-btn">Read My Story →</Link>
            </div>
            <div className="about-teaser-stats" role="list" aria-label="Report statistics">
              {[["4","Systems In Depth"],["25+","Key Aspects"],["75+","Pages"],["52","Week Workbook"]].map(([n,l]) => (
                <div key={l} className="about-stat" role="listitem">
                  <div className="about-stat-num" aria-label={`${n} ${l}`}>{n}</div>
                  <div className="about-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="rule" aria-hidden="true"><span>✦</span></div>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section aria-labelledby="process-heading">
        <div className="inner">
          <span className="tag fade-in">How It Works</span>
          <h2 className="sec-title fade-in" id="process-heading">Simple. Personal.<br />Life-Changing.</h2>
          <p className="sec-body fade-in">No forms to fill. No questionnaires. Just your birth data — and 24 hours.</p>
          <div className="steps" role="list">
            {[
              ["Share Your Birth Data",     "Your date, time (if known), and place of birth at checkout. That is everything we need to build your complete profile."],
              ["We Build It By Hand",        "Your report is written personally from your specific data. Every sentence is for you and only you. Nothing is automated."],
              ["It Arrives In Your Inbox",   "Your complete Soul Blueprint PDF lands in your email within 24 hours — usually the same day. Yours to keep forever."],
            ].map(([title, body], i) => (
              <div key={i} className="step fade-in" role="listitem">
                <div className="step-num" aria-label={`Step ${i + 1}`}>{i + 1}</div>
                <div>
                  <div className="step-h">{title}</div>
                  <p className="step-p">{body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="birth-time-note fade-in">
            <span aria-hidden="true">✦</span>
            <p>
              <strong>Don&rsquo;t know your exact birth time?</strong> We note this in your report and work with the data we have.
              Many insights remain fully accessible even without precise timing.{" "}
              <Link href="/faq" style={{ color: "var(--goldL)" }}>Learn more →</Link>
            </p>
          </div>
        </div>
      </section>

      <div className="rule" aria-hidden="true"><span>✦</span></div>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section aria-labelledby="testimonials-heading">
        <div className="inner">
          <span className="tag fade-in">What People Are Saying</span>
          <h2 className="sec-title fade-in" id="testimonials-heading">The Moment They<br />Finally Felt Seen.</h2>
          <p className="sec-body fade-in" style={{ marginBottom: 40 }}>
            These are not reviews of a product. These are moments of genuine recognition.
          </p>
          <div className="testi-grid">
            {[
              { q: `I have spent years trying to understand myself. This report did in 24 hours what years of searching could not. I read it three times and cried twice. I finally feel seen.`, name: "Kayla M.", loc: "Atlanta, GA" },
              { q: `I kept telling myself I would figure it out eventually. This report showed me that I already had. I just did not have the language for it yet. Everything I have always quietly known — it was all in there.`, name: "Marcus T.", loc: "Houston, TX" },
              { q: `The shadow work questions at the end wrecked me in the best possible way. I journaled for three straight days. Nothing I have ever purchased has returned more to me than this.`, name: "Sasha R.", loc: "Los Angeles, CA" },
            ].map(({ q, name, loc }, i) => (
              <blockquote key={i} className="testi card fade-in">
                <div className="testi-stars" aria-label="5 out of 5 stars">★★★★★</div>
                <p className="testi-q">&ldquo;{q}&rdquo;</p>
                <footer>
                  <div className="testi-name">{name}</div>
                  <div className="testi-loc">{loc}</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <div className="rule" aria-hidden="true"><span>✦</span></div>

      {/* ── PULL QUOTE ───────────────────────────────────────── */}
      <section className="pull-quote-section" aria-label="Featured quote from a Soul Blueprint">
        <div className="inner" style={{ paddingTop: 48, paddingBottom: 48 }}>
          <blockquote className="pull-quote fade-in">
            <p>
              &ldquo;You were not born to explain yourself. You were born to show what&rsquo;s possible
              when someone stops apologizing for the frequency they carry.&rdquo;
            </p>
            <cite>— From a recent Soul Blueprint</cite>
          </blockquote>
        </div>
      </section>

      <div className="rule" aria-hidden="true"><span>✦</span></div>

      {/* ── PRODUCTS ─────────────────────────────────────────── */}
      <section id="order" ref={orderRef} aria-labelledby="order-heading">
        <div className="inner">
          <span className="tag fade-in">Choose Your Path</span>
          <h2 className="sec-title fade-in" id="order-heading">Read Your Map.</h2>
          <p className="sec-body fade-in">
            Every report is built personally from your birth data.
            This is not a template. This is you — completely, specifically, finally.
          </p>

          <div className="products-wrap">
            {/* ── SOUL BLUEPRINT ── */}
            <article className="product featured fade-in" aria-label="The Soul Blueprint — individual report">
              <div className="product-badge">Most Complete</div>
              <div className="product-name">The Soul Blueprint</div>
              <p className="product-desc">
                75+ hand-written pages synthesizing four complete wisdom systems into one
                portrait of who you were designed to be — explored in full depth, not summary.
              </p>
              <ul className="product-features" aria-label="What's included">
                <li>75+ hand-crafted pages, personally written</li>
                <li>Numerology, Astrology, Human Design &amp; Gene Keys — in full</li>
                <li>How others perceive you vs. how you perceive yourself</li>
                <li>Life in alignment — and what misalignment costs</li>
                <li>52-week alignment workbook, drawn from your profile</li>
                <li>Delivered to your inbox within 24 hours</li>
              </ul>
              <div className="price-main" aria-label="Price $152.00">
                $<span>152</span><span style={{ fontSize: "1.2rem" }}>.00</span>
              </div>
              <button className="product-btn primary-btn" onClick={() => handleCheckout("soul_blueprint")}>
                ✦ &nbsp;Reveal My Blueprint
              </button>
              <div className="product-meta">
                ✓ &nbsp;PDF delivered to your email &nbsp;·&nbsp; ✓ &nbsp;Personal to you alone
              </div>
              <div className="addon-box">
                <div className="addon-label">+ Optional Add-On</div>
                <div className="addon-row">
                  <div className="addon-info">
                    <div className="addon-title">Current Life Reading</div>
                    <div className="addon-sub">Where you are right now and what this specific season is asking of you.</div>
                  </div>
                  <div className="addon-price-col">
                    <div className="addon-orig">{isSubscribed ? "$15.59" : "$24.99"}</div>
                    <div className="addon-price">{isSubscribed ? "$12.99" : "$15.59"}</div>
                  </div>
                </div>
                <button className="addon-btn" onClick={() => handleCheckout("current_life")}>
                  Add This — {isSubscribed ? "$12.99" : "$15.59"}
                </button>
              </div>
            </article>

            {/* ── COUPLES BLUEPRINT ── */}
            <article className="product fade-in" aria-label="The Couples Blueprint — two reports plus compatibility">
              <div className="product-badge couples-badge">For Two</div>
              <div className="product-name">The Couples Blueprint</div>
              <p className="product-desc">
                Two complete Soul Blueprints plus a full compatibility synthesis — showing how your
                designs interact, where you amplify each other, and what you are built to create together.
              </p>
              <ul className="product-features" aria-label="What's included">
                <li>Two complete Soul Blueprints (75+ pages each)</li>
                <li>Full compatibility synthesis between both charts</li>
                <li>Where you amplify each other's strengths</li>
                <li>Where friction lives — and how to work with it</li>
                <li>What you are designed to build together</li>
                <li>Two 52-week alignment workbooks</li>
              </ul>
              <div className="price-main" aria-label="Price $200.00">
                $<span>200</span><span style={{ fontSize: "1.2rem" }}>.00</span>
              </div>
              <button className="product-btn secondary-btn" onClick={() => handleCheckout("couples_blueprint")}>
                ✦ &nbsp;Read Our Blueprint
              </button>
              <div className="product-meta">
                ✓ &nbsp;PDFs delivered to your email &nbsp;·&nbsp; ✓ &nbsp;Personal to both of you
              </div>
              <div className="addon-box">
                <div className="addon-label">+ Optional Add-On</div>
                <div className="addon-row">
                  <div className="addon-info">
                    <div className="addon-title">Both Current Life Readings</div>
                    <div className="addon-sub">Where each of you are right now and how your current seasons are interacting.</div>
                  </div>
                  <div className="addon-price-col">
                    <div className="addon-orig">{isSubscribed ? "$31.18" : "$49.98"}</div>
                    <div className="addon-price">{isSubscribed ? "$25.98" : "$31.18"}</div>
                  </div>
                </div>
                <button className="addon-btn" onClick={() => handleCheckout("couples_life")}>
                  Add This — {isSubscribed ? "$25.98" : "$31.18"}
                </button>
              </div>
            </article>
          </div>

          {/* ── DEEPER REPORTS ── */}
          <div style={{ marginTop: 48 }}>
            <p className="sec-body fade-in" style={{ marginBottom: 28 }}>
              Looking for a focused report on one specific system?
            </p>
            <div className="deeper-reports-grid fade-in">
              <article className="deeper-report card" aria-label="In-depth Numerology Report">
                <div className="deeper-report-icon">◯</div>
                <div className="deeper-report-name">In-depth Numerology Report</div>
                <p className="deeper-report-desc">
                  A complete numerological portrait — all five core numbers explored in full depth, with their
                  shadow patterns, life cycles, personal year, and how they interact with each other.
                </p>
                <div className="deeper-report-price-row">
                  {isSubscribed ? (
                    <>
                      <span className="deeper-report-price-orig" aria-label="Public price $17.99" style={{ textDecoration: "line-through", opacity: 0.5, marginRight: 8 }}>$17.99</span>
                      <span className="deeper-report-price" aria-label="Member price $14.99" style={{ color: "var(--goldL)" }}>$14.99</span>
                      <span className="deeper-report-sub-note" style={{ color: "var(--goldL)", fontWeight: 600 }}>Member Price</span>
                    </>
                  ) : (
                    <>
                      <span className="deeper-report-price">$17.99</span>
                      <span className="deeper-report-sub-note">Members pay $14.99 — <Link href="/sign-up" style={{ color: "var(--goldL)" }}>join free</Link></span>
                    </>
                  )}
                </div>
                <button className="outline-btn" style={{ width: "100%" }} onClick={() => handleCheckout("numerology_report")}>
                  Get My Numerology Report — {isSubscribed ? "$14.99" : "$17.99"}
                </button>
              </article>
              <article className="deeper-report card" aria-label="In-depth Astro Reading">
                <div className="deeper-report-icon">☽</div>
                <div className="deeper-report-name">In-depth Astro Reading</div>
                <p className="deeper-report-desc">
                  A complete natal chart interpretation — every planet, every sign, explored in depth. The
                  mythology behind each archetype and how each placement lives in your specific life.
                </p>
                <div className="deeper-report-price-row">
                  {isSubscribed ? (
                    <>
                      <span className="deeper-report-price-orig" aria-label="Public price $17.99" style={{ textDecoration: "line-through", opacity: 0.5, marginRight: 8 }}>$17.99</span>
                      <span className="deeper-report-price" aria-label="Member price $14.99" style={{ color: "var(--goldL)" }}>$14.99</span>
                      <span className="deeper-report-sub-note" style={{ color: "var(--goldL)", fontWeight: 600 }}>Member Price</span>
                    </>
                  ) : (
                    <>
                      <span className="deeper-report-price">$17.99</span>
                      <span className="deeper-report-sub-note">Members pay $14.99 — <Link href="/sign-up" style={{ color: "var(--goldL)" }}>join free</Link></span>
                    </>
                  )}
                </div>
                <button className="outline-btn" style={{ width: "100%" }} onClick={() => handleCheckout("astro_reading")}>
                  Get My Astro Reading — {isSubscribed ? "$14.99" : "$17.99"}
                </button>
              </article>
            </div>
          </div>

          {/* ── MEMBERSHIP CARD ── */}
          <div className="membership-card fade-in" style={{ marginTop: 48 }}>
            <div className="membership-card-inner">
              <div className="membership-card-left">
                <span className="tag" style={{ textAlign: "left" }}>Monthly Membership</span>
                <h3>Explore Deeper — $3.99/month</h3>
                <p>
                  Join the portal and get access to full natal chart interpretation, Human Design and Gene Keys education,
                  and member pricing on all reports — for less than a coffee a month.
                </p>
                <ul className="portal-sub-list" style={{ marginTop: 8 }}>
                  <li>Full astro chart interpretation for every placement</li>
                  <li>Deep Human Design &amp; Gene Keys education</li>
                  <li>Free numerology &amp; chart tools included</li>
                  <li>Member pricing on all one-time reports while subscribed</li>
                  <li>Cancel any time</li>
                </ul>
              </div>
              <div className="membership-card-right">
                <div className="portal-sub-price">
                  <span className="portal-sub-amount">$3.99</span>
                  <span className="portal-sub-period">/mo</span>
                </div>
                <button className="hero-btn" onClick={handleSubscribe}>
                  ✦ &nbsp;Join the Portal
                </button>
                <Link href="/membership" className="portal-membership-link" style={{ marginTop: 10, display: "block", textAlign: "center", color: "var(--muted)", fontSize: ".8rem", textDecoration: "none" }}>
                  See all benefits →
                </Link>
                <p className="portal-sub-note">Start with a free account — then subscribe.</p>
              </div>
            </div>
          </div>

          <div className="products-links fade-in">
            <Link href="/sample" className="outline-btn">Preview the Report</Link>
            <Link href="/faq" className="outline-btn">Read the FAQ</Link>
          </div>
        </div>
      </section>

      <div className="rule" aria-hidden="true"><span>✦</span></div>

      {/* ── CLOSING ──────────────────────────────────────────── */}
      <section className="closing" aria-labelledby="closing-heading">
        <span className="tag fade-in">A Final Word</span>
        <h2 className="sec-title fade-in" id="closing-heading" style={{ marginBottom: 22 }}>You Already Know.</h2>
        <p className="closing-text fade-in">
          You have always known. That the way you are wired is not a mistake. That the intensity
          you carry belongs somewhere. That there is a version of your life that feels completely,
          genuinely aligned with who you actually are. This report is not going to tell you something
          foreign. It is going to confirm what you have always quietly known about yourself —
          and give you the language to finally live from it.
        </p>
        <button className="hero-btn fade-in" onClick={() => handleCheckout("soul_blueprint")} style={{ margin: "0 auto" }}>
          ✦ &nbsp;I Am Ready
        </button>
      </section>

      </main>
      <Footer />

      {/* ── STICKY BAR ───────────────────────────────────────── */}
      <div className={`sticky${stickyHidden ? " sticky-hidden" : ""}`} role="complementary" aria-label="Order now">
        <div className="sticky-l">Hand-crafted &nbsp;·&nbsp; <strong>$152.00</strong> &nbsp;·&nbsp; Soul Blueprint</div>
        <button className="sticky-btn" onClick={scrollToOrder}>Read My Blueprint →</button>
      </div>
    </div>
  );
}
