import { useUser } from "@clerk/react";
import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { handleSubscribe } from "@/lib/checkout";
import "./shared.css";
import "./membership.css";

const FREE_BENEFITS = [
  "Free member portal account",
  "Numerology calculator (5 core numbers)",
  "Full natal chart display",
  "Human Design education library",
  "Gene Keys education library",
  "Save your birth data securely",
  "Customizable profile with username & bio",
  "Access to all system data you enter yourself",
];

const SUBSCRIBER_BENEFITS = [
  "Everything in Free — plus:",
  "Full natal chart interpretation (every placement)",
  "Planetary mythology & archetypes explained",
  "How each placement shows up in daily life",
  "Expanded Human Design & Gene Keys depth",
  "Soul Blueprint at $222.00",
  "Couples Blueprint at $300.00",
  "Life Cycle Reading at $12.99 (vs $15.59 public)",
  "Numerology Report at $14.99 (vs $17.99 public)",
  "Astrology Report at $14.99 (vs $17.99 public)",
  "Cancel any time, no questions asked",
];

const PRODUCTS = [
  { name: "Soul Blueprint (Individual)", subscriber: "$222.00", public: "$222.00" },
  { name: "Couples Blueprint", subscriber: "$300.00", public: "$300.00" },
  { name: "Life Cycle Reading", subscriber: "$12.99", public: "$15.59" },
  { name: "Numerology Report", subscriber: "$14.99", public: "$17.99" },
  { name: "Astrology Report", subscriber: "$14.99", public: "$17.99" },
];

export default function Membership() {
  const { isSignedIn } = useUser();

  return (
    <div className="tus-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />
      <main id="main-content" className="membership-main">

        {/* ── HERO ─────────────────────────────── */}
        <div className="membership-hero">
          <span className="tag">Monthly Membership</span>
          <h1 className="membership-h1">Everything Your Chart Reveals —<br /><em>Fully Interpreted.</em></h1>
          <p className="membership-sub">
            Your data is the map. The membership gives you the guide. For less than a cup of coffee a month.
          </p>
        </div>

        {/* ── COMPARISON TABLE ─────────────────── */}
        <section className="membership-comparison" aria-label="Free vs Subscriber comparison">
          <div className="membership-col membership-col-free">
            <div className="membership-col-header">
              <div className="membership-col-label">Free</div>
              <div className="membership-col-price">$0</div>
              <div className="membership-col-sub">Always free</div>
            </div>
            <ul className="membership-benefits-list">
              {FREE_BENEFITS.map((b) => (
                <li key={b}>
                  <span className="benefit-icon benefit-icon-free">✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="membership-col-cta">
              {isSignedIn ? (
                <Link href="/portal" className="outline-btn" style={{ display: "block", textAlign: "center" }}>
                  Go to My Portal
                </Link>
              ) : (
                <Link href="/sign-up" className="outline-btn" style={{ display: "block", textAlign: "center" }}>
                  Join Free
                </Link>
              )}
            </div>
          </div>

          <div className="membership-col membership-col-subscriber">
            <div className="membership-col-badge">Best Value</div>
            <div className="membership-col-header">
              <div className="membership-col-label">Subscriber</div>
              <div className="membership-col-price">
                <span className="membership-price-amount">$3.99</span>
                <span className="membership-price-period">/mo</span>
              </div>
              <div className="membership-col-sub">Cancel any time</div>
            </div>
            <ul className="membership-benefits-list">
              {SUBSCRIBER_BENEFITS.map((b) => (
                <li key={b} className={b.startsWith("Everything") ? "benefit-header-item" : ""}>
                  <span className="benefit-icon benefit-icon-subscriber">✦</span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="membership-col-cta">
              <button className="hero-btn" style={{ width: "100%" }} onClick={() => handleSubscribe()}>
                ✦ &nbsp;Start My Membership
              </button>
              <p className="membership-cta-note">Less than a coffee. Cancel any time.</p>
            </div>
          </div>
        </section>

        {/* ── PRICING TABLE ────────────────────── */}
        <section className="membership-pricing-section">
          <span className="tag" style={{ textAlign: "center" }}>Subscriber Savings</span>
          <h2 className="membership-pricing-title">Member Prices on Every Report</h2>
          <p className="membership-pricing-sub">
            Your $3.99 membership pays for itself the moment you order any report.
          </p>
          <div className="membership-pricing-table" role="table" aria-label="Product pricing comparison">
            <div className="pricing-table-head" role="row">
              <div role="columnheader">Report</div>
              <div role="columnheader" style={{ textAlign: "center" }}>Subscriber</div>
              <div role="columnheader" style={{ textAlign: "center" }}>Public</div>
            </div>
            {PRODUCTS.map(({ name, subscriber, public: pub }) => (
              <div className="pricing-table-row" key={name} role="row">
                <div role="cell" className="pricing-row-name">{name}</div>
                <div role="cell" className="pricing-row-sub">{subscriber}</div>
                <div role="cell" className="pricing-row-pub">{pub}</div>
              </div>
            ))}
            <div className="pricing-table-foot">
              <div />
              <div style={{ textAlign: "center", color: "var(--goldL)", fontFamily: "'Cinzel', serif", fontSize: ".75rem", letterSpacing: ".1em" }}>MEMBER PRICE</div>
              <div style={{ textAlign: "center", color: "var(--muted)", fontFamily: "'Cinzel', serif", fontSize: ".75rem", letterSpacing: ".1em" }}>PUBLIC PRICE</div>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button className="hero-btn" onClick={() => handleSubscribe()}>
              ✦ &nbsp;Start My Membership — $3.99/mo
            </button>
            <p style={{ color: "var(--muted)", fontSize: ".8rem", marginTop: 12 }}>Cancel any time. No contracts.</p>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────── */}
        <section className="membership-faq">
          <h2 className="membership-faq-title">Questions</h2>
          <div className="membership-faq-grid">
            {[
              {
                q: "Can I cancel any time?",
                a: "Yes. Cancel from your portal at any time — your access continues through the end of the billing period and you will never be charged again.",
              },
              {
                q: "Do I need a subscription to buy a report?",
                a: "No. Reports are available to anyone. Subscribers get access to member pricing on every report — lower than the standard public rate — for as long as they are subscribed.",
              },
              {
                q: "What is included in the chart interpretation?",
                a: "Every planetary placement in your natal chart — Sun, Moon, Rising, and all eight planets — with their sign, house, mythology, and how that energy tends to show up in real life.",
              },
              {
                q: "Is this different from the Soul Blueprint?",
                a: "Yes. The membership gives you the educational interpretation layer in the portal. The Soul Blueprint is a 75+ page personal report written specifically for you — more in-depth and personal than anything in the portal.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="membership-faq-item card">
                <div className="membership-faq-q">{q}</div>
                <div className="membership-faq-a">{a}</div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ textAlign: "center", marginTop: 48, marginBottom: 80 }}>
          <Link href="/portal" style={{ color: "var(--muted)", fontSize: ".9rem" }}>← Back to My Portal</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
