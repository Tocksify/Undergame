// ── Challenge Tier Store ──────────────────────────────────────────────
// Six escalating tiers: Bronze → Silver → Gold → Platinum → Diamond → Void.
// Each tier is unlocked globally (persists across all save-slot deletions).
// When the player creates a new slot and visits the Challenge Keeper, they
// pick ONE item from their highest unlocked tier's item pool.

export type ChallengeTierName = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'color';

export interface ChallengeTierItem {
  itemId: string;   // item ID from the ITEMS registry
  label: string;    // display name for the item picker
  desc: string;     // short benefit description
  chance: number;   // relative weight (e.g. 50 = 50 out of total)
}

/** Weighted-random pick from a tier's item pool based on each item's chance weight. */
export function pickRandomChallengeItem(tier: ChallengeTier): string {
  const total = tier.pool.reduce((s, p) => s + p.chance, 0);
  let r = Math.random() * total;
  for (const p of tier.pool) {
    r -= p.chance;
    if (r <= 0) return p.itemId;
  }
  return tier.pool[tier.pool.length - 1].itemId;
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
      { itemId: 'ch_wisp_lantern',   label: 'Wisp Lantern',   desc: 'Trinket: +1 ATK, +5 HP — challenge-exclusive',          chance: 50 },
      { itemId: 'ch_hollow_draught', label: 'Hollow Draught', desc: 'Consumable: heal 15 HP, clear confusion — challenge-exclusive', chance: 30 },
      { itemId: 'carved_stake',      label: 'Carved Stake',   desc: 'Weapon: +2 ATK',                                        chance: 20 },
    ],
  },
  {
    name: 'silver',
    displayName: 'Silver',
    color: '#c0c0c0',
    desc: 'Proven once. The silver reward cuts sharper.',
    pool: [
      { itemId: 'ch_resonance_fork', label: 'Resonance Fork', desc: 'Weapon: +5 ATK — challenge-exclusive',    chance: 40 },
      { itemId: 'ch_echo_tonic',     label: 'Echo Tonic',     desc: 'Consumable: heal 22 HP — challenge-exclusive', chance: 35 },
      { itemId: 'void_needle',       label: 'Void Needle',    desc: 'Weapon: +3 ATK',                          chance: 25 },
    ],
  },
  {
    name: 'gold',
    displayName: 'Gold',
    color: '#ffd700',
    desc: "A champion's boon. Rare gear to start the fight right.",
    pool: [
      { itemId: 'ch_keeper_sigil',   label: "Keeper's Sigil",   desc: 'Trinket: +2 ATK, +2 DEF, +5 HP — challenge-exclusive', chance: 45 },
      { itemId: 'ch_archive_blade',  label: 'Archive Blade',    desc: 'Weapon: +9 ATK — challenge-exclusive',                 chance: 35 },
      { itemId: 'ench_hollow_edge',  label: 'Hollow Edge Tome', desc: 'Weapon enchant: weaken enemy ATK',                    chance: 20 },
    ],
  },
  {
    name: 'platinum',
    displayName: 'Platinum',
    color: '#e5e4e2',
    desc: 'Forged in hardship. The platinum reward is rare indeed.',
    pool: [
      { itemId: 'ch_void_shard_edge', label: 'Void Shard Edge', desc: 'Weapon: +12 ATK — challenge-exclusive',     chance: 40 },
      { itemId: 'ch_echo_bulwark',    label: 'Echo Bulwark',    desc: 'Shield: blocks 10 flat dmg — challenge-exclusive', chance: 35 },
      { itemId: 'phoenix_ash',        label: 'Phoenix Ash',     desc: 'Consumable: full heal, clear all effects', chance: 25 },
    ],
  },
  {
    name: 'diamond',
    displayName: 'Diamond',
    color: '#b9f2ff',
    desc: 'Diamond tier — the boons of legends.',
    pool: [
      { itemId: 'ch_nexus_crown',    label: 'Nexus Crown',   desc: 'Helmet: +5 DEF, +15 HP — challenge-exclusive',    chance: 40 },
      { itemId: 'ch_oblivion_fang',  label: 'Oblivion Fang', desc: 'Weapon: +16 ATK — challenge-exclusive',           chance: 35 },
      { itemId: 'ench_cursed_brand', label: 'Cursed Brand',  desc: 'Weapon enchant: poison + burn + silence',        chance: 25 },
    ],
  },
  {
    name: 'color',
    displayName: 'Color',
    color: '#ff77ee',
    desc: 'The final rite. Those who see all colours at once. Chromatic and Mortus-tier rewards await.',
    pool: [
      { itemId: 'ch_creed_emblem',        label: 'Creed Emblem',    desc: 'Trinket: +4 ATK, +3 DEF, +10 HP — scales with Chromatic skills. Chromatic tier, challenge-exclusive.',   chance: 45 },
      { itemId: 'ch_ench_chromatic_tide', label: 'Chromatic Tide',  desc: 'Weapon enchant: +8 ATK, confuse + freeze + weaken on hit. Chromatic tier, challenge-exclusive.',         chance: 35 },
      { itemId: 'ch_ench_mortus_verdict', label: "Mortus' Verdict", desc: 'Weapon enchant: +15 ATK, drain 8 HP + silence on hit. Mortus tier, challenge-exclusive.',               chance: 20 },
    ],
  },
];

// All tiers are permanently unlocked — no earning required.
export function getUnlockedTierIndex(): number { return 5; }
export function unlockChallengeTier(_tierIndex: number): void { /* all tiers already unlocked */ }

// ── Earned Challenge Items ─────────────────────────────────────────────────
// Global store that tracks which challenge-board items a player has ever
// claimed across all journeys, so they can be offered at character creation.
const EARNED_ITEMS_KEY = 'er-challenge-items-v1';

export function getEarnedChallengeItemIds(): string[] {
  try { return JSON.parse(localStorage.getItem(EARNED_ITEMS_KEY) ?? '[]') as string[]; } catch { return []; }
}

export function addEarnedChallengeItem(itemId: string): void {
  const earned = getEarnedChallengeItemIds();
  if (!earned.includes(itemId)) {
    earned.push(itemId);
    try { localStorage.setItem(EARNED_ITEMS_KEY, JSON.stringify(earned)); } catch { /* storage full */ }
    // Write back to ChallengeItems.json in the Electron desktop build.
    try { (window as any).electronAPI?.writeGamedataChallengeItems?.(earned); } catch { /* noop */ }
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
