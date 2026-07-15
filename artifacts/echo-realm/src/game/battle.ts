import { GameStateData, GameMode, EnemyData, BattleState } from './types';
import { justPressed, addInventoryItem } from './engine';
import { ITEMS, getWeaponAtkBonus, getArmorDefBonus, CITY_SIDE_QUESTS, pushMessages } from './constants';

// Checks whether resonance has reached the threshold to "remember" the enemy.
function tryCompleteRemember(state: GameStateData): boolean {
  const b = state.battle!;
  if (b.resonance < 3) return false;
  if (b.enemy.id === 'boss' && !state.player.flags['used_ancient_echo']) {
    b.actionMsg = "It rejects the resonance. You need a deeper memory.";
    b.resonance = 0;
    return false;
  }
  b.actionMsg = b.enemy.rememberText;
  b.phase = 'END'; b.endType = 'REMEMBERED';
  return true;
}

export function handleBattleInput(state: GameStateData) {
  const b = state.battle!;
  if (b.phase === 'MENU') {
    if (justPressed(state, 'ArrowLeft') || justPressed(state, 'a')) b.menuIndex = Math.max(0, b.menuIndex - 1);
    if (justPressed(state, 'ArrowRight') || justPressed(state, 'd')) b.menuIndex = Math.min(4, b.menuIndex + 1);
    if (justPressed(state, ' ') || justPressed(state, 'z')) {
      if (b.menuIndex === 0) {
        b.phase = 'MINIGAME'; b.minigame = { cursorX: 0, type: 'REMEMBER', mult: b.flags.spark ? 2 : 1 }; b.flags.spark = false;
      } else if (b.menuIndex === 1) {
        b.phase = 'MINIGAME'; b.minigame = { cursorX: 0, type: 'FORGET', mult: b.flags.spark ? 2 : 1 }; b.flags.spark = false;
      } else if (b.menuIndex === 2) {
        b.phase = 'ACT_MENU'; b.menuIndex = 0;
      } else if (b.menuIndex === 3) {
        state.mode = GameMode.INVENTORY;
      } else if (b.menuIndex === 4) {
        b.actionMsg = "You fled the battle."; b.phase = 'END'; b.endType = 'FLED';
      }
    }
  } else if (b.phase === 'ACT_MENU') {
    if (justPressed(state, 'ArrowLeft') || justPressed(state, 'a')) b.menuIndex = Math.max(0, b.menuIndex - 1);
    if (justPressed(state, 'ArrowRight') || justPressed(state, 'd')) b.menuIndex = Math.min(b.enemy.acts.length - 1, b.menuIndex + 1);
    if (justPressed(state, 'x') || justPressed(state, 'Escape')) { b.phase = 'MENU'; b.menuIndex = 2; }
    if (justPressed(state, ' ') || justPressed(state, 'z')) {
      handleAct(state, b.enemy.acts[b.menuIndex].id);
    }
  } else if (b.phase === 'MINIGAME') {
    b.timer++;
    b.minigame!.cursorX = (Math.sin(b.timer * 0.1) + 1) / 2;

    if (justPressed(state, ' ') || justPressed(state, 'z')) {
      const dist = Math.abs(b.minigame!.cursorX - 0.5);
      let hitType = 'MISS';
      if (dist < 0.08) hitType = 'PERFECT';
      else if (dist < 0.2) hitType = 'GOOD';

      const mult = b.minigame!.mult;
      if (b.minigame!.type === 'REMEMBER') {
        if (hitType === 'PERFECT') { b.resonance += 1; b.actionMsg = "Perfect Resonance!"; }
        else if (hitType === 'GOOD') { b.actionMsg = "Good connection."; }
        else { b.actionMsg = "The memory slips away..."; }
        if (tryCompleteRemember(state)) return;
      } else {
        let dmg = ((hitType === 'PERFECT' ? 10 : hitType === 'GOOD' ? 5 : 2) * mult) + getWeaponAtkBonus(state);
        b.enemy.hp -= dmg;
        b.actionMsg = `Dealt ${dmg} damage.`;
        if (b.enemy.hp <= 0) { b.phase = 'END'; b.endType = 'DEFEATED'; return; }
      }
      b.phase = 'ACTION'; b.timer = 0;
    }
  } else if (b.phase === 'DODGE') {
    let sx = 0; let sy = 0;
    if (state.keys['ArrowUp'] || state.keys['w']) sy = -1;
    if (state.keys['ArrowDown'] || state.keys['s']) sy = 1;
    if (state.keys['ArrowLeft'] || state.keys['a']) sx = -1;
    if (state.keys['ArrowRight'] || state.keys['d']) sx = 1;
    b.soulX += sx * 4; b.soulY += sy * 4;
    b.soulX = Math.max(240, Math.min(528, b.soulX));
    b.soulY = Math.max(326, Math.min(514, b.soulY));
  } else if (b.phase === 'END') {
    if (justPressed(state, ' ') || justPressed(state, 'z')) {
      endBattle(state);
    }
  }
}

export function updateBattlePhase(state: GameStateData) {
  const b = state.battle!;
  if (b.phase === 'ACTION') {
    b.timer++;
    if (b.timer > 60) {
      if (b.flags.confused) {
        b.actionMsg = "The enemy is confused and skips its turn!";
        b.flags.confused = false;
        b.timer = -60;
      } else {
        b.phase = 'DODGE'; b.timer = 300; b.projectiles = [];
      }
    }
    if (b.timer === 0 && b.phase === 'ACTION') {
      b.phase = 'MENU'; b.menuIndex = 0; b.actionMsg = null;
    }
  } else if (b.phase === 'DODGE') {
    b.timer--;
    spawnProjectiles(b);
    for (const p of b.projectiles) {
      p.x += p.vx; p.y += p.vy;
      if (p.wave) p.y = p.waveStartY! + Math.sin(p.x * 0.05) * 50;
      const dx = p.x - b.soulX; const dy = p.y - b.soulY;
      if (dx * dx + dy * dy < 100) {
        if (state.player.invincibility <= 0) {
          const dmg = Math.max(1, Math.floor(b.enemy.atk * (b.voidWard ? 0.5 : 1)) - getArmorDefBonus(state));
          state.player.hp -= dmg;
          state.player.invincibility = 30;
          b.voidWard = false;
        }
      }
    }
    if (state.player.hp <= 0) { state.mode = GameMode.GAME_OVER; }
    if (b.timer <= 0) { b.phase = 'MENU'; b.menuIndex = 0; b.actionMsg = null; }
  }
}

function handleAct(state: GameStateData, actId: string) {
  const b = state.battle!;
  const act = b.enemy.acts.find(a => a.id === actId);
  if (!act) return;

  if (act.id === 'name') {
    if (state.player.inventory.includes('stone')) { b.resonance = 3; tryCompleteRemember(state); }
    else { b.actionMsg = "You don't have a Naming Stone."; }
    if (b.phase !== 'END') { b.phase = 'ACTION'; b.timer = 0; }
    return;
  }
  if (act.id === 'present_echo') {
    if (state.player.inventory.includes('echo')) { state.player.flags['used_ancient_echo'] = true; b.actionMsg = "The Ancient Echo resonates! Its guard drops."; }
    else { b.actionMsg = "You have nothing of meaning to present."; }
    b.phase = 'ACTION'; b.timer = 0;
    return;
  }

  if (act.requiresItem && !state.player.inventory.includes(act.requiresItem)) {
    b.actionMsg = `You don't have the ${ITEMS[act.requiresItem]?.name ?? act.requiresItem}.`;
    b.phase = 'ACTION'; b.timer = 0;
    return;
  }

  switch (act.effect) {
    case 'weaken':
      b.enemy.atk = Math.max(1, b.enemy.atk - (act.power ?? 1));
      b.actionMsg = "Its attacks weaken slightly.";
      break;
    case 'confuse':
      b.flags.confused = true;
      b.actionMsg = "It pauses, confused.";
      break;
    case 'damage': {
      const dmg = (act.power ?? 5) + getWeaponAtkBonus(state);
      b.enemy.hp -= dmg;
      b.actionMsg = `Dealt ${dmg} dmg.`;
      if (b.enemy.hp <= 0) { b.phase = 'END'; b.endType = 'DEFEATED'; return; }
      break;
    }
    case 'resonance':
      b.resonance += (act.power ?? 1);
      b.actionMsg = `It feels slightly understood. Resonance +${act.power ?? 1}`;
      if (tryCompleteRemember(state)) return;
      break;
    case 'flavor':
    default:
      b.actionMsg = b.enemy.flavor;
      break;
  }
  if (b.phase !== 'END') { b.phase = 'ACTION'; b.timer = 0; }
}

function spawnProjectiles(b: BattleState) {
  const t = 300 - b.timer;
  const boxX = 384; const boxY = 420;

  if (b.enemy.id === 'wisp' && t % 25 === 0) {
    b.projectiles.push({ x: 234, y: boxY - 80 + Math.random() * 160, vx: 3, vy: 0, w: 10, h: 10, color: '#a855f7' });
  } else if (b.enemy.id === 'crawler' && t % 15 === 0) {
    const angle = t * 0.1;
    b.projectiles.push({ x: boxX, y: boxY, vx: Math.cos(angle) * 4, vy: Math.sin(angle) * 4, w: 16, h: 16, color: '#1f2937' });
  } else if (b.enemy.id === 'specter' && t % 40 === 0) {
    b.projectiles.push({ x: 234, y: boxY, vx: 4, vy: 0, w: 12, h: 12, color: '#38bdf8', wave: true, waveStartY: boxY });
  } else if (b.enemy.id === 'boss') {
    if (t % 12 === 0) {
      const angle = Math.random() * Math.PI * 2;
      b.projectiles.push({ x: boxX + Math.cos(angle) * 150, y: boxY + Math.sin(angle) * 150, vx: -Math.cos(angle) * 3, vy: -Math.sin(angle) * 3, w: 14, h: 14, color: '#ef4444' });
    }
    if (t % 60 === 0) b.projectiles.push({ x: 234, y: b.soulY, vx: 6, vy: 0, w: 20, h: 20, color: '#8b5cf6' });
  } else if ((b.enemy.id === 'city_shade' || b.enemy.id === 'street_wraith') && t % 22 === 0) {
    b.projectiles.push({ x: 234, y: boxY - 70 + Math.random() * 140, vx: 3.5, vy: 0, w: 11, h: 11, color: b.enemy.color });
  } else if (b.enemy.id === 'hollow_guard' && t % 18 === 0) {
    b.projectiles.push({ x: boxX, y: 310 + Math.random() * 195, vx: 0, vy: 3.5, w: 14, h: 8, color: '#9ca3af' });
  } else if (t % 20 === 0) {
    b.projectiles.push({ x: 234, y: boxY - 60 + Math.random() * 120, vx: 3.5, vy: 0, w: 12, h: 12, color: b.enemy.color });
  }
}

function endBattle(state: GameStateData) {
  state.mode = GameMode.OVERWORLD;
  const b = state.battle!;
  if (b.endType === 'DEFEATED' || b.endType === 'REMEMBERED') {
    const e = b.endType === 'REMEMBERED' ? Math.floor(b.enemy.echoes * 1.5) : b.enemy.echoes;
    state.player.echoes += e;
    state.player.flags['defeated_' + b.enemy.id] = true;

    if (state.player.quests['quest_main'] === 1 && Math.random() < 0.35) {
      state.player.questProgress['shards'] = (state.player.questProgress['shards'] || 0) + 1;
      state.uiMessage = "Found a Memory Shard!"; state.uiMessageTimer = 120;
    }
    if (b.enemy.id === 'specter' && state.player.quests['quest_hollow'] === 1) {
      state.player.questProgress['specters'] = (state.player.questProgress['specters'] || 0) + 1;
      if (state.player.questProgress['specters'] >= 2) state.player.quests['quest_hollow'] = 2;
    }
    if (b.enemy.id === 'crawler' && b.endType === 'REMEMBERED' && state.player.quests['quest_name'] === 1) {
      state.player.quests['quest_name'] = 2; state.player.echoes += 50;
      state.uiMessage = "Quest Complete: Name for the Nameless!"; state.uiMessageTimer = 120;
    }
    if (b.enemy.id === 'ink_wraith' && state.player.quests['quest_archive'] === 1) {
      state.player.questProgress['archive_kills'] = (state.player.questProgress['archive_kills'] || 0) + 1;
    }
    if (b.enemy.id === 'frost_walker' && state.player.quests['quest_frost'] === 1) {
      state.player.questProgress['frost_kills'] = (state.player.questProgress['frost_kills'] || 0) + 1;
    }
    if (b.enemy.id === 'cinder_wraith' && state.player.quests['quest_ash'] === 1) {
      state.player.questProgress['ash_kills'] = (state.player.questProgress['ash_kills'] || 0) + 1;
    }
    if (b.enemy.id === 'archivist' && (state.player.quests['quest_main'] || 0) < 3) {
      state.player.quests['quest_main'] = 3;
      state.uiMessage = "The way north has opened."; state.uiMessageTimer = 160;
    }
    if (b.enemy.id === 'boss' && b.endType === 'REMEMBERED') {
      state.player.quests['quest_main'] = 7;
      state.mode = GameMode.VICTORY;
    }
    // City clear quest
    if (['city_shade', 'street_wraith', 'hollow_guard'].includes(b.enemy.id) && state.player.quests['quest_city'] === 1) {
      state.player.questProgress['city_clears'] = (state.player.questProgress['city_clears'] || 0) + 1;
      if ((state.player.questProgress['city_clears'] || 0) >= 5) {
        state.player.quests['quest_city'] = 2;
        state.uiMessage = "The city grows quieter. Report to the Warden."; state.uiMessageTimer = 180;
      }
    }

    // Generic side-quest kill tracking — 10 quest-givers scattered through
    // Crestfall's misc buildings, all sharing this one loop (see CITY_SIDE_QUESTS).
    for (const sq of CITY_SIDE_QUESTS) {
      const qId = `quest_${sq.id}`;
      if (state.player.quests[qId] === 1 && sq.enemyPool.includes(b.enemy.id)) {
        const kKey = `sqkills_${sq.id}`;
        state.player.questProgress[kKey] = (state.player.questProgress[kKey] || 0) + 1;
        // Turn-in/reward happens back in dialogue.ts once the player reports to the NPC.
      }
    }

    // Echo Warden (secret dungeon mini-boss) — grants the empty book + mysterious note
    // that kick off the Ashfall Ring storyline. Guarded so it can't be farmed twice.
    if (b.enemy.id === 'echo_warden' && !state.player.inventory.includes('empty_book')) {
      addInventoryItem(state, 'empty_book');
      addInventoryItem(state, 'book_mysterious_note');
      pushMessages(state, ['The Echo Warden falls silent.', '+Empty Book', '+A Mysterious Note'], ITEMS['empty_book']?.tier);
    }

    // The Ringkeeper (Ashfall Ring boss) — grants the Tomes Blessing.
    if (b.enemy.id === 'ring_boss' && !state.player.inventory.includes('tomes_blessing')) {
      state.player.flags['ar_ring_boss_defeated'] = true;
      addInventoryItem(state, 'tomes_blessing');
      pushMessages(state, ['The Ringkeeper is remembered no more.', '+Tomes Blessing'], ITEMS['tomes_blessing']?.tier);
    }
  }
  state.battle = null;
}
