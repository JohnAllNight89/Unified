/**
 * Vedic (Jyotish) sidereal astrology — Rashi + Nakshatra lookups on top of the
 * true Lahiri-sidereal longitudes computed by the Swiss Ephemeris wrapper.
 */
import { houses, julianDayUT, lahiriAyanamsa, siderealPosition, type BodyName } from "./swisseph";

export const RASHI_NAMES = [
  "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
  "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)",
  "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)",
] as const;

const NAKSHATRA_SPAN = 360 / 27;
const PADA_SPAN = NAKSHATRA_SPAN / 4;

export const NAKSHATRAS: { name: string; lord: string }[] = [
  { name: "Ashwini", lord: "Ketu" }, { name: "Bharani", lord: "Venus" }, { name: "Krittika", lord: "Sun" },
  { name: "Rohini", lord: "Moon" }, { name: "Mrigashira", lord: "Mars" }, { name: "Ardra", lord: "Rahu" },
  { name: "Punarvasu", lord: "Jupiter" }, { name: "Pushya", lord: "Saturn" }, { name: "Ashlesha", lord: "Mercury" },
  { name: "Magha", lord: "Ketu" }, { name: "Purva Phalguni", lord: "Venus" }, { name: "Uttara Phalguni", lord: "Sun" },
  { name: "Hasta", lord: "Moon" }, { name: "Chitra", lord: "Mars" }, { name: "Swati", lord: "Rahu" },
  { name: "Vishakha", lord: "Jupiter" }, { name: "Anuradha", lord: "Saturn" }, { name: "Jyeshtha", lord: "Mercury" },
  { name: "Mula", lord: "Ketu" }, { name: "Purva Ashadha", lord: "Venus" }, { name: "Uttara Ashadha", lord: "Sun" },
  { name: "Shravana", lord: "Moon" }, { name: "Dhanishta", lord: "Mars" }, { name: "Shatabhisha", lord: "Rahu" },
  { name: "Purva Bhadrapada", lord: "Jupiter" }, { name: "Uttara Bhadrapada", lord: "Saturn" }, { name: "Revati", lord: "Mercury" },
];

export interface RashiPlacement {
  rashiIndex: number;
  rashiName: string;
}

export function rashiOf(siderealLongitude: number): RashiPlacement {
  const lon = ((siderealLongitude % 360) + 360) % 360;
  const rashiIndex = Math.floor(lon / 30);
  return { rashiIndex, rashiName: RASHI_NAMES[rashiIndex] };
}

export interface NakshatraPlacement {
  nakshatraNumber: number;
  nakshatraName: string;
  lord: string;
  pada: number;
}

export function nakshatraOf(siderealLongitude: number): NakshatraPlacement {
  const lon = ((siderealLongitude % 360) + 360) % 360;
  const idx = Math.floor(lon / NAKSHATRA_SPAN);
  const within = lon - idx * NAKSHATRA_SPAN;
  const pada = Math.floor(within / PADA_SPAN) + 1;
  const { name, lord } = NAKSHATRAS[idx];
  return { nakshatraNumber: idx + 1, nakshatraName: name, lord, pada };
}

export interface VedicChartResult {
  lagna: RashiPlacement | null;
  sun: RashiPlacement;
  moon: RashiPlacement & { nakshatra: NakshatraPlacement };
}

function mod360(n: number): number {
  return ((n % 360) + 360) % 360;
}

/**
 * Lagna (sidereal Ascendant), Sun Rashi, and Moon Rashi + Nakshatra — the
 * "Big 3 + Nakshatra" free-preview scope. Lagna requires birth time + place;
 * Sun/Moon Rashi and the Moon's Nakshatra work from date alone.
 */
export async function calculateVedicChart(
  birthDate: string,
  birthTime: string | null,
  birthLat: number | null,
  birthLng: number | null,
  utcOffsetHours = 0,
): Promise<VedicChartResult> {
  const [y, m, d] = birthDate.split("-").map(Number);
  let hour = 12;
  if (birthTime) {
    const [h, min] = birthTime.split(":").map(Number);
    hour = h + (min || 0) / 60;
  }
  const jd = await julianDayUT(y, m, d, hour - utcOffsetHours);

  const sunPos = await siderealPosition(jd, "Sun" as BodyName);
  const moonPos = await siderealPosition(jd, "Moon" as BodyName);
  const sun = rashiOf(sunPos.longitude);
  const moon = { ...rashiOf(moonPos.longitude), nakshatra: nakshatraOf(moonPos.longitude) };

  let lagna: RashiPlacement | null = null;
  if (birthTime && birthLat !== null && birthLng !== null) {
    const tropicalAscendant = (await houses(jd, birthLat, birthLng)).ascendant;
    const ayanamsa = await lahiriAyanamsa(jd);
    const siderealAscendant = mod360(tropicalAscendant - ayanamsa);
    lagna = rashiOf(siderealAscendant);
  }

  return { lagna, sun, moon };
}

// ============================================================================
// Copy — technical + plain-English sentence per data point, keyed by Rashi
// or Nakshatra name. Used by the free /discover calculator's results view.
// ============================================================================

interface SentencePair {
  technical: string;
  plain: string;
}

export const LAGNA_MEANINGS: Record<string, SentencePair> = {
  "Mesha (Aries)": { technical: "Lagna in Mesha places the sidereal Ascendant in the sign ruled by Mars, the first rashi of the zodiac.", plain: "Your soul arrives ready to lead — direct, quick to act, and most alive when it's moving first." },
  "Vrishabha (Taurus)": { technical: "Lagna in Vrishabha places the sidereal Ascendant in the sign ruled by Venus, an earth rashi of steady accumulation.", plain: "Your soul moves through the world slowly and deliberately, building what is real and lasting rather than what is fast." },
  "Mithuna (Gemini)": { technical: "Lagna in Mithuna places the sidereal Ascendant in the sign ruled by Mercury, a dual air rashi of communication.", plain: "Your soul is here to learn by connecting — to people, to ideas, to more than one path at once." },
  "Karka (Cancer)": { technical: "Lagna in Karka places the sidereal Ascendant in the sign ruled by the Moon, its own sign of emotional sensitivity.", plain: "Your soul moves through the world feeling everything first — protective, intuitive, and rooted in belonging." },
  "Simha (Leo)": { technical: "Lagna in Simha places the sidereal Ascendant in the sign ruled by the Sun, its own sign of sovereign identity.", plain: "Your soul arrived to be seen — carrying a natural authority that others notice before you've said a word." },
  "Kanya (Virgo)": { technical: "Lagna in Kanya places the sidereal Ascendant in the sign ruled by Mercury, an earth rashi of discernment and service.", plain: "Your soul moves through the world noticing what needs refining — precise, useful, and quietly exacting." },
  "Tula (Libra)": { technical: "Lagna in Tula places the sidereal Ascendant in the sign ruled by Venus, an air rashi of balance and partnership.", plain: "Your soul is here to weigh things fairly — most at home in relationship, harmony, and considered judgment." },
  "Vrishchika (Scorpio)": { technical: "Lagna in Vrishchika places the sidereal Ascendant in the sign ruled by Mars, a water rashi of intensity and transformation.", plain: "Your soul moves through the world at full depth — private, magnetic, and unwilling to stay on the surface of anything." },
  "Dhanu (Sagittarius)": { technical: "Lagna in Dhanu places the sidereal Ascendant in the sign ruled by Jupiter, a fire rashi of belief and expansion.", plain: "Your soul arrived reaching for meaning — optimistic, restless for truth, and built to keep moving toward the horizon." },
  "Makara (Capricorn)": { technical: "Lagna in Makara places the sidereal Ascendant in the sign ruled by Saturn, an earth rashi of discipline and endurance.", plain: "Your soul moves through the world patiently — carrying real responsibility and a quiet, earned authority." },
  "Kumbha (Aquarius)": { technical: "Lagna in Kumbha places the sidereal Ascendant in the sign ruled by Saturn, an air rashi of the collective and the unconventional.", plain: "Your soul is here to think differently — independent, future-facing, and rarely satisfied with the way things have always been done." },
  "Meena (Pisces)": { technical: "Lagna in Meena places the sidereal Ascendant in the sign ruled by Jupiter, the final water rashi of dissolution and compassion.", plain: "Your soul moves through the world porously — deeply feeling, intuitive, and always a little in touch with something beyond the visible." },
};

export const SUN_RASHI_MEANINGS: Record<string, SentencePair> = {
  "Mesha (Aries)": { technical: "Sidereal Sun in Mesha places your dharmic core in the sign of Mars — the rashi of initiation.", plain: "Your deepest purpose is bound up with courage — being the one who goes first." },
  "Vrishabha (Taurus)": { technical: "Sidereal Sun in Vrishabha places your dharmic core in the sign of Venus — the rashi of steady value.", plain: "Your deepest purpose is bound up with building something real and lasting, at your own pace." },
  "Mithuna (Gemini)": { technical: "Sidereal Sun in Mithuna places your dharmic core in the sign of Mercury — the rashi of exchange.", plain: "Your deepest purpose is bound up with learning and communicating — carrying ideas between people." },
  "Karka (Cancer)": { technical: "Sidereal Sun in Karka places your dharmic core in the sign of the Moon — the rashi of nurture.", plain: "Your deepest purpose is bound up with caretaking — creating belonging for the people around you." },
  "Simha (Leo)": { technical: "Sidereal Sun in Simha places your dharmic core in its own sign — the rashi of sovereign identity.", plain: "Your deepest purpose is bound up with leading and creating — you were built to be visible." },
  "Kanya (Virgo)": { technical: "Sidereal Sun in Kanya places your dharmic core in the sign of Mercury — the rashi of refinement.", plain: "Your deepest purpose is bound up with service done precisely and well." },
  "Tula (Libra)": { technical: "Sidereal Sun in Tula places your dharmic core in the sign of Venus — the rashi of balance.", plain: "Your deepest purpose is bound up with fairness — bringing harmony to whatever you touch." },
  "Vrishchika (Scorpio)": { technical: "Sidereal Sun in Vrishchika places your dharmic core in the sign of Mars — the rashi of transformation.", plain: "Your deepest purpose is bound up with going deep — facing what others avoid." },
  "Dhanu (Sagittarius)": { technical: "Sidereal Sun in Dhanu places your dharmic core in the sign of Jupiter — the rashi of expansion.", plain: "Your deepest purpose is bound up with truth-seeking and teaching what you've found." },
  "Makara (Capricorn)": { technical: "Sidereal Sun in Makara places your dharmic core in the sign of Saturn — the rashi of mastery.", plain: "Your deepest purpose is bound up with discipline — building a legacy through sustained effort." },
  "Kumbha (Aquarius)": { technical: "Sidereal Sun in Kumbha places your dharmic core in the sign of Saturn — the rashi of the collective.", plain: "Your deepest purpose is bound up with the group — innovating on behalf of something larger than yourself." },
  "Meena (Pisces)": { technical: "Sidereal Sun in Meena places your dharmic core in the sign of Jupiter — the rashi of dissolution and compassion.", plain: "Your deepest purpose is bound up with the spiritual and the unseen — healing through empathy." },
};

export const MOON_RASHI_MEANINGS: Record<string, SentencePair> = {
  "Mesha (Aries)": { technical: "Sidereal Moon in Mesha places your emotional and karmic nature in the sign of Mars.", plain: "You process feeling through action — restless when still, steadied by movement." },
  "Vrishabha (Taurus)": { technical: "Sidereal Moon in Vrishabha places your emotional and karmic nature in its own exalted sign, the sign of Venus.", plain: "You are emotionally steady and deeply comforted by beauty, routine, and the tangible." },
  "Mithuna (Gemini)": { technical: "Sidereal Moon in Mithuna places your emotional and karmic nature in the sign of Mercury.", plain: "You process feeling by talking it through — your mind and your heart rarely operate separately." },
  "Karka (Cancer)": { technical: "Sidereal Moon in Karka places your emotional and karmic nature in its own sign, the most emotionally attuned placement in the zodiac.", plain: "You feel everything, remember everything emotionally, and are wired for deep belonging." },
  "Simha (Leo)": { technical: "Sidereal Moon in Simha places your emotional and karmic nature in the sign of the Sun.", plain: "You need to be seen to feel emotionally safe — your heart opens in warmth and recognition." },
  "Kanya (Virgo)": { technical: "Sidereal Moon in Kanya places your emotional and karmic nature in the sign of Mercury.", plain: "You process feeling by making it useful — care, for you, looks like careful attention." },
  "Tula (Libra)": { technical: "Sidereal Moon in Tula places your emotional and karmic nature in the sign of Venus.", plain: "You feel most settled in harmony and partnership, unsettled by conflict or imbalance." },
  "Vrishchika (Scorpio)": { technical: "Sidereal Moon in Vrishchika places your emotional and karmic nature in its sign of debilitation, a placement of intense emotional depth.", plain: "You feel at full intensity and rarely on the surface — your inner world runs deep and private." },
  "Dhanu (Sagittarius)": { technical: "Sidereal Moon in Dhanu places your emotional and karmic nature in the sign of Jupiter.", plain: "You feel safest with room to roam — emotionally, you need freedom and a sense of meaning." },
  "Makara (Capricorn)": { technical: "Sidereal Moon in Makara places your emotional and karmic nature in the sign of Saturn.", plain: "You learned early to manage your feelings with discipline — emotional resilience is your default." },
  "Kumbha (Aquarius)": { technical: "Sidereal Moon in Kumbha places your emotional and karmic nature in the sign of Saturn.", plain: "You feel for the collective sometimes more easily than you feel for yourself." },
  "Meena (Pisces)": { technical: "Sidereal Moon in Meena places your emotional and karmic nature in the sign of Jupiter, a deeply intuitive and porous placement.", plain: "You absorb the emotional field of every room you enter — your empathy runs almost without a filter." },
};

export const NAKSHATRA_MEANINGS: Record<string, SentencePair> = {
  "Ashwini": { technical: "Ashwini, ruled by Ketu, is the first nakshatra — associated with the Ashwini Kumaras, the divine healers.", plain: "You move fast, heal fast, and are usually the first one through the door." },
  "Bharani": { technical: "Bharani, ruled by Venus, is governed by Yama, the god of death and transformation through endurance.", plain: "You carry the strength to hold what's difficult — birth, loss, and everything that demands real courage." },
  "Krittika": { technical: "Krittika, ruled by the Sun, is symbolized by a flame and governed by Agni, the god of fire.", plain: "You cut through illusion — sharp, purifying, and unafraid to say the true thing." },
  "Rohini": { technical: "Rohini, ruled by the Moon, is the Moon's most beloved nakshatra, associated with Brahma and growth.", plain: "You are magnetic and creative, drawn to beauty and to nurturing what you love into full bloom." },
  "Mrigashira": { technical: "Mrigashira, ruled by Mars, translates to \"deer's head\" and is governed by Soma, the nectar of searching.", plain: "You are a seeker by nature — always following the next question, the next scent of something true." },
  "Ardra": { technical: "Ardra, ruled by Rahu, is governed by Rudra, the storm god of destruction that clears the way for renewal.", plain: "You transform through intensity — your breakthroughs often arrive right after your hardest storms." },
  "Punarvasu": { technical: "Punarvasu, ruled by Jupiter, means \"return of the light\" and is governed by Aditi, the mother of the gods.", plain: "You have a gift for renewal — for returning, again and again, to what matters most." },
  "Pushya": { technical: "Pushya, ruled by Saturn, means \"to nourish\" and is considered one of the most auspicious nakshatras for care and growth.", plain: "You are a natural nurturer — steady, protective, and quietly the one others lean on." },
  "Ashlesha": { technical: "Ashlesha, ruled by Mercury, translates to \"the clinging one\" and is governed by the Nagas, serpent deities of hidden wisdom.", plain: "You see beneath the surface of people and situations — perceptive in a way that's hard to fool." },
  "Magha": { technical: "Magha, ruled by Ketu, means \"the mighty one\" and is governed by the Pitris, the ancestors.", plain: "You carry the weight and authority of lineage — a natural leader connected to what came before you." },
  "Purva Phalguni": { technical: "Purva Phalguni, ruled by Venus, is governed by Bhaga, the god of fortune and pleasure.", plain: "You are here to enjoy life fully — creative, warm, and unashamed of what brings you joy." },
  "Uttara Phalguni": { technical: "Uttara Phalguni, ruled by the Sun, is governed by Aryaman, the god of patronage and partnership.", plain: "You build lasting bonds through generosity — a natural patron to the people in your life." },
  "Hasta": { technical: "Hasta, ruled by the Moon, means \"hand\" and is governed by Savitar, the solar deity of skillful creation.", plain: "You are skillful with your hands and your resourcefulness — able to make something out of very little." },
  "Chitra": { technical: "Chitra, ruled by Mars, means \"the brilliant one\" and is governed by Tvashtar, the celestial architect.", plain: "You have an eye for beauty and design — a natural creator who wants what you make to shine." },
  "Swati": { technical: "Swati, ruled by Rahu, means \"sword\" or \"independent\" and is governed by Vayu, the god of wind.", plain: "You move independently, adaptable as the wind, most yourself when nobody is holding you down." },
  "Vishakha": { technical: "Vishakha, ruled by Jupiter, is governed by Indra and Agni jointly — the gods of purpose and drive.", plain: "You are goal-driven and determined, willing to work hard for what you've decided you want." },
  "Anuradha": { technical: "Anuradha, ruled by Saturn, means \"following Radha\" and is governed by Mitra, the god of friendship and devotion.", plain: "You build deep loyalty and lasting friendship — devotion is one of your quiet superpowers." },
  "Jyeshtha": { technical: "Jyeshtha, ruled by Mercury, means \"the eldest\" and is governed by Indra, king of the gods.", plain: "You carry natural seniority — protective of those under your care, and comfortable with responsibility." },
  "Mula": { technical: "Mula, ruled by Ketu, means \"the root\" and is governed by Nirriti, goddess of dissolution.", plain: "You are here to get to the root of things — even when that means tearing down what isn't real first." },
  "Purva Ashadha": { technical: "Purva Ashadha, ruled by Venus, means \"the invincible one\" and is governed by Apas, the water deities.", plain: "You are hard to discourage — once you commit to something, your resolve is difficult to shake." },
  "Uttara Ashadha": { technical: "Uttara Ashadha, ruled by the Sun, is governed by the Vishvadevas, the universal gods.", plain: "You carry a quiet sense of ultimate purpose — built for long-term achievement, not quick wins." },
  "Shravana": { technical: "Shravana, ruled by the Moon, means \"to hear\" and is governed by Vishnu, the preserver.", plain: "You are a natural listener — people trust you with what they don't tell anyone else." },
  "Dhanishta": { technical: "Dhanishta, ruled by Mars, means \"the wealthiest\" and is governed by the Vasus, gods of abundance.", plain: "You have a gift for rhythm and prosperity — music, wealth, and generosity all move easily through you." },
  "Shatabhisha": { technical: "Shatabhisha, ruled by Rahu, means \"a hundred healers\" and is governed by Varuna, god of cosmic law.", plain: "You are a healer at heart, often working alone, drawn to what others can't yet explain." },
  "Purva Bhadrapada": { technical: "Purva Bhadrapada, ruled by Jupiter, is governed by Aja Ekapada, the one-footed serpent of transformation.", plain: "You carry intensity toward transformation — comfortable exploring what most people avoid." },
  "Uttara Bhadrapada": { technical: "Uttara Bhadrapada, ruled by Saturn, is governed by Ahir Budhnya, the serpent of the deep.", plain: "You hold a deep, still wisdom — most powerful when you slow all the way down." },
  "Revati": { technical: "Revati, ruled by Mercury, is the final nakshatra, governed by Pushan, the nourisher and guide of travelers.", plain: "You are here to guide others gently across their own thresholds, at the close of one chapter and the start of the next." },
};
