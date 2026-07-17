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
      { itemId: 'ch_wisp_lantern',   label: 'Wisp Lantern',   desc: 'Trinket: +1 ATK, +5 HP — challenge-exclusive' },
      { itemId: 'ch_hollow_draught', label: 'Hollow Draught', desc: 'Consumable: heal 15 HP, clear confusion — challenge-exclusive' },
      { itemId: 'carved_stake',      label: 'Carved Stake',   desc: 'Weapon: +2 ATK' },
    ],
  },
  {
    name: 'silver',
    displayName: 'Silver',
    color: '#c0c0c0',
    desc: 'Proven once. The silver reward cuts sharper.',
    pool: [
      { itemId: 'ch_resonance_fork', label: 'Resonance Fork', desc: 'Weapon: +5 ATK — challenge-exclusive' },
      { itemId: 'ch_echo_tonic',     label: 'Echo Tonic',     desc: 'Consumable: heal 22 HP — challenge-exclusive' },
      { itemId: 'void_needle',       label: 'Void Needle',    desc: 'Weapon: +3 ATK' },
    ],
  },
  {
    name: 'gold',
    displayName: 'Gold',
    color: '#ffd700',
    desc: "A champion's boon. Rare gear to start the fight right.",
    pool: [
      { itemId: 'ch_keeper_sigil',   label: "Keeper's Sigil",   desc: 'Trinket: +2 ATK, +2 DEF, +5 HP — challenge-exclusive' },
      { itemId: 'ch_archive_blade',  label: 'Archive Blade',    desc: 'Weapon: +9 ATK — challenge-exclusive' },
      { itemId: 'ench_hollow_edge',  label: 'Hollow Edge Tome', desc: 'Weapon enchant: weaken enemy ATK' },
    ],
  },
  {
    name: 'platinum',
    displayName: 'Platinum',
    color: '#e5e4e2',
    desc: 'Forged in hardship. The platinum reward is rare indeed.',
    pool: [
      { itemId: 'ch_void_shard_edge', label: 'Void Shard Edge', desc: 'Weapon: +12 ATK — challenge-exclusive' },
      { itemId: 'ch_echo_bulwark',    label: 'Echo Bulwark',    desc: 'Shield: blocks 10 flat dmg — challenge-exclusive' },
      { itemId: 'phoenix_ash',        label: 'Phoenix Ash',     desc: 'Consumable: full heal, clear all effects' },
    ],
  },
  {
    name: 'diamond',
    displayName: 'Diamond',
    color: '#b9f2ff',
    desc: 'Diamond tier — the boons of legends.',
    pool: [
      { itemId: 'ch_nexus_crown',   label: 'Nexus Crown',   desc: 'Helmet: +5 DEF, +15 HP — challenge-exclusive' },
      { itemId: 'ch_oblivion_fang', label: 'Oblivion Fang', desc: 'Weapon: +16 ATK — challenge-exclusive' },
      { itemId: 'ench_cursed_brand', label: 'Cursed Brand', desc: 'Weapon enchant: poison + burn + silence' },
    ],
  },
  {
    name: 'void',
    displayName: 'Void',
    color: '#9966ff',
    desc: 'The final rite. Only the most seasoned Keepers walk this far — Mortus-tier rewards await.',
    pool: [
      { itemId: 'ch_mortus_throne_blade', label: 'Throne Blade of Mortus', desc: 'Weapon: +25 ATK — Mortus tier, challenge-exclusive' },
      { itemId: 'ch_mortus_void_mantle',  label: 'Void Mantle of Mortus',  desc: 'Armor: +50 HP, +10 DEF — Mortus tier, challenge-exclusive' },
      { itemId: 'ch_mortus_eye',          label: 'Eye of Mortus',          desc: 'Trinket: +8 ATK, +6 DEF, +20 HP — Mortus tier, challenge-exclusive' },
    ],
  },
];

// All tiers are permanently unlocked — no earning required.
export function getUnlockedTierIndex(): number { return 5; }
export function unlockChallengeTier(_tierIndex: number): void { /* all tiers already unlocked */ }

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
