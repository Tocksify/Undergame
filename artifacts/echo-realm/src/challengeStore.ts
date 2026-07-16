// ── Challenge Emblem Store ────────────────────────────────────────────
// Persists earned emblem IDs independently of save slots so they survive
// across all characters. Stored in localStorage under 'er-challenge-emblems'.

export interface ChallengeEmblem {
  id: string;
  name: string;
  desc: string;
  color: string;
  buffs: {
    maxHp?: number;
    str?: number;
    vit?: number;
    def?: number;
    echoes?: number;
    item?: string; // item id to add to starting inventory
  };
}

export const CHALLENGE_EMBLEMS: ChallengeEmblem[] = [
  {
    id: 'emblem_void_sigil',
    name: 'Void Sigil',
    desc: 'Start with +5 Max HP.',
    color: '#9988cc',
    buffs: { maxHp: 5 },
  },
  {
    id: 'emblem_ember_brand',
    name: 'Ember Brand',
    desc: 'Start with +2 STR.',
    color: '#cc6633',
    buffs: { str: 2 },
  },
  {
    id: 'emblem_echo_mark',
    name: 'Echo Mark',
    desc: 'Start with 20 bonus Echoes.',
    color: '#88ccaa',
    buffs: { echoes: 20 },
  },
  {
    id: 'emblem_chroma_crest',
    name: 'Chroma Crest',
    desc: 'Start with a Hollow Tonic.',
    color: '#88aaff',
    buffs: { item: 'tonic' },
  },
  {
    id: 'emblem_iron_seal',
    name: 'Iron Seal',
    desc: 'Start with +2 DEF.',
    color: '#aaaaaa',
    buffs: { def: 2 },
  },
  {
    id: 'emblem_memory_shard',
    name: 'Memory Shard',
    desc: 'Start with a Memory Crystal.',
    color: '#ccaaff',
    buffs: { item: 'crystal' },
  },
  {
    id: 'emblem_keepers_eye',
    name: "Keeper's Eye",
    desc: 'Start with +2 VIT.',
    color: '#aacc88',
    buffs: { vit: 2 },
  },
  {
    id: 'emblem_ancient_rune',
    name: 'Ancient Rune',
    desc: 'Start with +3 STR.',
    color: '#ccaa44',
    buffs: { str: 3 },
  },
];

const STORE_KEY = 'er-challenge-emblems';

export function getEarnedEmblemIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

export function addEarnedEmblemId(id: string): void {
  const earned = getEarnedEmblemIds();
  if (!earned.includes(id)) {
    earned.push(id);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(earned)); } catch { /* noop */ }
  }
}

/** Returns the next unearned emblem, cycling back to the first once all are earned. */
export function pickNextEmblem(): ChallengeEmblem {
  const earned = getEarnedEmblemIds();
  const unearned = CHALLENGE_EMBLEMS.filter((e) => !earned.includes(e.id));
  return unearned.length > 0 ? unearned[0] : CHALLENGE_EMBLEMS[earned.length % CHALLENGE_EMBLEMS.length];
}
