import { GameStateData } from './types';

export interface QuestEntry {
  id: string;
  isActive: (s: GameStateData) => boolean;
  isDone: (s: GameStateData) => boolean;
  label: (s: GameStateData) => string;
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
    isActive: (s) => (s.player.quests['quest_main'] || 0) > 0,
    isDone: (s) => (s.player.quests['quest_main'] || 0) >= 7,
    label: (s) => MAIN_STAGE_LABELS[s.player.quests['quest_main'] || 0] ?? '',
  },
  {
    id: 'quest_name',
    isActive: (s) => (s.player.quests['quest_name'] || 0) > 0,
    isDone: (s) => (s.player.quests['quest_name'] || 0) === 2,
    label: () => 'A Name for the Nameless — remember a Void Crawler',
  },
  {
    id: 'quest_hollow',
    isActive: (s) => (s.player.quests['quest_hollow'] || 0) > 0,
    isDone: (s) => (s.player.quests['quest_hollow'] || 0) === 2,
    label: (s) => `The Hollow Heart — defeat ${s.player.questProgress['specters'] || 0}/2 Specters`,
  },
  {
    id: 'quest_archive',
    isActive: (s) => (s.player.quests['quest_archive'] || 0) > 0,
    isDone: (s) => (s.player.quests['quest_archive'] || 0) === 2,
    label: (s) => `The Waterlogged Ledger — defeat ${s.player.questProgress['archive_kills'] || 0}/3 Ink Wraiths`,
  },
  {
    id: 'quest_frost',
    isActive: (s) => (s.player.quests['quest_frost'] || 0) > 0,
    isDone: (s) => (s.player.quests['quest_frost'] || 0) === 2,
    label: (s) => `Thaw the Watcher — defeat ${s.player.questProgress['frost_kills'] || 0}/2 Frost Walkers`,
  },
  {
    id: 'quest_ash',
    isActive: (s) => (s.player.quests['quest_ash'] || 0) > 0,
    isDone: (s) => (s.player.quests['quest_ash'] || 0) === 2,
    label: (s) => `Embers of the Forgotten — defeat ${s.player.questProgress['ash_kills'] || 0}/2 Cinder Wraiths`,
  },
  {
    id: 'quest_city',
    isActive: (s) => (s.player.quests['quest_city'] || 0) > 0,
    isDone: (s) => (s.player.quests['quest_city'] || 0) === 2,
    label: (s) => {
      const done = s.player.quests['quest_city'] === 2;
      if (done) return 'Reclaim Crestfall — city cleared. Collect your reward from the Warden.';
      return `Reclaim Crestfall — silence ${s.player.questProgress['city_clears'] || 0}/5 city shades`;
    },
  },
];
