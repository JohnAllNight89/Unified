import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./shared.css";

export default function DiscoverHumanDesign() {
  return (
    <div className="tus-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />
      <main id="main-content" style={{ maxWidth: 780, margin: "0 auto", padding: "6rem 1.5rem 3rem" }}>
        <Link href="/discover" style={{ color: "var(--cobalt)", fontSize: "0.85rem", textDecoration: "none" }}>
          ← Back to Discover
        </Link>

        <div style={{ textAlign: "center", margin: "2rem 0 3rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem", color: "var(--teal)" }}>◈</div>
          <span className="tag">Discover</span>
          <h1 style={{ color: "var(--light)", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", margin: "0.5rem 0" }}>
            Human Design
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 550, margin: "0 auto", lineHeight: 1.7 }}>
            A synthesis of ancient wisdom and modern science, the most precise system for understanding how your energy works.
          </p>
        </div>

        <article className="discover-article">
          <Section title="The Transmission">
            <p>
              Human Design arrived on January 3, 1987, when a Canadian man named <strong>Robert Alan Krakower</strong> (later known as <strong>Ra Uru Hu</strong>) experienced an eight-day mystical encounter on the island of Ibiza, Spain. During this experience, he received a detailed transmission of a new system that synthesized four ancient bodies of knowledge into a single, unified framework.
            </p>
            <p>
              Ra Uru Hu spent the next 25 years teaching, refining, and sharing this system until his death in 2011. He was clear that he did not invent Human Design; he received it. And he was equally clear that the system was not meant to be believed. It was meant to be <em>experimented with</em>.
            </p>
            <p>
              The instruction was simple: <strong>try it for yourself</strong>. Live according to your Strategy and Authority for a period of time, and see what changes. Human Design is not a philosophy. It is a mechanical experiment.
            </p>
          </Section>

          <Section title="The Four Pillars">
            <p>Human Design synthesizes four ancient systems, each contributing a distinct layer of information:</p>
            <PillarCard
              name="Western Astrology"
              desc="Provides the planetary positions at the moment of birth: the conscious personality (black) and the unconscious design (red, calculated 88 days before birth). The Sun, Earth, Moon, Nodes, and all planets are placed in the 64 gates of the Bodygraph."
            />
            <PillarCard
              name="The I Ching"
              desc="The 64 hexagrams of the Chinese Book of Changes correspond to the 64 gates in the Bodygraph. Each gate carries a specific theme, fear, and potential gift. The I Ching provides the language and archetypal depth of each gate."
            />
            <PillarCard
              name="The Kabbalah (Tree of Life)"
              desc="The Kabbalistic Tree of Life provides the structural framework: the 36 channels that connect the nine centers. Each channel is a pathway of energy, linking two gates and creating a specific life force when both gates are activated."
            />
            <PillarCard
              name="The Hindu-Brahmin Chakra System"
              desc="The nine centers of the Bodygraph evolved from the seven traditional chakras. In 1781 (when Uranus was discovered), humanity underwent a mutation from seven-centered beings to nine-centered beings. The two additional centers, the G Center and the Spleen, reflect this evolutionary shift."
            />
          </Section>

          <Section title="The Five Types">
            <p>At the foundation of Human Design is your <strong>Type</strong>: the most fundamental aspect of your design. There are five Types, each with a distinct aura, strategy, and role in the world:</p>
            <TypeRow name="Manifestors" pct="9%" strategy="To Inform" desc="The initiators. Manifestors have a closed, repelling aura designed to push through resistance. They are here to act independently and start things. Their strategy is to inform those who will be impacted before they act, not to ask permission, but to reduce resistance. When they don't inform, they meet anger." />
            <TypeRow name="Generators" pct="37%" strategy="To Respond" desc="The builders. Generators have an open, enveloping aura that draws life toward them. They have a defined Sacral Center, a powerful motor of life-force energy that is designed to respond to what shows up. When they wait and respond to what excites them, they find satisfaction. When they initiate, they find frustration." />
            <TypeRow name="Manifesting Generators" pct="33%" strategy="To Respond, then Inform" desc="Multi-passionate responders. A hybrid of Manifestor and Generator energy, they have the Sacral motor of a Generator but with a direct connection to a motor that reaches the Throat. They are fast, efficient, and designed to skip steps. Their process is non-linear. They must respond first, then inform before acting." />
            <TypeRow name="Projectors" pct="20%" strategy="To Wait for the Invitation" desc="The guides. Projectors have a focused, absorbing aura that penetrates deeply into the other. They do not have consistent access to their own energy; they are designed to guide and direct the energy of others. Their strategy is to wait for recognition and invitation before sharing their guidance. Uninvited guidance creates bitterness." />
            <TypeRow name="Reflectors" pct="1%" strategy="To Wait a Lunar Cycle" desc="The mirrors. Reflectors have no defined centers; their entire chart is open. They reflect the health and energy of their environment. Their strategy is to wait a full 28-day lunar cycle before making major decisions, allowing the Moon to transit through all 64 gates. They are rare, wise, and profoundly sensitive to place." />
          </Section>

          <Section title="Authority: Your Decision-Making Compass">
            <p>
              While your Type tells you your strategy for navigating life, your <strong>Authority</strong> tells you how to make correct decisions. Authority is the body's intelligence; it is never the mind.
            </p>
            <p>
              Human Design teaches that the mind is a brilliant tool for processing information, but it was never designed to make decisions for you. Every time you let your mind run your life, you move further from your authentic path. Authority is the alternative, a reliable, embodied compass that is unique to your design:
            </p>
            <AuthRow name="Emotional (Solar Plexus)" desc="Wait for emotional clarity. Never make decisions in the highs or lows; wait until the emotional wave settles and you feel a calm knowing. This is the most common authority." accent="var(--rose)" />
            <AuthRow name="Sacral" desc="Trust the gut response: the uh-huh (yes) or uh-uh (no). The Sacral is a motor that responds in the moment. It doesn't explain; it knows." />
            <AuthRow name="Splenic" desc="Trust the instant, in-the-moment knowing of the Spleen. Splenic authority speaks once, quietly, and then it's gone. It is primal intuition: survival intelligence." />
            <AuthRow name="Ego (Heart)" desc="Trust what you have the willpower and energy to commit to. Ask: 'Do I have the heart for this?' The ego authority operates through promises and willpower." accent="var(--rose)" />
            <AuthRow name="Self-Projected" desc="Trust what you hear yourself say when speaking your truth out loud. The G Center speaks through your voice; talk it through with someone you trust." />
            <AuthRow name="Environment / Mental" desc="There is no inner authority. Correct decisions come from being in the right environment and talking things through. No one can tell you what to do, but the right place will make it clear." />
            <AuthRow name="Lunar (Reflectors only)" desc="Wait 28 days. Let the Moon move through your entire chart before deciding. Talk to trusted others throughout the cycle. Clarity comes at the end." />
          </Section>

          <Section title="The Nine Centers">
            <p>
              The Bodygraph contains nine centers: energy hubs that process specific frequencies of life force. Each center can be <strong>defined</strong> (colored in, consistent, reliable) or <strong>open/undefined</strong> (white, receptive, conditioned by others).
            </p>
            <p>
              Your defined centers are where you have a fixed, consistent energy that radiates outward. Your open centers are where you take in and amplify the energy of those around you, and where you are most vulnerable to conditioning from the world.
            </p>
            <CenterRow name="Head" theme="Inspiration & mental pressure" />
            <CenterRow name="Ajna" theme="Conceptualization & mental certainty" />
            <CenterRow name="Throat" theme="Communication & manifestation" />
            <CenterRow name="G Center" theme="Identity, direction & love" accent="var(--rose)" />
            <CenterRow name="Heart / Ego" theme="Willpower, value & material resources" />
            <CenterRow name="Sacral" theme="Life force, sexuality & work capacity" />
            <CenterRow name="Solar Plexus" theme="Emotions, feelings & desire" accent="var(--rose)" />
            <CenterRow name="Spleen" theme="Intuition, health, survival & timing" />
            <CenterRow name="Root" theme="Adrenaline, stress & drive" />
          </Section>

          <Section title="Your Human Design in Your Blueprint">
            <p>
              Your full Human Design chart (your Type, Strategy, Authority, Profile, all nine centers, your channels, and your gates) is calculated from your exact birth data and fully interpreted inside your <strong>Soul Blueprint</strong>.
            </p>
            <p>
              The Blueprint doesn't just tell you your Type. It tells you what each defined and open center means for your specific life, which channels carry your deepest gifts, and which gates hold the themes you're here to work with.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
              <Link href="/sign-up" className="hero-btn">
                Create Your Free Profile
              </Link>
              <Link href="/#order" className="outline-btn">
                Get My Soul Blueprint
              </Link>
            </div>
          </Section>
        </article>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ color: "var(--tealL)", fontSize: "1.3rem", marginBottom: "1rem", borderBottom: "1px solid rgba(77,184,164,0.2)", paddingBottom: "0.5rem" }}>
        {title}
      </h2>
      <div style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: "0.95rem" }}>
        {children}
      </div>
    </section>
  );
}

function PillarCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="card" style={{ padding: "1.2rem 1.5rem", marginTop: "1rem" }}>
      <h3 style={{ color: "var(--light)", fontSize: "1rem", marginBottom: "0.4rem" }}>{name}</h3>
      <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  );
}

function TypeRow({ name, pct, strategy, desc }: { name: string; pct: string; strategy: string; desc: string }) {
  return (
    <div className="card" style={{ padding: "1.2rem 1.5rem", marginTop: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
        <span style={{ color: "var(--light)", fontWeight: 600 }}>{name}</span>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>({pct} of humanity)</span>
        <span style={{ marginLeft: "auto", color: "var(--teal)", fontSize: "0.8rem", fontWeight: 600 }}>Strategy: {strategy}</span>
      </div>
      <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  );
}

function AuthRow({ name, desc, accent }: { name: string; desc: string; accent?: string }) {
  return (
    <div style={{ display: "flex", gap: "0.8rem", alignItems: "baseline", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <span style={{ color: accent || "var(--teal)", fontWeight: 600, minWidth: 160, fontSize: "0.9rem" }}>{name}</span>
      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.88rem", lineHeight: 1.6 }}>{desc}</span>
    </div>
  );
}

function CenterRow({ name, theme, accent }: { name: string; theme: string; accent?: string }) {
  return (
    <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", padding: "0.4rem 0" }}>
      <span style={{ color: accent || "var(--light)", fontWeight: 600, minWidth: 120, fontSize: "0.9rem" }}>{name}</span>
      <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.88rem" }}>{theme}</span>
    </div>
  );
}
