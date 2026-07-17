// ── Achievement Store ──────────────────────────────────────────────────
// Persists earned achievement IDs globally in localStorage under 'er-achievements'.
// Achievements are slot-independent — they survive across all characters and
// slot deletions. A new character can see what the player has accomplished.

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  // ── First steps ──
  { id: 'ach_first_blood',       name: 'First Encounter',   desc: 'Defeat or remember your first enemy.',          icon: '⚔' },
  { id: 'ach_first_remember',    name: 'Remembered',         desc: 'Successfully Remember an enemy.',               icon: '✦' },
  // ── Exploration ──
  { id: 'ach_enter_forest',      name: 'Into the Thornwood', desc: 'Reach Thornwood Forest.',                       icon: '🌲' },
  { id: 'ach_city_gates',        name: 'City Gates',         desc: 'Arrive at Crestfall City.',                     icon: '🏙' },
  { id: 'ach_all_regions',       name: 'Full Cartographer',  desc: 'Discover every major region.',                  icon: '🗺' },
  // ── Combat ──
  { id: 'ach_boss_archivist',    name: 'Archivist Felled',   desc: 'Defeat The Archivist.',                         icon: '📜' },
  { id: 'ach_boss_final',        name: 'Memory Unbound',     desc: 'Defeat the Memory Wraith.',                     icon: '🌑' },
  { id: 'ach_true_ending',       name: 'The Long Peace',     desc: 'Achieve the true ending.',                      icon: '✨' },
  // ── Progression ──
  { id: 'ach_level_5',           name: 'Seasoned Keeper',    desc: 'Reach level 5.',                                icon: '📈' },
  { id: 'ach_level_10',          name: 'Veteran Keeper',     desc: 'Reach level 10.',                               icon: '🔺' },
  { id: 'ach_level_15',          name: 'Keeper of the Void', desc: 'Reach level 15.',                               icon: '🔱' },
  // ── Equipment & Crafting ──
  { id: 'ach_craft_item',        name: 'Artisan',            desc: 'Craft your first item at a crafting table.',    icon: '⚒' },
  { id: 'ach_enchant_item',      name: 'The Marked Blade',   desc: 'Apply an enchantment to any item.',             icon: '🔮' },
  { id: 'ach_full_equip',        name: 'Fully Armed',        desc: 'Have all major equipment slots filled.',        icon: '🛡' },
  // ── Collector ──
  { id: 'ach_all_books',         name: 'Lore Keeper',        desc: 'Collect at least 8 lore books.',                icon: '📚' },
  { id: 'ach_bestiary_full',     name: 'Chronicler',         desc: 'Encounter every enemy type 3+ times.',          icon: '👁' },
  // ── Wealth ──
  { id: 'ach_rich',              name: 'Echo Hoarder',       desc: 'Accumulate 500 Echoes at once.',                icon: '💰' },
];

const STORE_KEY = 'er-achievements';

export function getEarnedAchievementIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

/** Awards an achievement. Returns true if it was newly earned, false if already had it. */
export function awardAchievement(id: string): boolean {
  const earned = getEarnedAchievementIds();
  if (earned.includes(id)) return false;
  earned.push(id);
  try { localStorage.setItem(STORE_KEY, JSON.stringify(earned)); } catch { /* noop */ }
  return true;
}

export function hasAchievement(id: string): boolean {
  return getEarnedAchievementIds().includes(id);
}
