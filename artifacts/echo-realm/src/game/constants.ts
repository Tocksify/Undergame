import { BookData, CraftRecipe, EnemyData, EquipSlot, EquipSlotId, GameMode, GameStateData, Item, ItemCategory, ItemTier } from './types';

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
  // ── SHORT FLAVOR NOTES (scattered through Crestfall/Ashfall filler houses) ──
  'book_house_note_1': {
    title: 'A Shopping List, Unfinished',
    type: 'note',
    pages: ["Bread. Salt. The blue thread, if the market still has it.\n\nFourth item is smudged out and rewritten three times. Whatever it was, they couldn't decide if they still needed it."],
  },
  'book_house_note_2': {
    title: 'A Note on the Windowsill',
    type: 'note',
    pages: ["Fed the cat. Watered what's left of the herbs. Left the window cracked in case anyone comes back for either.\n\n— someone who isn't sure they're coming back either"],
  },
  'book_house_note_3': {
    title: 'A Child\'s Drawing, Pinned Up',
    type: 'note',
    pages: ["Three stick figures and a lopsided sun. Underneath, in careful block letters: 'US. BEFORE.'\n\nNo one has taken it down."],
  },
  'book_house_note_4': {
    title: 'A Receipt, Kept for No Reason',
    type: 'note',
    pages: ["One kettle, mended. One pair of boots, resoled. Paid in full, thank you kindly.\n\nSomeone kept this for eleven years. It was in a drawer, under everything else that mattered less."],
  },
  'book_house_note_5': {
    title: 'A Line of Verse on a Doorframe',
    type: 'note',
    pages: ["Scratched into the wood, low, at a child's height:\n'grow tall, come home, grow tall, come home'\n\nThere are five more lines below it, each shorter than the last, marking someone who stopped growing taller before they stopped needing the reminder."],
  },
  'book_house_note_6': {
    title: 'A Recipe Card, Stained',
    type: 'note',
    pages: ["'Mother's stew — the good kind, not the fast kind.'\n\nHalf the ingredients aren't sold anywhere anymore. The handwriting gets shakier toward the bottom, like it was copied twice, by two different hands, twenty years apart."],
  },
  'book_house_note_7': {
    title: 'An Unsent Letter',
    type: 'note',
    pages: ["'I know it's been a long time. I know I should have written sooner. I keep starting this letter and it keeps sounding like an apology I don't know how to finish.'\n\nIt ends there, mid-sentence, folded but never sealed."],
  },
  'book_house_note_8': {
    title: 'A Tally on the Wall',
    type: 'note',
    pages: ["Scratches in groups of five, dozens of them, counting something the note never names.\n\nDays, maybe. Or visitors. Or just proof, to whoever kept the tally, that time was still passing the way it used to."],
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
  'rusty_shard':       { name: 'Rusty Shard',          desc: 'A chipped blade with no memory of its owner. It is simply sharp.',              price: 40,  tier: 'common',    category: 'weapon', atk: 1 },
  'shattered_lens':    { name: 'Shattered Lens',       desc: 'A fragment of something that once showed truth. Sharp on every edge.',           price: 35,  tier: 'common',    category: 'weapon', atk: 1 },
  'iron_fragment':     { name: 'Iron Fragment',         desc: 'Scavenged from collapsed walls. Still sharp enough to mean something.',          price: 80,  tier: 'common',    category: 'weapon', atk: 2 },
  'carved_stake':      { name: 'Carved Stake',          desc: 'Cut from a tree that fell before its time. Still remembers growing.',            price: 75,  tier: 'common',    category: 'weapon', atk: 2 },
  'bone_edge':         { name: 'Bone Edge',             desc: "The creature this came from didn't let go easily. Neither will you.",            price: 150, tier: 'uncommon',  category: 'weapon', atk: 3 },
  'void_needle':       { name: 'Void Needle',           desc: 'Thin enough to slip through memory itself.',                                     price: 130, tier: 'uncommon',  category: 'weapon', atk: 3 },
  'etched_spike':      { name: 'Etched Spike',          desc: 'Warded iron that remembers violence. The wards only make it meaner.',            price: 200, tier: 'uncommon',  category: 'weapon', atk: 4 },
  'resonance_blade':   { name: 'Resonance Blade',       desc: 'It hums at the frequency of things half-remembered.',                           price: 185, tier: 'uncommon',  category: 'weapon', atk: 4 },
  'frost_fang':        { name: 'Frost Fang',            desc: 'It has never been warm. Not once. It reaches out for heat wherever it goes.',    price: 0,   tier: 'rare',      category: 'weapon', atk: 5 },
  'ash_spear':         { name: 'Ash Spear',             desc: 'Forged from ash that still wanted to burn.',                                     price: 0,   tier: 'rare',      category: 'weapon', atk: 6 },
  'glacial_shard':     { name: 'Glacial Shard',         desc: 'Broken off from something vast and cold and patient.',                           price: 0,   tier: 'rare',      category: 'weapon', atk: 6 },
  'memory_edge':       { name: 'Memory Edge',           desc: 'Forged from solidified recollection. It cuts through what was as easily as what is.', price: 0, tier: 'rare', category: 'weapon', atk: 7 },
  'cinder_blade':      { name: 'Cinder Blade',          desc: 'Forged in the last true fire. The flames are still in there, waiting.',          price: 0,   tier: 'epic',      category: 'weapon', atk: 8 },
  'twin_fangs':        { name: 'Twin Fangs',            desc: 'Two blades that refuse to work separately. They are more honest as one.',        price: 0,   tier: 'epic',      category: 'weapon', atk: 9 },
  'voidtouched_blade': { name: 'Voidtouched Blade',    desc: 'Reality flinches where this blade passes through it. So do most enemies.',       price: 0,   tier: 'epic',      category: 'weapon', atk: 10 },
  'night_cleaver':     { name: 'Night Cleaver',         desc: 'It cuts through shadows. The shadows still remember.',                           price: 0,   tier: 'epic',      category: 'weapon', atk: 11 },
  'voidglass_dagger':  { name: 'Voidglass Dagger',     desc: 'Cut from the Nexus itself. It remembers every wound it has ever made.',          price: 0,   tier: 'legendary', category: 'weapon', atk: 12 },
  'sovereign_edge':    { name: 'Sovereign Edge',        desc: 'Carried by whoever the Void feared most. It has been carried often.',            price: 0,   tier: 'legendary', category: 'weapon', atk: 14 },
  'oblivion_lance':    { name: 'Oblivion Lance',        desc: 'The weapon that ended the first war. It has no memory of mercy.',                price: 0,   tier: 'mythic',    category: 'weapon', atk: 20 },

  // ── SHIELDS ── (equip to offhand; provide flat damage reduction per hit)
  'buckler':           { name: 'Buckler',               desc: 'A small round shield. Blocks 2 flat damage per hit. Pairs well with a weapon.',  price: 60,  tier: 'common',    category: 'shield', block: 2 },
  'iron_shield':       { name: 'Iron Shield',           desc: 'Heavier than a buckler. Blocks 4 flat damage per hit.',                          price: 180, tier: 'uncommon',  category: 'shield', block: 4 },
  'void_bulwark':      { name: 'Void Bulwark',          desc: 'A slab of void-forged metal. Blocks 6 flat damage per hit.',                     price: 0,   tier: 'rare',      category: 'shield', block: 6 },
  'memory_aegis':      { name: 'Memory Aegis',          desc: 'Remembers every blow that has been landed against it. Blocks 8 flat damage.',    price: 0,   tier: 'epic',      category: 'shield', block: 8 },

  // ── ARMOR ──
  'tattered_rags':     { name: 'Tattered Rags',        desc: 'Better than skin alone. Not by much, but enough to matter.',                     price: 25,  tier: 'common',    category: 'armor', maxHp: 3 },
  'cloth_wrap':        { name: 'Cloth Wrap',            desc: 'It will not stop much. But it is better than hope alone.',                       price: 40,  tier: 'common',    category: 'armor', maxHp: 5 },
  'woven_leather':     { name: 'Woven Leather',         desc: 'Someone cured this hide carefully. It repays the care.',                         price: 90,  tier: 'common',    category: 'armor', maxHp: 6 },
  'hide_wrap':         { name: 'Hide Wrap',             desc: 'Toughened by something that survived worse than this.',                          price: 100, tier: 'common',    category: 'armor', maxHp: 8 },
  'traveler_cloak':    { name: "Traveler's Cloak",     desc: 'It has walked very far. The roads are in the threads.',                          price: 140, tier: 'uncommon',  category: 'armor', maxHp: 10, def: 1 },
  'runed_cloak':       { name: 'Runed Cloak',           desc: 'Old wards stitched into the hem by someone who did not want to be forgotten.',   price: 220, tier: 'uncommon',  category: 'armor', maxHp: 12, def: 1 },
  'keeper_vestments':  { name: "Keeper's Vestments",   desc: 'Worn by those who remembered the old roads. Every thread holds a path.',         price: 175, tier: 'uncommon',  category: 'armor', maxHp: 14, def: 1 },
  'archivist_ward':    { name: "Archivist's Ward",     desc: 'Made by someone who needed to survive long enough to write one more page.',       price: 0,   tier: 'rare',      category: 'armor', maxHp: 15, def: 2 },
  'void_mail':         { name: 'Void Mail',             desc: 'Forged in the Nexus outer ring. It resists what it was born in.',                price: 0,   tier: 'rare',      category: 'armor', maxHp: 18, def: 2 },
  'resonant_plate':    { name: 'Resonant Plate',        desc: 'Each strike against it is absorbed into something deeper. Used wisely.',         price: 0,   tier: 'rare',      category: 'armor', maxHp: 18, def: 3 },
  'ember_plate':       { name: 'Ember Plate',           desc: 'Still smells like smoke. Whatever wore it before walked out of fire.',           price: 0,   tier: 'epic',      category: 'armor', maxHp: 20, def: 3 },
  'nexus_shroud':      { name: 'Nexus Shroud',          desc: 'Woven from Nexus-thread. What passes through it tends to get lost.',             price: 0,   tier: 'epic',      category: 'armor', maxHp: 22, def: 3 },
  'shadow_carapace':   { name: 'Shadow Carapace',       desc: 'Worn by something that stopped needing light to see its prey.',                  price: 0,   tier: 'epic',      category: 'armor', maxHp: 25, def: 4 },
  'warden_aegis':      { name: 'Warden Aegis',          desc: "The last warden's armor. It held the city long after the warden fell.",          price: 0,   tier: 'epic',      category: 'armor', maxHp: 28, def: 4 },
  'voidsteel_mail':    { name: 'Voidsteel Mail',        desc: 'The armor of death himself. Heavy with the weight of endings.',                  price: 0,   tier: 'legendary', category: 'armor', maxHp: 30, def: 5 },
  'oblivion_mantle':   { name: 'Oblivion Mantle',       desc: 'Heavier than grief. Protects everything behind it.',                             price: 0,   tier: 'legendary', category: 'armor', maxHp: 35, def: 6 },
  'mortus_regalia':    { name: 'Mortus Regalia',        desc: 'The regalia of the first Memory Keeper. Worn once. Never returned.',             price: 0,   tier: 'mythic',    category: 'armor', maxHp: 45, def: 8 },

  // ── HELMETS ──
  'rag_headband':      { name: 'Rag Headband',        desc: 'A strip of cloth tied around the brow. Better than nothing.',                       price: 20,  tier: 'common',    category: 'helmet', maxHp: 2 },
  'leather_cap':       { name: 'Leather Cap',          desc: 'Simple cured hide shaped into a cap. Reliable.',                                    price: 45,  tier: 'common',    category: 'helmet', def: 1 },
  'iron_helm':         { name: 'Iron Helm',            desc: 'Standard-issue iron helm, dented but structurally whole.',                          price: 130, tier: 'uncommon',  category: 'helmet', def: 2, maxHp: 3 },
  'void_hood':         { name: 'Void Hood',            desc: 'A hood woven from void-silk. Somehow heavier than it looks.',                       price: 160, tier: 'uncommon',  category: 'helmet', def: 1, maxHp: 5 },
  'memory_crown':      { name: 'Memory Crown',         desc: 'Worn by those who refused to forget. The crown remembers for them.',                price: 0,   tier: 'rare',      category: 'helmet', def: 3, maxHp: 5 },
  'archivist_visor':   { name: "Archivist's Visor",   desc: 'Protects the most important part. The rest can take its chances.',                  price: 0,   tier: 'rare',      category: 'helmet', def: 3, maxHp: 8 },
  'echo_helm':         { name: 'Echo Helm',            desc: 'Forged in resonance. Memories leave less of a mark.',                              price: 0,   tier: 'epic',      category: 'helmet', def: 4, maxHp: 10 },
  'voidsteel_helm':    { name: 'Voidsteel Helm',       desc: 'The helm of something that never slept.',                                          price: 0,   tier: 'legendary', category: 'helmet', def: 5, maxHp: 12 },

  // ── CRAFTING INGREDIENTS ──
  'iron_dust':    { name: 'Iron Dust',       desc: 'Powdered iron scraped from ruins. Foundation of most metal crafts.',          price: 5,  tier: 'common',   category: 'ingredient' },
  'silver_ingot': { name: 'Silver Ingot',    desc: 'Refined from iron dust. Holds void energy better than raw iron.',             price: 40, tier: 'uncommon', category: 'ingredient' },
  'wood_plank':   { name: 'Wood Plank',      desc: 'Hewn from thornwood. Dense and reliable as a handle.',                        price: 5,  tier: 'common',   category: 'ingredient' },
  'cloth_scrap':  { name: 'Cloth Scrap',     desc: 'Salvaged from old garments. Still serviceable.',                              price: 5,  tier: 'common',   category: 'ingredient' },
  'leather_hide': { name: 'Leather Hide',    desc: 'Cured hide from forest creatures. Tough and supple.',                         price: 8,  tier: 'common',   category: 'ingredient' },
  'void_dust':    { name: 'Void Dust',       desc: 'Residue left by void creatures. Faintly luminous. Unstable in large amounts.', price: 15, tier: 'uncommon', category: 'ingredient' },
  'herb_bundle':  { name: 'Herb Bundle',     desc: 'Dried herbs from the forest floor. Known for their healing properties.',      price: 10, tier: 'common',   category: 'ingredient' },
  'void_crystal': { name: 'Void Crystal',   desc: 'A shard of crystallized void energy. Rare and highly reactive in forges.',      price: 25, tier: 'uncommon', category: 'ingredient' },
  'echo_shard':   { name: 'Echo Shard',     desc: 'A fragment of solidified memory resonance. Vibrates faintly near old ruins.',    price: 30, tier: 'uncommon', category: 'ingredient' },
  'bone_fragment':{ name: 'Bone Fragment',  desc: 'A chip of bone from a void creature. Denser than it looks.',                    price: 6,  tier: 'common',   category: 'ingredient' },
  'ember_coal':   { name: 'Ember Coal',     desc: 'Coal from the Ashfall Ring that never fully cooled. Still radiates heat.',       price: 8,  tier: 'common',   category: 'ingredient' },
  'silver_thread':{ name: 'Silver Thread',  desc: 'Spun from void-silver. Essential for high-quality textile crafts.',              price: 35, tier: 'uncommon', category: 'ingredient' },
  'memory_dust':  { name: 'Memory Dust',    desc: 'Ground from memory crystals. Potent base for advanced alchemical recipes.',      price: 50, tier: 'rare',     category: 'ingredient' },
  // ── CRAFTED GEAR (primarily obtained by crafting) ──
  'iron_band':    { name: 'Iron Band',       desc: 'A plain iron ring, smoothed at the forge. Modest protection.',                price: 0, tier: 'common',   category: 'ring', def: 1 },

  // ── GLOVES ──
  'worn_gloves':       { name: 'Worn Gloves',          desc: 'Old leather gloves. The grip is still good, if not the look.',                     price: 25,  tier: 'common',    category: 'gloves', atk: 1 },
  'battle_wraps':      { name: 'Battle Wraps',         desc: 'Cloth wrapped tight around the knuckles. Every blow lands cleaner.',               price: 90,  tier: 'uncommon',  category: 'gloves', atk: 2 },
  'iron_gauntlets':    { name: 'Iron Gauntlets',       desc: 'Heavy gauntlets that remember every blow they have ever landed.',                   price: 0,   tier: 'rare',      category: 'gloves', atk: 2, def: 1 },
  'void_grips':        { name: 'Void Grips',           desc: 'Gloves of void-thread. Your strikes feel decisive. Final.',                        price: 0,   tier: 'epic',      category: 'gloves', atk: 3, def: 1 },
  'obsidian_gauntlets':{ name: 'Obsidian Gauntlets',   desc: 'Cut from the same stone as the Void Nexus floor. Cold even in summer.',            price: 0,   tier: 'legendary', category: 'gloves', atk: 4, def: 2 },

  // ── PANTS ──
  'threadbare_trousers':{ name: 'Threadbare Trousers', desc: 'Worn thin but still covering. Every road leaves its mark.',                        price: 15,  tier: 'common',    category: 'pants', def: 1 },
  'leather_leggings':  { name: 'Leather Leggings',     desc: 'Simple leather leggings. Practical, if not elegant.',                              price: 50,  tier: 'common',    category: 'pants', def: 1, maxHp: 2 },
  'warden_greaves':    { name: 'Warden Greaves',       desc: 'Warden-issue leg armor, slightly too big. It holds anyway.',                       price: 120, tier: 'uncommon',  category: 'pants', def: 2, maxHp: 3 },
  'void_leggings':     { name: 'Void Leggings',        desc: 'Reinforced with void-thread at the joints. The Void taught something useful.',     price: 0,   tier: 'rare',      category: 'pants', def: 3, maxHp: 5 },
  'echo_chaps':        { name: 'Echo Chaps',           desc: 'Worn by Keepers who walked very long roads. The roads are still in the leather.',  price: 0,   tier: 'epic',      category: 'pants', def: 4, maxHp: 8 },

  // ── BOOTS ──
  'worn_boots':        { name: 'Worn Boots',           desc: 'Resoled three times. Still standing. Still walking.',                              price: 20,  tier: 'common',    category: 'boots', def: 1 },
  'iron_boots':        { name: 'Iron Boots',           desc: 'Heavy iron-capped boots. Your footsteps announce you.',                            price: 110, tier: 'uncommon',  category: 'boots', def: 2 },
  'void_treads':       { name: 'Void Treads',          desc: 'They move quietly. More quietly than you deserve.',                                price: 0,   tier: 'rare',      category: 'boots', def: 2, maxHp: 3 },
  'echo_striders':     { name: 'Echo Striders',        desc: 'The road is still in the soles. Every path feels familiar.',                       price: 0,   tier: 'epic',      category: 'boots', def: 3, maxHp: 5 },
  'nexus_boots':       { name: 'Nexus Boots',          desc: 'Forged at the Void Nexus. They have walked across the end of the world.',          price: 0,   tier: 'legendary', category: 'boots', def: 4, maxHp: 8 },

  // ── CLOAKS ──
  'drifter_cloak':     { name: "Drifter's Cloak",      desc: 'Has kept out more rain than you can remember. The lining still smells of smoke.',  price: 30,  tier: 'common',    category: 'cloak', maxHp: 4 },
  'shadow_wrap':       { name: 'Shadow Wrap',          desc: 'Difficult to see in low light. Easier to breathe in than most armor.',             price: 100, tier: 'uncommon',  category: 'cloak', def: 1, maxHp: 6 },
  'void_cloak':        { name: 'Void Cloak',           desc: 'Woven from void-silk, it absorbs rather than deflects. There is a difference.',   price: 0,   tier: 'rare',      category: 'cloak', def: 1, maxHp: 10 },
  'keeper_cloak':      { name: "Keeper's Cloak",       desc: 'The cloak of those who remember the longest roads. Still clean at the hem.',       price: 0,   tier: 'epic',      category: 'cloak', def: 2, maxHp: 15 },
  'mantle_of_echoes':  { name: 'Mantle of Echoes',     desc: 'Woven from preserved memory-thread. Heavier than it looks. Worth it.',            price: 0,   tier: 'legendary', category: 'cloak', def: 3, maxHp: 20 },

  // ── NECKLACES ──
  'bone_pendant':      { name: 'Bone Pendant',         desc: 'Carved from something that did not give it up easily.',                            price: 25,  tier: 'common',    category: 'necklace', maxHp: 3 },
  'echo_amulet':       { name: 'Echo Amulet',          desc: 'Vibrates faintly when carried near old ruins. Useful. Unsettling.',               price: 90,  tier: 'uncommon',  category: 'necklace', atk: 1, maxHp: 4 },
  'void_chain':        { name: 'Void Chain',           desc: 'Links of void-iron. Cold to the touch in all weather.',                           price: 0,   tier: 'rare',      category: 'necklace', atk: 1, maxHp: 7 },
  'keeper_medallion':  { name: "Keeper's Medallion",   desc: 'Worn by Memory Keepers who survived long enough to be given one.',                price: 0,   tier: 'epic',      category: 'necklace', atk: 2, maxHp: 10 },
  'memory_locket':     { name: 'Memory Locket',        desc: 'It holds something inside it. Something it refuses to let go of.',                price: 0,   tier: 'legendary', category: 'necklace', atk: 3, maxHp: 14 },

  // ── RINGS ──
  'iron_ring':         { name: 'Iron Ring',            desc: 'Plain iron, worn smooth. Someone wore this a long time.',                          price: 20,  tier: 'common',    category: 'ring', def: 1 },
  'void_band':         { name: 'Void Band',            desc: 'A thin band of void-iron. Both fingers feel steadier for wearing it.',             price: 80,  tier: 'uncommon',  category: 'ring', atk: 1, def: 1 },
  'echo_ring':         { name: 'Echo Ring',            desc: 'It resonates with strikes, amplifying the intent behind them.',                    price: 0,   tier: 'rare',      category: 'ring', atk: 2, maxHp: 3 },
  'sovereign_ring':    { name: 'Sovereign Ring',       desc: 'The signet of whoever ruled here last. The authority remains.',                    price: 0,   tier: 'epic',      category: 'ring', atk: 3, def: 2 },
  'oblivion_ring':     { name: 'Oblivion Ring',        desc: 'It forgets nothing. Every foe it has faced is still in there somewhere.',          price: 0,   tier: 'legendary', category: 'ring', atk: 4, def: 3 },

  // ── BELTS ──
  'rope_belt':         { name: 'Rope Belt',            desc: 'Holds things together. That is all it has ever been asked to do.',                 price: 15,  tier: 'common',    category: 'belt', maxHp: 2 },
  'leather_belt':      { name: 'Leather Belt',         desc: 'Good leather, well-worked. The buckle has not failed yet.',                        price: 55,  tier: 'uncommon',  category: 'belt', maxHp: 4 },
  'void_girdle':       { name: 'Void Girdle',          desc: 'A reinforced belt that carries its own weight and a little more.',                 price: 0,   tier: 'rare',      category: 'belt', def: 1, maxHp: 7 },
  'warden_belt':       { name: 'Warden Belt',          desc: "The warden's belt still holds everything in place. Even now.",                    price: 0,   tier: 'epic',      category: 'belt', def: 1, maxHp: 10 },
  'memory_girdle':     { name: 'Memory Girdle',        desc: 'Worn by whoever carried the most. It remembers every burden.',                     price: 0,   tier: 'legendary', category: 'belt', def: 2, maxHp: 14 },

  // ── TRINKETS ──
  'cracked_charm':     { name: 'Cracked Charm',        desc: 'Half of something that was once whole. The half that still works.',                price: 25,  tier: 'common',    category: 'trinket', atk: 1 },
  'echo_charm':        { name: 'Echo Charm',           desc: 'Hums faintly when danger is close. Possibly useful. Definitely unnerving.',        price: 85,  tier: 'uncommon',  category: 'trinket', atk: 1, maxHp: 3 },
  'void_token':        { name: 'Void Token',           desc: 'A small disc of void-stone. Warm in your hand despite the cold of the Void.',     price: 0,   tier: 'rare',      category: 'trinket', def: 2, maxHp: 5 },
  'keeper_token':      { name: "Keeper's Token",       desc: 'Given to Keepers who proved themselves. Most of them are gone. You are not.',      price: 0,   tier: 'epic',      category: 'trinket', atk: 2, def: 2, maxHp: 5 },
  'ancient_relic_charm':{ name: 'Ancient Relic Charm', desc: 'Predates the Void. Predates the Keepers. Predates nearly everything.',             price: 0,   tier: 'legendary', category: 'trinket', atk: 3, def: 3, maxHp: 8 },

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

  // ── HOUSE / FLAVOR NOTES (scattered through Crestfall & Ashfall) ──
  'book_house_note_1': { name: 'A Shopping List, Unfinished',    desc: 'Found in a drawer. The fourth item was crossed out three times.',         price: 0, tier: 'common', category: 'book', bookId: 'book_house_note_1' },
  'book_house_note_2': { name: 'A Note on the Windowsill',       desc: 'Left behind for someone who might come back.',                            price: 0, tier: 'common', category: 'book', bookId: 'book_house_note_2' },
  'book_house_note_3': { name: "A Child's Drawing, Pinned Up",   desc: 'Three stick figures and a lopsided sun. Still on the wall.',              price: 0, tier: 'common', category: 'book', bookId: 'book_house_note_3' },
  'book_house_note_4': { name: 'A Receipt, Kept for No Reason',  desc: 'One kettle, mended. One pair of boots, resoled. Kept for eleven years.',  price: 0, tier: 'common', category: 'book', bookId: 'book_house_note_4' },
  'book_house_note_5': { name: 'A Line of Verse on a Doorframe', desc: 'Scratched low, at a child\'s height. The lines get shorter going down.',  price: 0, tier: 'common', category: 'book', bookId: 'book_house_note_5' },
  'book_house_note_6': { name: 'A Recipe Card, Stained',         desc: "Mother's stew — the good kind, not the fast kind.",                      price: 0, tier: 'common', category: 'book', bookId: 'book_house_note_6' },
  'book_house_note_7': { name: 'An Unsent Letter',               desc: 'Folded but never sealed. It ends mid-sentence.',                          price: 0, tier: 'common', category: 'book', bookId: 'book_house_note_7' },
  'book_house_note_8': { name: 'A Tally on the Wall',            desc: 'Dozens of scratch marks. Whatever they were counting is never named.',    price: 0, tier: 'common', category: 'book', bookId: 'book_house_note_8' },

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

  // ── PROC ENCHANTMENTS — weapon ──────────────────────────────────────
  // Common
  'ench_confusion_brand': {
    name: 'Confusion Brand',
    desc: 'Enchants a weapon. +1 ATK. On a solid hit, confuses the enemy — it skips its next turn.',
    price: 0, tier: 'common', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 1, confuse: true },
  },
  // Uncommon
  'ench_wither_mark': {
    name: 'Wither Mark',
    desc: 'Enchants a weapon. +2 ATK. On a solid hit, saps the enemy — reduces its ATK by 1.',
    price: 0, tier: 'uncommon', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 2, weaken: 1 },
  },
  // Rare
  'ench_soul_rend': {
    name: 'Soul Rend',
    desc: 'Enchants a weapon. +3 ATK. On a solid hit, drains 3 HP from the enemy back to you.',
    price: 0, tier: 'rare', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 3, drain: 3 },
  },
  'ench_hollow_confusion': {
    name: 'Hollow Confusion',
    desc: 'Enchants a weapon. +2 ATK. On a solid hit, fractures the enemy\'s mind — it skips its next turn.',
    price: 0, tier: 'rare', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 2, confuse: true },
  },
  // Epic
  'ench_void_scream': {
    name: 'Void Scream',
    desc: 'Enchants a weapon. +5 ATK. On a solid hit, confuses and weakens the enemy by 2 ATK.',
    price: 0, tier: 'epic', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 5, confuse: true, weaken: 2 },
  },
  'ench_lifestealer': {
    name: 'Lifestealer',
    desc: 'Enchants a weapon. +4 ATK. On a solid hit, steals 6 HP from the wound.',
    price: 0, tier: 'epic', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 4, drain: 6 },
  },
  // Legendary
  'ench_oblivion_strike': {
    name: 'Oblivion Strike',
    desc: 'Enchants a weapon. +8 ATK. On a solid hit, makes the enemy forget what it was doing.',
    price: 0, tier: 'legendary', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 8, confuse: true },
  },
  // Mythic
  'ench_mortus_chaos': {
    name: 'Grimoire of Chaos',
    desc: 'An enchantment written at the end of everything. +12 ATK. On a solid hit: confuses, weakens by 3, and drains 5 HP.',
    price: 0, tier: 'mythic', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 12, confuse: true, weaken: 3, drain: 5 },
  },

  // ── NEW PROC ENCHANTMENTS — weapon (Poison / Burn / Freeze / Silence) ──
  // Common
  'ench_venom_brand': {
    name: 'Venom Brand',
    desc: 'Enchants a weapon. +1 ATK. On a solid hit, poisons the enemy — deals 3 damage each turn for 3 turns.',
    price: 0, tier: 'common', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 1, poison: 3 },
  },
  // Uncommon
  'ench_pyro_brand': {
    name: 'Pyro Brand',
    desc: 'Enchants a weapon. +2 ATK. On a solid hit, ignites the enemy — escalating burn damage (2, 4, 8, 16, 32).',
    price: 0, tier: 'uncommon', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 2, burn: true },
  },
  // Rare
  'ench_frost_brand': {
    name: 'Frost Brand',
    desc: 'Enchants a weapon. +2 ATK. On a solid hit, freezes the enemy — skips its turn AND its next projectile wave.',
    price: 0, tier: 'rare', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 2, freeze: true },
  },
  // Epic
  'ench_silence_mark': {
    name: 'Silence Mark',
    desc: 'Enchants a weapon. +3 ATK. On a solid hit, silences the enemy — blocks its magic acts for one round.',
    price: 0, tier: 'epic', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 3, silence: true },
  },
  // Legendary — combined effect
  'ench_cursed_brand': {
    name: 'Cursed Brand',
    desc: 'Enchants a weapon. +6 ATK. On a solid hit: poisons (5/turn × 3), burns, and silences the enemy.',
    price: 0, tier: 'legendary', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['weapon'], atk: 6, poison: 5, burn: true, silence: true },
  },

  // ── PROC ENCHANTMENTS — armor ───────────────────────────────────────
  // Uncommon
  'ench_thorn_weave': {
    name: 'Thorn Weave',
    desc: 'Enchants armor. +1 DEF. When struck, thorns deal 2 damage back to the attacker.',
    price: 0, tier: 'uncommon', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['armor'], def: 1, thornDmg: 2 },
  },
  // Rare
  'ench_void_shroud': {
    name: 'Void Shroud',
    desc: 'Enchants armor. +2 DEF. Once per battle, automatically reduces an incoming attack by 50%.',
    price: 0, tier: 'rare', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['armor'], def: 2, autoWard: true },
  },
  // Epic
  'ench_iron_thorn': {
    name: 'Iron Thorn',
    desc: 'Enchants armor. +3 DEF. When struck, iron thorns deal 4 damage back to the attacker.',
    price: 0, tier: 'epic', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['armor'], def: 3, thornDmg: 4 },
  },
  // Mythic
  'ench_mortus_aegis': {
    name: 'Aegis of Mortus',
    desc: 'The apex of armor enchantment. +10 DEF, +15 Max HP. Auto-wards once per battle AND deals 6 thorn damage on every hit.',
    price: 0, tier: 'mythic', category: 'enchanted_book',
    enchantData: { compatibleCategories: ['armor'], def: 10, maxHp: 15, autoWard: true, thornDmg: 6 },
  },

  // ── CHALLENGE-EXCLUSIVE ITEMS ── (Only claimable via the Challenge Board herald)
  'ch_wisp_lantern':    { name: 'Wisp Lantern',           desc: 'A sealed lantern holding a captured Shade Wisp. Glows faintly. Challenge-exclusive.',            price: 0, tier: 'uncommon',  category: 'trinket',  atk: 1, maxHp: 5 },
  'ch_hollow_draught':  { name: 'Hollow Draught',         desc: "Brewed from a Hollow's last breath. Restores 15 HP and clears confusion. Challenge-exclusive.",   price: 0, tier: 'uncommon',  category: 'consumable', subcategory: 'medical' },
  'ch_resonance_fork':  { name: 'Resonance Fork',         desc: 'A blade tuned to the frequency of memory itself. Hums near void. Challenge-exclusive.',           price: 0, tier: 'rare',      category: 'weapon',   atk: 5 },
  'ch_echo_tonic':      { name: 'Echo Tonic',             desc: 'Restores 22 HP. The resonance hum lingers on the tongue. Challenge-exclusive.',                    price: 0, tier: 'rare',      category: 'consumable', subcategory: 'medical' },
  'ch_keeper_sigil':    { name: "Keeper's Sigil",          desc: 'A sigil worn only by those who survived the arena rites. Challenge-exclusive.',                    price: 0, tier: 'rare',      category: 'trinket',  atk: 2, def: 2, maxHp: 5 },
  'ch_archive_blade':   { name: 'Archive Blade',          desc: 'A page from the Archive, rolled tight and edged in void-steel. Challenge-exclusive.',              price: 0, tier: 'epic',      category: 'weapon',   atk: 9 },
  'ch_void_shard_edge': { name: 'Void Shard Edge',        desc: 'Cut from a concentrated void shard. Forgets to stop cutting. Challenge-exclusive.',                price: 0, tier: 'epic',      category: 'weapon',   atk: 12 },
  'ch_echo_bulwark':    { name: 'Echo Bulwark',           desc: 'Forged from solidified resonance. Blocks 10 flat damage per hit. Challenge-exclusive.',            price: 0, tier: 'epic',      category: 'shield',   block: 10 },
  'ch_nexus_crown':     { name: 'Nexus Crown',            desc: 'The crown of whatever ruled the Nexus before the silence. Challenge-exclusive.',                   price: 0, tier: 'legendary', category: 'helmet',   def: 5, maxHp: 15 },
  'ch_oblivion_fang':   { name: 'Oblivion Fang',          desc: 'A blade that forgets what it cuts through. The cut remains. Challenge-exclusive.',                 price: 0, tier: 'legendary', category: 'weapon',   atk: 16 },
  // Void / Mortus tier — only available at the highest challenge tier
  'ch_mortus_throne_blade': { name: 'Throne Blade of Mortus', desc: 'The blade that ended the first age. Still hungry. Challenge-exclusive — Mortus tier.',            price: 0, tier: 'mythic', category: 'weapon',  atk: 25 },
  'ch_mortus_void_mantle':  { name: 'Void Mantle of Mortus',  desc: "The armor of the Void's own herald. Refuses every ending. Challenge-exclusive — Mortus tier.",  price: 0, tier: 'mythic', category: 'armor',   maxHp: 50, def: 10 },
  'ch_mortus_eye':          { name: 'Eye of Mortus',           desc: 'Preserved from the final witness of the old world. Watches for you. Challenge-exclusive — Mortus tier.', price: 0, tier: 'mythic', category: 'trinket', atk: 8, def: 6, maxHp: 20 },
};

// Enchantments craftable from scratch via the Tomes Blessing — spans every tier.
export const CRAFTABLE_ENCHANTS: string[] = [
  // ── Stat enchants ──
  'ench_memory_mark', 'ench_stone_ward',            // common
  'ench_hollow_edge', 'ench_woven_ward',             // uncommon
  'ench_shard_frostbite', 'ench_veil_dust',          // rare
  'ench_grimoire_striking', 'ench_tome_iron_veil',   // epic
  'ench_relic_ashbound', 'ench_codex_living_flame',  // legendary
  'ench_grimoire_mortus', 'ench_veil_mortus',        // mythic (Mortus)
  // ── Proc enchants — weapon ──
  'ench_confusion_brand',                            // common  — confuse on hit
  'ench_wither_mark',                                // uncommon — weaken on hit
  'ench_soul_rend', 'ench_hollow_confusion',         // rare     — drain / confuse
  'ench_void_scream', 'ench_lifestealer',            // epic     — confuse+weaken / drain
  'ench_oblivion_strike',                            // legendary — confuse on hit
  'ench_mortus_chaos',                               // mythic   — confuse+weaken+drain
  // ── Proc enchants — armor ──
  'ench_thorn_weave',                                // uncommon — thorn dmg
  'ench_void_shroud',                                // rare     — auto ward
  'ench_iron_thorn',                                 // epic     — thorn dmg
  'ench_mortus_aegis',                               // mythic   — auto ward + thorn
  // ── New proc enchants — weapon (status effects) ──
  'ench_venom_brand',                                // common   — poison on hit
  'ench_pyro_brand',                                 // uncommon — burn on hit
  'ench_frost_brand',                                // rare     — freeze on hit
  'ench_silence_mark',                               // epic     — silence on hit
  'ench_cursed_brand',                               // legendary — poison + burn + silence
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

// ── EQUIPMENT SLOT DEFINITIONS ───────────────────────────────────────
// Single source of truth for slot order, labels, and compatible item categories.
// Used by both engine.ts (equip logic) and renderer.ts (paperdoll).
export const EQUIP_SLOTS: EquipSlot[] = [
  { id: 'helmet',   label: 'HELMET',   categories: ['helmet'] },
  { id: 'necklace', label: 'NECKLACE', categories: ['necklace'] },
  { id: 'armor',    label: 'CHEST',    categories: ['armor'] },
  { id: 'cloak',    label: 'CLOAK',    categories: ['cloak'] },
  { id: 'gloves',   label: 'GLOVES',   categories: ['gloves'] },
  { id: 'belt',     label: 'BELT',     categories: ['belt'] },
  { id: 'pants',    label: 'PANTS',    categories: ['pants'] },
  { id: 'boots',    label: 'BOOTS',    categories: ['boots'] },
  { id: 'weapon',   label: 'WEAPON',   categories: ['weapon'] },
  { id: 'offhand',  label: 'OFF-HAND', categories: ['shield', 'weapon'] },
  { id: 'ring1',    label: 'RING I',   categories: ['ring'] },
  { id: 'ring2',    label: 'RING II',  categories: ['ring'] },
  { id: 'trinket',  label: 'TRINKET',  categories: ['trinket'] },
];

// Helper: sum a numeric stat across all non-weapon equipment slots (armor-type gear).
function sumEquipStat(state: GameStateData, stat: 'atk' | 'def' | 'maxHp', skipWeapons = true): number {
  let total = 0;
  for (const slot of EQUIP_SLOTS) {
    if (skipWeapons && (slot.id === 'weapon' || slot.id === 'offhand')) continue;
    const itemId = (state.player.equipment as Record<string, string | null>)[slot.id];
    if (!itemId) continue;
    const item = ITEMS[itemId];
    if (!item) continue;
    total += (item as any)[stat] ?? 0;
    // Enchantment bonus for this slot
    const invIdx = state.player.inventory.indexOf(itemId);
    if (invIdx >= 0) {
      const enchId = state.player.enchantedSlots[invIdx];
      if (enchId && ITEMS[enchId]?.enchantData) {
        total += (ITEMS[enchId].enchantData as any)[stat] ?? 0;
      }
    }
  }
  return total;
}

export function recomputeMaxHp(state: GameStateData) {
  const hpBonus = sumEquipStat(state, 'maxHp');
  const vitBonus = (state.player.baseStats?.vit ?? 0) * VIT_HP_PER_POINT;
  // ── Skill bonuses ──────────────────────────────────────────────────
  const skills = state.player.learnedSkills ?? [];
  const hasEmberShell = skills.includes('ember_shell');
  const forgeEchoActive = skills.includes('ember_shell') && skills.includes('echo_nova') &&
    ['void', 'chroma', 'echo', 'ember'].filter(p => {
      const counts: Record<string, number> = { void: 0, chroma: 0, echo: 0, ember: 0 };
      for (const s of skills) {
        if (s.startsWith('void_')) counts.void++;
        else if (s.startsWith('chroma_')) counts.chroma++;
        else if (s.startsWith('echo_')) counts.echo++;
        else if (s.startsWith('ember_')) counts.ember++;
      }
      return counts.echo >= 2 && counts.ember >= 2;
    }).length > 0;
  const emberHpBonus = hasEmberShell ? (forgeEchoActive ? 40 : 20) : 0;
  state.player.maxHp = BASE_MAX_HP + hpBonus + vitBonus + emberHpBonus;
  state.player.hp = Math.min(state.player.hp, state.player.maxHp);
}

export function getWeaponAtkBonus(state: GameStateData): number {
  const w = state.player.equipment.weapon;
  const oh = state.player.equipment.offhand;
  const ohItem = oh ? ITEMS[oh] : null;
  const isDualWield = ohItem?.category === 'weapon';
  const mainMult = isDualWield ? 0.75 : 1;

  const base = w && ITEMS[w] ? Math.floor((ITEMS[w].atk ?? 0) * mainMult) : 0;
  const wSlot = w ? state.player.inventory.indexOf(w) : -1;
  const enchBookId = wSlot >= 0 ? state.player.enchantedSlots[wSlot] : null;
  const enchBonus = enchBookId && ITEMS[enchBookId]?.enchantData?.atk
    ? Math.floor(ITEMS[enchBookId].enchantData!.atk! * mainMult) : 0;

  let ohBonus = 0; let ohEnchBonus = 0;
  if (isDualWield && oh) {
    ohBonus = Math.floor((ohItem!.atk ?? 0) * 0.75);
    const ohSlot = state.player.inventory.indexOf(oh);
    const ohEnchId = ohSlot >= 0 ? state.player.enchantedSlots[ohSlot] : null;
    ohEnchBonus = ohEnchId && ITEMS[ohEnchId]?.enchantData?.atk
      ? Math.floor(ITEMS[ohEnchId].enchantData!.atk! * 0.75) : 0;
  }

  // ATK contributions from non-weapon armor slots (gloves, shoulder, necklace, rings, trinket, etc.)
  const gearAtk = sumEquipStat(state, 'atk', true /* skipWeapons */);

  const strBonus = (state.player.baseStats?.str ?? 0) * STR_ATK_PER_POINT;
  return base + enchBonus + ohBonus + ohEnchBonus + gearAtk + strBonus;
}

// Flat damage reduction per hit from an equipped shield in the offhand slot.
export function getShieldBlockBonus(state: GameStateData): number {
  const oh = state.player.equipment.offhand;
  if (!oh) return 0;
  const ohItem = ITEMS[oh];
  return (ohItem?.category === 'shield') ? (ohItem.block ?? 0) : 0;
}

export function getArmorDefBonus(state: GameStateData): number {
  // Sum DEF from all non-weapon equipped items (including enchantment bonuses)
  const gearDef = sumEquipStat(state, 'def', true /* skipWeapons */);
  const defBonus = (state.player.baseStats?.def ?? 0) * DEF_DEF_PER_POINT;
  const skills = state.player.learnedSkills ?? [];
  const forgeBonus = skills.includes('ember_forge') ? 2 : 0;
  const willBonus = skills.includes('ember_will') && state.player.hp <= state.player.maxHp * 0.25 ? 4 : 0;
  return gearDef + defBonus + forgeBonus + willBonus;
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
  // ── Skill XP multipliers (echo_surge +20%, echo_legacy +30%, stack multiplicatively) ──
  const skills = state.player.learnedSkills ?? [];
  let xpMult = 1;
  if (skills.includes('echo_surge'))  xpMult *= 1.20;
  if (skills.includes('echo_legacy')) xpMult *= 1.30;
  state.player.xp += Math.round(amount * xpMult);

  let levelsGained = 0;
  while (state.player.xp >= state.player.xpToNext) {
    state.player.xp -= state.player.xpToNext;
    state.player.level += 1;
    state.player.statPoints += POINTS_PER_LEVEL;
    // Grant 1 skill point every 2 levels
    if (state.player.level % 2 === 0) {
      state.player.skillPoints = (state.player.skillPoints ?? 0) + 1;
    }
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
  'zara':         { title: "Zara's Memory Emporium",    items: ['crystal', 'elixir', 'ward', 'spark', 'stone', 'dust', 'rusty_shard', 'iron_fragment', 'buckler', 'cloth_wrap', 'hide_wrap'] },
  'old_thom':     { title: "Old Thom's Sunken Wares",   items: ['elixir', 'greater_crystal', 'ward', 'dust', 'bone_edge', 'etched_spike', 'iron_shield', 'traveler_cloak', 'runed_cloak'] },
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
      { id: 'listen', name: 'Listen', effect: 'confuse', magic: true },
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
    id: 'archivist', name: 'The Archivist', hp: 200, maxHp: 200, atk: 9, color: '#bbbbbb',
    flavor: 'It catalogs every memory it consumes, filing them away from the world forever.',
    rememberText: 'You show it the memory it was guarding — its own name. It exhales, and files itself away, at peace.',
    echoes: 80, acts: [
      { id: 'analyze', name: 'Analyze', effect: 'weaken', power: 2 },
      { id: 'plead', name: 'Plead', effect: 'resonance', power: 1, magic: true },
    ],
    resistances: { silence: 2 }, // silence blocks its resonance act — silencing it interrupts the remember path
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
      { id: 'blot', name: 'Blot', effect: 'confuse', magic: true },
    ]
  },
  'frost_walker': {
    id: 'frost_walker', name: 'Frost Walker', hp: 28, maxHp: 28, atk: 7, color: '#a9d6e5',
    flavor: 'It walks the Reach forever, looking for a warmth it can no longer name.',
    rememberText: 'You remember the warmth for it. Frost cracks; something underneath finally breathes.',
    echoes: 45, acts: [
      { id: 'thaw', name: 'Thaw', effect: 'weaken', power: 2 },
      { id: 'warm', name: 'Warm', effect: 'resonance', power: 1 },
    ],
    resistances: { burn: 2, freeze: 0 }, // ice enemy: melts fast under fire, immune to being frozen
  },
  'rime_hound': {
    id: 'rime_hound', name: 'Rime Hound', hp: 22, maxHp: 22, atk: 8, color: '#89c2d9',
    flavor: 'It hunts by the echo of a bark it can no longer make.',
    rememberText: 'It remembers its own name. It sits, finally still.',
    echoes: 40, acts: [
      { id: 'call', name: 'Call', effect: 'confuse', magic: true },
      { id: 'pet', name: 'Pet', effect: 'resonance', power: 1 },
    ],
    resistances: { burn: 2, freeze: 0.5 }, // ice hound: vulnerable to fire, naturally cold-resistant
  },
  'ash_hound': {
    id: 'ash_hound', name: 'Ash Hound', hp: 34, maxHp: 34, atk: 9, color: '#7a5c58',
    flavor: 'Born of the fire that took everything from someone, once.',
    rememberText: 'The ash settles. Somewhere, a fire that should have gone out finally does.',
    echoes: 55, acts: [
      { id: 'douse', name: 'Douse', effect: 'weaken', power: 2 },
      { id: 'calm', name: 'Calm', effect: 'resonance', power: 1 },
    ],
    resistances: { freeze: 2, burn: 0 }, // fire enemy: freeze hits it hard, can't burn what's already ash
  },
  'cinder_wraith': {
    id: 'cinder_wraith', name: 'Cinder Wraith', hp: 38, maxHp: 38, atk: 10, color: '#c1440e',
    flavor: 'It burns with a grief it can no longer explain.',
    rememberText: 'The embers cool. What it was grieving finally has a name again.',
    echoes: 60, acts: [
      { id: 'quench', name: 'Quench', effect: 'damage', power: 6 },
      { id: 'ember_talk', name: 'Speak to the Ember', effect: 'resonance', power: 1 },
    ],
    resistances: { freeze: 2, burn: 0 }, // fire entity: flash-frozen effectively, immune to its own element
  },
  'void_sentinel': {
    id: 'void_sentinel', name: 'Void Sentinel', hp: 350, maxHp: 350, atk: 12, color: '#4b4b4b',
    flavor: 'It was built to guard nothing, and it has done its job perfectly.',
    rememberText: 'It stands down. Whatever it was guarding was never really lost.',
    echoes: 80, acts: [
      { id: 'override', name: 'Override', effect: 'confuse', magic: true },
      { id: 'reason', name: 'Reason', effect: 'resonance', power: 1 },
    ],
    resistances: { silence: 0 }, // machine mind: cannot be silenced; magic finds no foothold
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
      { id: 'linger', name: 'Linger', effect: 'confuse', magic: true },
    ],
    resistances: { poison: 2 }, // already half-dead; poison sinks in fast
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
    id: 'boss', name: 'Memory Wraith', hp: 1000, maxHp: 1000, atk: 14, color: '#ffffff',
    flavor: 'The source of all forgetting. It was once the first Memory Keeper.',
    rememberText: 'You show it its own memories. Its form shudders. Then... silence. Then light.',
    echoes: 0, acts: [{ id: 'present_echo', name: 'Present Echo', effect: 'flavor', requiresItem: 'echo' }],
    resistances: { poison: 0.5, burn: 0.5, freeze: 0.5, silence: 0.5, confuse: 0.5, weaken: 0.5 },
    // The Memory Wraith is ancient — all proc effects are half as effective
  },
  // ── Easter-egg dungeon boss (secret building beneath Crestfall) ──
  'echo_warden': {
    id: 'echo_warden', name: 'The Echo Warden', hp: 300, maxHp: 300, atk: 11, color: '#6d28d9',
    flavor: 'It has guarded this hollow since before the city had a name.',
    rememberText: 'It lowers its guard. "...you may have it, then. Few come looking."',
    echoes: 90, acts: [
      { id: 'guard', name: 'Guard', effect: 'weaken', power: 2 },
      { id: 'reckon', name: 'Reckon', effect: 'resonance', power: 1, magic: true },
    ],
    resistances: { silence: 2, freeze: 0.5 }, // its voice IS its power — silence cripples it; cold barely slows it
  },
  // ── Ring boss (Ashfall Ring, second city) ──
  'ring_boss': {
    id: 'ring_boss', name: 'The Ringkeeper', hp: 500, maxHp: 500, atk: 16, color: '#0ea5e9',
    flavor: 'It circles the ring endlessly, bound to a blessing it can no longer use.',
    rememberText: 'It stops circling for the first time in memory. "...take it. I was only ever waiting for someone."',
    echoes: 160, acts: [
      { id: 'circle', name: 'Circle', effect: 'damage', power: 7 },
      { id: 'bind', name: 'Bind', effect: 'confuse', magic: true },
      { id: 'entreat', name: 'Entreat', effect: 'resonance', power: 1, magic: true },
    ],
    resistances: { freeze: 2, silence: 0.5 }, // kinetic entity: freezing stops its endless rotation cold
  },
  // ── The Kid — appears in Crestfall after reading the child's letter ──
  'child_void_kid': {
    id: 'child_void_kid', name: 'The Kid', hp: 300, maxHp: 300, atk: 9, color: '#b8d4e8',
    flavor: 'The void took the child before the letter could reach his father.\nWhat remains knows your name, but not its own.',
    rememberText: 'The void loosens. The child looks at his hands — they are warm again.\nHe smiles, and the smile holds until he is gone.',
    echoes: 130, acts: [
      { id: 'show_letter', name: 'Show the Letter', effect: 'resonance', power: 3, requiresItem: 'book_childs_letter' },
      { id: 'speak_name',  name: 'Speak His Name',  effect: 'resonance', power: 1 },
      { id: 'remember',    name: 'Remember Him',    effect: 'flavor' },
    ],
    resistances: { poison: 0, burn: 0 }, // a child — fire and poison deal no damage here
  },
  // ── Challenge Arena enemies (five escalating trials) ──────────────────
  'challenge_w1': {
    id: 'challenge_w1', name: 'Trial Shade', hp: 25, maxHp: 25, atk: 5, color: '#8888bb',
    flavor: 'A shadow given shape by the Arena. It watches you with borrowed eyes.',
    rememberText: 'The shadow stills. A trial passed is a memory kept.',
    echoes: 30, acts: [
      { id: 'flicker', name: 'Flicker', effect: 'weaken', power: 1 },
      { id: 'watch',   name: 'Watch',   effect: 'resonance', power: 1 },
    ],
  },
  'challenge_w2': {
    id: 'challenge_w2', name: 'Trial Crawler', hp: 40, maxHp: 40, atk: 7, color: '#666699',
    flavor: 'Formed from the accumulated weight of tests not yet passed.',
    rememberText: 'It dissolves. You carried it — and that made it real.',
    echoes: 40, acts: [
      { id: 'grind', name: 'Grind', effect: 'damage', power: 4 },
      { id: 'yield', name: 'Yield', effect: 'resonance', power: 1 },
    ],
  },
  'challenge_w3': {
    id: 'challenge_w3', name: 'Trial Specter', hp: 60, maxHp: 60, atk: 9, color: '#9988cc',
    flavor: 'An echo of every Keeper who failed at this gate and forgot why they came.',
    rememberText: 'The specter nods. It remembers, at last, that it once tried.',
    echoes: 55, acts: [
      { id: 'echo_strike', name: 'Echo Strike', effect: 'damage', power: 6 },
      { id: 'listen',      name: 'Listen',      effect: 'resonance', power: 1, magic: true },
    ],
  },
  'challenge_w4': {
    id: 'challenge_w4', name: 'Trial Warden', hp: 90, maxHp: 90, atk: 11, color: '#7766aa',
    flavor: 'Built to guard the final threshold. It has stood here longer than memory.',
    rememberText: 'The Warden steps aside. It was never the destination — only the gate.',
    echoes: 70, acts: [
      { id: 'bar',     name: 'Bar the Way', effect: 'confuse', magic: true },
      { id: 'concede', name: 'Concede',     effect: 'resonance', power: 1 },
    ],
    resistances: { weaken: 0.5, freeze: 0.5 },
  },
  'challenge_final': {
    id: 'challenge_final', name: 'The Echoing Gate', hp: 130, maxHp: 130, atk: 13, color: '#aabbff',
    flavor: 'It is not a creature. It is the final question the Arena asks of you.',
    rememberText: "The Gate opens. On the other side: your reflection. It answers, 'Yes.'",
    echoes: 100, acts: [
      { id: 'resound',  name: 'Resound', effect: 'damage',    power: 8 },
      { id: 'question', name: 'Ask',     effect: 'resonance', power: 2, magic: true },
    ],
    resistances: { poison: 0.5, burn: 0.5, freeze: 0.5, silence: 0.5 },
  },
  // ── Forest enemies (Thornwood Forest encounter pool) ───────────────────
  'thorn_wraith': {
    id: 'thorn_wraith', name: 'Thorn Wraith', hp: 20, maxHp: 20, atk: 5, color: '#556644',
    flavor: 'The forest made this from old pain and sharpened wood. It does not know why it hurts.',
    rememberText: 'You name the ache it was made from. The thorns soften. It settles back into the bark.',
    echoes: 28, acts: [
      { id: 'pierce', name: 'Pierce', effect: 'damage', power: 3 },
      { id: 'root',   name: 'Root',   effect: 'weaken', power: 1 },
    ],
    resistances: { burn: 2 }, // wood — fire hits it hard
  },
  'shadow_stalker': {
    id: 'shadow_stalker', name: 'Shadow Stalker', hp: 16, maxHp: 16, atk: 6, color: '#335544',
    flavor: 'It learned to hunt by following things that were already lost.',
    rememberText: 'It stops stalking. Looks at its own shadow. Sits down. The forest is quieter for it.',
    echoes: 32, acts: [
      { id: 'ambush',  name: 'Ambush',  effect: 'damage', power: 4 },
      { id: 'observe', name: 'Observe', effect: 'confuse', magic: true },
    ],
  },
  'bark_guardian': {
    id: 'bark_guardian', name: 'Bark Guardian', hp: 38, maxHp: 38, atk: 7, color: '#7a6030',
    flavor: 'Something very old decided to stand guard over a clearing. It has not moved in a long time.',
    rememberText: 'You show it that the clearing is still there. Still safe. It nods — the deepest nod — and rests.',
    echoes: 55, acts: [
      { id: 'slam',  name: 'Slam',  effect: 'damage', power: 5 },
      { id: 'sway',  name: 'Sway',  effect: 'resonance', power: 1 },
    ],
    resistances: { burn: 2, freeze: 0.5 }, // living wood: fire crumbles it, ice barely cracks bark
  },
  'briar_specter': {
    id: 'briar_specter', name: 'Briar Specter', hp: 26, maxHp: 26, atk: 5, color: '#664422',
    flavor: 'A ghost that chose a thornbush as a body when its first one wore out.',
    rememberText: 'The thorns unwind. Something small and soft floats free. It remembers being small.',
    echoes: 38, acts: [
      { id: 'entangle', name: 'Entangle', effect: 'weaken',    power: 2 },
      { id: 'listen',   name: 'Listen',   effect: 'resonance', power: 1 },
    ],
    resistances: { freeze: 2, poison: 0 }, // spectral plant: ice shatters the hosting thorns; immune to own nature
  },
};

// ── CRAFTING RECIPES ─────────────────────────────────────────────────────
// Used by the Item Crafting Table (GameMode.ITEM_CRAFT).
// Ingredients are consumed; the output item is added to the player's inventory.
export const RECIPES: CraftRecipe[] = [
  // ── MATERIALS ──
  { id: 'r_silver_ingot', name: 'Silver Ingot',     outputId: 'silver_ingot',  outputCount: 1, category: 'material',
    ingredients: [{ itemId: 'iron_dust', count: 5 }] },
  // ── WEAPONS ──
  { id: 'r_iron_blade',   name: 'Iron Fragment',     outputId: 'iron_fragment', outputCount: 1, category: 'weapon',
    ingredients: [{ itemId: 'iron_dust', count: 3 }, { itemId: 'wood_plank', count: 1 }] },
  { id: 'r_carved_stake', name: 'Carved Stake',      outputId: 'carved_stake',  outputCount: 1, category: 'weapon',
    ingredients: [{ itemId: 'wood_plank', count: 2 }, { itemId: 'cloth_scrap', count: 1 }] },
  { id: 'r_bone_edge',    name: 'Bone Edge',         outputId: 'bone_edge',     outputCount: 1, category: 'weapon',
    ingredients: [{ itemId: 'iron_dust', count: 4 }, { itemId: 'void_dust', count: 1 }] },
  { id: 'r_resonance_blade', name: 'Resonance Blade', outputId: 'resonance_blade', outputCount: 1, category: 'weapon',
    ingredients: [{ itemId: 'silver_ingot', count: 2 }, { itemId: 'void_dust', count: 2 }] },
  // ── ARMOR ──
  { id: 'r_cloth_wrap',   name: 'Cloth Wrap',        outputId: 'cloth_wrap',    outputCount: 1, category: 'armor',
    ingredients: [{ itemId: 'cloth_scrap', count: 3 }] },
  { id: 'r_hide_wrap',    name: 'Hide Wrap',          outputId: 'hide_wrap',     outputCount: 1, category: 'armor',
    ingredients: [{ itemId: 'leather_hide', count: 3 }, { itemId: 'cloth_scrap', count: 1 }] },
  { id: 'r_woven_leather', name: 'Woven Leather',    outputId: 'woven_leather', outputCount: 1, category: 'armor',
    ingredients: [{ itemId: 'leather_hide', count: 4 }, { itemId: 'iron_dust', count: 1 }] },
  { id: 'r_leather_cap',  name: 'Leather Cap',        outputId: 'leather_cap',   outputCount: 1, category: 'armor',
    ingredients: [{ itemId: 'leather_hide', count: 2 }, { itemId: 'cloth_scrap', count: 2 }] },
  // ── TRINKETS ──
  { id: 'r_iron_band',    name: 'Iron Band (Ring)',   outputId: 'iron_band',     outputCount: 1, category: 'trinket',
    ingredients: [{ itemId: 'iron_dust', count: 2 }, { itemId: 'cloth_scrap', count: 1 }] },
  { id: 'r_void_token',   name: 'Void Token',         outputId: 'void_token',    outputCount: 1, category: 'trinket',
    ingredients: [{ itemId: 'silver_ingot', count: 1 }, { itemId: 'void_dust', count: 2 }] },
  // ── CONSUMABLES ──
  { id: 'r_crystal',      name: 'Memory Crystal',     outputId: 'crystal',       outputCount: 1, category: 'consumable',
    ingredients: [{ itemId: 'herb_bundle', count: 2 }] },
  { id: 'r_tonic',        name: 'Hollow Tonic',       outputId: 'tonic',         outputCount: 2, category: 'consumable',
    ingredients: [{ itemId: 'herb_bundle', count: 1 }, { itemId: 'cloth_scrap', count: 1 }] },
  { id: 'r_elixir',       name: 'Void Elixir',        outputId: 'elixir',        outputCount: 1, category: 'consumable',
    ingredients: [{ itemId: 'herb_bundle', count: 3 }, { itemId: 'void_dust', count: 1 }] },
];

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

  // ── Crafting Workshop (center-north, between Inn NW and Maren NE) ──
  rect(L, 10, 2, 13, 5, 'H');
  rect(L, 11, 3, 12, 4, 'P'); // visible interior windows

  poke(L, 12, 0, '>');      // north -> Whispering Wastes
  poke(L, W - 1, 8, '!');   // east -> Crestfall City
  poke(L, 12, H - 1, '<');  // south (locked, flavor)
  poke(L, 0, 8, '@');        // west -> Thornwood Forest
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
  // Hidden void pocket entrance (center platform, right side)
  poke(L, 12, 8, '@');
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

// ── FROSTBOUND REACH (22 × 15 room + wide hunting perimeter) — frozen fields
// looping around a lake, ringed by open tundra where Frost Walkers actually
// spawn.
// Frostbound Reach's original 22×15 frozen-lake room, offset into the middle
// of a much larger map (see buildFR below) and surrounded on all four sides
// by a wide perimeter of 'V' danger tiles — without a 'V' tile the
// encounter-roll in engine.ts never fires, which is why quest_frost (kill
// Frost Walkers) had nothing to fight. The perimeter was widened from a thin
// 4-tile border to a real hunting ground (FR_PAD tiles deep on every side,
// reachable from all four sides of the room, not just east/west).
const FR_PAD = 10;
const FR_OX = FR_PAD, FR_OY = FR_PAD;

function buildFR(): string[][] {
  const IW = 22, IH = 15;
  const PAD = FR_PAD;
  const W = IW + PAD * 2, H = IH + PAD * 2;

  // The whole canvas starts as 'V' — walkable danger tiles that roll a chance
  // of a Frost Walker / Rime Hound encounter every step (see engine.ts). This
  // is the actual hunting ground for quest_frost, so it needs to be sizeable,
  // not just a thin border strip.
  const L = buildMap(W, H, 'V');
  // A solid tree line contains the player at the map's true outer edge.
  rect(L, 0, 0, W - 1, 0, 'T'); rect(L, 0, H - 1, W - 1, H - 1, 'T');
  vline(L, 0, 0, H - 1, 'T'); vline(L, W - 1, 0, H - 1, 'T');

  // Scatter frozen boulders/dead trees through the perimeter as impassable
  // obstacles, so the hunting ground reads as terrain rather than an empty
  // rectangle of danger tiles.
  const obstacles: [number, number][] = [
    [3, 3], [3, H - 4], [W - 4, 3], [W - 4, H - 4],
    [3, Math.floor(H / 2)], [W - 4, Math.floor(H / 2)],
    [Math.floor(W / 2) - 4, 3], [Math.floor(W / 2) + 4, 3],
    [Math.floor(W / 2) - 4, H - 4], [Math.floor(W / 2) + 4, H - 4],
    [6, 6], [W - 7, 6], [6, H - 7], [W - 7, H - 7],
  ];
  for (const [ox, oy] of obstacles) poke(L, ox, oy, 'T');

  // The original room, unchanged, stamped into the middle of the canvas.
  const inner = buildMap(IW, IH, 'T');
  rect(inner, 1, 1, IW - 2, IH - 2, 'P');
  rect(inner, 8, 5, 13, 9, 'W');
  hline(inner, 3, 1, IW - 2, 'P');
  hline(inner, 11, 1, IW - 2, 'P');
  vline(inner, 1, 1, IH - 2, 'P');
  vline(inner, IW - 2, 1, IH - 2, 'P');
  rect(inner, 2, 1, 5, 2, 'P'); rect(inner, IW - 6, 1, IW - 3, 2, 'P');
  rect(inner, 2, IH - 3, 5, IH - 2, 'P'); rect(inner, IW - 6, IH - 3, IW - 3, IH - 2, 'P');
  rect(inner, 3, 6, 6, 8, 'W');
  poke(inner, 4, 7, 'P'); poke(inner, 5, 7, 'P'); poke(inner, 4, 6, 'P');
  rect(inner, IW - 7, 6, IW - 4, 8, 'W');
  poke(inner, IW - 6, 7, 'P'); poke(inner, IW - 5, 7, 'P'); poke(inner, IW - 6, 6, 'P');
  poke(inner, 10, 4, 'M'); poke(inner, 11, 4, 'M');
  poke(inner, 10, 10, 'M'); poke(inner, 11, 10, 'M');
  poke(inner, 10, 0, '>'); poke(inner, 10, IH - 1, '<');
  for (let y = 0; y < IH; y++) for (let x = 0; x < IW; x++) L[y + FR_OY][x + FR_OX] = inner[y][x];

  // Breach the room's walls on all four sides so players can step out into
  // the surrounding tundra perimeter from any direction to hunt Frost
  // Walkers, and back in — not just a single east/west corridor.
  poke(L, FR_OX, FR_OY + 4, 'P');  poke(L, FR_OX, FR_OY + 10, 'P');
  poke(L, FR_OX + IW - 1, FR_OY + 4, 'P'); poke(L, FR_OX + IW - 1, FR_OY + 10, 'P');
  poke(L, FR_OX + 6, FR_OY, 'P');  poke(L, FR_OX + 15, FR_OY, 'P');
  poke(L, FR_OX + 6, FR_OY + IH - 1, 'P'); poke(L, FR_OX + 15, FR_OY + IH - 1, 'P');

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

// ── THORNWOOD FOREST (80 × 80) — the branching forest west of Verdant Hollow ──
// Six named fork points, nine dead-end clearings, an abandoned cottage, and
// an ancient Deep Grove. No enemies yet — pure geography.
function buildTF(): string[][] {
  const W = 80, H = 80;
  const L = buildMap(W, H, 'T');

  // ── East exit tile (back to Verdant Hollow) ─────────────────────────
  poke(L, 79, 40, '<');

  // ── Main east-west spine (y = 39-41) ────────────────────────────────
  hline(L, 39, 5, 79, 'P');
  hline(L, 40, 5, 79, 'P');
  hline(L, 41, 5, 79, 'P');

  // ────────────────────────────────────────────────────────────────────
  // FORK A — Bramble Crossroads glade at x≈65 (first fork from east)
  // ────────────────────────────────────────────────────────────────────
  rect(L, 57, 34, 73, 46, 'P');

  // Fork A / North arm → Sentinel Clearing (dead end)
  vline(L, 63, 10, 34, 'P'); vline(L, 64, 10, 34, 'P');
  rect(L, 54, 4, 73, 13, 'P');
  poke(L, 58, 8, 'M'); poke(L, 69, 8, 'M'); // standing stones

  // Fork A / South arm → Foggy Bog (dead end)
  vline(L, 63, 46, 65, 'P'); vline(L, 64, 46, 65, 'P');
  rect(L, 53, 64, 73, 72, 'P');
  poke(L, 60, 68, 'M'); poke(L, 67, 68, 'M');

  // ────────────────────────────────────────────────────────────────────
  // FORK B — Thornwood Junction glade at x≈48 (second fork)
  // ────────────────────────────────────────────────────────────────────
  rect(L, 43, 36, 53, 44, 'P');

  // Fork B / North arm → Overgrown Shrine (dead end)
  vline(L, 47, 16, 36, 'P'); vline(L, 48, 16, 36, 'P');
  rect(L, 38, 6, 57, 18, 'P');
  poke(L, 43, 12, 'M'); poke(L, 51, 12, 'M'); poke(L, 47, 8, 'M');

  // Fork B / South arm → Briar Clearing (dead end)
  vline(L, 47, 44, 61, 'P'); vline(L, 48, 44, 61, 'P');
  rect(L, 37, 60, 58, 71, 'P');
  poke(L, 42, 66, 'M'); poke(L, 53, 66, 'M');

  // ────────────────────────────────────────────────────────────────────
  // FORK C — Deep Fork glade at x≈30 (third fork — two major arms)
  // ────────────────────────────────────────────────────────────────────
  rect(L, 24, 34, 38, 46, 'P');

  // Fork C / NW arm → path goes north then bends west to Cottage Glade
  vline(L, 27, 18, 34, 'P'); vline(L, 28, 18, 34, 'P');
  hline(L, 18, 5, 28, 'P'); hline(L, 19, 5, 28, 'P');
  // Cottage Glade clearing
  rect(L, 2, 10, 20, 24, 'P');
  // Abandoned Cottage outer stone walls
  rect(L, 3, 11, 17, 22, 'H');
  // Cottage interior (ruined floor)
  rect(L, 4, 12, 16, 21, 'P');
  // South door opening (main entrance)
  poke(L, 9, 22, 'P'); poke(L, 10, 22, 'P'); poke(L, 11, 22, 'P');
  // North wall breach
  poke(L, 9, 11, 'P'); poke(L, 10, 11, 'P');
  // Interior overgrown hearth marker
  poke(L, 13, 16, 'M');
  // Short dead-end path north from glade → Mossy Nook
  vline(L, 8, 3, 10, 'P'); vline(L, 9, 3, 10, 'P');
  rect(L, 3, 2, 16, 6, 'P');
  poke(L, 5, 4, 'M'); poke(L, 14, 4, 'M');

  // Short dead-end path east from Cottage Glade → Boulder Alcove
  hline(L, 17, 20, 28, 'P');
  rect(L, 18, 14, 26, 20, 'P');
  poke(L, 21, 17, 'M'); poke(L, 25, 17, 'M');

  // Fork C / SW arm → path goes south then bends west to Sunken Hollow
  vline(L, 27, 46, 58, 'P'); vline(L, 28, 46, 58, 'P');
  hline(L, 58, 5, 27, 'P'); hline(L, 59, 5, 27, 'P');
  rect(L, 2, 60, 20, 70, 'P');
  poke(L, 6, 65, 'M'); poke(L, 16, 65, 'M');

  // Short dead-end spur east from Sunken Hollow → Ash Dell
  hline(L, 65, 20, 27, 'P');
  rect(L, 18, 62, 27, 68, 'P');
  poke(L, 22, 65, 'M');

  // ────────────────────────────────────────────────────────────────────
  // FORK D — Deep Grove glade at far west (x≈6-18, y≈33-47)
  // Connected to the spine and to Fork C via an extra spur
  // ────────────────────────────────────────────────────────────────────
  rect(L, 5, 33, 20, 47, 'P');
  // Ancient standing stones and shrine
  poke(L, 8, 36, 'M'); poke(L, 16, 36, 'M');
  poke(L, 8, 44, 'M'); poke(L, 16, 44, 'M');
  poke(L, 12, 40, 'M');

  // Deep Grove / NW sub-branch → Overgrown Dell (dead end)
  vline(L, 11, 22, 33, 'P'); vline(L, 12, 22, 33, 'P');
  rect(L, 4, 14, 19, 24, 'P');
  poke(L, 7, 19, 'M'); poke(L, 16, 19, 'M');
  // Extra spur from Dell heading east (dead end)
  hline(L, 19, 18, 23, 'P');
  rect(L, 22, 16, 28, 22, 'P');
  poke(L, 25, 19, 'M');

  // Deep Grove / SW sub-branch → Sunken Garden (dead end)
  vline(L, 11, 47, 56, 'P'); vline(L, 12, 47, 56, 'P');
  rect(L, 3, 57, 19, 65, 'P');
  poke(L, 7, 61, 'M'); poke(L, 14, 61, 'M');

  // ── Far-west lone meadow (westernmost reach of the forest) ──────────
  rect(L, 2, 37, 6, 43, 'P');
  poke(L, 4, 40, 'M');

  // ── Crafting Hut (Deep Grove area, between standing stones) ──────────
  rect(L, 15, 38, 17, 40, 'H');

  // ── Hidden clearing entrance (Deep Grove, west of shrine) ────────────
  poke(L, 6, 36, '!');

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
export type HouseVariant =
  | 'scholar' | 'abandoned' | 'study' | 'quiet' | 'misc' | 'secret'
  | 'tavern' | 'library' | 'workshop' | 'garden' | 'nursery' | 'shrine' | 'bedroom' | 'cluttered' | 'sparse';

function buildInterior(variant: HouseVariant): string[][] {
  const W = 14, H = 9;
  const L = buildMap(W, H, 'W');
  rect(L, 1, 1, W - 2, H - 2, 'P');
  hline(L, 1, 2, W - 3, 'W');
  poke(L, 4, 1, 'P'); poke(L, W - 5, 1, 'P');
  rect(L, 5, 3, 8, 4, 'W');
  poke(L, 6, 3, 'M');
  // NOTE: 'quiet' and 'secret' are load-bearing for the riddle that leads to the
  // secret dungeon (CT_SECRET, CT_H4, CT_H5) and for the Ashfall portal house
  // (CT_ASHDOOR) — their layouts must stay exactly as they are.
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
    poke(L, 2, 5, 'P'); // corridor tile connecting the back room to the passage — without this the exit tile is sealed on all four sides
  } else if (variant === 'tavern') {
    // A bar counter along the left wall, stools along the right.
    vline(L, 2, 5, 6, 'W');
    poke(L, 2, 5, 'M'); poke(L, 3, 6, 'M');
    poke(L, 10, 5, 'M'); poke(L, 11, 6, 'M');
  } else if (variant === 'library') {
    // Bookshelves lining both side walls.
    vline(L, 2, 2, 6, 'W'); vline(L, 11, 2, 6, 'W');
    poke(L, 2, 4, 'M'); poke(L, 11, 4, 'M');
  } else if (variant === 'workshop') {
    // A workbench cluttered with half-finished tools.
    rect(L, 2, 5, 3, 6, 'W');
    poke(L, 2, 5, 'M'); poke(L, 3, 3, 'M'); poke(L, 10, 6, 'M');
  } else if (variant === 'garden') {
    // Potted plants scattered around an otherwise airy room.
    poke(L, 2, 3, 'M'); poke(L, 2, 5, 'M');
    poke(L, 11, 3, 'M'); poke(L, 11, 5, 'M');
    poke(L, 6, 6, 'M'); poke(L, 7, 6, 'M');
  } else if (variant === 'nursery') {
    // A small bed and a toy left on the floor.
    rect(L, 9, 5, 11, 6, 'W');
    poke(L, 10, 5, 'M'); poke(L, 3, 6, 'M');
  } else if (variant === 'shrine') {
    // A symmetrical cluster of candles at the room's heart.
    poke(L, 6, 5, 'M'); poke(L, 7, 5, 'M');
    poke(L, 6, 6, 'M'); poke(L, 7, 6, 'M');
  } else if (variant === 'bedroom') {
    // A bed against the wall with a nightstand across the room.
    rect(L, 2, 5, 4, 6, 'W');
    poke(L, 3, 5, 'M'); poke(L, 10, 3, 'M');
  } else if (variant === 'cluttered') {
    // Boxes and belongings stacked everywhere.
    poke(L, 2, 3, 'M'); poke(L, 3, 5, 'M');
    poke(L, 10, 3, 'M'); poke(L, 11, 5, 'M');
    poke(L, 2, 6, 'M'); poke(L, 11, 6, 'M');
    rect(L, 9, 5, 10, 6, 'W');
  } else if (variant === 'sparse') {
    // Almost nothing — just bare floor and a single forgotten object.
    poke(L, 7, 6, 'M');
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
  poke(L, 7, 2, '<'); // exit back down to Ashfall Manor's ground floor — this room had no exit tile at all
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

// ── COLOR (44 × 36) — a sprawling, peaceful village at the end of the South Road.
// Unusually vibrant color everywhere — green grass ('CG'), warm sandy paths ('CP'),
// blue ponds ('CW'), flower meadows ('CF'), and terracotta cottages ('CH') — the
// only place in the Realm where color still lives. No quests here; just people
// who are, finally, at rest. The path winds south through everyone else before
// it ever reaches Morthus, tucked away in a quiet grove at the very end. ──
function buildCO(): string[][] {
  const W = 44, H = 36;
  const L = buildMap(W, H, 'CG');
  // Soft tree border — the village is sheltered, not walled
  rect(L, 0, 0, W - 1, 0, 'T'); rect(L, 0, H - 1, W - 1, H - 1, 'T');
  vline(L, 0, 0, H - 1, 'T'); vline(L, W - 1, 0, H - 1, 'T');

  // ── Main spine: entry path winds all the way south to Morthus's grove ──
  vline(L, 22, 0, 8, 'CP');    // entry, north road down into the first plaza
  vline(L, 22, 8, 15, 'CP');  // plaza down to the mid plaza
  vline(L, 22, 20, 24, 'CP'); // mid plaza down to the southern gathering
  vline(L, 22, 28, 31, 'CP'); // southern gathering down into the grove

  // ── First plaza (just past the entry) ──
  rect(L, 16, 4, 28, 9, 'CP');
  // West branch — out to the western cottages and pond
  hline(L, 7, 6, 16, 'CP');
  vline(L, 8, 7, 13, 'CP');
  // East branch — out to the eastern cottages and pond
  hline(L, 7, 28, 38, 'CP');
  vline(L, 36, 7, 13, 'CP');

  // ── Mid plaza ──
  rect(L, 15, 15, 29, 20, 'CP');

  // ── Southern gathering area ──
  rect(L, 13, 24, 31, 28, 'CP');

  // ── Ponds, glinting blue in a realm that has forgotten color ──
  rect(L, 5, 9, 10, 13, 'CW');
  rect(L, 34, 9, 39, 13, 'CW');

  // ── Cottages — small, warm homes, never blocking a path ──
  rect(L, 4, 2, 6, 4, 'CH');   rect(L, 4, 15, 6, 17, 'CH');
  rect(L, 38, 2, 40, 4, 'CH'); rect(L, 38, 15, 40, 17, 'CH');
  rect(L, 9, 21, 11, 23, 'CH'); rect(L, 33, 21, 35, 23, 'CH');
  rect(L, 9, 30, 11, 32, 'CH'); rect(L, 33, 30, 35, 32, 'CH');

  // ── Flower meadows scattered for color, never on a path or an NPC tile ──
  for (const [x1, y1, x2, y2] of [
    [12, 3, 14, 5], [30, 3, 32, 5], [12, 10, 14, 12], [30, 10, 32, 12],
    [7, 17, 9, 19], [35, 17, 37, 19], [17, 21, 19, 23], [25, 21, 27, 23],
    [12, 30, 14, 32], [30, 30, 32, 32],
  ]) rect(L, x1, y1, x2, y2, 'CF');

  // ── Scattered decorative trees for atmosphere, never on a path ──
  for (const [tx, ty] of [
    [3, 6], [3, 20], [40, 6], [40, 20], [8, 4], [36, 4], [8, 18], [36, 18],
    [14, 14], [30, 14], [17, 12], [27, 12], [14, 22], [30, 22], [22, 20],
    [10, 26], [34, 26], [6, 30], [38, 30], [16, 30], [28, 30],
  ]) poke(L, tx, ty, 'T');

  // ── Morthus's grove — secluded, tree-ringed, the deepest point in the village ──
  rect(L, 18, 31, 26, 35, 'CP');
  for (const [tx, ty] of [
    [17, 30], [18, 30], [19, 30], [25, 30], [26, 30], [27, 30],
    [17, 31], [27, 31], [17, 32], [27, 32], [17, 33], [27, 33],
    [17, 34], [27, 34], [17, 35], [18, 35], [19, 35], [25, 35], [26, 35], [27, 35],
  ]) poke(L, tx, ty, 'T');

  // North exit — back up the South Road
  poke(L, 22, 0, '<');
  return L;
}

// ── CRAFTING INTERIOR (VH — workshop variant + hidden room exit) ──────
function buildVHCraftingInterior(): string[][] {
  const L = buildInterior('workshop');
  poke(L, 2, 4, '!'); // hidden alcove entrance (left wall, mid-height)
  return L;
}

// ── CRAFTING INTERIOR (TF — simple workshop) ──────────────────────────
function buildTFCraftingInterior(): string[][] {
  return buildInterior('workshop');
}

// ── VH HIDDEN ALCOVE (10 × 6) — tucked behind the workshop ──────────
function buildVHHidden(): string[][] {
  const W = 10, H = 6;
  const L = buildMap(W, H, 'W');
  rect(L, 1, 1, W - 2, H - 2, 'P');
  poke(L, 2, 2, 'M'); poke(L, 7, 2, 'M'); // old stone plinths
  poke(L, Math.floor(W / 2), H - 1, '<');
  return L;
}

// ── TF HIDDEN GROVE (12 × 8) — secret forest clearing ────────────────
function buildTFHidden(): string[][] {
  const W = 12, H = 8;
  const L = buildMap(W, H, 'T');
  rect(L, 1, 1, W - 2, H - 2, 'P');
  poke(L, 2, 2, 'M'); poke(L, 9, 2, 'M'); // ancient markers
  poke(L, Math.floor(W / 2), H - 1, '<');
  return L;
}

// ── WW HIDDEN POCKET (12 × 8) — void pocket ─────────────────────────
function buildWWHidden(): string[][] {
  const W = 12, H = 8;
  const L = buildMap(W, H, 'V');
  rect(L, 1, 1, W - 2, H - 2, 'P');
  poke(L, 5, 2, 'M'); poke(L, 6, 2, 'M'); // void residue
  poke(L, Math.floor(W / 2), H - 1, '<');
  return L;
}

// ── CHALLENGE ARENA (18 × 12) — sequential trial arena ───────────────
function buildChallengeArena(): string[][] {
  const W = 18, H = 12;
  const L = buildMap(W, H, 'W');
  rect(L, 1, 1, W - 2, H - 2, 'P');
  // Stone pillars at corners of the arena floor
  poke(L, 3, 3, 'M'); poke(L, 14, 3, 'M');
  poke(L, 3, 8, 'M'); poke(L, 14, 8, 'M');
  // Central altar marker
  poke(L, 8, 5, 'M'); poke(L, 9, 5, 'M');
  // Exit at south
  poke(L, Math.floor(W / 2), H - 1, '<');
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
const tfLayout = buildTF();
const ctBuild = buildCTFull();
const ctLayout = ctBuild.layout;
const ctP = ctBuild.placements;
const arBuild = buildARFull();
const arLayout = arBuild.layout;
const arP = arBuild.placements;

// ── New interior & hidden room layouts ──
const vhCraftingLayout = buildVHCraftingInterior();
const tfCraftingLayout = buildTFCraftingInterior();
const vhHiddenLayout = buildVHHidden();
const tfHiddenLayout = buildTFHidden();
const wwHiddenLayout = buildWWHidden();
const challengeArenaLayout = buildChallengeArena();

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

// Generic side-quest interiors — reuse the misc variant (these already have
// real quest-giver NPCs wired through CITY_SIDE_QUESTS, so their layout isn't
// part of the "every house feels the same" problem).
const sqInteriors: Record<string, string[][]> = {};
for (let i = 1; i <= 10; i++) sqInteriors[`sq${i}`] = buildInterior('misc');

// ── HOUSE VARIETY GENERATOR ───────────────────────────────────────────
// The 5 "note" houses, 74 Crestfall filler houses, and 10 Ashfall filler
// houses used to all be identical empty rooms. This deterministically
// (same seed → same result, every load) assigns each one a distinct
// furniture template, a matching name, and — for roughly two-thirds of
// them — an inhabitant or a note/item to find, so wandering through town
// doesn't feel like visiting the same room 89 times.
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const HOUSE_VARIANTS: HouseVariant[] = [
  'tavern', 'library', 'workshop', 'garden', 'nursery', 'shrine', 'bedroom', 'cluttered', 'sparse', 'misc',
];
const HOUSE_VARIANT_NAMES: Record<string, string[]> = {
  tavern: ['A Shuttered Tavern', 'The Empty Taproom', "A Barkeep's Quiet Room"],
  library: ['A Dusty Library', "A Reader's Nook", 'Shelves Without a Keeper'],
  workshop: ['A Cluttered Workshop', "A Tinkerer's Bench", 'Half-Finished Repairs'],
  garden: ['A Quiet Garden Room', 'A House of Potted Green', 'A Sunlit Nook'],
  nursery: ['A Small Nursery', "A Child's Old Room", 'A Room Kept Just So'],
  shrine: ['A Small Shrine', 'A House of Candles', 'A Quiet Altar Room'],
  bedroom: ['A Modest Bedroom', 'A Made Bed, Untouched', "Someone's Old Room"],
  cluttered: ['A Cluttered House', "A Hoarder's Den", 'Boxes to the Ceiling'],
  sparse: ['A Bare Room', 'An Empty House', 'Four Walls and a Floor'],
  misc: ['A House', 'A Plain House', 'A Modest Home'],
};
const FILLER_NPC_NAMES = [
  'A Tired Merchant', 'An Old Neighbor', 'A Quiet Tenant', 'A Restless Sleeper',
  'A Wary Stranger', 'A Retired Clerk', 'A Sleepy Cat-Keeper', 'A Humming Weaver',
  'A Careful Locksmith', "A Widow's Kin", 'An Idle Apprentice', 'A Lonely Collector',
  'A Watchful Tenant', 'A Patient Mender', 'A Half-Packed Traveler',
];
const FILLER_NPC_COLORS = [
  '#c9a9dd', '#a9c9dd', '#ddc9a9', '#a9ddc0', '#dda9a9', '#c0c0e0',
  '#e0c0a0', '#a0c0e0', '#e0a0c0', '#c0e0a0',
];
const HOUSE_NOTE_BOOKS = [
  'book_house_note_1', 'book_house_note_2', 'book_house_note_3', 'book_house_note_4',
  'book_house_note_5', 'book_house_note_6', 'book_house_note_7', 'book_house_note_8',
];

export interface HouseContent {
  variant: HouseVariant;
  name: string;
  npc?: { id: string; name: string; color: string };
  note?: { item: string };
  loot?: { item: string };
}

function makeHouseContent(seedKey: string): HouseContent {
  const h = hashStr(seedKey);
  const variant = HOUSE_VARIANTS[h % HOUSE_VARIANTS.length];
  const names = HOUSE_VARIANT_NAMES[variant];
  const name = names[Math.floor(h / 16) % names.length];
  const roll = Math.floor(h / 256) % 3; // 0: inhabitant, 1: note/item, 2: empty (maybe small loot)
  const content: HouseContent = { variant, name };
  if (roll === 0) {
    const npcName = FILLER_NPC_NAMES[Math.floor(h / 4096) % FILLER_NPC_NAMES.length];
    const npcColor = FILLER_NPC_COLORS[Math.floor(h / 65536) % FILLER_NPC_COLORS.length];
    content.npc = { id: `filler_${seedKey}`, name: npcName, color: npcColor };
  } else if (roll === 1) {
    content.note = { item: HOUSE_NOTE_BOOKS[Math.floor(h / 4096) % HOUSE_NOTE_BOOKS.length] };
  } else if (Math.floor(h / 4096) % 2 === 0) {
    const amt = 5 + (Math.floor(h / 8192) % 4) * 5; // 5, 10, 15, or 20
    content.loot = { item: `echoes_${amt}` };
  }
  return content;
}

function houseContentNpcs(content: HouseContent): any[] {
  if (!content.npc) return [];
  return [{ id: content.npc.id, x: 7, y: 4, color: content.npc.color, name: content.npc.name, type: 'TALK' }];
}
function houseContentChests(content: HouseContent, seedKey: string): any[] {
  if (content.note) return [{ id: `ch_${seedKey}`, flag: `ch_${seedKey}`, x: 3, y: 1, item: content.note.item }];
  if (content.loot) return [{ id: `ch_${seedKey}`, flag: `ch_${seedKey}`, x: 3, y: 1, item: content.loot.item }];
  return [];
}

const noteHouseContent: Record<string, HouseContent> = {};
const noteInteriors: Record<string, string[][]> = {};
for (let i = 1; i <= 5; i++) {
  const content = makeHouseContent(`ctnote${i}`);
  noteHouseContent[`note${i}`] = content;
  noteInteriors[`note${i}`] = buildInterior(content.variant);
}
const miscHouseContent: Record<string, HouseContent> = {};
const miscInteriors: Record<string, string[][]> = {};
for (let i = 1; i <= 74; i++) {
  const content = makeHouseContent(`ctmisc${i}`);
  miscHouseContent[`misc${i}`] = content;
  miscInteriors[`misc${i}`] = buildInterior(content.variant);
}
const arMiscHouseContent: Record<string, HouseContent> = {};
const arMiscInteriors: Record<string, string[][]> = {};
for (let i = 1; i <= 10; i++) {
  const content = makeHouseContent(`armisc${i}`);
  arMiscHouseContent[`misc${i}`] = content;
  arMiscInteriors[`misc${i}`] = buildInterior(content.variant);
}

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
    rewardPool: [{ itemId: 'ench_shard_frostbite', chance: 0.6 }, { itemId: 'ench_grimoire_striking', chance: 0.3 }, { itemId: 'ench_relic_ashbound', chance: 0.1 }, { itemId: 'ench_wither_mark', chance: 0.4 }], echoes: 40 },
  { id: 'sq2', npcId: 'npc_sq2', npcName: 'A Boarded-Up Baker', title: "Flour and Silence",
    giverIntro: "I used to hear the street wraiths pacing at night through these boards. Can't sleep. If you'd silence a few, I'd sleep, and I'd pay you for the privilege.",
    progressText: 'Still pacing out there, some nights.', completeText: "Silence, finally. Take this — payment, and thanks.",
    afterText: 'I slept last night. First time in weeks.', requiredKills: 3, enemyPool: ['street_wraith'],
    rewardPool: [{ itemId: 'ench_veil_dust', chance: 0.6 }, { itemId: 'ench_tome_iron_veil', chance: 0.3 }, { itemId: 'ench_codex_living_flame', chance: 0.1 }, { itemId: 'ench_wither_mark', chance: 0.35 }], echoes: 50 },
  { id: 'sq3', npcId: 'npc_sq3', npcName: "A Retired Guard", title: 'One Last Post',
    giverIntro: "I used to stand post two streets from here. A Hollow Guard's still standing mine, I think — never relieved. Relieve him, one way or another.",
    progressText: "He's still standing his post, poor thing.", completeText: "Relieved at last. Take my old kit — I've no more use for it.",
    afterText: 'Post is empty now. As it should be.', requiredKills: 1, enemyPool: ['hollow_guard'],
    rewardPool: [{ itemId: 'ench_grimoire_striking', chance: 0.5 }, { itemId: 'ench_tome_iron_veil', chance: 0.4 }, { itemId: 'ench_relic_ashbound', chance: 0.1 }, { itemId: 'ench_soul_rend', chance: 0.25 }], echoes: 60 },
  { id: 'sq4', npcId: 'npc_sq4', npcName: 'A Nervous Clerk', title: 'The Ledger Alley',
    giverIntro: "The alley behind the old records office is thick with shades. I need to get back in there for the deeds. Clear a path?",
    progressText: 'Still too many out there for me.', completeText: "Path's clear. Here, take this — found it while filing.",
    afterText: "I got my deeds back, thanks to you.", requiredKills: 3, enemyPool: ['city_shade', 'street_wraith'],
    rewardPool: [{ itemId: 'ench_shard_frostbite', chance: 0.5 }, { itemId: 'ench_veil_dust', chance: 0.4 }, { itemId: 'ench_codex_living_flame', chance: 0.1 }, { itemId: 'ench_soul_rend', chance: 0.2 }], echoes: 45 },
  { id: 'sq5', npcId: 'npc_sq5', npcName: 'An Old Gardener', title: "Weeds and Wraiths",
    giverIntro: "My garden's overgrown with more than weeds these days. A couple of wraiths took root by the fence. Dig them out?",
    progressText: 'Still rooted by the fence, last I checked.', completeText: "Cleared! Here — this has been in my shed for years, might as well be useful.",
    afterText: 'The garden feels like mine again.', requiredKills: 2, enemyPool: ['street_wraith'],
    rewardPool: [{ itemId: 'ench_veil_dust', chance: 0.55 }, { itemId: 'ench_grimoire_striking', chance: 0.35 }, { itemId: 'ench_relic_ashbound', chance: 0.1 }, { itemId: 'ench_hollow_confusion', chance: 0.2 }], echoes: 45 },
  { id: 'sq6', npcId: 'npc_sq6', npcName: 'A Shaken Courier', title: "Undeliverable Mail",
    giverIntro: "I've got letters three years undelivered because the route's crawling with shades. If you cleared it, I could finally close out my route.",
    progressText: 'Route is still too dangerous.', completeText: "Route's clear — finally. Take this, it's the least I owe you.",
    afterText: 'Delivered every last letter. Feels good.', requiredKills: 3, enemyPool: ['city_shade'],
    rewardPool: [{ itemId: 'ench_shard_frostbite', chance: 0.6 }, { itemId: 'ench_tome_iron_veil', chance: 0.3 }, { itemId: 'ench_relic_ashbound', chance: 0.1 }], echoes: 50 },
  { id: 'sq7', npcId: 'npc_sq7', npcName: 'A Watchful Widow', title: "The Empty Rocking Chair",
    giverIntro: "A Hollow Guard patrols right past my window every night, same time, like clockwork. It's not him I'm afraid of. It's the memory of who used to walk that route. End his round, gently.",
    progressText: 'Still walking his round, same as ever.', completeText: "Thank you for ending it kindly. Take this, for your trouble.",
    afterText: 'The street is finally still at night.', requiredKills: 1, enemyPool: ['hollow_guard'],
    rewardPool: [{ itemId: 'ench_tome_iron_veil', chance: 0.5 }, { itemId: 'ench_grimoire_striking', chance: 0.4 }, { itemId: 'ench_codex_living_flame', chance: 0.1 }, { itemId: 'ench_hollow_confusion', chance: 0.18 }], echoes: 55 },
  { id: 'sq8', npcId: 'npc_sq8', npcName: 'A Restless Apprentice', title: "Unfinished Errand",
    giverIntro: "My master sent me on an errand the day the Void came through. I never finished it — too many shades between here and the market square. Would you clear the way?",
    progressText: 'Still too many shades on the route.', completeText: "Errand complete, three years late. Here, take this for helping me finish it.",
    afterText: "I can finally stop carrying that errand around.", requiredKills: 3, enemyPool: ['city_shade', 'hollow_guard'],
    rewardPool: [{ itemId: 'ench_veil_dust', chance: 0.5 }, { itemId: 'ench_relic_ashbound', chance: 0.4 }, { itemId: 'ench_codex_living_flame', chance: 0.1 }], echoes: 60 },
  { id: 'sq9', npcId: 'npc_sq9', npcName: 'A Quiet Fisherman', title: "Nets in the Canal",
    giverIntro: "The old canal draws wraiths like fish to a net. I can't check my traps without one snapping at me. Clear a few and I'll pay you in whatever I've got left.",
    progressText: 'Still too many wraiths by the water.', completeText: "Nets are clear. Here — my last good hook, and this.",
    afterText: "Caught something good today. First time in a while.", requiredKills: 2, enemyPool: ['street_wraith'],
    rewardPool: [{ itemId: 'ench_shard_frostbite', chance: 0.55 }, { itemId: 'ench_veil_dust', chance: 0.35 }, { itemId: 'ench_relic_ashbound', chance: 0.1 }, { itemId: 'ench_grimoire_mortus', chance: 0.08 }, { itemId: 'ench_mortus_chaos', chance: 0.06 }], echoes: 40 },
  { id: 'sq10', npcId: 'npc_sq10', npcName: 'The Last Lamplighter', title: "Keep the Lanterns Lit",
    giverIntro: "I still light the lanterns every night, even with no one left to see them. The Guards keep knocking them over on their rounds. End a couple of their rounds for me?",
    progressText: 'The lanterns keep getting knocked over.', completeText: "The lanterns stayed lit tonight. First time in ages. Take this — you earned it.",
    afterText: 'The streets glow again, at least a little.', requiredKills: 2, enemyPool: ['hollow_guard', 'street_wraith'],
    rewardPool: [{ itemId: 'ench_relic_ashbound', chance: 0.45 }, { itemId: 'ench_codex_living_flame', chance: 0.45 }, { itemId: 'ench_grimoire_striking', chance: 0.1 }, { itemId: 'ench_veil_mortus', chance: 0.08 }, { itemId: 'ench_mortus_aegis', chance: 0.06 }], echoes: 70 },
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
      { id: 'city_gate_guard',  x: 20, y: 8,  color: '#aaaaff', name: 'City Messenger',   type: 'TALK' },
      { id: 'challenge_herald', x: 14, y: 7,  color: '#bb99ff', name: 'Challenge Herald', type: 'CHALLENGE' },
    ],
    chests: [
      { id: 'ch_vh1', flag: 'ch_vh1', x: 12, y: 12, item: 'echoes_30' },
      { id: 'ch_vh_note1', flag: 'ch_vh_note1', x: 9, y: 5, item: 'book_innkeepers_notice' },
      { id: 'ch_vh_note2', flag: 'ch_vh_note2', x: 9, y: 11, item: 'book_stall_ledger_scrap' },
    ],
    doors: [
      { id: 'door_vh_crafting', x: 11, y: 5, targetMapId: 'VH_CRAFTING', targetX: 7, targetY: 6, label: 'Crafting Workshop' },
    ],
    books: [],
    encounterPool: [],
    exits: {
      '>': { mapId: 'WW', x: 11, y: 13 },
      '!': { mapId: 'CT', x: 1, y: 50 },
      '<': { mapId: 'SR', x: 8, y: 1, reqQuest: 'quest_main', reqState: 7, lockMsg: "The south road is sealed until the Void is defeated." },
      '@': { mapId: 'TF', x: 78, y: 40 }
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
      '>': { mapId: 'CO', x: 22, y: 1 },
    }
  },

  // ── COLOR (44 × 36) — the sprawling, peaceful village at the end of the South
  // Road. Everyone the player meets along the way is finally at rest; Morthus
  // waits alone in a quiet grove at the very end, deepest point in the map. ──
  'CO': {
    id: 'CO', name: 'Color', width: 44, height: 36,
    layout: coLayout,
    npcs: [
      { id: 'co_maren',    x: 15, y: 6,  color: '#e8d9a0', name: 'Elder Maren', type: 'TALK' },
      { id: 'co_pip',      x: 29, y: 6,  color: '#bde8c2', name: 'Pip',         type: 'TALK' },
      { id: 'co_gardener', x: 18, y: 9,  color: '#a6d9ac', name: 'A Gardener',  type: 'TALK' },
      { id: 'co_child',    x: 9,  y: 5,  color: '#bde8c2', name: 'A Child',     type: 'TALK' },
      { id: 'co_zara',     x: 8,  y: 15, color: '#9fd6c9', name: 'Zara',        type: 'TALK' },
      { id: 'co_gregor',   x: 37, y: 4,  color: '#cfa87f', name: 'Gregor',      type: 'TALK' },
      { id: 'co_elder',    x: 18, y: 18, color: '#cfeed3', name: 'An Elder',    type: 'TALK' },
      { id: 'co_weaver',   x: 27, y: 18, color: '#9fd6a6', name: 'A Weaver',    type: 'TALK' },
      { id: 'co_hollow',   x: 22, y: 26, color: '#c9c9e8', name: 'A Hollow',    type: 'TALK' },
      { id: 'morthus',     x: 22, y: 34, color: '#7fd68a', name: 'Morthus',     type: 'TALK' },
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
      { id: 'ch_ww1', flag: 'ch_ww1', x: 4,  y: 4,  item: 'spark' },
      { id: 'ch_ww2', flag: 'ch_ww2', x: 17, y: 3,  item: 'echoes_60' },
      { id: 'ch_ww3', flag: 'ch_ww3', x: 13, y: 10, item: 'resonance_blade' },
    ],
    doors: [],
    books: [],
    encounterPool: ['wisp', 'crawler', 'specter'],
    exits: {
      '>': { mapId: 'MS', x: 9, y: 12, reqQuest: 'quest_main', reqState: 2, lockMsg: "The Sanctum is sealed. Restore the village first." },
      '<': { mapId: 'VH', x: 12, y: 1 },
      '@': { mapId: 'WW_HIDDEN', x: 5, y: 3 }
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
      { id: 'ch_sa3', flag: 'ch_sa3', x: 17, y: 8, item: 'keeper_vestments' },
      { id: 'ch_sa4', flag: 'ch_sa4', x: 8,  y: 5, item: 'ench_wither_mark' },
    ],
    doors: [],
    books: [],
    encounterPool: ['archive_wisp', 'ink_wraith'],
    exits: {
      '<': { mapId: 'MS', x: 9, y: 1 },
      '>': { mapId: 'FR', x: 10 + FR_OX, y: 13 + FR_OY, reqQuest: 'quest_main', reqState: 4, lockMsg: "Old Vess hasn't opened this way yet." }
    }
  },

  // ── FROSTBOUND REACH (22 × 15) — paths looping a frozen lake, two ruins ──
  'FR': {
    id: 'FR', name: 'Frostbound Reach', width: 22 + FR_PAD * 2, height: 15 + FR_PAD * 2,
    layout: frLayout,
    npcs: [
      { id: 'warden_kess',        x: 10 + FR_OX, y: 3 + FR_OY,  color: '#cfe8ff', name: 'Warden Kess',         type: 'TALK' },
      { id: 'peddler_oren',       x: 4  + FR_OX, y: 7 + FR_OY,  color: '#e8f4ff', name: 'Peddler Oren',        type: 'SHOP' },
      { id: 'shivering_villager', x: 16 + FR_OX, y: 7 + FR_OY,  color: '#bcd8ea', name: 'A Shivering Villager', type: 'TALK' },
    ],
    chests: [
      { id: 'ch_fr1', flag: 'ch_fr1', x: 4  + FR_OX, y: 12 + FR_OY, item: 'traveler_cloak' },
      { id: 'ch_fr2', flag: 'ch_fr2', x: 16 + FR_OX, y: 12 + FR_OY, item: 'book_fr_frostnote' },
      { id: 'ch_fr3', flag: 'ch_fr3', x: 2  + FR_OX, y: 4  + FR_OY, item: 'frost_fang' },
      { id: 'ch_fr4', flag: 'ch_fr4', x: 18 + FR_OX, y: 4  + FR_OY, item: 'glacial_shard' },
      { id: 'ch_fr5', flag: 'ch_fr5', x: 10 + FR_OX, y: 7  + FR_OY, item: 'resonant_plate' },
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
      { id: 'ch_ad1', flag: 'ch_ad1', x: 8,  y: 12, item: 'ember_plate' },
      { id: 'ch_ad2', flag: 'ch_ad2', x: 2,  y: 4,  item: 'ash_spear' },
      { id: 'ch_ad3', flag: 'ch_ad3', x: 18, y: 4,  item: 'cinder_blade' },
      { id: 'ch_ad4', flag: 'ch_ad4', x: 2,  y: 10, item: 'ench_soul_rend' },
    ],
    doors: [],
    books: [],
    encounterPool: ['ash_hound', 'cinder_wraith'],
    exits: {
      '<': { mapId: 'FR', x: 10 + FR_OX, y: 1 + FR_OY },
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
      { id: 'ch_vn3', flag: 'ch_vn3', x: 17, y: 4,  item: 'voidtouched_blade' },
      { id: 'ch_vn4', flag: 'ch_vn4', x: 2,  y: 13, item: 'void_mail' },
      { id: 'ch_vn5', flag: 'ch_vn5', x: 9,  y: 8,  item: 'ench_hollow_confusion' },
    ],
    doors: [],
    books: [],
    encounterPool: ['void_sentinel'],
    exits: {
      '<': { mapId: 'AD', x: 10, y: 1 }
    }
  },

  // ── THORNWOOD FOREST (80 × 80) — west of Verdant Hollow ─────────────
  // Six fork points, nine dead-end clearings, abandoned cottage, Deep Grove.
  'TF': {
    id: 'TF', name: 'Thornwood Forest', width: 80, height: 80,
    layout: tfLayout,
    npcs: [
      // Waystone — central path guide, offers fast travel back to VH
      { id: 'tf_waystone', x: 40, y: 39, color: '#88bb88', name: 'Waystone',         type: 'TALK' },
      // Hermit — forest lore NPC deep in the grove area
      { id: 'tf_hermit',   x: 20, y: 37, color: '#998866', name: 'Thornwood Hermit', type: 'TALK' },
    ],
    chests: [
      // Sentinel Clearing (Fork A north dead end)
      { id: 'ch_tf_01', flag: 'ch_tf_01', x: 62, y: 7,  item: 'ench_memory_mark' },
      // Foggy Bog (Fork A south dead end)
      { id: 'ch_tf_02', flag: 'ch_tf_02', x: 61, y: 69, item: 'ench_stone_ward' },
      // Overgrown Shrine (Fork B north dead end)
      { id: 'ch_tf_03', flag: 'ch_tf_03', x: 45, y: 9,  item: 'ench_confusion_brand' },
      // Briar Clearing (Fork B south dead end)
      { id: 'ch_tf_04', flag: 'ch_tf_04', x: 41, y: 67, item: 'ench_hollow_edge' },
      // Mossy Nook above cottage glade
      { id: 'ch_tf_05', flag: 'ch_tf_05', x: 6,  y: 3,  item: 'carved_stake' },
      // Cottage interior (collapsed shelf)
      { id: 'ch_tf_06', flag: 'ch_tf_06', x: 7,  y: 17, item: 'book_house_note_5' },
      // Boulder Alcove east of Cottage Glade
      { id: 'ch_tf_07', flag: 'ch_tf_07', x: 23, y: 16, item: 'ench_woven_ward' },
      // Sunken Hollow (Fork C south dead end)
      { id: 'ch_tf_08', flag: 'ch_tf_08', x: 4,  y: 66, item: 'shattered_lens' },
      // Overgrown Dell (Deep Grove NW sub-branch)
      { id: 'ch_tf_09', flag: 'ch_tf_09', x: 6,  y: 18, item: 'tattered_rags' },
      // Sunken Garden (Deep Grove SW sub-branch)
      { id: 'ch_tf_10', flag: 'ch_tf_10', x: 5,  y: 62, item: 'woven_leather' },
      // Deep Grove shrine
      { id: 'ch_tf_11', flag: 'ch_tf_11', x: 12, y: 35, item: 'ench_thorn_weave' },
      // Far-west lone meadow
      { id: 'ch_tf_12', flag: 'ch_tf_12', x: 3,  y: 40, item: 'void_needle' },
    ],
    doors: [
      { id: 'door_tf_crafting', x: 16, y: 40, targetMapId: 'TF_CRAFTING', targetX: 7, targetY: 6, label: 'Forest Crafting Hut' },
    ],
    books: [],
    encounterPool: ['thorn_wraith', 'shadow_stalker', 'bark_guardian', 'briar_specter', 'wisp', 'specter'],
    exits: {
      '<': { mapId: 'VH', x: 1, y: 8 },
      '!': { mapId: 'TF_HIDDEN', x: 5, y: 3 }
    }
  },

  // ── VH CRAFTING WORKSHOP (14 × 9) — enterable from Verdant Hollow ──
  'VH_CRAFTING': {
    id: 'VH_CRAFTING', name: 'Crafting Workshop', width: 14, height: 9,
    layout: vhCraftingLayout,
    npcs: [
      { id: 'vh_crafting_npc', x: 10, y: 4, color: '#8888aa', name: 'Crafting Table', type: 'CRAFT' },
    ],
    chests: [
      { id: 'ch_vh_craft1', flag: 'ch_vh_craft1', x: 10, y: 2, item: 'empty_book' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: { '<': { mapId: 'VH', x: 11, y: 6 }, '!': { mapId: 'VH_HIDDEN', x: 5, y: 3 } }
  },

  // ── VH HIDDEN ALCOVE (10 × 6) — secret room behind the workshop ──
  'VH_HIDDEN': {
    id: 'VH_HIDDEN', name: 'A Forgotten Alcove', width: 10, height: 6,
    layout: vhHiddenLayout,
    npcs: [],
    chests: [
      { id: 'ch_vh_hidden1', flag: 'ch_vh_hidden1', x: 3, y: 1, item: 'ench_wither_mark' },
      { id: 'ch_vh_hidden2', flag: 'ch_vh_hidden2', x: 6, y: 1, item: 'echoes_40' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: { '<': { mapId: 'VH_CRAFTING', x: 1, y: 5 } }
  },

  // ── TF CRAFTING HUT (14 × 9) — enterable from Thornwood Forest ──
  'TF_CRAFTING': {
    id: 'TF_CRAFTING', name: 'Forest Crafting Hut', width: 14, height: 9,
    layout: tfCraftingLayout,
    npcs: [
      { id: 'tf_crafting_npc', x: 10, y: 4, color: '#88aa88', name: 'Crafting Table', type: 'CRAFT' },
    ],
    chests: [
      { id: 'ch_tf_craft1', flag: 'ch_tf_craft1', x: 10, y: 2, item: 'tomes_blessing' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: { '<': { mapId: 'TF', x: 16, y: 41 } }
  },

  // ── TF HIDDEN GROVE (12 × 8) — secret forest clearing ──
  'TF_HIDDEN': {
    id: 'TF_HIDDEN', name: 'The Hidden Grove', width: 12, height: 8,
    layout: tfHiddenLayout,
    npcs: [],
    chests: [
      { id: 'ch_tf_hidden1', flag: 'ch_tf_hidden1', x: 4, y: 1, item: 'ench_shard_frostbite' },
      { id: 'ch_tf_hidden2', flag: 'ch_tf_hidden2', x: 7, y: 1, item: 'echoes_60' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: { '<': { mapId: 'TF', x: 7, y: 37 } }
  },

  // ── WW HIDDEN POCKET (12 × 8) — void pocket in the Wastes ──
  'WW_HIDDEN': {
    id: 'WW_HIDDEN', name: 'Void Pocket', width: 12, height: 8,
    layout: wwHiddenLayout,
    npcs: [],
    chests: [
      { id: 'ch_ww_hidden1', flag: 'ch_ww_hidden1', x: 4, y: 1, item: 'ench_venom_brand' },
      { id: 'ch_ww_hidden2', flag: 'ch_ww_hidden2', x: 7, y: 1, item: 'echoes_80' },
    ],
    doors: [],
    books: [],
    encounterPool: [],
    exits: { '<': { mapId: 'WW', x: 12, y: 9 } }
  },

  // ── CHALLENGE ARENA (18 × 12) — sequential trial arena ──
  'CHALLENGE_ARENA': {
    id: 'CHALLENGE_ARENA', name: 'The Challenge Arena', width: 18, height: 12,
    layout: challengeArenaLayout,
    npcs: [
      { id: 'challenge_keeper', x: 9, y: 2, color: '#aabbff', name: 'Challenge Keeper', type: 'TALK' },
      { id: 'challenge_mender', x: 3, y: 9, color: '#88ccaa', name: 'The Mender',       type: 'TALK' },
    ],
    chests: [],
    doors: [],
    books: [],
    encounterPool: [],
    exits: { '<': { mapId: 'VH', x: 12, y: 8 } }
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
      ...Array.from({ length: 5 }, (_, i) => ({ id: `door_note${i + 1}`, x: ctP[`note${i + 1}`].doorX, y: ctP[`note${i + 1}`].doorY, targetMapId: `CT_NOTE${i + 1}`, targetX: 7, targetY: 6, label: noteHouseContent[`note${i + 1}`].name })),
      ...Array.from({ length: 74 }, (_, i) => ({ id: `door_misc${i + 1}`, x: ctP[`misc${i + 1}`].doorX, y: ctP[`misc${i + 1}`].doorY, targetMapId: `CT_MISC${i + 1}`, targetX: 7, targetY: 6, label: miscHouseContent[`misc${i + 1}`].name })),
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
      { id: 'ch_hn_1',     flag: 'ch_hn_1',     x: 14, y: 2, item: 'book_house_note_1' },
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
    chests: [
      { id: 'ch_h1_f2', flag: 'ch_h1_f2', x: 10, y: 1, item: 'book_forgotten_verse' },
      { id: 'ch_hn_2',   flag: 'ch_hn_2',   x: 3,  y: 7, item: 'book_house_note_2' },
    ],
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
      { id: 'ch_hn_3',      flag: 'ch_hn_3',      x: 14, y: 2, item: 'book_house_note_3' },
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
    chests: [
      { id: 'ch_h2_f2', flag: 'ch_h2_f2', x: 10, y: 1, item: 'echoes_50' },
      { id: 'ch_hn_4',   flag: 'ch_hn_4',   x: 3,  y: 7, item: 'book_house_note_4' },
    ],
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
      { id: 'ch_hn_6',      flag: 'ch_hn_6',      x: 3,  y: 6, item: 'book_house_note_6' },
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
      { id: 'ch_hn_8',      flag: 'ch_hn_8',      x: 10, y: 6, item: 'book_house_note_8' },
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
      { id: 'ch_hn_7',       flag: 'ch_hn_7',       x: 10, y: 6, item: 'book_house_note_7' },
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
    chests: [
      { id: 'ch_hn_5', flag: 'ch_hn_5', x: 5, y: 2, item: 'book_house_note_5' },
    ],
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
      { id: 'ch_echo_note', flag: 'ch_echo_note', x: 2,  y: 3, item: 'book_mysterious_note' },
      { id: 'ch_echo_2',    flag: 'ch_echo_2',    x: 13, y: 3, item: 'ench_void_shroud' },
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
    chests: [
      { id: 'ch_ar1', flag: 'ch_ar1', x: 5,  y: 5,  item: 'oblivion_lance' },
      { id: 'ch_ar2', flag: 'ch_ar2', x: 44, y: 5,  item: 'oblivion_mantle' },
      { id: 'ch_ar3', flag: 'ch_ar3', x: 5,  y: 44, item: 'mortus_regalia' },
      { id: 'ch_ar4', flag: 'ch_ar4', x: 44, y: 44, item: 'ench_oblivion_strike' },
    ],
    doors: [
      { id: 'door_arena', x: arP.arena.doorX, y: arP.arena.doorY, targetMapId: 'AR_ARENA', targetX: 7, targetY: 7, label: 'Ashfall Manor' },
      ...Array.from({ length: 10 }, (_, i) => ({ id: `door_ar_misc${i + 1}`, x: arP[`misc${i + 1}`].doorX, y: arP[`misc${i + 1}`].doorY, targetMapId: `AR_MISC${i + 1}`, targetX: 7, targetY: 6, label: arMiscHouseContent[`misc${i + 1}`].name })),
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
  ...Object.fromEntries(Array.from({ length: 5 }, (_, i) => {
    const key = `note${i + 1}`; const content = noteHouseContent[key];
    return [`CT_NOTE${i + 1}`, {
      id: `CT_NOTE${i + 1}`, name: content.name, width: 14, height: 9,
      layout: noteInteriors[key],
      npcs: houseContentNpcs(content), chests: houseContentChests(content, `ctnote${i + 1}`), doors: [], books: [], encounterPool: [],
      exits: { '<': { mapId: 'CT', x: ctP[key].doorX, y: ctP[key].doorY + 1 } }
    }];
  })),
  ...Object.fromEntries(Array.from({ length: 74 }, (_, i) => {
    const key = `misc${i + 1}`; const content = miscHouseContent[key];
    return [`CT_MISC${i + 1}`, {
      id: `CT_MISC${i + 1}`, name: content.name, width: 14, height: 9,
      layout: miscInteriors[key],
      npcs: houseContentNpcs(content), chests: houseContentChests(content, `ctmisc${i + 1}`), doors: [], books: [], encounterPool: [],
      exits: { '<': { mapId: 'CT', x: ctP[key].doorX, y: ctP[key].doorY + 1 } }
    }];
  })),
  ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => {
    const key = `misc${i + 1}`; const content = arMiscHouseContent[key];
    return [`AR_MISC${i + 1}`, {
      id: `AR_MISC${i + 1}`, name: content.name, width: 14, height: 9,
      layout: arMiscInteriors[key],
      npcs: houseContentNpcs(content), chests: houseContentChests(content, `armisc${i + 1}`), doors: [], books: [], encounterPool: [],
      exits: { '<': { mapId: 'AR', x: arP[key].doorX, y: arP[key].doorY + 1 } }
    }];
  })),
};

// ── TELEPORT POINTS — unlocked as the player discovers each region ──
export const TELEPORT_POINTS: { id: string; name: string; mapId: string; x: number; y: number }[] = [
  { id: 'VH', name: 'Verdant Hollow',   mapId: 'VH', x: 12, y: 8  },
  { id: 'WW', name: 'Whispering Woods', mapId: 'WW', x: 11, y: 1  },
  { id: 'MS', name: 'Memory Sanctum',   mapId: 'MS', x: 9,  y: 1  },
  { id: 'SA', name: 'Sunken Archive',   mapId: 'SA', x: 9,  y: 1  },
  { id: 'FR', name: 'Frostbound Reach', mapId: 'FR', x: 9 + FR_OX,  y: 1 + FR_OY  },
  { id: 'AD', name: 'Ashen Descent',    mapId: 'AD', x: 10, y: 1  },
  { id: 'VN', name: 'Void Nexus',       mapId: 'VN', x: 9,  y: 14 },
  { id: 'CT', name: 'Crestfall City',   mapId: 'CT', x: 2,  y: 50 },
  { id: 'AR', name: 'Ashfall Ring',     mapId: 'AR', x: 1,  y: 20 },
  { id: 'CO', name: 'Color',            mapId: 'CO', x: 22, y: 5  },
  { id: 'TF', name: 'Thornwood Forest', mapId: 'TF', x: 70, y: 40 },
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
    equipment: {
      weapon: null, armor: null, offhand: null,
      helmet: null, gloves: null, pants: null, boots: null,
      cloak: null, necklace: null, ring1: null, ring2: null,
      belt: null, trinket: null,
    },
    bestiary: {},
    learnedSkills: [],
    skillPoints: 0,
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
  inventoryPage: 0,
  equipPanelCursor: 0,
  equipSlotMenu: null,
  teleportIndex: 0,
  questLogScroll: 0,
  bestiaryScroll: 0,
  statAllocIndex: 0,
  skillTreeCursor: { pathIdx: 0, skillIdx: 0 },
  notifications: { itemsBaseline: 0, questsBaseline: {} },
  trueEndingMenuIndex: 0,
  endLegacyRequested: false,
  skillLearnedFlash: null,
  itemCraft: { categoryIdx: 0, cursorIndex: 0 },
  achievementsScroll: 0,
  challengeSelectState: { tierCursor: 0, poolCursor: 0 },
  extrasState: { menuIndex: 0, subScreen: 'menu' as const, codexScroll: 0 },
};
