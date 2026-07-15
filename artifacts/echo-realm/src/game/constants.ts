import { BookData, EnemyData, GameMode, GameStateData, Item } from './types';

export const TILE_SIZE = 48;
export const BASE_MAX_HP = 20;

// ── BOOKS ──────────────────────────────────────────────────────────
export const BOOKS: Record<string, BookData> = {
  'book_keepers_codex': {
    title: "The Keeper's Codex",
    author: 'Unknown Scholar',
    type: 'journal',
    pages: [
      "A Memory Keeper is not one who refuses to forget — it is one who chooses what is worth remembering.\n\nThe first Keeper walked the Void before it was the Void. She carried a lantern made of her own name, and she gave pieces of it to every soul she met.",
      "To remember someone is an act of love. To be remembered is an act of grace. The Void is neither — it is simply the absence of both.\n\nDo not mistake its hunger for malice. It forgets because it was never taught how to hold on.",
      "Rule the First: Never name something you are not prepared to carry.\nRule the Second: A memory held too tightly becomes a cage.\nRule the Third: The things that hurt most are the things that mattered most.\n\nThis is not a warning. This is a gift.",
    ],
  },
  'book_childs_letter': {
    title: 'A Child\'s Letter',
    type: 'note',
    pages: [
      "Dear Father,\n\nI made you a picture of our house. The one with the red door. I put the dog in it too even though he is gone now because I did not want you to be lonely in the picture.\n\nMother says you are working very far away. I asked her where and she looked at the wall for a long time.\n\nI saved you the biggest piece of bread. It is under my pillow.\n\n— Mira",
      "P.S. I am being very brave.\nP.P.S. Please come home before the snow.\nP.P.P.S. The dog's name was Biscuit. In case you forgot. I did not want you to forget.\n\n(The letter has been folded and unfolded so many times the creases are soft as cloth.)",
    ],
  },
  'book_forgotten_verse': {
    title: 'Verses of the Forgotten',
    author: 'Anon.',
    type: 'poem',
    pages: [
      "I.\nI asked the Void what it had eaten.\nIt showed me a Tuesday in March.\nThe smell of rain on stone.\nSomeone laughing in another room.\n\nSmall things. The Void has very small teeth.",
      "II.\nMy grandmother's hands.\nThe specific weight of afternoon light.\nThe name of the street where I grew up.\nThe sound of it when you said it.\n\nThe Void is very patient.\nIt knows we cannot hold everything.\nIt simply waits for us to drop things.",
      "III.\nBut here is what the Void does not know:\nSome things leave a shape even after they are gone.\nA dent in a pillow.\nA path worn in grass.\nA name that still sounds like a door\nsomeone will open.",
    ],
  },
  'book_cipher_note': {
    title: 'A Strange Cipher',
    type: 'cipher',
    pages: [
      "The note is dense with symbols — not quite a language, but close. You can make out a few words in the margins:\n\n'...the third hollow, north of the dry well...'\n'...three lanterns, and you will see the door...'\n'...it was never lost. it was hidden. there is a difference...'\n\nThe rest is encoded in a system you don't recognize.",
      "At the bottom of the page, in a different hand — shakier, older — someone has written:\n\n'I spent twenty years decoding this. I found the door. I left it closed.\nSome doors are locked for the same reason a wound is bandaged:\nnot to trap what's inside, but to let it heal.\n\nLeave it closed.'\n\n(A small dried flower is pressed into the fold. You don't know its name, but it smells like somewhere you've been.)",
    ],
  },
  'book_merchants_ledger': {
    title: "Aldric's Private Ledger",
    author: 'Aldric Fenmark',
    type: 'journal',
    pages: [
      "Day 1 in Crestfall:\nThe city is not what the maps suggested. Larger. Louder. The southern quarter smells of ash and something I cannot name. Set up shop near the third road crossing. Sold nothing.\n\nThe locals don't trust new faces. Or perhaps they don't trust faces at all anymore.",
      "Day 14:\nA boy came to my stall today. He didn't want to buy anything. He just wanted to tell me his mother used to sell bread here, on this exact corner. He stood for a while. Then he left.\n\nI haven't moved my stall since.\n\nSome places are held in trust for the people who remember them.",
      "Day 31:\nThe Void has reached the east quarter. I can hear it at night — not a sound exactly, more like the space where a sound used to be.\n\nI'm not leaving. My grandfather built this city with his hands. I will remember it into staying.",
    ],
  },
};

// ── ITEMS ──────────────────────────────────────────────────────────
export const ITEMS: Record<string, Item> = {
  // ── MEDICAL CONSUMABLES ──
  'tonic':           { name: 'Hollow Tonic',      desc: 'Restore 5 HP',                          price: 0,   tier: 'common',    category: 'consumable', subcategory: 'medical' },
  'crystal':         { name: 'Memory Crystal',    desc: 'Restore 10 HP',                         price: 50,  tier: 'common',    category: 'consumable', subcategory: 'medical' },
  'greater_crystal': { name: 'Greater Crystal',   desc: 'Restore 25 HP',                         price: 120, tier: 'uncommon',  category: 'consumable', subcategory: 'medical' },
  'phoenix_ash':     { name: 'Phoenix Ash',       desc: 'Fully restore HP and clear confusion',   price: 250, tier: 'epic',      category: 'consumable', subcategory: 'medical' },

  // ── DEF CONSUMABLES ──
  'ward':            { name: 'Void Ward',         desc: 'Reduce next attack by 50%',             price: 80,  tier: 'uncommon',  category: 'consumable', subcategory: 'def' },

  // ── UTILITY CONSUMABLES ──
  'spark':           { name: 'Thought Spark',     desc: '2x power next turn',                    price: 60,  tier: 'uncommon',  category: 'consumable', subcategory: 'utility' },
  'dust':            { name: 'Dream Dust',        desc: 'Skip enemy attack this turn',            price: 110, tier: 'rare',      category: 'consumable', subcategory: 'utility' },

  // ── KEY / QUEST ITEMS ──
  'stone':  { name: 'Naming Stone',  desc: 'A strange stone. Needed for naming.',  price: 30, tier: 'common',    category: 'key' },
  'echo':   { name: 'Ancient Echo',  desc: 'A memory from the beginning.',         price: 0,  tier: 'legendary', category: 'key' },

  // ── WEAPONS ──
  'rusty_shard':      { name: 'Rusty Shard',       desc: 'A chipped blade. +1 ATK',                price: 40,  tier: 'common',    category: 'weapon', atk: 1 },
  'bone_edge':        { name: 'Bone Edge',          desc: 'Carved from something forgotten. +3 ATK', price: 150, tier: 'uncommon',  category: 'weapon', atk: 3 },
  'frost_fang':       { name: 'Frost Fang',         desc: 'Never melts. +5 ATK',                    price: 0,   tier: 'rare',      category: 'weapon', atk: 5 },
  'cinder_blade':     { name: 'Cinder Blade',       desc: 'Forged in the last true fire. +8 ATK',   price: 0,   tier: 'epic',      category: 'weapon', atk: 8 },
  'voidglass_dagger': { name: 'Voidglass Dagger',   desc: 'Cut from the Nexus itself. +12 ATK',     price: 0,   tier: 'legendary', category: 'weapon', atk: 12 },

  // ── ARMOR ──
  'cloth_wrap':     { name: 'Cloth Wrap',         desc: 'Simple protection. +5 Max HP',           price: 40,  tier: 'common',    category: 'armor', maxHp: 5 },
  'traveler_cloak': { name: "Traveler's Cloak",   desc: '+10 Max HP, +1 DEF',                     price: 140, tier: 'uncommon',  category: 'armor', maxHp: 10, def: 1 },
  'archivist_ward': { name: "Archivist's Ward",   desc: '+15 Max HP, +2 DEF',                     price: 0,   tier: 'rare',      category: 'armor', maxHp: 15, def: 2 },
  'ember_plate':    { name: 'Ember Plate',        desc: '+20 Max HP, +3 DEF',                     price: 0,   tier: 'epic',      category: 'armor', maxHp: 20, def: 3 },
  'voidsteel_mail': { name: 'Voidsteel Mail',     desc: '+30 Max HP, +5 DEF',                     price: 0,   tier: 'legendary', category: 'armor', maxHp: 30, def: 5 },

  // ── READABLE BOOKS ──
  'book_keepers_codex': {
    name: "The Keeper's Codex",
    desc: 'An ancient journal about Memory Keepers.',
    price: 0, tier: 'rare', category: 'book', bookId: 'book_keepers_codex',
  },
  'book_childs_letter': {
    name: "A Child's Letter",
    desc: 'A folded note, worn soft at the edges.',
    price: 0, tier: 'common', category: 'book', bookId: 'book_childs_letter',
  },
  'book_forgotten_verse': {
    name: "Verses of the Forgotten",
    desc: 'A thin book of handwritten poems.',
    price: 0, tier: 'uncommon', category: 'book', bookId: 'book_forgotten_verse',
  },
  'book_cipher_note': {
    name: "A Strange Cipher",
    desc: 'Notes in a code you almost recognize.',
    price: 0, tier: 'uncommon', category: 'book', bookId: 'book_cipher_note',
  },
  'book_merchants_ledger': {
    name: "Aldric's Private Ledger",
    desc: 'A merchant\'s personal journal from Crestfall.',
    price: 0, tier: 'common', category: 'book', bookId: 'book_merchants_ledger',
  },

  // ── ENCHANTED BOOKS ──
  'ench_grimoire_striking': {
    name: 'Grimoire of Striking',
    desc: 'Enchants a weapon. Grants +3 ATK. Incompatible with armor.',
    price: 0, tier: 'epic', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 3 },
  },
  'ench_tome_iron_veil': {
    name: 'Tome of the Iron Veil',
    desc: 'Enchants armor. Grants +3 DEF. Incompatible with weapons.',
    price: 0, tier: 'epic', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['armor'], def: 3 },
  },
  'ench_codex_living_flame': {
    name: 'Codex of Living Flame',
    desc: 'Enchants armor. Grants +10 Max HP. Incompatible with weapons.',
    price: 0, tier: 'legendary', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['armor'], maxHp: 10 },
  },
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
  // enchantment bonus on armor
  const armorSlot = armor ? state.player.inventory.indexOf(armor) : -1;
  const enchBookId = armorSlot >= 0 ? state.player.enchantedSlots[armorSlot] : null;
  const enchBonus = enchBookId && ITEMS[enchBookId]?.enchantData?.maxHp ? ITEMS[enchBookId].enchantData!.maxHp! : 0;
  state.player.maxHp = BASE_MAX_HP + bonus + enchBonus;
  state.player.hp = Math.min(state.player.hp, state.player.maxHp);
}

export function getWeaponAtkBonus(state: GameStateData): number {
  const w = state.player.equipment.weapon;
  const base = w && ITEMS[w] ? ITEMS[w].atk ?? 0 : 0;
  const wSlot = w ? state.player.inventory.indexOf(w) : -1;
  const enchBookId = wSlot >= 0 ? state.player.enchantedSlots[wSlot] : null;
  const enchBonus = enchBookId && ITEMS[enchBookId]?.enchantData?.atk ? ITEMS[enchBookId].enchantData!.atk! : 0;
  return base + enchBonus;
}

export function getArmorDefBonus(state: GameStateData): number {
  const a = state.player.equipment.armor;
  const base = a && ITEMS[a] ? ITEMS[a].def ?? 0 : 0;
  const aSlot = a ? state.player.inventory.indexOf(a) : -1;
  const enchBookId = aSlot >= 0 ? state.player.enchantedSlots[aSlot] : null;
  const enchBonus = enchBookId && ITEMS[enchBookId]?.enchantData?.def ? ITEMS[enchBookId].enchantData!.def! : 0;
  return base + enchBonus;
}

// ── SHOPS ──────────────────────────────────────────────────────────
export const SHOPS: Record<string, { title: string; items: string[] }> = {
  'zara':         { title: "Zara's Memory Emporium",    items: ['crystal', 'ward', 'spark', 'stone', 'dust', 'rusty_shard', 'cloth_wrap'] },
  'old_thom':     { title: "Old Thom's Sunken Wares",   items: ['greater_crystal', 'ward', 'dust', 'bone_edge', 'traveler_cloak'] },
  'peddler_oren': { title: "Oren's Frostbound Pack",    items: ['greater_crystal', 'phoenix_ash', 'spark', 'bone_edge', 'traveler_cloak'] },
  'ashen_trader': { title: 'The Ashen Trader',          items: ['greater_crystal', 'phoenix_ash', 'ward', 'spark', 'traveler_cloak'] },
  'relic_broker': { title: "Crestfall Relic Broker",    items: ['crystal', 'greater_crystal', 'ward', 'spark', 'ench_grimoire_striking', 'ench_tome_iron_veil'] },
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
  // City enemies
  'city_shade': {
    id: 'city_shade', name: 'City Shade', hp: 18, maxHp: 18, atk: 5, color: '#888888',
    flavor: 'A memory of someone who used to live here, still walking their old route.',
    rememberText: 'It stops. Looks at the buildings. Recognizes them. Smiles, and fades.',
    echoes: 30, acts: [
      { id: 'wander', name: 'Wander', effect: 'flavor' },
      { id: 'recall', name: 'Recall', effect: 'resonance', power: 1 },
    ]
  },
  'street_wraith': {
    id: 'street_wraith', name: 'Street Wraith', hp: 26, maxHp: 26, atk: 7, color: '#6b7280',
    flavor: 'It paces the same alley it always paced, searching for a reason it can\'t remember.',
    rememberText: 'You give it the reason. It was love. It had always been love.',
    echoes: 45, acts: [
      { id: 'pace', name: 'Pace', effect: 'weaken', power: 1 },
      { id: 'linger', name: 'Linger', effect: 'confuse' },
    ]
  },
  'hollow_guard': {
    id: 'hollow_guard', name: 'Hollow Guard', hp: 32, maxHp: 32, atk: 8, color: '#9ca3af',
    flavor: 'It still stands at its post. It has forgotten what it was guarding.',
    rememberText: 'You show it the city — the people, the streets, the reason. It salutes. It rests.',
    echoes: 55, acts: [
      { id: 'halt', name: 'Halt', effect: 'damage', power: 4 },
      { id: 'stand_down', name: 'Stand Down', effect: 'resonance', power: 1 },
    ]
  },
  'boss': {
    id: 'boss', name: 'Memory Wraith', hp: 100, maxHp: 100, atk: 14, color: '#ffffff',
    flavor: 'The source of all forgetting. It was once the first Memory Keeper.',
    rememberText: 'You show it its own memories. Its form shudders. Then... silence. Then light.',
    echoes: 0, acts: [{ id: 'present_echo', name: 'Present Echo', effect: 'flavor', requiresItem: 'echo' }]
  }
};

// ── MAP BUILDER HELPERS ─────────────────────────────────────────────

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
  if (layout[y] && layout[y][x] !== undefined) layout[y][x] = tile;
}

// City of Crestfall (28 × 22)
function buildCityLayout(): string[][] {
  const W = 28, H = 22;
  const L: string[][] = Array.from({ length: H }, () => Array(W).fill('G'));

  // Border walls
  for (let x = 0; x < W; x++) { L[0][x] = 'W'; L[H - 1][x] = 'W'; }
  for (let y = 0; y < H; y++) { L[y][0] = 'W'; L[y][W - 1] = 'W'; }

  // Horizontal roads
  for (const ry of [3, 7, 11, 15, 19]) {
    for (let x = 1; x < W - 1; x++) L[ry][x] = 'P';
  }

  // South exit at bottom wall
  L[H - 1][13] = '<';

  // fill rect helper (never overwrite W or P)
  const fill = (sx: number, sy: number, ex: number, ey: number, t: string) => {
    for (let y = sy; y <= ey; y++) for (let x = sx; x <= ex; x++) {
      if (L[y] && L[y][x] !== undefined && L[y][x] !== 'W' && L[y][x] !== 'P') L[y][x] = t;
    }
  };

  // y=1-2: top house row
  fill(1, 1, 5, 2, 'H');  fill(8, 1, 12, 2, 'H');
  fill(15, 1, 19, 2, 'H'); fill(22, 1, 26, 2, 'H');

  // y=4-6: houses and void alternating
  fill(1, 4, 4, 6, 'H');   fill(6, 4, 9, 6, 'V');
  fill(11, 4, 14, 6, 'H'); fill(16, 4, 19, 6, 'V');
  fill(21, 4, 24, 6, 'H');

  // y=8-10: void and houses alternating
  fill(1, 8, 4, 10, 'V');   fill(6, 8, 9, 10, 'H');
  fill(11, 8, 14, 10, 'V'); fill(16, 8, 19, 10, 'H');
  fill(21, 8, 24, 10, 'V');

  // y=12-14: central plaza danger zone
  fill(1, 12, 26, 14, 'V');
  // buildings within the plaza
  fill(2, 12, 4, 14, 'H');
  fill(10, 12, 13, 14, 'H');
  fill(19, 12, 21, 14, 'H');

  // y=16-18: mixed again
  fill(1, 16, 5, 18, 'H');  fill(7, 16, 10, 18, 'V');
  fill(13, 16, 17, 18, 'H'); fill(20, 16, 23, 18, 'V');
  fill(25, 16, 26, 18, 'H');

  return L;
}

// Small interior house layout (12 × 8)
function buildInterior(): string[][] {
  const W = 12, H = 8;
  const L: string[][] = Array.from({ length: H }, () => Array(W).fill('P'));
  for (let x = 0; x < W; x++) { L[0][x] = 'W'; }
  for (let y = 0; y < H; y++) { L[y][0] = 'W'; L[y][W - 1] = 'W'; }
  // interior south wall with door gap
  for (let x = 1; x < W - 1; x++) L[H - 1][x] = 'W';
  L[H - 1][5] = '<'; // exit door
  // some furniture-ish walls
  for (let x = 2; x <= 9; x++) L[2][x] = 'W'; // back shelf
  return L;
}

// ── CORRIDOR MAPS ──────────────────────────────────────────────────
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

const saLayout = buildCorridorMap(15, 12, 7, 'V');
poke(saLayout, 7, 0, '>'); poke(saLayout, 7, 11, '<');
poke(saLayout, 8, 2, 'P'); poke(saLayout, 8, 5, 'P'); poke(saLayout, 8, 8, 'P');
for (let x = 3; x <= 11; x++) poke(saLayout, x, 6, x === 7 ? 'P' : 'M');

const frLayout = buildCorridorMap(15, 12, 7, 'V');
poke(frLayout, 7, 0, '>'); poke(frLayout, 7, 11, '<');
poke(frLayout, 8, 2, 'P'); poke(frLayout, 8, 5, 'P'); poke(frLayout, 8, 8, 'P');
for (let x = 3; x <= 11; x++) poke(frLayout, x, 6, x === 7 ? 'P' : 'M');

const adLayout = buildCorridorMap(15, 12, 7, 'V');
poke(adLayout, 7, 0, '>'); poke(adLayout, 7, 11, '<');
poke(adLayout, 8, 2, 'P'); poke(adLayout, 8, 5, 'P'); poke(adLayout, 8, 8, 'P');
for (let x = 3; x <= 11; x++) poke(adLayout, x, 6, x === 7 ? 'P' : 'M');

const vnLayout = buildCorridorMap(15, 12, 7, 'V');
poke(vnLayout, 7, 11, '<');
for (let x = 3; x <= 11; x++) poke(vnLayout, x, 6, x === 7 ? 'P' : 'M');

// City map
const ctLayout = buildCityLayout();

// Interior maps
const intH1Layout = buildInterior();
const intH2Layout = buildInterior();
const intH3Layout = buildInterior();

// ── MAPS ───────────────────────────────────────────────────────────
export const MAPS: Record<string, any> = {
  // ── VERDANT HOLLOW (21 × 15) ──────────────────────────────────────
  'VH': {
    id: 'VH', name: 'Verdant Hollow', width: 21, height: 15,
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
      { id: 'gregor', x: 9,  y: 1,  color: '#888888', name: 'Gregor',       type: 'HEAL' },
      { id: 'maren',  x: 9,  y: 3,  color: '#999999', name: 'Elder Maren',  type: 'TALK' },
      { id: 'pip',    x: 9,  y: 6,  color: '#bbbbbb', name: 'Pip',          type: 'TALK' },
      { id: 'zara',   x: 9,  y: 8,  color: '#dddddd', name: 'Zara',         type: 'SHOP' },
      { id: 'hollow', x: 7,  y: 12, color: '#eeeeee', name: 'A Hollow',     type: 'TALK' },
      { id: 'city_gate_guard', x: 11, y: 6, color: '#aaaaff', name: 'City Messenger', type: 'TALK' },
    ],
    chests: [
      { id: 'ch_vh1', flag: 'ch_vh1', x: 9, y: 11, item: 'echoes_30' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: {
      '>': { mapId: 'WW', x: 8, y: 13 },
      '<': { mapId: 'VH', x: 8, y: 13, locked: true, lockMsg: "Void energy seals the south road." }
    }
  },

  // ── WHISPERING WASTES (21 × 15) ───────────────────────────────────
  'WW': {
    id: 'WW', name: 'Whispering Wastes', width: 21, height: 15,
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
    doors: [],
    books: [],
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
    doors: [],
    books: [],
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
    doors: [],
    books: [],
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
      { id: 'warden_kess',        x: 8, y: 2, color: '#cfe8ff', name: 'Warden Kess',         type: 'TALK' },
      { id: 'peddler_oren',       x: 8, y: 5, color: '#e8f4ff', name: 'Peddler Oren',        type: 'SHOP' },
      { id: 'shivering_villager', x: 8, y: 8, color: '#bcd8ea', name: 'A Shivering Villager', type: 'TALK' },
    ],
    chests: [
      { id: 'ch_fr1', flag: 'ch_fr1', x: 5, y: 9, item: 'traveler_cloak' }
    ],
    doors: [],
    books: [],
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
      { id: 'ember_sentinel', x: 8, y: 2, color: '#ff9966', name: 'Ember Sentinel',   type: 'TALK' },
      { id: 'ashen_trader',   x: 8, y: 5, color: '#ffb380', name: 'The Ashen Trader', type: 'SHOP' },
      { id: 'burned_scholar', x: 8, y: 8, color: '#d98c6b', name: 'A Burned Scholar', type: 'TALK' },
    ],
    chests: [
      { id: 'ch_ad1', flag: 'ch_ad1', x: 5, y: 9, item: 'ember_plate' }
    ],
    doors: [],
    books: [],
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
    doors: [],
    books: [],
    encounterPool: ['void_sentinel'],
    exits: {
      '<': { mapId: 'AD', x: 7, y: 10 }
    }
  },

  // ── CRESTFALL CITY (28 × 22) ──────────────────────────────────────────
  'CT': {
    id: 'CT', name: 'Crestfall City', width: 28, height: 22,
    layout: ctLayout,
    npcs: [
      { id: 'city_warden',   x: 13, y: 20, color: '#aaaaff', name: 'City Warden',    type: 'TALK' },
      { id: 'relic_broker',  x: 7,  y: 1,  color: '#ffcc88', name: 'Relic Broker',   type: 'SHOP' },
      { id: 'city_survivor', x: 20, y: 7,  color: '#cccccc', name: 'A Survivor',     type: 'TALK' },
    ],
    chests: [
      { id: 'ch_ct1', flag: 'ch_ct1', x: 3,  y: 13, item: 'echoes_80' },
      { id: 'ch_ct2', flag: 'ch_ct2', x: 11, y: 1,  item: 'ench_codex_living_flame' },
      { id: 'ch_ct3', flag: 'ch_ct3', x: 20, y: 13, item: 'ench_grimoire_striking' },
    ],
    // doors: enterable buildings. Player must be adjacent (manhattan dist = 1) to enter.
    doors: [
      { id: 'door_h1', x: 3,  y: 1,  targetMapId: 'CT_H1', targetX: 5, targetY: 6, label: "Scholar's Refuge" },
      { id: 'door_h2', x: 16, y: 1,  targetMapId: 'CT_H2', targetX: 5, targetY: 6, label: "Abandoned Home" },
      { id: 'door_h3', x: 12, y: 12, targetMapId: 'CT_H3', targetX: 5, targetY: 6, label: "Old Study" },
      { id: 'door_h4', x: 7,  y: 8,  targetMapId: 'CT_H4', targetX: 5, targetY: 6, label: "Empty House" },
      { id: 'door_h5', x: 17, y: 8,  targetMapId: 'CT_H5', targetX: 5, targetY: 6, label: "Empty House" },
    ],
    books: [],
    encounterPool: ['city_shade', 'street_wraith', 'hollow_guard'],
    exits: {
      '<': { mapId: 'VH', x: 9, y: 7 }
    }
  },

  // ── SCHOLAR'S REFUGE (12 × 8 interior) ────────────────────────────
  'CT_H1': {
    id: 'CT_H1', name: "Scholar's Refuge", width: 12, height: 8,
    layout: intH1Layout,
    npcs: [],
    chests: [
      { id: 'ch_h1_book', flag: 'ch_h1_book', x: 6, y: 1, item: 'book_keepers_codex' },
      { id: 'ch_h1_enc',  flag: 'ch_h1_enc',  x: 9, y: 1, item: 'ench_tome_iron_veil' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: {
      '<': { mapId: 'CT', x: 3, y: 2 }
    }
  },

  // ── ABANDONED HOME (12 × 8 interior) ──────────────────────────────
  'CT_H2': {
    id: 'CT_H2', name: 'Abandoned Home', width: 12, height: 8,
    layout: intH2Layout,
    npcs: [],
    chests: [
      { id: 'ch_h2_letter', flag: 'ch_h2_letter', x: 3, y: 1, item: 'book_childs_letter' },
      { id: 'ch_h2_verse',  flag: 'ch_h2_verse',  x: 8, y: 1, item: 'book_forgotten_verse' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: {
      '<': { mapId: 'CT', x: 16, y: 2 }
    }
  },

  // ── OLD STUDY (12 × 8 interior) ────────────────────────────────────
  'CT_H3': {
    id: 'CT_H3', name: "Old Study", width: 12, height: 8,
    layout: intH3Layout,
    npcs: [],
    chests: [
      { id: 'ch_h3_cipher',  flag: 'ch_h3_cipher',  x: 4, y: 1, item: 'book_cipher_note' },
      { id: 'ch_h3_ledger',  flag: 'ch_h3_ledger',  x: 8, y: 1, item: 'book_merchants_ledger' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: {
      '<': { mapId: 'CT', x: 12, y: 13 }
    }
  },

  // ── EMPTY HOUSE 4 (12 × 8 interior) ───────────────────────────────
  'CT_H4': {
    id: 'CT_H4', name: 'Abandoned House', width: 12, height: 8,
    layout: buildInterior(),
    npcs: [],
    chests: [],
    doors: [],
    books: [],
    encounterPool: [],
    exits: {
      '<': { mapId: 'CT', x: 7, y: 9 }
    }
  },

  // ── EMPTY HOUSE 5 (12 × 8 interior) ───────────────────────────────
  'CT_H5': {
    id: 'CT_H5', name: 'Abandoned House', width: 12, height: 8,
    layout: buildInterior(),
    npcs: [],
    chests: [],
    doors: [],
    books: [],
    encounterPool: [],
    exits: {
      '<': { mapId: 'CT', x: 17, y: 9 }
    }
  },
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
    enchantedSlots: [],
    equipment: { weapon: null, armor: null },
    quests: {
      'quest_main': 0, 'quest_name': 0, 'quest_hollow': 0,
      'quest_archive': 0, 'quest_frost': 0, 'quest_ash': 0,
      'quest_city': 0,
    },
    questProgress: {
      'shards': 0, 'specters': 0, 'archive_kills': 0, 'frost_kills': 0, 'ash_kills': 0,
      'city_clears': 0,
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
  quitAfterSave: false,
  meta: { isGuest: true },
  bookRead: { bookId: null, page: 0, fromInventoryIndex: 0 },
  enchantSelect: { enchantBookSlot: 0, cursorIndex: 0 },
};
