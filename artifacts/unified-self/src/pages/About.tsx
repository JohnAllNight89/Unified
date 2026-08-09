import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { handleCheckout } from "@/lib/checkout";
import { useSEO } from "@/hooks/useSEO";
import "./shared.css";
import "./about.css";

export default function About() {
  useSEO({
    title: "About The Unified Spirit: Soul Blueprint Practitioner",
    description: "Meet the practitioner behind The Unified Spirit. Learn how Numerology, Astrology, Human Design, and Gene Keys are synthesized into one personalized Soul Blueprint, and why this work exists.",
    path: "/about",
  });

  return (
    <div className="tus-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />

      <main id="main-content">

        {/* ── HERO ── */}
        <div className="ab-hero">
          <div className="ab-hero-glow" />
          <div className="ab-eyebrow">The Practitioner</div>
          <h1>I Know What It Feels Like<br />To Not Have <em>Your Map.</em></h1>
          <p className="ab-hero-lead">I did not find these systems in a classroom. I found them the way most people find the things that actually change them: through years of searching in places that were never going to have my answers, and eventually through the one place I had not thought to look.</p>
        </div>

        {/* ── STORY ── */}
        <div className="ab-story">
          <p>My life has never fit neatly into a single category. I have built things with my hands and built things with my mind. I have competed at the highest levels of a discipline that demands everything you have: physically, mentally, and psychologically. I have stood in front of people and led them. I have created things from nothing. I have lost people who were irreplaceable. I have rebuilt more than once from conditions that did not guarantee a rebuild was possible.</p>

          <p>What none of those experiences gave me, for a long time, was a framework that explained why I was built the way I was built. Why certain things that came easily to other people required everything I had. Why I could read a room before anyone had spoken. Why I led instinctively but carried a specific kind of loneliness that came with always going first. Why the version of myself that felt most real was also the one that felt the most difficult to sustain in the world as it was.</p>

          <p>I spent years looking for that framework in the places most people look: in achievement, in external validation, in becoming better at the things I was already good at. None of it answered the question underneath the question. None of it told me who I actually was, at the level below the roles I was playing and the things I was building.</p>

          <p>The systems found me one at a time. Human Design first, and something in it stopped me completely. Not because it told me something new, but because it named something I had always known and never had language for. Then Astrology, which confirmed the same territory from a different angle. Then Numerology, which showed me the mathematical architecture of the arc I had been walking without a map. Then the Gene Keys, which took everything I had understood as personal failure and reframed it as the precise raw material my highest expression was made from.</p>

          <p>That process took eighteen years. It was not casual interest: deep study, personal application, running the systems against my own life until I understood not just what they said but why they were true. Until I could see the same person through four completely different lenses and watch all four arrive at the same place.</p>

          <p>What I discovered is that when these four systems are applied simultaneously, cross-examined against each other and integrated rather than stacked, they produce something no single system can produce alone. They produce a complete picture. Not of a type, not of a category, not of a set of tendencies you share with millions of other people. A complete picture of one specific person. The specific mechanics of why you work the way you work. The specific arc your life is organized around. The specific gifts you arrived with and the specific shape they take when they are operating at the frequency of fear rather than the frequency of truth.</p>

          <p>The Soul Blueprint is not a product I built. It is the report I wish someone had handed me at the beginning. Every person who receives one gets what took me nearly two decades to piece together, synthesized, integrated, and written specifically to them.</p>
        </div>

        {/* ── PULL QUOTE ── */}
        <div className="ab-pull">
          <div className="ab-pull-inner">
            <h2>They see you whole.<br />They confirm what you have<br /><em>always quietly known.</em></h2>
            <p>And they give you the language to finally live from that knowing, rather than around it.</p>
          </div>
        </div>

        {/* ── METHODOLOGY ── */}
        <div className="ab-method">
          <div className="ab-method-eyebrow">The Methodology</div>
          <h2>Five Systems.<br /><em>One Complete Picture.</em></h2>
          <p>Most readings give you one lens. One system, one perspective, one partial view of a complete person. The Soul Blueprint integrates five, because no single system captures the full complexity of who you are, and because the most important information lives not inside any one system but in the exact place where all five converge.</p>
          <p>Every blueprint begins with your raw data: your full birth name, your exact date, time, and place of birth. From that data, five complete analyses are run independently. Then they are cross-examined against each other. The places where all five systems agree become the spine of the document. The places where they tension each other reveal the specific dynamics that have shaped your experience. What arrives in your inbox is not five reports in sequence. It is one integrated narrative of exactly who you are, written specifically to you, in a voice that communicates from your own data.</p>
          <p>Nothing in your report is copied from a template. Every sentence is written from your specific data. What arrives in your inbox is a document that will feel like someone has known you your entire life, and for the first time is introducing you to the REAL you.</p>

          <div className="ab-stats">
            <div className="ab-stat">
              <div className="ab-stat-val">5</div>
              <div className="ab-stat-label">Systems,<br />In Full</div>
            </div>
            <div className="ab-stat">
              <div className="ab-stat-val">10</div>
              <div className="ab-stat-label">Complete<br />Chapters</div>
            </div>
            <div className="ab-stat">
              <div className="ab-stat-val">75+</div>
              <div className="ab-stat-label">Pages,<br />Hand-Written</div>
            </div>
            <div className="ab-stat">
              <div className="ab-stat-val">52</div>
              <div className="ab-stat-label">Week<br />Alignment &amp; Shadow Journal</div>
            </div>
          </div>
        </div>

        {/* ── PROMISE ── */}
        <div className="ab-promise">
          <div className="ab-promise-inner">
            <div className="ab-promise-eyebrow">My Promise To You</div>
            <h2>Every Word Is Written<br />For You.</h2>
            <p>I do not write these documents quickly. I do not produce them in volume. Every Soul Blueprint receives the full weight of eighteen years of study applied to the specific coordinates of one person's life. When you receive yours, you will know the difference.</p>
            <p>This work matters to me because it changed my life, not in the motivational sense but in the structural sense. It gave me a framework for understanding myself that made everything else make sense. That is what I want to give every person who comes here: not information, but recognition.</p>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="ab-cta">
          <p>Ready to see what your own data reveals?</p>
          <button className="ab-cta-btn" onClick={() => handleCheckout("soul_blueprint")}>
            ✦ &nbsp; Reveal My Blueprint
          </button>
        </div>

      </main>
      <Footer />
    </div>
  );
}
