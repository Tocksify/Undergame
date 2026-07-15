import { EnemyData, GameStateData } from './types';
import { INITIAL_STATE, MAPS } from './constants';

// The shape persisted to the save-slot JSON blob. Deliberately excludes
// purely visual/transient fields (dialogue, camera, keys, projectiles,
// minigame cursor, etc.) — only what's needed to resume the game. If the
// player saved mid-battle, we keep just enough of the battle (the enemy's
// current HP/state and resonance progress) to drop them back into the same
// fight at the MENU phase rather than replaying an in-progress dodge or
// minigame animation.
export interface SavedGameState {
  version: 1;
  mapId: string;
  mode: 'OVERWORLD' | 'BATTLE';
  player: {
    x: number;
    y: number;
    hp: number;
    maxHp: number;
    echoes: number;
    inventory: string[];
    enchantedSlots: (string | null)[];
    equipment: { weapon: string | null; armor: string | null };
    quests: Record<string, number>;
    questProgress: Record<string, number>;
    flags: Record<string, boolean>;
  };
  battle?: {
    enemy: EnemyData;
    resonance: number;
    flags: Record<string, boolean>;
  };
}

export function serializeGameState(state: GameStateData): SavedGameState {
  return {
    version: 1,
    mapId: state.mapId,
    mode: state.battle ? 'BATTLE' : 'OVERWORLD',
    player: {
      x: state.player.x,
      y: state.player.y,
      hp: state.player.hp,
      maxHp: state.player.maxHp,
      echoes: state.player.echoes,
      inventory: [...state.player.inventory],
      enchantedSlots: [...state.player.enchantedSlots],
      equipment: { ...state.player.equipment },
      quests: { ...state.player.quests },
      questProgress: { ...state.player.questProgress },
      flags: { ...state.player.flags },
    },
    battle: state.battle ? {
      enemy: JSON.parse(JSON.stringify(state.battle.enemy)),
      resonance: state.battle.resonance,
      flags: { ...state.battle.flags },
    } : undefined,
  };
}

// Human-readable one-line blurb shown in the slot picker.
export function summarizeSavedState(saved: SavedGameState): string {
  const mapName = MAPS[saved.mapId]?.name ?? saved.mapId;
  const battleNote = saved.mode === 'BATTLE' && saved.battle ? ` — mid-battle vs ${saved.battle.enemy.name}` : '';
  return `${mapName} — ${saved.player.echoes} Echoes — HP ${saved.player.hp}/${saved.player.maxHp}${battleNote}`;
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
    // Restore enchanted slots; guard against old saves that lack this field
    if (saved.player.enchantedSlots) {
      state.player.enchantedSlots = [...saved.player.enchantedSlots];
    } else {
      state.player.enchantedSlots = saved.player.inventory.map(() => null);
    }
    state.player.equipment = { ...saved.player.equipment };
    state.player.quests = { ...state.player.quests, ...saved.player.quests };
    state.player.questProgress = { ...state.player.questProgress, ...saved.player.questProgress };
    state.player.flags = { ...saved.player.flags };
    // Title screen stays in GameMode.TITLE either way (see constants.ts) —
    // engine.ts reads state.battle to decide whether pressing Space/Enter
    // drops the player back into this battle instead of the overworld.
    if (saved.mode === 'BATTLE' && saved.battle) {
      state.battle = {
        enemy: JSON.parse(JSON.stringify(saved.battle.enemy)),
        phase: 'MENU', menuIndex: 0,
        soulX: 384, soulY: 420,
        projectiles: [], timer: 0,
        resonance: saved.battle.resonance,
        actionMsg: null, minigame: null,
        voidWard: false,
        flags: { ...saved.battle.flags },
      };
    }
  }
  return state;
}
