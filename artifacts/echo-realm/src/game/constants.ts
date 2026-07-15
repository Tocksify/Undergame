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

function poke(layout: string[][], x: number, y: number, tile: string) {
  if (layout[y] && layout[y][x] !== undefined) layout[y][x] = tile;
}

function buildMap(w: number, h: number, fill = 'T'): string[][] {
  return Array.from({ length: h }, () => Array(w).fill(fill));
}

function rect(L: string[][], x1: number, y1: number, x2: number, y2: number, t: string, skip: string[] = []) {
  for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) {
    if (skip.length === 0 || !skip.includes(L[y]?.[x] ?? '')) if (L[y]?.[x] !== undefined) L[y][x] = t;
  }
}
function hline(L: string[][], y: number, x1: number, x2: number, t: string) {
  for (let x = x1; x <= x2; x++) { if (L[y]?.[x] !== undefined) L[y][x] = t; }
}
function vline(L: string[][], x: number, y1: number, y2: number, t: string) {
  for (let y = y1; y <= y2; y++) { if (L[y]?.[x] !== undefined) L[y][x] = t; }
}

// ── VERDANT HOLLOW (26 × 20) ──────────────────────────────────────
// A real village: inn NW, elder cottage NE, market stall SW, town square centre
function buildVH(): string[][] {
  const L = buildMap(26, 20, 'T');
  // Open interior
  rect(L, 1, 1, 24, 18, 'P');
  // --- Tree / forest bands ---
  hline(L, 1, 1, 24, 'T');           // row 1 dense trees (except exits)
  hline(L, 18, 1, 24, 'T');          // row 18 dense trees (except exits)
  vline(L, 1, 1, 18, 'T');           // col 1
  vline(L, 24, 1, 18, 'T');          // col 24 (east boundary)
  // Tree clusters interior decoration
  rect(L, 2, 2, 4, 3, 'T'); rect(L, 20, 2, 23, 3, 'T');
  rect(L, 2, 15, 4, 17, 'T'); rect(L, 20, 15, 23, 17, 'T');
  // --- Inn building NW (x=5-9, y=3-7) ---
  rect(L, 5, 3, 9, 7, 'H');
  poke(L, 7, 7, 'P'); // south door gap
  rect(L, 6, 4, 8, 6, 'P'); // interior walkable
  // Gregor stands at door gap row inside (7,6)
  // --- Elder Maren's Cottage NE (x=16-20, y=3-7) ---
  rect(L, 16, 3, 20, 7, 'H');
  poke(L, 18, 7, 'P'); // south door gap
  rect(L, 17, 4, 19, 6, 'P'); // interior
  // Maren at (18,6) inside, player approaches from (18,8)
  // --- Zara's Market Stall SW (x=5-9, y=12-16) ---
  rect(L, 5, 12, 9, 16, 'H');
  poke(L, 7, 12, 'P'); // north door gap
  rect(L, 6, 13, 8, 15, 'P'); // interior
  // Zara at (7,13)
  // --- Hollow's Den SE corner (x=16-20, y=12-16) ---
  rect(L, 16, 12, 20, 16, 'H');
  poke(L, 18, 12, 'P'); // north door gap
  rect(L, 17, 13, 19, 15, 'P'); // interior
  // Town square centre with well
  poke(L, 12, 9, 'M'); // well
  poke(L, 13, 9, 'M');
  poke(L, 6, 10, 'M'); poke(L, 20, 10, 'M'); // lamp posts
  // Notice boards / decorative
  poke(L, 11, 4, 'M'); poke(L, 14, 4, 'M'); // north plaza markers
  poke(L, 11, 14, 'M'); poke(L, 14, 14, 'M'); // south plaza markers
  // Exits
  poke(L, 12, 0, '>'); // north → WW
  poke(L, 25, 9, '!'); // east → CT
  poke(L, 12, 19, '<'); // south (locked)
  return L;
}

// ── WHISPERING WASTES (28 × 22) ───────────────────────────────────
// Open void wasteland — winding stone paths, monuments, danger zones
function buildWW(): string[][] {
  const L = buildMap(28, 22, 'V'); // all void danger
  // Hard border
  rect(L, 0, 0, 27, 0, 'T'); rect(L, 0, 21, 27, 21, 'T');
  vline(L, 0, 0, 21, 'T'); vline(L, 27, 0, 21, 'T');
  // === Stone path network (winding, non-linear) ===
  // South entry from VH at (13,20) → leads to a fork
  vline(L, 13, 17, 21, 'P');
  rect(L, 10, 17, 16, 18, 'P'); // south landing zone
  // Western arm
  hline(L, 15, 2, 14, 'P');
  vline(L, 2, 8, 15, 'P');
  rect(L, 2, 8, 6, 10, 'P'); // west clearing
  vline(L, 6, 5, 10, 'P');
  hline(L, 5, 6, 13, 'P');  // connects west to centre
  // Central path  
  vline(L, 13, 3, 16, 'P');
  rect(L, 10, 12, 16, 15, 'P'); // mid clearing
  rect(L, 9, 7, 14, 10, 'P');  // north clearing
  // Eastern arm (leads to CT exit)
  hline(L, 10, 14, 26, 'P');
  vline(L, 20, 6, 10, 'P');
  rect(L, 20, 6, 25, 8, 'P'); // east clearing
  hline(L, 3, 14, 24, 'P');   // upper east road
  hline(L, 6, 20, 26, 'P');   // east road to CT
  poke(L, 27, 6, '!');         // east exit → CT
  // North exit
  hline(L, 2, 8, 16, 'P');
  poke(L, 13, 1, 'P');         // approach
  poke(L, 13, 0, '>');         // north → MS
  // South exit (back to VH)
  poke(L, 13, 21, '<');
  // Monuments and ruins
  poke(L, 7, 7, 'M'); poke(L, 7, 8, 'M');
  poke(L, 19, 4, 'M'); poke(L, 20, 5, 'M');
  poke(L, 3, 13, 'M'); poke(L, 23, 9, 'M');
  poke(L, 15, 16, 'M');
  // Safe stone patches near chests
  rect(L, 3, 15, 5, 17, 'P');
  rect(L, 22, 2, 25, 4, 'P');
  return L;
}

// ── MEMORY SANCTUM (26 × 20) ──────────────────────────────────────
// Grand hall with columns, side alcoves, boss chamber at top
function buildMS(): string[][] {
  const L = buildMap(26, 20, 'W'); // mostly stone walls
  // Main nave (centre corridor) — wide and open
  rect(L, 5, 1, 20, 18, 'P');
  // Side alcoves — west
  rect(L, 1, 3, 4, 6, 'P');   // west alcove 1
  rect(L, 1, 9, 4, 12, 'P');  // west alcove 2
  rect(L, 1, 14, 4, 17, 'P'); // west alcove 3
  // Side alcoves — east
  rect(L, 21, 3, 24, 6, 'P');
  rect(L, 21, 9, 24, 12, 'P');
  rect(L, 21, 14, 24, 17, 'P');
  // Columns (impassable W)
  for (const cy of [4, 9, 14]) {
    poke(L, 6, cy, 'W'); poke(L, 9, cy, 'W');
    poke(L, 16, cy, 'W'); poke(L, 19, cy, 'W');
  }
  // Boss antechamber at top (slightly elevated)
  rect(L, 8, 1, 17, 3, 'P');
  poke(L, 12, 1, 'M'); poke(L, 13, 1, 'M'); // altar
  // Chest alcove
  rect(L, 22, 7, 24, 8, 'P');
  // Exits
  poke(L, 12, 0, '>'); // north → SA
  poke(L, 13, 19, '<'); // south → WW
  return L;
}

// ── SUNKEN ARCHIVE (26 × 20) ──────────────────────────────────────
// A drowned library: interconnected rooms with shelves, water channels
function buildSA(): string[][] {
  const L = buildMap(26, 20, 'W');
  // Entry hall (south)
  rect(L, 9, 15, 16, 18, 'P');
  // Main reading room (centre-south)
  rect(L, 4, 9, 21, 14, 'P');
  // Archive stacks (north room)
  rect(L, 2, 2, 23, 8, 'P');
  // West annex
  rect(L, 1, 10, 3, 13, 'P');
  // East annex
  rect(L, 22, 10, 24, 13, 'P');
  // Bookshelf dividers (W walls creating aisles)
  for (let x = 5; x <= 20; x += 5) vline(L, x, 3, 7, 'W');
  // Water channel (V tiles — sunken, dangerous)
  hline(L, 9, 4, 21, 'V');
  poke(L, 4, 9, 'V'); poke(L, 21, 9, 'V');
  // Re-open paths over water at crossing points
  poke(L, 7, 9, 'P'); poke(L, 12, 9, 'P'); poke(L, 17, 9, 'P');
  // Monuments/lecterns
  poke(L, 3, 3, 'M'); poke(L, 22, 3, 'M');
  poke(L, 12, 5, 'M'); poke(L, 13, 5, 'M');
  // Exits
  poke(L, 12, 0, '>'); // north → FR
  poke(L, 13, 19, '<'); // south → MS
  return L;
}

// ── FROSTBOUND REACH (28 × 20) ────────────────────────────────────
// Frozen landscape: open fields, frozen lake centre, tree line, scattered refugees
function buildFR(): string[][] {
  const L = buildMap(28, 20, 'T'); // tree/frost border
  // Open snowy fields (P)
  rect(L, 1, 1, 26, 18, 'P');
  // Frozen lake (M tiles — impassable ice formations)
  rect(L, 9, 7, 18, 13, 'M');
  // Paths around the lake
  hline(L, 6, 1, 26, 'P');   // north path
  hline(L, 14, 1, 26, 'P');  // south path  
  vline(L, 1, 1, 18, 'P');   // west path
  vline(L, 26, 1, 18, 'P');  // east path
  hline(L, 10, 1, 8, 'P');   // west lake bridge
  hline(L, 10, 19, 26, 'P'); // east lake bridge
  hline(L, 12, 1, 8, 'P');
  hline(L, 12, 19, 26, 'P');
  // Open patches with interest
  rect(L, 2, 2, 7, 5, 'P');   // NW clearing
  rect(L, 20, 2, 25, 5, 'P'); // NE clearing
  rect(L, 2, 14, 7, 17, 'P'); // SW clearing
  rect(L, 20, 14, 25, 17, 'P'); // SE clearing
  // Frozen ruins
  rect(L, 4, 8, 7, 12, 'W');
  poke(L, 5, 9, 'P'); poke(L, 6, 9, 'P'); poke(L, 5, 10, 'P'); poke(L, 6, 10, 'P'); // interior ruin
  rect(L, 20, 8, 23, 12, 'W');
  poke(L, 21, 9, 'P'); poke(L, 22, 9, 'P'); poke(L, 21, 10, 'P'); poke(L, 22, 10, 'P');
  // Ice monument markers
  poke(L, 13, 7, 'M'); poke(L, 14, 7, 'M');
  poke(L, 13, 13, 'M'); poke(L, 14, 13, 'M');
  // Exits
  poke(L, 13, 0, '>'); // north → AD
  poke(L, 13, 19, '<'); // south → SA
  return L;
}

// ── ASHEN DESCENT (26 × 20) ───────────────────────────────────────
// Volcanic cavern: ash drifts, lava channels (V), stone platforms
function buildAD(): string[][] {
  const L = buildMap(26, 20, 'V'); // lava/ash floor
  // Rocky walls forming the cavern skeleton
  rect(L, 0, 0, 25, 0, 'W'); rect(L, 0, 19, 25, 19, 'W');
  vline(L, 0, 0, 19, 'W'); vline(L, 25, 0, 19, 'W');
  // Stone platform network
  rect(L, 3, 2, 10, 6, 'P');    // NW platform
  rect(L, 14, 2, 22, 6, 'P');   // NE platform
  rect(L, 1, 8, 8, 13, 'P');    // W platform
  rect(L, 10, 9, 15, 14, 'P');  // centre platform
  rect(L, 17, 8, 24, 13, 'P');  // E platform
  rect(L, 8, 15, 17, 18, 'P');  // south platform
  // Bridges (narrow P paths)
  hline(L, 4, 10, 14, 'P');     // NW-NE bridge
  vline(L, 10, 3, 9, 'P');      // NW-centre bridge
  vline(L, 14, 3, 9, 'P');
  hline(L, 9, 8, 17, 'P');      // W-E bridge
  vline(L, 12, 14, 16, 'P');    // centre-south bridge
  vline(L, 13, 14, 16, 'P');
  // Rocky walls / boulders mid-map
  rect(L, 11, 4, 13, 6, 'W');
  poke(L, 11, 5, 'V'); poke(L, 12, 5, 'V'); // lava gap in boulder
  // Cinders / forge areas
  poke(L, 5, 3, 'M'); poke(L, 20, 3, 'M'); // forge pillars
  poke(L, 5, 4, 'M'); poke(L, 20, 4, 'M');
  poke(L, 12, 10, 'M'); // centre altar
  // Exits
  poke(L, 12, 0, '>'); poke(L, 13, 0, '>'); // north → VN
  poke(L, 12, 19, '<'); poke(L, 13, 19, '<'); // south → FR
  return L;
}

// ── VOID NEXUS (26 × 22) ──────────────────────────────────────────
// The final arena: void everywhere, stone platforms arranged in a cathedral pattern
function buildVN(): string[][] {
  const L = buildMap(26, 22, 'V'); // pure void
  // Outer ring of stone (walkable perimeter)
  rect(L, 1, 1, 24, 20, 'P', ['V']); // fill with P but we'll add V back
  // Re-void the interior (carved cathedral pattern)
  rect(L, 3, 3, 22, 18, 'V');
  // Stone nave (central)
  rect(L, 10, 2, 15, 20, 'P');
  // Transept arms
  rect(L, 1, 9, 24, 13, 'P');
  // Apse (boss alcove, top)
  rect(L, 7, 1, 18, 5, 'P');
  // Side chapels
  rect(L, 1, 3, 5, 7, 'P');
  rect(L, 20, 3, 24, 7, 'P');
  rect(L, 1, 15, 5, 19, 'P');
  rect(L, 20, 15, 24, 19, 'P');
  // Void pools within the aisles (impassable void islands)
  rect(L, 6, 6, 9, 8, 'V');
  rect(L, 16, 6, 19, 8, 'V');
  rect(L, 6, 14, 9, 16, 'V');
  rect(L, 16, 14, 19, 16, 'V');
  // Altar / boss position markers
  poke(L, 11, 2, 'M'); poke(L, 12, 2, 'M'); poke(L, 13, 2, 'M'); poke(L, 14, 2, 'M');
  poke(L, 11, 3, 'M'); poke(L, 14, 3, 'M');
  // Chests on side chapels
  // Pillar columns
  for (const [cx, cy] of [[3,5],[3,11],[3,17],[22,5],[22,11],[22,17]]) { poke(L, cx, cy, 'M'); }
  // Exits (south only — one way in)
  poke(L, 12, 21, '<'); poke(L, 13, 21, '<');
  return L;
}

// ── HOUSE INTERIOR (16 × 10) ──────────────────────────────────────
// A real interior: table, shelf, bed, storage
function buildInteriorVariant(variant: number): string[][] {
  const L = buildMap(16, 10, 'W');
  // Floor
  rect(L, 1, 1, 14, 8, 'P');
  // Furniture walls
  // Shelf along back wall
  hline(L, 1, 2, 13, 'W');
  // Table area centre
  rect(L, 5, 3, 9, 5, 'W');
  poke(L, 7, 4, 'P'); // seat
  if (variant === 1) {
    // Scholar's refuge: extra bookshelf east
    vline(L, 13, 2, 6, 'W');
    poke(L, 13, 4, 'P'); poke(L, 13, 5, 'P'); // gaps in shelf
    poke(L, 12, 2, 'M'); // lectern
  } else if (variant === 2) {
    // Abandoned home: broken furniture, rubble
    poke(L, 3, 3, 'W'); poke(L, 3, 4, 'W'); // broken corner
    poke(L, 11, 6, 'W'); poke(L, 12, 6, 'W');
    poke(L, 2, 2, 'M'); // hearth
  } else if (variant === 3) {
    // Old study: desk area left, shelves right
    rect(L, 1, 2, 3, 5, 'W');
    poke(L, 2, 3, 'P'); poke(L, 2, 4, 'P');
    vline(L, 12, 2, 7, 'W');
    poke(L, 12, 4, 'P'); poke(L, 12, 6, 'P');
  }
  // South door exit
  poke(L, 8, 9, '<');
  return L;
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
