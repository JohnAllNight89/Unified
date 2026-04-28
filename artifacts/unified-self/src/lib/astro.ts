const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

function sind(deg: number) { return Math.sin(deg * DEG); }
function cosd(deg: number) { return Math.cos(deg * DEG); }
function tand(deg: number) { return Math.tan(deg * DEG); }
function atan2d(y: number, x: number) { return Math.atan2(y, x) * RAD; }
function mod360(n: number) { return ((n % 360) + 360) % 360; }

export function julianDay(year: number, month: number, day: number, hour = 12): number {
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5 + hour / 24;
}

function solveKepler(M: number, e: number): number {
  let E = M;
  for (let i = 0; i < 50; i++) {
    const dE = (M - E + e * RAD * sind(E)) / (1 - e * cosd(E));
    E += dE;
    if (Math.abs(dE) < 1e-8) break;
  }
  return E;
}

function sunLongitude(jd: number): number {
  const d = jd - 2451543.5;
  const w = mod360(282.9404 + 4.70935e-5 * d);
  const M = mod360(356.0470 + 0.9856002585 * d);
  const e = 0.016709 - 1.151e-9 * d;
  const E = solveKepler(M, e);
  const x = cosd(E) - e;
  const y = Math.sqrt(1 - e * e) * sind(E);
  const v = atan2d(y, x);
  return mod360(v + w);
}

interface Vec3 { x: number; y: number; z: number }

function sunPosition(jd: number): Vec3 {
  const d = jd - 2451543.5;
  const w = mod360(282.9404 + 4.70935e-5 * d);
  const M = mod360(356.0470 + 0.9856002585 * d);
  const e = 0.016709 - 1.151e-9 * d;
  const E = solveKepler(M, e);
  const xv = cosd(E) - e;
  const yv = Math.sqrt(1 - e * e) * sind(E);
  const v = atan2d(yv, xv);
  const r = Math.sqrt(xv * xv + yv * yv);
  const lonsun = mod360(v + w);
  return {
    x: r * cosd(lonsun),
    y: r * sind(lonsun),
    z: 0,
  };
}

interface OrbitalElements {
  N: number; Nd: number;
  i: number; id: number;
  w: number; wd: number;
  a: number;
  e: number; ed: number;
  M: number; Md: number;
}

const ELEMENTS: Record<string, OrbitalElements> = {
  mercury: { N:48.3313, Nd:3.24587e-5, i:7.0047, id:5.00e-8, w:29.1241, wd:1.01444e-5, a:0.387098, e:0.205635, ed:5.59e-10, M:168.6562, Md:4.0923344368 },
  venus:   { N:76.6799, Nd:2.46590e-5, i:3.3946, id:2.75e-8, w:54.8910, wd:1.38374e-5, a:0.723330, e:0.006773, ed:-1.302e-9, M:48.0052,  Md:1.6021302244 },
  mars:    { N:49.5574, Nd:2.11081e-5, i:1.8497, id:1.78e-8, w:286.5016, wd:2.92961e-5, a:1.523688, e:0.093405, ed:2.516e-9, M:18.6021,  Md:0.5240207766 },
  jupiter: { N:100.4542, Nd:2.76854e-5, i:1.3030, id:-1.557e-7, w:273.8777, wd:1.64505e-5, a:5.20256, e:0.048498, ed:4.469e-9, M:19.8950, Md:0.0830853001 },
  saturn:  { N:113.6634, Nd:2.38980e-5, i:2.4886, id:-1.081e-7, w:339.3939, wd:2.97661e-5, a:9.55475, e:0.055546, ed:-9.499e-9, M:316.9670, Md:0.0334442282 },
  uranus:  { N:74.0005, Nd:1.3978e-5, i:0.7733, id:1.9e-8, w:96.6612, wd:3.0565e-5, a:19.18171, e:0.047318, ed:7.45e-9, M:142.5905, Md:0.011725806 },
  neptune: { N:131.7806, Nd:3.0173e-5, i:1.7700, id:-2.55e-7, w:272.8461, wd:-6.027e-6, a:30.05826, e:0.008606, ed:2.15e-9, M:260.2471, Md:0.005995147 },
};

function planetHeliocentric(d: number, el: OrbitalElements): Vec3 {
  const N = mod360(el.N + el.Nd * d);
  const i = el.i + el.id * d;
  const w = mod360(el.w + el.wd * d);
  const e = el.e + el.ed * d;
  const M = mod360(el.M + el.Md * d);
  const E = solveKepler(M, e);
  const xv = el.a * (cosd(E) - e);
  const yv = el.a * Math.sqrt(1 - e * e) * sind(E);
  const v = atan2d(yv, xv);
  const r = Math.sqrt(xv * xv + yv * yv);
  const lon = mod360(v + w);
  const xh = r * (cosd(N) * cosd(lon) - sind(N) * sind(lon) * cosd(i));
  const yh = r * (sind(N) * cosd(lon) + cosd(N) * sind(lon) * cosd(i));
  const zh = r * sind(lon) * sind(i);
  return { x: xh, y: yh, z: zh };
}

function moonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = mod360(218.3164477 + 481267.88123421 * T);
  const M  = mod360(357.5291092 + 35999.0502909 * T);
  const Mp = mod360(134.9633964 + 477198.8675055 * T);
  const D  = mod360(297.8501921 + 445267.1114034 * T);
  const F  = mod360(93.2720950  + 483202.0175233 * T);
  const sl =
    6288774 * sind(Mp) +
    1274027 * sind(2*D - Mp) +
    658314  * sind(2*D) +
    213618  * sind(2*Mp) +
    -185116  * sind(M) +
    -114332  * sind(2*F) +
    58793   * sind(2*D - 2*Mp) +
    57066   * sind(2*D - M - Mp) +
    53322   * sind(2*D + Mp) +
    45758   * sind(2*D - M) +
    -40923  * sind(Mp - M) +
    -34720  * sind(D) +
    -30383  * sind(Mp + M) +
    15327   * sind(2*D - 2*F) +
    -12528  * sind(Mp + 2*F) +
    10980   * sind(Mp - 2*F) +
    10675   * sind(4*D - Mp) +
    10034   * sind(3*Mp) +
    8548    * sind(4*D - 2*Mp) +
    -7888   * sind(2*D + M - Mp) +
    -6766   * sind(2*D + M) +
    -5163   * sind(D - Mp);
  return mod360(L0 + sl / 1000000);
}

function obliquity(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.439291111 - 0.013004167 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;
}

function ascendant(jd: number, latDeg: number, lngDeg: number): number {
  const e = obliquity(jd);
  // GMST (degrees) via IAU formula — jd already encodes the UT
  const GMST = mod360(280.46061837 + 360.98564736629 * (jd - 2451545.0));
  const LST = mod360(GMST + lngDeg);
  return mod360(atan2d(cosd(LST), -sind(LST) * cosd(e) - tand(latDeg) * sind(e)));
}

export const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];
export const SIGN_SYMBOLS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];

export function signFromDegree(deg: number): { sign: string; symbol: string; degree: number } {
  const d = mod360(deg);
  const idx = Math.floor(d / 30);
  return {
    sign: SIGNS[idx],
    symbol: SIGN_SYMBOLS[idx],
    degree: Math.floor(d % 30),
  };
}

export interface PlanetPosition {
  planet: string;
  longitude: number;
  sign: string;
  symbol: string;
  degree: number;
  retrograde?: boolean;
}

export interface ChartResult {
  sun: PlanetPosition;
  moon: PlanetPosition;
  rising: PlanetPosition | null;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
}

function makePlanet(name: string, lon: number): PlanetPosition {
  const s = signFromDegree(lon);
  return { planet: name, longitude: lon, ...s };
}

export function calculateChart(
  birthDate: string,
  birthTime: string | null | undefined,
  birthLat: number | null,
  birthLng: number | null,
  utcOffsetHours = 0,
): ChartResult {
  const [y, m, d] = birthDate.split("-").map(Number);
  let hour = 12;
  if (birthTime) {
    const timePart = birthTime.split(/[+-]\d/)[0].trim();
    const [h, min] = timePart.split(":").map(Number);
    hour = h + (min || 0) / 60;
  }
  // Shift local time to UTC for accurate planetary positions
  const jd = julianDay(y, m, d, hour - utcOffsetHours);
  const dd = jd - 2451543.5;

  const sunLon = sunLongitude(jd);
  const moonLon = moonLongitude(jd);
  const sun = makePlanet("Sun", sunLon);
  const moon = makePlanet("Moon", moonLon);

  let rising: PlanetPosition | null = null;
  if (birthTime && birthLat !== null && birthLng !== null) {
    const ascLon = ascendant(jd, birthLat, birthLng);
    rising = makePlanet("Rising", ascLon);
  }

  function geo(name: string, elKey: string): PlanetPosition {
    const el = ELEMENTS[elKey];
    const h = planetHeliocentric(dd, el);
    const sunPos = sunPosition(jd);
    const gx = h.x + sunPos.x;
    const gy = h.y + sunPos.y;
    const gz = h.z;
    const lon = mod360(atan2d(gy, gx));
    return makePlanet(name, lon);
  }

  return {
    sun,
    moon,
    rising,
    mercury: geo("Mercury", "mercury"),
    venus:   geo("Venus",   "venus"),
    mars:    geo("Mars",    "mars"),
    jupiter: geo("Jupiter", "jupiter"),
    saturn:  geo("Saturn",  "saturn"),
    uranus:  geo("Uranus",  "uranus"),
    neptune: geo("Neptune", "neptune"),
    pluto:   makePlanet("Pluto", mod360(238.929 + 0.003968789 * (jd - 2451545.0) / 365.25 * 360 / 248)),
  };
}

export const PLANET_MEANINGS: Record<string, {
  symbol: string;
  rules: string;
  archetype: string;
  keywords: string;
  origin: string;
  signMeanings: Record<string, { teaser: string; deep: string }>;
}> = {
  Sun: {
    symbol: "☉",
    rules: "Leo",
    archetype: "The Sovereign — the core self, life force, and conscious identity",
    keywords: "Identity, vitality, purpose, will, self-expression",
    origin: "In ancient cosmology the Sun was the central deity — Ra in Egypt, Apollo in Greece, Sol Invictus in Rome. It was understood as the source of all life and the visible expression of divine order. In your chart it represents who you were designed to consciously become.",
    signMeanings: {
      Aries: { teaser: "You are built to initiate and lead. Your fire is direct, courageous, and unapologetically first.", deep: "Sun in Aries carries the energy of the pioneer — the first spark of creation. You are motivated by challenge, energized by fresh beginnings, and designed to act before others have finished deliberating. You came here to model courage." },
      Taurus: { teaser: "You are built for depth and endurance. Beauty, stability, and presence are your native gifts.", deep: "Sun in Taurus is anchored in the material world with a quiet mastery. You know the value of things — time, sensation, relationship, and craft. You are here to build what lasts and to model what it looks like to be fully, unhurriedly present." },
      Gemini: { teaser: "You are built to think, connect, and communicate. Your mind moves fast and your curiosity is your compass.", deep: "Sun in Gemini carries the energy of the bridge-builder — the one who connects ideas, people, and worlds. You are designed to be perpetually curious, endlessly adaptable, and unafraid of complexity. Your gift is translation: making difficult things accessible." },
      Cancer: { teaser: "You are built to feel deeply and protect fiercely. Your emotional intelligence is your greatest power.", deep: "Sun in Cancer holds the archetype of the nurturer and the guardian. You feel the emotional undercurrents of every room, every relationship, every moment. You are designed to create safety — in your own life first, and then for those you love." },
      Leo: { teaser: "You are built to shine and to lead from the heart. Your warmth and generosity are your signature.", deep: "Sun in Leo carries the fullest expression of solar energy — radiant, generous, and unapologetically seen. You are here to express yourself fully, to lead with your heart, and to remind others of their own worth through the confidence you embody." },
      Virgo: { teaser: "You are built to refine and to serve. Your precision and discernment are gifts, not burdens.", deep: "Sun in Virgo holds the energy of the craftsperson and the healer. You notice what others miss. You feel called to improve, to perfect, and to be of genuine use. Your challenge is to recognize that your standards — including the ones you hold for yourself — can be a form of love when applied with gentleness." },
      Libra: { teaser: "You are built for harmony, beauty, and fairness. Relationship and balance are your native terrain.", deep: "Sun in Libra carries the frequency of the diplomat and the aesthete. You feel most alive in partnership, most aligned when beauty and fairness coexist, most yourself when you are in right relationship with the world around you. Your challenge is to define your own truth, independent of the mirror others offer you." },
      Scorpio: { teaser: "You are built to go deep. Transformation, intensity, and truth are your calling.", deep: "Sun in Scorpio holds the energy of the alchemist — the soul who is not afraid of what lives in the dark. You feel everything at full intensity, you are driven by the desire to understand what is real beneath what is visible, and you carry a transformative power that affects every space you enter." },
      Sagittarius: { teaser: "You are built to explore and to expand. Truth, freedom, and meaning are your oxygen.", deep: "Sun in Sagittarius carries the energy of the philosopher and the adventurer. You are motivated by meaning — by understanding why things are the way they are and what it all points to. You have a natural optimism and a contagious enthusiasm that draws people toward the vision you carry." },
      Capricorn: { teaser: "You are built to achieve and to lead at the highest levels. Discipline and legacy are your calling.", deep: "Sun in Capricorn holds the energy of the strategist and the elder. You understand that anything worth having is built over time, with intention, through sustained effort. You carry an inner authority that others recognize, even when you cannot see it in yourself." },
      Aquarius: { teaser: "You are built to innovate and to serve the collective. You see the future before it arrives.", deep: "Sun in Aquarius carries the frequency of the visionary and the humanitarian. You think differently from most people around you — not because something is wrong with you, but because you are designed to see further ahead. You are here to disrupt, to innovate, and to serve something larger than personal gain." },
      Pisces: { teaser: "You are built to dream and to heal. Your empathy and intuition are a form of intelligence.", deep: "Sun in Pisces holds the archetype of the mystic and the healer. You feel the invisible — emotion, energy, spiritual undercurrents — as clearly as others feel physical sensation. You are designed to dissolve the boundaries that keep people separate and to remind humanity of its interconnection." },
    },
  },
  Moon: {
    symbol: "☽",
    rules: "Cancer",
    archetype: "The Inner World — emotional nature, instinct, memory, and belonging",
    keywords: "Emotions, instinct, comfort, memory, the subconscious",
    origin: "The Moon was revered as the great feminine principle across every ancient culture — Selene and Artemis in Greece, Isis in Egypt, Inanna in Sumeria. In your chart she represents your emotional body: how you feel, what you need, what makes you feel safe, and the inherited patterns you carry from your lineage.",
    signMeanings: {
      Aries: { teaser: "Your emotional default is direct action. You process feelings by moving — and by doing.", deep: "Moon in Aries needs motion and expression. You feel safest when you are free to act on instinct, when there is no emotional debt to manage, when your feelings can be immediate and clean. Your challenge is to slow down enough to feel what you are actually feeling beneath the impulse to react." },
      Taurus: { teaser: "Your emotional home is steady and sensory. You need beauty, stability, and time.", deep: "Moon in Taurus finds safety in the physical world — in comfort, in beauty, in things that are unchanging. You have a deep loyalty and a profound capacity for patience. Your challenge is to recognize when attachment becomes resistance to the change that is trying to serve you." },
      Gemini: { teaser: "Your emotional world is curious and communicative. You process feelings through words and ideas.", deep: "Moon in Gemini needs to talk through its emotional experience. You feel what you think and think what you feel — the two are rarely separate. Your challenge is to stay present with a feeling long enough to understand it, rather than immediately translating it into a concept." },
      Cancer: { teaser: "Your emotional world is deep, intuitive, and powerfully tied to home and memory.", deep: "Moon in Cancer is in its home sign — the most emotionally attuned placement in the zodiac. You feel everything deeply, you remember everything emotionally, and your sense of belonging is central to your wellbeing. Your challenge is to distinguish between the feelings that are yours and the ones you have absorbed from others." },
      Leo: { teaser: "Your emotional world is warm, generous, and deeply tied to being seen and valued.", deep: "Moon in Leo needs love to feel safe — not just in theory, but shown, expressed, given. You are generous with your warmth when you feel secure. Your challenge is to recognize that your need to be appreciated is not vanity; it is how your heart stays open." },
      Virgo: { teaser: "Your emotional world is precise and service-oriented. You show love through acts of care.", deep: "Moon in Virgo processes emotion through analysis and practical service. You feel safest when you are useful, when there is order in your environment, and when you understand the root cause of what you are feeling. Your challenge is to receive care as readily as you give it." },
      Libra: { teaser: "Your emotional world seeks balance and partnership. You feel most yourself in right relationship.", deep: "Moon in Libra needs harmony in its emotional environment. You are attuned to imbalance, to injustice, to the unspoken tension in a room. Your challenge is to know your own emotional truth without requiring a relationship to reflect it back to you first." },
      Scorpio: { teaser: "Your emotional world is intense, private, and transformative. You feel at full depth.", deep: "Moon in Scorpio experiences emotion as a total body phenomenon. You do not feel things lightly — you feel them at their root. You have a powerful intuition, a radar for inauthenticity, and a capacity for emotional depth that few can match. Your challenge is to trust vulnerability as a source of power, not risk." },
      Sagittarius: { teaser: "Your emotional world is expansive, philosophical, and freedom-loving.", deep: "Moon in Sagittarius finds safety in meaning, movement, and openness. You feel trapped by smallness — of mindset, of environment, of expectation. Your challenge is to recognize that commitment is not the same as confinement, and that some of your deepest joy can be found inside the container of a chosen path." },
      Capricorn: { teaser: "Your emotional world is reserved, disciplined, and deeply responsible.", deep: "Moon in Capricorn learned early that emotions needed to be managed, controlled, or deferred. You are emotionally resilient and deeply reliable. Your challenge is to let yourself need — to allow the walls you built for survival to come down in the spaces where you are truly safe." },
      Aquarius: { teaser: "Your emotional world is independent and idealistic. You feel deeply for the collective.", deep: "Moon in Aquarius processes emotion through the lens of the community — you often feel more comfortable with the feelings of humanity than with your own. Your challenge is to bring that compassion inward, to tend to your own emotional needs with the same revolutionary care you offer the world." },
      Pisces: { teaser: "Your emotional world is vast, empathic, and spiritually attuned. You feel what others cannot name.", deep: "Moon in Pisces absorbs the emotional field of every environment it enters. You are extraordinarily empathic — sometimes to the point of losing track of where your feelings end and another's begin. Your challenge is to develop discernment: to know which feelings are yours to carry, and which belong to the collective." },
    },
  },
  Rising: {
    symbol: "⬆",
    rules: "The chart itself",
    archetype: "The Mask & The Threshold — how you arrive in the world and what others first perceive",
    keywords: "Appearance, first impressions, how you enter, your body's presentation",
    origin: "The Ascendant or Rising sign is the degree of the zodiac that was rising on the eastern horizon at the exact moment and place of your birth. Ancient astrologers considered it the face your soul presented upon entering this world — the doorway through which your chart begins, and the lens through which your entire life experience is colored.",
    signMeanings: {
      Aries: { teaser: "You enter every room with energy and presence. People feel your arrival before they understand it.", deep: "Aries Rising presents to the world as bold, direct, and action-oriented. You have a natural physical presence and a manner that reads as confident — often more confident than you internally feel. You process the world through initiative, and others look to you to go first." },
      Taurus: { teaser: "You arrive with steadiness and warmth. People feel safe in your presence from the first moment.", deep: "Taurus Rising presents to the world as grounded, reliable, and beautiful in movement and manner. You have a physical presence that is calming — you do not rush, you do not perform, you simply are. Others perceive you as someone who has everything under control, even when it does not feel that way from the inside." },
      Gemini: { teaser: "You arrive with wit and curiosity. People are immediately engaged by your mind.", deep: "Gemini Rising presents to the world as quick, curious, and communicative. You have an expressive face and a natural ease with language and connection. People find you easy to talk to and hard to categorize — which is exactly as it should be." },
      Cancer: { teaser: "You arrive with warmth and a quiet protectiveness. People immediately feel cared for by you.", deep: "Cancer Rising presents to the world as nurturing, intuitive, and emotionally available. You have a quality that invites disclosure — people tell you things they have not told others, because something in your presence signals that it is safe to do so." },
      Leo: { teaser: "You arrive with warmth and magnetism. People notice you when you walk in — even when you are trying not to be noticed.", deep: "Leo Rising presents to the world with a natural radiance and a quality of leadership that reads as effortless. You have a magnetic presence and a gift for making people feel seen and special. Your challenge is to stop asking whether you are taking up too much space." },
      Virgo: { teaser: "You arrive with quiet precision and discernment. People perceive you as capable and trustworthy.", deep: "Virgo Rising presents to the world as careful, competent, and genuinely invested in doing things well. You have a quality of attention that people find both reassuring and occasionally intimidating. Your challenge is to let imperfection be visible — to others and to yourself." },
      Libra: { teaser: "You arrive with grace and aesthetic presence. People are drawn to the harmony you embody.", deep: "Libra Rising presents to the world as charming, balanced, and genuinely interested in others. You have a natural diplomacy and a quality of fairness that makes people feel heard. Your challenge is to say what you actually think — not only what maintains the peace." },
      Scorpio: { teaser: "You arrive with intensity and magnetism. People sense something in you they cannot quite name.", deep: "Scorpio Rising presents to the world as powerful, private, and perceptive. You have a penetrating gaze and a quality of depth that makes people simultaneously drawn to you and slightly cautious. You see through performance, and people know it — even when they cannot explain how they know." },
      Sagittarius: { teaser: "You arrive with enthusiasm and expansiveness. People feel possibility around you.", deep: "Sagittarius Rising presents to the world as optimistic, adventurous, and philosophically inclined. You have a quality of aliveness that is contagious — being around you makes people feel that larger things are possible. Your challenge is to slow down enough to fully inhabit the experience you are already in." },
      Capricorn: { teaser: "You arrive with authority and quiet competence. People instinctively look to you to lead.", deep: "Capricorn Rising presents to the world as serious, capable, and trustworthy with responsibility. You carry a natural authority that often arrives before your words do. Your challenge is to let people see the warmth and wit that live beneath the composure." },
      Aquarius: { teaser: "You arrive as different — unmistakably, authentically yourself. People remember you.", deep: "Aquarius Rising presents to the world as original, independent, and intellectually alive. You have a quality of otherness that is not alienation — it is distinction. You are not trying to be different; you simply are, and people are fascinated by that." },
      Pisces: { teaser: "You arrive with softness and mystery. People feel something otherworldly about your presence.", deep: "Pisces Rising presents to the world as gentle, dreamy, and spiritually attuned. You have a quality of fluidity that makes you difficult to categorize and easy to project onto. Your challenge is to build an inner sense of self strong enough to navigate a world that will constantly try to define you." },
    },
  },
  Mercury: {
    symbol: "☿",
    rules: "Gemini & Virgo",
    archetype: "The Messenger — the mind, communication, and how you process information",
    keywords: "Thinking, speaking, learning, writing, the rational mind",
    origin: "Mercury was the messenger of the gods — Hermes in Greece, Thoth in Egypt, Nabu in Babylon. In your chart he governs how your mind works: the speed and style of your thinking, how you communicate, and what you find intellectually compelling. He is the bridge between your inner world and the words you choose to describe it.",
    signMeanings: {
      Aries: { teaser: "Your mind is fast and direct. You think to decide, not to deliberate.", deep: "Mercury in Aries thinks in action — ideas arrive fully formed and demand immediate expression. You are intellectually fearless, unafraid to be first, and impatient with unnecessary complexity. Your challenge is to leave space for the second thought that sometimes improves on the first." },
      Taurus: { teaser: "Your mind moves deliberately and arrives at truth through deep consideration.", deep: "Mercury in Taurus is a careful, thorough thinker. You do not rush to conclusions — you build them, piece by piece, until they are solid. You have an excellent memory and a gift for practical problem-solving. Your challenge is to remain open to updating an idea once you have thoroughly decided it." },
      Gemini: { teaser: "Your mind is fast, curious, and multidirectional. You think in networks.", deep: "Mercury in Gemini is in one of its home signs — the mind is at its most agile, curious, and communicative. You think in connections, in language, in the pleasure of the idea itself. Your challenge is to commit to one direction long enough to see what it grows into." },
      Cancer: { teaser: "Your mind thinks through feeling. Intuition and memory are your instruments.", deep: "Mercury in Cancer processes information through emotional resonance. You remember what matters to you, think in images and stories, and are guided by instinct as much as logic. Your challenge is to trust your emotional knowing in contexts that reward only rational argument." },
      Leo: { teaser: "Your mind thinks in stories and speaks with conviction. You were made to captivate.", deep: "Mercury in Leo communicates with warmth, drama, and genuine heart. You think in terms of narrative — of meaning, of impact, of what this all means for the people involved. Your challenge is to let other perspectives into the story you are telling." },
      Virgo: { teaser: "Your mind is precise, analytical, and oriented toward what is useful.", deep: "Mercury in Virgo is in one of its home signs — the mind is sharp, discriminating, and oriented toward improvement. You see what is not working, you know how to fix it, and you communicate with clarity and precision. Your challenge is to trust that the imperfect attempt is worth more than the perfect plan never executed." },
      Libra: { teaser: "Your mind weighs everything with fairness and seeks truth through relationship.", deep: "Mercury in Libra thinks in balance — considering all sides, seeking the fairest resolution, reluctant to land anywhere that feels like taking sides. You have a gift for seeing others' perspectives. Your challenge is to develop your own, independent of the people you are in conversation with." },
      Scorpio: { teaser: "Your mind goes beneath the surface and does not stop until it finds the truth.", deep: "Mercury in Scorpio thinks with intensity and precision. You are designed to investigate — to pursue a question until it yields what it is hiding. You read between the lines, detect inauthenticity, and remember everything. Your challenge is to extend grace to those whose minds work less strategically than yours." },
      Sagittarius: { teaser: "Your mind thinks in large concepts and long arcs. You are a natural philosopher.", deep: "Mercury in Sagittarius thinks in systems, meaning, and possibility. You are interested in the forest, not the trees — in the pattern, not the data point. Your challenge is to bring your expansive vision into enough specificity that others can follow you there." },
      Capricorn: { teaser: "Your mind is strategic and structured. You think in terms of what works.", deep: "Mercury in Capricorn communicates with authority and precision. You think in outcomes — in what is practical, what is proven, and what will still be true in ten years. Your challenge is to stay open to ideas that do not yet have a track record." },
      Aquarius: { teaser: "Your mind is original and future-oriented. You think about things others have not thought yet.", deep: "Mercury in Aquarius is a visionary thinker — independent, unconventional, and drawn to the ideas that challenge existing structures. You are comfortable with complexity and drawn to the question that has not yet been asked. Your challenge is to communicate your ideas in language that does not leave your audience behind." },
      Pisces: { teaser: "Your mind thinks in images, symbols, and feeling. Intuition is your primary intelligence.", deep: "Mercury in Pisces thinks through impression and resonance rather than linear logic. You are a creative thinker who absorbs the emotional content of ideas as readily as the intellectual content. Your challenge is to find the language that bridges your inner knowing with the world that requires you to explain it." },
    },
  },
  Venus: {
    symbol: "♀",
    rules: "Taurus & Libra",
    archetype: "The Heart — love, beauty, value, and what you are magnetically drawn to",
    keywords: "Love, beauty, pleasure, values, attraction, self-worth",
    origin: "Venus was the goddess of love, beauty, and desire — Aphrodite in Greece, Inanna in Sumeria, Hathor in Egypt. In your chart she governs how you love, what you find beautiful, and what you believe you deserve. She is the principle of attraction — not just romantic, but everything you are magnetically drawn toward and what you magnetically draw toward you.",
    signMeanings: {
      Aries: { teaser: "You love boldly and pursue what you want without apology.", deep: "Venus in Aries loves with immediacy and fire. You are drawn to intensity, you are direct in your attraction, and you need a partner who can meet your energy. Your challenge is to let love develop over time rather than measuring it only by its heat." },
      Taurus: { teaser: "You love steadily and deeply. Loyalty, sensory pleasure, and devotion are your love language.", deep: "Venus in Taurus is in one of its home signs — love is felt through the body, through presence, through the slow accumulation of shared time. You love what lasts. Your challenge is to trust that love can change form without ending." },
      Gemini: { teaser: "You love with your mind. Conversation, curiosity, and wit are your deepest attractions.", deep: "Venus in Gemini falls in love with intelligence and playfulness. You need a partner who keeps you thinking, who delights in words, and who is willing to be perpetually interesting to you. Your challenge is to stay present with one person rather than always looking for the next stimulating thing." },
      Cancer: { teaser: "You love by nurturing. Your heart is tender, loyal, and deeply attached.", deep: "Venus in Cancer loves through care, protection, and emotional attunement. You form deep bonds and give your whole heart once you feel safe. Your challenge is to receive love as actively as you give it — to let yourself be cared for without interpreting need as weakness." },
      Leo: { teaser: "You love generously and expressively. You give your whole heart when you love.", deep: "Venus in Leo loves with warmth, drama, and devotion. You want to be adored and you adore in return with equal passion. Your challenge is to recognize that being seen and being loved are not the same thing, even though in your experience they often feel inseparable." },
      Virgo: { teaser: "You love through acts of service and careful attention. You show love by noticing.", deep: "Venus in Virgo expresses love through care, thoughtfulness, and the specific devotion of someone who pays attention to what you actually need. Your challenge is to let love be imperfect — to receive the good enough with the same grace with which you would give the perfect." },
      Libra: { teaser: "You love through partnership and beauty. Harmony, romance, and equality are your standards.", deep: "Venus in Libra is in its home sign — love is felt as a sacred partnership, a meeting of equals in beauty and fairness. You have an exquisite sensitivity to the aesthetic and emotional quality of relationships. Your challenge is to maintain your own identity inside the union you so deeply crave." },
      Scorpio: { teaser: "You love with totality and intensity. Nothing surface-level is acceptable to you.", deep: "Venus in Scorpio loves with a depth and exclusivity that can feel overwhelming to those who have not experienced it. You want to know and be known completely — nothing withheld, nothing performed. Your challenge is to distinguish between intimacy and possession." },
      Sagittarius: { teaser: "You love with adventure and philosophy. You need a partner who can keep up with your mind and your movement.", deep: "Venus in Sagittarius loves with freedom and generosity. You are drawn to people who expand your world — who carry different wisdom, who push you toward growth. Your challenge is to recognize that depth and freedom are not opposites." },
      Capricorn: { teaser: "You love with commitment and quiet devotion. Your loyalty is one of your greatest gifts.", deep: "Venus in Capricorn loves with patience and long-term intention. You are not easily swept away — you assess carefully, you commit slowly, and once you commit, you are unshakeable. Your challenge is to show your love in the moment rather than only through the structures you build for the future." },
      Aquarius: { teaser: "You love with friendship and intellectual equality. Conventional love stories don't interest you.", deep: "Venus in Aquarius loves in ways that are as unique as the person carrying the placement. You are drawn to the unconventional — in people, in relationships, in the definitions of connection itself. Your challenge is to let the heart lead sometimes, without the mind analyzing the experience out of existence." },
      Pisces: { teaser: "You love with idealism and total devotion. Your capacity for love is boundless.", deep: "Venus in Pisces is in one of its most exalted positions — love is felt as a spiritual experience, a merging of souls, a dissolution of separateness. You love without conditions and you give without keeping score. Your challenge is to discern between love and self-erasure." },
    },
  },
  Mars: {
    symbol: "♂",
    rules: "Aries",
    archetype: "The Warrior — drive, desire, how you take action and assert your will",
    keywords: "Action, desire, courage, aggression, drive, physical energy",
    origin: "Mars was the god of war — Ares in Greece, Nergal in Babylon, Tiw in Norse tradition. In your chart he governs how you assert yourself, what drives you, how you handle conflict, and where your physical and sexual energy is directed. He is not destructive by nature — he is the sacred energy of the boundary, the warrior who protects what matters.",
    signMeanings: {
      Aries: { teaser: "Your drive is immediate and fearless. You act before others have finished deliberating.", deep: "Mars in Aries is at home — the energy is pure, direct, and courageous. You are propelled by instinct, motivated by challenge, and energized by being first. Your challenge is to let strategy inform your speed, so that your initiative lands where it can actually make a difference." },
      Taurus: { teaser: "Your drive is slow, steady, and unstoppable. Once you commit, nothing moves you.", deep: "Mars in Taurus is not fast — but it is immovable. You build your energy slowly, act with full deliberation, and finish what you start. Your challenge is to recognize when patience becomes stubbornness, and when it is time to let something go rather than push harder." },
      Gemini: { teaser: "Your drive is mental and multidirectional. You are energized by ideas and conversation.", deep: "Mars in Gemini is activated by intellectual stimulus. You pursue multiple things simultaneously and are motivated by variety, communication, and the pleasure of thinking. Your challenge is to gather your energy into one focused direction long enough to bring something to completion." },
      Cancer: { teaser: "Your drive is emotionally motivated. You fight for what you love, not for abstract principles.", deep: "Mars in Cancer acts in service of feeling — of protection, of belonging, of the people and places that matter most. You have a fierce and loyal energy that can be activated instantly when those you love are threatened. Your challenge is to express your needs and boundaries directly rather than through emotional withdrawal." },
      Leo: { teaser: "Your drive is creative and generous. You are motivated by recognition and heart.", deep: "Mars in Leo acts from the heart — with drama, courage, and a desire to be seen doing something meaningful. You have an enormous capacity for generosity and a will that is activated by appreciation. Your challenge is to let yourself act on your own behalf, not only in service of an audience." },
      Virgo: { teaser: "Your drive is precise and service-oriented. You act to improve and to help.", deep: "Mars in Virgo is motivated by the desire to do things right — to be useful, to fix what is broken, to bring skill and care to every task. You are a meticulous and tireless worker. Your challenge is to recognize when the pursuit of perfection is blocking the completion of the good enough." },
      Libra: { teaser: "Your drive is relational and justice-oriented. You act in service of fairness.", deep: "Mars in Libra is in its detriment — the energy of assertion is filtered through the lens of relationship and fairness. You are motivated by justice and you act most powerfully when you are fighting for someone else. Your challenge is to assert your own needs and desires with the same energy you bring to defending others." },
      Scorpio: { teaser: "Your drive is strategic and relentless. When you want something, nothing stops you.", deep: "Mars in Scorpio is one of the most powerful placements for Mars — intense, focused, strategic, and utterly relentless in pursuit of what it desires. You do not give up. You do not let your cards show. Your challenge is to release the need to control the outcome and trust that your effort is enough." },
      Sagittarius: { teaser: "Your drive is expansive and philosophical. You act in pursuit of meaning and freedom.", deep: "Mars in Sagittarius is motivated by vision — by the sense that the action you are taking matters at a larger scale. You are energized by travel, by learning, by anything that expands your world. Your challenge is to convert your expansive energy into sustained effort rather than perpetual beginnings." },
      Capricorn: { teaser: "Your drive is disciplined and strategic. You play the long game and you win it.", deep: "Mars in Capricorn is in its exaltation — the energy of will is directed with patient precision and unwavering determination. You set a goal, you build the plan, and you execute it over years if necessary. Your challenge is to allow rest and play into the life you are so methodically building." },
      Aquarius: { teaser: "Your drive is collective and unconventional. You act in service of the future.", deep: "Mars in Aquarius is motivated by principle — by the conviction that what you are doing matters for more than just yourself. You are energized by collaboration, by challenging the status quo, and by the sense that your efforts contribute to something larger than your immediate life. Your challenge is to sustain your energy through the slow, unsexy work of actual change." },
      Pisces: { teaser: "Your drive is intuitive and compassionate. You act from a place of deep feeling.", deep: "Mars in Pisces acts from inspiration rather than strategy. You are moved by beauty, by compassion, by a felt sense of what is needed. Your challenge is to translate your sensitivity into focused, consistent action — to let your enormous empathy be a compass rather than a paralysis." },
    },
  },
  Jupiter: {
    symbol: "♃",
    rules: "Sagittarius",
    archetype: "The Expander — abundance, wisdom, where you grow and receive blessings",
    keywords: "Expansion, abundance, wisdom, faith, growth, luck",
    origin: "Jupiter was the king of the gods — Zeus in Greece, Marduk in Babylon, Thor in Norse tradition. In your chart he represents where life wants to expand you — where you are lucky, where you grow, and where your most genuinely optimistic and generous nature lives. He governs the principle of meaning: the part of you that needs to believe in something larger than itself.",
    signMeanings: {
      Aries: { teaser: "Your expansion comes through bold initiative and courageous action.", deep: "Jupiter in Aries grows through doing — through stepping forward before the conditions are perfect, through trusting that your own momentum is a form of grace. You are at your most abundant when you are leading, pioneering, and acting from conviction." },
      Taurus: { teaser: "Your expansion comes through patience, beauty, and trusting the material world.", deep: "Jupiter in Taurus finds abundance through the physical world — through the body, through pleasure, through the long and patient cultivation of something of lasting value. You are at your most fortunate when you are willing to invest real time in what you are building." },
      Gemini: { teaser: "Your expansion comes through curiosity, learning, and the power of your words.", deep: "Jupiter in Gemini grows through the free exchange of ideas — through education, communication, and the connections that happen when information moves freely. You are at your most abundant when you are perpetually learning and generously sharing what you know." },
      Cancer: { teaser: "Your expansion comes through emotional depth, family, and creating belonging.", deep: "Jupiter in Cancer grows through the principle of nurturing — through creating home, through emotional generosity, through the deep care that makes others feel they belong. You are at your most abundant when you are tending to the people and places that carry your heart." },
      Leo: { teaser: "Your expansion comes through creative expression and generous self-revelation.", deep: "Jupiter in Leo grows through the full, unapologetic expression of who you are. You are at your most abundant when you are visible — when you are creating, performing, loving, and leading in ways that let others see your whole self." },
      Virgo: { teaser: "Your expansion comes through service, refinement, and the mastery of your craft.", deep: "Jupiter in Virgo grows through the disciplined pursuit of excellence. You are at your most abundant when you are genuinely useful — when your skills are in service of something that matters, and when you are held to a standard that brings out your best." },
      Libra: { teaser: "Your expansion comes through partnership, beauty, and the art of right relationship.", deep: "Jupiter in Libra grows through collaboration and the cultivation of meaningful relationships. You are at your most abundant in partnership — when you are creating beauty and justice alongside someone who matches your depth of care." },
      Scorpio: { teaser: "Your expansion comes through transformation, depth, and surrendering what no longer serves.", deep: "Jupiter in Scorpio grows through the willingness to go into the dark — to investigate, to transform, to release what is no longer alive. You are at your most abundant when you are engaged with something at its deepest level." },
      Sagittarius: { teaser: "Your expansion comes through philosophy, travel, and the pursuit of meaning.", deep: "Jupiter in Sagittarius is in its home sign — abundant, optimistic, and oriented toward the horizon. You are at your most fortunate when you are exploring: ideas, cultures, philosophies, and the big questions that make life feel worth living." },
      Capricorn: { teaser: "Your expansion comes through discipline, legacy, and building what lasts.", deep: "Jupiter in Capricorn grows through sustained effort and strategic vision. You are at your most abundant when you are building something that will outlast you — when you apply your resources with patience and intention toward a goal worth the time it takes." },
      Aquarius: { teaser: "Your expansion comes through community, innovation, and serving the collective.", deep: "Jupiter in Aquarius grows through the power of the group — through collaborative vision and the willingness to think beyond convention. You are at your most abundant when your gifts are in service of something larger than personal gain." },
      Pisces: { teaser: "Your expansion comes through compassion, spirituality, and trusting the invisible.", deep: "Jupiter in Pisces grows through faith — in something beyond the visible, beyond the rational, beyond the self. You are at your most abundant when you are in deep connection with your spiritual nature and the infinite creative intelligence that moves through you." },
    },
  },
  Saturn: {
    symbol: "♄",
    rules: "Capricorn",
    archetype: "The Teacher — discipline, limitation, karma, and your soul's area of mastery",
    keywords: "Discipline, limitation, karma, responsibility, mastery, time",
    origin: "Saturn was Cronos in Greece — the god of time, and of the harvest that follows only after long cultivation. In your chart Saturn represents your soul's primary area of growth through challenge. Where Jupiter expands, Saturn contracts. Where life gives freely around Jupiter, it demands work and integrity around Saturn. Saturn is not punishment — it is the universe's way of building something in you that could not be built any other way.",
    signMeanings: {
      Aries: { teaser: "Your deepest growth comes through learning to act with patience and considered courage.", deep: "Saturn in Aries learns mastery through the disciplined application of will — not impulsive action, but action that is chosen with full awareness of its consequences. You are here to develop true courage: not the absence of fear, but the willingness to act rightly in its presence." },
      Taurus: { teaser: "Your deepest growth comes through building lasting security through your own effort.", deep: "Saturn in Taurus learns mastery through the patient accumulation of what is real. You are here to develop a genuine relationship with material security — not through fear of lack, but through the discipline of building something solid and lasting on your own terms." },
      Gemini: { teaser: "Your deepest growth comes through disciplined thinking and honest communication.", deep: "Saturn in Gemini learns mastery through the careful use of language and the disciplined development of the mind. You are here to learn to say what you mean and mean what you say — and to develop an intellectual depth that goes beyond the pleasure of the idea." },
      Cancer: { teaser: "Your deepest growth comes through learning to need and to be needed without fear.", deep: "Saturn in Cancer learns mastery through the emotional body — through developing the capacity to be vulnerable, to need without shame, and to create genuine belonging rather than performing safety. You are here to heal your relationship with home, family, and emotional need." },
      Leo: { teaser: "Your deepest growth comes through learning to lead with the heart rather than the ego.", deep: "Saturn in Leo learns mastery through the disciplined development of true self-expression — not performance, not seeking validation, but the courageous act of showing who you actually are. You are here to discover that genuine authority does not require an audience." },
      Virgo: { teaser: "Your deepest growth comes through learning that your worth is not conditional on your usefulness.", deep: "Saturn in Virgo learns mastery through service and precision — but the real lesson is to do the work without letting the work define your value. You are here to develop a relationship with excellence that is rooted in genuine care rather than anxiety about falling short." },
      Libra: { teaser: "Your deepest growth comes through learning to stand for yourself within relationship.", deep: "Saturn in Libra learns mastery through the arena of partnership — through developing the capacity to be in right relationship: fair, honest, and clear. You are here to discover that true harmony includes your own needs and truth, not only the needs and truth of others." },
      Scorpio: { teaser: "Your deepest growth comes through learning to surrender control and trust transformation.", deep: "Saturn in Scorpio learns mastery through the willingness to face what is hidden — in yourself and in the world. You are here to develop a relationship with power that is grounded in integrity, and to release the patterns of control, secrecy, and fear that block genuine transformation." },
      Sagittarius: { teaser: "Your deepest growth comes through building a philosophy you can actually live.", deep: "Saturn in Sagittarius learns mastery through the disciplined pursuit of meaning — through developing a personal philosophy that is tested by experience, not merely believed in theory. You are here to make your vision practical and your optimism grounded." },
      Capricorn: { teaser: "Your deepest growth comes through learning that achievement is not the same as worth.", deep: "Saturn in Capricorn is in its home sign — the energy is powerful and demanding. You have extraordinary capacity for discipline and achievement. Your challenge is to build the life you are working toward without using that work to avoid the inner life that needs your attention equally." },
      Aquarius: { teaser: "Your deepest growth comes through learning to belong without disappearing.", deep: "Saturn in Aquarius learns mastery through the tension between the individual and the collective — between your need for independence and your desire to contribute to something larger. You are here to find a way to be fully yourself while genuinely serving the group." },
      Pisces: { teaser: "Your deepest growth comes through learning to trust the invisible and to structure your spiritual life.", deep: "Saturn in Pisces learns mastery through the challenge of bringing form to the formless — through finding a way to live in the world without losing connection to the spiritual reality you know to be more real. You are here to develop faith that is not passive, but disciplined and embodied." },
    },
  },
  Uranus: {
    symbol: "♅",
    rules: "Aquarius",
    archetype: "The Awakener — revolution, freedom, and where you break from convention",
    keywords: "Liberation, revolution, originality, awakening, disruption",
    origin: "Uranus was discovered in 1781 — the year of the American and French Revolutions — and its symbolism has always been tied to the sudden liberation from established order. In your chart Uranus represents the area of life where you are designed to break convention, where the unexpected arrives as liberation, and where your most original and revolutionary self is expressed. Uranus moves slowly, so its sign is generational — but its house and aspects reveal how this collective awakening energy plays out personally for you.",
    signMeanings: {
      Aries: { teaser: "Your generation is here to revolutionize identity and individual expression.", deep: "Uranus in Aries (1927-1935, 2010-2019) brings radical awakening through the principle of self — the individual's right to exist authentically, to act from instinct, and to break from inherited identity. Personally, this energy manifests as an impulse toward radical self-reinvention and courageous independence." },
      Taurus: { teaser: "Your generation is here to revolutionize our relationship to the earth and to value.", deep: "Uranus in Taurus (1934-1942, 2018-2026) brings disruption to the material world — to money systems, to agriculture, to how we understand wealth and the body. Personally, this energy asks you to find freedom through your relationship to what you value and to release attachments that have become cages." },
      Gemini: { teaser: "Your generation is here to revolutionize communication and how we think.", deep: "Uranus in Gemini (1941-1949) brought revolution to language and media. Personally, this energy expresses as an original and unconventional mind — a thinker who breaks with received wisdom and finds liberation through ideas that others have not yet caught up to." },
      Cancer: { teaser: "Your generation is here to revolutionize family, home, and belonging.", deep: "Uranus in Cancer (1948-1956) disrupted the traditional family structure and the meaning of home. Personally, this energy expresses as a need to redefine belonging on your own terms — to create family and home as an act of conscious choice rather than inherited obligation." },
      Leo: { teaser: "Your generation is here to revolutionize self-expression and creative leadership.", deep: "Uranus in Leo (1955-1962) brought liberation to individual expression and the redefinition of leadership. Personally, this energy expresses as a need to express your creativity and leadership in ways that are radically authentic — to break from convention in how you are seen and how you lead." },
      Virgo: { teaser: "Your generation is here to revolutionize health, work, and service.", deep: "Uranus in Virgo (1961-1968) brought disruption to medicine, work, and the meaning of service. Personally, this energy expresses as a drive to revolutionize the way you work and care for your body — to find liberation through the radical improvement of everyday systems." },
      Libra: { teaser: "Your generation is here to revolutionize relationship and the meaning of partnership.", deep: "Uranus in Libra (1968-1975) disrupted the institution of marriage and the definition of partnership. Personally, this energy expresses as a deep need for freedom within relationship — and a drive to redefine what fair, equal partnership actually looks like." },
      Scorpio: { teaser: "Your generation is here to revolutionize power, death, and transformation.", deep: "Uranus in Scorpio (1974-1981) brought liberation through the confrontation of taboo — of sexuality, death, power, and what is hidden. Personally, this energy expresses as a drive to break through the deepest layers of conditioned fear and to find freedom in the full truth of human experience." },
      Sagittarius: { teaser: "Your generation is here to revolutionize philosophy, religion, and what we believe.", deep: "Uranus in Sagittarius (1981-1988) brought disruption to established belief systems and the meaning of truth. Personally, this energy expresses as a drive to find spiritual freedom outside of inherited religion — to seek a philosophy that is yours, tested by your own experience." },
      Capricorn: { teaser: "Your generation is here to revolutionize institutions, government, and authority.", deep: "Uranus in Capricorn (1988-1996) brought disruption to established power structures and the definition of achievement. Personally, this energy expresses as an impulse to build structures that are genuinely new — to find freedom within discipline, and to redefine what success actually means." },
      Aquarius: { teaser: "Your generation is here to revolutionize community, technology, and collective consciousness.", deep: "Uranus in Aquarius (1995-2003) is in its home sign — the energy of awakening is at its most powerful and collective. Personally, this energy expresses as a deep drive toward authentic community, radical individuality within the collective, and the use of technology in service of liberation." },
      Pisces: { teaser: "Your generation is here to revolutionize spirituality, compassion, and the dissolution of boundaries.", deep: "Uranus in Pisces (2003-2011) brought disruption to the spiritual dimensions of human experience. Personally, this energy expresses as a drive toward spiritual awakening that breaks from established form — toward mystical experience that cannot be contained within any single tradition." },
    },
  },
  Neptune: {
    symbol: "♆",
    rules: "Pisces",
    archetype: "The Mystic — spirituality, dreams, illusion, and transcendence",
    keywords: "Spirituality, dreams, illusion, dissolution, compassion, the infinite",
    origin: "Neptune was the god of the sea — Poseidon in Greece, a realm of mystery and depth that cannot be seen or fully known. In your chart Neptune governs your relationship to the invisible: to dreams, to spirituality, to the creative imagination, and to the longing for something that transcends ordinary life. Neptune also governs illusion and self-deception — the ways we disappear into what we wish were true. She moves so slowly her sign is shared by an entire generation, but her influence becomes personal through aspects and house placement.",
    signMeanings: {
      Libra: { teaser: "Your generation idealized perfect partnership and harmony. Your lesson is love without illusion.", deep: "Neptune in Libra (1942-1956) colored a generation with idealism about love, marriage, and justice. The dream was perfect partnership, the challenge was the gap between the ideal and the real." },
      Scorpio: { teaser: "Your generation sought transformation through the mystical and the taboo.", deep: "Neptune in Scorpio (1956-1970) dissolved the boundaries around sexuality, death, and psychic experience. This generation was called to meet the dark with spiritual courage." },
      Sagittarius: { teaser: "Your generation sought enlightenment through spiritual exploration and expanded belief.", deep: "Neptune in Sagittarius (1970-1984) dissolved the boundaries of religious tradition and inspired a generation to seek direct spiritual experience beyond institutional religion." },
      Capricorn: { teaser: "Your generation brought spiritual awareness into structures of power and material life.", deep: "Neptune in Capricorn (1984-1998) dissolved the illusion of purely material success and began integrating spiritual consciousness into how we think about achievement, authority, and legacy." },
      Aquarius: { teaser: "Your generation dreams of a spiritually unified collective humanity.", deep: "Neptune in Aquarius (1998-2012) dissolved the boundaries between individual and collective consciousness — dreaming of a humanity connected across its differences by shared spiritual awareness and technology." },
      Pisces: { teaser: "Your generation is dissolving all remaining barriers between the personal and the universal.", deep: "Neptune in Pisces (2012-2026) is in its home sign — the most powerful dissolution of all, as the boundary between self and cosmos becomes increasingly permeable. This generation is being called toward radical compassion and collective spiritual awakening." },
      Aries: { teaser: "Your generation dreams of a new spiritual individualism.", deep: "Neptune in Aries brought idealism and spiritual seeking through the principle of the self — through the dream of a heroic, independent spiritual life." },
      Taurus: { teaser: "Your generation dreams of sacred relationship with the earth.", deep: "Neptune in Taurus brought spiritual dissolution through the material world — through the sanctification of the earth, the body, and the senses." },
      Gemini: { teaser: "Your generation sought transcendence through words and ideas.", deep: "Neptune in Gemini dissolved the boundaries of ordinary communication and brought mystical quality to language, poetry, and the written word." },
      Cancer: { teaser: "Your generation idealized home, family, and belonging as sacred.", deep: "Neptune in Cancer dissolved the boundaries of the family unit and idealized an almost mythological sense of home, nostalgia, and belonging." },
      Leo: { teaser: "Your generation sought transcendence through art, romance, and self-expression.", deep: "Neptune in Leo dissolved the boundaries of individual ego through the arts — through the glamor of theater, film, and the dream of heroic self-expression." },
      Virgo: { teaser: "Your generation sought the sacred through service and the healing of the physical.", deep: "Neptune in Virgo brought mystical quality to healing, service, and the relationship between the body and the spirit." },
    },
  },
  Pluto: {
    symbol: "♇",
    rules: "Scorpio",
    archetype: "The Transformer — power, death, rebirth, and generational evolution",
    keywords: "Transformation, power, death and rebirth, the unconscious, evolution",
    origin: "Pluto — Hades in Greek mythology — ruled the underworld: the realm of what is hidden, what is feared, and what must die so that something new can be born. In your chart Pluto governs the deepest and most non-negotiable processes of transformation. He spends 12-31 years in each sign, so his placement is always generational — but it reveals the collective shadow that your generation has come to face, transform, and ultimately heal.",
    signMeanings: {
      Leo: { teaser: "Your generation transforms through the shadow of ego, power, and what it means to lead.", deep: "Pluto in Leo (1937-1958) called a generation to confront the shadow of individual power and ego — the wound beneath the need to be special, the transformation available through authentic self-expression rather than performance." },
      Virgo: { teaser: "Your generation transforms through the shadow of perfectionism, service, and the meaning of work.", deep: "Pluto in Virgo (1956-1972) called a generation to confront the shadow of perfectionism and worthiness — the wound beneath the endless self-improvement project, the transformation available through genuine service rooted in self-acceptance." },
      Libra: { teaser: "Your generation transforms through the shadow of relationship, justice, and the need to belong.", deep: "Pluto in Libra (1971-1984) called a generation to confront the shadow within partnership — codependency, the fear of aloneness, and the ways relationships can be used to avoid genuine selfhood." },
      Scorpio: { teaser: "Your generation transforms through the shadow of power, sexuality, and what is hidden.", deep: "Pluto in Scorpio (1983-1995) is in its home sign — the most intense and transformative of placements. This generation arrived carrying the wounds of collective power abuse, sexual shadow, and the call to bring what has been hidden into the light." },
      Sagittarius: { teaser: "Your generation transforms through the shadow of belief, religion, and the search for truth.", deep: "Pluto in Sagittarius (1995-2008) called a generation to confront the shadow of religious and ideological certainty — the violence done in the name of belief, and the transformation available through genuine wisdom that transcends any single tradition." },
      Capricorn: { teaser: "Your generation transforms through the shadow of authority, institutions, and how power is organized.", deep: "Pluto in Capricorn (2008-2024) is dismantling the institutions built on outdated power — governments, corporations, and systems of authority that no longer serve the whole. This generation is here to transform the very structures of civilization." },
      Aquarius: { teaser: "Your generation transforms through the shadow of technology, community, and collective consciousness.", deep: "Pluto in Aquarius (2024-2044) is beginning the transformation of collective consciousness itself — confronting the shadow within technology, group identity, and the meaning of humanity in an age of unprecedented connection and artificial intelligence." },
      Aries: { teaser: "Your generation transforms through the shadow of war, aggression, and the will to power.", deep: "Pluto in Aries brought deep transformation through the shadow of conflict and raw individual will — through the wounds of war and the eventual discovery of a form of courage that does not require destruction." },
      Taurus: { teaser: "Your generation transforms through the shadow of wealth, scarcity, and material power.", deep: "Pluto in Taurus brought deep transformation through the material world — through the shadow of ownership, wealth accumulation, and the ways that fear of scarcity drives collective behavior." },
      Gemini: { teaser: "Your generation transforms through the shadow of communication, deception, and how truth is distributed.", deep: "Pluto in Gemini brought deep transformation through the power of information — through the shadow of propaganda, deception, and the ways that words can be used as weapons." },
      Cancer: { teaser: "Your generation transforms through the shadow of family, home, and collective belonging.", deep: "Pluto in Cancer brought deep transformation through the archetype of the family and nation — through the shadow of tribalism, nationalism, and the wounds that are passed through bloodlines." },
      Pisces: { teaser: "Your generation transforms through the shadow of spiritual surrender, addiction, and dissolution.", deep: "Pluto in Pisces brought deep transformation through the spiritual dimensions of the collective — through the shadow of escapism, addiction, and the longing for dissolution that can either become transcendence or self-destruction." },
    },
  },
};
