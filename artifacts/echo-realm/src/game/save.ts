import { GameStateData } from './types';
import { INITIAL_STATE, MAPS } from './constants';

// The shape persisted to the save-slot JSON blob. Deliberately excludes
// transient fields (dialogue, battle, camera, keys, uiMessage, etc.) —
// only what's needed to resume the game.
export interface SavedGameState {
  version: 1;
  mapId: string;
  player: {
    x: number;
    y: number;
    hp: number;
    maxHp: number;
    echoes: number;
    inventory: string[];
    equipment: { weapon: string | null; armor: string | null };
    quests: Record<string, number>;
    questProgress: Record<string, number>;
    flags: Record<string, boolean>;
  };
}

export function serializeGameState(state: GameStateData): SavedGameState {
  return {
    version: 1,
    mapId: state.mapId,
    player: {
      x: state.player.x,
      y: state.player.y,
      hp: state.player.hp,
      maxHp: state.player.maxHp,
      echoes: state.player.echoes,
      inventory: [...state.player.inventory],
      equipment: { ...state.player.equipment },
      quests: { ...state.player.quests },
      questProgress: { ...state.player.questProgress },
      flags: { ...state.player.flags },
    },
  };
}

// Human-readable one-line blurb shown in the slot picker.
export function summarizeSavedState(saved: SavedGameState): string {
  const mapName = MAPS[saved.mapId]?.name ?? saved.mapId;
  return `${mapName} — ${saved.player.echoes} Echoes — HP ${saved.player.hp}/${saved.player.maxHp}`;
}

export function buildInitialState(saved: SavedGameState | null | undefined, isGuest: boolean): GameStateData {
  const state: GameStateData = JSON.parse(JSON.stringify(INITIAL_STATE));
  state.meta.isGuest = isGuest;
  if (saved) {
    state.mapId = saved.mapId;
    state.player.x = saved.player.x; state.player.targetX = saved.player.x;
    state.player.y = saved.player.y; state.player.targetY = saved.player.y;
    state.player.hp = saved.player.hp;
    state.player.maxHp = saved.player.maxHp;
    state.player.echoes = saved.player.echoes;
    state.player.inventory = [...saved.player.inventory];
    state.player.equipment = { ...saved.player.equipment };
    state.player.quests = { ...state.player.quests, ...saved.player.quests };
    state.player.questProgress = { ...state.player.questProgress, ...saved.player.questProgress };
    state.player.flags = { ...saved.player.flags };
  }
  return state;
}
