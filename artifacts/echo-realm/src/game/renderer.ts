import { GameStateData, GameMode } from './types';
import { MAPS, ITEMS } from './constants';

export function renderGame(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = '#0f0518';
  ctx.fillRect(0, 0, 768, 576);

  if (state.mode === GameMode.TITLE) {
    ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 48px monospace'; ctx.textAlign = 'center';
    ctx.fillText('ECHO REALM', 384, 250);
    ctx.fillStyle = '#a78bfa'; ctx.font = '24px monospace';
    ctx.fillText('A Memory Keeper\'s Tale', 384, 300);
    
    // Shards bg
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for(let i=0; i<20; i++) {
       const x = (state.frameCount * 0.5 + i * 100) % 768;
       const y = (576 - (state.frameCount * (1 + i%3) + i * 50) % 576);
       ctx.fillRect(x, y, 4, 4);
    }
    
    if (Math.floor(state.frameCount / 30) % 2 === 0) {
      ctx.fillStyle = '#ffffff'; ctx.fillText('Press [SPACE] to start', 384, 450);
    }
    return;
  }

  if (state.mode === GameMode.GAME_OVER) {
    ctx.fillStyle = 'red'; ctx.font = 'bold 48px monospace'; ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 384, 250);
    ctx.fillStyle = 'white'; ctx.font = '20px monospace';
    ctx.fillText('The memories fade to black...', 384, 300);
    ctx.fillText('Press [SPACE] to try again', 384, 400);
    return;
  }

  if (state.mode === GameMode.VICTORY) {
    ctx.fillStyle = '#fcd34d'; ctx.font = 'bold 48px monospace'; ctx.textAlign = 'center';
    ctx.fillText('THE REALM REMEMBERS', 384, 250);
    ctx.fillStyle = 'white'; ctx.font = '20px monospace';
    ctx.fillText('You have restored the light.', 384, 320);
    ctx.fillText('Thank you for playing.', 384, 360);
    return;
  }

  if (state.mode === GameMode.BATTLE && state.battle) {
    renderBattle(ctx, state);
    return;
  }

  // OVERWORLD
  const map = MAPS[state.mapId];
  const camX = Math.floor(state.player.x - 384 + 24);
  const camY = Math.floor(state.player.y - 288 + 24);
  const clampX = Math.max(0, Math.min(camX, map.width * 48 - 768));
  const clampY = Math.max(0, Math.min(camY, map.height * 48 - 576));

  ctx.save();
  ctx.translate(-clampX, -clampY);

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const tile = map.layout[y][x];
      const tx = x * 48; const ty = y * 48;
      
      if (tile === 'G') ctx.fillStyle = '#166534';
      else if (tile === 'S') ctx.fillStyle = '#374151';
      else if (tile === 'P') ctx.fillStyle = '#b45309';
      else if (tile === 'W') ctx.fillStyle = '#111827';
      else if (tile === 'T') { ctx.fillStyle = '#166534'; ctx.fillRect(tx, ty, 48, 48); ctx.fillStyle = '#064e3b'; }
      else if (tile === 'V') ctx.fillStyle = '#4c1d95';
      else if (tile === 'M') ctx.fillStyle = '#0f766e';
      else if (tile === 'H') ctx.fillStyle = '#78350f';
      else if (tile.startsWith('E_') || tile === 'B_D') ctx.fillStyle = '#000000';
      
      ctx.fillRect(tx, ty, 48, 48);
      if (tile === 'T') { ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.fillRect(tx+12, ty+12, 24, 24); }
    }
  }

  for (const c of map.chests) {
    if (!state.player.flags[c.flag]) {
      ctx.fillStyle = '#92400e'; ctx.fillRect(c.x * 48 + 8, c.y * 48 + 8, 32, 32);
      ctx.fillStyle = '#fcd34d'; ctx.fillRect(c.x * 48 + 16, c.y * 48 + 20, 16, 8);
    } else {
      ctx.fillStyle = '#78350f'; ctx.fillRect(c.x * 48 + 8, c.y * 48 + 8, 32, 32);
      ctx.fillStyle = 'black'; ctx.fillRect(c.x * 48 + 12, c.y * 48 + 12, 24, 24);
    }
  }

  for (const npc of map.npcs) {
    ctx.fillStyle = npc.color;
    const nx = npc.x * 48 + 16; const ny = npc.y * 48 + 16;
    ctx.fillRect(nx, ny, 16, 16);
    ctx.fillStyle = 'white';
    ctx.fillRect(nx + 2, ny + 4, 4, 4); ctx.fillRect(nx + 10, ny + 4, 4, 4);
  }

  ctx.fillStyle = '#c084fc';
  const px = state.player.x + 16; const py = state.player.y + 16;
  ctx.fillRect(px, py, 16, 16);
  ctx.fillStyle = 'white';
  ctx.fillRect(px + 2, py + 4, 4, 4); ctx.fillRect(px + 10, py + 4, 4, 4);

  if (state.adjacentInteractable && state.mode === GameMode.OVERWORLD) {
    const bob = Math.sin(state.frameCount * 0.1) * 4;
    const int = state.adjacentInteractable;
    const tx = int.x; const ty = int.y;
    const promptText = int.type === 'NPC' && int.npc.type === 'SHOP' ? '[SPACE] - Shop' : 
                       int.type === 'NPC' ? '[SPACE] - Talk' : 
                       int.type === 'CHEST' ? '[SPACE] - Open' : '[ENTER] - Travel';
                       
    ctx.fillStyle = 'white'; ctx.fillRect(tx * 48 - 18, ty * 48 - 24 + bob, 84, 20);
    ctx.strokeStyle = 'black'; ctx.strokeRect(tx * 48 - 18, ty * 48 - 24 + bob, 84, 20);
    ctx.fillStyle = 'black'; ctx.font = '12px monospace'; ctx.textAlign = 'center';
    ctx.fillText(promptText, tx * 48 + 24, ty * 48 - 10 + bob);
  }

  ctx.restore();

  // HUD
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, 768, 40);
  ctx.fillStyle = '#ef4444'; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'left';
  ctx.fillText(`♥ ${state.player.hp}/${state.player.maxHp}`, 16, 26);
  ctx.fillStyle = '#fbbf24'; ctx.fillText(`${state.player.echoes}ε`, 150, 26);
  ctx.fillStyle = 'white'; ctx.textAlign = 'right'; ctx.fillText(map.name, 752, 26);
  ctx.textAlign = 'left'; ctx.font = '12px monospace'; ctx.fillStyle = '#aaa';
  ctx.fillText('[WASD] Move  [SPACE] Interact  [I] Inv  [Q] Quests  [ESC] Menu', 16, 560);

  if (state.uiMessage) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(184, 80, 400, 40);
    ctx.strokeStyle = 'white'; ctx.strokeRect(184, 80, 400, 40);
    ctx.fillStyle = 'white'; ctx.textAlign = 'center'; ctx.font = '16px monospace';
    ctx.fillText(state.uiMessage, 384, 105);
  }

  if (state.mode === GameMode.DIALOGUE) renderDialogue(ctx, state);
  if (state.mode === GameMode.MENU) renderMenu(ctx, state);
  if (state.mode === GameMode.SHOP) renderShop(ctx, state);
  if (state.mode === GameMode.INVENTORY) renderInventory(ctx, state);
  if (state.mode === GameMode.QUEST_LOG) renderQuests(ctx, state);
}

function renderDialogue(ctx: CanvasRenderingContext2D, state: GameStateData) {
  const D_BOX_Y = 410;
  ctx.fillStyle = '#1a0a2e'; ctx.fillRect(16, D_BOX_Y, 736, 150);
  ctx.strokeStyle = 'white'; ctx.lineWidth = 4; ctx.strokeRect(16, D_BOX_Y, 736, 150);

  const node = state.dialogue.currentNode!;
  if (node.color) { ctx.fillStyle = node.color; ctx.fillRect(32, D_BOX_Y + 16, 64, 64); }
  
  ctx.fillStyle = 'white'; ctx.font = 'bold 18px monospace'; ctx.textAlign = 'left';
  ctx.fillText(node.speaker, 112, D_BOX_Y + 32);
  
  ctx.font = '16px monospace';
  const text = node.text.substring(0, state.dialogue.charIndex);
  const words = text.split(' ');
  let line = ''; let ly = D_BOX_Y + 64;
  for (let w of words) {
    if (ctx.measureText(line + w + ' ').width > 600) { ctx.fillText(line, 112, ly); line = w + ' '; ly += 24; }
    else { line += w + ' '; }
  }
  ctx.fillText(line, 112, ly);
  
  if (state.dialogue.charIndex === node.text.length && node.options) {
    ly += 24;
    for (let i = 0; i < node.options.length; i++) {
      ctx.fillStyle = state.dialogue.selectedOption === i ? '#fcd34d' : 'white';
      ctx.fillText(`${state.dialogue.selectedOption === i ? '►' : '  '} ${node.options[i].label}`, 112, ly + i * 24);
    }
  }
}

function renderBattle(ctx: CanvasRenderingContext2D, state: GameStateData) {
  const b = state.battle!;
  ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, 768, 576);

  ctx.fillStyle = b.enemy.color; ctx.fillRect(352, 100, 64, 64);
  ctx.fillStyle = 'white'; ctx.textAlign = 'center'; ctx.font = 'bold 24px monospace';
  ctx.fillText(b.enemy.name, 384, 50);

  const hpPct = b.enemy.hp / b.enemy.maxHp;
  ctx.fillStyle = 'red'; ctx.fillRect(284, 60, 200, 10);
  ctx.fillStyle = '#22c55e'; ctx.fillRect(284, 60, 200 * hpPct, 10);

  ctx.fillStyle = '#fbbf24'; ctx.font = '16px monospace';
  ctx.fillText('RESONANCE: ' + '★'.repeat(b.resonance) + '☆'.repeat(3 - b.resonance), 384, 90);

  ctx.strokeStyle = 'white'; ctx.lineWidth = 4; ctx.strokeRect(234, 320, 300, 200);

  if (b.phase === 'MENU') {
    const opts = ['REMEMBER', 'FORGET', 'ACT', 'ITEMS', 'FLEE'];
    ctx.textAlign = 'left';
    opts.forEach((opt, i) => {
      ctx.fillStyle = b.menuIndex === i ? '#fcd34d' : 'white';
      ctx.fillText((b.menuIndex === i ? '♥ ' : '  ') + opt, 60 + i * 130, 550);
    });
    ctx.textAlign = 'center'; ctx.fillStyle = 'white';
    ctx.fillText(b.actionMsg || b.enemy.flavor, 384, 280);
  } else if (b.phase === 'ACT_MENU') {
    ctx.textAlign = 'left';
    b.enemy.acts.forEach((act, i) => {
      ctx.fillStyle = b.menuIndex === i ? '#fcd34d' : 'white';
      ctx.fillText((b.menuIndex === i ? '♥ ' : '  ') + act.name, 234 + i * 150, 550);
    });
  } else if (b.phase === 'MINIGAME') {
    ctx.fillStyle = 'white'; ctx.fillRect(284, 400, 200, 20);
    ctx.fillStyle = b.minigame!.type === 'REMEMBER' ? '#34d399' : '#f87171';
    ctx.fillRect(364, 400, 40, 20); // Center zone
    const cx = 284 + b.minigame!.cursorX * 200;
    ctx.fillStyle = 'yellow'; ctx.fillRect(cx - 2, 390, 4, 40);
    ctx.textAlign = 'center'; ctx.fillStyle = 'white';
    ctx.fillText("Press [SPACE] in the zone!", 384, 380);
  } else if (b.phase === 'DODGE') {
    for (const p of b.projectiles) {
      ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.w/2, 0, Math.PI*2); ctx.fill();
    }
    ctx.fillStyle = state.player.invincibility > 0 && Math.floor(state.frameCount / 5) % 2 === 0 ? 'white' : 'red';
    ctx.save(); ctx.translate(b.soulX, b.soulY); ctx.rotate(Math.PI / 4); ctx.fillRect(-6, -6, 12, 12); ctx.restore();
  } else if (b.phase === 'ACTION' || b.phase === 'END') {
    ctx.textAlign = 'center'; ctx.fillStyle = 'white';
    ctx.fillText(b.actionMsg || "...", 384, 420);
    if (b.phase === 'END') ctx.fillText("Press [SPACE]", 384, 460);
  }

  ctx.fillStyle = 'white'; ctx.font = '20px monospace'; ctx.textAlign = 'left';
  ctx.fillText(`♥ ${state.player.hp} / ${state.player.maxHp}`, 16, 550);
}

function renderMenu(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(0, 0, 768, 576);
  ctx.fillStyle = '#1a0a2e'; ctx.fillRect(284, 150, 200, 200);
  ctx.strokeStyle = 'white'; ctx.lineWidth = 4; ctx.strokeRect(284, 150, 200, 200);
  
  const opts = ['Resume', 'Inventory', 'Quest Log', 'Title Screen'];
  ctx.font = '20px monospace'; ctx.textAlign = 'left';
  opts.forEach((opt, i) => {
    ctx.fillStyle = state.menuIndex === i ? '#fcd34d' : 'white';
    ctx.fillText((state.menuIndex === i ? '♥ ' : '  ') + opt, 310, 200 + i * 40);
  });
}

function renderShop(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = '#1a0a2e'; ctx.fillRect(0, 0, 768, 576);
  ctx.strokeStyle = '#fcd34d'; ctx.lineWidth = 6; ctx.strokeRect(10, 10, 748, 556);
  
  ctx.fillStyle = '#fcd34d'; ctx.font = 'bold 32px monospace'; ctx.textAlign = 'center';
  ctx.fillText("Zara's Memory Emporium", 384, 60);
  
  ctx.font = '20px monospace'; ctx.textAlign = 'right';
  ctx.fillText(`Echoes: ${state.player.echoes}ε`, 730, 60);
  
  const shopItems = ['crystal', 'ward', 'spark', 'stone', 'dust'];
  ctx.textAlign = 'left';
  shopItems.forEach((id, i) => {
    const item = ITEMS[id];
    ctx.fillStyle = state.shopIndex === i ? '#fcd34d' : 'white';
    ctx.fillText((state.shopIndex === i ? '► ' : '  ') + item.name, 100, 150 + i * 50);
    ctx.fillStyle = '#aaa';
    ctx.fillText(item.price + 'ε', 400, 150 + i * 50);
    if (state.shopIndex === i) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(item.desc, 120, 150 + i * 50 + 20);
    }
  });
}

function renderInventory(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.9)'; ctx.fillRect(0, 0, 768, 576);
  ctx.fillStyle = '#1a0a2e'; ctx.fillRect(184, 100, 400, 350);
  ctx.strokeStyle = 'white'; ctx.lineWidth = 4; ctx.strokeRect(184, 100, 400, 350);
  
  ctx.fillStyle = 'white'; ctx.font = 'bold 24px monospace'; ctx.textAlign = 'center';
  ctx.fillText("INVENTORY", 384, 140);
  
  ctx.font = '18px monospace'; ctx.textAlign = 'left';
  if (state.player.inventory.length === 0) {
    ctx.fillStyle = '#aaa'; ctx.fillText("Empty", 220, 200);
  } else {
    state.player.inventory.forEach((id, i) => {
      ctx.fillStyle = state.inventoryIndex === i ? '#fcd34d' : 'white';
      ctx.fillText((state.inventoryIndex === i ? '♥ ' : '  ') + ITEMS[id].name, 220, 190 + i * 30);
    });
    const curId = state.player.inventory[state.inventoryIndex];
    ctx.fillStyle = '#38bdf8'; ctx.textAlign = 'center';
    ctx.fillText(ITEMS[curId].desc, 384, 420);
  }
}

function renderQuests(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.9)'; ctx.fillRect(0, 0, 768, 576);
  ctx.fillStyle = '#1a0a2e'; ctx.fillRect(134, 100, 500, 350);
  ctx.strokeStyle = 'white'; ctx.lineWidth = 4; ctx.strokeRect(134, 100, 500, 350);
  
  ctx.fillStyle = '#fcd34d'; ctx.font = 'bold 24px monospace'; ctx.textAlign = 'center';
  ctx.fillText("QUEST LOG", 384, 140);
  
  ctx.font = '16px monospace'; ctx.textAlign = 'left';
  let y = 180;
  
  const qMain = state.player.quests['quest_main'];
  if (qMain > 0) {
    ctx.fillStyle = qMain === 2 ? '#10b981' : 'white';
    ctx.fillText(`- The Lost Memories ${qMain===2 ? '(Done)' : `(${state.player.questProgress['shards']||0}/3 Shards)`}`, 160, y); y += 30;
  }
  const qName = state.player.quests['quest_name'];
  if (qName > 0) {
    ctx.fillStyle = qName === 2 ? '#10b981' : 'white';
    ctx.fillText(`- Name for the Nameless ${qName===2 ? '(Done)' : '(Remember a Crawler)'}`, 160, y); y += 30;
  }
  const qHollow = state.player.quests['quest_hollow'];
  if (qHollow > 0) {
    ctx.fillStyle = qHollow === 2 ? '#10b981' : 'white';
    ctx.fillText(`- The Hollow Heart ${qHollow===2 ? '(Done)' : `(${state.player.questProgress['specters']||0}/2 Specters)`}`, 160, y); y += 30;
  }
  
  if (qMain === 0 && qName === 0 && qHollow === 0) {
    ctx.fillStyle = '#aaa'; ctx.fillText("No active quests.", 160, y);
  }
}