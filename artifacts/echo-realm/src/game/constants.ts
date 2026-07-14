import { EnemyData, GameMode, GameStateData, TileType } from './types';

export const TILE_SIZE = 48;

export const ITEMS: Record<string, { name: string; desc: string; price: number }> = {
  'crystal': { name: 'Memory Crystal', desc: 'Restore 10 HP', price: 50 },
  'ward':    { name: 'Void Ward',       desc: 'Reduce next attack 50%', price: 80 },
  'spark':   { name: 'Thought Spark',   desc: '2x power next turn', price: 60 },
  'stone':   { name: 'Naming Stone',    desc: 'A strange stone. Needed for naming.', price: 30 },
  'dust':    { name: 'Dream Dust',      desc: 'Skip enemy attack this turn', price: 40 },
  'echo':    { name: 'Ancient Echo',    desc: 'A memory from the beginning.', price: 999 },
  'tonic':   { name: 'Hollow Tonic',    desc: 'Restore 5 HP', price: 0 },
};

export const ENEMIES: Record<string, EnemyData> = {
  'wisp': {
    id: 'wisp', name: 'Shade Wisp', hp: 12, maxHp: 12, atk: 3, color: '#aaaaaa',
    flavor: 'A wisp of lost memory, searching for its owner...',
    rememberText: 'The Shade dissolves into pale light. Its memory: a child laughing.',
    echoes: 20, acts: [{ id: 'hum', name: 'Hum' }, { id: 'listen', name: 'Listen' }]
  },
  'crawler': {
    id: 'crawler', name: 'Void Crawler', hp: 20, maxHp: 20, atk: 5, color: '#555555',
    flavor: 'The Void gave it hunger without memory of what it craved.',
    rememberText: 'You give it a name. It looks at its own claws, confused. Then it leaves.',
    echoes: 35, acts: [{ id: 'name', name: 'Name It' }, { id: 'observe', name: 'Observe' }]
  },
  'specter': {
    id: 'specter', name: 'Echo Specter', hp: 30, maxHp: 30, atk: 7, color: '#cccccc',
    flavor: 'An echo of someone who refused to be forgotten.',
    rememberText: 'It smiles — it just wanted someone to hear it. It was.',
    echoes: 60, acts: [{ id: 'reflect', name: 'Echo Back' }, { id: 'console', name: 'Console' }]
  },
  'boss': {
    id: 'boss', name: 'Memory Wraith', hp: 80, maxHp: 80, atk: 12, color: '#ffffff',
    flavor: 'The source of all forgetting. It was once the first Memory Keeper.',
    rememberText: 'You show it its own memories. Its form shudders. Then... silence. Then light.',
    echoes: 0, acts: [{ id: 'present_echo', name: 'Present Echo' }]
  }
};

// EXIT TILE CODES (single char only — split('') safe):
//   '>' = north exit
//   '<' = south exit
//   '!' = boss door / special exit
// Other tiles: T=tree(wall), W=stone wall, P=path, G=grass, H=house, V=void(encounters), M=memory-grass(safe)

export const MAPS: Record<string, any> = {
  // ── VERDANT HOLLOW (20 × 15) ──────────────────────────────────────
  // Player spawns at tile (8, 10). Path runs col 8, branches cols 4-8 in rows 3-8.
  // North exit '>' at (8,0) → WW (8,13). South exit '<' at (8,14) → locked.
  'VH': {
    id: 'VH', name: 'Verdant Hollow', width: 20, height: 15,
    layout: [
      "TTTTTTTT>TTTTTTTTTTT", // 0  8T+>+11T=20  north exit col 8
      "TTTTTTTTPTTTTTTTTTTT", // 1  path col 8
      "TTTTTTTTPTTTTTTTTTTT", // 2  path col 8
      "TTTTPPPPPTTTTTTTTTTT", // 3  branch cols 4-8 (4T+5P+11T=20)
      "TTTTPPPPPTTTTTTTTTTT", // 4  branch cols 4-8
      "TTPPPPPPPTTTTTTTTTTTT",// 5  wide  cols 2-8 (2T+7P+11T=20)
      "TTPPPPPPPTTTTTTTTTTTT",// 6  wide  cols 2-8
      "TTPPPPPPPTTTTTTTTTTTT",// 7  wide  cols 2-8
      "TTTTPPPPPTTTTTTTTTTT", // 8  branch cols 4-8
      "TTTTTTTTPTTTTTTTTTTT", // 9  path col 8
      "TTTTTTTTPTTTTTTTTTTT", // 10 player spawn
      "TTTTTTTTPTTTTTTTTTTT", // 11
      "TTTTTTTTPTTTTTTTTTTT", // 12
      "TTTTTTTTPTTTTTTTTTTT", // 13
      "TTTTTTTT<TTTTTTTTTTT", // 14 south exit col 8 (locked)
    ].map(r => r.split('')),
    npcs: [
      // adjacent to path → player can interact from col 8
      { id: 'gregor', x: 9,  y: 1,  color: '#888888', name: 'Gregor',     type: 'HEAL' },
      { id: 'maren',  x: 9,  y: 3,  color: '#999999', name: 'Elder Maren',type: 'TALK' },
      { id: 'pip',    x: 9,  y: 6,  color: '#bbbbbb', name: 'Pip',        type: 'TALK' },
      { id: 'zara',   x: 9,  y: 8,  color: '#dddddd', name: 'Zara',       type: 'SHOP' },
      { id: 'hollow', x: 7,  y: 12, color: '#eeeeee', name: 'A Hollow',   type: 'TALK' },
    ],
    chests: [
      { id: 'ch_vh1', flag: 'ch_vh1', x: 9, y: 11, item: 'echoes_30' },
    ],
    exits: {
      '>': { mapId: 'WW', x: 8, y: 13 },
      '<': { mapId: 'VH', x: 8, y: 13, locked: true, lockMsg: "Void energy seals the south road." }
    }
  },

  // ── WHISPERING WASTES (20 × 15) ───────────────────────────────────
  // Player arrives at (8, 13). South exit '<' at (8,14) → VH (8,1).
  // North exit '>' at (8,0) → MS (7,10), gated by main quest stage 2.
  'WW': {
    id: 'WW', name: 'Whispering Wastes', width: 20, height: 15,
    layout: [
      "TTTTTTTT>TTTTTTTTTTT", // 0  north exit → MS
      "TVVVVVVVPVVVVVVVVVVT", // 1  T+7V+P+10V+T=20
      "TVVVVVVVPVVVVVVVVVVT", // 2
      "TMMMVVVVPVVVVVVVVVVT", // 3  T+3M+4V+P+10V+T=20
      "TMMMVVVVPVVVVVVVVVVT", // 4
      "TVVVVVVVPVVVVMMMMVVT", // 5  T+7V+P+4V+4M+2V+T=20
      "TVVVVVVVPVVVVMMMMVVT", // 6
      "TVVVVVVVPVVVVVVVVVVT", // 7
      "TVVVVVVVPVVVVVVVVVVT", // 8
      "TMMMVVVVPVVVVVVVVVVT", // 9
      "TMMMVVVVPVVVVVVVVVVT", // 10
      "TVVVVVVVPVVVVVVVVVVT", // 11
      "TVVVVVVVPVVVVVVVVVVT", // 12
      "TVVVVVVVPVVVVVVVVVVT", // 13  player arrives here from VH
      "TTTTTTTT<TTTTTTTTTTT", // 14  south exit → VH
    ].map(r => r.split('')),
    npcs: [],
    chests: [
      { id: 'ch_ww1', flag: 'ch_ww1', x: 1, y: 3,  item: 'spark' },
      { id: 'ch_ww2', flag: 'ch_ww2', x: 1, y: 9,  item: 'echoes_60' },
    ],
    exits: {
      '>': { mapId: 'MS', x: 7, y: 10, reqQuest: 'quest_main', reqState: 2, lockMsg: "The Sanctum is sealed. Restore the village first." },
      '<': { mapId: 'VH', x: 8, y: 1 }
    }
  },

  // ── MEMORY SANCTUM (15 × 12) ──────────────────────────────────────
  // Player arrives at (7, 10). South exit '<' at (7,11) → WW (8,1).
  // Boss NPC at (7,2). Chest at (8,5).
  'MS': {
    id: 'MS', name: 'Memory Sanctum', width: 15, height: 12,
    layout: [
      "WWWWWWWWWWWWWWW", // 0  15W=15
      "WWWWWWWPWWWWWWW", // 1  7W+P+7W=15
      "WWWWWWWPWWWWWWW", // 2  boss NPC here (NPC blocks tile)
      "WWWWWWWPWWWWWWW", // 3
      "WWWWWWWPWWWWWWW", // 4
      "WWWWWWWPWWWWWWW", // 5  chest at (8,5)
      "WWWWWWWPWWWWWWW", // 6
      "WWWWWWWPWWWWWWW", // 7
      "WWWWWWWPWWWWWWW", // 8
      "WWWWWWWPWWWWWWW", // 9
      "WWWWWWWPWWWWWWW", // 10 player arrives
      "WWWWWWW<WWWWWWW", // 11 south exit → WW
    ].map(r => r.split('')),
    npcs: [
      { id: 'boss', x: 7, y: 2, color: '#ffffff', name: 'Memory Wraith', type: 'BOSS' }
    ],
    chests: [
      { id: 'ch_ms1', flag: 'ch_ms1', x: 8, y: 5, item: 'echo' }
    ],
    exits: {
      '<': { mapId: 'WW', x: 8, y: 1 }
    }
  }
};

export const INITIAL_STATE: GameStateData = {
  mode: GameMode.TITLE,
  mapId: 'VH',
  player: {
    x: 8 * TILE_SIZE,
    y: 10 * TILE_SIZE,
    targetX: 8 * TILE_SIZE,
    targetY: 10 * TILE_SIZE,
    hp: 20, maxHp: 20,
    echoes: 0,
    inventory: [],
    quests: { 'quest_main': 0, 'quest_name': 0, 'quest_hollow': 0 },
    questProgress: { 'shards': 0, 'specters': 0 },
    flags: {},
    invincibility: 0
  },
  camera: { x: 0, y: 0 },
  adjacentInteractable: null,
  dialogue: { currentNode: null, charIndex: 0, timer: 0, selectedOption: 0 },
  battle: null,
  menuIndex: 0, shopIndex: 0, inventoryIndex: 0,
  keys: {}, prevKeys: {},
  frameCount: 0,
  uiMessage: null, uiMessageTimer: 0,
  pendingEncounter: null
};
