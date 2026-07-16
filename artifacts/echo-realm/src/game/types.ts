export enum GameMode {
  TITLE,
  OVERWORLD,
  DIALOGUE,
  BATTLE,
  SHOP,
  INVENTORY,
  MENU,
  QUEST_LOG,
  GAME_OVER,
  VICTORY,
  BOOK_READ,      // 10 - reading a collected book
  ENCHANT_SELECT, // 11 - picking an item to enchant
  TOME_CRAFT,     // 12 - Tomes Blessing: choosing an enchantment to create from an empty book
  TELEPORT,       // 13 - N key: memory transit map selection
  STAT_ALLOCATION, // 14 - M key: spend earned stat points into STR/VIT/DEF
  TRUE_ENDING,    // 15 - the peaceful death ending, reached via Morthus's cutscene in Color
  BESTIARY,       // 16 - B key: enemy bestiary with revealed resistances
  SKILL_TREE,     // 17 - K key: Void/Chromatic/Echo/Ember skill tree
}

export type TileType = 'G' | 'S' | 'W' | 'P' | 'T' | 'V' | 'M' | 'H' | 'D' | 'ST' | 'E_N' | 'E_S' | 'B_D' | 'CHEST' | 'CG';

import type { SpriteAppearance } from './npcAppearance';

export type ItemTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type ItemCategory = 'consumable' | 'weapon' | 'armor' | 'shield' | 'key' | 'book' | 'enchanted_book' | 'relic';
export type ItemSubcategory = 'medical' | 'def' | 'utility';

export interface Item {
  name: string;
  desc: string;
  price: number;
  tier: ItemTier;
  category: ItemCategory;
  subcategory?: ItemSubcategory;
  atk?: number;
  def?: number;
  maxHp?: number;
  block?: number;   // shields: flat damage reduction per hit
  bookId?: string;  // references BOOKS registry
  enchantData?: {
    compatibleCategories: ('weapon' | 'armor')[];
    atk?: number;
    def?: number;
    maxHp?: number;
    // ── Existing proc effects ──────────────────────────────────────────────────
    confuse?: boolean;   // weapon: confuses enemy on a PERFECT or GOOD hit
    weaken?: number;     // weapon: reduces enemy ATK by this amount on a PERFECT or GOOD hit
    drain?: number;      // weapon: restores this many HP to the player on a PERFECT or GOOD hit
    autoWard?: boolean;  // armor: auto-applies void ward once per dodge phase (once per battle)
    thornDmg?: number;   // armor: deals this damage back to the enemy whenever the player is hit
    // ── New proc effects ──────────────────────────────────────────────────────
    poison?: number;   // weapon: poisons enemy for 3 turns (X dmg/turn)
    burn?: boolean;    // weapon: enemy burns (2 dmg first turn, doubles each turn, cap 32)
    freeze?: boolean;  // weapon: freezes enemy for 1 round (skips turn AND dodge phase)
    silence?: boolean; // weapon: silences enemy for 1 round (blocks magic acts)
  };
}

export interface BookData {
  title: string;
  author?: string;
  type: 'story' | 'note' | 'poem' | 'journal' | 'cipher';
  pages: string[];
}

export interface DialogueNode {
  text: string;
  speaker: string;
  color?: string;
  options?: { label: string; nextId?: string; action?: (state: GameStateData) => void }[];
  nextId?: string;
  action?: (state: GameStateData) => void;
}

export interface EnemyAct {
  id: string;
  name: string;
  effect: 'resonance' | 'weaken' | 'confuse' | 'damage' | 'flavor';
  power?: number;
  requiresItem?: string;
  magic?: boolean; // if true, blocked when the enemy is silenced
}

export interface EnemyData {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  atk: number;
  color: string;
  flavor: string;
  rememberText: string;
  echoes: number;
  acts: EnemyAct[];
  // ── Resistances & weaknesses ──────────────────────────────────────────────
  // Maps enchant-proc type → damage/effect multiplier.
  // 0 = immune, 0.5 = resistant, 1 = normal (default), 2 = weak.
  // Revealed in the Bestiary after 3+ encounters.
  resistances?: Record<string, number>;
}

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  color: string;
  type?: string;
  wave?: boolean;
  waveStartY?: number;
  proc?: string; // 'stun' — applied to player on hit with a random chance
}

export interface BattleState {
  enemy: EnemyData;
  phase: 'MENU' | 'ACT_MENU' | 'ACTION' | 'MINIGAME' | 'DODGE' | 'END';
  menuIndex: number;
  soulX: number;
  soulY: number;
  projectiles: Projectile[];
  timer: number;
  resonance: number;
  actionMsg: string | null;
  endType?: 'DEFEATED' | 'REMEMBERED' | 'FLED';
  minigame: { cursorX: number; type: 'REMEMBER' | 'FORGET'; mult: number } | null;
  voidWard: boolean;
  flags: Record<string, boolean>;
  // ── Status effect state ────────────────────────────────────────────────────
  poisonDmg: number;    // > 0 while poisoned; damage per ACTION phase
  poisonTurns: number;  // turns remaining for poison
  burnDmg: number;      // > 0 while burning; doubles each turn (cap 32)
}

export interface GameStateData {
  mode: GameMode;
  mapId: string;
  player: {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    hp: number;
    maxHp: number;
    echoes: number;
    inventory: string[];
    enchantedSlots: (string | null)[]; // parallel to inventory; enchant-book-id or null
    equipment: { weapon: string | null; armor: string | null; offhand: string | null };
    quests: Record<string, number>;
    questProgress: Record<string, number>;
    flags: Record<string, boolean>;
    invincibility: number;
    level: number;
    xp: number;
    xpToNext: number;
    statPoints: number; // unspent points, earned on level-up (+ a 10-point starting grant)
    baseStats: { str: number; vit: number; def: number }; // player-assigned, on top of equipment/enchants
    appearance?: SpriteAppearance; // set via the character-customization screen on a fresh save
    // ── Bestiary ──────────────────────────────────────────────────────────────
    // Tracks total encounters resolved (defeat + remember, not flee) per enemy id.
    // At 3+ the bestiary reveals that enemy's resistances/weaknesses.
    bestiary: Record<string, number>;
    // ── Skill Tree ────────────────────────────────────────────────────────────
    learnedSkills: string[];   // ids of learned skills from the skill tree
    skillPoints: number;       // unspent points (earned every 2 levels)
  };
  camera: { x: number; y: number };
  adjacentInteractable: any;
  dialogue: {
    currentNode: DialogueNode | null;
    charIndex: number;
    timer: number;
    selectedOption: number;
  };
  battle: BattleState | null;
  menuIndex: number;
  shopIndex: number;
  shopNpcId: string | null;
  inventoryIndex: number;
  keys: Record<string, boolean>;
  prevKeys: Record<string, boolean>;
  frameCount: number;
  uiMessage: string | null;
  uiMessageTimer: number;
  // Stacked toast notifications, used when multiple items/rewards are granted at once
  // so messages don't overwrite/overlap each other.
  messageStack: { text: string; timer: number; tier?: ItemTier }[];
  pendingEncounter: EnemyData | null;
  saveRequested: boolean;
  exitRequested: boolean;
  quitAfterSave: boolean;
  meta: { isGuest: boolean };
  // Book reader state
  bookRead: {
    bookId: string | null;
    page: number;
    fromInventoryIndex: number;
  };
  // Enchant-select state
  enchantSelect: {
    enchantBookSlot: number; // inventory index of the enchanted_book being applied
    cursorIndex: number;     // which compatible item is highlighted
  };
  // Tomes Blessing crafting: pick any enchantment from scratch, then apply it
  tomeCraft: {
    cursorIndex: number;      // which craftable enchantment is highlighted
    chosenEnchantId: string | null; // enchant item id chosen, then routes into enchantSelect
  };
  teleportIndex: number; // selected row in the TELEPORT menu
  questLogScroll: number; // top index of the visible window in the QUEST_LOG list
  bestiaryScroll: number; // top index of the visible window in the BESTIARY list
  statAllocIndex: number; // selected stat row (STR/VIT/DEF) in the STAT_ALLOCATION menu
  skillTreeCursor: { pathIdx: number; skillIdx: number }; // SKILL_TREE navigation cursor
  // TRUE_ENDING screen: 0 = "Enter Sandbox Mode", 1 = "End Legacy"
  trueEndingMenuIndex: number;
  // Set by engine.ts when the player chooses "End Legacy" on the true-ending screen.
  // Game.tsx watches this and calls onEndLegacy (which deletes the save slot and exits).
  endLegacyRequested: boolean;
  // Set by skill tree engine when a skill is newly learned (clears after one frame).
  skillLearnedFlash: string | null;
  // Header notification badges (Quest/Stats/Inventory). Transient UI state —
  // not persisted in save slots. itemsBaseline/questsBaseline are the
  // inventory length / quest-stage snapshot as of the last time the player
  // opened that screen; the badge count is however much has changed since.
  notifications: {
    itemsBaseline: number;
    questsBaseline: Record<string, number>;
  };
}
