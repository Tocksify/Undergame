import { EnemyData, GameMode, GameStateData, Item } from './types';

export const TILE_SIZE = 48;
export const BASE_MAX_HP = 20;

// ── ITEMS ──────────────────────────────────────────────────────────
export const ITEMS: Record<string, Item> = {
  // consumables
  'tonic':          { name: 'Hollow Tonic',       desc: 'Restore 5 HP',                          price: 0,   tier: 'common',    category: 'consumable' },
  'crystal':        { name: 'Memory Crystal',     desc: 'Restore 10 HP',                         price: 50,  tier: 'common',    category: 'consumable' },
  'greater_crystal':{ name: 'Greater Crystal',    desc: 'Restore 25 HP',                         price: 120, tier: 'uncommon',  category: 'consumable' },
  'ward':           { name: 'Void Ward',          desc: 'Reduce next attack 50%',                price: 80,  tier: 'uncommon',  category: 'consumable' },
  'spark':          { name: 'Thought Spark',      desc: '2x power next turn',                    price: 60,  tier: 'uncommon',  category: 'consumable' },
  'dust':           { name: 'Dream Dust',         desc: 'Skip enemy attack this turn',            price: 110, tier: 'rare',      category: 'consumable' },
  'phoenix_ash':    { name: 'Phoenix Ash',        desc: 'Fully restore HP and clear confusion',   price: 250, tier: 'epic',      category: 'consumable' },
  // key / quest items
  'stone':          { name: 'Naming Stone',       desc: 'A strange stone. Needed for naming.',    price: 30,  tier: 'common',    category: 'key' },
  'echo':           { name: 'Ancient Echo',       desc: 'A memory from the beginning.',           price: 0,   tier: 'legendary', category: 'key' },
  // weapons (atk bonus)
  'rusty_shard':    { name: 'Rusty Shard',        desc: 'A chipped blade. +1 ATK',                price: 40,  tier: 'common',    category: 'weapon', atk: 1 },
  'bone_edge':       { name: 'Bone Edge',          desc: 'Carved from something forgotten. +3 ATK', price: 150, tier: 'uncommon',  category: 'weapon', atk: 3 },
  'frost_fang':     { name: 'Frost Fang',         desc: 'Never melts. +5 ATK',                    price: 0,   tier: 'rare',      category: 'weapon', atk: 5 },
  'cinder_blade':   { name: 'Cinder Blade',       desc: 'Forged in the last true fire. +8 ATK',   price: 0,   tier: 'epic',      category: 'weapon', atk: 8 },
  'voidglass_dagger': { name: 'Voidglass Dagger', desc: 'Cut from the Nexus itself. +12 ATK',      price: 0,   tier: 'legendary', category: 'weapon', atk: 12 },
  // armor (maxHp / def bonus)
  'cloth_wrap':     { name: 'Cloth Wrap',         desc: 'Simple protection. +5 Max HP',           price: 40,  tier: 'common',    category: 'armor', maxHp: 5 },
  'traveler_cloak': { name: "Traveler's Cloak",   desc: '+10 Max HP, +1 DEF',                     price: 140, tier: 'uncommon',  category: 'armor', maxHp: 10, def: 1 },
  'archivist_ward': { name: "Archivist's Ward",   desc: '+15 Max HP, +2 DEF',                     price: 0,   tier: 'rare',      category: 'armor', maxHp: 15, def: 2 },
  'ember_plate':    { name: 'Ember Plate',        desc: '+20 Max HP, +3 DEF',                     price: 0,   tier: 'epic',      category: 'armor', maxHp: 20, def: 3 },
  'voidsteel_mail': { name: 'Voidsteel Mail',     desc: '+30 Max HP, +5 DEF',                     price: 0,   tier: 'legendary', category: 'armor', maxHp: 30, def: 5 },
};

export const TIER_COLOR: Record<string, string> = {
  common: '#909090',
  uncommon: '#c0c0c0',
  rare: '#e8e8e8',
  epic: '#ffffff',
  legendary: '#ffffff',
};

export function recomputeMaxHp(state: GameStateData) {
  const armor = state.player.equipment.armor;
  const bonus = armor && ITEMS[armor] ? ITEMS[armor].maxHp ?? 0 : 0;
  state.player.maxHp = BASE_MAX_HP + bonus;
  state.player.hp = Math.min(state.player.hp, state.player.maxHp);
}

// ── SHOPS ──────────────────────────────────────────────────────────
export const SHOPS: Record<string, { title: string; items: string[] }> = {
  'zara':          { title: "Zara's Memory Emporium",    items: ['crystal', 'ward', 'spark', 'stone', 'dust', 'rusty_shard', 'cloth_wrap'] },
  'old_thom':      { title: "Old Thom's Sunken Wares",   items: ['greater_crystal', 'ward', 'dust', 'bone_edge', 'traveler_cloak'] },
  'peddler_oren':  { title: "Oren's Frostbound Pack",    items: ['greater_crystal', 'phoenix_ash', 'spark', 'bone_edge', 'traveler_cloak'] },
  'ashen_trader':  { title: 'The Ashen Trader',          items: ['greater_crystal', 'phoenix_ash', 'ward', 'spark', 'traveler_cloak'] },
};

// ── ENEMIES ────────────────────────────────────────────────────────
export const ENEMIES: Record<string, EnemyData> = {
  'wisp': {
    id: 'wisp', name: 'Shade Wisp', hp: 12, maxHp: 12, atk: 3, color: '#aaaaaa',
    flavor: 'A wisp of lost memory, searching for its owner...',
    rememberText: 'The Shade dissolves into pale light. Its memory: a child laughing.',
    echoes: 20, acts: [
      { id: 'hum', name: 'Hum', effect: 'weaken', power: 1 },
      { id: 'listen', name: 'Listen', effect: 'confuse' },
    ]
  },
  'crawler': {
    id: 'crawler', name: 'Void Crawler', hp: 20, maxHp: 20, atk: 5, color: '#555555',
    flavor: 'The Void gave it hunger without memory of what it craved.',
    rememberText: 'You give it a name. It looks at its own claws, confused. Then it leaves.',
    echoes: 35, acts: [
      { id: 'name', name: 'Name It', effect: 'flavor', requiresItem: 'stone' },
      { id: 'observe', name: 'Observe', effect: 'flavor' },
    ]
  },
  'specter': {
    id: 'specter', name: 'Echo Specter', hp: 30, maxHp: 30, atk: 7, color: '#cccccc',
    flavor: 'An echo of someone who refused to be forgotten.',
    rememberText: 'It smiles — it just wanted someone to hear it. It was.',
    echoes: 60, acts: [
      { id: 'reflect', name: 'Echo Back', effect: 'damage', power: 5 },
      { id: 'console', name: 'Console', effect: 'resonance', power: 1 },
    ]
  },
  'archivist': {
    id: 'archivist', name: 'The Archivist', hp: 45, maxHp: 45, atk: 9, color: '#bbbbbb',
    flavor: 'It catalogs every memory it consumes, filing them away from the world forever.',
    rememberText: 'You show it the memory it was guarding — its own name. It exhales, and files itself away, at peace.',
    echoes: 80, acts: [
      { id: 'analyze', name: 'Analyze', effect: 'weaken', power: 2 },
      { id: 'plead', name: 'Plead', effect: 'resonance', power: 1 },
    ]
  },
  'archive_wisp': {
    id: 'archive_wisp', name: 'Archive Wisp', hp: 16, maxHp: 16, atk: 4, color: '#9fb8c8',
    flavor: 'A drifting fragment of a page no one ever read.',
    rememberText: 'It settles like dust, finally read. Finally rested.',
    echoes: 25, acts: [
      { id: 'skim', name: 'Skim', effect: 'flavor' },
      { id: 'catalog', name: 'Catalog', effect: 'resonance', power: 1 },
    ]
  },
  'ink_wraith': {
    id: 'ink_wraith', name: 'Ink Wraith', hp: 24, maxHp: 24, atk: 6, color: '#5c6b73',
    flavor: 'Spilled memory, given a shape it never asked for.',
    rememberText: 'The ink runs clear. Whatever it was trying to say, it finally said it.',
    echoes: 40, acts: [
      { id: 'read', name: 'Read', effect: 'damage', power: 4 },
      { id: 'blot', name: 'Blot', effect: 'confuse' },
    ]
  },
  'frost_walker': {
    id: 'frost_walker', name: 'Frost Walker', hp: 28, maxHp: 28, atk: 7, color: '#a9d6e5',
    flavor: 'It walks the Reach forever, looking for a warmth it can no longer name.',
    rememberText: 'You remember the warmth for it. Frost cracks; something underneath finally breathes.',
    echoes: 45, acts: [
      { id: 'thaw', name: 'Thaw', effect: 'weaken', power: 2 },
      { id: 'warm', name: 'Warm', effect: 'resonance', power: 1 },
    ]
  },
  'rime_hound': {
    id: 'rime_hound', name: 'Rime Hound', hp: 22, maxHp: 22, atk: 8, color: '#89c2d9',
    flavor: 'It hunts by the echo of a bark it can no longer make.',
    rememberText: 'It remembers its own name. It sits, finally still.',
    echoes: 40, acts: [
      { id: 'call', name: 'Call', effect: 'confuse' },
      { id: 'pet', name: 'Pet', effect: 'resonance', power: 1 },
    ]
  },
  'ash_hound': {
    id: 'ash_hound', name: 'Ash Hound', hp: 34, maxHp: 34, atk: 9, color: '#7a5c58',
    flavor: 'Born of the fire that took everything from someone, once.',
    rememberText: 'The ash settles. Somewhere, a fire that should have gone out finally does.',
    echoes: 55, acts: [
      { id: 'douse', name: 'Douse', effect: 'weaken', power: 2 },
      { id: 'calm', name: 'Calm', effect: 'resonance', power: 1 },
    ]
  },
  'cinder_wraith': {
    id: 'cinder_wraith', name: 'Cinder Wraith', hp: 38, maxHp: 38, atk: 10, color: '#c1440e',
    flavor: 'It burns with a grief it can no longer explain.',
    rememberText: 'The embers cool. What it was grieving finally has a name again.',
    echoes: 60, acts: [
      { id: 'quench', name: 'Quench', effect: 'damage', power: 6 },
      { id: 'ember_talk', name: 'Speak to the Ember', effect: 'resonance', power: 1 },
    ]
  },
  'void_sentinel': {
    id: 'void_sentinel', name: 'Void Sentinel', hp: 50, maxHp: 50, atk: 12, color: '#4b4b4b',
    flavor: 'It was built to guard nothing, and it has done its job perfectly.',
    rememberText: 'It stands down. Whatever it was guarding was never really lost.',
    echoes: 80, acts: [
      { id: 'override', name: 'Override', effect: 'confuse' },
      { id: 'reason', name: 'Reason', effect: 'resonance', power: 1 },
    ]
  },
  'boss': {
    id: 'boss', name: 'Memory Wraith', hp: 100, maxHp: 100, atk: 14, color: '#ffffff',
    flavor: 'The source of all forgetting. It was once the first Memory Keeper.',
    rememberText: 'You show it its own memories. Its form shudders. Then... silence. Then light.',
    echoes: 0, acts: [{ id: 'present_echo', name: 'Present Echo', effect: 'flavor', requiresItem: 'echo' }]
  }
};

// EXIT TILE CODES (single char only — split('') safe):
//   '>' = north exit
//   '<' = south exit
//   '!' = boss door / special exit
// Other tiles: T=tree(wall), W=stone wall, P=path, G=grass, H=house, V=void(encounters), M=memory-grass(safe)

// Programmatically builds a rectangular corridor map: bordered by walls,
// a single walkable lane down `laneCol`, and danger tiles filling the rest.
// Guarantees every row has exactly `width` cells (no ASCII authoring typos).
function buildCorridorMap(width: number, height: number, laneCol: number, danger: string): string[][] {
  const rows: string[][] = [];
  for (let y = 0; y < height; y++) {
    const row: string[] = [];
    for (let x = 0; x < width; x++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) row.push('W');
      else if (x === laneCol) row.push('P');
      else row.push(danger);
    }
    rows.push(row);
  }
  return rows;
}

function poke(layout: string[][], x: number, y: number, tile: string) {
  layout[y][x] = tile;
}

// ── MEMORY SANCTUM north exit (unlocked once the Archivist is defeated) ──
const msLayout: string[][] = [
  "WWWWWWWWWWWWWWW",
  "WWWWWWWPWWWWWWW",
  "WWWWWWWPWWWWWWW",
  "WWWWWWWPWWWWWWW",
  "WWWWWWWPWWWWWWW",
  "WWWWWWWPWWWWWWW",
  "WWWWWWWPWWWWWWW",
  "WWWWWWWPWWWWWWW",
  "WWWWWWWPWWWWWWW",
  "WWWWWWWPWWWWWWW",
  "WWWWWWWPWWWWWWW",
  "WWWWWWW<WWWWWWW",
].map(r => r.split(''));
poke(msLayout, 7, 0, '>');

// ── SUNKEN ARCHIVE (15 x 12) ───────────────────────────────────────
const saLayout = buildCorridorMap(15, 12, 7, 'V');
poke(saLayout, 7, 0, '>'); poke(saLayout, 7, 11, '<');
poke(saLayout, 8, 2, 'P'); poke(saLayout, 8, 5, 'P'); poke(saLayout, 8, 8, 'P');
for (let x = 3; x <= 11; x++) poke(saLayout, x, 6, x === 7 ? 'P' : 'M');

// ── FROSTBOUND REACH (15 x 12) ─────────────────────────────────────
const frLayout = buildCorridorMap(15, 12, 7, 'V');
poke(frLayout, 7, 0, '>'); poke(frLayout, 7, 11, '<');
poke(frLayout, 8, 2, 'P'); poke(frLayout, 8, 5, 'P'); poke(frLayout, 8, 8, 'P');
for (let x = 3; x <= 11; x++) poke(frLayout, x, 6, x === 7 ? 'P' : 'M');

// ── ASHEN DESCENT (15 x 12) ─────────────────────────────────────────
const adLayout = buildCorridorMap(15, 12, 7, 'V');
poke(adLayout, 7, 0, '>'); poke(adLayout, 7, 11, '<');
poke(adLayout, 8, 2, 'P'); poke(adLayout, 8, 5, 'P'); poke(adLayout, 8, 8, 'P');
for (let x = 3; x <= 11; x++) poke(adLayout, x, 6, x === 7 ? 'P' : 'M');

// ── VOID NEXUS (15 x 12) — final area, no exit beyond the boss ──────
const vnLayout = buildCorridorMap(15, 12, 7, 'V');
poke(vnLayout, 7, 11, '<');
for (let x = 3; x <= 11; x++) poke(vnLayout, x, 6, x === 7 ? 'P' : 'M');

export const MAPS: Record<string, any> = {
  // ── VERDANT HOLLOW (20 × 15) ──────────────────────────────────────
  'VH': {
    id: 'VH', name: 'Verdant Hollow', width: 20, height: 15,
    layout: [
      "TTTTTTTT>TTTTTTTTTTT",
      "TTTTTTTTPTTTTTTTTTTT",
      "TTTTTTTTPTTTTTTTTTTT",
      "TTTTPPPPPTTTTTTTTTTT",
      "TTTTPPPPPTTTTTTTTTTT",
      "TTPPPPPPPTTTTTTTTTTTT",
      "TTPPPPPPPTTTTTTTTTTTT",
      "TTPPPPPPPTTTTTTTTTTTT",
      "TTTTPPPPPTTTTTTTTTTT",
      "TTTTTTTTPTTTTTTTTTTT",
      "TTTTTTTTPTTTTTTTTTTT",
      "TTTTTTTTPTTTTTTTTTTT",
      "TTTTTTTTPTTTTTTTTTTT",
      "TTTTTTTTPTTTTTTTTTTT",
      "TTTTTTTT<TTTTTTTTTTT",
    ].map(r => r.split('')),
    npcs: [
      { id: 'gregor', x: 9,  y: 1,  color: '#888888', name: 'Gregor',     type: 'HEAL' },
      { id: 'maren',  x: 9,  y: 3,  color: '#999999', name: 'Elder Maren',type: 'TALK' },
      { id: 'pip',    x: 9,  y: 6,  color: '#bbbbbb', name: 'Pip',        type: 'TALK' },
      { id: 'zara',   x: 9,  y: 8,  color: '#dddddd', name: 'Zara',       type: 'SHOP' },
      { id: 'hollow', x: 7,  y: 12, color: '#eeeeee', name: 'A Hollow',   type: 'TALK' },
    ],
    chests: [
      { id: 'ch_vh1', flag: 'ch_vh1', x: 9, y: 11, item: 'echoes_30' },
    ],
    encounterPool: [],
    exits: {
      '>': { mapId: 'WW', x: 8, y: 13 },
      '<': { mapId: 'VH', x: 8, y: 13, locked: true, lockMsg: "Void energy seals the south road." }
    }
  },

  // ── WHISPERING WASTES (20 × 15) ───────────────────────────────────
  'WW': {
    id: 'WW', name: 'Whispering Wastes', width: 20, height: 15,
    layout: [
      "TTTTTTTT>TTTTTTTTTTT",
      "TVVVVVVVPVVVVVVVVVVT",
      "TVVVVVVVPVVVVVVVVVVT",
      "TMMMVVVVPVVVVVVVVVVT",
      "TMMMVVVVPVVVVVVVVVVT",
      "TVVVVVVVPVVVVMMMMVVT",
      "TVVVVVVVPVVVVMMMMVVT",
      "TVVVVVVVPVVVVVVVVVVT",
      "TVVVVVVVPVVVVVVVVVVT",
      "TMMMVVVVPVVVVVVVVVVT",
      "TMMMVVVVPVVVVVVVVVVT",
      "TVVVVVVVPVVVVVVVVVVT",
      "TVVVVVVVPVVVVVVVVVVT",
      "TVVVVVVVPVVVVVVVVVVT",
      "TTTTTTTT<TTTTTTTTTTT",
    ].map(r => r.split('')),
    npcs: [],
    chests: [
      { id: 'ch_ww1', flag: 'ch_ww1', x: 1, y: 3,  item: 'spark' },
      { id: 'ch_ww2', flag: 'ch_ww2', x: 1, y: 9,  item: 'echoes_60' },
    ],
    encounterPool: ['wisp', 'crawler', 'specter'],
    exits: {
      '>': { mapId: 'MS', x: 7, y: 10, reqQuest: 'quest_main', reqState: 2, lockMsg: "The Sanctum is sealed. Restore the village first." },
      '<': { mapId: 'VH', x: 8, y: 1 }
    }
  },

  // ── MEMORY SANCTUM (15 × 12) ───────────────────────────────────────
  'MS': {
    id: 'MS', name: 'Memory Sanctum', width: 15, height: 12,
    layout: msLayout,
    npcs: [
      { id: 'archivist', x: 7, y: 2, color: '#bbbbbb', name: 'The Archivist', type: 'BOSS', hideFlag: 'defeated_archivist' }
    ],
    chests: [
      { id: 'ch_ms1', flag: 'ch_ms1', x: 8, y: 5, item: 'echo' }
    ],
    encounterPool: [],
    exits: {
      '<': { mapId: 'WW', x: 8, y: 1 },
      '>': { mapId: 'SA', x: 7, y: 10, reqQuest: 'quest_main', reqState: 3, lockMsg: "Something ancient still guards this passage." }
    }
  },

  // ── SUNKEN ARCHIVE (15 × 12) ────────────────────────────────────────
  'SA': {
    id: 'SA', name: 'Sunken Archive', width: 15, height: 12,
    layout: saLayout,
    npcs: [
      { id: 'vess',     x: 8, y: 2, color: '#aaaaaa', name: 'Old Vess', type: 'TALK' },
      { id: 'old_thom', x: 8, y: 5, color: '#c8c8c8', name: 'Old Thom', type: 'SHOP' },
    ],
    chests: [
      { id: 'ch_sa1', flag: 'ch_sa1', x: 5, y: 9, item: 'bone_edge' }
    ],
    encounterPool: ['archive_wisp', 'ink_wraith'],
    exits: {
      '<': { mapId: 'MS', x: 7, y: 10 },
      '>': { mapId: 'FR', x: 7, y: 10, reqQuest: 'quest_main', reqState: 4, lockMsg: "Old Vess hasn't opened this way yet." }
    }
  },

  // ── FROSTBOUND REACH (15 × 12) ──────────────────────────────────────
  'FR': {
    id: 'FR', name: 'Frostbound Reach', width: 15, height: 12,
    layout: frLayout,
    npcs: [
      { id: 'warden_kess',       x: 8, y: 2, color: '#cfe8ff', name: 'Warden Kess',        type: 'TALK' },
      { id: 'peddler_oren',      x: 8, y: 5, color: '#e8f4ff', name: 'Peddler Oren',       type: 'SHOP' },
      { id: 'shivering_villager',x: 8, y: 8, color: '#bcd8ea', name: 'A Shivering Villager',type: 'TALK' },
    ],
    chests: [
      { id: 'ch_fr1', flag: 'ch_fr1', x: 5, y: 9, item: 'traveler_cloak' }
    ],
    encounterPool: ['frost_walker', 'rime_hound'],
    exits: {
      '<': { mapId: 'SA', x: 7, y: 10 },
      '>': { mapId: 'AD', x: 7, y: 10, reqQuest: 'quest_main', reqState: 5, lockMsg: "Warden Kess hasn't opened this road yet." }
    }
  },

  // ── ASHEN DESCENT (15 × 12) ──────────────────────────────────────────
  'AD': {
    id: 'AD', name: 'Ashen Descent', width: 15, height: 12,
    layout: adLayout,
    npcs: [
      { id: 'ember_sentinel', x: 8, y: 2, color: '#ff9966', name: 'Ember Sentinel', type: 'TALK' },
      { id: 'ashen_trader',   x: 8, y: 5, color: '#ffb380', name: 'The Ashen Trader', type: 'SHOP' },
      { id: 'burned_scholar', x: 8, y: 8, color: '#d98c6b', name: 'A Burned Scholar', type: 'TALK' },
    ],
    chests: [
      { id: 'ch_ad1', flag: 'ch_ad1', x: 5, y: 9, item: 'ember_plate' }
    ],
    encounterPool: ['ash_hound', 'cinder_wraith'],
    exits: {
      '<': { mapId: 'FR', x: 7, y: 10 },
      '>': { mapId: 'VN', x: 7, y: 10, reqQuest: 'quest_main', reqState: 6, lockMsg: "The Ember Sentinel hasn't opened the Nexus road yet." }
    }
  },

  // ── VOID NEXUS (15 × 12) — final area ───────────────────────────────
  'VN': {
    id: 'VN', name: 'Void Nexus', width: 15, height: 12,
    layout: vnLayout,
    npcs: [
      { id: 'boss', x: 7, y: 2, color: '#ffffff', name: 'Memory Wraith', type: 'BOSS' }
    ],
    chests: [
      { id: 'ch_vn1', flag: 'ch_vn1', x: 4, y: 4, item: 'voidglass_dagger' },
      { id: 'ch_vn2', flag: 'ch_vn2', x: 10, y: 8, item: 'voidsteel_mail' },
    ],
    encounterPool: ['void_sentinel'],
    exits: {
      '<': { mapId: 'AD', x: 7, y: 10 }
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
    equipment: { weapon: null, armor: null },
    quests: {
      'quest_main': 0, 'quest_name': 0, 'quest_hollow': 0,
      'quest_archive': 0, 'quest_frost': 0, 'quest_ash': 0,
    },
    questProgress: {
      'shards': 0, 'specters': 0, 'archive_kills': 0, 'frost_kills': 0, 'ash_kills': 0,
    },
    flags: {},
    invincibility: 0
  },
  camera: { x: 0, y: 0 },
  adjacentInteractable: null,
  dialogue: { currentNode: null, charIndex: 0, timer: 0, selectedOption: 0 },
  battle: null,
  menuIndex: 0, shopIndex: 0, shopNpcId: null, inventoryIndex: 0,
  keys: {}, prevKeys: {},
  frameCount: 0,
  uiMessage: null, uiMessageTimer: 0,
  pendingEncounter: null,
  saveRequested: false,
  exitRequested: false,
  meta: { isGuest: true },
};
