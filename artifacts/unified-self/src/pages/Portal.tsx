import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useUser } from "@clerk/react";
import { Starfield } from "@/components/Starfield";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./shared.css";
import "./portal.css";

interface Profile {
  fullName: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  birthDate: string;
  birthTime?: string;
  birthPlace: string;
  numerologyData?: string;
  astrologyData?: string;
  humanDesignData?: string;
  geneKeysData?: string;
}

type SystemTab = "numerology" | "astro" | "humanDesign" | "geneKeys";

const SYSTEM_TABS: { key: SystemTab; label: string; icon: string }[] = [
  { key: "numerology", label: "Numerology", icon: "◯" },
  { key: "astro", label: "Astrology", icon: "☽" },
  { key: "humanDesign", label: "Human Design", icon: "◈" },
  { key: "geneKeys", label: "Gene Keys", icon: "✦" },
];

const SYSTEM_PLACEHOLDERS: Record<SystemTab, string> = {
  numerology: "e.g. Life Path: 7, Expression: 3, Soul Urge: 11, Personality: 5, Birth Day: 22",
  astro: "e.g. Sun: Scorpio, Moon: Pisces, Rising: Virgo, Mercury: Sagittarius, Venus: Libra",
  humanDesign: "e.g. Type: Projector, Authority: Emotional, Profile: 1/3, Strategy: Wait for invitation",
  geneKeys: "e.g. Life's Work: Gene Key 14, Evolution: Gene Key 2, Radiance: Gene Key 59, Purpose: Gene Key 27",
};

async function geocodePlace(place: string): Promise<{ lat: string; lng: string } | null> {
  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await resp.json();
    if (data && data[0]) return { lat: data[0].lat, lng: data[0].lon };
  } catch {
  }
  return null;
}

export default function Portal() {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [editing, setEditing] = useState(false);
  const [subStatus, setSubStatus] = useState<string>("inactive");
  const [activeSystemTab, setActiveSystemTab] = useState<SystemTab>("numerology");
  const [systemOpen, setSystemOpen] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    bio: "",
    avatarUrl: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    numerologyData: "",
    astrologyData: "",
    humanDesignData: "",
    geneKeysData: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const [profRes, subRes] = await Promise.all([
          fetch("/api/profile", { credentials: "include" }),
          fetch("/api/stripe/subscription-status", { credentials: "include" }),
        ]);
        if (!profRes.ok) throw new Error(`Profile fetch failed: ${profRes.status}`);
        if (!subRes.ok) throw new Error(`Subscription fetch failed: ${subRes.status}`);
        const profData = await profRes.json();
        const subData = await subRes.json();
        if (profData.profile && profData.profile.fullName) {
          setProfile(profData.profile);
          setHasProfile(true);
          setForm({
            fullName: profData.profile.fullName ?? "",
            username: profData.profile.username ?? "",
            bio: profData.profile.bio ?? "",
            avatarUrl: profData.profile.avatarUrl ?? "",
            birthDate: profData.profile.birthDate ?? "",
            birthTime: profData.profile.birthTime ?? "",
            birthPlace: profData.profile.birthPlace ?? "",
            numerologyData: profData.profile.numerologyData ?? "",
            astrologyData: profData.profile.astrologyData ?? "",
            humanDesignData: profData.profile.humanDesignData ?? "",
            geneKeysData: profData.profile.geneKeysData ?? "",
          });
        }
        setSubStatus(subData.status || "inactive");
      } catch (err) {
        console.error("[Portal] load error:", err);
        setLoadError("Could not load your profile. Please refresh to try again.");
      }
      setLoading(false);
    })();
  }, []);

  const isSubscribed = subStatus === "active" || subStatus === "trialing";

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.birthDate || !form.birthPlace) return;
    setSaving(true);
    setSaveError(null);
    try {
      const geo = await geocodePlace(form.birthPlace);
      const body: Record<string, string | undefined> = {
        fullName: form.fullName,
        birthDate: form.birthDate,
        birthPlace: form.birthPlace,
        username: form.username || undefined,
        bio: form.bio || undefined,
        avatarUrl: form.avatarUrl || undefined,
        numerologyData: form.numerologyData || undefined,
        astrologyData: form.astrologyData || undefined,
        humanDesignData: form.humanDesignData || undefined,
        geneKeysData: form.geneKeysData || undefined,
      };
      if (form.birthTime) body.birthTime = form.birthTime;
      if (geo) { body.birthLat = geo.lat; body.birthLng = geo.lng; }

      const res = await fetch("/api/profile", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || "Failed to save profile. Please try again.");
      } else if (data.profile) {
        setProfile(data.profile);
        setHasProfile(true);
        setEditing(false);
        setSystemOpen(false);
      }
    } catch (err) {
      console.error("[Portal] save error:", err);
      setSaveError("An unexpected error occurred. Please try again.");
    }
    setSaving(false);
  }

  async function handleSubscribe() {
    const origin = window.location.origin;
    const base = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
    const res = await fetch("/api/stripe/subscribe", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        successUrl: `${origin}${base}/portal`,
        cancelUrl: `${origin}${base}/membership`,
      }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Unable to start checkout. Please add Stripe keys.");
  }

  if (loading) {
    return (
      <div className="tus-page">
        <Starfield fixed />
        <Nav />
        <div className="portal-loading">
          <div className="portal-spinner" />
          <p>Preparing your portal…</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="tus-page">
        <Starfield fixed />
        <Nav />
        <div className="portal-loading">
          <p style={{ color: "var(--gold, #c9a84c)" }}>{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tus-page">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Starfield fixed />
      <Nav />
      <main id="main-content" className="portal-main">

        {/* ── GREETING ──────────────────────────────── */}
        <div className="portal-greeting">
          <span className="tag">Welcome back</span>
          <h1 className="portal-greeting-name">
            {hasProfile ? (profile?.fullName?.split(" ")[0] || user?.firstName || "Seeker") : (user?.firstName || "Seeker")}
          </h1>
          <p className="portal-greeting-sub">
            {hasProfile
              ? "Your soul data is saved. Explore your tools below."
              : "Let's begin by creating your profile."}
          </p>
          {!isSubscribed && hasProfile && (
            <Link href="/membership" className="portal-member-cta">
              ✦ &nbsp;Become a Member for $3.99/mo
            </Link>
          )}
          {isSubscribed && (
            <div className="portal-member-badge">✓ Active Member</div>
          )}
        </div>

        {/* ── PROFILE FORM ──────────────────────────── */}
        {(!hasProfile || editing) && (
          <section className="portal-section">
            <div className="portal-card portal-profile-form">
              <h2 className="portal-card-title">
                {hasProfile ? "Edit Your Profile" : "Create Your Profile"}
              </h2>
              <p className="portal-card-sub">
                Your birth data is the foundation of your soul map. All calculations are done from this information, and it is never shared.
              </p>
              <form onSubmit={handleSave} className="profile-form">

                {/* ── BASIC INFO ── */}
                <div className="profile-section-label">Basic Info</div>

                <div className="form-group">
                  <label htmlFor="fullName">Full Name (as given at birth)</label>
                  <input
                    id="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    placeholder="e.g. Maya Josephine Williams"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="username">Username <span className="form-opt">(optional)</span></label>
                    <input
                      id="username"
                      type="text"
                      value={form.username}
                      onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                      placeholder="e.g. maya_seeker"
                      maxLength={30}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="avatarUrl">Profile Photo URL <span className="form-opt">(optional)</span></label>
                    <input
                      id="avatarUrl"
                      type="url"
                      value={form.avatarUrl}
                      onChange={e => setForm(f => ({ ...f, avatarUrl: e.target.value }))}
                      placeholder="https://…"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bio">About Me <span className="form-opt">(optional)</span></label>
                  <textarea
                    id="bio"
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder="A few words about who you are, what you're seeking, or what brings you here…"
                    rows={3}
                    className="form-textarea"
                    maxLength={500}
                  />
                </div>

                {/* ── BIRTH DATA ── */}
                <div className="profile-section-label" style={{ marginTop: 8 }}>Birth Data</div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="birthDate">Birth Date</label>
                    <input
                      id="birthDate"
                      type="date"
                      value={form.birthDate}
                      onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="birthTime">Birth Time <span className="form-opt">(optional)</span></label>
                    <input
                      id="birthTime"
                      type="time"
                      value={form.birthTime}
                      onChange={e => setForm(f => ({ ...f, birthTime: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="birthPlace">Birth City &amp; Country</label>
                  <input
                    id="birthPlace"
                    type="text"
                    value={form.birthPlace}
                    onChange={e => setForm(f => ({ ...f, birthPlace: e.target.value }))}
                    placeholder="e.g. Atlanta, Georgia, USA"
                    required
                  />
                </div>
                <p className="form-note">
                  ✦ Birth time is needed for your Rising sign. Timezone is auto-detected from your birth location.
                </p>

                {/* ── SYSTEM DATA ── */}
                <div
                  className="profile-accordion-header"
                  onClick={() => setSystemOpen(o => !o)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={systemOpen}
                  onKeyDown={e => e.key === "Enter" && setSystemOpen(o => !o)}
                >
                  <div className="profile-section-label" style={{ margin: 0 }}>Known System Data <span className="form-opt">(optional)</span></div>
                  <span className="profile-accordion-arrow">{systemOpen ? "▲" : "▼"}</span>
                </div>

                {systemOpen && (
                  <div className="profile-system-panel">
                    <p className="profile-system-intro">
                      If you already know your numbers, placements, or type from a previous reading, enter them here to keep everything in one place.
                    </p>

                    <div className="profile-system-tabs" role="tablist">
                      {SYSTEM_TABS.map(tab => (
                        <button
                          key={tab.key}
                          type="button"
                          role="tab"
                          aria-selected={activeSystemTab === tab.key}
                          className={`profile-system-tab${activeSystemTab === tab.key ? " active" : ""}`}
                          onClick={() => setActiveSystemTab(tab.key)}
                        >
                          <span>{tab.icon}</span> {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="profile-system-tab-content" role="tabpanel">
                      {activeSystemTab === "numerology" && (
                        <div className="form-group">
                          <label htmlFor="numerologyData">Your Numerology Numbers</label>
                          <textarea
                            id="numerologyData"
                            value={form.numerologyData}
                            onChange={e => setForm(f => ({ ...f, numerologyData: e.target.value }))}
                            placeholder={SYSTEM_PLACEHOLDERS.numerology}
                            rows={3}
                            className="form-textarea"
                          />
                        </div>
                      )}
                      {activeSystemTab === "astro" && (
                        <div className="form-group">
                          <label htmlFor="astrologyData">Your Astrology Placements</label>
                          <textarea
                            id="astrologyData"
                            value={form.astrologyData}
                            onChange={e => setForm(f => ({ ...f, astrologyData: e.target.value }))}
                            placeholder={SYSTEM_PLACEHOLDERS.astro}
                            rows={3}
                            className="form-textarea"
                          />
                        </div>
                      )}
                      {activeSystemTab === "humanDesign" && (
                        <div className="form-group">
                          <label htmlFor="humanDesignData">Your Human Design Data</label>
                          <textarea
                            id="humanDesignData"
                            value={form.humanDesignData}
                            onChange={e => setForm(f => ({ ...f, humanDesignData: e.target.value }))}
                            placeholder={SYSTEM_PLACEHOLDERS.humanDesign}
                            rows={3}
                            className="form-textarea"
                          />
                        </div>
                      )}
                      {activeSystemTab === "geneKeys" && (
                        <div className="form-group">
                          <label htmlFor="geneKeysData">Your Gene Keys Profile</label>
                          <textarea
                            id="geneKeysData"
                            value={form.geneKeysData}
                            onChange={e => setForm(f => ({ ...f, geneKeysData: e.target.value }))}
                            placeholder={SYSTEM_PLACEHOLDERS.geneKeys}
                            rows={3}
                            className="form-textarea"
                          />
                        </div>
                      )}
                    </div>

                    {/* Subscriber-only locked section */}
                    {!isSubscribed && (
                      <div className="profile-system-lock">
                        <div className="profile-system-lock-inner">
                          <span className="profile-lock-icon">🔒</span>
                          <div>
                            <div className="profile-lock-title">Save readings to your profile</div>
                            <p className="profile-lock-desc">
                              Members can attach full reading notes and interpretations to each system. Upgrade for $3.99/mo.
                            </p>
                          </div>
                          <Link href="/membership" className="outline-btn" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                            View Benefits →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {saveError && (
                  <p style={{ color: "#e05252", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                    {saveError}
                  </p>
                )}
                <div className="form-actions">
                  <button type="submit" className="hero-btn" disabled={saving}>
                    {saving ? "Saving…" : hasProfile ? "Update Profile" : "Save My Profile"}
                  </button>
                  {hasProfile && (
                    <button type="button" className="outline-btn" onClick={() => { setEditing(false); setSystemOpen(false); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>
        )}

        {/* ── PROFILE SUMMARY (when not editing) ────── */}
        {hasProfile && !editing && (
          <>
            {/* Saved system data display */}
            {(profile?.numerologyData || profile?.astrologyData || profile?.humanDesignData || profile?.geneKeysData) && (
              <section className="portal-section">
                <span className="tag">Your Saved System Data</span>
                <h2 className="portal-section-title">What You Know About Yourself</h2>
                <div className="portal-system-data-grid">
                  {SYSTEM_TABS.map(tab => {
                    const dataKeyMap: Record<SystemTab, keyof Profile> = {
                      numerology: "numerologyData",
                      astro: "astrologyData",
                      humanDesign: "humanDesignData",
                      geneKeys: "geneKeysData",
                    };
                    const val = profile?.[dataKeyMap[tab.key]];
                    if (!val) return null;
                    return (
                      <div key={tab.key} className="portal-system-data-card card">
                        <div className="portal-system-data-icon">{tab.icon}</div>
                        <div className="portal-system-data-label">{tab.label}</div>
                        <p className="portal-system-data-value">{val as string}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── TOOLS ─────────────────────────────────── */}
            <section className="portal-section">
              <span className="tag">Your Free Tools</span>
              <h2 className="portal-section-title">Explore Your Soul Data</h2>
              <p className="portal-section-sub">
                Your numbers and your chart, calculated from your birth information: a beginning, not an ending.
              </p>

              <div className="portal-tools-grid">
                <Link href="/portal/numerology" className="portal-tool-card card">
                  <div className="portal-tool-icon">◯</div>
                  <div className="portal-tool-name">Numerology</div>
                  <p className="portal-tool-desc">
                    Your five core numbers (Life Path, Expression, Soul Urge, Personality, and Birth Day) with their essential meanings revealed.
                  </p>
                  <div className="portal-tool-cta">Explore My Numbers →</div>
                </Link>

                <Link href="/portal/astro" className="portal-tool-card card">
                  <div className="portal-tool-icon">☽</div>
                  <div className="portal-tool-name">Astro Chart</div>
                  <p className="portal-tool-desc">
                    Your full birth chart, every planet, every sign, every degree, calculated from your exact birth data. The map is yours. What does it mean?
                  </p>
                  <div className="portal-tool-cta">View My Chart →</div>
                </Link>
              </div>
            </section>

            {/* ── SUBSCRIPTION CTA ──────────────────────────── */}
            <section className="portal-section">
              <div className="portal-sub-banner">
                <div className="portal-sub-banner-left">
                  <span className="tag" style={{ textAlign: "left" }}>Monthly Membership</span>
                  <h3>Unlock What Your Chart Actually Means</h3>
                  <p>
                    Your chart shows the map. The membership gives you the guide: what each planet in each sign reveals about who you are, where you came from, and how this energy shows up in your daily life.
                  </p>
                  <ul className="portal-sub-list">
                    <li>Full interpretation of every planetary placement</li>
                    <li>The origins and mythology behind each archetype</li>
                    <li>How each placement shows up in real life, generalized but personal to your chart</li>
                    <li>Member pricing on all one-time reports while subscribed</li>
                  </ul>
                </div>
                <div className="portal-sub-banner-right">
                  {isSubscribed ? (
                    <>
                      <div className="portal-sub-badge">✓ Active Member</div>
                      <Link href="/portal/astro-interpretation" className="hero-btn">
                        Read My Interpretation →
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="portal-sub-price">
                        <span className="portal-sub-amount">$3.99</span>
                        <span className="portal-sub-period">/month</span>
                      </div>
                      <p className="portal-sub-note">Cancel any time. Less than a coffee.</p>
                      <button className="hero-btn" onClick={handleSubscribe}>
                        ✦ &nbsp;Start My Membership
                      </button>
                      <Link href="/membership" className="portal-membership-link">
                        See all benefits →
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* ── HUMAN DESIGN ──────────────────────── */}
            <section className="portal-section">
              <div className="portal-edu-card card">
                <div className="portal-edu-icon">◈</div>
                <span className="tag" style={{ textAlign: "left" }}>Learn the System</span>
                <h3 className="portal-edu-title">Human Design</h3>
                <p className="portal-edu-body">
                  Human Design is a synthesis of four ancient wisdom systems (Astrology, the I Ching, the Kabbalah, and the Hindu-Brahmin Chakra System) fused with modern quantum physics and genetics. It was transmitted through Ra Uru Hu in 1987 and has since become one of the most precise self-knowledge systems available to the modern seeker.
                </p>
                <p className="portal-edu-body">
                  At the heart of Human Design are five <strong>Types</strong> (Manifestors, Generators, Manifesting Generators, Projectors, and Reflectors), each with their own <strong>Strategy</strong> for navigating life, and their own <strong>Authority</strong> for making correct decisions. Living aligned with your Type is not a philosophy. It is a physical experiment with measurable results.
                </p>
                <p className="portal-edu-body">
                  Your chart, called the <strong>Bodygraph</strong>, is a nine-centered map of your energy field. Some of those centers are <strong>defined</strong> (consistent, reliable, fixed), and others are <strong>open</strong> (receptive, conditioned by the energy of others). The interplay between what is defined and what is open in you explains so much: why certain environments exhaust you, why certain people energize you, why certain kinds of work feel sustainable and others drain you completely.
                </p>
                <div className="portal-edu-types">
                  {[
                    { type: "Manifestors", pct: "9%", desc: "The initiators. Designed to act independently and inform those around them. Not waiting for permission." },
                    { type: "Generators", pct: "37%", desc: "The builders. Designed to respond to life and do work they love. Sustainable energy when aligned." },
                    { type: "Manifesting Generators", pct: "33%", desc: "Multi-passionate responders. Fast, efficient, and designed to follow what lights them up." },
                    { type: "Projectors", pct: "20%", desc: "The guides. Designed to wait for the invitation and to direct the energy of others with mastery." },
                    { type: "Reflectors", pct: "1%", desc: "The mirrors. Designed to reflect the health of the community. Rare, wise, and deeply lunar." },
                  ].map(({ type, pct, desc }) => (
                    <div key={type} className="portal-edu-type-row">
                      <div className="portal-edu-type-name">{type} <span className="portal-edu-type-pct">({pct})</span></div>
                      <div className="portal-edu-type-desc">{desc}</div>
                    </div>
                  ))}
                </div>
                <div className="portal-edu-cta">
                  <p>Your Human Design chart, your Type, Authority, Profile, Centers, Channels, and Gates, is fully calculated and interpreted inside your <strong>Soul Blueprint</strong>.</p>
                  <a className="hero-btn" href="/#order">✦ &nbsp;Get My Soul Blueprint</a>
                </div>
              </div>
            </section>

            {/* ── GENE KEYS ─────────────────────────── */}
            <section className="portal-section">
              <div className="portal-edu-card card">
                <div className="portal-edu-icon">✦</div>
                <span className="tag" style={{ textAlign: "left" }}>Learn the System</span>
                <h3 className="portal-edu-title">The Gene Keys</h3>
                <p className="portal-edu-body">
                  The Gene Keys are a living transmission created by Richard Rudd, built upon the 64 hexagrams of the I Ching and the 64 codons of the human genetic code. They map what Rudd calls your <strong>Genius</strong>: the unique gift you carry in your DNA, and the path your soul has designed for unlocking it.
                </p>
                <p className="portal-edu-body">
                  Each of the 64 Gene Keys contains a <strong>Shadow</strong>, a <strong>Gift</strong>, and a <strong>Siddhi</strong>: three frequencies of the same energy, representing the range from your deepest unconscious wound to your highest spiritual potential. The work of the Gene Keys is to move from Shadow into Gift, not by force, but through <em>contemplation</em>. The Siddhi is what becomes available when you have lived the Gift fully.
                </p>
                <p className="portal-edu-body">
                  Your personal <strong>Hologenetic Profile</strong> identifies which Gene Keys govern the most essential areas of your life: your <em>Life's Work</em>, your <em>Evolution</em>, your <em>Radiance</em>, your <em>Purpose</em>, and your <em>Attraction Field</em>. Each Gene Key in your profile is not an abstract concept. It is a specific frequency in your genetic code, a lived pattern in your behavior, and a doorway to a version of you that has not yet fully arrived.
                </p>
                <div className="portal-edu-sequences">
                  {[
                    { name: "Activation Sequence", desc: "Your genius: the core gifts that define your life's work and how you are designed to flourish." },
                    { name: "Venus Sequence", desc: "Your heart: the patterns that govern your most intimate relationships and your relationship with yourself.", accent: true },
                    { name: "Pearl Sequence", desc: "Your prosperity: how you are designed to attract and sustain abundance through your authentic expression." },
                  ].map(({ name, desc, accent }: { name: string; desc: string; accent?: boolean }) => (
                    <div key={name} className="portal-edu-seq-row">
                      <div className="portal-edu-seq-name" style={accent ? { color: "var(--roseL)" } : undefined}>{name}</div>
                      <div className="portal-edu-seq-desc">{desc}</div>
                    </div>
                  ))}
                </div>
                <div className="portal-edu-cta">
                  <p>Your Gene Keys Hologenetic Profile, all three sequences calculated and interpreted in your voice, lives inside your <strong>Soul Blueprint</strong>.</p>
                  <a className="hero-btn" href="/#order">✦ &nbsp;Get My Soul Blueprint</a>
                </div>
              </div>
            </section>

            <div className="portal-edit-row">
              <button className="outline-btn" onClick={() => setEditing(true)}>
                Edit My Profile
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
