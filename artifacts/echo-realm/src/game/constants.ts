import { BookData, EnemyData, GameMode, GameStateData, Item, ItemTier } from './types';

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
  // ── SECRET NOTE TRAIL (5 scattered clues) ────────────────────────
  'book_trail_note_1': {
    title: 'A Scrap of Directions',
    type: 'note',
    pages: [
      "'...count the blocks from the western gate. Not four, not eight — that's a different house. Ten, if you're counting streets. The house looks empty. It isn't...'\n\nThe rest of the page has been burned away.",
    ],
  },
  'book_trail_note_2': {
    title: 'A Second Scrap',
    type: 'note',
    pages: [
      "'...seven, then. Seven blocks the other way. The door doesn't lock because nobody thinks there's anything worth taking. That's the point...'\n\nSomeone has drawn a small, crooked door in the margin.",
    ],
  },
  'book_trail_note_3': {
    title: 'A Third Scrap',
    type: 'note',
    pages: [
      "'...inside, don't stop at the first room. Keep walking. The house is bigger than the street makes it look...'\n\nIn the corner, someone has written and crossed out: 'ten streets over, seven down' — then underneath, in different ink: 'or was it seven over, ten down?'",
    ],
  },
  'book_trail_note_4': {
    title: 'A Fourth Scrap',
    type: 'note',
    pages: [
      "'...whatever is down there has been down there since before the Void. It is not evil. It is just old, and it is guarding something...'\n\nFollow the numbers. Ten. Seven. Two numbers, two orders — only one door answers. If the house you find is quiet but wrong, you had them backwards.",
    ],
  },
  'book_trail_note_5': {
    title: 'The Final Scrap',
    type: 'note',
    pages: [
      "'...if you make it past what's below, you will find a book with no words. Do not despair — an empty book is not a wasted one. Something out there can still fill it...'\n\nThis is the last of the scraps. Good luck, Keeper.",
    ],
  },
  'book_mysterious_note': {
    title: 'A Mysterious Note',
    type: 'note',
    pages: [
      "Folded inside the empty book, a single sheet in careful handwriting:\n\n'You found this, which means you got past him. Good. That means you're ready to hear the rest.\n\nEast of Crestfall there is a second city built entirely of ash and rings of stone. The people there called it Ashfall Ring. At its heart, inside the largest house left standing, is something that guards a Blessing — the only thing that can fill an empty book.\n\nBut the road there isn't through the streets. Somewhere in this city is a house that doesn't answer when you knock — the door opens anyway. Whatever stairs you find inside, take them down. At the bottom, the way east opens on its own.\n\nIt will not be easy. It was never meant to be.'",
    ],
  },
};

// ── ITEMS ──────────────────────────────────────────────────────────
export const ITEMS: Record<string, Item> = {
  // ── MEDICAL CONSUMABLES ──
  'tonic':           { name: 'Hollow Tonic',      desc: 'Restore 5 HP',                          price: 0,   tier: 'common',    category: 'consumable', subcategory: 'medical' },
  'crystal':         { name: 'Memory Crystal',    desc: 'Restore 10 HP',                         price: 50,  tier: 'common',    category: 'consumable', subcategory: 'medical' },
  'elixir':          { name: 'Keeper\'s Elixir',  desc: 'Restore 18 HP. Tastes like forgotten summers.', price: 90, tier: 'uncommon', category: 'consumable', subcategory: 'medical' },
  'greater_crystal': { name: 'Greater Crystal',   desc: 'Restore 25 HP',                         price: 120, tier: 'uncommon',  category: 'consumable', subcategory: 'medical' },
  'memory_salve':    { name: 'Memory Salve',      desc: 'Restore 30 HP and clear confusion',     price: 200, tier: 'rare',      category: 'consumable', subcategory: 'medical' },
  'phoenix_ash':     { name: 'Phoenix Ash',       desc: 'Fully restore HP and clear confusion',   price: 250, tier: 'epic',      category: 'consumable', subcategory: 'medical' },

  // ── DEF CONSUMABLES ──
  'ward':            { name: 'Void Ward',         desc: 'Reduce next attack by 50%',             price: 80,  tier: 'uncommon',  category: 'consumable', subcategory: 'def' },
  'iron_ward':       { name: 'Iron Ward',         desc: 'Reduce next attack by 75%',             price: 160, tier: 'rare',      category: 'consumable', subcategory: 'def' },

  // ── UTILITY CONSUMABLES ──
  'spark':           { name: 'Thought Spark',     desc: '2x power next turn',                    price: 60,  tier: 'uncommon',  category: 'consumable', subcategory: 'utility' },
  'dust':            { name: 'Dream Dust',        desc: 'Skip enemy attack this turn',            price: 110, tier: 'rare',      category: 'consumable', subcategory: 'utility' },
  'blink_shard':     { name: 'Blink Shard',       desc: 'Skip enemy attack AND deal 2× next turn', price: 220, tier: 'epic',    category: 'consumable', subcategory: 'utility' },

  // ── KEY / QUEST ITEMS ──
  'stone':  { name: 'Naming Stone',  desc: 'A strange stone. Needed for naming.',  price: 30, tier: 'common',    category: 'key' },
  'echo':   { name: 'Ancient Echo',  desc: 'A memory from the beginning.',         price: 0,  tier: 'legendary', category: 'key' },

  // ── WEAPONS ──
  'rusty_shard':      { name: 'Rusty Shard',         desc: 'A chipped blade with no memory of its owner. It is simply sharp.',     price: 40,  tier: 'common',    category: 'weapon', atk: 1 },
  'iron_fragment':    { name: 'Iron Fragment',        desc: 'Scavenged from collapsed walls. Still sharp enough to mean something.',  price: 80,  tier: 'common',    category: 'weapon', atk: 2 },
  'bone_edge':        { name: 'Bone Edge',            desc: "The creature this came from didn't let go easily. Neither will you.",    price: 150, tier: 'uncommon',  category: 'weapon', atk: 3 },
  'etched_spike':     { name: 'Etched Spike',         desc: 'Warded iron that remembers violence. The wards only make it meaner.',   price: 200, tier: 'uncommon',  category: 'weapon', atk: 4 },
  'frost_fang':       { name: 'Frost Fang',           desc: 'It has never been warm. Not once. It reaches out for heat wherever it goes.', price: 0, tier: 'rare', category: 'weapon', atk: 5 },
  'memory_edge':      { name: 'Memory Edge',          desc: 'Forged from solidified recollection. It cuts through what was as easily as what is.', price: 0, tier: 'rare', category: 'weapon', atk: 7 },
  'cinder_blade':     { name: 'Cinder Blade',         desc: 'Forged in the last true fire. The flames are still in there, waiting.',  price: 0,   tier: 'epic',      category: 'weapon', atk: 8 },
  'voidtouched_blade':{ name: 'Voidtouched Blade',    desc: 'Reality flinches where this blade passes through it. So do most enemies.', price: 0, tier: 'epic',     category: 'weapon', atk: 10 },
  'voidglass_dagger': { name: 'Voidglass Dagger',     desc: 'Cut from the Nexus itself. It remembers every wound it has ever made.',  price: 0,   tier: 'legendary', category: 'weapon', atk: 12 },

  // ── ARMOR ──
  'cloth_wrap':       { name: 'Cloth Wrap',           desc: 'It will not stop much. But it is better than hope alone.',               price: 40,  tier: 'common',    category: 'armor', maxHp: 5 },
  'hide_wrap':        { name: 'Hide Wrap',             desc: 'Toughened by something that survived worse than this.',                  price: 100, tier: 'common',    category: 'armor', maxHp: 8 },
  'traveler_cloak':   { name: "Traveler's Cloak",     desc: 'It has walked very far. The roads are in the threads.',                  price: 140, tier: 'uncommon',  category: 'armor', maxHp: 10, def: 1 },
  'runed_cloak':      { name: 'Runed Cloak',           desc: 'Old wards stitched into the hem by someone who did not want to be forgotten.', price: 220, tier: 'uncommon', category: 'armor', maxHp: 12, def: 1 },
  'archivist_ward':   { name: "Archivist's Ward",     desc: 'Made by someone who needed to survive long enough to write one more page.', price: 0, tier: 'rare',    category: 'armor', maxHp: 15, def: 2 },
  'ember_plate':      { name: 'Ember Plate',           desc: 'Still smells like smoke. Whatever wore it before walked out of fire.',   price: 0,   tier: 'epic',      category: 'armor', maxHp: 20, def: 3 },
  'shadow_carapace':  { name: 'Shadow Carapace',       desc: 'Worn by something that stopped needing light to see its prey.',          price: 0,   tier: 'epic',      category: 'armor', maxHp: 25, def: 4 },
  'voidsteel_mail':   { name: 'Voidsteel Mail',        desc: 'The armor of death himself. Heavy with the weight of endings.',          price: 0,   tier: 'legendary', category: 'armor', maxHp: 30, def: 5 },

  // ── READABLE BOOKS ──
  'book_keepers_codex':      { name: "The Keeper's Codex",        desc: 'An ancient journal about Memory Keepers.',        price: 0, tier: 'rare',      category: 'book', bookId: 'book_keepers_codex' },
  'book_childs_letter':      { name: "A Child's Letter",          desc: 'A folded note, worn soft at the edges.',          price: 0, tier: 'common',    category: 'book', bookId: 'book_childs_letter' },
  'book_forgotten_verse':    { name: "Verses of the Forgotten",   desc: 'A thin book of handwritten poems.',               price: 0, tier: 'uncommon',  category: 'book', bookId: 'book_forgotten_verse' },
  'book_cipher_note':        { name: "A Strange Cipher",          desc: 'Notes in a code you almost recognize.',           price: 0, tier: 'uncommon',  category: 'book', bookId: 'book_cipher_note' },
  'book_merchants_ledger':   { name: "Aldric's Private Ledger",   desc: "A merchant's personal journal from Crestfall.",   price: 0, tier: 'common',    category: 'book', bookId: 'book_merchants_ledger' },
  'book_innkeepers_notice':  { name: 'A Notice Pinned to the Door', desc: 'A handwritten notice, weathered by rain.',      price: 0, tier: 'common',    category: 'book', bookId: 'book_innkeepers_notice' },
  'book_stall_ledger_scrap': { name: "Torn Ledger Page",          desc: "A scrap torn from Zara's sales ledger.",          price: 0, tier: 'common',    category: 'book', bookId: 'book_stall_ledger_scrap' },
  'book_sa_marginalia':      { name: 'Water-Stained Marginalia',  desc: 'Handwritten notes crowding the margins of an old book.', price: 0, tier: 'uncommon', category: 'book', bookId: 'book_sa_marginalia' },
  'book_fr_frostnote':       { name: 'Frozen Wall Note',          desc: 'A note frozen into the stone of a ruined wall.',  price: 0, tier: 'uncommon',  category: 'book', bookId: 'book_fr_frostnote' },
  'book_wardens_report':     { name: "City Warden's Final Report", desc: 'An official report, unfiled and unfinished.',    price: 0, tier: 'rare',      category: 'book', bookId: 'book_wardens_report' },
  'book_survivors_diary':    { name: "A Survivor's Diary",        desc: 'A diary kept by someone who stayed.',             price: 0, tier: 'rare',      category: 'book', bookId: 'book_survivors_diary' },
  'book_forgotten_flyer':    { name: 'Torn Festival Flyer',       desc: 'A flyer for a festival that may never happen again.', price: 0, tier: 'common',  category: 'book', bookId: 'book_forgotten_flyer' },

  // ── SECRET NOTE TRAIL ──
  'book_trail_note_1': { name: 'A Scrap of Directions', desc: 'Half-burned directions to somewhere in the city.', price: 0, tier: 'common',   category: 'book', bookId: 'book_trail_note_1' },
  'book_trail_note_2': { name: 'A Second Scrap',        desc: 'A crooked door is drawn in the margin.',           price: 0, tier: 'uncommon', category: 'book', bookId: 'book_trail_note_2' },
  'book_trail_note_3': { name: 'A Third Scrap',         desc: '"The house is bigger than the street makes it look."', price: 0, tier: 'uncommon', category: 'book', bookId: 'book_trail_note_3' },
  'book_trail_note_4': { name: 'A Fourth Scrap',        desc: 'Something old is guarding something else.',        price: 0, tier: 'rare',      category: 'book', bookId: 'book_trail_note_4' },
  'book_trail_note_5': { name: 'The Final Scrap',       desc: 'The last clue in the trail.',                      price: 0, tier: 'rare',      category: 'book', bookId: 'book_trail_note_5' },
  'book_mysterious_note': { name: 'A Mysterious Note',  desc: 'Folded inside the empty book. Speaks of a second city.', price: 0, tier: 'legendary', category: 'book', bookId: 'book_mysterious_note' },

  // ── RELIC / KEY ITEMS (easter egg chain) ──
  'empty_book': {
    name: 'The Empty Book',
    desc: "A book with no words. It can't be read — but something out there can still fill it.",
    price: 0, tier: 'legendary', category: 'book', // no bookId → "pages are unreadable"
  },
  'tomes_blessing': {
    name: 'Tomes Blessing',
    desc: 'A blessing that, combined with the Empty Book, can write any enchantment into existence.',
    price: 0, tier: 'mythic', category: 'relic',
  },

  // ── ENCHANTED BOOKS (now earned only through side quests, or crafted via Tomes Blessing) ──
  'ench_memory_mark': {
    name: 'Memory Mark',
    desc: 'Enchants a weapon. Grants +1 ATK. Common, but a start.',
    price: 0, tier: 'common', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 1 },
  },
  'ench_stone_ward': {
    name: 'Stone Ward',
    desc: 'Enchants armor. Grants +1 DEF. A small but real bulwark.',
    price: 0, tier: 'common', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['armor'], def: 1 },
  },
  'ench_hollow_edge': {
    name: 'Hollow Edge',
    desc: 'Enchants a weapon. Grants +2 ATK. Hums faintly.',
    price: 0, tier: 'uncommon', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 2 },
  },
  'ench_woven_ward': {
    name: 'Woven Ward',
    desc: 'Enchants armor. Grants +5 Max HP. Threaded with old protections.',
    price: 0, tier: 'uncommon', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['armor'], maxHp: 5 },
  },
  'ench_shard_frostbite': {
    name: 'Shard of Frostbite',
    desc: 'Enchants a weapon. Grants +2 ATK. Incompatible with armor.',
    price: 0, tier: 'rare', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 2 },
  },
  'ench_veil_dust': {
    name: 'Veil of Dust',
    desc: 'Enchants armor. Grants +2 DEF. Incompatible with weapons.',
    price: 0, tier: 'rare', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['armor'], def: 2 },
  },
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
  'ench_relic_ashbound': {
    name: 'Ashbound Relic',
    desc: 'Enchants a weapon. Grants +6 ATK. Incompatible with armor.',
    price: 0, tier: 'legendary', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 6 },
  },
  'ench_codex_living_flame': {
    name: 'Codex of Living Flame',
    desc: 'Enchants armor. Grants +10 Max HP. Incompatible with weapons.',
    price: 0, tier: 'legendary', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['armor'], maxHp: 10 },
  },
  // Mortus tier — obtainable ONLY by crafting from scratch with the Tomes Blessing.
  'ench_grimoire_mortus': {
    name: 'Grimoire of Mortus',
    desc: 'A weapon enchantment written from nothing. Grants +18 ATK. Incompatible with armor.',
    price: 0, tier: 'mythic', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 18 },
  },
  'ench_veil_mortus': {
    name: 'Veil of Mortus',
    desc: 'An armor enchantment written from nothing. Grants +18 DEF, +20 Max HP. Incompatible with weapons.',
    price: 0, tier: 'mythic', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['armor'], def: 18, maxHp: 20 },
  },
};

// Enchantments craftable from scratch via the Tomes Blessing — spans every tier.
export const CRAFTABLE_ENCHANTS: string[] = [
  'ench_memory_mark', 'ench_stone_ward',           // common
  'ench_hollow_edge', 'ench_woven_ward',            // uncommon
  'ench_shard_frostbite', 'ench_veil_dust',         // rare
  'ench_grimoire_striking', 'ench_tome_iron_veil',  // epic
  'ench_relic_ashbound', 'ench_codex_living_flame', // legendary
  'ench_grimoire_mortus', 'ench_veil_mortus',       // mythic (Mortus)
];

export const TIER_COLOR: Record<string, string> = {
  common: '#9ca3af',
  uncommon: '#4ade80',
  rare: '#38bdf8',
  epic: '#c084fc',
  legendary: '#f59e0b',
  mythic: '#1a1a3a', // fallback; mythic is drawn as an animated gradient — see renderer's drawTierText
};

// Display label for tiers — the top tier is branded "Mortus" in-world.
export const TIER_LABEL: Record<string, string> = {
  common: 'Common', uncommon: 'Uncommon', rare: 'Rare', epic: 'Epic', legendary: 'Legendary', mythic: 'Mortus',
};

const TIER_RANK: Record<string, number> = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5 };

// Given a probabilistic reward pool, returns the tier of the highest-tier
// possible reward — used to color quest/reward text by its best-case payout.
export function getHighestTier(pool?: { itemId: string; chance: number }[], fallbackItemId?: string): string {
  if (pool && pool.length > 0) {
    let best = 'common';
    for (const p of pool) {
      const t = ITEMS[p.itemId]?.tier ?? 'common';
      if (TIER_RANK[t] > TIER_RANK[best]) best = t;
    }
    return best;
  }
  if (fallbackItemId && ITEMS[fallbackItemId]) return ITEMS[fallbackItemId].tier;
  return 'common';
}

// Weighted-random pick from a reward pool (chances need not sum to exactly 1).
export function pickWeightedReward(pool: { itemId: string; chance: number }[]): string {
  const total = pool.reduce((s, p) => s + p.chance, 0);
  let r = Math.random() * total;
  for (const p of pool) {
    r -= p.chance;
    if (r <= 0) return p.itemId;
  }
  return pool[pool.length - 1].itemId;
}

export function recomputeMaxHp(state: GameStateData) {
  const armor = state.player.equipment.armor;
  const bonus = armor && ITEMS[armor] ? ITEMS[armor].maxHp ?? 0 : 0;
  // enchantment bonus on armor
  const armorSlot = armor ? state.player.inventory.indexOf(armor) : -1;
  const enchBookId = armorSlot >= 0 ? state.player.enchantedSlots[armorSlot] : null;
  const enchBonus = enchBookId && ITEMS[enchBookId]?.enchantData?.maxHp ? ITEMS[enchBookId].enchantData!.maxHp! : 0;
  const vitBonus = (state.player.baseStats?.vit ?? 0) * VIT_HP_PER_POINT;
  state.player.maxHp = BASE_MAX_HP + bonus + enchBonus + vitBonus;
  state.player.hp = Math.min(state.player.hp, state.player.maxHp);
}

export function getWeaponAtkBonus(state: GameStateData): number {
  const w = state.player.equipment.weapon;
  const base = w && ITEMS[w] ? ITEMS[w].atk ?? 0 : 0;
  const wSlot = w ? state.player.inventory.indexOf(w) : -1;
  const enchBookId = wSlot >= 0 ? state.player.enchantedSlots[wSlot] : null;
  const enchBonus = enchBookId && ITEMS[enchBookId]?.enchantData?.atk ? ITEMS[enchBookId].enchantData!.atk! : 0;
  const strBonus = (state.player.baseStats?.str ?? 0) * STR_ATK_PER_POINT;
  return base + enchBonus + strBonus;
}

export function getArmorDefBonus(state: GameStateData): number {
  const a = state.player.equipment.armor;
  const base = a && ITEMS[a] ? ITEMS[a].def ?? 0 : 0;
  const aSlot = a ? state.player.inventory.indexOf(a) : -1;
  const enchBookId = aSlot >= 0 ? state.player.enchantedSlots[aSlot] : null;
  const enchBonus = enchBookId && ITEMS[enchBookId]?.enchantData?.def ? ITEMS[enchBookId].enchantData!.def! : 0;
  const defBonus = (state.player.baseStats?.def ?? 0) * DEF_DEF_PER_POINT;
  return base + enchBonus + defBonus;
}

// ── LEVELING & STAT ALLOCATION ────────────────────────────────────────
// Each stat point spent via the STAT_ALLOCATION menu (M key) grants a
// flat bonus layered on top of equipment/enchant bonuses.
export const STR_ATK_PER_POINT = 1;
export const VIT_HP_PER_POINT = 5;
export const DEF_DEF_PER_POINT = 1;
export const POINTS_PER_LEVEL = 2;
export const STARTING_STAT_POINTS = 10;

export function xpForLevel(level: number): number {
  return 50 + (level - 1) * 30;
}

// Grants XP, applying every level-up it crosses (a single big reward can
// chain multiple levels). Returns the number of levels gained, so callers
// can surface a toast.
export function grantXp(state: GameStateData, amount: number): number {
  state.player.xp += amount;
  let levelsGained = 0;
  while (state.player.xp >= state.player.xpToNext) {
    state.player.xp -= state.player.xpToNext;
    state.player.level += 1;
    state.player.statPoints += POINTS_PER_LEVEL;
    state.player.xpToNext = xpForLevel(state.player.level);
    levelsGained++;
  }
  return levelsGained;
}

// Stacks a set of short-lived toast notifications so simultaneous rewards
// (e.g. a boss dropping two items at once) show as a list instead of
// overwriting each other via the single uiMessage field.
export function pushMessages(state: GameStateData, texts: string[], tier?: ItemTier) {
  for (const text of texts) {
    state.messageStack.push({ text, timer: 150, tier });
  }
  // cap so the stack never grows unbounded
  if (state.messageStack.length > 6) state.messageStack.splice(0, state.messageStack.length - 6);
}

// ── SHOPS ──────────────────────────────────────────────────────────
export const SHOPS: Record<string, { title: string; items: string[] }> = {
  'zara':         { title: "Zara's Memory Emporium",    items: ['crystal', 'elixir', 'ward', 'spark', 'stone', 'dust', 'rusty_shard', 'iron_fragment', 'cloth_wrap', 'hide_wrap'] },
  'old_thom':     { title: "Old Thom's Sunken Wares",   items: ['elixir', 'greater_crystal', 'ward', 'dust', 'bone_edge', 'etched_spike', 'traveler_cloak', 'runed_cloak'] },
  'peddler_oren': { title: "Oren's Frostbound Pack",    items: ['greater_crystal', 'memory_salve', 'phoenix_ash', 'spark', 'blink_shard', 'etched_spike', 'runed_cloak'] },
  'ashen_trader': { title: 'The Ashen Trader',          items: ['greater_crystal', 'memory_salve', 'phoenix_ash', 'iron_ward', 'spark', 'blink_shard', 'traveler_cloak'] },
  // Enchanted tomes are no longer for sale — they're earned through side quests now.
  'relic_broker': { title: "Crestfall Relic Broker",    items: ['crystal', 'elixir', 'greater_crystal', 'ward', 'iron_ward', 'spark', 'dust'] },
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
  },
  // ── Easter-egg dungeon boss (secret building beneath Crestfall) ──
  'echo_warden': {
    id: 'echo_warden', name: 'The Echo Warden', hp: 55, maxHp: 55, atk: 11, color: '#6d28d9',
    flavor: 'It has guarded this hollow since before the city had a name.',
    rememberText: 'It lowers its guard. "...you may have it, then. Few come looking."',
    echoes: 90, acts: [
      { id: 'guard', name: 'Guard', effect: 'weaken', power: 2 },
      { id: 'reckon', name: 'Reckon', effect: 'resonance', power: 1 },
    ]
  },
  // ── Ring boss (Ashfall Ring, second city) ──
  'ring_boss': {
    id: 'ring_boss', name: 'The Ringkeeper', hp: 85, maxHp: 85, atk: 16, color: '#0ea5e9',
    flavor: 'It circles the ring endlessly, bound to a blessing it can no longer use.',
    rememberText: 'It stops circling for the first time in memory. "...take it. I was only ever waiting for someone."',
    echoes: 160, acts: [
      { id: 'circle', name: 'Circle', effect: 'damage', power: 7 },
      { id: 'bind', name: 'Bind', effect: 'confuse' },
      { id: 'entreat', name: 'Entreat', effect: 'resonance', power: 1 },
    ]
  },
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

// ── PROCEDURAL CITY BLOCK HELPERS ────────────────────────────────────
// Used by both Crestfall City (100×100) and Ashfall Ring (50×50) to lay
// out a grid of streets and drop buildings into the resulting blocks,
// each with a recorded door tile so the caller can wire up MAPS doors.
interface BlockPlacement { role: string; ox: number; oy: number; w: number; h: number; doorX: number; doorY: number; bx: number; by: number; }

function bandStart(i: number, spacing: number) { return i * spacing + 1; }

function placeBuilding(L: string[][], bx: number, by: number, spacing: number, w: number, h: number): { ox: number; oy: number; doorX: number; doorY: number } {
  const ox = bandStart(bx, spacing) + 1;
  const oy = bandStart(by, spacing) + 1;
  rect(L, ox, oy, ox + w - 1, oy + h - 1, 'H');
  const doorX = ox + Math.floor(w / 2);
  const doorY = oy + h - 1;
  return { ox, oy, doorX, doorY };
}

// ── CRESTFALL CITY (100 × 100) — a sprawling city of streets and blocks ──
function buildCTFull(): { layout: string[][]; placements: Record<string, BlockPlacement> } {
  const W = 100, H = 100;
  const SPACING = 10;
  const BLOCKS = 10;
  const L = buildMap(W, H, 'G');
  rect(L, 0, 0, W - 1, 0, 'W'); rect(L, 0, H - 1, W - 1, H - 1, 'W');
  vline(L, 0, 0, H - 1, 'W'); vline(L, W - 1, 0, H - 1, 'W');

  for (let i = 1; i < BLOCKS; i++) {
    hline(L, i * SPACING, 1, W - 2, 'P');
    vline(L, i * SPACING, 1, H - 2, 'P');
  }

  // central plaza — void seeping into the heart of the city
  const cx = 50, cy = 50;
  rect(L, cx - 8, cy - 6, cx + 8, cy + 6, 'V');
  for (let i = -2; i <= 2; i++) poke(L, cx + i * 2, cy, 'M');

  // west gate -> Verdant Hollow
  poke(L, 0, cy, '<'); poke(L, 1, cy, 'P');

  // Named/quest roles are spread evenly across every block in the city
  // (instead of filling the grid row-by-row) so quest-givers, notable
  // houses, and the secret entrance don't all cluster into the first
  // couple of rows — they should feel scattered through the whole city.
  const specialRoles: string[] = [
    'scholar', 'abandoned', 'study', 'wardenoffice', 'shelter',
    ...Array.from({ length: 10 }, (_, i) => `sq${i + 1}`),
    'secret', 'ashdoor',
    ...Array.from({ length: 5 }, (_, i) => `note${i + 1}`),
  ];
  const miscRoles: string[] = Array.from({ length: 74 }, (_, i) => `misc${i + 1}`);

  const positions: { bx: number; by: number }[] = [];
  for (let by = 0; by < BLOCKS; by++) {
    for (let bx = 0; bx < BLOCKS; bx++) {
      // skip the plaza blocks
      if (bx >= 4 && bx <= 5 && by >= 4 && by <= 5) continue;
      positions.push({ bx, by });
    }
  }

  const placements: Record<string, BlockPlacement> = {};
  const usedIdx = new Set<number>();

  specialRoles.forEach((role, i) => {
    const idx = Math.min(positions.length - 1, Math.floor((i * positions.length) / specialRoles.length));
    usedIdx.add(idx);
    const { bx, by } = positions[idx];
    const big = role === 'scholar' || role === 'abandoned';
    const size = big ? 7 : 5;
    const { ox, oy, doorX, doorY } = placeBuilding(L, bx, by, SPACING, size, size);
    placements[role] = { role, ox, oy, w: size, h: size, doorX, doorY, bx, by };
  });

  let mi = 0;
  for (let idx = 0; idx < positions.length && mi < miscRoles.length; idx++) {
    if (usedIdx.has(idx)) continue;
    const role = miscRoles[mi++];
    const { bx, by } = positions[idx];
    const { ox, oy, doorX, doorY } = placeBuilding(L, bx, by, SPACING, 5, 5);
    placements[role] = { role, ox, oy, w: 5, h: 5, doorX, doorY, bx, by };
  }

  return { layout: L, placements };
}

// ── ASHFALL RING (50 × 50) — the second city, reached through the stairs beneath Crestfall ──
function buildARFull(): { layout: string[][]; placements: Record<string, BlockPlacement> } {
  const W = 50, H = 50;
  const SPACING = 10;
  const BLOCKS = 5;
  const L = buildMap(W, H, 'V'); // ash-choked ground
  rect(L, 0, 0, W - 1, 0, 'W'); rect(L, 0, H - 1, W - 1, H - 1, 'W');
  vline(L, 0, 0, H - 1, 'W'); vline(L, W - 1, 0, H - 1, 'W');

  for (let i = 1; i < BLOCKS; i++) {
    hline(L, i * SPACING, 1, W - 2, 'P');
    vline(L, i * SPACING, 1, H - 2, 'P');
  }

  // the return portal down to the stairs beneath Crestfall
  poke(L, 0, 20, '<'); poke(L, 1, 20, 'P');

  // The central mansion sits directly north of the ash plaza — the heart of Ashfall.
  const { ox: manOx, oy: manOy, doorX: manDoorX, doorY: manDoorY } = placeBuilding(L, 2, 1, SPACING, 8, 8);
  const placements: Record<string, BlockPlacement> = {
    arena: { role: 'arena', ox: manOx, oy: manOy, w: 8, h: 8, doorX: manDoorX, doorY: manDoorY, bx: 2, by: 1 },
  };

  const roleQueue: string[] = Array.from({ length: 10 }, (_, i) => `misc${i + 1}`);

  let qi = 0;
  for (let by = 0; by < BLOCKS && qi < roleQueue.length; by++) {
    for (let bx = 0; bx < BLOCKS && qi < roleQueue.length; bx++) {
      if (bx === 0 && by === 2) continue; // keep the portal lane clear
      if (bx === 2 && by === 2) continue; // center block reserved as ash plaza
      if (bx === 2 && by === 1) continue; // reserved for the central mansion
      const role = roleQueue[qi++];
      const { ox, oy, doorX, doorY } = placeBuilding(L, bx, by, SPACING, 5, 5);
      placements[role] = { role, ox, oy, w: 5, h: 5, doorX, doorY, bx, by };
    }
  }

  // ash plaza decor at the center block
  rect(L, 22, 22, 27, 27, 'V');
  poke(L, 24, 24, 'M'); poke(L, 25, 25, 'M');

  return { layout: L, placements };
}

// ── HOUSE INTERIOR (14 × 9) — real furnished rooms, several variants
function buildInterior(variant: 'scholar' | 'abandoned' | 'study' | 'quiet' | 'misc' | 'secret'): string[][] {
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
  } else if (variant === 'quiet' || variant === 'misc') {
    poke(L, 3, 6, 'M'); poke(L, W - 4, 6, 'M');
  } else if (variant === 'secret') {
    // A back room hides the entrance to the dungeon below.
    rect(L, 1, 2, 3, 5, 'W');
    poke(L, 2, 4, 'P');
  }
  poke(L, Math.floor(W / 2), H - 1, '<');
  return L;
}

// ── BIG HOUSE INTERIOR (20 × 14) — for buildings with a second floor
function buildBigInterior(): string[][] {
  const W = 20, H = 14;
  const L = buildMap(W, H, 'W');
  rect(L, 1, 1, W - 2, H - 2, 'P');
  rect(L, 8, 4, 11, 6, 'W');
  poke(L, 9, 4, 'M'); poke(L, 10, 4, 'M');
  rect(L, 2, 2, 4, 3, 'W'); rect(L, W - 5, 2, W - 3, 3, 'W');
  poke(L, 4, 10, 'ST'); // stairs up to the second floor
  poke(L, Math.floor(W / 2), H - 1, '<');
  return L;
}

// ── UPPER FLOOR (14 × 9) — reached by stairs from a big interior
function buildUpperFloor(): string[][] {
  const W = 14, H = 9;
  const L = buildMap(W, H, 'W');
  rect(L, 1, 1, W - 2, H - 2, 'P');
  rect(L, 5, 3, 8, 4, 'W');
  poke(L, 6, 3, 'M');
  poke(L, Math.floor(W / 2), H - 1, 'ST'); // stairs down
  return L;
}

// ── SECRET DUNGEON (16 × 12) — beneath the secret building
function buildSecretDungeon(): string[][] {
  const W = 16, H = 12;
  const L = buildMap(W, H, 'V');
  rect(L, 0, 0, W - 1, 0, 'W'); rect(L, 0, H - 1, W - 1, H - 1, 'W');
  vline(L, 0, 0, H - 1, 'W'); vline(L, W - 1, 0, H - 1, 'W');
  rect(L, 2, 2, 13, 9, 'P');
  rect(L, 6, 5, 9, 6, 'W');
  poke(L, 3, 3, 'M'); poke(L, 12, 3, 'M');
  poke(L, 3, 8, 'M'); poke(L, 12, 8, 'M');
  poke(L, 7, 10, '<'); // back up to the secret building
  return L;
}

// ── STAIRWAY INTO ASH (16 × 12) — the dark passage beneath the House Marked in Ash ──
function buildAshfallStairs(): string[][] {
  const W = 16, H = 12;
  const L = buildMap(W, H, 'V');
  rect(L, 0, 0, W - 1, 0, 'W'); rect(L, 0, H - 1, W - 1, H - 1, 'W');
  vline(L, 0, 0, H - 1, 'W'); vline(L, W - 1, 0, H - 1, 'W');
  rect(L, 4, 1, 11, H - 2, 'P');
  poke(L, 5, 3, 'M'); poke(L, 10, 3, 'M'); poke(L, 5, 8, 'M'); poke(L, 10, 8, 'M');
  poke(L, 8, 1, '@');      // a portal, waiting at the bottom of the stairs
  poke(L, 8, H - 2, '<');  // stairs back up to the house above
  return L;
}

// ── RING ARENA — ground floor (14×9) and boss floor (16×12) ──
function buildArenaGround(): string[][] {
  const W = 14, H = 9;
  const L = buildMap(W, H, 'W');
  rect(L, 1, 1, W - 2, H - 2, 'P');
  poke(L, 4, 4, 'ST');
  poke(L, Math.floor(W / 2), H - 1, '<');
  return L;
}
function buildArenaBoss(): string[][] {
  const W = 16, H = 12;
  const L = buildMap(W, H, 'V');
  rect(L, 0, 0, W - 1, 0, 'W'); rect(L, 0, H - 1, W - 1, H - 1, 'W');
  vline(L, 0, 0, H - 1, 'W'); vline(L, W - 1, 0, H - 1, 'W');
  rect(L, 2, 2, 13, 9, 'P');
  for (const [cx, cyy] of [[3, 3], [12, 3], [3, 8], [12, 8]]) poke(L, cx, cyy, 'M');
  poke(L, 7, 10, 'ST'); poke(L, 8, 10, 'ST');
  return L;
}

// ── SOUTH ROAD (18 × 34) — the endgame road: forest, then dirt road, then a clearing
// that opens into Color. Only reachable once the main story is 100% complete
// (see VH's '<' exit, gated on quest_main reqState 7).
function buildSR(): string[][] {
  const W = 18, H = 34;
  const L = buildMap(W, H, 'T');

  // The path runs the full length of the road, from the Verdant Hollow gate
  // in the north down to the clearing that opens into Color in the south.
  rect(L, 7, 0, 10, H - 1, 'P');

  // ── Zone 1: FOREST (rows 0-9) — dense trees pressing in on a narrow dirt path ──
  rect(L, 4, 0, 6, 9, 'G');  rect(L, 11, 0, 13, 9, 'G');
  rect(L, 7, 0, 10, 9, 'P');
  for (const [tx, ty] of [[5, 1], [12, 1], [4, 4], [13, 4], [5, 7], [12, 7], [6, 3], [11, 6]]) poke(L, tx, ty, 'T');

  // ── Zone 2: DIRT ROAD (rows 10-20) — the forest thins; trees and grass line the road ──
  rect(L, 3, 10, 14, 20, 'G');
  rect(L, 7, 10, 10, 20, 'P');
  for (const [tx, ty] of [[3, 11], [14, 11], [4, 14], [13, 14], [3, 17], [14, 17], [5, 19], [12, 19], [4, 20], [13, 20]]) poke(L, tx, ty, 'T');

  // ── Zone 3: CLEARING (rows 21-33) — the forest opens; the road widens toward Color ──
  rect(L, 2, 21, 15, H - 1, 'G');
  rect(L, 7, 21, 10, H - 1, 'P');
  // A few last trees at the clearing's edge, then nothing but open ground.
  for (const [tx, ty] of [[2, 22], [15, 22], [2, 26], [15, 26]]) poke(L, tx, ty, 'T');

  // North exit — back to Verdant Hollow (sealed until the Void is defeated)
  poke(L, 8, 0, '<');
  // South exit — the clearing opens into Color
  poke(L, 8, H - 1, '>');
  return L;
}

// ── COLOR (22 × 18) — a peaceful village at the end of the South Road. Unusually
// vibrant green grass ('CG') everywhere — the only place in the Realm where color
// still lives. No quests here; just people who are, finally, at rest. ──
function buildCO(): string[][] {
  const W = 22, H = 18;
  const L = buildMap(W, H, 'CG');
  // Soft tree border — the village is sheltered, not walled
  rect(L, 0, 0, W - 1, 0, 'T'); rect(L, 0, H - 1, W - 1, H - 1, 'T');
  vline(L, 0, 0, H - 1, 'T'); vline(L, W - 1, 0, H - 1, 'T');

  // A quiet path leading in from the north road, widening into the village square
  vline(L, 11, 1, 6, 'P');
  rect(L, 8, 7, 13, 10, 'P');

  // A few small, warm cottages around the square (decorative — this is a place
  // to rest, not another dungeon to clear)
  rect(L, 3, 3, 6, 5, 'H');
  rect(L, 15, 3, 18, 5, 'H');
  rect(L, 3, 12, 6, 14, 'H');
  rect(L, 15, 12, 18, 14, 'H');

  // Scattered trees for atmosphere, never blocking the paths
  for (const [tx, ty] of [[2, 8], [19, 8], [10, 15], [12, 2]]) poke(L, tx, ty, 'T');

  // North exit — back up the South Road
  poke(L, 11, 0, '<');
  return L;
}

const vhLayout = buildVH();
const srLayout = buildSR();
const coLayout = buildCO();
const wwLayout = buildWW();
const msLayout = buildMS();
const saLayout = buildSA();
const frLayout = buildFR();
const adLayout = buildAD();
const vnLayout = buildVN();
const ctBuild = buildCTFull();
const ctLayout = ctBuild.layout;
const ctP = ctBuild.placements;
const arBuild = buildARFull();
const arLayout = arBuild.layout;
const arP = arBuild.placements;

const ctH1Layout = buildBigInterior();          // Scholar's Refuge (2 floors)
const ctH1F2Layout = buildUpperFloor();
const ctH2Layout = buildBigInterior();          // Abandoned Home (2 floors)
const ctH2F2Layout = buildUpperFloor();
const ctH3Layout = buildInterior('study');
const ctH4Layout = buildInterior('quiet');
const ctH5Layout = buildInterior('quiet');
const ctSecretLayout = buildInterior('secret');
const secretDungeonLayout = buildSecretDungeon();
const arenaGroundLayout = buildArenaGround();
const arenaBossLayout = buildArenaBoss();

// A House Marked in Ash — an ordinary room hiding a dark staircase down.
const ctAshdoorLayout = buildInterior('quiet');
poke(ctAshdoorLayout, 2, 4, 'ST');
const ashfallStairsLayout = buildAshfallStairs();

// Generic side-quest interiors and note-holding interiors — reuse the misc variant.
const sqInteriors: Record<string, string[][]> = {};
for (let i = 1; i <= 10; i++) sqInteriors[`sq${i}`] = buildInterior('misc');
const noteInteriors: Record<string, string[][]> = {};
for (let i = 1; i <= 5; i++) noteInteriors[`note${i}`] = buildInterior('misc');
const miscInteriors: Record<string, string[][]> = {};
for (let i = 1; i <= 74; i++) miscInteriors[`misc${i}`] = buildInterior('quiet');
const arMiscInteriors: Record<string, string[][]> = {};
for (let i = 1; i <= 10; i++) arMiscInteriors[`misc${i}`] = buildInterior('misc');

// ── CITY SIDE QUESTS ──────────────────────────────────────────────
// Data-driven so the 10 buildings scattered through Crestfall don't
// each need hand-written dialogue — see dialogue.ts's generic handler.
export interface CitySideQuest {
  id: string;             // suffix — full quest id is `quest_${id}`
  npcId: string;
  npcName: string;
  title: string;
  giverIntro: string;
  progressText: string;
  completeText: string;
  afterText: string;
  requiredKills: number;
  enemyPool: string[];
  rewardPool: { itemId: string; chance: number }[];
  echoes: number;
}

export const CITY_SIDE_QUESTS: CitySideQuest[] = [
  { id: 'sq1', npcId: 'npc_sq1', npcName: 'A Tired Locksmith', title: 'Locks Without Doors',
    giverIntro: "Every lock in this quarter still works. Trouble is, half the shades wandering out there don't remember which door is theirs. Thin them out, would you?",
    progressText: 'Still a few shades pacing the block out there.', completeText: "You've quieted the block. Here — I never use this anymore.",
    afterText: 'Quiet enough now. Thank you.', requiredKills: 2, enemyPool: ['city_shade'],
    rewardPool: [{ itemId: 'ench_shard_frostbite', chance: 0.6 }, { itemId: 'ench_grimoire_striking', chance: 0.3 }, { itemId: 'ench_relic_ashbound', chance: 0.1 }], echoes: 40 },
  { id: 'sq2', npcId: 'npc_sq2', npcName: 'A Boarded-Up Baker', title: "Flour and Silence",
    giverIntro: "I used to hear the street wraiths pacing at night through these boards. Can't sleep. If you'd silence a few, I'd sleep, and I'd pay you for the privilege.",
    progressText: 'Still pacing out there, some nights.', completeText: "Silence, finally. Take this — payment, and thanks.",
    afterText: 'I slept last night. First time in weeks.', requiredKills: 3, enemyPool: ['street_wraith'],
    rewardPool: [{ itemId: 'ench_veil_dust', chance: 0.6 }, { itemId: 'ench_tome_iron_veil', chance: 0.3 }, { itemId: 'ench_codex_living_flame', chance: 0.1 }], echoes: 50 },
  { id: 'sq3', npcId: 'npc_sq3', npcName: "A Retired Guard", title: 'One Last Post',
    giverIntro: "I used to stand post two streets from here. A Hollow Guard's still standing mine, I think — never relieved. Relieve him, one way or another.",
    progressText: "He's still standing his post, poor thing.", completeText: "Relieved at last. Take my old kit — I've no more use for it.",
    afterText: 'Post is empty now. As it should be.', requiredKills: 1, enemyPool: ['hollow_guard'],
    rewardPool: [{ itemId: 'ench_grimoire_striking', chance: 0.5 }, { itemId: 'ench_tome_iron_veil', chance: 0.4 }, { itemId: 'ench_relic_ashbound', chance: 0.1 }], echoes: 60 },
  { id: 'sq4', npcId: 'npc_sq4', npcName: 'A Nervous Clerk', title: 'The Ledger Alley',
    giverIntro: "The alley behind the old records office is thick with shades. I need to get back in there for the deeds. Clear a path?",
    progressText: 'Still too many out there for me.', completeText: "Path's clear. Here, take this — found it while filing.",
    afterText: "I got my deeds back, thanks to you.", requiredKills: 3, enemyPool: ['city_shade', 'street_wraith'],
    rewardPool: [{ itemId: 'ench_shard_frostbite', chance: 0.5 }, { itemId: 'ench_veil_dust', chance: 0.4 }, { itemId: 'ench_codex_living_flame', chance: 0.1 }], echoes: 45 },
  { id: 'sq5', npcId: 'npc_sq5', npcName: 'An Old Gardener', title: "Weeds and Wraiths",
    giverIntro: "My garden's overgrown with more than weeds these days. A couple of wraiths took root by the fence. Dig them out?",
    progressText: 'Still rooted by the fence, last I checked.', completeText: "Cleared! Here — this has been in my shed for years, might as well be useful.",
    afterText: 'The garden feels like mine again.', requiredKills: 2, enemyPool: ['street_wraith'],
    rewardPool: [{ itemId: 'ench_veil_dust', chance: 0.55 }, { itemId: 'ench_grimoire_striking', chance: 0.35 }, { itemId: 'ench_relic_ashbound', chance: 0.1 }], echoes: 45 },
  { id: 'sq6', npcId: 'npc_sq6', npcName: 'A Shaken Courier', title: "Undeliverable Mail",
    giverIntro: "I've got letters three years undelivered because the route's crawling with shades. If you cleared it, I could finally close out my route.",
    progressText: 'Route is still too dangerous.', completeText: "Route's clear — finally. Take this, it's the least I owe you.",
    afterText: 'Delivered every last letter. Feels good.', requiredKills: 3, enemyPool: ['city_shade'],
    rewardPool: [{ itemId: 'ench_shard_frostbite', chance: 0.6 }, { itemId: 'ench_tome_iron_veil', chance: 0.3 }, { itemId: 'ench_relic_ashbound', chance: 0.1 }], echoes: 50 },
  { id: 'sq7', npcId: 'npc_sq7', npcName: 'A Watchful Widow', title: "The Empty Rocking Chair",
    giverIntro: "A Hollow Guard patrols right past my window every night, same time, like clockwork. It's not him I'm afraid of. It's the memory of who used to walk that route. End his round, gently.",
    progressText: 'Still walking his round, same as ever.', completeText: "Thank you for ending it kindly. Take this, for your trouble.",
    afterText: 'The street is finally still at night.', requiredKills: 1, enemyPool: ['hollow_guard'],
    rewardPool: [{ itemId: 'ench_tome_iron_veil', chance: 0.5 }, { itemId: 'ench_grimoire_striking', chance: 0.4 }, { itemId: 'ench_codex_living_flame', chance: 0.1 }], echoes: 55 },
  { id: 'sq8', npcId: 'npc_sq8', npcName: 'A Restless Apprentice', title: "Unfinished Errand",
    giverIntro: "My master sent me on an errand the day the Void came through. I never finished it — too many shades between here and the market square. Would you clear the way?",
    progressText: 'Still too many shades on the route.', completeText: "Errand complete, three years late. Here, take this for helping me finish it.",
    afterText: "I can finally stop carrying that errand around.", requiredKills: 3, enemyPool: ['city_shade', 'hollow_guard'],
    rewardPool: [{ itemId: 'ench_veil_dust', chance: 0.5 }, { itemId: 'ench_relic_ashbound', chance: 0.4 }, { itemId: 'ench_codex_living_flame', chance: 0.1 }], echoes: 60 },
  { id: 'sq9', npcId: 'npc_sq9', npcName: 'A Quiet Fisherman', title: "Nets in the Canal",
    giverIntro: "The old canal draws wraiths like fish to a net. I can't check my traps without one snapping at me. Clear a few and I'll pay you in whatever I've got left.",
    progressText: 'Still too many wraiths by the water.', completeText: "Nets are clear. Here — my last good hook, and this.",
    afterText: "Caught something good today. First time in a while.", requiredKills: 2, enemyPool: ['street_wraith'],
    rewardPool: [{ itemId: 'ench_shard_frostbite', chance: 0.55 }, { itemId: 'ench_veil_dust', chance: 0.35 }, { itemId: 'ench_relic_ashbound', chance: 0.1 }], echoes: 40 },
  { id: 'sq10', npcId: 'npc_sq10', npcName: 'The Last Lamplighter', title: "Keep the Lanterns Lit",
    giverIntro: "I still light the lanterns every night, even with no one left to see them. The Guards keep knocking them over on their rounds. End a couple of their rounds for me?",
    progressText: 'The lanterns keep getting knocked over.', completeText: "The lanterns stayed lit tonight. First time in ages. Take this — you earned it.",
    afterText: 'The streets glow again, at least a little.', requiredKills: 2, enemyPool: ['hollow_guard', 'street_wraith'],
    rewardPool: [{ itemId: 'ench_relic_ashbound', chance: 0.45 }, { itemId: 'ench_codex_living_flame', chance: 0.45 }, { itemId: 'ench_grimoire_striking', chance: 0.1 }], echoes: 70 },
];

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
      '!': { mapId: 'CT', x: 1, y: 50 },
      '<': { mapId: 'SR', x: 8, y: 1, reqQuest: 'quest_main', reqState: 7, lockMsg: "The south road is sealed until the Void is defeated." }
    }
  },

  // ── SOUTH ROAD (18 × 34) — the endgame road: forest, dirt road, then a clearing
  // opening into Color. Only unlocked at 100% main story completion. ──
  'SR': {
    id: 'SR', name: 'South Road', width: 18, height: 34,
    layout: srLayout,
    npcs: [],
    chests: [],
    doors: [],
    books: [],
    encounterPool: [],
    exits: {
      '<': { mapId: 'VH', x: 12, y: 14 },
      '>': { mapId: 'CO', x: 11, y: 1 },
    }
  },

  // ── COLOR (22 × 18) — the peaceful village at the end of the South Road ──
  'CO': {
    id: 'CO', name: 'Color', width: 22, height: 18,
    layout: coLayout,
    npcs: [
      { id: 'morthus',    x: 11, y: 11, color: '#7fd68a', name: 'Morthus',    type: 'TALK' },
      { id: 'co_child',   x: 5,  y: 8,  color: '#bde8c2', name: 'A Child',    type: 'TALK' },
      { id: 'co_gardener',x: 17, y: 8,  color: '#a6d9ac', name: 'A Gardener', type: 'TALK' },
      { id: 'co_elder',   x: 8,  y: 13, color: '#cfeed3', name: 'An Elder',   type: 'TALK' },
      { id: 'co_weaver',  x: 13, y: 13, color: '#9fd6a6', name: 'A Weaver',   type: 'TALK' },
    ],
    chests: [],
    doors: [],
    books: [],
    encounterPool: [],
    exits: {
      '<': { mapId: 'SR', x: 8, y: 32 },
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
      '>': { mapId: 'MS', x: 9, y: 12, reqQuest: 'quest_main', reqState: 2, lockMsg: "The Sanctum is sealed. Restore the village first." },
      '<': { mapId: 'VH', x: 12, y: 1 }
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
      '>': { mapId: 'SA', x: 9, y: 12, reqQuest: 'quest_main', reqState: 3, lockMsg: "Something ancient still guards this passage." }
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
      '>': { mapId: 'FR', x: 10, y: 13, reqQuest: 'quest_main', reqState: 4, lockMsg: "Old Vess hasn't opened this way yet." }
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
      '>': { mapId: 'AD', x: 10, y: 13, reqQuest: 'quest_main', reqState: 5, lockMsg: "Warden Kess hasn't opened this road yet." }
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
      '<': { mapId: 'AD', x: 10, y: 1 }
    }
  },

  // ── CRESTFALL CITY (100 × 100) — a sprawling city of streets and blocks ──
  'CT': {
    id: 'CT', name: 'Crestfall City', width: 100, height: 100,
    layout: ctLayout,
    npcs: [
    ],
    chests: [
      { id: 'ch_ct1',      flag: 'ch_ct1',      x: 50,  y: 46, item: 'echoes_80' },
      { id: 'ch_ct_note',  flag: 'ch_ct_note',  x: 52,  y: 54,  item: 'book_forgotten_flyer' },
      ...Array.from({ length: 5 }, (_, i) => {
        const p = ctP[`note${i + 1}`];
        return { id: `ch_ct_trail${i + 1}`, flag: `trail_note_${i + 1}`, x: p.doorX, y: p.doorY + 1, item: `book_trail_note_${i + 1}` };
      }),
    ],
    // doors: enterable buildings. Player must be adjacent (manhattan dist = 1) to enter.
    doors: [
      { id: 'door_h1', x: ctP.scholar.doorX,      y: ctP.scholar.doorY,      targetMapId: 'CT_H1',     targetX: 10, targetY: 12, label: "Scholar's Refuge" },
      { id: 'door_h2', x: ctP.abandoned.doorX,    y: ctP.abandoned.doorY,    targetMapId: 'CT_H2',     targetX: 10, targetY: 12, label: "Abandoned Home" },
      { id: 'door_h3', x: ctP.study.doorX,        y: ctP.study.doorY,        targetMapId: 'CT_H3',     targetX: 7,  targetY: 6,  label: "Old Study" },
      { id: 'door_h4', x: ctP.wardenoffice.doorX, y: ctP.wardenoffice.doorY, targetMapId: 'CT_H4',     targetX: 7,  targetY: 6,  label: "Warden's Old Office" },
      { id: 'door_h5', x: ctP.shelter.doorX,      y: ctP.shelter.doorY,      targetMapId: 'CT_H5',     targetX: 7,  targetY: 6,  label: "Survivor's Shelter" },
      { id: 'door_secret', x: ctP.secret.doorX,   y: ctP.secret.doorY,       targetMapId: 'CT_SECRET', targetX: 7,  targetY: 6,  label: "A Quiet House" },
      { id: 'door_ashdoor', x: ctP.ashdoor.doorX, y: ctP.ashdoor.doorY,      targetMapId: 'CT_ASHDOOR', targetX: 7, targetY: 6,  label: "A House Marked in Ash" },
      ...CITY_SIDE_QUESTS.map(sq => ({ id: `door_${sq.id}`, x: ctP[sq.id].doorX, y: ctP[sq.id].doorY, targetMapId: `CT_${sq.id.toUpperCase()}`, targetX: 7, targetY: 6, label: sq.title })),
      ...Array.from({ length: 5 }, (_, i) => ({ id: `door_note${i + 1}`, x: ctP[`note${i + 1}`].doorX, y: ctP[`note${i + 1}`].doorY, targetMapId: `CT_NOTE${i + 1}`, targetX: 7, targetY: 6, label: 'An Old House' })),
      ...Array.from({ length: 74 }, (_, i) => ({ id: `door_misc${i + 1}`, x: ctP[`misc${i + 1}`].doorX, y: ctP[`misc${i + 1}`].doorY, targetMapId: `CT_MISC${i + 1}`, targetX: 7, targetY: 6, label: 'A House' })),
    ],
    books: [],
    encounterPool: ['city_shade', 'street_wraith', 'hollow_guard'],
    exits: {
      '<': { mapId: 'VH', x: 22, y: 8 },
    }
  },

  // ── SCHOLAR'S REFUGE (20 × 14, 2 floors) ──
  'CT_H1': {
    id: 'CT_H1', name: "Scholar's Refuge", width: 20, height: 14,
    layout: ctH1Layout,
    npcs: [],
    chests: [
      { id: 'ch_h1_book', flag: 'ch_h1_book', x: 3,  y: 2, item: 'book_keepers_codex' },
    ],
    doors: [ { id: 'stairs_h1', x: 4, y: 10, targetMapId: 'CT_H1_F2', targetX: 7, targetY: 7, label: 'Stairs Up' } ],
    books: [],
    encounterPool: [],
    exits: { '<': { mapId: 'CT', x: ctP.scholar.doorX, y: ctP.scholar.doorY + 1 } }
  },
  'CT_H1_F2': {
    id: 'CT_H1_F2', name: "Scholar's Refuge — Upper Floor", width: 14, height: 9,
    layout: ctH1F2Layout,
    npcs: [],
    chests: [ { id: 'ch_h1_f2', flag: 'ch_h1_f2', x: 10, y: 1, item: 'book_forgotten_verse' } ],
    doors: [ { id: 'stairs_h1_down', x: 7, y: 8, targetMapId: 'CT_H1', targetX: 4, targetY: 9, label: 'Stairs Down' } ],
    books: [],
    encounterPool: [],
    exits: {}
  },

  // ── ABANDONED HOME (20 × 14, 2 floors) ──
  'CT_H2': {
    id: 'CT_H2', name: 'Abandoned Home', width: 20, height: 14,
    layout: ctH2Layout,
    npcs: [],
    chests: [
      { id: 'ch_h2_letter', flag: 'ch_h2_letter', x: 3,  y: 2, item: 'book_childs_letter' },
    ],
    doors: [ { id: 'stairs_h2', x: 4, y: 10, targetMapId: 'CT_H2_F2', targetX: 7, targetY: 7, label: 'Stairs Up' } ],
    books: [],
    encounterPool: [],
    exits: { '<': { mapId: 'CT', x: ctP.abandoned.doorX, y: ctP.abandoned.doorY + 1 } }
  },
  'CT_H2_F2': {
    id: 'CT_H2_F2', name: 'Abandoned Home — Upper Floor', width: 14, height: 9,
    layout: ctH2F2Layout,
    npcs: [],
    chests: [ { id: 'ch_h2_f2', flag: 'ch_h2_f2', x: 10, y: 1, item: 'echoes_50' } ],
    doors: [ { id: 'stairs_h2_down', x: 7, y: 8, targetMapId: 'CT_H2', targetX: 4, targetY: 9, label: 'Stairs Down' } ],
    books: [],
    encounterPool: [],
    exits: {}
  },

  // ── OLD STUDY (14 × 9 interior) ──
  'CT_H3': {
    id: 'CT_H3', name: "Old Study", width: 14, height: 9,
    layout: ctH3Layout,
    npcs: [{ id: 'relic_broker', x: 7, y: 4, color: '#ffcc88', name: 'Relic Broker', type: 'SHOP' }],
    chests: [
      { id: 'ch_h3_cipher', flag: 'ch_h3_cipher', x: 3,  y: 1, item: 'book_cipher_note' },
      { id: 'ch_h3_ledger', flag: 'ch_h3_ledger', x: 10, y: 1, item: 'book_merchants_ledger' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: { '<': { mapId: 'CT', x: ctP.study.doorX, y: ctP.study.doorY + 1 } }
  },

  // ── WARDEN'S OLD OFFICE (14 × 9 interior) ──
  'CT_H4': {
    id: 'CT_H4', name: "Warden's Old Office", width: 14, height: 9,
    layout: ctH4Layout,
    npcs: [{ id: 'city_warden', x: 7, y: 4, color: '#aaaaff', name: 'City Warden', type: 'TALK' }],
    chests: [
      { id: 'ch_h4_report', flag: 'ch_h4_report', x: 3,  y: 1, item: 'book_wardens_report' },
      { id: 'ch_h4_tonic',  flag: 'ch_h4_tonic',  x: 10, y: 1, item: 'tonic' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: { '<': { mapId: 'CT', x: ctP.wardenoffice.doorX, y: ctP.wardenoffice.doorY + 1 } }
  },

  // ── SURVIVOR'S SHELTER (14 × 9 interior) ──
  'CT_H5': {
    id: 'CT_H5', name: "Survivor's Shelter", width: 14, height: 9,
    layout: ctH5Layout,
    npcs: [{ id: 'city_survivor', x: 7, y: 4, color: '#cccccc', name: 'A Survivor', type: 'TALK' }],
    chests: [
      { id: 'ch_h5_diary',   flag: 'ch_h5_diary',   x: 3,  y: 1, item: 'book_survivors_diary' },
      { id: 'ch_h5_crystal', flag: 'ch_h5_crystal', x: 10, y: 1, item: 'crystal' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: { '<': { mapId: 'CT', x: ctP.shelter.doorX, y: ctP.shelter.doorY + 1 } }
  },

  // ── A QUIET HOUSE (secret — hides the entrance to the dungeon below) ──
  'CT_SECRET': {
    id: 'CT_SECRET', name: 'A Quiet House', width: 14, height: 9,
    layout: ctSecretLayout,
    npcs: [],
    chests: [],
    doors: [],
    books: [],
    encounterPool: [],
    exits: {
      '<': { mapId: 'CT', x: ctP.secret.doorX, y: ctP.secret.doorY + 1 },
      // hidden passage — reachable by walking to the back room
      '>': { mapId: 'SECRET_DUNGEON', x: 7, y: 2 },
    }
  },
  // Poke a hidden passage tile into the back room of the secret house.
  ...(() => { poke(ctSecretLayout, 2, 4, '>'); return {}; })(),

  // ── SECRET DUNGEON ── the first dungeon, found at the end of the note trail
  'SECRET_DUNGEON': {
    id: 'SECRET_DUNGEON', name: 'A Hollow Beneath the City', width: 16, height: 12,
    layout: secretDungeonLayout,
    npcs: [
      { id: 'echo_warden', x: 7, y: 5, color: '#6d28d9', name: 'The Echo Warden', type: 'BOSS', hideFlag: 'defeated_echo_warden' },
    ],
    chests: [
      { id: 'ch_echo_note', flag: 'ch_echo_note', x: 2, y: 3, item: 'book_mysterious_note' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: { '<': { mapId: 'CT_SECRET', x: 2, y: 3 } }
  },

  // ── A HOUSE MARKED IN ASH — the Mysterious Note leads here; a dark staircase hides in back ──
  'CT_ASHDOOR': {
    id: 'CT_ASHDOOR', name: 'A House Marked in Ash', width: 14, height: 9,
    layout: ctAshdoorLayout,
    npcs: [],
    chests: [],
    doors: [
      {
        id: 'stairs_ashdoor', x: 2, y: 4, targetMapId: 'ASHFALL_STAIRS', targetX: 8, targetY: 9,
        label: 'A Dark Staircase', reqItem: 'book_mysterious_note',
        lockMsg: "The stairs vanish into black. Something you're carrying feels heavier here — as if it's waiting for you to remember why you came.",
      },
    ],
    books: [],
    encounterPool: [],
    exits: { '<': { mapId: 'CT', x: ctP.ashdoor.doorX, y: ctP.ashdoor.doorY + 1 } }
  },

  // ── STAIRWAY INTO ASH — a dark passage beneath the city, ending in a portal ──
  'ASHFALL_STAIRS': {
    id: 'ASHFALL_STAIRS', name: 'A Stairway Into Ash', width: 16, height: 12,
    layout: ashfallStairsLayout,
    npcs: [],
    chests: [],
    doors: [],
    books: [],
    encounterPool: ['void_sentinel'],
    exits: {
      '<': { mapId: 'CT_ASHDOOR', x: 2, y: 5 },
      '@': { mapId: 'AR', x: 1, y: 20 },
    }
  },

  // ── ASHFALL RING (50 × 50) — second city, reached by the stairs beneath Crestfall ──
  'AR': {
    id: 'AR', name: 'Ashfall Ring', width: 50, height: 50,
    layout: arLayout,
    npcs: [],
    chests: [],
    doors: [
      { id: 'door_arena', x: arP.arena.doorX, y: arP.arena.doorY, targetMapId: 'AR_ARENA', targetX: 7, targetY: 7, label: 'Ashfall Manor' },
      ...Array.from({ length: 10 }, (_, i) => ({ id: `door_ar_misc${i + 1}`, x: arP[`misc${i + 1}`].doorX, y: arP[`misc${i + 1}`].doorY, targetMapId: `AR_MISC${i + 1}`, targetX: 7, targetY: 6, label: 'An Ashen House' })),
    ],
    books: [],
    encounterPool: ['void_sentinel', 'ash_hound', 'cinder_wraith'],
    exits: { '<': { mapId: 'ASHFALL_STAIRS', x: 8, y: 2 } }
  },

  // ── ASHFALL MANOR (2 floors, boss in the Great Hall) — the largest house in the city ──
  'AR_ARENA': {
    id: 'AR_ARENA', name: 'Ashfall Manor', width: 14, height: 9,
    layout: arenaGroundLayout,
    npcs: [],
    chests: [],
    doors: [ { id: 'stairs_arena', x: 4, y: 4, targetMapId: 'AR_ARENA_BOSS', targetX: 7, targetY: 2, label: 'Stairs Up' } ],
    books: [],
    encounterPool: [],
    exits: { '<': { mapId: 'AR', x: arP.arena.doorX, y: arP.arena.doorY + 1 } }
  },
  'AR_ARENA_BOSS': {
    id: 'AR_ARENA_BOSS', name: 'Ashfall Manor — The Great Hall', width: 16, height: 12,
    layout: arenaBossLayout,
    npcs: [
      { id: 'ring_boss', x: 7, y: 5, color: '#0ea5e9', name: 'The Ringkeeper', type: 'BOSS', hideFlag: 'defeated_ring_boss' },
    ],
    chests: [],
    doors: [],
    books: [],
    encounterPool: [],
    exits: { '<': { mapId: 'AR_ARENA', x: 4, y: 3 } }
  },

  // ── Generated side-quest / note / misc building interiors ──
  ...Object.fromEntries(CITY_SIDE_QUESTS.map(sq => [
    `CT_${sq.id.toUpperCase()}`, {
      id: `CT_${sq.id.toUpperCase()}`, name: sq.title, width: 14, height: 9,
      layout: sqInteriors[sq.id],
      npcs: [{ id: sq.npcId, x: 6, y: 3, color: '#c9a9dd', name: sq.npcName, type: 'TALK' }],
      chests: [], doors: [], books: [], encounterPool: [],
      exits: { '<': { mapId: 'CT', x: ctP[sq.id].doorX, y: ctP[sq.id].doorY + 1 } }
    }
  ])),
  ...Object.fromEntries(Array.from({ length: 5 }, (_, i) => [
    `CT_NOTE${i + 1}`, {
      id: `CT_NOTE${i + 1}`, name: 'An Old House', width: 14, height: 9,
      layout: noteInteriors[`note${i + 1}`],
      npcs: [], chests: [], doors: [], books: [], encounterPool: [],
      exits: { '<': { mapId: 'CT', x: ctP[`note${i + 1}`].doorX, y: ctP[`note${i + 1}`].doorY + 1 } }
    }
  ])),
  ...Object.fromEntries(Array.from({ length: 74 }, (_, i) => [
    `CT_MISC${i + 1}`, {
      id: `CT_MISC${i + 1}`, name: 'A House', width: 14, height: 9,
      layout: miscInteriors[`misc${i + 1}`],
      npcs: [], chests: [], doors: [], books: [], encounterPool: [],
      exits: { '<': { mapId: 'CT', x: ctP[`misc${i + 1}`].doorX, y: ctP[`misc${i + 1}`].doorY + 1 } }
    }
  ])),
  ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [
    `AR_MISC${i + 1}`, {
      id: `AR_MISC${i + 1}`, name: 'An Ashen House', width: 14, height: 9,
      layout: arMiscInteriors[`misc${i + 1}`],
      npcs: [], chests: [], doors: [], books: [], encounterPool: [],
      exits: { '<': { mapId: 'AR', x: arP[`misc${i + 1}`].doorX, y: arP[`misc${i + 1}`].doorY + 1 } }
    }
  ])),
};

// ── TELEPORT POINTS — unlocked as the player discovers each region ──
export const TELEPORT_POINTS: { id: string; name: string; mapId: string; x: number; y: number }[] = [
  { id: 'VH', name: 'Verdant Hollow',   mapId: 'VH', x: 12, y: 8  },
  { id: 'WW', name: 'Whispering Woods', mapId: 'WW', x: 11, y: 1  },
  { id: 'MS', name: 'Memory Sanctum',   mapId: 'MS', x: 9,  y: 1  },
  { id: 'SA', name: 'Sunken Archive',   mapId: 'SA', x: 9,  y: 1  },
  { id: 'FR', name: 'Frostbound Reach', mapId: 'FR', x: 9,  y: 1  },
  { id: 'AD', name: 'Ashen Descent',    mapId: 'AD', x: 10, y: 1  },
  { id: 'VN', name: 'Void Nexus',       mapId: 'VN', x: 9,  y: 14 },
  { id: 'CT', name: 'Crestfall City',   mapId: 'CT', x: 2,  y: 50 },
  { id: 'AR', name: 'Ashfall Ring',     mapId: 'AR', x: 1,  y: 20 },
  { id: 'CO', name: 'Color',            mapId: 'CO', x: 10, y: 9  },
];

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
      ...Object.fromEntries(CITY_SIDE_QUESTS.map(sq => [`quest_${sq.id}`, 0])),
    },
    questProgress: {
      'shards': 0, 'specters': 0, 'archive_kills': 0, 'frost_kills': 0, 'ash_kills': 0,
      'city_clears': 0,
    },
    flags: { 'discovered_VH': true },
    invincibility: 0,
    level: 1,
    xp: 0,
    xpToNext: xpForLevel(1),
    statPoints: STARTING_STAT_POINTS,
    baseStats: { str: 0, vit: 0, def: 0 },
  },
  camera: { x: 0, y: 0 },
  adjacentInteractable: null,
  dialogue: { currentNode: null, charIndex: 0, timer: 0, selectedOption: 0 },
  battle: null,
  menuIndex: 0, shopIndex: 0, shopNpcId: null, inventoryIndex: 0,
  keys: {}, prevKeys: {},
  frameCount: 0,
  uiMessage: null, uiMessageTimer: 0,
  messageStack: [],
  pendingEncounter: null,
  saveRequested: false,
  exitRequested: false,
  quitAfterSave: false,
  meta: { isGuest: true },
  bookRead: { bookId: null, page: 0, fromInventoryIndex: 0 },
  enchantSelect: { enchantBookSlot: 0, cursorIndex: 0 },
  tomeCraft: { cursorIndex: 0, chosenEnchantId: null },
  teleportIndex: 0,
  questLogScroll: 0,
  statAllocIndex: 0,
};
