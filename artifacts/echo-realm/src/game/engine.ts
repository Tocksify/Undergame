import { GameStateData, GameMode, EnemyData } from './types';
import { MAPS, ENEMIES, ITEMS, SHOPS, TILE_SIZE, recomputeMaxHp } from './constants';
import { getDialogueStartNode, getDialogueNode } from './dialogue';
import { updateBattlePhase, handleBattleInput } from './battle';

export function justPressed(state: GameStateData, key: string) {
  const k = key; const K = key.toUpperCase();
  return (state.keys[k] || state.keys[K]) && !(state.prevKeys[k] || state.prevKeys[K]);
}

function isExitTile(t: string) { return t === '>' || t === '<' || t === '!'; }

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
        state.player.hp = state.player.maxHp;
        state.player.x = 8 * TILE_SIZE; state.player.y = 10 * TILE_SIZE;
        state.player.targetX = state.player.x; state.player.targetY = state.player.y;
        state.mapId = 'VH';
      }
      state.mode = GameMode.OVERWORLD;
    }
    return;
  }

  if (state.mode === GameMode.VICTORY) return;

  if (state.mode === GameMode.BATTLE) {
    handleBattleInput(state);
    // handleBattleInput can end the battle mid-frame (e.g. fleeing or
    // finishing the END phase), which nulls out state.battle and may switch
    // state.mode away from BATTLE. Guard against running the phase update
    // against a battle that no longer exists.
    if (state.mode === GameMode.BATTLE && state.battle) {
      updateBattlePhase(state);
    }
    return;
  }

  if (state.mode === GameMode.MENU) {
    if (justPressed(state, 'ArrowUp'))   state.menuIndex = Math.max(0, state.menuIndex - 1);
    if (justPressed(state, 'ArrowDown')) state.menuIndex = Math.min(4, state.menuIndex + 1);
    if (justPressed(state, 'Escape') || justPressed(state, 'x')) state.mode = GameMode.OVERWORLD;
    if (justPressed(state, ' ') || justPressed(state, 'z')) {
      if (state.menuIndex === 0) state.mode = GameMode.OVERWORLD;
      if (state.menuIndex === 1) { state.mode = GameMode.INVENTORY; state.inventoryIndex = 0; }
      if (state.menuIndex === 2) state.mode = GameMode.QUEST_LOG;
      if (state.menuIndex === 3) {
        if (state.meta.isGuest) { state.uiMessage = "Log in from the title screen to save your progress."; state.uiMessageTimer = 150; }
        else { state.saveRequested = true; }
      }
      if (state.menuIndex === 4) state.exitRequested = true;
    }
    return;
  }

  if (state.mode === GameMode.INVENTORY) {
    if (justPressed(state, 'ArrowUp'))   state.inventoryIndex = Math.max(0, state.inventoryIndex - 1);
    if (justPressed(state, 'ArrowDown')) state.inventoryIndex = Math.min(Math.max(0, state.player.inventory.length - 1), state.inventoryIndex + 1);
    if (justPressed(state, 'Escape') || justPressed(state, 'x') || justPressed(state, 'i')) {
      state.mode = state.battle ? GameMode.BATTLE : GameMode.OVERWORLD;
    }
    if ((justPressed(state, ' ') || justPressed(state, 'z')) && state.player.inventory.length > 0) {
      const id = state.player.inventory[state.inventoryIndex];
      const item = ITEMS[id];
      let consumed = false;
      let handled = false;

      if (item.category === 'weapon') {
        state.player.equipment.weapon = state.player.equipment.weapon === id ? null : id;
        state.uiMessage = state.player.equipment.weapon === id ? `Equipped ${item.name}` : `Unequipped ${item.name}`;
        state.uiMessageTimer = 90; handled = true;
      } else if (item.category === 'armor') {
        state.player.equipment.armor = state.player.equipment.armor === id ? null : id;
        recomputeMaxHp(state);
        state.uiMessage = state.player.equipment.armor === id ? `Equipped ${item.name}` : `Unequipped ${item.name}`;
        state.uiMessageTimer = 90; handled = true;
      } else if (item.category === 'key') {
        state.uiMessage = "A keepsake. Best not discarded."; state.uiMessageTimer = 90; handled = true;
      } else if (id === 'crystal') { state.player.hp = Math.min(state.player.maxHp, state.player.hp + 10); consumed = true; }
      else if (id === 'tonic') { state.player.hp = Math.min(state.player.maxHp, state.player.hp + 5); consumed = true; }
      else if (id === 'greater_crystal') { state.player.hp = Math.min(state.player.maxHp, state.player.hp + 25); consumed = true; }
      else if (id === 'phoenix_ash') {
        state.player.hp = state.player.maxHp;
        if (state.battle) state.battle.flags.confused = false;
        consumed = true;
      } else if (state.battle) {
        if (id === 'ward')  { state.battle.voidWard = true; consumed = true; }
        if (id === 'spark') { state.battle.flags.spark = true; consumed = true; }
        if (id === 'dust')  { state.battle.flags.confused = true; consumed = true; }
      }

      if (consumed) { state.player.inventory.splice(state.inventoryIndex, 1); handled = true; }
      state.inventoryIndex = Math.max(0, Math.min(state.inventoryIndex, state.player.inventory.length - 1));
      if (state.battle && (consumed || handled)) { state.mode = GameMode.BATTLE; state.battle.phase = 'ACTION'; state.battle.actionMsg = "Used item!"; state.battle.timer = 0; }
      else if (!state.battle && consumed) { state.uiMessage = "Used item."; state.uiMessageTimer = 60; }
      else if (!handled) { state.uiMessage = "Can't use that here."; state.uiMessageTimer = 60; }
    }
    return;
  }

  if (state.mode === GameMode.QUEST_LOG) {
    if (justPressed(state, 'Escape') || justPressed(state, 'q') || justPressed(state, 'x')) state.mode = GameMode.OVERWORLD;
    return;
  }

  if (state.mode === GameMode.SHOP) {
    const shop = SHOPS[state.shopNpcId || 'zara'] ?? SHOPS['zara'];
    const shopItems = shop.items;
    if (justPressed(state, 'ArrowUp'))   state.shopIndex = Math.max(0, state.shopIndex - 1);
    if (justPressed(state, 'ArrowDown')) state.shopIndex = Math.min(shopItems.length - 1, state.shopIndex + 1);
    if (justPressed(state, 'Escape') || justPressed(state, 'x')) state.mode = GameMode.OVERWORLD;
    if (justPressed(state, ' ') || justPressed(state, 'z')) {
      const item = ITEMS[shopItems[state.shopIndex]];
      if (state.player.inventory.length >= 8) { state.uiMessage = "Inventory full!"; state.uiMessageTimer = 60; }
      else if (state.player.echoes >= item.price) {
        state.player.echoes -= item.price;
        state.player.inventory.push(shopItems[state.shopIndex]);
        state.uiMessage = "Bought: " + item.name; state.uiMessageTimer = 60;
      } else { state.uiMessage = "Not enough Echoes!"; state.uiMessageTimer = 60; }
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
            state.dialogue.currentNode = getDialogueNode(state, opt.nextId);
            state.dialogue.charIndex = 0; state.dialogue.selectedOption = 0;
          } else {
            state.mode = GameMode.OVERWORLD;
            if (state.pendingEncounter) { startBattle(state, state.pendingEncounter); state.pendingEncounter = null; }
          }
        }
      } else {
        if (justPressed(state, ' ') || justPressed(state, 'z')) {
          if (node.action) node.action(state);
          if (node.nextId) {
            state.dialogue.currentNode = getDialogueNode(state, node.nextId);
            state.dialogue.charIndex = 0;
          } else {
            state.mode = GameMode.OVERWORLD;
            if (state.pendingEncounter) { startBattle(state, state.pendingEncounter); state.pendingEncounter = null; }
          }
        }
      }
    }
    return;
  }

  // ── OVERWORLD ─────────────────────────────────────────────────────
  if (justPressed(state, 'Escape')) { state.mode = GameMode.MENU; state.menuIndex = 0; return; }
  if (justPressed(state, 'i'))      { state.mode = GameMode.INVENTORY; state.inventoryIndex = 0; return; }
  if (justPressed(state, 'q'))      { state.mode = GameMode.QUEST_LOG; return; }

  const map = MAPS[state.mapId];

  // smooth movement
  if (state.player.x !== state.player.targetX || state.player.y !== state.player.targetY) {
    const spd = 6;
    if (state.player.x < state.player.targetX) state.player.x = Math.min(state.player.targetX, state.player.x + spd);
    else if (state.player.x > state.player.targetX) state.player.x = Math.max(state.player.targetX, state.player.x - spd);
    if (state.player.y < state.player.targetY) state.player.y = Math.min(state.player.targetY, state.player.y + spd);
    else if (state.player.y > state.player.targetY) state.player.y = Math.max(state.player.targetY, state.player.y - spd);
    return; // don't process input while moving
  }

  // arrived at target — pending encounter?
  if (state.pendingEncounter) {
    startBattle(state, state.pendingEncounter);
    state.pendingEncounter = null;
    return;
  }

  const tx = Math.floor(state.player.x / TILE_SIZE);
  const ty = Math.floor(state.player.y / TILE_SIZE);

  // detect adjacent interactables (NPCs with a satisfied hideFlag are gone for good)
  const visibleNpcs = map.npcs.filter((n: any) => !n.hideFlag || !state.player.flags[n.hideFlag]);
  let intFound: any = null;
  for (const npc of visibleNpcs) {
    if (Math.abs(npc.x - tx) + Math.abs(npc.y - ty) === 1) { intFound = { type: 'NPC', npc, x: npc.x, y: npc.y }; break; }
  }
  if (!intFound) {
    for (const chest of map.chests) {
      if (!state.player.flags[chest.flag] && Math.abs(chest.x - tx) + Math.abs(chest.y - ty) === 1) {
        intFound = { type: 'CHEST', chest, x: chest.x, y: chest.y }; break;
      }
    }
  }
  // standing on exit tile?
  const curTile = map.layout[ty]?.[tx] ?? '';
  if (isExitTile(curTile)) {
    intFound = { type: 'EXIT', tile: curTile, x: tx, y: ty };
  }
  state.adjacentInteractable = intFound;

  // handle SPACE interactions
  if (intFound && (justPressed(state, ' ') || justPressed(state, 'z'))) {
    if (intFound.type === 'EXIT') {
      const exit = map.exits[intFound.tile];
      if (exit) {
        if (exit.locked || (exit.reqQuest && state.player.quests[exit.reqQuest] < exit.reqState)) {
          state.uiMessage = exit.lockMsg; state.uiMessageTimer = 120;
        } else {
          state.mapId = exit.mapId;
          state.player.x = exit.x * TILE_SIZE; state.player.y = exit.y * TILE_SIZE;
          state.player.targetX = state.player.x; state.player.targetY = state.player.y;
          state.adjacentInteractable = null;
        }
      }
    } else if (intFound.type === 'NPC') {
      if (intFound.npc.type === 'SHOP') {
        state.mode = GameMode.SHOP; state.shopIndex = 0; state.shopNpcId = intFound.npc.id;
      } else {
        state.dialogue.currentNode = getDialogueStartNode(state, intFound.npc.id);
        state.dialogue.charIndex = 0; state.dialogue.selectedOption = 0;
        state.mode = GameMode.DIALOGUE;
      }
    } else if (intFound.type === 'CHEST') {
      state.player.flags[intFound.chest.flag] = true;
      if (intFound.chest.item.startsWith('echoes_')) {
        const amt = parseInt(intFound.chest.item.split('_')[1]);
        state.player.echoes += amt;
        state.uiMessage = `Found ${amt} Echoes!`; state.uiMessageTimer = 120;
      } else {
        if (state.player.inventory.length < 8) state.player.inventory.push(intFound.chest.item);
        state.uiMessage = `Found: ${ITEMS[intFound.chest.item]?.name ?? intFound.chest.item}!`; state.uiMessageTimer = 120;
      }
    }
  }

  // movement input (only when not interacting this frame)
  if (!(intFound && (justPressed(state, ' ') || justPressed(state, 'z')))) {
    let dx = 0; let dy = 0;
    if (state.keys['ArrowUp']    || state.keys['w']) dy = -1;
    else if (state.keys['ArrowDown']  || state.keys['s']) dy = 1;
    else if (state.keys['ArrowLeft']  || state.keys['a']) dx = -1;
    else if (state.keys['ArrowRight'] || state.keys['d']) dx = 1;

    if (dx !== 0 || dy !== 0) {
      const ntx = tx + dx; const nty = ty + dy;
      if (ntx >= 0 && ntx < map.width && nty >= 0 && nty < map.height) {
        const tile = map.layout[nty][ntx];
        const npcBlocking = visibleNpcs.find((n: any) => n.x === ntx && n.y === nty);
        const impassable = tile === 'W' || tile === 'T' || tile === 'H' || npcBlocking;
        if (!impassable) {
          state.player.targetX = ntx * TILE_SIZE;
          state.player.targetY = nty * TILE_SIZE;
          // random encounter on void tiles
          if (tile === 'V' && Math.random() < 0.15) {
            const pool = (map.encounterPool && map.encounterPool.length) ? map.encounterPool : ['wisp'];
            state.pendingEncounter = JSON.parse(JSON.stringify(ENEMIES[pool[Math.floor(Math.random() * pool.length)]]));
          }
        }
      }
    }
  }
}

function startBattle(state: GameStateData, enemy: EnemyData) {
  state.mode = GameMode.BATTLE;
  state.battle = {
    enemy: JSON.parse(JSON.stringify(enemy)),
    phase: 'MENU', menuIndex: 0,
    soulX: 384, soulY: 420,
    projectiles: [], timer: 0, resonance: 0,
    actionMsg: null, minigame: null,
    voidWard: false, flags: {}
  };
}
