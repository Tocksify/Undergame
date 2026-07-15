import { GameStateData } from './types';
import { CITY_SIDE_QUESTS } from './constants';

// kind drives the label prefix shown in the quest log:
//   ACT  = main story Act, SACT = story-important side quest, SQ = regular side quest.
// rewardPool/rewardItem drive the reward-tier text color (see getHighestTier in constants.ts) —
// rewardPool is used when the reward is probabilistic (weighted pick from several possible items),
// rewardItem is used when the reward is a single fixed item.
export interface QuestEntry {
  id: string;
  kind: 'ACT' | 'SACT' | 'SQ';
  isActive: (s: GameStateData) => boolean;
  isDone: (s: GameStateData) => boolean;
  label: (s: GameStateData) => string;
  rewardPool?: { itemId: string; chance: number }[];
  rewardItem?: string;
}

const MAIN_STAGE_LABELS: Record<number, string> = {
  1: 'The Lost Memories — find 3 Memory Shards in the Whispering Wastes',
  2: 'The Lost Memories — the Sanctum to the north has unsealed',
  3: 'Beyond the Sanctum — the way to the Sunken Archive is open',
  4: 'Into the Archive — journey north to the Frostbound Reach',
  5: 'Frostbound — journey north to the Ashen Descent',
  6: 'Ashen Descent — journey north into the Void Nexus',
  7: 'The Void Nexus — the Memory Wraith has been faced',
};

export const QUESTS: QuestEntry[] = [
  {
    id: 'quest_main',
    kind: 'ACT',
    isActive: (s) => (s.player.quests['quest_main'] || 0) > 0,
    isDone: (s) => (s.player.quests['quest_main'] || 0) >= 7,
    label: (s) => MAIN_STAGE_LABELS[s.player.quests['quest_main'] || 0] ?? '',
  },
  {
    id: 'quest_name',
    kind: 'SQ',
    isActive: (s) => (s.player.quests['quest_name'] || 0) > 0,
    isDone: (s) => (s.player.quests['quest_name'] || 0) === 2,
    label: () => 'A Name for the Nameless — remember a Void Crawler',
  },
  {
    id: 'quest_hollow',
    kind: 'SQ',
    isActive: (s) => (s.player.quests['quest_hollow'] || 0) > 0,
    isDone: (s) => (s.player.quests['quest_hollow'] || 0) === 2,
    label: (s) => `The Hollow Heart — defeat ${s.player.questProgress['specters'] || 0}/2 Specters`,
  },
  {
    id: 'quest_archive',
    kind: 'SQ',
    isActive: (s) => (s.player.quests['quest_archive'] || 0) > 0,
    isDone: (s) => (s.player.quests['quest_archive'] || 0) === 2,
    label: (s) => `The Waterlogged Ledger — defeat ${s.player.questProgress['archive_kills'] || 0}/3 Ink Wraiths`,
  },
  {
    id: 'quest_frost',
    kind: 'SQ',
    isActive: (s) => (s.player.quests['quest_frost'] || 0) > 0,
    isDone: (s) => (s.player.quests['quest_frost'] || 0) === 2,
    label: (s) => `Thaw the Watcher — defeat ${s.player.questProgress['frost_kills'] || 0}/2 Frost Walkers`,
  },
  {
    id: 'quest_ash',
    kind: 'SQ',
    isActive: (s) => (s.player.quests['quest_ash'] || 0) > 0,
    isDone: (s) => (s.player.quests['quest_ash'] || 0) === 2,
    label: (s) => `Embers of the Forgotten — defeat ${s.player.questProgress['ash_kills'] || 0}/2 Cinder Wraiths`,
  },
  {
    id: 'quest_city',
    kind: 'SQ',
    isActive: (s) => (s.player.quests['quest_city'] || 0) > 0,
    isDone: (s) => (s.player.quests['quest_city'] || 0) === 2,
    label: (s) => {
      const done = s.player.quests['quest_city'] === 2;
      if (done) return 'Reclaim Crestfall — city cleared. Collect your reward from the Warden.';
      return `Reclaim Crestfall — silence ${s.player.questProgress['city_clears'] || 0}/5 city shades`;
    },
  },
  // ── Side quests scattered through Crestfall's "misc" buildings ──
  // Data-driven from CITY_SIDE_QUESTS (see constants.ts) — the generic dialogue
  // handler in dialogue.ts advances `quests['quest_${sq.id}']` 0 → 1 → 2.
  ...CITY_SIDE_QUESTS.map((sq): QuestEntry => ({
    id: `quest_${sq.id}`,
    kind: 'SQ',
    isActive: (s) => (s.player.quests[`quest_${sq.id}`] || 0) > 0,
    isDone: (s) => (s.player.quests[`quest_${sq.id}`] || 0) === 2,
    label: (s) => {
      const stage = s.player.quests[`quest_${sq.id}`] || 0;
      if (stage >= 2) return `${sq.title} — complete. Reward collected from ${sq.npcName}.`;
      const kills = s.player.questProgress[`sqkills_${sq.id}`] || 0;
      return `${sq.title} — defeat ${kills}/${sq.requiredKills} for ${sq.npcName}`;
    },
    rewardPool: sq.rewardPool,
  })),
  // ── The Shadow Archive (secret-notes → hidden dungeon → Ashfall Ring → Tomes Blessing) ──
  // Story-important side quest with no numeric stage tracking — its label is
  // derived purely from flags/inventory, since the trail is discovered by
  // exploration rather than a quest-giver handing out stages.
  {
    id: 'quest_shadow_archive',
    kind: 'SACT',
    isActive: (s) => s.player.inventory.some((i) => i.startsWith('book_trail_note_') || i === 'book_mysterious_note' || i === 'empty_book' || i === 'tomes_blessing'),
    isDone: (s) => s.player.flags['tomes_blessing_used'] === true,
    label: (s) => {
      const inv = s.player.inventory;
      if (s.player.flags['tomes_blessing_used']) return 'The Shadow Archive — an enchantment was forged from nothing. The trail ends here.';
      if (inv.includes('tomes_blessing')) return 'The Shadow Archive — you carry a Tomes Blessing. Use it with an Empty Book to craft an enchantment.';
      if (inv.includes('empty_book') && s.player.flags['ar_ring_boss_defeated']) return 'The Shadow Archive — the Ringkeeper has fallen. Something in the ash still glimmers.';
      if (inv.includes('empty_book')) return 'The Shadow Archive — an unreadable book, and a note pointing toward a house marked in ash. Ashfall Ring waits at the bottom of a dark staircase.';
      if (inv.includes('book_mysterious_note')) return 'The Shadow Archive — a mysterious note. Somewhere in the city, a house hides a stairway down.';
      const trailCount = inv.filter((i) => i.startsWith('book_trail_note_')).length;
      return `The Shadow Archive — ${trailCount}/5 trail notes found. Something is hidden in Crestfall.`;
    },
    rewardItem: 'ench_grimoire_mortus',
  },
];
