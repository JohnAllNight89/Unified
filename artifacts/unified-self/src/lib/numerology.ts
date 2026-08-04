const LETTER_VALUES: Record<string, number> = {
  a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
  j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
  s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8,
};
const VOWELS = new Set(["a","e","i","o","u","y"]);

function reduce(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split("").reduce((s, d) => s + parseInt(d), 0);
  }
  return n;
}

export function lifePathNumber(birthDate: string): number {
  const digits = birthDate.replace(/\D/g, "");
  const total = digits.split("").reduce((s, d) => s + parseInt(d), 0);
  return reduce(total);
}

export function expressionNumber(fullName: string): number {
  const letters = fullName.toLowerCase().replace(/[^a-z]/g, "").split("");
  const total = letters.reduce((s, l) => s + (LETTER_VALUES[l] || 0), 0);
  return reduce(total);
}

export function soulUrgeNumber(fullName: string): number {
  const vowelLetters = fullName.toLowerCase().replace(/[^a-z]/g, "").split("").filter(l => VOWELS.has(l));
  const total = vowelLetters.reduce((s, l) => s + (LETTER_VALUES[l] || 0), 0);
  return reduce(total);
}

export function personalityNumber(fullName: string): number {
  const consonants = fullName.toLowerCase().replace(/[^a-z]/g, "").split("").filter(l => !VOWELS.has(l));
  const total = consonants.reduce((s, l) => s + (LETTER_VALUES[l] || 0), 0);
  return reduce(total);
}

export function birthDayNumber(birthDate: string): number {
  const parts = birthDate.split("-");
  if (parts.length < 3) return 0;
  const day = parseInt(parts[2], 10);
  return reduce(day);
}

export interface NumerologyResult {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthDay: number;
}

export function calculate(fullName: string, birthDate: string): NumerologyResult {
  return {
    lifePath: lifePathNumber(birthDate),
    expression: expressionNumber(fullName),
    soulUrge: soulUrgeNumber(fullName),
    personality: personalityNumber(fullName),
    birthDay: birthDayNumber(birthDate),
  };
}

export const MEANINGS: Record<string, { title: string; teaser: string; deep: string }> = {
  "1": {
    title: "The Pioneer",
    teaser: "You are built to lead and initiate. Your energy is original, independent, and directed — there is a fire in you that cannot be delegated.",
    deep: "The 1 carries the archetype of the pioneer — the soul who arrives first into uncharted territory. You are designed to stand alone when necessary, to forge paths that did not exist before you, and to model self-sovereignty for others. Your challenge is to resist letting independence become isolation, and to allow others into the journey you are leading.",
  },
  "2": {
    title: "The Harmonizer",
    teaser: "You feel everything in the space between people. Your gift is connection, diplomacy, and the ability to sense what is needed before it is asked.",
    deep: "The 2 embodies the principle of union — the soul who understands that all things exist in relationship. You are attuned to subtlety, emotion, and the unspoken dynamics that shape every interaction. Your sensitivity is not a weakness; it is your greatest tool. Your challenge is to learn that your needs matter as much as the needs of those you so naturally tend.",
  },
  "3": {
    title: "The Expresser",
    teaser: "Joy, creativity, and communication are your native language. You are here to bring light into rooms — through words, art, or simply the way you move through the world.",
    deep: "The 3 carries the frequency of expression and manifestation through creativity. You are designed to speak, create, and inspire — to take the invisible and give it form others can see and feel. Your challenge is to move past self-doubt and trust that what lives inside you is worth bringing forward. The world needs what only your voice can offer.",
  },
  "4": {
    title: "The Builder",
    teaser: "You are the foundation beneath everything worth having. Your gifts are discipline, reliability, and the capacity to build what lasts.",
    deep: "The 4 holds the energy of structure and mastery. You are here to create systems, build institutions, and lay the groundwork that others will stand on for generations. There is an integrity in you that cannot be compromised — you mean what you say, and you do what you commit to. Your challenge is to let yourself rest inside the structures you build, rather than always working at their edges.",
  },
  "5": {
    title: "The Freedom-Seeker",
    teaser: "Change, experience, and freedom are your oxygen. You are here to taste everything life offers and teach others what it means to truly live.",
    deep: "The 5 is the frequency of liberation and experience. You are a soul who arrived here to explore the full range of human sensation, relationship, and possibility. You bring aliveness into every room you enter. Your challenge is to recognize that freedom is not the absence of commitment — it is the ability to be fully present inside any moment, chosen or unchosen.",
  },
  "6": {
    title: "The Nurturer",
    teaser: "Love, responsibility, and healing are your calling. You are designed to care deeply — and to create beauty and safety wherever you are.",
    deep: "The 6 embodies unconditional love in its most practical form. You are a natural caretaker, teacher, and harmonizer — someone whose very presence stabilizes the people and spaces around them. You feel a deep responsibility to those you love, and you carry that beautifully. Your challenge is to extend that same care inward, recognizing that you cannot pour from empty.",
  },
  "7": {
    title: "The Seeker",
    teaser: "You are here to know. Depth, truth, and inner wisdom are your native terrain — you were built to dive beneath the surface of everything.",
    deep: "The 7 carries the energy of the mystic, the analyst, and the truth-seeker. You are designed to go deep — into knowledge, into experience, into yourself. You see what others miss, and you carry a contemplative quality that often makes you feel different from those around you. Your challenge is to trust that solitude is not the same as loneliness, and that your inner world is a gift, not a burden.",
  },
  "8": {
    title: "The Powerhouse",
    teaser: "Abundance, authority, and mastery are woven into your design. You are here to work at scale — and to teach the world what ethical power looks like.",
    deep: "The 8 holds the archetype of the executive and the alchemist — the soul who understands that material and spiritual power are not opposites. You are built to lead at the highest levels, to create abundance, and to build legacies. Your challenge is to release the conditioning that tells you you must earn your worth, and to step into the authority you already carry.",
  },
  "9": {
    title: "The Humanitarian",
    teaser: "Completion, wisdom, and universal love are your signature. You have lived many things, and you are here to offer what that living has made you.",
    deep: "The 9 is the frequency of completion and transcendence. You carry the wisdom of many experiences — yours and those you have absorbed from the people and places around you. You feel the suffering of the world personally, and you are driven to heal it. Your challenge is to complete your own inner cycles before trying to heal everyone else's — to recognize that the most powerful thing you can offer is the fullness of who you have become.",
  },
  "11": {
    title: "The Illuminator",
    teaser: "You are a master number — a soul carrying amplified sensitivity and a calling to bring spiritual light into the world. You were never meant to live a small life.",
    deep: "The 11 is the first master number — the frequency of the inspired visionary and spiritual messenger. You feel more than most people, see more than most people, and carry an intuitive intelligence that can feel like a burden before it becomes a gift. Your challenge is to ground your extraordinary sensitivity into practical, embodied expression rather than letting it remain as potential.",
  },
  "22": {
    title: "The Master Builder",
    teaser: "You are here to build something that outlasts you. Your vision operates at a scale most people cannot access — and that vision is exactly what is needed.",
    deep: "The 22 is the master builder — the soul designed to manifest large-scale visions that serve humanity. You hold the sensitivity of the 11 and the practicality of the 4 simultaneously, giving you the rare ability to dream and execute at the same time. Your challenge is to hold the weight of your calling without letting it crush you, and to trust that what you are building is worthy of the time and care you are giving it.",
  },
  "33": {
    title: "The Master Teacher",
    teaser: "You are here to love at a level that transforms. Compassion, healing, and service are not choices for you — they are your core frequency.",
    deep: "The 33 is the master teacher — the rarest of the master numbers, carrying the frequency of selfless love in its highest expression. You are designed to heal, to teach, and to hold space for transformation in others. Your challenge is to recognize that embodying this number means first learning to receive the love you so freely give — that you cannot teach what you have not lived.",
  },
};

export function getMeaning(num: number): { title: string; teaser: string; deep: string } {
  return MEANINGS[String(num)] || MEANINGS["9"];
}
