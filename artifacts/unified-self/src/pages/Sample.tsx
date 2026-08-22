import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { handleCheckout } from "@/lib/checkout";
import { useSEO } from "@/hooks/useSEO";
import "./shared.css";
import "./sample.css";

export default function Sample() {
  useSEO({
    title: "Sample Soul Blueprint Report: The Unified Spirit",
    description: "See inside a real Soul Blueprint: 10 chapters covering Numerology, Western Astrology, Vedic Astrology, Human Design, Gene Keys, your personal Synthesis, and your path forward. 75+ pages written from your birth data.",
    path: "/sample",
  });

  return (
    <div className="sp-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />

      <main id="main-content">

        {/* ── HERO ── */}
        <section className="sp-hero">
          <div className="sp-hero-glow" />
          <div className="sp-eyebrow">What's Inside</div>
          <h1>Your Soul Blueprint,<br />In Full.</h1>
          <p>This is not a reading. It is an introduction to yourself, in more depth, more precision, and more truth than you have likely ever received. Here is exactly what is inside.</p>
        </section>

        {/* ── STATS BAR ── */}
        <div className="sp-stats-bar">
          <div className="sp-stat">
            <div className="sp-stat-val">10</div>
            <div className="sp-stat-label">Chapters,<br />In Full</div>
          </div>
          <div className="sp-stat">
            <div className="sp-stat-val">5</div>
            <div className="sp-stat-label">Complete<br />System Audits</div>
          </div>
          <div className="sp-stat">
            <div className="sp-stat-val">75+</div>
            <div className="sp-stat-label">Pages,<br />About You</div>
          </div>
          <div className="sp-stat">
            <div className="sp-stat-val">52</div>
            <div className="sp-stat-label">Week<br />Alignment &amp; Shadow Journal</div>
          </div>
        </div>

        {/* ── CHAPTER 1: NUMEROLOGY ── */}
        <div className="sp-chapter">
          <div className="sp-chapter-num">01</div>
          <div className="sp-chapter-tag">The Mathematics of Your Soul</div>
          <h2>Numerology</h2>
          <p className="sp-chapter-body">Before anyone had an opinion about you, before you had done anything at all, you had a name. Embedded in that name, and in the exact moment you were born, is a mathematical structure that describes the specific frequency you came here to carry. This is not personality theory. It is arithmetic applied to the architecture of identity.</p>
          <ul className="sp-chapter-checks">
            <li>Your Life Path: the primary arc your entire existence is organized around, and what it is specifically going to cost you to walk it fully</li>
            <li>Your Expression: how you actually move through the world, process information, and offer yourself to others</li>
            <li>Your Soul Urge: not what you want consciously, but what the deepest layer of you is always reaching toward underneath every goal and every decision</li>
            <li>Your karmic debt numbers, missing numbers, and the specific patterns running underneath your recurring experiences</li>
            <li>Pinnacles, cycles, and the numerical architecture of the chapters your life is moving through</li>
          </ul>
        </div>

        <div className="sp-divider" />

        {/* ── CHAPTER 2: WESTERN ASTROLOGY ── */}
        <div className="sp-dark-panel">
          <div className="sp-chapter">
            <div className="sp-chapter-num">02</div>
            <div className="sp-chapter-tag">The Architecture of Your Inner World</div>
            <h2>Western Astrology</h2>
            <p className="sp-chapter-body">The planets were always in motion. What changed when you were born was the horizon: the specific relationship between those tropical planetary positions and the exact point on earth where you took your first breath. Western Astrology reads that relationship through the lens of your psyche: your patterns, drives, relational architecture, and the specific quality of consciousness your chart is organized around.</p>
            <ul className="sp-chapter-checks">
              <li>Your Sun, Moon, and Rising: not as archetypes but as the specific lens, emotional body, and first impression you were built with</li>
              <li>Every key planetary placement: what each one means and exactly where you live it in the patterns, relationships, and recurring tensions of your actual life</li>
              <li>Your North Node: the evolutionary direction your soul agreed to move toward, and why moving toward it feels simultaneously right and uncomfortable</li>
              <li>The houses that carry the most weight in your chart, where the real action of your life is concentrated and why</li>
              <li>The specific configurations that explain what your life has felt like from the inside: the volcanic interior, the forged light, the authority that had to be earned rather than assumed</li>
            </ul>
          </div>
        </div>

        <div className="sp-divider" />

        {/* ── CHAPTER 3: VEDIC ASTROLOGY ── */}
        <div className="sp-chapter">
          <div className="sp-chapter-num">03</div>
          <div className="sp-chapter-tag">The Soul's Karmic Blueprint</div>
          <h2>Vedic Astrology</h2>
          <p className="sp-chapter-body">Vedic Astrology (Jyotish) uses sidereal positioning: the actual astronomical location of the planets against the fixed stars at your birth, not their seasonal relationship to the sun. Where Western Astrology reads your psychology, Vedic reads your soul. The karmic agreements you arrived with. The dharma you are here to walk. The specific lessons this lifetime was organized to complete.</p>
          <ul className="sp-chapter-checks">
            <li>Your sidereal Ascendant and Moon sign: how your soul moves through the world and what it was specifically sent here to learn and complete</li>
            <li>Your nakshatra placements: the 27 lunar mansions that reveal the precise motivational and karmic texture of your design, with no Western equivalent</li>
            <li>Planetary periods (dashas): the specific major and sub-cycles currently active in your life and what each one is calling you toward</li>
            <li>Karmic house analysis: the areas of life your soul agreed to develop, master, or resolve in this incarnation</li>
            <li>Your dharmic purpose as encoded in the Vedic chart: the soul-level mission underneath the life you are consciously living</li>
          </ul>
        </div>

        {/* ── PULL QUOTE 1 ── */}
        <div className="sp-pull-quote">
          <p>"These systems do not describe personality types. They describe <em>the specific mechanics of why you work the way you work</em>, why you feel what you feel, why you do what you do, and what the full version of your life is actually being built toward."</p>
        </div>

        <div className="sp-divider" />

        {/* ── CHAPTER 4: HUMAN DESIGN ── */}
        <div className="sp-chapter">
          <div className="sp-chapter-num">04</div>
          <div className="sp-chapter-tag">The Blueprint of Your Energy</div>
          <h2>Human Design</h2>
          <p className="sp-chapter-body">Human Design does not describe who you prefer to be. It maps how you are actually built: the specific architecture of your body-mind system, how your energy generates, how your decisions work, and how you are designed to engage with the world. This is not a personality framework. It is a body system. And it is unusually specific about the combination of capacity and requirement you are working with.</p>
          <ul className="sp-chapter-checks">
            <li>Your Type and Strategy: the fundamental mechanics of how your energy is designed to operate and what happens when you ignore them</li>
            <li>Your Authority: the specific internal signal your body uses to make correct decisions, and why bypassing it has cost you the most</li>
            <li>Your Profile: the role you are here to play and the specific way your life is designed to teach you what you need to know</li>
            <li>Your defined and open Centers: where your energy is consistent and where you are taking in and amplifying the energy of others without realizing it</li>
            <li>Your not-self signals: the precise emotional and energetic feedback your design sends when you are living out of alignment with your mechanics</li>
          </ul>
        </div>

        <div className="sp-divider" />

        {/* ── CHAPTER 5: GENE KEYS ── */}
        <div className="sp-dark-panel">
          <div className="sp-chapter">
            <div className="sp-chapter-num">05</div>
            <div className="sp-chapter-tag">The Spectrum of Your Original Frequencies</div>
            <h2>Gene Keys</h2>
            <p className="sp-chapter-body">Gene Keys maps each aspect of your design as a spectrum: from the Shadow at the lowest frequency, through the Gift in the middle, to the Siddhi at the highest expression. The Shadow is not a failure or a flaw. It is the frequency of fear operating through your specific design. What matters is not each key in isolation; it is what they are saying in conversation with each other.</p>
            <ul className="sp-chapter-checks">
              <li>Your Life's Work Gate: the primary theme of your entire existence and what you are most profoundly here to learn, embody, and eventually transmit</li>
              <li>Your Evolution Gate: how you are designed to grow and deepen across the full arc of your life</li>
              <li>Your Radiance and Purpose Gates: the specific frequency of light you carry and the vocation your soul arrived with</li>
              <li>The exact shape of your shadow patterns, not as flaws but as the precise other face of your gifts operating at the frequency of fear</li>
              <li>The specific path from your Shadow through your Gift toward the Siddhi: what the work actually looks like for you, not for anyone else</li>
            </ul>
          </div>
        </div>

        {/* ── PULL QUOTE 2 ── */}
        <div className="sp-pull-quote">
          <p>"What all five systems agree on before anything else: <em>you were built to build things that outlast you.</em> You were built to know things that others haven't figured out yet. You were built to stand at the front of a trail you are creating with your own feet."</p>
        </div>

        <div className="sp-divider" />

        {/* ── CHAPTER 6: SYNTHESIS ── */}
        <div className="sp-chapter">
          <div className="sp-chapter-num">06</div>
          <div className="sp-chapter-tag">The Mirror</div>
          <h2>The Full Synthesis</h2>
          <p className="sp-chapter-body">This is where all five systems come together into one complete picture of you: not five separate readings placed side by side, but a true synthesis. This section goes into depth on three things most readings never touch: how others experience you, how you experience yourself, and what your life looks like when you are in alignment versus when you are not.</p>
          <ul className="sp-chapter-checks">
            <li>How others experience you: the impression you leave, the energy you project, what people feel in your presence before a word has been spoken</li>
            <li>How you experience yourself: your internal world, your self-perception, where it matches your design and where it diverges</li>
            <li>The specific shadows that appear across all five systems: the recurring patterns that are not random but the exact shape of your gifts operating at the frequency of fear</li>
            <li>Life in alignment: what it looks, feels, and moves like when you are fully living your blueprint</li>
            <li>Life out of alignment: the patterns, feelings, and recurring experiences that signal you have drifted from yourself</li>
          </ul>
        </div>

        <div className="sp-divider" />

        {/* ── CHAPTER 7: THE PATH ── */}
        <div className="sp-dark-panel">
          <div className="sp-chapter">
            <div className="sp-chapter-num">07</div>
            <div className="sp-chapter-tag">The Living Path</div>
            <h2>The Path: Your Blueprint Applied</h2>
            <p className="sp-chapter-body">The final chapter takes everything the five systems revealed and maps it against a living spiritual framework: the specific way the universal path of alignment runs through the architecture of who you specifically were made to be. This is not theology. It is the most personal chapter in the document: what it means for you, with your specific design, your specific wounds, and your specific gifts, to live in full alignment with what you were built for.</p>
            <ul className="sp-chapter-checks">
              <li>Your specific evolutionary lessons, not general wisdom but the exact territory your design is asking you to walk</li>
              <li>The precise intersection between your numerological arc, your astrological assignments, your energetic mechanics, and your Gene Keys frequencies</li>
              <li>What the full version of your life is actually being built toward, and what is standing between where you are and that version</li>
              <li>The specific internal conditions your design requires to fully activate, and how to recognize when they are and aren't present</li>
            </ul>
          </div>
        </div>

        {/* ── JOURNAL SECTION ── */}
        <div className="sp-journal-wrap">
          <div className="sp-journal-plus">+</div>
          <div className="sp-chapter-tag">The Living Practice</div>
          <div className="sp-journal-title">52-Week Alignment Workbook</div>
          <div className="sp-journal-card">
            <div className="sp-journal-card-top">
              <span className="sp-badge">Included</span>
              <span className="sp-journal-card-top-title">A Year of Knowing Yourself</span>
            </div>
            <div className="sp-journal-card-body">
              <p>Most people read something like this once, feel seen for a moment, and return to living the same way they always have. The alignment workbook exists so that does not happen. Fifty-two weeks. One theme at a time. Daily questions that go exactly where your design asks you to go, written entirely for you, from your profile, because that is the only way these questions will actually reach you.</p>
              <ul className="sp-journal-bullets">
                <li><span><strong>52 weekly themes</strong> drawn directly from your primary evolutionary lessons, life path cycles, and energetic boundaries</span></li>
                <li><span><strong>365 daily prompts</strong> written specifically for your shadow patterns, genetic gifts, and structural design, with zero recycled questions</span></li>
                <li><span>Covers your shadow work, gifts, relationships, purpose, and what alignment actually looks and feels like for you</span></li>
                <li><span>A living document you will return to throughout the year: not a workbook you complete, but one that keeps working on you</span></li>
              </ul>
              <div className="sp-journal-stats">
                <div className="sp-jstat">
                  <div className="sp-jstat-val">52</div>
                  <div className="sp-jstat-label">Custom weekly themes</div>
                </div>
                <div className="sp-jstat">
                  <div className="sp-jstat-val">365</div>
                  <div className="sp-jstat-label">Daily prompts for you alone</div>
                </div>
                <div className="sp-jstat">
                  <div className="sp-jstat-val">2</div>
                  <div className="sp-jstat-label">PDFs in your inbox</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="sp-cta-section">
          <h2>This is your map.<br />It has always been yours.</h2>
          <p>Your complete Soul Blueprint and 52-week workbook, delivered to your email within 72 hours. Hand-crafted. Never automated. Written to you alone.</p>
          <button className="sp-cta-btn" onClick={() => handleCheckout("soul_blueprint")}>
            ✦ &nbsp; Reveal My Blueprint: $222.00
          </button>
          <div className="sp-cta-meta">PDF delivered to your email &nbsp;·&nbsp; Personal to you alone &nbsp;·&nbsp; Within 72 hours</div>
        </div>

      </main>

      <footer className="sp-footer">
        <span>The Unified Spirit</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}
