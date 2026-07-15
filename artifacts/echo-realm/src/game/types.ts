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
  BOOK_READ,    // 10 - reading a collected book
  ENCHANT_SELECT, // 11 - picking an item to enchant
  TOME_CRAFT,   // 12 - Tomes Blessing: choosing an enchantment to create from an empty book
  TELEPORT      // 13 - N key: memory transit map selection
}

export type TileType = 'G' | 'S' | 'W' | 'P' | 'T' | 'V' | 'M' | 'H' | 'D' | 'ST' | 'E_N' | 'E_S' | 'B_D' | 'CHEST';

export type ItemTier = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type ItemCategory = 'consumable' | 'weapon' | 'armor' | 'key' | 'book' | 'enchanted_book' | 'relic';
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
  bookId?: string; // references BOOKS registry
  enchantData?: {
    compatibleCategories: ('weapon' | 'armor')[];
    atk?: number;
    def?: number;
    maxHp?: number;
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
    equipment: { weapon: string | null; armor: string | null };
    quests: Record<string, number>;
    questProgress: Record<string, number>;
    flags: Record<string, boolean>;
    invincibility: number;
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
}
