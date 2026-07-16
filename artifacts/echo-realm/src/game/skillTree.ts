import { GameStateData } from './types';

export type SkillPathId = 'void' | 'chroma' | 'echo' | 'ember';

export interface SkillDef {
  id: string;
  path: SkillPathId;
  tier: 1 | 2 | 3 | 4; // 4 = capstone
  name: string;
  shortDesc: string; // one-line shown in tree node
  fullDesc: string;  // shown in detail panel
  prereq?: string;   // skill id that must be learned first
}

export interface PathDef {
  id: SkillPathId;
  name: string;
  color: string;       // primary hex color for UI
  dimColor: string;    // muted version for locked skills
  flavor: string;
  skills: string[];    // ordered T1→T2→T3→Cap
}

export const PATH_ORDER: SkillPathId[] = ['void', 'chroma', 'echo', 'ember'];

export const PATH_DEFS: Record<SkillPathId, PathDef> = {
  void: {
    id: 'void',
    name: 'Void Path',
    color: '#a855f7',
    dimColor: '#3b1760',
    flavor: 'Annihilation drawn from the hungry darkness between worlds.',
    skills: ['void_strike', 'void_drain', 'void_rift', 'void_herald'],
  },
  chroma: {
    id: 'chroma',
    name: 'Chromatic Path',
    color: '#f472b6',
    dimColor: '#5c1d3d',
    flavor: "Prismatic power flowing from the Color world — Morthus's gift.",
    skills: ['chroma_touch', 'chroma_strike', 'chroma_veil', 'chroma_morthus'],
  },
  echo: {
    id: 'echo',
    name: 'Echo Path',
    color: '#22d3ee',
    dimColor: '#0c3d47',
    flavor: 'The resonant memory of the Echo Realm, woven into combat.',
    skills: ['echo_surge', 'echo_nova', 'echo_armor', 'echo_legacy'],
  },
  ember: {
    id: 'ember',
    name: 'Ember Path',
    color: '#f97316',
    dimColor: '#4a2004',
    flavor: 'Forged in the fires of Ashfall Ring — endurance and immolation.',
    skills: ['ember_forge', 'ember_shell', 'ember_will', 'ember_phoenix'],
  },
};

// ── CHROMATIC rainbow hues used in rendering ──────────────────────────────────
export const CHROMA_HUES = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#a78bfa', '#f472b6'];

export const SKILL_DEFS: Record<string, SkillDef> = {

  // ── VOID PATH ───────────────────────────────────────────────────────────────
  void_strike: {
    id: 'void_strike', path: 'void', tier: 1,
    name: 'Void Strike',
    shortDesc: '+3 FORGET power • 20% silence on PERFECT',
    fullDesc: 'FORGET attacks gain +3 base power. On a PERFECT hit, 20% chance to silence the enemy for one round — blocking their magic acts.',
  },
  void_drain: {
    id: 'void_drain', path: 'void', tier: 2,
    name: 'Void Drain',
    shortDesc: 'PERFECT hits heal 4 HP • defeat heals 6 HP',
    fullDesc: 'Any PERFECT FORGET hit restores 4 HP. Defeating an enemy (not Remembering) heals an additional 6 HP — the Void feeds you.',
    prereq: 'void_strike',
  },
  void_rift: {
    id: 'void_rift', path: 'void', tier: 3,
    name: 'Void Rift',
    shortDesc: 'PERFECT ×1.5 damage • +8 dmg vs enemies <30% HP',
    fullDesc: 'PERFECT FORGET hits deal ×1.5 damage. Enemies below 30% of their maximum HP take an additional +8 damage per hit — annihilate the weakened.',
    prereq: 'void_drain',
  },
  void_herald: {
    id: 'void_herald', path: 'void', tier: 4,
    name: 'Herald of the Void',
    shortDesc: 'Hits Weaken enemy • Void Ward = 100% block • +20% Echoes',
    fullDesc: 'Every successful FORGET hit applies Weaken (enemy ATK −2, stacking). Void Ward blocks 100% of incoming damage instead of 50%. Defeated enemies drop 20% more Echoes.',
    prereq: 'void_rift',
  },

  // ── CHROMATIC PATH ──────────────────────────────────────────────────────────
  chroma_touch: {
    id: 'chroma_touch', path: 'chroma', tier: 1,
    name: 'Prismatic Touch',
    shortDesc: 'GOOD REMEMBER builds Resonance • cursor 25% slower',
    fullDesc: 'In the REMEMBER minigame, GOOD hits now build 1 Resonance (normally only PERFECT does). The cursor oscillates 25% slower, making timing far more forgiving.',
  },
  chroma_strike: {
    id: 'chroma_strike', path: 'chroma', tier: 2,
    name: 'Spectrum Strike',
    shortDesc: 'PERFECT FORGET applies a random status effect',
    fullDesc: 'On a PERFECT FORGET hit, randomly apply one of the following to the enemy: Confuse, Freeze, Burn, or Weaken. The Chromatic path bends fate.',
    prereq: 'chroma_touch',
  },
  chroma_veil: {
    id: 'chroma_veil', path: 'chroma', tier: 3,
    name: 'Chromatic Veil',
    shortDesc: '15% auto-dodge any projectile • Remember needs only 2 Resonance',
    fullDesc: 'Each incoming projectile has a 15% chance to pass through you harmlessly. Only 2 Resonance is required to Remember an enemy (instead of 3) — the colors bend memory.',
    prereq: 'chroma_strike',
  },
  chroma_morthus: {
    id: 'chroma_morthus', path: 'chroma', tier: 4,
    name: "Morthus's Gift",
    shortDesc: 'Start with 1 Resonance • Remember heals 15 HP • PERFECT REMEMBER = +2 Resonance',
    fullDesc: "Every battle begins with 1 Resonance already built. Remembering an enemy heals 15 HP. PERFECT REMEMBER hits build 2 Resonance instead of 1. Morthus's rainbow walks with you.",
    prereq: 'chroma_veil',
  },

  // ── ECHO PATH ───────────────────────────────────────────────────────────────
  echo_surge: {
    id: 'echo_surge', path: 'echo', tier: 1,
    name: 'Echo Surge',
    shortDesc: '+20% XP from all battles • flee always succeeds',
    fullDesc: 'Gain 20% bonus XP from every battle. Fleeing always succeeds — the Echo Realm claims its own, and the Void cannot hold you.',
  },
  echo_nova: {
    id: 'echo_nova', path: 'echo', tier: 2,
    name: 'Echo Nova',
    shortDesc: 'PERFECT FORGET +dmg = Resonance × 3 • take 1 less damage',
    fullDesc: 'On a PERFECT FORGET hit, deal bonus damage equal to your current Resonance × 3 — the memory of every battle powers this strike. Take 1 less damage from every hit (minimum 0).',
    prereq: 'echo_surge',
  },
  echo_armor: {
    id: 'echo_armor', path: 'echo', tier: 3,
    name: 'Memory Armor',
    shortDesc: '25% chance to fully block any hit',
    fullDesc: 'Each time you are struck, a 25% chance exists that the memory of your resilience fully negates the damage. The Echo Realm protects those who remember.',
    prereq: 'echo_nova',
  },
  echo_legacy: {
    id: 'echo_legacy', path: 'echo', tier: 4,
    name: 'Legacy of Echoes',
    shortDesc: 'Start with Void Ward • +30% XP • Remembered enemies = +75% Echoes',
    fullDesc: 'Every battle begins with Void Ward active. Gain 30% bonus XP (stacks with Echo Surge). Remembering an enemy grants 75% bonus Echoes on top of the usual 50% reward — a legacy that compounds.',
    prereq: 'echo_armor',
  },

  // ── EMBER PATH ──────────────────────────────────────────────────────────────
  ember_forge: {
    id: 'ember_forge', path: 'ember', tier: 1,
    name: 'Ashfall Forge',
    shortDesc: 'Burn starts at 4 dmg, cap 64 • +2 DEF always',
    fullDesc: 'Burn procs now start at 4 damage (instead of 2) and the cap is raised from 32 to 64 — letting Burn run longer and hotter. You gain +2 flat DEF at all times, forged from Ashfall iron.',
  },
  ember_shell: {
    id: 'ember_shell', path: 'ember', tier: 2,
    name: 'Ember Shell',
    shortDesc: '+20 max HP • Poison ticks twice per turn',
    fullDesc: '+20 to your maximum HP, layered like cooling slag. Poison now ticks twice per turn — each poisoned enemy burns from both without and within.',
    prereq: 'ember_forge',
  },
  ember_will: {
    id: 'ember_will', path: 'ember', tier: 3,
    name: 'Iron Will',
    shortDesc: 'Below 25% HP: +4 DEF • Thorn enchant deals ×2 damage',
    fullDesc: 'When your HP drops below 25% of maximum, your forge-hardened will grants +4 bonus DEF for the rest of the battle. Thorn enchantments deal double their listed damage.',
    prereq: 'ember_shell',
  },
  ember_phoenix: {
    id: 'ember_phoenix', path: 'ember', tier: 4,
    name: 'Phoenix Ember',
    shortDesc: 'Once per battle: revive at 25% HP when HP hits 0',
    fullDesc: 'Once per battle, when your HP would reach 0, you are revived with 25% of your maximum HP. Born of ash, you cannot be extinguished — the ember always persists.',
    prereq: 'ember_will',
  },
};

// ── HYBRID BONUSES ──────────────────────────────────────────────────────────
export interface HybridBonus {
  id: string;
  paths: [SkillPathId, SkillPathId];
  threshold: number; // min skills in EACH path to activate
  name: string;
  desc: string;
  color: string;
}

export const HYBRID_BONUSES: HybridBonus[] = [
  {
    id: 'hybrid_void_chroma',
    paths: ['void', 'chroma'],
    threshold: 2,
    name: 'Prismatic Void',
    desc: 'Spectrum Strike also applies Weaken (ATK −2) when triggered.',
    color: '#c084fc',
  },
  {
    id: 'hybrid_void_echo',
    paths: ['void', 'echo'],
    threshold: 2,
    name: 'Null Memory',
    desc: 'PERFECT FORGET hits silence the enemy (regardless of enchant).',
    color: '#818cf8',
  },
  {
    id: 'hybrid_void_ember',
    paths: ['void', 'ember'],
    threshold: 2,
    name: 'Ashen Void',
    desc: 'Defeating a poisoned or burning enemy heals 5 HP.',
    color: '#d97706',
  },
  {
    id: 'hybrid_chroma_echo',
    paths: ['chroma', 'echo'],
    threshold: 2,
    name: 'Resonant Prism',
    desc: 'REMEMBER cursor moves 50% slower. PERFECT REMEMBER also heals 3 HP.',
    color: '#2dd4bf',
  },
  {
    id: 'hybrid_chroma_ember',
    paths: ['chroma', 'ember'],
    threshold: 2,
    name: 'Sunfire Spectrum',
    desc: 'Spectrum Strike can also trigger Burn. Applying Burn grants +1 Resonance.',
    color: '#fb923c',
  },
  {
    id: 'hybrid_echo_ember',
    paths: ['echo', 'ember'],
    threshold: 2,
    name: 'Forge of Echoes',
    desc: 'Ember Shell grants +40 max HP (doubled). Echo Nova bonus damage is doubled.',
    color: '#facc15',
  },
];

// ── HELPER FUNCTIONS ────────────────────────────────────────────────────────

export function countPathSkills(learnedSkills: string[], pathId: SkillPathId): number {
  return Object.values(SKILL_DEFS)
    .filter(s => s.path === pathId && learnedSkills.includes(s.id))
    .length;
}

export function getActiveHybrids(learnedSkills: string[]): string[] {
  return HYBRID_BONUSES
    .filter(h =>
      countPathSkills(learnedSkills, h.paths[0]) >= h.threshold &&
      countPathSkills(learnedSkills, h.paths[1]) >= h.threshold
    )
    .map(h => h.id);
}

export function hasSkill(state: GameStateData, skillId: string): boolean {
  return (state.player.learnedSkills ?? []).includes(skillId);
}

export function hasHybrid(state: GameStateData, hybridId: string): boolean {
  return getActiveHybrids(state.player.learnedSkills ?? []).includes(hybridId);
}

export function canLearnSkill(skillId: string, learnedSkills: string[], skillPoints: number): boolean {
  if (skillPoints <= 0) return false;
  if (learnedSkills.includes(skillId)) return false;
  const def = SKILL_DEFS[skillId];
  if (!def) return false;
  if (def.prereq && !learnedSkills.includes(def.prereq)) return false;
  return true;
}
