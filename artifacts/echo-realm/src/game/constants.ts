import { EnemyData, GameMode, GameStateData, TileType } from './types';

export const ITEMS: Record<string, { name: string; desc: string; price: number }> = {
  'crystal': { name: 'Memory Crystal', desc: 'Restore 10 HP', price: 50 },
  'ward': { name: 'Void Ward', desc: 'Reduce next attack by 50%', price: 80 },
  'spark': { name: 'Thought Spark', desc: '2x Resonance/Damage next turn', price: 60 },
  'stone': { name: 'Naming Stone', desc: 'A strange stone. Needed for naming.', price: 30 },
  'dust': { name: 'Dream Dust', desc: 'Confuse enemy (skip their attack)', price: 40 },
  'echo': { name: 'Ancient Echo', desc: 'A memory from the beginning. Radiates power.', price: 999 },
  'tonic': { name: 'Hollow Tonic', desc: 'Restore 5 HP', price: 0 },
};

export const ENEMIES: Record<string, EnemyData> = {
  'wisp': {
    id: 'wisp', name: 'Shade Wisp', hp: 12, maxHp: 12, atk: 3, color: 'rgba(168,85,247,0.7)',
    flavor: 'A wisp of lost memory, searching for its owner...',
    rememberText: 'The Shade dissolves into golden light, its memory restored.',
    echoes: 20,
    acts: [{ id: 'hum', name: 'Hum' }, { id: 'listen', name: 'Listen' }]
  },
  'crawler': {
    id: 'crawler', name: 'Void Crawler', hp: 20, maxHp: 20, atk: 5, color: '#1f2937',
    flavor: 'The Void has given it hunger without memory of what it craved.',
    rememberText: 'With a name, it remembers itself. It scurries off peacefully.',
    echoes: 35,
    acts: [{ id: 'name', name: 'Name It' }, { id: 'observe', name: 'Observe' }]
  },
  'specter': {
    id: 'specter', name: 'Echo Specter', hp: 30, maxHp: 30, atk: 7, color: '#38bdf8',
    flavor: 'An echo of someone who refused to be forgotten.',
    rememberText: 'It smiles — it just wanted someone to hear it.',
    echoes: 60,
    acts: [{ id: 'reflect', name: 'Echo Back' }, { id: 'console', name: 'Console' }]
  },
  'boss': {
    id: 'boss', name: 'Memory Wraith', hp: 80, maxHp: 80, atk: 12, color: '#000000',
    flavor: 'The source of all forgetting. It was once the first Memory Keeper.',
    rememberText: 'You show it its own memories. It weeps and dissolves into light.',
    echoes: 0,
    acts: [{ id: 'present_echo', name: 'Present Echo' }]
  }
};

export const MAPS: Record<string, any> = {
  'VH': {
    id: 'VH',
    name: 'Verdant Hollow',
    width: 20,
    height: 15,
    layout: [
      "TTTTE_NTTTTTTTTTTTTT",
      "TTTTPPTTTTTTTTTTTTTT",
      "TTWTPPTTTTHHHTTTTTTT",
      "TTWTPPPPPPHHHTWTTTTT",
      "TTWTPPGGPPHHHTWTTTTT",
      "TTWTPPGGPPPPPTWTTTTT",
      "TTWTPPGGPPPPPTWTTTTT",
      "TTWTPPGGPPPPPTWTTTTT",
      "TTWTPPGGPPPPPTWTTTTT",
      "TTWTPPPPPPPPTTWTTTTT",
      "TTWTTTTTPPTTTTWTTTTT",
      "TTTTTTTTPPTTTTTTTTTT",
      "TTTTTTTTPPTTTTTTTTTT",
      "TTTTTTTTPPTTTTTTTTTT",
      "TTTTTTTTE_STTTTTTTTT",
    ].map(r => r.split('')),
    npcs: [
      { id: 'maren', x: 8, y: 5, color: '#3b82f6', name: 'Elder Maren', type: 'TALK' },
      { id: 'pip', x: 10, y: 8, color: '#eab308', name: 'Pip', type: 'TALK' },
      { id: 'zara', x: 14, y: 4, color: '#d946ef', name: 'Zara', type: 'SHOP' },
      { id: 'gregor', x: 5, y: 8, color: '#9ca3af', name: 'Gregor', type: 'HEAL' },
      { id: 'hollow', x: 7, y: 11, color: '#f3f4f6', name: 'A Hollow', type: 'TALK' },
    ],
    chests: [
      { id: 'chest_vh_1', flag: 'chest_vh_1', x: 3, y: 11, item: 'echoes_30' }
    ],
    exits: {
      'E_N': { mapId: 'WW', x: 5, y: 13 },
      'E_S': { mapId: 'VH', x: 8, y: 13, locked: true, lockMsg: "The way south is sealed by Void energy." }
    }
  },
  'WW': {
    id: 'WW',
    name: 'Whispering Wastes',
    width: 20,
    height: 15,
    layout: [
      "WWWWWWB_DWWWWWWWWWWW",
      "WWWWWWPPTWWWWWWWWWWW",
      "WVVVVVPPTVVVVVVVVWWW",
      "WVMVVVVPTVVVVVMMVVWW",
      "WVVVVVVPVVVVVVVVVVWW",
      "WVVVVVVPVVVVVVVVVVWW",
      "WMMVVVVPPPVVVVVVVVWW",
      "WVVVVVVPVPVVVVVVVVWW",
      "WVVVVVVMMMVVVVVVVVWW",
      "WVVVVVVVVVVVVVMMVVWW",
      "WVVVVVVVVVVVVVVVVVWW",
      "WVVVVVVVVVVVVVVVVVWW",
      "WVVVVVPPTVVVVVVVVVWW",
      "WWWWWWPPTWWWWWWWWWWW",
      "WWWWWWE_SWWWWWWWWWWW",
    ].map(r => r.split('')),
    npcs: [],
    chests: [
      { id: 'chest_ww_1', flag: 'chest_ww_1', x: 2, y: 4, item: 'spark' },
      { id: 'chest_ww_2', flag: 'chest_ww_2', x: 17, y: 8, item: 'echoes_60' }
    ],
    exits: {
      'E_S': { mapId: 'VH', x: 5, y: 1 },
      'B_D': { mapId: 'MS', x: 7, y: 10, reqQuest: 'quest_main', reqState: 2, lockMsg: "The Sanctum is locked until the village is safe." }
    }
  },
  'MS': {
    id: 'MS',
    name: 'Memory Sanctum',
    width: 15,
    height: 12,
    layout: [
      "WWWWWWWWWWWWWWW",
      "WWWWWWPWWWWWWWW",
      "WWWWWWPWWWWWWWW",
      "WWWWWWPWWWWWWWW",
      "WWWWWWPWWWWWWWW",
      "WWWWWWPWWWWWWWW",
      "WWWWWWPWWWWWWWW",
      "WWWWWWPWWWWWWWW",
      "WWWWWWPWWWWWWWW",
      "WWWWWWPWWWWWWWW",
      "WWWWWWE_SWWWWWW",
      "WWWWWWWWWWWWWWW",
    ].map(r => r.split('')),
    npcs: [
      { id: 'boss', x: 6, y: 2, color: '#000000', name: 'Memory Wraith', type: 'BOSS' }
    ],
    chests: [
      { id: 'chest_ms_1', flag: 'chest_ms_1', x: 8, y: 5, item: 'echo' }
    ],
    exits: {
      'E_S': { mapId: 'WW', x: 6, y: 1 }
    }
  }
};

export const INITIAL_STATE: GameStateData = {
  mode: GameMode.TITLE,
  mapId: 'VH',
  player: {
    x: 8 * 48,
    y: 12 * 48,
    targetX: 8 * 48,
    targetY: 12 * 48,
    hp: 20,
    maxHp: 20,
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
  menuIndex: 0,
  shopIndex: 0,
  inventoryIndex: 0,
  keys: {},
  prevKeys: {},
  frameCount: 0,
  uiMessage: null,
  uiMessageTimer: 0,
  pendingEncounter: null
};