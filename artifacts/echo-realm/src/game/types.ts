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
  VICTORY
}

export type TileType = 'G' | 'S' | 'W' | 'P' | 'T' | 'V' | 'M' | 'H' | 'E_N' | 'E_S' | 'B_D' | 'CHEST';

export interface DialogueNode {
  text: string;
  speaker: string;
  color?: string;
  options?: { label: string; nextId?: string; action?: (state: GameStateData) => void }[];
  nextId?: string;
  action?: (state: GameStateData) => void;
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
  acts: { id: string; name: string }[];
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
    quests: Record<string, number>; // 0: inactive, 1: active, 2: complete
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
  inventoryIndex: number;
  keys: Record<string, boolean>;
  prevKeys: Record<string, boolean>;
  frameCount: number;
  uiMessage: string | null;
  uiMessageTimer: number;
  pendingEncounter: EnemyData | null;
}
