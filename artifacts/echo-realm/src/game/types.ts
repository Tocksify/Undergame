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
  ITEM_CRAFT,     // 18 - Crafting Table: craft items/gear from ingredients
  ACHIEVEMENTS,   // 19 - A key: global achievement tracker
  CHALLENGE_SELECT,  // 20 - Challenge Board: tier info + attempt launcher (via herald NPC)
  EXTRAS,            // 21 - Extras screen: achievements, challenge codex, etc.
  COLOR_SANDBOX_FADE, // 22 - Black-screen moment before sandbox respawn after Color ending
  END_LEGACY_SEQ,    // 23 - Multi-step "End Legacy" sequence: text → playtime → erase slot
  CHALLENGE_RESULT,  // 24 - Post-challenge modal: shows time + randomly awarded item
}

export type TileType = 'G' | 'S' | 'W' | 'P' | 'T' | 'V' | 'M' | 'H' | 'D' | 'ST' | 'E_N' | 'E_S' | 'B_D' | 'CHEST' | 'CG';

import type { SpriteAppearance } from './npcAppearance';

export type ItemTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type ItemCategory = 'consumable' | 'weapon' | 'armor' | 'shield' | 'key' | 'book' | 'enchanted_book' | 'relic'
  | 'helmet' | 'gloves' | 'pants' | 'boots' | 'cloak' | 'necklace' | 'ring' | 'belt' | 'trinket' | 'ingredient';

export type EquipSlotId = 'weapon' | 'armor' | 'offhand' | 'helmet' | 'gloves' | 'pants' | 'boots'
  | 'cloak' | 'necklace' | 'ring1' | 'ring2' | 'belt' | 'trinket';

export interface CraftRecipe {
  id: string;
  name: string;
  outputId: string;
  outputCount: number;
  ingredients: { itemId: string; count: number }[];
  category: 'material' | 'weapon' | 'armor' | 'trinket' | 'consumable';
}

export interface EquipSlot {
  id: EquipSlotId;
  label: string;
  categories: ItemCategory[];
}
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
  // ── Status-effect resistances ─────────────────────────────────────────────
  // Maps enchant-proc type → damage/effect multiplier.
  // 0 = immune, 0.5 = resistant, 1 = normal (default), 2 = weak.
  // Revealed in the Bestiary after 3+ encounters.
  resistances?: Record<string, number>;
  // ── Elemental weaknesses (Void / Chromatic / Echo / Ember) ───────────────
  // Maps skill-tree element → FORGET damage multiplier.
  // 0 = immune, 0.5 = resistant, 1 = normal (default), 2 = weak.
  // Only applied to FORGET attacks when player's dominant skill path matches.
  // Revealed in the Bestiary after 3+ encounters.
  elementalWeakness?: Record<'void' | 'chromatic' | 'echo' | 'ember', number>;
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
  // ── Passive skill cooldowns (turns remaining) ──────────────────────────────
  skillCooldowns: Record<string, number>;
  // ── Visual hit flash (frames remaining) ───────────────────────────────────
  enemyHitFlash?: number;
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
    equipment: {
      weapon: string | null; armor: string | null; offhand: string | null;
      helmet: string | null; gloves: string | null; pants: string | null;
      boots: string | null; cloak: string | null; necklace: string | null;
      ring1: string | null; ring2: string | null; belt: string | null;
      trinket: string | null;
    };
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
  inventoryPage: number;        // 0 = equipment panel, 1 = all items
  equipPanelCursor: number;     // selected slot index (0-13) in the equipment panel
  equipSlotMenu: { slotId: string; menuIndex: number; mode: 'actions' | 'pick' } | null;
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
  // Crafting Table (item/gear crafting, ITEM_CRAFT mode)
  itemCraft: { categoryIdx: number; cursorIndex: number; };
  achievementsScroll: number;
  challengeSelectState: { tierCursor: number; poolCursor: number; };
  /** Active challenge attempt: tracks which tier and wave we're currently running. */
  challengeAttempt: {
    tierName: string;
    wave: number;          // next wave index to fight (0-based); equals totalWaves when all done
    waveLaunched: boolean; // true once keeper sent the pendingEncounter for this wave
    startFrame: number;
  } | null;
  /** Snapshot of player state taken the moment a challenge begins. Restored on Return or death. */
  challengeSnapshot: {
    player: {
      x: number; y: number; targetX: number; targetY: number;
      hp: number; maxHp: number; echoes: number;
      inventory: string[]; enchantedSlots: (string | null)[];
      equipment: {
        weapon: string | null; armor: string | null; offhand: string | null;
        helmet: string | null; gloves: string | null; pants: string | null;
        boots: string | null; cloak: string | null; necklace: string | null;
        ring1: string | null; ring2: string | null; belt: string | null;
        trinket: string | null;
      };
      quests: Record<string, number>; questProgress: Record<string, number>;
      flags: Record<string, boolean>; invincibility: number;
      level: number; xp: number; xpToNext: number; statPoints: number;
      baseStats: { str: number; vit: number; def: number };
      appearance?: import('./npcAppearance').SpriteAppearance;
      bestiary: Record<string, number>;
      learnedSkills: string[]; skillPoints: number;
    };
    mapId: string;
  } | null;
  /** Result shown after beating a challenge. Cleared when player dismisses the modal. */
  challengeResult: { timeSeconds: number; itemId: string; tierName: string; isDuplicate: boolean } | null;
  /** Cursor in the CHALLENGE_RESULT modal: 0=Rerun, 1=Return */
  challengeResultMenuIndex: number;
  extrasState: { menuIndex: number; subScreen: 'menu' | 'codex'; codexScroll: number; };
  // Accumulated play-time in seconds (incremented each frame, serialized to save slot).
  playTimeSeconds: number;
  // Step index for the END_LEGACY_SEQ mode: 0=message, 1=playtime, 2=erase-confirm.
  endLegacyStep: number;
  // Set by engine when the player confirms slot erasure; Game.tsx calls onDeleteLegacy.
  deleteSlotRequested: boolean;
  // Set by engine when the player chooses "New Game+" on the true-ending screen.
  // Game.tsx watches this and calls onNewGamePlus.
  ngPlusRequested: boolean;
  // New Game+ metadata: set when starting a NG+ run, persisted in the save slot.
  ngPlus?: { difficulty: 'normal' | 'challenger' | 'void'; generation: number };
  // Tracks how the most recent battle ended — used by challenge wave logic to
  // prevent fleeing from counting as a wave clear.
  lastBattleEndType: 'DEFEATED' | 'REMEMBERED' | 'FLED' | null;
  // Header notification badges (Quest/Stats/Inventory). Transient UI state —
  // not persisted in save slots. itemsBaseline/questsBaseline are the
  // inventory length / quest-stage snapshot as of the last time the player
  // opened that screen; the badge count is however much has changed since.
  notifications: {
    itemsBaseline: number;
    questsBaseline: Record<string, number>;
  };
}
