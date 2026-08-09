import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./shared.css";

export default function DiscoverGeneKeys() {
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
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem", color: "var(--rose)" }}>✦</div>
          <span className="tag">Discover</span>
          <h1 style={{ color: "var(--light)", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", margin: "0.5rem 0" }}>
            The Gene Keys
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 550, margin: "0 auto", lineHeight: 1.7 }}>
            64 archetypes encoded in your DNA, a contemplative path from shadow to gift to the highest expression of your genius.
          </p>
        </div>

        <article className="discover-article">
          <Section title="Origin: The Golden Path">
            <p>
              The Gene Keys were created by <strong>Richard Rudd</strong>, a British mystic, poet, and former student of Ra Uru Hu (the founder of Human Design). After years of study and contemplation, Rudd received what he describes as a transmission that built upon the 64 hexagrams of the I Ching and the 64 codons of the human genetic code.
            </p>
            <p>
              Published in 2009 as <em>The Gene Keys: Unlocking the Higher Purpose Hidden in Your DNA</em>, the system offers a contemplative framework for understanding the spectrum of human consciousness, from our deepest wounds to our highest spiritual potential.
            </p>
            <p>
              Where Human Design emphasizes <strong>mechanics</strong> (how your energy works), the Gene Keys emphasize <strong>contemplation</strong> (how your consciousness evolves). They are complementary systems: one gives you the map, the other gives you the path.
            </p>
          </Section>

          <Section title="The Core Framework: Shadow, Gift, Siddhi">
            <p>
              Each of the 64 Gene Keys exists on a spectrum of three frequencies:
            </p>
            <FrequencyCard
              name="Shadow"
              color="#8b5cf6"
              desc="The lowest frequency: where fear, reactivity, and unconscious patterns live. Every Gene Key has a Shadow, and every human being spends time in the Shadow frequency. The Shadow is not something to be ashamed of; it is the raw material of transformation. It is the compost from which the Gift grows."
            />
            <FrequencyCard
              name="Gift"
              color="var(--gold, #c9a84c)"
              desc="The middle frequency: where the Shadow is transmuted through awareness into a creative, life-serving quality. The Gift is what emerges when you stop resisting your Shadow and begin to work with it. Every Gift is unique, and every Gift is your natural genius, the thing you do effortlessly when you're aligned."
            />
            <FrequencyCard
              name="Siddhi"
              color="#4ade80"
              desc="The highest frequency: a state of total embodiment and spiritual realization. The Siddhi (a Sanskrit word meaning 'perfection' or 'attainment') is what becomes available when the Gift has been lived fully and completely. Siddhis are rare, but they are the potential within every Gene Key, the ultimate flowering of that particular frequency."
            />
            <p style={{ marginTop: "1rem" }}>
              The path is not linear. You don't "graduate" from Shadow to Gift to Siddhi. The work is to bring <strong>awareness</strong> to the Shadow (to see it clearly, without judgment) and allow the natural alchemy of contemplation to raise your frequency. This is not forced. It is allowed.
            </p>
          </Section>

          <Section title="The 64 Gene Keys">
            <p>
              The 64 Gene Keys correspond to the 64 hexagrams of the I Ching and the 64 codons of the human genetic code. This is not a metaphor: there are exactly 64 possible combinations of the four nucleotide bases (A, T, C, G) arranged in codons of three, and there are exactly 64 hexagrams in the I Ching, each composed of six lines (yin or yang).
            </p>
            <p>
              Richard Rudd describes this as evidence that the same mathematical intelligence that structures our DNA also structures the oldest wisdom text in human history. The Gene Keys are the bridge between the two, a living contemplation of the 64 archetypes that define human consciousness.
            </p>
            <p>
              Each Gene Key carries a theme that expresses differently at each frequency. For example:
            </p>
            <GeneKeyExample
              key_num="1"
              shadow="Entropy"
              gift="Freshness"
              siddhi="Beauty"
              desc="At the Shadow level, there is decay, stagnation, and the feeling that nothing is new. At the Gift level, there is a fresh, creative vitality: the ability to see everything as if for the first time. At the Siddhi level, there is Beauty, not aesthetic beauty, but the fractal beauty of existence itself."
            />
            <GeneKeyExample
              key_num="22"
              shadow="Dishonor"
              gift="Graciousness"
              siddhi="Grace"
              desc="At the Shadow, relationships are strained by emotional reactivity and dishonor. At the Gift, there is graciousness: the ability to hold space for others with warmth and emotional intelligence. At the Siddhi, there is Grace, a state where every interaction becomes a transmission of love."
            />
            <GeneKeyExample
              key_num="55"
              shadow="Victimization"
              gift="Freedom"
              siddhi="Freedom"
              desc="The most mysterious of all Gene Keys: where the Gift and the Siddhi share the same name. At the Shadow, there is a deep sense of being a victim of circumstance. At the Gift, freedom begins to emerge from within. At the Siddhi, freedom is total, not freedom from something, but freedom as the nature of consciousness itself."
            />
          </Section>

          <Section title="Your Hologenetic Profile">
            <p>
              Your personal Gene Keys profile, called your <strong>Hologenetic Profile</strong>, is calculated from the same birth data as your Human Design chart. It identifies which of the 64 Gene Keys govern the most essential spheres of your life.
            </p>
            <p>
              The profile is organized into three sequences, each representing a different dimension of your journey:
            </p>
            <SequenceCard
              name="The Activation Sequence"
              subtitle="Your Genius"
              spheres={["Life's Work", "Evolution", "Radiance", "Purpose"]}
              desc="The four Gene Keys that define your core genius: the gifts you came here to express, the evolutionary edge you're working with, the quality of presence you radiate, and the deeper purpose that runs beneath everything."
            />
            <SequenceCard
              name="The Venus Sequence"
              subtitle="Your Heart"
              spheres={["Attraction", "IQ", "EQ", "SQ", "Core Wound", "Vocation"]}
              desc="The six Gene Keys that govern your relationships: how you attract others, how your mind and emotions interact, the core wound that shapes your intimacy patterns, and how love becomes your vocation."
              accent="var(--rose)"
            />
            <SequenceCard
              name="The Pearl Sequence"
              subtitle="Your Prosperity"
              spheres={["Vocation", "Culture", "Brand", "Pearl"]}
              desc="The four Gene Keys that determine how you attract abundance: your natural vocation, the culture you create around you, how you are seen in the world, and the ultimate expression of your prosperity."
            />
          </Section>

          <Section title="Contemplation: The Practice">
            <p>
              The Gene Keys are not meant to be analyzed. They are meant to be <strong>contemplated</strong>. Contemplation is a practice that sits between meditation and study: you hold the theme of a Gene Key in your awareness, let it permeate your daily experience, and notice how it shows up in your life.
            </p>
            <p>
              Richard Rudd recommends spending time with one Gene Key at a time: reading the Shadow, sitting with it, watching where it appears in your reactions, your patterns, your relationships. Over time, the awareness itself begins to transmute the frequency. The Shadow doesn't disappear; it becomes the fuel for the Gift.
            </p>
            <p>
              This is the heart of the Gene Keys: <strong>awareness is the catalyst</strong>. You don't need to fix yourself. You need to see yourself clearly.
            </p>
          </Section>

          <Section title="Your Gene Keys in Your Blueprint">
            <p>
              Your complete Hologenetic Profile, all three sequences, with each Gene Key identified and interpreted, lives inside your <strong>Soul Blueprint</strong>. The Blueprint doesn't just list your Gene Keys. It walks through each one: what the Shadow looks like in your life, what the Gift makes possible, and what the Siddhi represents for your highest potential.
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
      <h2 style={{ color: "var(--roseL)", fontSize: "1.3rem", marginBottom: "1rem", borderBottom: "1px solid rgba(199,107,138,0.2)", paddingBottom: "0.5rem" }}>
        {title}
      </h2>
      <div style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: "0.95rem" }}>
        {children}
      </div>
    </section>
  );
}

function FrequencyCard({ name, color, desc }: { name: string; color: string; desc: string }) {
  return (
    <div style={{ padding: "1rem 1.2rem", marginTop: "1rem", borderLeft: `3px solid ${color}`, background: "rgba(255,255,255,0.03)", borderRadius: "0 8px 8px 0" }}>
      <h3 style={{ color, fontSize: "1rem", marginBottom: "0.4rem" }}>{name}</h3>
      <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  );
}

function GeneKeyExample({ key_num, shadow, gift, siddhi, desc }: { key_num: string; shadow: string; gift: string; siddhi: string; desc: string }) {
  return (
    <div className="card" style={{ padding: "1.2rem 1.5rem", marginTop: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
        <span style={{ color: "var(--roseL)", fontWeight: 700, fontSize: "1.1rem" }}>Gene Key {key_num}</span>
        <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>
          {shadow} → {gift} → {siddhi}
        </span>
      </div>
      <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  );
}

function SequenceCard({ name, subtitle, spheres, desc, accent }: { name: string; subtitle: string; spheres: string[]; desc: string; accent?: string }) {
  const color = accent || "var(--gold)";
  const bg = accent ? "rgba(199,107,138,0.12)" : "rgba(201,168,76,0.15)";
  return (
    <div className="card" style={{ padding: "1.2rem 1.5rem", marginTop: "1rem", borderLeft: accent ? `3px solid ${accent}` : undefined }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
        <span style={{ color: "var(--light)", fontWeight: 600 }}>{name}</span>
        <span style={{ color, fontSize: "0.8rem" }}>({subtitle})</span>
      </div>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
        {spheres.map((s) => (
          <span key={s} style={{ background: bg, color, padding: "0.15rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem" }}>
            {s}
          </span>
        ))}
      </div>
      <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  );
}
