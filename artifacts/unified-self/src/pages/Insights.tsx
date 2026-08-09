import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";
import "./shared.css";
import "./insights.css";

const POSTS = [
  {
    href: "/insights/what-is-a-soul-blueprint",
    title: "What Is a Soul Blueprint? Why One System Is Never Enough",
    excerpt: "You have your Human Design chart. You've looked at your Gene Keys. You've calculated your Life Path. You've studied your birth chart. And still, something doesn't fully click. Here's what a real synthesis actually does that a single reading never can.",
  },
  {
    href: "/insights/human-design-and-gene-keys",
    title: "Human Design + Gene Keys: How They Work Together (And Why Both Matter)",
    excerpt: "The same 64 gates, spoken in two different languages — one mechanical, one evolutionary. Almost no one has been shown these two systems read together, as one instrument instead of two. Here's what changes when you do.",
  },
];

export default function Insights() {
  useSEO({
    title: "Insights — Soul Blueprint, Human Design & Gene Keys | The Unified Spirit",
    description: "Articles on Numerology, Astrology, Human Design, and Gene Keys — how these systems work, how they work together, and what a true Soul Blueprint synthesis actually reveals.",
    path: "/insights",
  });

  return (
    <div className="in-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />

      <main id="main-content">
        {/* ── HERO ── */}
        <section className="in-hero">
          <div className="in-hero-glow" />
          <div className="in-eyebrow">Insights</div>
          <h1>Understanding the<br />Systems Behind Your Blueprint.</h1>
          <p>Writing on Numerology, Astrology, Human Design, and Gene Keys — what each system actually sees, and what happens when they're read together.</p>
        </section>

        {/* ── LIST ── */}
        <div className="in-list">
          {POSTS.map((post) => (
            <Link key={post.href} href={post.href} className="in-card">
              <div className="in-card-eyebrow">Insights</div>
              <div className="in-card-title">{post.title}</div>
              <p className="in-card-excerpt">{post.excerpt}</p>
              <div className="in-card-cta">Read the Article →</div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
