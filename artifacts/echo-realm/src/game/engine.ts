import { GameStateData, GameMode, EnemyData } from './types';
import { MAPS, ENEMIES, ITEMS } from './constants';
import { getDialogueStartNode, getDialogueNode } from './dialogue';
import { updateBattle, handleBattleInput, updateBattlePhase } from './battle';

export function justPressed(state: GameStateData, key: string) {
  const isDown = state.keys[key] || state.keys[key.toUpperCase()];
  const wasDown = state.prevKeys[key] || state.prevKeys[key.toUpperCase()];
  return isDown && !wasDown;
}

export function updateGame(state: GameStateData) {
  state.frameCount++;
  if (state.player.invincibility > 0) state.player.invincibility--;
  if (state.uiMessageTimer > 0) {
     state.uiMessageTimer--;
     if (state.uiMessageTimer <= 0) state.uiMessage = null;
  }

  if (state.mode === GameMode.TITLE || state.mode === GameMode.GAME_OVER) {
    if (justPressed(state, ' ') || justPressed(state, 'Enter')) {
      if (state.mode === GameMode.GAME_OVER) {
         // simple respawn
         state.player.hp = state.player.maxHp;
         state.player.x = 8 * 48; state.player.y = 12 * 48; state.player.targetX = state.player.x; state.player.targetY = state.player.y;
         state.mapId = 'VH';
      }
      state.mode = GameMode.OVERWORLD;
    }
    return;
  }

  if (state.mode === GameMode.VICTORY) return;

  if (state.mode === GameMode.BATTLE) {
    handleBattleInput(state);
    updateBattlePhase(state);
    return;
  }

  if (state.mode === GameMode.MENU) {
    if (justPressed(state, 'ArrowUp')) state.menuIndex = Math.max(0, state.menuIndex - 1);
    if (justPressed(state, 'ArrowDown')) state.menuIndex = Math.min(3, state.menuIndex + 1);
    if (justPressed(state, 'Escape') || justPressed(state, 'x')) state.mode = GameMode.OVERWORLD;
    if (justPressed(state, ' ') || justPressed(state, 'z')) {
      if (state.menuIndex === 0) state.mode = GameMode.OVERWORLD;
      if (state.menuIndex === 1) state.mode = GameMode.INVENTORY;
      if (state.menuIndex === 2) state.mode = GameMode.QUEST_LOG;
      if (state.menuIndex === 3) window.location.reload(); // back to title
    }
    return;
  }

  if (state.mode === GameMode.INVENTORY) {
    if (justPressed(state, 'ArrowUp')) state.inventoryIndex = Math.max(0, state.inventoryIndex - 1);
    if (justPressed(state, 'ArrowDown')) state.inventoryIndex = Math.min(Math.max(0, state.player.inventory.length - 1), state.inventoryIndex + 1);
    if (justPressed(state, 'Escape') || justPressed(state, 'x') || justPressed(state, 'i')) {
      state.mode = state.battle ? GameMode.BATTLE : GameMode.OVERWORLD;
    }
    if ((justPressed(state, ' ') || justPressed(state, 'z')) && state.player.inventory.length > 0) {
      const id = state.player.inventory[state.inventoryIndex];
      if (id === 'crystal') state.player.hp = Math.min(state.player.maxHp, state.player.hp + 10);
      else if (id === 'tonic') state.player.hp = Math.min(state.player.maxHp, state.player.hp + 5);
      else if (state.battle) {
        if (id === 'ward') state.battle.voidWard = true;
        if (id === 'spark') state.battle.flags.spark = true;
        if (id === 'dust') state.battle.flags.confused = true;
      }
      state.player.inventory.splice(state.inventoryIndex, 1);
      if (state.inventoryIndex >= state.player.inventory.length) state.inventoryIndex = Math.max(0, state.player.inventory.length - 1);
      
      if (state.battle) {
        state.mode = GameMode.BATTLE; state.battle.phase = 'ACTION'; state.battle.actionMsg = `Used item!`; state.battle.timer = 0;
      } else {
        state.uiMessage = "Used item."; state.uiMessageTimer = 60;
      }
    }
    return;
  }

  if (state.mode === GameMode.QUEST_LOG) {
    if (justPressed(state, 'Escape') || justPressed(state, 'q') || justPressed(state, 'x')) state.mode = GameMode.OVERWORLD;
    return;
  }

  if (state.mode === GameMode.SHOP) {
    const shopItems = ['crystal', 'ward', 'spark', 'stone', 'dust'];
    if (justPressed(state, 'ArrowUp')) state.shopIndex = Math.max(0, state.shopIndex - 1);
    if (justPressed(state, 'ArrowDown')) state.shopIndex = Math.min(shopItems.length - 1, state.shopIndex + 1);
    if (justPressed(state, 'Escape') || justPressed(state, 'x')) state.mode = GameMode.OVERWORLD;
    if (justPressed(state, ' ') || justPressed(state, 'z')) {
      const item = ITEMS[shopItems[state.shopIndex]];
      if (state.player.echoes >= item.price && state.player.inventory.length < 8) {
        state.player.echoes -= item.price;
        state.player.inventory.push(shopItems[state.shopIndex]);
        state.uiMessage = "Purchased " + item.name; state.uiMessageTimer = 60;
      } else if (state.player.inventory.length >= 8) {
        state.uiMessage = "Inventory full!"; state.uiMessageTimer = 60;
      } else {
        state.uiMessage = "Not enough Echoes!"; state.uiMessageTimer = 60;
      }
    }
    return;
  }

  if (state.mode === GameMode.DIALOGUE) {
    const node = state.dialogue.currentNode!;
    if (state.dialogue.charIndex < node.text.length) {
      state.dialogue.timer++;
      if (state.dialogue.timer > 1) { state.dialogue.charIndex++; state.dialogue.timer = 0; }
      if (justPressed(state, ' ') || justPressed(state, 'z')) state.dialogue.charIndex = node.text.length;
    } else {
      if (node.options && node.options.length > 0) {
        if (justPressed(state, 'ArrowUp') && state.dialogue.selectedOption > 0) state.dialogue.selectedOption--;
        if (justPressed(state, 'ArrowDown') && state.dialogue.selectedOption < node.options.length - 1) state.dialogue.selectedOption++;
        if (justPressed(state, ' ') || justPressed(state, 'z')) {
          const opt = node.options[state.dialogue.selectedOption];
          if (opt.action) opt.action(state);
          if (opt.nextId) {
            state.dialogue.currentNode = getDialogueNode(state, opt.nextId); state.dialogue.charIndex = 0; state.dialogue.selectedOption = 0;
          } else {
            state.mode = GameMode.OVERWORLD;
            if (state.pendingEncounter) startBattle(state, state.pendingEncounter);
          }
        }
      } else {
        if (justPressed(state, ' ') || justPressed(state, 'z')) {
          if (node.action) node.action(state);
          if (node.nextId) {
            state.dialogue.currentNode = getDialogueNode(state, node.nextId); state.dialogue.charIndex = 0;
          } else {
            state.mode = GameMode.OVERWORLD;
            if (state.pendingEncounter) startBattle(state, state.pendingEncounter);
          }
        }
      }
    }
    return;
  }

  // OVERWORLD
  if (justPressed(state, 'Escape')) { state.mode = GameMode.MENU; state.menuIndex = 0; return; }
  if (justPressed(state, 'i')) { state.mode = GameMode.INVENTORY; state.inventoryIndex = 0; return; }
  if (justPressed(state, 'q')) { state.mode = GameMode.QUEST_LOG; return; }

  const map = MAPS[state.mapId];
  if (state.player.x === state.player.targetX && state.player.y === state.player.targetY) {
    if (state.pendingEncounter) {
      startBattle(state, state.pendingEncounter);
      state.pendingEncounter = null;
      return;
    }

    let dx = 0; let dy = 0;
    if (state.keys['ArrowUp'] || state.keys['w']) dy = -1;
    else if (state.keys['ArrowDown'] || state.keys['s']) dy = 1;
    else if (state.keys['ArrowLeft'] || state.keys['a']) dx = -1;
    else if (state.keys['ArrowRight'] || state.keys['d']) dx = 1;

    if (dx !== 0 || dy !== 0) {
      const nextTx = Math.floor(state.player.x / 48) + dx;
      const nextTy = Math.floor(state.player.y / 48) + dy;
      if (nextTx >= 0 && nextTx < map.width && nextTy >= 0 && nextTy < map.height) {
        const tile = map.layout[nextTy][nextTx];
        const npcThere = map.npcs.find((n:any) => n.x === nextTx && n.y === nextTy);
        if (tile !== 'W' && tile !== 'T' && tile !== 'H' && !npcThere) {
           state.player.targetX = nextTx * 48; state.player.targetY = nextTy * 48;
           if (tile === 'V' && Math.random() < 0.15) {
              const enemies = ['wisp', 'crawler', 'specter'];
              state.pendingEncounter = ENEMIES[enemies[Math.floor(Math.random()*enemies.length)]];
           }
        }
      }
    }

    // interactables check
    const tx = Math.floor(state.player.x / 48); const ty = Math.floor(state.player.y / 48);
    let intFound = null;
    for(const npc of map.npcs) {
      if (Math.abs(npc.x - tx) + Math.abs(npc.y - ty) === 1) { intFound = { type: 'NPC', npc, x: npc.x, y: npc.y }; break; }
    }
    if (!intFound) {
      for(const chest of map.chests) {
        if (!state.player.flags[chest.flag] && Math.abs(chest.x - tx) + Math.abs(chest.y - ty) === 1) {
          intFound = { type: 'CHEST', chest, x: chest.x, y: chest.y }; break;
        }
      }
    }
    const curTile = map.layout[ty][tx];
    if (curTile.startsWith('E_') || curTile === 'B_D') {
      intFound = { type: 'EXIT', tile: curTile, x: tx, y: ty };
    }
    state.adjacentInteractable = intFound;

    if (state.adjacentInteractable) {
      const int = state.adjacentInteractable;
      if (int.type === 'EXIT' && justPressed(state, 'Enter')) {
        const exit = map.exits[int.tile];
        if (exit) {
          if (exit.locked || (exit.reqQuest && state.player.quests[exit.reqQuest] < exit.reqState)) {
             state.uiMessage = exit.lockMsg; state.uiMessageTimer = 120;
          } else {
             state.mapId = exit.mapId;
             state.player.x = exit.x * 48; state.player.y = exit.y * 48;
             state.player.targetX = state.player.x; state.player.targetY = state.player.y;
             state.adjacentInteractable = null;
          }
        }
      } else if ((justPressed(state, ' ') || justPressed(state, 'z')) && int.type !== 'EXIT') {
        if (int.type === 'NPC') {
          if (int.npc.type === 'BOSS') {
            state.dialogue.currentNode = getDialogueStartNode(state, int.npc.id);
            state.dialogue.charIndex = 0; state.dialogue.selectedOption = 0; state.mode = GameMode.DIALOGUE;
          } else if (int.npc.type === 'SHOP') {
            state.mode = GameMode.SHOP; state.shopIndex = 0;
          } else {
            state.dialogue.currentNode = getDialogueStartNode(state, int.npc.id);
            state.dialogue.charIndex = 0; state.dialogue.selectedOption = 0; state.mode = GameMode.DIALOGUE;
          }
        } else if (int.type === 'CHEST') {
          state.player.flags[int.chest.flag] = true;
          if (int.chest.item.startsWith('echoes_')) {
            const amt = parseInt(int.chest.item.split('_')[1]);
            state.player.echoes += amt;
            state.uiMessage = `Found ${amt} Echoes!`; state.uiMessageTimer = 120;
          } else {
            if (state.player.inventory.length < 8) state.player.inventory.push(int.chest.item);
            state.uiMessage = `Found ${ITEMS[int.chest.item].name}!`; state.uiMessageTimer = 120;
          }
        }
      }
    }
  } else {
    const speed = 4;
    if (state.player.x < state.player.targetX) state.player.x = Math.min(state.player.targetX, state.player.x + speed);
    if (state.player.x > state.player.targetX) state.player.x = Math.max(state.player.targetX, state.player.x - speed);
    if (state.player.y < state.player.targetY) state.player.y = Math.min(state.player.targetY, state.player.y + speed);
    if (state.player.y > state.player.targetY) state.player.y = Math.max(state.player.targetY, state.player.y - speed);
  }
}

function startBattle(state: GameStateData, enemy: EnemyData) {
  state.mode = GameMode.BATTLE;
  state.battle = {
    enemy: JSON.parse(JSON.stringify(enemy)),
    phase: 'MENU',
    menuIndex: 0,
    soulX: 384,
    soulY: 420,
    projectiles: [],
    timer: 0,
    resonance: 0,
    actionMsg: null,
    minigame: null,
    voidWard: false,
    flags: {}
  };
}