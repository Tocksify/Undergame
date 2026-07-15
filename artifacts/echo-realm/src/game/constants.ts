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
  'book_innkeepers_notice': {
    title: "A Notice Pinned to the Inn Door",
    type: 'note',
    pages: [
      "TO ANY TRAVELER —\n\nRooms are free tonight. Rooms are free every night, if I'm honest. Bring news of the road if you have it, I'll trade you a bed for it.\n\nIf you're headed toward Crestfall: go carefully. The east gate isn't what it used to be.\n\n— Gregor",
    ],
  },
  'book_stall_ledger_scrap': {
    title: "A Torn Page from Zara's Ledger",
    type: 'note',
    pages: [
      "...sold: 3 tonics, 1 ward, 1 rusty shard. Bought: nothing, no one's selling.\n\nTraded a crystal to a boy for a smooth grey stone. He said it was 'for naming things.' I didn't ask.\n\nNote to self: restock cloth wraps before the next caravan. If there is a next caravan.",
    ],
  },
  'book_sa_marginalia': {
    title: "Marginalia in a Water-Stained Book",
    type: 'note',
    pages: [
      "Someone has written in the margins of every book on this shelf, in the same tired hand:\n\n'Still here.'\n'Still here.'\n'Still here, though the water's risen another inch.'\n\nThe last entry, on the final page of the final book:\n'If you're reading this, the shelf held. That's something. That's not nothing.'",
    ],
  },
  'book_fr_frostnote': {
    title: "A Note Frozen Into the Ruin Wall",
    type: 'note',
    pages: [
      "We sealed the west room when the frost came through the cracks. Everything in it is probably still there, preserved, waiting.\n\nI keep meaning to go back for the letters. I keep not going back.\n\nSome memories you protect by leaving them exactly where the cold found them.",
    ],
  },
  'book_wardens_report': {
    title: "City Warden's Final Report",
    author: 'Warden Talis',
    type: 'journal',
    pages: [
      "Filed the evacuation order today. Half the households ignored it. The other half had nowhere else to go, which is its own kind of answer.\n\nThe void doesn't take a street all at once. It takes a house, then the house next to it looks less lived-in, and then it takes that one too.",
      "If anyone finds this: the city was not abandoned. It was held onto, by people who had every reason to let go and didn't.\n\nThat matters. Write it down somewhere the Void can't reach.",
    ],
  },
  'book_survivors_diary': {
    title: "A Survivor's Diary",
    type: 'journal',
    pages: [
      "Third week alone in this house. It isn't really alone — I talk to the furniture, and the furniture, to its credit, has started to feel like it's listening.\n\nI keep the door locked. Not because anything's tried it. Because locking it is a decision I can still make.",
      "Someone should know we tried. Not just survived — tried. Kept the lamps lit. Kept the streets swept. Kept saying each other's names out loud so the Void couldn't practice forgetting them.\n\nIf you're reading this, say a name out loud right now. Any name. It helps.",
    ],
  },
  'book_forgotten_flyer': {
    title: "A Torn Flyer in the Street",
    type: 'note',
    pages: [
      "...ANNUAL LANTERN FESTIVAL — bring a lantern, bring a memory worth keeping, the Warden's office will supply the — [torn]\n\nOn the back, in pencil: 'We should still do this. Even just the two of us. Especially just the two of us.'",
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
  'book_innkeepers_notice': {
    name: 'A Notice Pinned to the Door',
    desc: 'A handwritten notice, weathered by rain.',
    price: 0, tier: 'common', category: 'book', bookId: 'book_innkeepers_notice',
  },
  'book_stall_ledger_scrap': {
    name: "Torn Ledger Page",
    desc: "A scrap torn from Zara's sales ledger.",
    price: 0, tier: 'common', category: 'book', bookId: 'book_stall_ledger_scrap',
  },
  'book_sa_marginalia': {
    name: 'Water-Stained Marginalia',
    desc: 'Handwritten notes crowding the margins of an old book.',
    price: 0, tier: 'uncommon', category: 'book', bookId: 'book_sa_marginalia',
  },
  'book_fr_frostnote': {
    name: 'Frozen Wall Note',
    desc: 'A note frozen into the stone of a ruined wall.',
    price: 0, tier: 'uncommon', category: 'book', bookId: 'book_fr_frostnote',
  },
  'book_wardens_report': {
    name: "City Warden's Final Report",
    desc: 'An official report, unfiled and unfinished.',
    price: 0, tier: 'rare', category: 'book', bookId: 'book_wardens_report',
  },
  'book_survivors_diary': {
    name: "A Survivor's Diary",
    desc: 'A diary kept by someone who stayed.',
    price: 0, tier: 'rare', category: 'book', bookId: 'book_survivors_diary',
  },
  'book_forgotten_flyer': {
    name: 'Torn Festival Flyer',
    desc: 'A flyer for a festival that may never happen again.',
    price: 0, tier: 'common', category: 'book', bookId: 'book_forgotten_flyer',
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
// All overworld maps below are built programmatically and verified for
// full connectivity (every NPC, chest, door and exit is reachable from
// the map's entry point) — see the design notes in replit.md.

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

// ── VERDANT HOLLOW (24 × 16) — real village with four buildings around a square
function buildVH(): string[][] {
  const W = 24, H = 16;
  const L = buildMap(W, H, 'T');
  rect(L, 1, 1, W - 2, H - 2, 'P');
  rect(L, 2, 2, 3, 3, 'T'); rect(L, W - 4, 2, W - 3, 3, 'T');
  rect(L, 2, H - 4, 3, H - 3, 'T'); rect(L, W - 4, H - 4, W - 3, H - 3, 'T');

  // Inn NW — Gregor
  rect(L, 4, 2, 8, 5, 'H');
  rect(L, 5, 3, 7, 4, 'P');
  poke(L, 6, 5, 'P');
  // Elder Maren's Cottage NE
  rect(L, 15, 2, 19, 5, 'H');
  rect(L, 16, 3, 18, 4, 'P');
  poke(L, 17, 5, 'P');
  // Zara's Market Stall SW
  rect(L, 4, 10, 8, 13, 'H');
  rect(L, 5, 11, 7, 12, 'P');
  poke(L, 6, 10, 'P');
  // Hollow's Den SE
  rect(L, 15, 10, 19, 13, 'H');
  rect(L, 16, 11, 18, 12, 'P');
  poke(L, 17, 10, 'P');

  // Town square decor
  poke(L, 11, 8, 'M'); poke(L, 12, 8, 'M');
  poke(L, 8, 7, 'M'); poke(L, 15, 7, 'M');
  poke(L, 8, 9, 'M'); poke(L, 15, 9, 'M');

  poke(L, 12, 0, '>');      // north -> Whispering Wastes
  poke(L, W - 1, 8, '!');   // east -> Crestfall City
  poke(L, 12, H - 1, '<');  // south (locked, flavor)
  return L;
}

// ── WHISPERING WASTES (22 × 16) — branching void wasteland, non-linear
function buildWW(): string[][] {
  const W = 22, H = 16;
  const L = buildMap(W, H, 'V');
  rect(L, 0, 0, W - 1, 0, 'T'); rect(L, 0, H - 1, W - 1, H - 1, 'T');
  vline(L, 0, 0, H - 1, 'T'); vline(L, W - 1, 0, H - 1, 'T');

  rect(L, 9, H - 3, 13, H - 2, 'P');
  vline(L, 11, H - 5, H - 2, 'P');
  poke(L, 11, H - 1, '<');

  hline(L, H - 6, 3, 11, 'P');
  vline(L, 3, 4, H - 6, 'P');
  rect(L, 2, 3, 6, 5, 'P');

  rect(L, 9, 8, 13, 10, 'P');
  vline(L, 11, 5, 8, 'P');

  hline(L, 4, 8, 14, 'P');
  poke(L, 11, 3, 'P'); poke(L, 11, 2, 'P'); poke(L, 11, 1, 'P');
  poke(L, 11, 0, '>');

  hline(L, 6, 13, 18, 'P');
  vline(L, 18, 3, 6, 'P');
  rect(L, 15, 2, 19, 4, 'P');

  poke(L, 5, 9, 'M'); poke(L, 6, 12, 'M');
  poke(L, 16, 9, 'M'); poke(L, 8, 6, 'M');
  return L;
}

// ── MEMORY SANCTUM (20 × 14) — grand hall with alcoves and columns
function buildMS(): string[][] {
  const W = 20, H = 14;
  const L = buildMap(W, H, 'W');
  rect(L, 6, 1, 13, 12, 'P');
  rect(L, 1, 2, 4, 4, 'P'); rect(L, 1, 6, 4, 8, 'P'); rect(L, 1, 10, 4, 12, 'P');
  poke(L, 5, 3, 'P'); poke(L, 5, 7, 'P'); poke(L, 5, 11, 'P');
  rect(L, 15, 2, 18, 4, 'P'); rect(L, 15, 6, 18, 8, 'P'); rect(L, 15, 10, 18, 12, 'P');
  poke(L, 14, 3, 'P'); poke(L, 14, 7, 'P'); poke(L, 14, 11, 'P');
  for (const cy of [3, 7, 11]) { poke(L, 8, cy, 'W'); poke(L, 11, cy, 'W'); }
  rect(L, 8, 0, 11, 1, 'P');
  poke(L, 10, 1, 'M');
  poke(L, 9, 0, '>');
  poke(L, 9, H - 1, '<');
  return L;
}

// ── SUNKEN ARCHIVE (20 × 14) — drowned library, interconnected rooms
function buildSA(): string[][] {
  const W = 20, H = 14;
  const L = buildMap(W, H, 'W');
  rect(L, 7, 11, 12, 12, 'P');
  rect(L, 3, 7, 16, 10, 'P');
  rect(L, 1, 1, 18, 6, 'P');
  rect(L, 1, 8, 2, 9, 'P'); rect(L, 17, 8, 18, 9, 'P');
  vline(L, 5, 2, 5, 'W'); vline(L, 9, 2, 5, 'W'); vline(L, 13, 2, 5, 'W');
  hline(L, 6, 3, 16, 'V');
  poke(L, 6, 6, 'P'); poke(L, 10, 6, 'P'); poke(L, 14, 6, 'P');
  poke(L, 3, 2, 'M'); poke(L, 16, 2, 'M');
  poke(L, 9, 3, 'M'); poke(L, 10, 3, 'M');
  poke(L, 9, 0, '>'); poke(L, 9, H - 1, '<');
  return L;
}

// ── FROSTBOUND REACH (22 × 15) — frozen fields looping around a lake
function buildFR(): string[][] {
  const W = 22, H = 15;
  const L = buildMap(W, H, 'T');
  rect(L, 1, 1, W - 2, H - 2, 'P');
  rect(L, 8, 5, 13, 9, 'W');
  hline(L, 3, 1, W - 2, 'P');
  hline(L, 11, 1, W - 2, 'P');
  vline(L, 1, 1, H - 2, 'P');
  vline(L, W - 2, 1, H - 2, 'P');
  rect(L, 2, 1, 5, 2, 'P'); rect(L, W - 6, 1, W - 3, 2, 'P');
  rect(L, 2, H - 3, 5, H - 2, 'P'); rect(L, W - 6, H - 3, W - 3, H - 2, 'P');
  rect(L, 3, 6, 6, 8, 'W');
  poke(L, 4, 7, 'P'); poke(L, 5, 7, 'P'); poke(L, 4, 6, 'P');
  rect(L, W - 7, 6, W - 4, 8, 'W');
  poke(L, W - 6, 7, 'P'); poke(L, W - 5, 7, 'P'); poke(L, W - 6, 6, 'P');
  poke(L, 10, 4, 'M'); poke(L, 11, 4, 'M');
  poke(L, 10, 10, 'M'); poke(L, 11, 10, 'M');
  poke(L, 10, 0, '>'); poke(L, 10, H - 1, '<');
  return L;
}

// ── ASHEN DESCENT (22 × 15) — volcanic cavern, stone platforms over lava
function buildAD(): string[][] {
  const W = 22, H = 15;
  const L = buildMap(W, H, 'V');
  rect(L, 0, 0, W - 1, 0, 'W'); rect(L, 0, H - 1, W - 1, H - 1, 'W');
  vline(L, 0, 0, H - 1, 'W'); vline(L, W - 1, 0, H - 1, 'W');
  rect(L, 2, 2, 8, 4, 'P');
  rect(L, 12, 2, 18, 4, 'P');
  rect(L, 1, 6, 6, 9, 'P');
  rect(L, 8, 7, 12, 9, 'P');
  rect(L, 14, 6, 19, 9, 'P');
  rect(L, 6, 11, 14, 13, 'P');
  hline(L, 3, 8, 12, 'P');
  vline(L, 5, 4, 6, 'P'); vline(L, 15, 4, 6, 'P');
  hline(L, 8, 6, 14, 'P');
  vline(L, 4, 9, 11, 'P'); vline(L, 16, 9, 11, 'P'); vline(L, 10, 9, 11, 'P');
  rect(L, 9, 4, 11, 5, 'W');
  poke(L, 4, 3, 'M'); poke(L, 16, 3, 'M'); poke(L, 10, 8, 'M');
  poke(L, 10, 0, '>'); poke(L, 10, H - 1, '<');
  return L;
}

// ── VOID NEXUS (20 × 16) — final cathedral arena
function buildVN(): string[][] {
  const W = 20, H = 16;
  const L = buildMap(W, H, 'V');
  rect(L, 8, 1, 11, H - 2, 'P');
  rect(L, 1, 7, W - 2, 9, 'P');
  rect(L, 5, 1, 14, 3, 'P');
  rect(L, 1, 2, 4, 5, 'P'); rect(L, 15, 2, 18, 5, 'P');
  rect(L, 1, 11, 4, 14, 'P'); rect(L, 15, 11, 18, 14, 'P');
  for (const [cx, cy] of [[2, 3], [2, 12], [17, 3], [17, 12]]) poke(L, cx, cy, 'M');
  poke(L, 9, 1, 'M'); poke(L, 10, 1, 'M');
  poke(L, 9, H - 1, '<');
  return L;
}

// ── CRESTFALL CITY (24 × 18) — real city blocks around a plaza
function buildCT(): string[][] {
  const W = 24, H = 18;
  const L = buildMap(W, H, 'G');
  rect(L, 0, 0, W - 1, 0, 'W'); rect(L, 0, H - 1, W - 1, H - 1, 'W');
  vline(L, 0, 0, H - 1, 'W'); vline(L, W - 1, 0, H - 1, 'W');

  hline(L, 4, 1, W - 2, 'P'); hline(L, 9, 1, W - 2, 'P'); hline(L, 14, 1, W - 2, 'P');
  vline(L, 6, 1, H - 2, 'P'); vline(L, 12, 1, H - 2, 'P'); vline(L, 18, 1, H - 2, 'P');

  poke(L, 0, 9, '<'); poke(L, 1, 9, 'P'); // west gate -> Verdant Hollow

  rect(L, 2, 1, 4, 3, 'H'); rect(L, 8, 1, 10, 3, 'H');
  rect(L, 14, 1, 16, 3, 'H'); rect(L, 20, 1, 22, 3, 'H');

  rect(L, 2, 5, 4, 8, 'H');   // Scholar's Refuge
  rect(L, 8, 5, 10, 8, 'H');
  rect(L, 14, 5, 16, 8, 'H'); // Abandoned Home
  rect(L, 20, 5, 22, 8, 'H');

  rect(L, 8, 10, 16, 13, 'V'); // central plaza — void seeping in
  poke(L, 12, 11, 'M'); poke(L, 12, 12, 'M');

  rect(L, 2, 10, 4, 13, 'H');  // Old Study
  rect(L, 20, 10, 22, 13, 'H');

  rect(L, 2, 15, 4, 16, 'H');   // former Warden's office
  rect(L, 8, 15, 10, 16, 'H');
  rect(L, 14, 15, 16, 16, 'H'); // survivor's shelter
  rect(L, 20, 15, 22, 16, 'H');

  return L;
}

// ── HOUSE INTERIOR (14 × 9) — real furnished rooms, several variants
function buildInterior(variant: 'scholar' | 'abandoned' | 'study' | 'quiet'): string[][] {
  const W = 14, H = 9;
  const L = buildMap(W, H, 'W');
  rect(L, 1, 1, W - 2, H - 2, 'P');
  hline(L, 1, 2, W - 3, 'W');
  poke(L, 4, 1, 'P'); poke(L, W - 5, 1, 'P');
  rect(L, 5, 3, 8, 4, 'W');
  poke(L, 6, 3, 'M');
  if (variant === 'scholar') {
    vline(L, W - 3, 2, 6, 'W');
    poke(L, W - 3, 3, 'P'); poke(L, W - 3, 5, 'P');
    poke(L, W - 4, 2, 'M');
  } else if (variant === 'abandoned') {
    poke(L, 2, 2, 'W'); poke(L, 3, 2, 'W');
    poke(L, W - 3, H - 3, 'W');
    poke(L, 2, 6, 'M');
  } else if (variant === 'study') {
    rect(L, 1, 2, 3, 5, 'W');
    poke(L, 2, 3, 'P'); poke(L, 2, 4, 'P');
    vline(L, W - 3, 2, 6, 'W');
    poke(L, W - 3, 3, 'P'); poke(L, W - 3, 5, 'P');
  } else if (variant === 'quiet') {
    poke(L, 3, 6, 'M'); poke(L, W - 4, 6, 'M');
  }
  poke(L, Math.floor(W / 2), H - 1, '<');
  return L;
}

const vhLayout = buildVH();
const wwLayout = buildWW();
const msLayout = buildMS();
const saLayout = buildSA();
const frLayout = buildFR();
const adLayout = buildAD();
const vnLayout = buildVN();
const ctLayout = buildCT();
const ctH1Layout = buildInterior('scholar');
const ctH2Layout = buildInterior('abandoned');
const ctH3Layout = buildInterior('study');
const ctH4Layout = buildInterior('quiet');
const ctH5Layout = buildInterior('quiet');
// ── MAPS ───────────────────────────────────────────────────────────
export const MAPS: Record<string, any> = {
  // ── VERDANT HOLLOW (24 × 16) — a real village square with four buildings ──
  'VH': {
    id: 'VH', name: 'Verdant Hollow', width: 24, height: 16,
    layout: vhLayout,
    npcs: [
      { id: 'gregor', x: 6,  y: 3,  color: '#888888', name: 'Gregor',       type: 'HEAL' },
      { id: 'maren',  x: 17, y: 3,  color: '#999999', name: 'Elder Maren',  type: 'TALK' },
      { id: 'zara',   x: 6,  y: 12, color: '#dddddd', name: 'Zara',         type: 'SHOP' },
      { id: 'hollow', x: 17, y: 12, color: '#eeeeee', name: 'A Hollow',     type: 'TALK' },
      { id: 'pip',    x: 10, y: 8,  color: '#bbbbbb', name: 'Pip',          type: 'TALK' },
      { id: 'city_gate_guard', x: 20, y: 8, color: '#aaaaff', name: 'City Messenger', type: 'TALK' },
    ],
    chests: [
      { id: 'ch_vh1', flag: 'ch_vh1', x: 12, y: 12, item: 'echoes_30' },
      { id: 'ch_vh_note1', flag: 'ch_vh_note1', x: 9, y: 5, item: 'book_innkeepers_notice' },
      { id: 'ch_vh_note2', flag: 'ch_vh_note2', x: 9, y: 11, item: 'book_stall_ledger_scrap' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: {
      '>': { mapId: 'WW', x: 11, y: 13 },
      '!': { mapId: 'CT', x: 1, y: 9 },
      '<': { mapId: 'VH', x: 12, y: 8, locked: true, lockMsg: "Void energy seals the south road." }
    }
  },

  // ── WHISPERING WASTES (22 × 16) — branching wasteland loops, not a corridor ──
  'WW': {
    id: 'WW', name: 'Whispering Wastes', width: 22, height: 16,
    layout: wwLayout,
    npcs: [],
    chests: [
      { id: 'ch_ww1', flag: 'ch_ww1', x: 4,  y: 4, item: 'spark' },
      { id: 'ch_ww2', flag: 'ch_ww2', x: 17, y: 3, item: 'echoes_60' },
    ],
    doors: [],
    books: [],
    encounterPool: ['wisp', 'crawler', 'specter'],
    exits: {
      '>': { mapId: 'MS', x: 9, y: 1, reqQuest: 'quest_main', reqState: 2, lockMsg: "The Sanctum is sealed. Restore the village first." },
      '<': { mapId: 'VH', x: 12, y: 14 }
    }
  },

  // ── MEMORY SANCTUM (20 × 14) — nave, side alcoves and columns ──
  'MS': {
    id: 'MS', name: 'Memory Sanctum', width: 20, height: 14,
    layout: msLayout,
    npcs: [
      { id: 'archivist', x: 9, y: 1, color: '#bbbbbb', name: 'The Archivist', type: 'BOSS', hideFlag: 'defeated_archivist' }
    ],
    chests: [
      { id: 'ch_ms1', flag: 'ch_ms1', x: 2, y: 7, item: 'echo' }
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: {
      '<': { mapId: 'WW', x: 11, y: 1 },
      '>': { mapId: 'SA', x: 9, y: 1, reqQuest: 'quest_main', reqState: 3, lockMsg: "Something ancient still guards this passage." }
    }
  },

  // ── SUNKEN ARCHIVE (20 × 14) — stacks, reading room, flooded aisle ──
  'SA': {
    id: 'SA', name: 'Sunken Archive', width: 20, height: 14,
    layout: saLayout,
    npcs: [
      { id: 'vess',     x: 9, y: 3, color: '#aaaaaa', name: 'Old Vess', type: 'TALK' },
      { id: 'old_thom', x: 4, y: 8, color: '#c8c8c8', name: 'Old Thom', type: 'SHOP' },
    ],
    chests: [
      { id: 'ch_sa1', flag: 'ch_sa1', x: 1,  y: 8, item: 'bone_edge' },
      { id: 'ch_sa2', flag: 'ch_sa2', x: 15, y: 2, item: 'book_sa_marginalia' },
    ],
    doors: [],
    books: [],
    encounterPool: ['archive_wisp', 'ink_wraith'],
    exits: {
      '<': { mapId: 'MS', x: 9, y: 1 },
      '>': { mapId: 'FR', x: 9, y: 1, reqQuest: 'quest_main', reqState: 4, lockMsg: "Old Vess hasn't opened this way yet." }
    }
  },

  // ── FROSTBOUND REACH (22 × 15) — paths looping a frozen lake, two ruins ──
  'FR': {
    id: 'FR', name: 'Frostbound Reach', width: 22, height: 15,
    layout: frLayout,
    npcs: [
      { id: 'warden_kess',        x: 10, y: 3, color: '#cfe8ff', name: 'Warden Kess',         type: 'TALK' },
      { id: 'peddler_oren',       x: 4,  y: 7, color: '#e8f4ff', name: 'Peddler Oren',        type: 'SHOP' },
      { id: 'shivering_villager', x: 16, y: 7, color: '#bcd8ea', name: 'A Shivering Villager', type: 'TALK' },
    ],
    chests: [
      { id: 'ch_fr1', flag: 'ch_fr1', x: 4,  y: 12, item: 'traveler_cloak' },
      { id: 'ch_fr2', flag: 'ch_fr2', x: 16, y: 12, item: 'book_fr_frostnote' },
    ],
    doors: [],
    books: [],
    encounterPool: ['frost_walker', 'rime_hound'],
    exits: {
      '<': { mapId: 'SA', x: 9,  y: 1 },
      '>': { mapId: 'AD', x: 10, y: 1, reqQuest: 'quest_main', reqState: 5, lockMsg: "Warden Kess hasn't opened this road yet." }
    }
  },

  // ── ASHEN DESCENT (22 × 15) — stone platforms and bridges over lava ──
  'AD': {
    id: 'AD', name: 'Ashen Descent', width: 22, height: 15,
    layout: adLayout,
    npcs: [
      { id: 'ember_sentinel', x: 5,  y: 3, color: '#ff9966', name: 'Ember Sentinel',   type: 'TALK' },
      { id: 'ashen_trader',   x: 3,  y: 7, color: '#ffb380', name: 'The Ashen Trader', type: 'SHOP' },
      { id: 'burned_scholar', x: 16, y: 7, color: '#d98c6b', name: 'A Burned Scholar', type: 'TALK' },
    ],
    chests: [
      { id: 'ch_ad1', flag: 'ch_ad1', x: 8, y: 12, item: 'ember_plate' }
    ],
    doors: [],
    books: [],
    encounterPool: ['ash_hound', 'cinder_wraith'],
    exits: {
      '<': { mapId: 'FR', x: 10, y: 1 },
      '>': { mapId: 'VN', x: 9,  y: 14, reqQuest: 'quest_main', reqState: 6, lockMsg: "The Ember Sentinel hasn't opened the Nexus road yet." }
    }
  },

  // ── VOID NEXUS (20 × 16) — final cathedral arena ──
  'VN': {
    id: 'VN', name: 'Void Nexus', width: 20, height: 16,
    layout: vnLayout,
    npcs: [
      { id: 'boss', x: 9, y: 2, color: '#ffffff', name: 'Memory Wraith', type: 'BOSS' }
    ],
    chests: [
      { id: 'ch_vn1', flag: 'ch_vn1', x: 2,  y: 4,  item: 'voidglass_dagger' },
      { id: 'ch_vn2', flag: 'ch_vn2', x: 17, y: 13, item: 'voidsteel_mail' },
    ],
    doors: [],
    books: [],
    encounterPool: ['void_sentinel'],
    exits: {
      '<': { mapId: 'AD', x: 10, y: 13 }
    }
  },

  // ── CRESTFALL CITY (24 × 18) — real city blocks, streets and a plaza ──
  'CT': {
    id: 'CT', name: 'Crestfall City', width: 24, height: 18,
    layout: ctLayout,
    npcs: [
      { id: 'city_warden',   x: 17, y: 10, color: '#aaaaff', name: 'City Warden',    type: 'TALK' },
      { id: 'relic_broker',  x: 5,  y: 2,  color: '#ffcc88', name: 'Relic Broker',   type: 'SHOP' },
      { id: 'city_survivor', x: 19, y: 6,  color: '#cccccc', name: 'A Survivor',     type: 'TALK' },
    ],
    chests: [
      { id: 'ch_ct1',      flag: 'ch_ct1',      x: 5,  y: 11, item: 'echoes_80' },
      { id: 'ch_ct2',      flag: 'ch_ct2',      x: 11, y: 2,  item: 'ench_codex_living_flame' },
      { id: 'ch_ct3',      flag: 'ch_ct3',      x: 13, y: 11, item: 'ench_grimoire_striking' },
      { id: 'ch_ct_note',  flag: 'ch_ct_note',  x: 19, y: 11, item: 'book_forgotten_flyer' },
    ],
    // doors: enterable buildings. Player must be adjacent (manhattan dist = 1) to enter.
    doors: [
      { id: 'door_h1', x: 4,  y: 6,  targetMapId: 'CT_H1', targetX: 7, targetY: 6, label: "Scholar's Refuge" },
      { id: 'door_h2', x: 14, y: 6,  targetMapId: 'CT_H2', targetX: 7, targetY: 6, label: "Abandoned Home" },
      { id: 'door_h3', x: 4,  y: 11, targetMapId: 'CT_H3', targetX: 7, targetY: 6, label: "Old Study" },
      { id: 'door_h4', x: 4,  y: 15, targetMapId: 'CT_H4', targetX: 7, targetY: 6, label: "Warden's Old Office" },
      { id: 'door_h5', x: 14, y: 15, targetMapId: 'CT_H5', targetX: 7, targetY: 6, label: "Survivor's Shelter" },
    ],
    books: [],
    encounterPool: ['city_shade', 'street_wraith', 'hollow_guard'],
    exits: {
      '<': { mapId: 'VH', x: 22, y: 8 }
    }
  },

  // ── SCHOLAR'S REFUGE (14 × 9 interior) ──
  'CT_H1': {
    id: 'CT_H1', name: "Scholar's Refuge", width: 14, height: 9,
    layout: ctH1Layout,
    npcs: [],
    chests: [
      { id: 'ch_h1_book', flag: 'ch_h1_book', x: 3,  y: 1, item: 'book_keepers_codex' },
      { id: 'ch_h1_enc',  flag: 'ch_h1_enc',  x: 10, y: 1, item: 'ench_tome_iron_veil' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: {
      '<': { mapId: 'CT', x: 5, y: 6 }
    }
  },

  // ── ABANDONED HOME (14 × 9 interior) ──
  'CT_H2': {
    id: 'CT_H2', name: 'Abandoned Home', width: 14, height: 9,
    layout: ctH2Layout,
    npcs: [],
    chests: [
      { id: 'ch_h2_letter', flag: 'ch_h2_letter', x: 3,  y: 1, item: 'book_childs_letter' },
      { id: 'ch_h2_verse',  flag: 'ch_h2_verse',  x: 10, y: 1, item: 'book_forgotten_verse' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: {
      '<': { mapId: 'CT', x: 13, y: 6 }
    }
  },

  // ── OLD STUDY (14 × 9 interior) ──
  'CT_H3': {
    id: 'CT_H3', name: "Old Study", width: 14, height: 9,
    layout: ctH3Layout,
    npcs: [],
    chests: [
      { id: 'ch_h3_cipher', flag: 'ch_h3_cipher', x: 3,  y: 1, item: 'book_cipher_note' },
      { id: 'ch_h3_ledger', flag: 'ch_h3_ledger', x: 10, y: 1, item: 'book_merchants_ledger' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: {
      '<': { mapId: 'CT', x: 5, y: 11 }
    }
  },

  // ── WARDEN'S OLD OFFICE (14 × 9 interior) ──
  'CT_H4': {
    id: 'CT_H4', name: "Warden's Old Office", width: 14, height: 9,
    layout: ctH4Layout,
    npcs: [],
    chests: [
      { id: 'ch_h4_report', flag: 'ch_h4_report', x: 3,  y: 1, item: 'book_wardens_report' },
      { id: 'ch_h4_tonic',  flag: 'ch_h4_tonic',  x: 10, y: 1, item: 'tonic' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: {
      '<': { mapId: 'CT', x: 5, y: 15 }
    }
  },

  // ── SURVIVOR'S SHELTER (14 × 9 interior) ──
  'CT_H5': {
    id: 'CT_H5', name: "Survivor's Shelter", width: 14, height: 9,
    layout: ctH5Layout,
    npcs: [],
    chests: [
      { id: 'ch_h5_diary',   flag: 'ch_h5_diary',   x: 3,  y: 1, item: 'book_survivors_diary' },
      { id: 'ch_h5_crystal', flag: 'ch_h5_crystal', x: 10, y: 1, item: 'crystal' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: {
      '<': { mapId: 'CT', x: 13, y: 15 }
    }
  },
};

export const INITIAL_STATE: GameStateData = {
  mode: GameMode.TITLE,
  mapId: 'VH',
  player: {
    x: 12 * TILE_SIZE,
    y: 8 * TILE_SIZE,
    targetX: 12 * TILE_SIZE,
    targetY: 8 * TILE_SIZE,
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
