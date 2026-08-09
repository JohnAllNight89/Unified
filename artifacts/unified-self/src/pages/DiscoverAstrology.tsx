import { Link } from "wouter";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./shared.css";

export default function DiscoverAstrology() {
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
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem", color: "var(--cobalt)" }}>☽</div>
          <span className="tag">Discover</span>
          <h1 style={{ color: "var(--light)", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", margin: "0.5rem 0" }}>
            Astrology
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 550, margin: "0 auto", lineHeight: 1.7 }}>
            Five thousand years of reading the sky, the original language of self-knowledge.
          </p>
        </div>

        <article className="discover-article">
          <Section title="The Oldest Science">
            <p>
              Astrology is the oldest system of symbolic knowledge in human civilization. Long before it was separated from astronomy, the study of celestial bodies was a unified discipline: the movements of the planets were both physical events and spiritual messages.
            </p>
            <p>
              The earliest astrological records appear in <strong>Mesopotamia</strong> around 2,000 BCE, where Babylonian priests tracked the movements of the planets and compiled omen texts that linked celestial phenomena to earthly events. These were not horoscopes in the modern sense; they were state-level divination, interpreting the will of the gods through the language of the sky.
            </p>
            <p>
              By the 7th century BCE, the Babylonians had developed the zodiac (a 360-degree belt of constellations through which the planets travel) and had begun casting birth charts for individual kings and nobles. This was the birth of natal astrology as we know it.
            </p>
          </Section>

          <Section title="The Greek Transformation">
            <p>
              Astrology arrived in Greece through the conquests of Alexander the Great (4th century BCE), and the Greeks transformed it from a system of omens into a philosophical framework. Figures like <strong>Ptolemy</strong> (2nd century CE) systematized astrology in his work <em>Tetrabiblos</em>, which remains one of the most influential astrological texts ever written.
            </p>
            <p>
              The Greeks introduced the concept of the <strong>Ascendant</strong> (Rising sign), the <strong>twelve houses</strong>, and the system of <strong>planetary aspects</strong>: the geometric angles between planets that describe how their energies interact. They also developed the idea that astrology could describe individual personality and fate, not just the destiny of nations.
            </p>
            <p>
              After the fall of Rome, much of this knowledge was preserved and expanded by <strong>Islamic scholars</strong> during the medieval period, who added new techniques and transmitted the tradition back to Europe during the Renaissance.
            </p>
          </Section>

          <Section title="Types of Astrology">
            <TypeCard
              name="Western (Tropical) Astrology"
              desc="The most widely practiced system in the Western world. Uses the tropical zodiac, which is aligned with the seasons (the vernal equinox defines 0° Aries). Your Sun sign is based on this system. Western astrology emphasizes psychological self-understanding, personal growth, and the archetypal meaning of planetary placements."
            />
            <TypeCard
              name="Vedic (Jyotish) Astrology"
              desc="The Hindu system of astrology, practiced for over 5,000 years in India. Uses the sidereal zodiac, which is aligned with the actual constellations (accounting for precession). Your Vedic Sun sign may differ from your Western sign by about 23 degrees. Jyotish places greater emphasis on karma, destiny, and predictive timing through systems called Dashas."
            />
            <TypeCard
              name="Chinese Astrology"
              desc="Based on a 12-year cycle of animal signs (Rat, Ox, Tiger, etc.), each associated with one of five elements (Wood, Fire, Earth, Metal, Water). Chinese astrology incorporates the lunar calendar, yin-yang theory, and a complex system of heavenly stems and earthly branches that produce a 60-year cycle."
            />
            <TypeCard
              name="Hellenistic Astrology"
              desc="The original Greco-Roman system from which Western astrology descended. Recently revived by modern scholars, Hellenistic astrology uses ancient techniques like whole sign houses, sect (day vs. night charts), and time-lord systems that were largely lost during the medieval period."
            />
            <TypeCard
              name="Evolutionary Astrology"
              desc="A modern approach that interprets the birth chart as a map of the soul's evolutionary journey across lifetimes. Developed by Jeffrey Wolf Green, it places Pluto and the Lunar Nodes at the center of chart interpretation, focusing on karmic patterns and soul-level growth."
            />
          </Section>

          <Section title="The Components of a Birth Chart">
            <p>Your birth chart (natal chart) is a snapshot of the sky at the exact moment and location of your birth. It contains four primary layers:</p>

            <ComponentBlock title="The Planets" items={[
              { name: "Sun", desc: "Core identity, ego, life force: who you are at your center" },
              { name: "Moon", desc: "Emotional nature, instincts, inner world: how you feel and what you need", accent: "var(--rose)" },
              { name: "Mercury", desc: "Communication, thinking, learning: how your mind works" },
              { name: "Venus", desc: "Love, beauty, values, pleasure: what you attract and what you find beautiful", accent: "var(--rose)" },
              { name: "Mars", desc: "Drive, ambition, anger, sexuality: how you assert yourself and pursue desires" },
              { name: "Jupiter", desc: "Growth, abundance, wisdom, faith: where you expand and find meaning" },
              { name: "Saturn", desc: "Structure, discipline, limitation, maturity: where you face your hardest lessons" },
              { name: "Uranus", desc: "Revolution, innovation, awakening: where you break free from convention" },
              { name: "Neptune", desc: "Spirituality, dreams, illusion, compassion: where boundaries dissolve" },
              { name: "Pluto", desc: "Transformation, power, death and rebirth: where you face the deepest change" },
            ]} />

            <ComponentBlock title="The 12 Signs" items={[
              { name: "Aries ♈", desc: "Cardinal Fire: initiative, courage, pioneering energy" },
              { name: "Taurus ♉", desc: "Fixed Earth: stability, sensuality, material security" },
              { name: "Gemini ♊", desc: "Mutable Air: curiosity, communication, duality" },
              { name: "Cancer ♋", desc: "Cardinal Water: nurturing, emotional depth, protection" },
              { name: "Leo ♌", desc: "Fixed Fire: creativity, self-expression, radiance" },
              { name: "Virgo ♍", desc: "Mutable Earth: analysis, service, refinement" },
              { name: "Libra ♎", desc: "Cardinal Air: balance, partnership, harmony" },
              { name: "Scorpio ♏", desc: "Fixed Water: intensity, transformation, depth" },
              { name: "Sagittarius ♐", desc: "Mutable Fire: exploration, philosophy, freedom" },
              { name: "Capricorn ♑", desc: "Cardinal Earth: ambition, structure, mastery" },
              { name: "Aquarius ♒", desc: "Fixed Air: innovation, community, individuality" },
              { name: "Pisces ♓", desc: "Mutable Water: intuition, transcendence, compassion" },
            ]} />

            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ color: "var(--light)", fontSize: "1rem", marginBottom: "0.5rem" }}>The 12 Houses</h3>
              <p>The houses divide the sky into twelve sectors, each governing a different area of life, from identity (1st) to career (10th) to the unconscious (12th). Which house a planet falls in tells you <em>where</em> in your life that planet's energy expresses itself.</p>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ color: "var(--light)", fontSize: "1rem", marginBottom: "0.5rem" }}>Aspects</h3>
              <p>Aspects are the angular relationships between planets: conjunctions (0°), sextiles (60°), squares (90°), trines (120°), and oppositions (180°). They describe how the energies of different planets interact, whether they support each other, challenge each other, or create tension that demands growth.</p>
            </div>
          </Section>

          <Section title="Explore Your Birth Chart">
            <p>
              Your birth chart is calculated from three pieces of information: your date of birth, your time of birth, and your place of birth. The date determines which signs the planets were in. The time determines your Rising sign and house placements. The place determines the exact degree of each calculation.
            </p>
            <p>
              When you create a free profile on The Unified Spirit, your full birth chart is calculated instantly: every planet, every sign, every degree. For subscribers, the Astro Interpretation page reveals what each placement actually means for your life. And the in-depth Astro Reading goes even deeper, contextualizing your chart as a complete narrative.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
              <Link href="/sign-up" className="hero-btn">
                See My Birth Chart Free
              </Link>
              <Link href="/#order" className="outline-btn">
                In-Depth Astro Reading
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
      <h2 style={{ color: "var(--cobaltL)", fontSize: "1.3rem", marginBottom: "1rem", borderBottom: "1px solid rgba(107,140,206,0.2)", paddingBottom: "0.5rem" }}>
        {title}
      </h2>
      <div style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: "0.95rem" }}>
        {children}
      </div>
    </section>
  );
}

function TypeCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="card" style={{ padding: "1.2rem 1.5rem", marginTop: "1rem" }}>
      <h3 style={{ color: "var(--light)", fontSize: "1rem", marginBottom: "0.4rem" }}>{name}</h3>
      <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{desc}</p>
    </div>
  );
}

function ComponentBlock({ title, items }: { title: string; items: { name: string; desc: string; accent?: string }[] }) {
  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h3 style={{ color: "var(--light)", fontSize: "1rem", marginBottom: "0.8rem" }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {items.map((item) => (
          <div key={item.name} style={{ display: "flex", gap: "0.8rem", alignItems: "baseline", padding: "0.3rem 0" }}>
            <span style={{ color: item.accent || "var(--cobalt)", fontWeight: 600, minWidth: 100, fontSize: "0.9rem" }}>{item.name}</span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
