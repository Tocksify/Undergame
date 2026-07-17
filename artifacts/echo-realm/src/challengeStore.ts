// ── Challenge Tier Store ──────────────────────────────────────────────
// Six escalating tiers: Bronze → Silver → Gold → Platinum → Diamond → Void.
// Each tier is unlocked globally (persists across all save-slot deletions).
// When the player creates a new slot and visits the Challenge Keeper, they
// pick ONE item from their highest unlocked tier's item pool.

export type ChallengeTierName = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'void';

export interface ChallengeTierItem {
  itemId: string;   // item ID from the ITEMS registry
  label: string;    // display name for the item picker
  desc: string;     // short benefit description
}

export interface ChallengeTier {
  name: ChallengeTierName;
  displayName: string;
  color: string;
  desc: string;
  pool: ChallengeTierItem[];
}

export const CHALLENGE_TIERS: ChallengeTier[] = [
  {
    name: 'bronze',
    displayName: 'Bronze',
    color: '#cd7f32',
    desc: 'The first rite of challenge. A modest boon to begin the journey.',
    pool: [
      { itemId: 'crystal',       label: 'Memory Crystal',    desc: 'Heal 10 HP (consumable)' },
      { itemId: 'tonic',         label: 'Hollow Tonic',      desc: 'Heal 5 HP (consumable)' },
      { itemId: 'carved_stake',  label: 'Carved Stake',      desc: '+2 ATK starting weapon' },
    ],
  },
  {
    name: 'silver',
    displayName: 'Silver',
    color: '#c0c0c0',
    desc: 'Proven once. The silver reward cuts sharper.',
    pool: [
      { itemId: 'elixir',            label: 'Void Elixir',         desc: 'Heal 18 HP (consumable)' },
      { itemId: 'void_needle',       label: 'Void Needle',         desc: '+3 ATK starting weapon' },
      { itemId: 'ench_memory_mark',  label: 'Mark of Memory',      desc: 'Weapon enchant: drain HP on hit' },
    ],
  },
  {
    name: 'gold',
    displayName: 'Gold',
    color: '#ffd700',
    desc: "A champion's boon. Rare gear to start the fight right.",
    pool: [
      { itemId: 'memory_salve',      label: 'Memory Salve',        desc: 'Heal 30 HP, clear confusion' },
      { itemId: 'ench_stone_ward',   label: 'Stone Ward Tome',     desc: 'Armor enchant: thorn damage' },
      { itemId: 'ench_hollow_edge',  label: 'Hollow Edge Tome',    desc: 'Weapon enchant: weaken enemy ATK' },
    ],
  },
  {
    name: 'platinum',
    displayName: 'Platinum',
    color: '#e5e4e2',
    desc: 'Forged in hardship. The platinum reward is rare indeed.',
    pool: [
      { itemId: 'phoenix_ash',       label: 'Phoenix Ash',         desc: 'Full heal, clear all effects' },
      { itemId: 'ench_thorn_weave',  label: 'Thorn Weave Tome',    desc: 'Armor enchant: reflect damage' },
      { itemId: 'ench_woven_ward',   label: 'Woven Ward Tome',     desc: 'Armor enchant: auto void ward' },
    ],
  },
  {
    name: 'diamond',
    displayName: 'Diamond',
    color: '#b9f2ff',
    desc: 'Diamond tier — the boons of legends.',
    pool: [
      { itemId: 'ench_shard_frostbite', label: 'Frostbite Shard',  desc: 'Weapon enchant: freeze enemy' },
      { itemId: 'ench_confusion_brand', label: 'Confusion Brand',   desc: 'Weapon enchant: confuse enemy' },
      { itemId: 'ench_venom_brand',     label: 'Venom Brand',       desc: 'Weapon enchant: poison enemy' },
    ],
  },
  {
    name: 'void',
    displayName: 'Void',
    color: '#9966ff',
    desc: 'The final rite. Only the most seasoned Keepers walk this far.',
    pool: [
      { itemId: 'tomes_blessing',    label: "Tomes' Blessing",     desc: 'Relic: craft any enchantment' },
      { itemId: 'ench_wither_mark',  label: 'Wither Mark',         desc: 'Weapon enchant: heavy drain' },
      { itemId: 'blink_shard',       label: 'Blink Shard',         desc: 'Skip enemy attack AND 2× next' },
    ],
  },
];

const TIER_KEY = 'er-challenge-tier'; // stores highest unlocked tier index (0–5)

export function getUnlockedTierIndex(): number {
  try {
    const v = parseInt(localStorage.getItem(TIER_KEY) ?? '0', 10);
    return isNaN(v) ? 0 : Math.max(0, Math.min(5, v));
  } catch { return 0; }
}

export function unlockChallengeTier(tierIndex: number): void {
  const current = getUnlockedTierIndex();
  if (tierIndex > current) {
    try { localStorage.setItem(TIER_KEY, String(tierIndex)); } catch { /* noop */ }
  }
}

export function getUnlockedTier(): ChallengeTier {
  return CHALLENGE_TIERS[getUnlockedTierIndex()];
}

/** Returns all tiers up to and including the unlocked one. */
export function getAccessibleTiers(): ChallengeTier[] {
  const idx = getUnlockedTierIndex();
  return CHALLENGE_TIERS.slice(0, idx + 1);
}

// ── Legacy shim ────────────────────────────────────────────────────────
// dialogue.ts still imports these; keep them as no-ops/fallbacks so the
// old challenge-keeper dialogue still compiles and runs without crashing.
export interface ChallengeEmblem {
  id: string; name: string; desc: string; color: string;
  buffs: { maxHp?: number; str?: number; vit?: number; def?: number; echoes?: number; item?: string; };
}
export const CHALLENGE_EMBLEMS: ChallengeEmblem[] = [];
export function getEarnedEmblemIds(): string[] { return []; }
export function addEarnedEmblemId(_id: string): void { /* no-op */ }
export function pickNextEmblem(): ChallengeEmblem {
  return { id: 'none', name: 'Challenge Boon', desc: 'Visit the Challenge Keeper to claim your tier reward.',
    color: '#888888', buffs: {} };
}
