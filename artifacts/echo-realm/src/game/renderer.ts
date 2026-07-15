import { GameStateData, GameMode } from './types';
import { MAPS, ITEMS, SHOPS, TILE_SIZE } from './constants';
import { QUESTS } from './quests';

// ── NOIR 8-BIT PALETTE ──────────────────────────────────────────────
const C = {
  black:    '#080808',
  darkest:  '#111111',
  dark:     '#1e1e1e',
  mid:      '#3a3a3a',
  gray:     '#606060',
  silver:   '#909090',
  light:    '#c0c0c0',
  white:    '#f0f0f0',
  bright:   '#ffffff',
  accent:   '#e8e8e8',
  dim:      '#505050',
};

const W = 768; const H = 576;

// Draw a pixel-art style character (16×16 body, simple pixel face)
function drawSprite(ctx: CanvasRenderingContext2D, wx: number, wy: number, col: string, eyeCol = C.black, hat = false) {
  const px = wx + 16; const py = wy + 8;
  // body
  ctx.fillStyle = col;
  ctx.fillRect(px, py + 4, 16, 16);
  // head
  ctx.fillStyle = col;
  ctx.fillRect(px + 2, py - 4, 12, 12);
  // eyes (2×2 each)
  ctx.fillStyle = eyeCol;
  ctx.fillRect(px + 4, py - 1, 3, 3);
  ctx.fillRect(px + 9, py - 1, 3, 3);
  // pixel border
  ctx.strokeStyle = C.darkest;
  ctx.lineWidth = 1;
  ctx.strokeRect(px, py + 4, 16, 16);
  ctx.strokeRect(px + 2, py - 4, 12, 12);
  if (hat) {
    ctx.fillStyle = C.dim;
    ctx.fillRect(px, py - 8, 16, 4);
    ctx.fillRect(px + 3, py - 12, 10, 4);
  }
}

// Pixel-grid tile draw
function drawTile(ctx: CanvasRenderingContext2D, tx: number, ty: number, tile: string, frame: number) {
  const x = tx * TILE_SIZE; const y = ty * TILE_SIZE;
  let base = C.dark; let detail = C.darkest; let bright = false;

  if (tile === 'P')      { base = '#2e2e2e'; detail = '#222222'; }
  else if (tile === 'G') { base = '#1e1e1e'; detail = '#161616'; }
  else if (tile === 'T') { base = '#141414'; detail = '#0e0e0e'; }
  else if (tile === 'W') { base = '#303030'; detail = '#242424'; }
  else if (tile === 'H') { base = '#2a2a2a'; detail = '#1e1e1e'; }
  else if (tile === 'V') { base = '#0c0c0c'; detail = '#060606'; }
  else if (tile === 'M') { base = '#252525'; detail = '#1c1c1c'; }
  else if (tile === '>' || tile === '<' || tile === '!') { base = '#e0e0e0'; detail = '#b0b0b0'; bright = true; }

  ctx.fillStyle = base;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  // pixel texture dots (dithering)
  ctx.fillStyle = detail;
  if (tile === 'V') {
    // checkerboard void
    for (let dy = 0; dy < TILE_SIZE; dy += 8) {
      for (let dx = (dy / 8 % 2) * 8; dx < TILE_SIZE; dx += 16) {
        ctx.fillRect(x + dx, y + dy, 8, 8);
      }
    }
  } else if (tile === 'T') {
    // forest: dark center block
    ctx.fillRect(x + 12, y + 8, 24, 32);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(x + 18, y + 12, 12, 20);
  } else if (tile === 'M') {
    // memory grass: light flecks
    ctx.fillStyle = '#333333';
    for (let i = 0; i < 4; i++) ctx.fillRect(x + i*12 + 2, y + (i%2)*12 + 6, 4, 4);
  } else if (tile === 'H') {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
    // window
    ctx.fillStyle = '#404040';
    ctx.fillRect(x + 14, y + 12, 8, 8);
    ctx.fillRect(x + 28, y + 12, 8, 8);
  } else if (tile === 'W') {
    // stone wall: horizontal mortar lines
    ctx.fillStyle = '#222222';
    for (let r = 0; r < 4; r++) ctx.fillRect(x + 2, y + r * 12 + 10, TILE_SIZE - 4, 2);
  } else if (tile === 'P') {
    // path: subtle grain dots
    ctx.fillStyle = '#282828';
    for (let i = 0; i < 3; i++) ctx.fillRect(x + i*16 + 6, y + (i%2)*14 + 8, 3, 3);
  }

  if (bright) {
    // pulsing exit chevron
    const pulse = 0.6 + 0.4 * Math.sin(frame * 0.08);
    ctx.fillStyle = `rgba(255,255,255,${pulse})`;
    ctx.font = 'bold 20px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(tile === '>' ? '▲' : tile === '!' ? '!' : '▼', x + TILE_SIZE/2, y + TILE_SIZE/2);
    ctx.textBaseline = 'alphabetic';
  }

  // 1px grid line
  ctx.strokeStyle = C.darkest;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
}

// Draw a scanline overlay (8-bit CRT effect)
function drawScanlines(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);
}

// Draw a pixel-border box
function pixelBox(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill = C.black, stroke = C.white, sw = 3) {
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = stroke; ctx.lineWidth = sw; ctx.strokeRect(x, y, w, h);
  // corner dots
  ctx.fillStyle = stroke;
  ctx.fillRect(x, y, 3, 3); ctx.fillRect(x + w - 3, y, 3, 3);
  ctx.fillRect(x, y + h - 3, 3, 3); ctx.fillRect(x + w - 3, y + h - 3, 3, 3);
}

// Wrap text within a pixel-box
function drawWrappedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number) {
  const words = text.split(' ');
  let line = ''; let cy = y;
  for (const w of words) {
    const test = line + w + ' ';
    if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line.trim(), x, cy); line = w + ' '; cy += lineH; }
    else line = test;
  }
  ctx.fillText(line.trim(), x, cy);
}

export function renderGame(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = C.black; ctx.fillRect(0, 0, W, H);

  // ── TITLE ──────────────────────────────────────────────────────────
  if (state.mode === GameMode.TITLE) {
    // film-grain dots
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    for (let i = 0; i < 40; i++) {
      const gx = (state.frameCount * 0.7 + i * 83) % W;
      const gy = (H - (state.frameCount * (1 + i % 3) * 0.3 + i * 60) % H);
      ctx.fillRect(Math.floor(gx), Math.floor(gy), 2, 2);
    }
    // border
    pixelBox(ctx, 30, 30, W - 60, H - 60, '#050505', C.light, 2);
    // title
    ctx.font = 'bold 56px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = C.white;
    ctx.fillText('ECHO REALM', W / 2, 220);
    ctx.font = '18px monospace'; ctx.fillStyle = C.silver;
    ctx.fillText('A Memory Keeper\'s Tale', W / 2, 260);
    // horizontal rule
    ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(100, 285); ctx.lineTo(W - 100, 285); ctx.stroke();
    // blink
    if (Math.floor(state.frameCount / 25) % 2 === 0) {
      ctx.fillStyle = C.light; ctx.font = '16px monospace';
      ctx.fillText('[ SPACE ] to begin', W / 2, 440);
    }
    ctx.fillStyle = C.dim; ctx.font = '13px monospace';
    ctx.fillText('Arrow keys to move  |  SPACE to interact  |  I Inventory  |  Q Quests  |  ESC Menu', W / 2, H - 50);
    drawScanlines(ctx);
    return;
  }

  // ── GAME OVER ──────────────────────────────────────────────────────
  if (state.mode === GameMode.GAME_OVER) {
    pixelBox(ctx, 184, 180, 400, 180, C.black, C.white, 3);
    ctx.fillStyle = C.white; ctx.font = 'bold 40px monospace'; ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', W / 2, 260);
    ctx.fillStyle = C.gray; ctx.font = '16px monospace';
    ctx.fillText('The memories fade...', W / 2, 300);
    if (Math.floor(state.frameCount / 25) % 2 === 0) {
      ctx.fillStyle = C.light;
      ctx.fillText('[ SPACE ] to continue', W / 2, 340);
    }
    drawScanlines(ctx);
    return;
  }

  // ── VICTORY ────────────────────────────────────────────────────────
  if (state.mode === GameMode.VICTORY) {
    pixelBox(ctx, 100, 160, W - 200, 240, C.black, C.white, 3);
    ctx.fillStyle = C.white; ctx.font = 'bold 32px monospace'; ctx.textAlign = 'center';
    ctx.fillText('THE REALM REMEMBERS', W / 2, 240);
    ctx.fillStyle = C.silver; ctx.font = '17px monospace';
    ctx.fillText('You have restored the light.', W / 2, 290);
    ctx.fillText('Every memory was worth saving.', W / 2, 320);
    ctx.fillStyle = C.gray; ctx.font = '13px monospace';
    ctx.fillText('Thank you for playing Echo Realm.', W / 2, 370);
    drawScanlines(ctx);
    return;
  }

  // ── BATTLE ─────────────────────────────────────────────────────────
  if (state.mode === GameMode.BATTLE && state.battle) {
    renderBattle(ctx, state);
    drawScanlines(ctx);
    return;
  }

  // ── OVERWORLD ──────────────────────────────────────────────────────
  const map = MAPS[state.mapId];
  const camX = Math.max(0, Math.min(state.player.x - W / 2 + TILE_SIZE / 2, map.width * TILE_SIZE - W));
  const camY = Math.max(0, Math.min(state.player.y - H / 2 + TILE_SIZE / 2, map.height * TILE_SIZE - H));

  ctx.save();
  ctx.translate(-Math.floor(camX), -Math.floor(camY));

  // tiles
  const startX = Math.max(0, Math.floor(camX / TILE_SIZE));
  const endX   = Math.min(map.width,  Math.ceil((camX + W) / TILE_SIZE));
  const startY = Math.max(0, Math.floor(camY / TILE_SIZE));
  const endY   = Math.min(map.height, Math.ceil((camY + H) / TILE_SIZE));

  for (let gy = startY; gy < endY; gy++) {
    for (let gx = startX; gx < endX; gx++) {
      drawTile(ctx, gx, gy, map.layout[gy][gx], state.frameCount);
    }
  }

  // chests
  for (const c of map.chests) {
    const wx = c.x * TILE_SIZE; const wy = c.y * TILE_SIZE;
    ctx.fillStyle = state.player.flags[c.flag] ? C.dark : C.mid;
    ctx.fillRect(wx + 8, wy + 14, 32, 24);
    ctx.strokeStyle = state.player.flags[c.flag] ? C.dim : C.light; ctx.lineWidth = 2;
    ctx.strokeRect(wx + 8, wy + 14, 32, 24);
    if (!state.player.flags[c.flag]) {
      ctx.fillStyle = C.light; ctx.fillRect(wx + 20, wy + 24, 8, 4);
      // clasp
      ctx.fillStyle = C.white; ctx.fillRect(wx + 22, wy + 21, 4, 7);
    } else {
      // open
      ctx.fillStyle = C.dark; ctx.fillRect(wx + 12, wy + 18, 24, 16);
    }
  }

  // NPCs (one-time NPCs whose hideFlag is set are gone for good)
  for (const npc of map.npcs) {
    if (npc.hideFlag && state.player.flags[npc.hideFlag]) continue;
    drawSprite(ctx, npc.x * TILE_SIZE, npc.y * TILE_SIZE, npc.color, C.black, npc.id === 'maren');
  }

  // player (flashing during invincibility)
  if (state.player.invincibility <= 0 || Math.floor(state.frameCount / 4) % 2 === 0) {
    drawSprite(ctx, state.player.x, state.player.y, C.white, C.black);
  }

  // interaction prompt (NPC key prompt — floats/bobs above target)
  if (state.adjacentInteractable && state.mode === GameMode.OVERWORLD) {
    const int = state.adjacentInteractable;
    const bob = Math.round(Math.sin(state.frameCount * 0.12) * 3);
    const wx = int.x * TILE_SIZE; const wy = int.y * TILE_SIZE;

    let label = '[SPACE] - Talk';
    if (int.type === 'CHEST') label = '[SPACE] - Open';
    else if (int.type === 'EXIT') label = '[SPACE] - Travel';
    else if (int.type === 'NPC' && int.npc.type === 'SHOP') label = '[SPACE] - Shop';
    else if (int.type === 'NPC' && int.npc.type === 'HEAL') label = '[SPACE] - Rest';
    else if (int.type === 'NPC' && int.npc.type === 'BOSS') label = '[SPACE] - ???';

    ctx.font = 'bold 11px monospace';
    const tw = ctx.measureText(label).width;
    const bw = tw + 16; const bh = 20;
    const bx = wx + TILE_SIZE / 2 - bw / 2;
    const by = wy - 28 + bob;

    // box
    ctx.fillStyle = C.white; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = C.black; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    // text
    ctx.fillStyle = C.black; ctx.textAlign = 'center';
    ctx.fillText(label, wx + TILE_SIZE / 2, by + 14);
    // small downward triangle pointer
    ctx.fillStyle = C.white;
    ctx.beginPath();
    ctx.moveTo(wx + TILE_SIZE / 2 - 5, by + bh);
    ctx.lineTo(wx + TILE_SIZE / 2 + 5, by + bh);
    ctx.lineTo(wx + TILE_SIZE / 2,     by + bh + 6);
    ctx.fill();
    ctx.strokeStyle = C.black; ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.restore();

  // ── HUD ────────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(8,8,8,0.88)'; ctx.fillRect(0, 0, W, 38);
  ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, 38); ctx.lineTo(W, 38); ctx.stroke();

  ctx.textAlign = 'left'; ctx.font = 'bold 15px monospace';
  ctx.fillStyle = C.white;  ctx.fillText(`HP ${state.player.hp}/${state.player.maxHp}`, 14, 25);
  ctx.fillStyle = C.silver; ctx.fillText(`|`, 100, 25);
  ctx.fillStyle = C.light;  ctx.fillText(`${state.player.echoes} ECHOES`, 114, 25);
  ctx.fillStyle = C.gray;   ctx.textAlign = 'right';
  ctx.fillText(map.name.toUpperCase(), W - 14, 25);

  // HP bar
  const hpPct = state.player.hp / state.player.maxHp;
  ctx.fillStyle = C.darkest; ctx.fillRect(14, 28, 80, 6);
  ctx.fillStyle = hpPct > 0.5 ? C.silver : hpPct > 0.25 ? C.gray : '#666666';
  ctx.fillRect(14, 28, Math.floor(80 * hpPct), 6);

  // controls hint
  ctx.textAlign = 'center'; ctx.font = '11px monospace'; ctx.fillStyle = C.dim;
  ctx.fillText('WASD Move  |  SPACE Interact  |  I Inventory  |  Q Quests  |  ESC Menu', W / 2, H - 6);

  // popup message
  if (state.uiMessage) {
    const tw = ctx.measureText(state.uiMessage).width + 40;
    const mx = (W - tw) / 2;
    pixelBox(ctx, mx, 55, tw, 34, C.black, C.white, 2);
    ctx.fillStyle = C.white; ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center';
    ctx.fillText(state.uiMessage, W / 2, 76);
  }

  // overlays (dialogue, menu, shop, inventory, quest log drawn on top)
  if (state.mode === GameMode.DIALOGUE)  renderDialogue(ctx, state);
  if (state.mode === GameMode.MENU)      renderMenu(ctx, state);
  if (state.mode === GameMode.SHOP)      renderShop(ctx, state);
  if (state.mode === GameMode.INVENTORY) renderInventory(ctx, state);
  if (state.mode === GameMode.QUEST_LOG) renderQuests(ctx, state);

  drawScanlines(ctx);
}

// ── DIALOGUE ───────────────────────────────────────────────────────
function renderDialogue(ctx: CanvasRenderingContext2D, state: GameStateData) {
  const BY = H - 168;
  pixelBox(ctx, 12, BY, W - 24, 154, '#030303', C.white, 3);

  const node = state.dialogue.currentNode!;
  // portrait block
  if (node.color) {
    ctx.fillStyle = node.color; ctx.fillRect(24, BY + 14, 56, 56);
    ctx.strokeStyle = C.dim; ctx.lineWidth = 2; ctx.strokeRect(24, BY + 14, 56, 56);
    // pixel eyes in portrait
    ctx.fillStyle = C.black;
    ctx.fillRect(35, BY + 30, 8, 8); ctx.fillRect(55, BY + 30, 8, 8);
  }
  // speaker name
  ctx.fillStyle = C.white; ctx.font = 'bold 15px monospace'; ctx.textAlign = 'left';
  ctx.fillText(node.speaker, 94, BY + 32);
  // horizontal divider
  ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(94, BY + 38); ctx.lineTo(W - 28, BY + 38); ctx.stroke();
  // text body
  ctx.font = '14px monospace'; ctx.fillStyle = C.light;
  const visible = node.text.substring(0, state.dialogue.charIndex);
  drawWrappedText(ctx, visible, 94, BY + 58, W - 130, 22);
  // options
  if (state.dialogue.charIndex >= node.text.length && node.options) {
    const optY = BY + 106;
    for (let i = 0; i < node.options.length; i++) {
      const sel = state.dialogue.selectedOption === i;
      ctx.fillStyle = sel ? C.white : C.gray;
      ctx.font = sel ? 'bold 14px monospace' : '14px monospace';
      ctx.fillText((sel ? '> ' : '  ') + node.options[i].label, 94, optY + i * 22);
    }
  }
  // advance prompt
  if (state.dialogue.charIndex >= node.text.length && (!node.options || node.options.length === 0)) {
    if (Math.floor(state.frameCount / 20) % 2 === 0) {
      ctx.fillStyle = C.gray; ctx.font = '11px monospace'; ctx.textAlign = 'right';
      ctx.fillText('[SPACE]', W - 28, BY + 140);
    }
  }
}

// ── BATTLE ─────────────────────────────────────────────────────────
function renderBattle(ctx: CanvasRenderingContext2D, state: GameStateData) {
  const b = state.battle!;
  ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, W, H);

  // film-strip top border
  ctx.fillStyle = '#111111'; ctx.fillRect(0, 0, W, 8);
  ctx.fillStyle = '#111111'; ctx.fillRect(0, H - 8, W, 8);

  // enemy name + HP
  ctx.fillStyle = C.white; ctx.font = 'bold 22px monospace'; ctx.textAlign = 'center';
  ctx.fillText(b.enemy.name, W / 2, 40);
  // HP bar
  const hpPct = b.enemy.hp / b.enemy.maxHp;
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(260, 50, 248, 12);
  ctx.fillStyle = C.silver;  ctx.fillRect(260, 50, Math.floor(248 * hpPct), 12);
  ctx.strokeStyle = C.dim; ctx.lineWidth = 1; ctx.strokeRect(260, 50, 248, 12);

  // resonance meter
  ctx.fillStyle = C.dim; ctx.font = '13px monospace'; ctx.textAlign = 'center';
  ctx.fillText('RESONANCE', W / 2, 78);
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < b.resonance ? C.white : '#222222';
    ctx.fillRect(340 + i * 36, 82, 28, 10);
    ctx.strokeStyle = C.dim; ctx.lineWidth = 1; ctx.strokeRect(340 + i * 36, 82, 28, 10);
  }

  // enemy sprite (pixel art style)
  drawEnemySprite(ctx, b.enemy.id, W / 2, 160, state.frameCount);

  // soul box (battle arena)
  const BOX = { x: 234, y: 310, w: 300, h: 195 };
  pixelBox(ctx, BOX.x, BOX.y, BOX.w, BOX.h, '#000000', C.white, 3);

  // phase-specific content
  if (b.phase === 'MENU') {
    ctx.fillStyle = C.silver; ctx.font = '13px monospace'; ctx.textAlign = 'center';
    drawWrappedText(ctx, b.actionMsg || b.enemy.flavor, W / 2, 280, 500, 18);
    // action menu
    const opts = ['REMEMBER', 'FORGET', 'ACT', 'ITEMS', 'FLEE'];
    const colors = [C.white, C.light, C.silver, C.gray, C.dim];
    ctx.textAlign = 'left'; ctx.font = 'bold 15px monospace';
    opts.forEach((opt, i) => {
      const sel = b.menuIndex === i;
      ctx.fillStyle = sel ? C.white : C.dim;
      const bx = 20 + i * 148; const by = H - 42;
      if (sel) { ctx.fillStyle = '#111111'; ctx.fillRect(bx - 4, by - 18, ctx.measureText('  ' + opt).width + 10, 24); }
      ctx.fillStyle = sel ? C.white : C.dim;
      ctx.fillText((sel ? '> ' : '  ') + opt, bx, by);
    });
    // player HP
    ctx.textAlign = 'left'; ctx.fillStyle = C.light; ctx.font = '13px monospace';
    ctx.fillText(`HP  ${state.player.hp} / ${state.player.maxHp}`, 14, H - 14);
  } else if (b.phase === 'ACT_MENU') {
    ctx.fillStyle = C.silver; ctx.font = '13px monospace'; ctx.textAlign = 'center';
    ctx.fillText('ACT  ---  choose an action', W / 2, 280);
    ctx.textAlign = 'left'; ctx.font = 'bold 15px monospace';
    b.enemy.acts.forEach((act, i) => {
      const sel = b.menuIndex === i;
      ctx.fillStyle = sel ? C.white : C.dim;
      ctx.fillText((sel ? '> ' : '  ') + act.name, 60 + i * 200, H - 30);
    });
    ctx.fillStyle = C.gray; ctx.textAlign = 'right'; ctx.font = '12px monospace';
    ctx.fillText('[X] back', W - 20, H - 12);
  } else if (b.phase === 'MINIGAME') {
    ctx.fillStyle = C.silver; ctx.font = '14px monospace'; ctx.textAlign = 'center';
    const label = b.minigame!.type === 'REMEMBER' ? 'RESONATE  --  press SPACE in the zone' : 'STRIKE  --  press SPACE in the zone';
    ctx.fillText(label, W / 2, 280);
    // minigame bar
    const barX = 264; const barY = 400; const barW = 240; const barH = 24;
    ctx.fillStyle = '#111111'; ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = C.silver; ctx.lineWidth = 2; ctx.strokeRect(barX, barY, barW, barH);
    // zone
    const zoneColor = b.minigame!.type === 'REMEMBER' ? '#555555' : '#444444';
    ctx.fillStyle = zoneColor; ctx.fillRect(barX + 96, barY, 48, barH); // center zone
    ctx.fillStyle = '#888888'; ctx.fillRect(barX + 108, barY + 4, 24, barH - 8); // perfect zone
    // cursor
    const cx = barX + Math.floor(b.minigame!.cursorX * barW);
    ctx.fillStyle = C.white; ctx.fillRect(cx - 2, barY - 4, 4, barH + 8);
    // zone labels
    ctx.fillStyle = C.gray; ctx.font = '11px monospace'; ctx.textAlign = 'center';
    ctx.fillText('ZONE', barX + 120, barY + barH + 16);
  } else if (b.phase === 'DODGE') {
    // projectiles
    for (const p of b.projectiles) {
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x - p.w / 2), Math.floor(p.y - p.h / 2), p.w, p.h);
    }
    // soul (white diamond)
    const flash = state.player.invincibility > 0 && Math.floor(state.frameCount / 4) % 2 === 0;
    if (!flash) {
      ctx.fillStyle = C.white;
      ctx.save(); ctx.translate(Math.floor(b.soulX), Math.floor(b.soulY)); ctx.rotate(Math.PI / 4);
      ctx.fillRect(-6, -6, 12, 12);
      ctx.strokeStyle = C.black; ctx.lineWidth = 1; ctx.strokeRect(-6, -6, 12, 12);
      ctx.restore();
    }
    // HP display inside box
    ctx.fillStyle = C.white; ctx.font = '12px monospace'; ctx.textAlign = 'left';
    ctx.fillText(`HP ${state.player.hp}/${state.player.maxHp}`, BOX.x + 8, BOX.y + BOX.h - 6);
  } else if (b.phase === 'ACTION' || b.phase === 'END') {
    ctx.fillStyle = C.light; ctx.font = '15px monospace'; ctx.textAlign = 'center';
    drawWrappedText(ctx, b.actionMsg || '...', W / 2, 390, 460, 24);
    if (b.phase === 'END') {
      if (Math.floor(state.frameCount / 20) % 2 === 0) {
        ctx.fillStyle = C.gray; ctx.font = '13px monospace';
        ctx.fillText('[SPACE] continue', W / 2, H - 20);
      }
    }
  }
}

function drawEnemySprite(ctx: CanvasRenderingContext2D, id: string, cx: number, cy: number, frame: number) {
  const pulse = Math.sin(frame * 0.05) * 3;
  ctx.fillStyle = C.mid;
  if (id === 'wisp') {
    // ellipse-ish wisp
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `rgba(180,180,180,${0.3 + i * 0.12})`;
      ctx.fillRect(cx - 28 + i * 4, cy - 28 + pulse + i * 3, 56 - i * 8, 40 - i * 6);
    }
    // eyes
    ctx.fillStyle = C.black; ctx.fillRect(cx - 10, cy - 14 + Math.floor(pulse), 6, 6);
    ctx.fillRect(cx + 4,  cy - 14 + Math.floor(pulse), 6, 6);
  } else if (id === 'crawler') {
    // blocky crab
    ctx.fillStyle = '#444444';
    ctx.fillRect(cx - 30, cy - 12, 60, 28); // body
    ctx.fillStyle = '#555555';
    ctx.fillRect(cx - 40, cy - 6, 12, 16); ctx.fillRect(cx + 28, cy - 6, 12, 16); // claws
    ctx.fillRect(cx - 20, cy + 16, 8, 12); ctx.fillRect(cx - 6, cy + 16, 8, 12);  // legs
    ctx.fillRect(cx + 8, cy + 16, 8, 12);  ctx.fillRect(cx + 22, cy + 16, 8, 12);
    ctx.fillStyle = C.black; ctx.fillRect(cx - 14, cy - 6, 8, 8); ctx.fillRect(cx + 6, cy - 6, 8, 8);
    ctx.strokeStyle = C.dark; ctx.lineWidth = 1;
    ctx.strokeRect(cx - 30, cy - 12, 60, 28);
  } else if (id === 'specter') {
    // flowing ghost
    const wave = Math.floor(Math.sin(frame * 0.08) * 4);
    ctx.fillStyle = '#b0b0b0';
    ctx.fillRect(cx - 20, cy - 36, 40, 52 + wave);
    ctx.fillStyle = '#888888';
    ctx.fillRect(cx - 28, cy - 20, 56, 28);
    // wavy bottom
    for (let i = 0; i < 5; i++) {
      const ww = 10; const wx2 = cx - 24 + i * ww;
      const wh = 8 + Math.floor(Math.sin(frame * 0.1 + i) * 4);
      ctx.fillStyle = i % 2 === 0 ? '#999999' : '#777777';
      ctx.fillRect(wx2, cy + 16, ww, wh);
    }
    ctx.fillStyle = C.black; ctx.fillRect(cx - 12, cy - 26, 8, 8); ctx.fillRect(cx + 4, cy - 26, 8, 8);
  } else if (id === 'boss' || id === 'archivist') {
    // large wraith with tendrils (reused for the mid-boss too)
    const flicker = Math.floor(frame * 0.2) % 2;
    ctx.fillStyle = flicker ? '#181818' : '#202020';
    ctx.fillRect(cx - 40, cy - 52, 80, 72);
    ctx.fillStyle = '#111111';
    ctx.fillRect(cx - 24, cy - 68, 48, 20); // crown
    // tendrils
    ctx.fillStyle = '#2a2a2a';
    for (let i = 0; i < 4; i++) {
      const tx = cx - 50 + i * 32;
      const ty2 = cy + 20 + Math.floor(Math.sin(frame * 0.07 + i) * 8);
      ctx.fillRect(tx, ty2, 6, 20);
    }
    // eyes (glowing)
    ctx.fillStyle = C.white; ctx.fillRect(cx - 18, cy - 38, 10, 10); ctx.fillRect(cx + 8, cy - 38, 10, 10);
    ctx.fillStyle = C.black; ctx.fillRect(cx - 16, cy - 36, 6, 6); ctx.fillRect(cx + 10, cy - 36, 6, 6);
  } else {
    // generic fallback sprite for any enemy without a bespoke drawing above
    ctx.fillStyle = '#333333';
    ctx.fillRect(cx - 26, cy - 30 + pulse, 52, 52);
    ctx.strokeStyle = C.dim; ctx.lineWidth = 2; ctx.strokeRect(cx - 26, cy - 30 + pulse, 52, 52);
    ctx.fillStyle = C.white;
    ctx.fillRect(cx - 14, cy - 12 + pulse, 8, 8); ctx.fillRect(cx + 6, cy - 12 + pulse, 8, 8);
    ctx.fillStyle = C.black;
    ctx.fillRect(cx - 12, cy - 10 + pulse, 4, 4); ctx.fillRect(cx + 8, cy - 10 + pulse, 4, 4);
  }
}

// ── MENU ───────────────────────────────────────────────────────────
function renderMenu(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 274, 140, 220, 220, C.black, C.white, 3);
  ctx.fillStyle = C.silver; ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center';
  ctx.fillText('MENU', W / 2, 166);
  ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(290, 174); ctx.lineTo(474, 174); ctx.stroke();

  const opts = [
    'Resume',
    'Inventory',
    'Quest Log',
    state.meta.isGuest ? 'Save (login req.)' : 'Save Game',
    state.meta.isGuest ? 'Quit to Title' : 'Save & Quit',
    'Exit to Title',
  ];
  ctx.textAlign = 'left'; ctx.font = '14px monospace';
  opts.forEach((opt, i) => {
    const sel = state.menuIndex === i;
    ctx.fillStyle = sel ? C.white : C.dim;
    ctx.fillText((sel ? '> ' : '  ') + opt, 300, 200 + i * 28);
  });
}

// ── SHOP ───────────────────────────────────────────────────────────
function renderShop(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 60, 50, W - 120, H - 100, C.black, C.white, 3);

  const shop = SHOPS[state.shopNpcId || 'zara'] ?? SHOPS['zara'];

  ctx.fillStyle = C.white; ctx.font = 'bold 20px monospace'; ctx.textAlign = 'center';
  ctx.fillText(shop.title.toUpperCase(), W / 2, 90);
  ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 100); ctx.lineTo(W - 80, 100); ctx.stroke();

  ctx.fillStyle = C.silver; ctx.textAlign = 'right'; ctx.font = '14px monospace';
  ctx.fillText(`Echoes: ${state.player.echoes}`, W - 90, 90);

  const shopItems = shop.items;
  ctx.textAlign = 'left';
  shopItems.forEach((id, i) => {
    const item = ITEMS[id]; const sel = state.shopIndex === i;
    const iy = 130 + i * 60;
    if (sel) { ctx.fillStyle = '#111111'; ctx.fillRect(82, iy - 20, W - 164, 56); }
    ctx.fillStyle = sel ? C.white : C.gray; ctx.font = 'bold 15px monospace';
    ctx.fillText((sel ? '> ' : '  ') + item.name, 94, iy);
    ctx.fillStyle = sel ? C.silver : C.dim; ctx.font = '13px monospace';
    ctx.fillText(`${item.price} Echoes`, 94, iy + 18);
    if (sel) { ctx.fillStyle = C.light; ctx.fillText(item.desc, 250, iy); }
  });

  if (state.uiMessage) {
    ctx.fillStyle = C.white; ctx.font = '14px monospace'; ctx.textAlign = 'center';
    ctx.fillText(state.uiMessage, W / 2, H - 75);
  }
  ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
  ctx.fillText('[UP/DOWN] browse  |  [SPACE] buy  |  [X] exit', W / 2, H - 58);
}

// ── INVENTORY ──────────────────────────────────────────────────────
function renderInventory(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 164, 90, W - 328, H - 180, C.black, C.white, 3);

  ctx.fillStyle = C.white; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center';
  ctx.fillText('INVENTORY', W / 2, 122);
  ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(180, 130); ctx.lineTo(W - 180, 130); ctx.stroke();

  ctx.textAlign = 'left'; ctx.font = '14px monospace';
  if (state.player.inventory.length === 0) {
    ctx.fillStyle = C.dim; ctx.textAlign = 'center';
    ctx.fillText('-- empty --', W / 2, 200);
  } else {
    // The list box only has room for a handful of rows — scroll a window
    // around the selected item instead of letting rows run past the box
    // and overlap the description text below it.
    const rowH = 26;
    const listTop = 154;
    const maxVisible = 8;
    const total = state.player.inventory.length;
    const maxScroll = Math.max(0, total - maxVisible);
    const scrollOffset = Math.min(maxScroll, Math.max(0, state.inventoryIndex - maxVisible + 1));
    const visibleIds = state.player.inventory.slice(scrollOffset, scrollOffset + maxVisible);

    visibleIds.forEach((id, vi) => {
      const i = scrollOffset + vi;
      const sel = state.inventoryIndex === i;
      const equipped = state.player.equipment.weapon === id || state.player.equipment.armor === id;
      ctx.fillStyle = sel ? C.white : C.gray;
      ctx.font = sel ? 'bold 14px monospace' : '14px monospace';
      ctx.fillText((sel ? '> ' : '  ') + ITEMS[id].name + (equipped ? ' [E]' : ''), 188, listTop + vi * rowH);
    });
    if (scrollOffset > 0) {
      ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
      ctx.fillText('▲', W / 2, listTop - 14);
    }
    if (scrollOffset + maxVisible < total) {
      ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
      ctx.fillText('▼', W / 2, listTop + maxVisible * rowH + 4);
    }
    ctx.textAlign = 'left';
    const curId = state.player.inventory[state.inventoryIndex];
    const cur = ITEMS[curId];
    if (cur) {
      ctx.fillStyle = C.silver; ctx.font = '12px monospace'; ctx.textAlign = 'center';
      ctx.fillText(cur.desc, W / 2, H - 160);
      const actionLabel = cur.category === 'weapon' || cur.category === 'armor'
        ? '[SPACE] equip/unequip  |  [X] close'
        : cur.category === 'key' ? '[X] close' : '[SPACE] use  |  [X] close';
      ctx.fillText(actionLabel, W / 2, H - 140);
    }
  }
}

// ── QUESTS ─────────────────────────────────────────────────────────
function renderQuests(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 100, 80, W - 200, H - 160, C.black, C.white, 3);

  ctx.fillStyle = C.white; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center';
  ctx.fillText('QUEST LOG', W / 2, 114);
  ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(120, 122); ctx.lineTo(W - 120, 122); ctx.stroke();

  ctx.textAlign = 'left'; ctx.font = '13px monospace';
  let qy = 150;

  function qLine(label: string, done: boolean) {
    ctx.fillStyle = done ? C.silver : C.light;
    ctx.fillText((done ? '[DONE] ' : '[ACT]  ') + label, 124, qy); qy += 26;
  }

  const active = QUESTS.filter(q => q.isActive(state));
  for (const q of active) qLine(q.label(state), q.isDone(state));

  if (active.length === 0) {
    ctx.fillStyle = C.dim; ctx.textAlign = 'center';
    ctx.fillText('No active quests.  Speak to villagers to begin.', W / 2, 200);
  }

  ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
  ctx.fillText('[Q] or [X] to close', W / 2, H - 110);
}
