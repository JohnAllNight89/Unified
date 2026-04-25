import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./shared.css";

export default function DiscoverNumerology() {
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
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem", color: "var(--gold)" }}>◯</div>
          <span className="tag">Discover</span>
          <h1 style={{ color: "var(--light)", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", margin: "0.5rem 0" }}>
            Numerology
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 550, margin: "0 auto", lineHeight: 1.7 }}>
            The ancient science of numbers — how vibration, frequency, and mathematics encode the essence of who you are.
          </p>
        </div>

        <article className="discover-article">
          <Section title="Origins: Where Numbers Became Sacred">
            <p>
              Numerology is one of the oldest metaphysical sciences in human history. Its roots stretch back over 10,000 years, with evidence of numerical mysticism appearing independently across nearly every major civilization.
            </p>
            <p>
              In ancient <strong>Babylon</strong> (around 4,000 BCE), priest-mathematicians developed some of the first systems for assigning spiritual meaning to numbers, integrating them into their astrology and divination practices. The Babylonians believed that numbers were not human inventions but divine principles — the language through which the gods structured reality.
            </p>
            <p>
              In <strong>ancient Egypt</strong>, numbers governed everything from the proportions of the pyramids to the cycles of the Nile. Egyptian priests understood that the physical world was a reflection of mathematical order and that specific numbers carried specific powers.
            </p>
            <p>
              The <strong>Hebrew Kabbalists</strong> developed Gematria — a system that assigns numerical values to letters and words in the Torah, revealing hidden connections between concepts that share the same numerical value. This practice remains central to Jewish mysticism today.
            </p>
            <p>
              In <strong>China</strong>, numerology has been practiced for thousands of years through systems like Lo Shu (the magic square) and the I Ching, where numbers serve as the foundation for understanding the flow of energy and fate.
            </p>
          </Section>

          <Section title="Pythagoras: The Father of Western Numerology">
            <p>
              The figure most associated with modern numerology is <strong>Pythagoras of Samos</strong> (570–495 BCE), the Greek philosopher and mathematician. Pythagoras did not merely study numbers — he believed they were the fundamental substance of reality itself.
            </p>
            <p>
              His famous declaration — <em>"All is number"</em> — was not a metaphor. Pythagoras taught that every object, every sound, every relationship in the universe could be understood through numerical relationships. He founded a mystery school in Croton (southern Italy) where initiates studied music, geometry, astronomy, and the spiritual science of numbers as a unified discipline.
            </p>
            <p>
              Pythagoras and his school developed the system that forms the basis of most Western numerology practiced today: reducing multi-digit numbers to single digits (1–9), assigning numerical values to letters, and interpreting the vibrational meaning of each root number.
            </p>
          </Section>

          <Section title="The Two Major Systems">
            <p>
              Two primary systems of numerology are practiced today, each with a distinct history and methodology:
            </p>
            <SubSection title="Pythagorean (Western) Numerology">
              <p>
                The most widely practiced system in the Western world. It assigns numbers 1–9 to letters sequentially (A=1, B=2, C=3 ... I=9, J=1, K=2, etc.) and derives five core numbers from your full birth name and birth date.
              </p>
              <p>
                This is the system used in your Soul Blueprint. It emphasizes the <strong>vibrational frequency</strong> of your name as given at birth — the belief being that the name your parents chose was not accidental, but an energetic signature that aligns with your soul's purpose.
              </p>
            </SubSection>
            <SubSection title="Chaldean Numerology">
              <p>
                The older of the two systems, originating in ancient Mesopotamia (modern-day Iraq). Chaldean numerology assigns numbers 1–8 to letters based on the <strong>vibrational frequency of each sound</strong>, not its position in the alphabet. The number 9 is considered sacred and is not assigned to any letter.
              </p>
              <p>
                Chaldean numerology uses the name you are most commonly known by (rather than birth name) and tends to be regarded as more accurate by practitioners who specialize in it — though it is less widely known.
              </p>
            </SubSection>
          </Section>

          <Section title="The Five Core Numbers">
            <p>
              In Pythagorean numerology, five numbers form the core of your numerological profile. Together, they describe the full architecture of your personality, your inner life, and your life path:
            </p>
            <NumberCard num="1" name="Life Path Number" source="Birth date" desc="Your life's primary purpose and the central lesson your soul is here to learn. This is the most important number in your chart — it reveals the path itself, not the destination." />
            <NumberCard num="2" name="Expression Number" source="Full birth name" desc="Your natural talents, abilities, and the way you express yourself in the world. This number describes what you're equipped to do — the tools your soul brought to this lifetime." />
            <NumberCard num="3" name="Soul Urge Number" source="Vowels of birth name" desc="Your deepest inner desire — what your heart truly wants, beneath all the roles you play. This number often reveals motivations that even you may not be fully conscious of." accent="var(--rose)" />
            <NumberCard num="4" name="Personality Number" source="Consonants of birth name" desc="The outer mask — how others perceive you before they know you deeply. This is the energy you project into the world, the first impression your soul makes." />
            <NumberCard num="5" name="Birth Day Number" source="Day of birth" desc="A secondary talent or gift that supports your Life Path. A refined quality that adds nuance to your overall numerological profile." />
          </Section>

          <Section title="Master Numbers">
            <p>
              In numerology, the numbers <strong>11, 22, and 33</strong> are called Master Numbers. They are not reduced to single digits because they carry a higher vibrational frequency — a greater intensity of the qualities of their root numbers.
            </p>
            <p>
              <strong>11</strong> — The Master Intuitive. Heightened sensitivity, spiritual insight, and visionary awareness. The channel between the conscious and unconscious mind.
            </p>
            <p>
              <strong>22</strong> — The Master Builder. The ability to turn spiritual vision into material reality. The most powerful number in numerology for manifesting large-scale change.
            </p>
            <p>
              <span style={{ color: "var(--rose)" }}><strong>33</strong> — The Master Teacher.</span> Profound compassion, spiritual uplift, and the ability to heal through presence. The frequency of selfless love in its highest expression.
            </p>
          </Section>

          <Section title="Explore Your Own Numbers">
            <p>
              Your numerological profile is calculated from two things: your full name as given at birth, and your date of birth. These two inputs produce a unique five-number signature that no one else on Earth shares exactly.
            </p>
            <p>
              When you create a free profile on The Unified Spirit, your five core numbers are calculated instantly. For members who want to go deeper, the in-depth Numerology Report interprets each number in the context of your full chart — what it means for your relationships, your career, your spiritual growth, and the specific lessons this lifetime has for you.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
              <Link href="/sign-up" className="hero-btn">
                Get My Numbers Free
              </Link>
              <Link href="/#order" className="outline-btn">
                In-Depth Numerology Report
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
      <h2 style={{ color: "var(--gold, #c9a84c)", fontSize: "1.3rem", marginBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "0.5rem" }}>
        {title}
      </h2>
      <div style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: "0.95rem" }}>
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: "1.2rem", marginBottom: "1.2rem", paddingLeft: "1rem", borderLeft: "2px solid rgba(201,168,76,0.3)" }}>
      <h3 style={{ color: "var(--light)", fontSize: "1rem", marginBottom: "0.5rem" }}>{title}</h3>
      {children}
    </div>
  );
}

function NumberCard({ num, name, source, desc, accent }: { num: string; name: string; source: string; desc: string; accent?: string }) {
  const color = accent || "var(--gold)";
  return (
    <div className="card" style={{ padding: "1.2rem 1.5rem", marginTop: "1rem", borderLeft: accent ? `3px solid ${accent}` : undefined }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.5rem" }}>
        <span style={{ color, fontSize: "1.3rem", fontWeight: 700 }}>{num}</span>
        <span style={{ color: "var(--light)", fontWeight: 600 }}>{name}</span>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", marginLeft: "auto" }}>{source}</span>
      </div>
      <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  );
}
