#!/usr/bin/env node
// Seed account "glo" with 3 save slots as requested.
// Run from repo root: node scripts/seed-glo-account.mjs
import { execSync } from 'node:child_process';

// ── helpers ──
const PORT = process.env.API_PORT ?? '8080';
const BASE = `http://localhost:${PORT}/api`;
async function api(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  return JSON.parse(text);
}

// ── game constants (mirrors src/game/constants.ts) ──
const TILE_SIZE = 32;
const BASE_MAX_HP = 20;
const VIT_HP_PER_POINT = 5;
const STARTING_STAT_POINTS = 10;
const POINTS_PER_LEVEL = 2;
const MAX_LEVEL = 50;

// Total stat points available = starting grant + points from levelling
// Each level past 1 grants POINTS_PER_LEVEL, so for MAX_LEVEL:
const totalStatPoints = STARTING_STAT_POINTS + (MAX_LEVEL - 1) * POINTS_PER_LEVEL;
// Split evenly across str/vit/def (any remainder goes into str)
const base = Math.floor(totalStatPoints / 3);
const rem  = totalStatPoints % 3;
const maxedBaseStats = { str: base + rem, vit: base, def: base };
// Compute maxHp for maxed save (equipped: voidsteel_mail → +30 maxHp)
const maxedMaxHp = BASE_MAX_HP + 30 + (maxedBaseStats.vit * VIT_HP_PER_POINT);

// ── all items to put in maxed inventory ──
// Weapons (all except the equipped one — equipment{} is separate from inventory[])
const maxedWeapons  = ['rusty_shard','iron_fragment','bone_edge','etched_spike','frost_fang',
                       'memory_edge','cinder_blade','voidtouched_blade'];
// Armors (all except the equipped one)
const maxedArmors   = ['cloth_wrap','hide_wrap','traveler_cloak','runed_cloak',
                       'archivist_ward','ember_plate','shadow_carapace'];
// Consumables
const consumables   = ['tonic','crystal','elixir','greater_crystal','memory_salve','phoenix_ash',
                       'ward','iron_ward','spark','dust','blink_shard'];
// Key items
const keyItems      = ['stone','echo'];
// Books (all readable books + trail notes)
const books         = [
  'book_keepers_codex','book_childs_letter','book_forgotten_verse','book_cipher_note',
  'book_merchants_ledger','book_innkeepers_notice','book_stall_ledger_scrap',
  'book_sa_marginalia','book_fr_frostnote','book_wardens_report','book_survivors_diary',
  'book_forgotten_flyer',
  'book_trail_note_1','book_trail_note_2','book_trail_note_3','book_trail_note_4','book_trail_note_5',
  'book_mysterious_note','empty_book',
];
// Relics
const relics        = ['tomes_blessing'];
// All enchanted books (all tiers, including both Mortus enchants)
const enchantedBooks = [
  'ench_memory_mark','ench_stone_ward',
  'ench_hollow_edge','ench_woven_ward',
  'ench_shard_frostbite','ench_veil_dust',
  'ench_grimoire_striking','ench_tome_iron_veil',
  'ench_relic_ashbound','ench_codex_living_flame',
  'ench_grimoire_mortus','ench_veil_mortus',
];

const maxedInventory = [
  ...maxedWeapons, ...maxedArmors, ...consumables,
  ...keyItems, ...books, ...relics, ...enchantedBooks,
];
// enchantedSlots is parallel to inventory — all null (enchants in bag, not applied)
const maxedEnchantedSlots = maxedInventory.map(() => null);

// Discovered flags for every map
const allDiscoveredFlags = {
  discovered_VH: true, discovered_WW: true, discovered_MS: true, discovered_SA: true,
  discovered_FR: true, discovered_AD: true, discovered_VN: true, discovered_CT: true,
  discovered_AR: true, discovered_CO: true, discovered_SR: true,
};

// All CITY_SIDE_QUESTS quest ids = quest_sq1 … quest_sq10 — kept at 0 (incomplete)
const citySqIds = ['sq1','sq2','sq3','sq4','sq5','sq6','sq7','sq8','sq9','sq10'];
const allQuestsIncomplete = Object.fromEntries([
  'quest_name','quest_hollow','quest_archive','quest_frost','quest_ash','quest_city',
  ...citySqIds.map(id => `quest_${id}`),
].map(id => [id, 0]));

// ── MAXED SavedGameState ──
// South Road accessible: quest_main === 7 passes the reqState gate in MAPS
// (no separate flag needed — engine checks quest stage directly on exit).
const maxedSave = {
  version: 1,
  mapId: 'CO', // Color village — peaceful end area, fitting for 100% main story
  mode: 'OVERWORLD',
  player: {
    x: 10 * TILE_SIZE, y: 9 * TILE_SIZE,
    hp: maxedMaxHp, maxHp: maxedMaxHp,
    echoes: 99999,
    inventory: maxedInventory,
    enchantedSlots: maxedEnchantedSlots,
    equipment: { weapon: 'voidglass_dagger', armor: 'voidsteel_mail' },
    quests: {
      quest_main: 7,
      ...allQuestsIncomplete,
    },
    questProgress: {
      shards: 3, specters: 0, archive_kills: 0, frost_kills: 0, ash_kills: 0, city_clears: 0,
      ...Object.fromEntries(citySqIds.map(id => [`sqkills_${id}`, 0])),
    },
    flags: {
      ...allDiscoveredFlags,
      ar_ring_boss_defeated: true, // Ashfall Ring cleared (shadow archive chain)
      tomes_blessing_used: false,  // can still craft if they want
      city_reward: false,
    },
    level: MAX_LEVEL,
    xp: 0,
    xpToNext: 50 + (MAX_LEVEL - 1) * 30, // xpForLevel(MAX_LEVEL)
    statPoints: 0, // all spent
    baseStats: maxedBaseStats,
  },
};

// ── FRESH SavedGameState ──
const freshSave = {
  version: 1,
  mapId: 'VH',
  mode: 'OVERWORLD',
  player: {
    x: 12 * TILE_SIZE, y: 8 * TILE_SIZE,
    hp: BASE_MAX_HP, maxHp: BASE_MAX_HP,
    echoes: 0,
    inventory: [],
    enchantedSlots: [],
    equipment: { weapon: null, armor: null },
    quests: {
      quest_main: 0, quest_name: 0, quest_hollow: 0,
      quest_archive: 0, quest_frost: 0, quest_ash: 0, quest_city: 0,
      ...Object.fromEntries(citySqIds.map(id => [`quest_${id}`, 0])),
    },
    questProgress: {
      shards: 0, specters: 0, archive_kills: 0, frost_kills: 0, ash_kills: 0, city_clears: 0,
      ...Object.fromEntries(citySqIds.map(id => [`sqkills_${id}`, 0])),
    },
    flags: { discovered_VH: true },
    level: 1,
    xp: 0,
    xpToNext: 50,
    statPoints: STARTING_STAT_POINTS,
    baseStats: { str: 0, vit: 0, def: 0 },
  },
};

// ── helpers: summary line matching App.tsx's summarizeSavedState ──
function summarize(saved) {
  const mapNames = { CO: 'Color', VH: 'Valehome' };
  const mapName = mapNames[saved.mapId] ?? saved.mapId;
  return `${mapName} — ${saved.player.echoes} Echoes — HP ${saved.player.hp}/${saved.player.maxHp}`;
}

// ── main ──
(async () => {
  console.log('Registering account glo …');
  let token;
  try {
    const reg = await api('POST', '/auth/register', { username: 'glo', password: 'Jax030209' });
    token = reg.token;
    console.log(`  Registered. Account id: ${reg.account.id}`);
  } catch (err) {
    if (String(err).includes('409') || String(err).includes('already') || String(err).includes('taken') || String(err).includes('conflict')) {
      console.log('  Account already exists — logging in instead …');
      const login = await api('POST', '/auth/login', { username: 'glo', password: 'Jax030209' });
      token = login.token;
      console.log(`  Logged in. Account id: ${login.account.id}`);
    } else {
      throw err;
    }
  }

  console.log('\nCreating Slot 1 (maxed) …');
  await api('PUT', '/saves/1', {
    name: 'Maxed Save',
    summary: summarize(maxedSave),
    state: maxedSave,
  }, token);
  console.log('  Slot 1 done.');

  console.log('Creating Slot 2 (maxed) …');
  await api('PUT', '/saves/2', {
    name: 'Maxed Save',
    summary: summarize(maxedSave),
    state: maxedSave,
  }, token);
  console.log('  Slot 2 done.');

  console.log('Creating Slot 3 (fresh) …');
  await api('PUT', '/saves/3', {
    name: 'Fresh Save',
    summary: summarize(freshSave),
    state: freshSave,
  }, token);
  console.log('  Slot 3 done.');

  console.log('\nAll done! Account glo has 3 slots ready.');
  console.log(`  Stat breakdown (level ${MAX_LEVEL}): STR ${maxedBaseStats.str} / VIT ${maxedBaseStats.vit} / DEF ${maxedBaseStats.def}`);
  console.log(`  MaxHP: ${maxedMaxHp}, Echoes: 99999, Equipment: voidglass_dagger + voidsteel_mail`);
})().catch(err => { console.error(err); process.exit(1); });
