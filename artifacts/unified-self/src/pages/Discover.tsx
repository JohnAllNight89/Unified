import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { handleCheckout } from "@/lib/checkout";
import { useSEO } from "@/lib/seo";
import "./shared.css";
import "./discover.css";

export default function Discover() {
  useSEO({
    title: "Discover the Four Systems",
    description:
      "An introduction to Numerology, Astrology, Human Design, and Gene Keys — the four ancient systems synthesized into every Unified Spirit Soul Blueprint.",
    path: "/discover",
  });

  return (
    <div className="dh-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />

      <main id="main-content">

        {/* ── HERO ── */}
        <section className="dh-hero">
          <div className="dh-hero-glow" />
          <div className="dh-eyebrow">Discover</div>
          <h1>The Four Systems</h1>
          <p>These are not personality tests. They are four distinct ancient disciplines — each one developed independently, each one mapping a different layer of what makes you who you are. Together, they form something none of them can produce alone.</p>
        </section>

        {/* ── NUMEROLOGY ── */}
        <div className="dh-system dh-num">
          <div className="dh-system-inner">
            <div className="dh-system-header">
              <div className="dh-system-icon">○</div>
              <div className="dh-system-name">Numerology</div>
            </div>
            <div className="dh-system-origin">Pythagorean · Chaldean · The Mathematics of Your Identity</div>

            <div className="dh-system-lead">Your name is not arbitrary. Your birthdate is not a coincidence. Numerology is the science that shows you exactly what was encoded in both.</div>

            <p className="dh-system-body">Every letter carries a vibrational frequency. Every number that makes up your birthdate holds a specific meaning. When these values are calculated correctly and read in relationship to each other, a precise picture emerges — not of who you might be, but of who you were built to be before you had any say in it.</p>

            <p className="dh-system-body">Numerology answers the questions most people spend their entire lives circling. Why do I keep ending up in the same kinds of situations? Why does this one thing feel like it requires everything I have, while other things come so easily? Why does the version of myself that feels most authentic also feel the hardest to maintain? These are not psychological mysteries. They are mathematical ones. And Numerology names them with a specificity that stops you in your tracks.</p>

            <p className="dh-system-body">Your Life Path is the single most important number in your chart — the primary frequency your entire existence is organized around. But it does not exist alone. Your Expression number describes how you actually move through the world. Your Soul Urge reveals what the deepest layer of you has always been reaching toward, underneath every goal you have consciously set. Your karmic debt numbers, if you carry them, explain the specific weight you arrived with and why certain lessons keep returning in the same shape until they are fully learned.</p>

            <p className="dh-system-body">What makes Numerology unlike anything else is its precision. It does not describe a type. It does not say you share a category with millions of other people. The specific combination of your full birth name and your exact birthdate produces a mathematical signature that belongs to you alone — a blueprint of the frequency you were sent here to carry and what carrying it fully is going to require.</p>

            <div className="dh-system-what">
              <div className="dh-system-what-label">What Your Numerology Maps</div>
              <ul className="dh-checks">
                <li>Your Life Path — the central arc your entire life is organized around and what it specifically asks of you to walk it in full</li>
                <li>Your Expression — the natural way your energy moves through the world and how others experience your presence</li>
                <li>Your Soul Urge — the hunger underneath everything, the deepest motivating force that shapes your choices whether you are conscious of it or not</li>
                <li>Karmic debt and missing numbers — the specific patterns you arrived carrying and why they keep appearing</li>
                <li>Your personal year cycle, pinnacles, and the numerical map of the season your life is currently in</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── ASTROLOGY ── */}
        <div className="dh-system dh-ast dh-system--dark">
          <div className="dh-system-inner">
            <div className="dh-system-header">
              <div className="dh-system-icon">☽</div>
              <div className="dh-system-name">Astrology</div>
            </div>
            <div className="dh-system-origin">Babylonian · Hellenistic · Vedic · The Architecture of Your Birth</div>

            <div className="dh-system-lead">The sky at the moment you were born was a completely unique configuration that has never existed before and will never exist again. Your natal chart is the map of that sky — and everything it says is about you specifically.</div>

            <p className="dh-system-body">Astrology is five thousand years old. It has been practiced in some form by virtually every civilization in human history — Babylonian, Egyptian, Greek, Indian, Chinese, Persian. Every tradition arrived at the same fundamental insight: the positioning of the planets at the moment of your birth encodes information about the nature of the life you are here to live. Not as fate. As terrain.</p>

            <p className="dh-system-body">When most people think of astrology they think of sun signs — the twelve archetypes most people know from horoscope columns. But your sun sign is one data point in a chart that contains dozens. Your Moon sign governs your emotional body, your instincts, the way you process feeling. Your Rising sign — the sign that was on the eastern horizon at the moment of your birth — determines how others experience you before you have said or done anything. Your planetary placements in each of the twelve houses of the chart describe where in your life each planetary energy is operating. The aspects — the geometric angles between planets — describe the specific tensions and harmonies built into your design.</p>

            <p className="dh-system-body">In your Soul Blueprint, astrology is not read as prediction. It is read as precision. Which houses carry the heaviest weight in your life and why. What the specific placements of your Saturn, Pluto, and North Node say about the nature of your evolution. Where your gifts live in the chart and what has been blocking their full expression. What the light you carry actually cost you to develop — and what it is capable of when it is not being protected.</p>

            <p className="dh-system-body">Your natal chart does not describe a personality. It describes the specific quality of fire you were put through and what that fire made you. There is no one else with your chart. There is no one else with your life.</p>

            <div className="dh-system-what">
              <div className="dh-system-what-label">What Your Astrology Maps</div>
              <ul className="dh-checks">
                <li>Your Sun, Moon, and Rising — the core identity, emotional nature, and outer presence you were born with</li>
                <li>Every key planetary placement interpreted through the lens of your actual life — not archetypes, but how each one shows up in your specific patterns and relationships</li>
                <li>Your North Node — the evolutionary direction your soul agreed to move toward and why it simultaneously pulls and unsettles you</li>
                <li>The houses carrying the most weight — where the real action of your life is concentrated and why certain areas have always demanded the most from you</li>
                <li>The exact tensions and gifts built into your chart through planetary aspects — the architecture of what has been hard and what has always come through</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── HUMAN DESIGN ── */}
        <div className="dh-system dh-hd">
          <div className="dh-system-inner">
            <div className="dh-system-header">
              <div className="dh-system-icon">◆</div>
              <div className="dh-system-name">Human Design</div>
            </div>
            <div className="dh-system-origin">I Ching · Kabbalah · Hindu Chakras · Western Astrology · Synthesized 1987</div>

            <div className="dh-system-lead">Human Design is the most mechanically precise of the four systems. It does not describe who you think you are or who you want to be. It maps how your energy body actually works — and what it requires to function correctly.</div>

            <p className="dh-system-body">Human Design was synthesized in 1987 from four ancient systems — the I Ching, the Kabbalah, the Hindu-Brahmin chakra system, and Western Astrology — into a single unified framework. What it produced was something none of those systems could offer individually: a precise map of the human energy body, including how each person's energy operates, how they are designed to make decisions, and how they are designed to interact with the world around them.</p>

            <p className="dh-system-body">The foundation of Human Design is your Type — and there are only five. Your Type determines the fundamental nature of your energy: how it moves, whether it is sustainable or designed to work in bursts, whether you are built to initiate or to respond. Most people have spent their entire lives operating from the wrong energy model — pushing when they were built to wait, initiating when they were designed to respond, saying yes to things their body was already saying no to. Human Design names that gap with a precision that is difficult to argue with once you see it.</p>

            <p className="dh-system-body">Your Strategy is the specific way your Type is designed to engage with life — the mode of operating that puts you in alignment with your own mechanics. Your Authority is even more specific: it is the exact internal signal your body uses to make decisions that are actually correct for you. Not correct by logic. Not correct by what you think you should want. Correct in the body, before the mind has overridden it. Most people never learn to distinguish that signal from the noise of conditioning. Knowing your Authority changes that.</p>

            <p className="dh-system-body">Your defined and open energy Centers — the nine centers of the Human Design chart — tell you where your energy is consistent and reliable, and where you are porous, taking in and amplifying the energy of the people and environments around you. That distinction alone explains an enormous amount about why you feel depleted in certain environments, why certain people's energy overwhelms you, and why you have sometimes made decisions that felt right in the moment but belonged to someone else's frequency entirely.</p>

            <div className="dh-system-what">
              <div className="dh-system-what-label">What Your Human Design Maps</div>
              <ul className="dh-checks">
                <li>Your Type and Strategy — the fundamental mechanics of your energy and the specific way you are designed to engage with life to produce correct results</li>
                <li>Your Authority — the internal signal your body uses to make decisions that are genuinely yours, and what it feels like when you override it</li>
                <li>Your Profile — the specific role you are here to play and the way your life is designed to educate you toward it</li>
                <li>Your defined and open Centers — where your energy is consistent, where you are taking on others' energy, and what that costs you</li>
                <li>Your Not-Self theme — the precise emotional signal that tells you when you are out of alignment with your own design</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── GENE KEYS ── */}
        <div className="dh-system dh-gk dh-system--dark">
          <div className="dh-system-inner">
            <div className="dh-system-header">
              <div className="dh-system-icon">✦</div>
              <div className="dh-system-name">The Gene Keys</div>
            </div>
            <div className="dh-system-origin">64 Archetypes · Shadow · Gift · Siddhi · Richard Rudd</div>

            <div className="dh-system-lead">The Gene Keys begin with a single premise that changes everything: the patterns that have held you back are not flaws. They are your greatest gifts operating at the wrong frequency.</div>

            <p className="dh-system-body">The Gene Keys were developed by Richard Rudd as a contemplative system built on the same 64 archetypes as the I Ching and Human Design. But where Human Design is primarily mechanical, the Gene Keys are primarily evolutionary. They do not just tell you how you are built — they tell you what you are here to become, and they name with extraordinary precision the specific path that runs from where you are to where your life is actually trying to go.</p>

            <p className="dh-system-body">Every Gene Key exists on a spectrum with three levels. The Shadow is the lowest frequency — the way a particular energy moves when it is operating from fear, from conditioning, from the protective patterns you developed long before you had words for them. The Gift is what becomes available when that fear begins to release — the same energy, at a higher frequency, no longer protecting itself but expressing itself. The Siddhi is the horizon — the full, unobstructed expression of what that energy is capable of at its highest vibration. You are not expected to live at the Siddhi. You are invited to understand the full spectrum and to recognize where, specifically, you are living on it.</p>

            <p className="dh-system-body">What makes the Gene Keys so powerful in a Soul Blueprint is their specificity. Your profile is not a general map. It is your exact Gene Keys — the specific gates activated by your birth data — read in relationship to each other. Your Life's Work. Your Evolution. Your Radiance. Your Purpose. Each one carries a Shadow pattern that has a very specific shape in your life. Each one carries a Gift that is the other face of that same pattern. When you see them laid out together, the recurring experiences of your life stop looking like randomness and start looking like information — precise, consistent, and pointing in a very specific direction.</p>

            <p className="dh-system-body">The Gene Keys do not ask you to fix yourself. They ask you to understand yourself deeply enough that the fixing becomes unnecessary — because what you thought was broken was never broken. It was always the raw material of something extraordinary, waiting for the right frequency to express it.</p>

            <div className="dh-system-what">
              <div className="dh-system-what-label">What Your Gene Keys Map</div>
              <ul className="dh-checks">
                <li>Your Life's Work Gate — the central theme of your entire existence, what you are most profoundly here to learn and eventually to transmit</li>
                <li>Your Evolution Gate — how you are specifically designed to grow across the full arc of your life</li>
                <li>Your Radiance and Purpose Gates — the particular frequency of light you carry and the vocation your soul arrived with</li>
                <li>The exact Shadow patterns active in your profile — named precisely, not as failures but as the specific shape of your gifts at the frequency of fear</li>
                <li>The path from your Shadow through your Gift toward your highest expression — what the actual inner work looks like for you specifically</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── SYNTHESIS BRIDGE ── */}
        <div className="dh-bridge">
          <h2>Four lenses.<br /><em>One complete picture of you.</em></h2>
          <p>Each system sees something the others cannot. Numerology names the mathematical arc your life is organized around. Astrology names the terrain — the sky you were born under and the quality of experience it produced. Human Design names the mechanics — how your energy body actually operates and what it requires. The Gene Keys name the frequency — the specific spectrum each part of your design is moving through, from shadow toward gift.</p>
          <p>No single system can see the whole. But when all four are applied simultaneously to your specific data — cross-examined against each other, read in conversation — they produce something that none of them can produce alone. Not a collection of insights. A single, coherent, integrated picture of exactly who you are and what you were built for. That is what a Soul Blueprint actually is.</p>
        </div>

        {/* ── CTA ── */}
        <div className="dh-cta">
          <p>Ready to see what your own data reveals?</p>
          <button className="dh-cta-btn" onClick={() => handleCheckout("soul_blueprint")}>
            ✦ &nbsp; Reveal My Blueprint
          </button>
        </div>

      </main>
      <Footer />
    </div>
  );
}
