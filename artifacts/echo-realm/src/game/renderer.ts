import { GameStateData, GameMode } from './types';
import { MAPS, ITEMS, SHOPS, BOOKS, TILE_SIZE, TIER_COLOR, TIER_LABEL, CRAFTABLE_ENCHANTS, getHighestTier, TELEPORT_POINTS } from './constants';
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
  bookBg:   '#0d0d1a',
  bookBorder: '#4444aa',
  enchant:  '#cc88ff',
};

const W = 768; const H = 576;

function drawSprite(ctx: CanvasRenderingContext2D, wx: number, wy: number, col: string, eyeCol = C.black, hat = false) {
  const px = wx + 16; const py = wy + 8;
  ctx.fillStyle = col; ctx.fillRect(px, py + 4, 16, 16);
  ctx.fillStyle = col; ctx.fillRect(px + 2, py - 4, 12, 12);
  ctx.fillStyle = eyeCol;
  ctx.fillRect(px + 4, py - 1, 3, 3); ctx.fillRect(px + 9, py - 1, 3, 3);
  ctx.strokeStyle = C.darkest; ctx.lineWidth = 1;
  ctx.strokeRect(px, py + 4, 16, 16); ctx.strokeRect(px + 2, py - 4, 12, 12);
  if (hat) {
    ctx.fillStyle = C.dim;
    ctx.fillRect(px, py - 8, 16, 4); ctx.fillRect(px + 3, py - 12, 10, 4);
  }
}

function drawTile(ctx: CanvasRenderingContext2D, tx: number, ty: number, tile: string, frame: number) {
  const x = tx * TILE_SIZE; const y = ty * TILE_SIZE;
  let base = C.dark; let detail = C.darkest; let bright = false;

  if (tile === 'P')      { base = '#2e2e2e'; detail = '#222222'; }
  else if (tile === 'G') { base = '#1e1e1e'; detail = '#161616'; }
  else if (tile === 'T') { base = '#141414'; detail = '#0e0e0e'; }
  else if (tile === 'W') { base = '#303030'; detail = '#242424'; }
  else if (tile === 'H') { base = '#2a2a2a'; detail = '#1e1e1e'; }
  else if (tile === 'D') { base = '#1e1e2e'; detail = '#14142e'; } // door tile - slightly blue
  else if (tile === 'V') { base = '#0c0c0c'; detail = '#060606'; }
  else if (tile === 'M') { base = '#252525'; detail = '#1c1c1c'; }
  else if (tile === '>' || tile === '<' || tile === '!') { base = '#e0e0e0'; detail = '#b0b0b0'; bright = true; }

  ctx.fillStyle = base; ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  ctx.fillStyle = detail;
  if (tile === 'V') {
    for (let dy = 0; dy < TILE_SIZE; dy += 8) {
      for (let dx = (dy / 8 % 2) * 8; dx < TILE_SIZE; dx += 16) {
        ctx.fillRect(x + dx, y + dy, 8, 8);
      }
    }
  } else if (tile === 'T') {
    ctx.fillRect(x + 12, y + 8, 24, 32);
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(x + 18, y + 12, 12, 20);
  } else if (tile === 'M') {
    ctx.fillStyle = '#333333';
    for (let i = 0; i < 4; i++) ctx.fillRect(x + i * 12 + 2, y + (i % 2) * 12 + 6, 4, 4);
  } else if (tile === 'H') {
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
    ctx.fillStyle = '#404040';
    ctx.fillRect(x + 14, y + 12, 8, 8); ctx.fillRect(x + 28, y + 12, 8, 8);
  } else if (tile === 'W') {
    ctx.fillStyle = '#222222';
    for (let r = 0; r < 4; r++) ctx.fillRect(x + 2, y + r * 12 + 10, TILE_SIZE - 4, 2);
  } else if (tile === 'P') {
    ctx.fillStyle = '#282828';
    for (let i = 0; i < 3; i++) ctx.fillRect(x + i * 16 + 6, y + (i % 2) * 14 + 8, 3, 3);
  } else if (tile === 'D') {
    // Door tile: archway shape
    ctx.fillStyle = '#2a2a44'; ctx.fillRect(x + 10, y + 10, 28, 34);
    ctx.fillStyle = '#111122'; ctx.fillRect(x + 14, y + 14, 20, 26);
    ctx.fillStyle = '#5555aa'; ctx.fillRect(x + 22, y + 28, 4, 12); // handle
  }

  if (bright) {
    const pulse = 0.6 + 0.4 * Math.sin(frame * 0.08);
    ctx.fillStyle = `rgba(255,255,255,${pulse})`;
    ctx.font = 'bold 20px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(tile === '>' ? '▲' : tile === '!' ? '!' : '▼', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
    ctx.textBaseline = 'alphabetic';
  }

  ctx.strokeStyle = C.darkest; ctx.lineWidth = 1;
  ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
}

function drawScanlines(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);
}

function pixelBox(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill = C.black, stroke = C.white, sw = 3) {
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = stroke; ctx.lineWidth = sw; ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = stroke;
  ctx.fillRect(x, y, 3, 3); ctx.fillRect(x + w - 3, y, 3, 3);
  ctx.fillRect(x, y + h - 3, 3, 3); ctx.fillRect(x + w - 3, y + h - 3, 3, 3);
}

function drawWrappedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number): number {
  // Supports \n newlines within text
  const paragraphs = text.split('\n');
  let cy = y;
  for (const para of paragraphs) {
    if (para === '') { cy += lineH * 0.6; continue; }
    const words = para.split(' ');
    let line = '';
    for (const w of words) {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line.trim(), x, cy); line = w + ' '; cy += lineH;
      } else line = test;
    }
    if (line.trim()) { ctx.fillText(line.trim(), x, cy); cy += lineH; }
  }
  return cy;
}

// Draws text colored by item/reward tier. Mythic ("Mortus") renders as an
// animated dark-blue/black moving gradient instead of a flat color, keyed off
// frameCount so it visibly shifts over time.
function drawTierText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, tier: string, frame: number) {
  if (tier === 'mythic') {
    const tw = ctx.measureText(text).width;
    const align = ctx.textAlign;
    const startX = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x;
    const shift = (frame * 1.5) % (tw + 60);
    const grad = ctx.createLinearGradient(startX - 30 + shift - (tw + 60), y, startX + 30 + shift, y);
    grad.addColorStop(0, '#000000');
    grad.addColorStop(0.5, '#1a2a6c');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillText(text, x, y);
    return;
  }
  ctx.fillStyle = TIER_COLOR[tier] ?? C.light;
  ctx.fillText(text, x, y);
}

// Returns the display name for an inventory item (appends [Z] if enchanted)
function itemDisplayName(state: GameStateData, inventoryIndex: number): string {
  const id = state.player.inventory[inventoryIndex];
  const item = ITEMS[id];
  if (!item) return id;
  const enchanted = state.player.enchantedSlots[inventoryIndex];
  return item.name + (enchanted ? ' [Z]' : '');
}

// Returns a short category tag string
function categoryTag(id: string): string {
  const item = ITEMS[id];
  if (!item) return '';
  if (item.category === 'book') return '[BOOK]';
  if (item.category === 'enchanted_book') return '[ENCH]';
  if (item.category === 'weapon') return '[WPN]';
  if (item.category === 'armor') return '[ARM]';
  if (item.category === 'key') return '[KEY]';
  if (item.subcategory === 'medical') return '[MED]';
  if (item.subcategory === 'def') return '[DEF]';
  if (item.subcategory === 'utility') return '[UTIL]';
  return '[ITEM]';
}

function categoryTagColor(id: string): string {
  const item = ITEMS[id];
  if (!item) return C.dim;
  if (item.category === 'book') return '#88aaff';
  if (item.category === 'enchanted_book') return '#cc88ff';
  if (item.category === 'weapon') return '#ffaa88';
  if (item.category === 'armor') return '#88ffcc';
  if (item.category === 'key') return '#ffee88';
  if (item.subcategory === 'medical') return '#ff8888';
  if (item.subcategory === 'def') return '#88ccff';
  if (item.subcategory === 'utility') return '#ffcc88';
  return C.silver;
}

export function renderGame(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = C.black; ctx.fillRect(0, 0, W, H);

  // ── TITLE ──────────────────────────────────────────────────────────
  if (state.mode === GameMode.TITLE) {
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    for (let i = 0; i < 40; i++) {
      const gx = (state.frameCount * 0.7 + i * 83) % W;
      const gy = (H - (state.frameCount * (1 + i % 3) * 0.3 + i * 60) % H);
      ctx.fillRect(Math.floor(gx), Math.floor(gy), 2, 2);
    }
    pixelBox(ctx, 30, 30, W - 60, H - 60, '#050505', C.light, 2);
    ctx.font = 'bold 56px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = C.white;
    ctx.fillText('ECHO REALM', W / 2, 220);
    ctx.font = '18px monospace'; ctx.fillStyle = C.silver;
    ctx.fillText('A Memory Keeper\'s Tale', W / 2, 260);
    ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(100, 285); ctx.lineTo(W - 100, 285); ctx.stroke();
    if (Math.floor(state.frameCount / 25) % 2 === 0) {
      ctx.fillStyle = C.light; ctx.font = '16px monospace';
      ctx.fillText('[ SPACE ] to begin', W / 2, 440);
    }
    ctx.fillStyle = C.dim; ctx.font = '13px monospace';
    ctx.fillText('Arrow keys / WASD  |  SPACE interact  |  I Inventory  |  Q Quests  |  ESC Menu', W / 2, H - 50);
    drawScanlines(ctx); return;
  }

  if (state.mode === GameMode.GAME_OVER) {
    pixelBox(ctx, 184, 180, 400, 180, C.black, C.white, 3);
    ctx.fillStyle = C.white; ctx.font = 'bold 40px monospace'; ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', W / 2, 260);
    ctx.fillStyle = C.gray; ctx.font = '16px monospace';
    ctx.fillText('The memories fade...', W / 2, 300);
    if (Math.floor(state.frameCount / 25) % 2 === 0) {
      ctx.fillStyle = C.light; ctx.fillText('[ SPACE ] to continue', W / 2, 340);
    }
    drawScanlines(ctx); return;
  }

  if (state.mode === GameMode.VICTORY) {
    pixelBox(ctx, 100, 160, W - 200, 240, C.black, C.white, 3);
    ctx.fillStyle = C.white; ctx.font = 'bold 32px monospace'; ctx.textAlign = 'center';
    ctx.fillText('THE REALM REMEMBERS', W / 2, 240);
    ctx.fillStyle = C.silver; ctx.font = '17px monospace';
    ctx.fillText('You have restored the light.', W / 2, 290);
    ctx.fillText('Every memory was worth saving.', W / 2, 320);
    ctx.fillStyle = C.gray; ctx.font = '13px monospace';
    ctx.fillText('Thank you for playing Echo Realm.', W / 2, 370);
    drawScanlines(ctx); return;
  }

  if (state.mode === GameMode.BATTLE && state.battle) {
    renderBattle(ctx, state); drawScanlines(ctx); return;
  }

  // ── BOOK READ ──────────────────────────────────────────────────────
  if (state.mode === GameMode.BOOK_READ) {
    renderBookRead(ctx, state); drawScanlines(ctx); return;
  }

  // ── ENCHANT SELECT ─────────────────────────────────────────────────
  if (state.mode === GameMode.ENCHANT_SELECT) {
    renderEnchantSelect(ctx, state); drawScanlines(ctx); return;
  }

  // ── TOME CRAFT ─────────────────────────────────────────────────────
  if (state.mode === GameMode.TOME_CRAFT) {
    renderTomeCraft(ctx, state); drawScanlines(ctx); return;
  }

  // ── MEMORY TRANSIT (teleport) ───────────────────────────────────────
  if (state.mode === GameMode.TELEPORT) {
    renderTeleport(ctx, state); drawScanlines(ctx); return;
  }

  // ── OVERWORLD ──────────────────────────────────────────────────────
  const map = MAPS[state.mapId];
  const camX = Math.max(0, Math.min(state.player.x - W / 2 + TILE_SIZE / 2, map.width * TILE_SIZE - W));
  const camY = Math.max(0, Math.min(state.player.y - H / 2 + TILE_SIZE / 2, map.height * TILE_SIZE - H));

  ctx.save();
  ctx.translate(-Math.floor(camX), -Math.floor(camY));

  const startX = Math.max(0, Math.floor(camX / TILE_SIZE));
  const endX   = Math.min(map.width,  Math.ceil((camX + W) / TILE_SIZE));
  const startY = Math.max(0, Math.floor(camY / TILE_SIZE));
  const endY   = Math.min(map.height, Math.ceil((camY + H) / TILE_SIZE));

  for (let gy = startY; gy < endY; gy++) {
    for (let gx = startX; gx < endX; gx++) {
      drawTile(ctx, gx, gy, map.layout[gy][gx], state.frameCount);
    }
  }

  // Draw door markers on enterable buildings
  for (const door of (map.doors || [])) {
    const wx = door.x * TILE_SIZE; const wy = door.y * TILE_SIZE;
    // door archway overlay
    ctx.fillStyle = '#1a1a3a'; ctx.fillRect(wx + 12, wy + 10, 24, 34);
    ctx.fillStyle = '#0a0a1e'; ctx.fillRect(wx + 16, wy + 14, 16, 26);
    ctx.strokeStyle = '#4444aa'; ctx.lineWidth = 2; ctx.strokeRect(wx + 12, wy + 10, 24, 34);
    // handle dot
    ctx.fillStyle = '#6666cc'; ctx.fillRect(wx + 22, wy + 28, 4, 4);
  }

  // chests
  for (const c of map.chests) {
    const wx = c.x * TILE_SIZE; const wy = c.y * TILE_SIZE;
    ctx.fillStyle = state.player.flags[c.flag] ? C.dark : C.mid;
    ctx.fillRect(wx + 8, wy + 14, 32, 24);
    ctx.strokeStyle = state.player.flags[c.flag] ? C.dim : C.light; ctx.lineWidth = 2;
    ctx.strokeRect(wx + 8, wy + 14, 32, 24);
    if (!state.player.flags[c.flag]) {
      // Check if this chest contains a book — draw book icon
      const isBook = c.item && ITEMS[c.item]?.category === 'book';
      const isEnch = c.item && ITEMS[c.item]?.category === 'enchanted_book';
      if (isBook || isEnch) {
        ctx.fillStyle = isEnch ? '#cc88ff' : '#88aaff';
        ctx.fillRect(wx + 16, wy + 18, 16, 14);
        ctx.strokeStyle = C.dark; ctx.lineWidth = 1; ctx.strokeRect(wx + 16, wy + 18, 16, 14);
        ctx.fillStyle = C.dark; ctx.font = '8px monospace'; ctx.textAlign = 'center';
        ctx.fillText(isEnch ? 'Z' : 'B', wx + 24, wy + 28);
      } else {
        ctx.fillStyle = C.light; ctx.fillRect(wx + 20, wy + 24, 8, 4);
        ctx.fillStyle = C.white; ctx.fillRect(wx + 22, wy + 21, 4, 7);
      }
    } else {
      ctx.fillStyle = C.dark; ctx.fillRect(wx + 12, wy + 18, 24, 16);
    }
  }

  // NPCs
  for (const npc of map.npcs) {
    if (npc.hideFlag && state.player.flags[npc.hideFlag]) continue;
    drawSprite(ctx, npc.x * TILE_SIZE, npc.y * TILE_SIZE, npc.color, C.black, npc.id === 'maren');
  }

  // player
  if (state.player.invincibility <= 0 || Math.floor(state.frameCount / 4) % 2 === 0) {
    drawSprite(ctx, state.player.x, state.player.y, C.white, C.black);
  }

  // interaction prompt
  if (state.adjacentInteractable && state.mode === GameMode.OVERWORLD) {
    const int = state.adjacentInteractable;
    const bob = Math.round(Math.sin(state.frameCount * 0.12) * 3);
    const wx = int.x * TILE_SIZE; const wy = int.y * TILE_SIZE;

    let label = '[SPACE] - Talk';
    if (int.type === 'CHEST') {
      const item = ITEMS[int.chest?.item];
      if (item?.category === 'book') label = '[SPACE] - Take Book';
      else if (item?.category === 'enchanted_book') label = '[SPACE] - Take Tome';
      else label = '[SPACE] - Open';
    } else if (int.type === 'EXIT') label = '[SPACE] - Travel';
    else if (int.type === 'DOOR') label = `[SPACE] - Enter`;
    else if (int.type === 'NPC' && int.npc.type === 'SHOP') label = '[SPACE] - Shop';
    else if (int.type === 'NPC' && int.npc.type === 'HEAL') label = '[SPACE] - Rest';
    else if (int.type === 'NPC' && int.npc.type === 'BOSS') label = '[SPACE] - ???';

    ctx.font = 'bold 11px monospace';
    const tw = ctx.measureText(label).width;
    const bw = tw + 16; const bh = 20;
    const bx = wx + TILE_SIZE / 2 - bw / 2;
    const by = wy - 28 + bob;

    ctx.fillStyle = C.white; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = C.black; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = C.black; ctx.textAlign = 'center';
    ctx.fillText(label, wx + TILE_SIZE / 2, by + 14);
    ctx.fillStyle = C.white;
    ctx.beginPath();
    ctx.moveTo(wx + TILE_SIZE / 2 - 5, by + bh);
    ctx.lineTo(wx + TILE_SIZE / 2 + 5, by + bh);
    ctx.lineTo(wx + TILE_SIZE / 2,     by + bh + 6);
    ctx.fill();
    ctx.strokeStyle = C.black; ctx.lineWidth = 1; ctx.stroke();
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

  const hpPct = state.player.hp / state.player.maxHp;
  ctx.fillStyle = C.darkest; ctx.fillRect(14, 28, 80, 6);
  ctx.fillStyle = hpPct > 0.5 ? C.silver : hpPct > 0.25 ? C.gray : '#666666';
  ctx.fillRect(14, 28, Math.floor(80 * hpPct), 6);

  ctx.textAlign = 'center'; ctx.font = '11px monospace'; ctx.fillStyle = C.dim;
  ctx.fillText('WASD Move  |  SPACE Interact  |  I Inventory  |  Q Quests  |  ESC Menu', W / 2, H - 6);

  if (state.uiMessage) {
    const tw = ctx.measureText(state.uiMessage).width + 40;
    const mx = (W - tw) / 2;
    pixelBox(ctx, mx, 55, tw, 34, C.black, C.white, 2);
    ctx.fillStyle = C.white; ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center';
    ctx.fillText(state.uiMessage, W / 2, 76);
  }

  // Stacked toast list — for multi-item pickups (boss loot, quest turn-ins with
  // both echoes and an item, Tomes Blessing forging) that need more than one line.
  if (state.messageStack.length > 0) {
    ctx.font = 'bold 13px monospace'; ctx.textAlign = 'center';
    const rowH = 26;
    const topY = 96;
    state.messageStack.forEach((m, i) => {
      const tw2 = ctx.measureText(m.text).width + 36;
      const mx2 = (W - tw2) / 2;
      const my = topY + i * rowH;
      const fade = Math.min(1, m.timer / 30);
      ctx.save();
      ctx.globalAlpha = fade;
      pixelBox(ctx, mx2, my, tw2, 22, C.black, C.white, 2);
      if (m.tier && m.tier !== 'common' && m.tier !== 'uncommon') {
        drawTierText(ctx, m.text, W / 2, my + 15, m.tier, state.frameCount);
      } else {
        ctx.fillStyle = C.white;
        ctx.fillText(m.text, W / 2, my + 15);
      }
      ctx.restore();
    });
  }

  if (state.mode === GameMode.DIALOGUE)  renderDialogue(ctx, state);
  if (state.mode === GameMode.MENU)      renderMenu(ctx, state);
  if (state.mode === GameMode.SHOP)      renderShop(ctx, state);
  if (state.mode === GameMode.INVENTORY) renderInventory(ctx, state);
  if (state.mode === GameMode.QUEST_LOG) renderQuests(ctx, state);

  drawScanlines(ctx);
}

// ── BOOK READ ──────────────────────────────────────────────────────
function renderBookRead(ctx: CanvasRenderingContext2D, state: GameStateData) {
  const bookId = state.bookRead.bookId;
  const book = bookId ? BOOKS[bookId] : null;
  if (!book) return;

  // Parchment-style background with vignette
  ctx.fillStyle = C.bookBg; ctx.fillRect(0, 0, W, H);

  // Decorative border with double lines
  const BX = 40; const BY = 30; const BW = W - 80; const BH = H - 60;
  ctx.fillStyle = '#0a0a18'; ctx.fillRect(BX, BY, BW, BH);
  ctx.strokeStyle = C.bookBorder; ctx.lineWidth = 3; ctx.strokeRect(BX, BY, BW, BH);
  ctx.strokeStyle = '#222244'; ctx.lineWidth = 1;
  ctx.strokeRect(BX + 6, BY + 6, BW - 12, BH - 12);

  // Corner ornaments
  const orn = (x: number, y: number) => {
    ctx.fillStyle = C.bookBorder;
    ctx.fillRect(x - 3, y - 3, 6, 6);
    ctx.fillRect(x - 6, y, 3, 3); ctx.fillRect(x + 3, y, 3, 3);
    ctx.fillRect(x, y - 6, 3, 3); ctx.fillRect(x, y + 3, 3, 3);
  };
  orn(BX, BY); orn(BX + BW, BY); orn(BX, BY + BH); orn(BX + BW, BY + BH);

  // Book type label
  const typeLabels: Record<string, string> = {
    story: '─ STORY ─', note: '─ NOTE ─', poem: '─ POEM ─',
    journal: '─ JOURNAL ─', cipher: '─ CIPHER ─'
  };
  ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#555588';
  ctx.fillText(typeLabels[book.type] ?? '─ ─', W / 2, BY + 20);

  // Title
  ctx.font = 'bold 20px monospace'; ctx.fillStyle = C.light; ctx.textAlign = 'center';
  ctx.fillText(book.title, W / 2, BY + 46);

  // Author (if any)
  if (book.author) {
    ctx.font = '12px monospace'; ctx.fillStyle = '#7777aa';
    ctx.fillText(`by ${book.author}`, W / 2, BY + 64);
  }

  // Horizontal rule
  ctx.strokeStyle = '#333366'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(BX + 30, BY + 76); ctx.lineTo(BX + BW - 30, BY + 76); ctx.stroke();

  // Page text
  const page = state.bookRead.page;
  const totalPages = book.pages.length;
  const pageText = book.pages[page] ?? '';

  ctx.font = '14px monospace'; ctx.fillStyle = '#c8c8e8'; ctx.textAlign = 'left';
  drawWrappedText(ctx, pageText, BX + 36, BY + 100, BW - 72, 22);

  // Page indicator
  const pageLabel = `Page ${page + 1} / ${totalPages}`;
  ctx.font = '12px monospace'; ctx.fillStyle = '#555588'; ctx.textAlign = 'center';
  ctx.fillText(pageLabel, W / 2, BY + BH - 26);

  // Nav hints
  const isLast = page === totalPages - 1;
  ctx.font = '11px monospace'; ctx.fillStyle = '#444477';
  if (page > 0) { ctx.textAlign = 'left';  ctx.fillText('← [A] prev', BX + 14, BY + BH - 8); }
  if (!isLast)  { ctx.textAlign = 'right'; ctx.fillText('next [D] →', BX + BW - 14, BY + BH - 8); }
  else          { ctx.textAlign = 'right'; ctx.fillStyle = C.bookBorder; ctx.fillText('[SPACE / D] close', BX + BW - 14, BY + BH - 8); }
  ctx.textAlign = 'left'; ctx.fillStyle = '#444477';
  ctx.fillText('[X] close', BX + 14, BY + BH - 8);

  // Blinking page-turn prompt
  if (Math.floor(state.frameCount / 22) % 2 === 0 && !isLast) {
    ctx.font = '11px monospace'; ctx.fillStyle = '#666699'; ctx.textAlign = 'center';
    ctx.fillText('[SPACE] turn page', W / 2, BY + BH - 8);
  }
}

// ── ENCHANT SELECT ─────────────────────────────────────────────────
function renderEnchantSelect(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.9)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 140, 110, W - 280, H - 220, '#050510', C.enchant, 3);

  const enchSlot = state.enchantSelect.enchantBookSlot;
  const enchBookId = state.player.inventory[enchSlot];
  const enchItem = ITEMS[enchBookId];
  if (!enchItem || !enchItem.enchantData) return;

  ctx.fillStyle = C.enchant; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center';
  ctx.fillText('ENCHANT AN ITEM', W / 2, 146);

  ctx.fillStyle = C.silver; ctx.font = '12px monospace';
  ctx.fillText(enchItem.name, W / 2, 164);

  // Buff summary
  const ed = enchItem.enchantData;
  const buffs = [
    ed.atk ? `+${ed.atk} ATK` : null,
    ed.def ? `+${ed.def} DEF` : null,
    ed.maxHp ? `+${ed.maxHp} Max HP` : null,
  ].filter(Boolean).join('  ');
  ctx.fillStyle = '#ffcc88'; ctx.font = 'bold 13px monospace';
  ctx.fillText(buffs, W / 2, 182);

  const compat = ed.compatibleCategories.join(' / ');
  ctx.fillStyle = C.dim; ctx.font = '11px monospace';
  ctx.fillText(`Compatible: ${compat}`, W / 2, 198);

  ctx.strokeStyle = '#333355'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(160, 208); ctx.lineTo(W - 160, 208); ctx.stroke();

  ctx.fillStyle = C.light; ctx.font = '13px monospace';
  ctx.fillText('Choose an item to enchant:', W / 2, 226);

  // Compatible items list
  const compatible = state.player.inventory
    .map((id, i) => ({ id, i }))
    .filter(({ id, i }) => {
      const it = ITEMS[id];
      return it && enchItem.enchantData!.compatibleCategories.includes(it.category as any)
        && i !== enchSlot
        && !state.player.enchantedSlots[i];
    });

  ctx.textAlign = 'left';
  compatible.forEach(({ id, i }, vi) => {
    const sel = state.enchantSelect.cursorIndex === vi;
    const item = ITEMS[id];
    const iy = 248 + vi * 32;

    if (sel) {
      ctx.fillStyle = '#1a1a33'; ctx.fillRect(154, iy - 18, W - 308, 28);
      ctx.strokeStyle = C.enchant; ctx.lineWidth = 1; ctx.strokeRect(154, iy - 18, W - 308, 28);
    }

    ctx.fillStyle = sel ? C.white : C.gray;
    ctx.font = sel ? 'bold 14px monospace' : '14px monospace';
    ctx.fillText((sel ? '> ' : '  ') + item.name, 166, iy);

    ctx.fillStyle = sel ? '#ffcc88' : '#886644';
    ctx.font = '11px monospace';
    const eqLabel = state.player.equipment.weapon === id || state.player.equipment.armor === id ? ' [EQ]' : '';
    ctx.fillText(item.desc + eqLabel, 166, iy + 13);
  });

  if (compatible.length === 0) {
    ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '13px monospace';
    ctx.fillText('No compatible items. Acquire a weapon or armor first.', W / 2, 280);
  }

  ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
  ctx.fillText('[UP/DOWN] select  |  [SPACE] enchant  |  [X] cancel', W / 2, H - 130);
}

// ── DIALOGUE ───────────────────────────────────────────────────────
function renderDialogue(ctx: CanvasRenderingContext2D, state: GameStateData) {
  const BY = H - 168;
  pixelBox(ctx, 12, BY, W - 24, 154, '#030303', C.white, 3);

  const node = state.dialogue.currentNode!;
  if (node.color) {
    ctx.fillStyle = node.color; ctx.fillRect(24, BY + 14, 56, 56);
    ctx.strokeStyle = C.dim; ctx.lineWidth = 2; ctx.strokeRect(24, BY + 14, 56, 56);
    ctx.fillStyle = C.black;
    ctx.fillRect(35, BY + 30, 8, 8); ctx.fillRect(55, BY + 30, 8, 8);
  }
  ctx.fillStyle = C.white; ctx.font = 'bold 15px monospace'; ctx.textAlign = 'left';
  ctx.fillText(node.speaker, 94, BY + 32);
  ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(94, BY + 38); ctx.lineTo(W - 28, BY + 38); ctx.stroke();
  ctx.font = '14px monospace'; ctx.fillStyle = C.light;
  const visible = node.text.substring(0, state.dialogue.charIndex);
  drawWrappedText(ctx, visible, 94, BY + 58, W - 130, 22);
  if (state.dialogue.charIndex >= node.text.length && node.options) {
    const optY = BY + 106;
    for (let i = 0; i < node.options.length; i++) {
      const sel = state.dialogue.selectedOption === i;
      ctx.fillStyle = sel ? C.white : C.gray;
      ctx.font = sel ? 'bold 14px monospace' : '14px monospace';
      ctx.fillText((sel ? '> ' : '  ') + node.options[i].label, 94, optY + i * 22);
    }
  }
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
  ctx.fillStyle = '#111111'; ctx.fillRect(0, 0, W, 8); ctx.fillRect(0, H - 8, W, 8);

  ctx.fillStyle = C.white; ctx.font = 'bold 22px monospace'; ctx.textAlign = 'center';
  ctx.fillText(b.enemy.name, W / 2, 40);
  const hpPct = b.enemy.hp / b.enemy.maxHp;
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(260, 50, 248, 12);
  ctx.fillStyle = C.silver;  ctx.fillRect(260, 50, Math.floor(248 * hpPct), 12);
  ctx.strokeStyle = C.dim; ctx.lineWidth = 1; ctx.strokeRect(260, 50, 248, 12);

  ctx.fillStyle = C.dim; ctx.font = '13px monospace'; ctx.textAlign = 'center';
  ctx.fillText('RESONANCE', W / 2, 78);
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < b.resonance ? C.white : '#222222';
    ctx.fillRect(340 + i * 36, 82, 28, 10);
    ctx.strokeStyle = C.dim; ctx.lineWidth = 1; ctx.strokeRect(340 + i * 36, 82, 28, 10);
  }

  drawEnemySprite(ctx, b.enemy.id, W / 2, 160, state.frameCount);

  const BOX = { x: 234, y: 310, w: 300, h: 195 };
  pixelBox(ctx, BOX.x, BOX.y, BOX.w, BOX.h, '#000000', C.white, 3);

  if (b.phase === 'MENU') {
    ctx.fillStyle = C.silver; ctx.font = '13px monospace'; ctx.textAlign = 'center';
    drawWrappedText(ctx, b.actionMsg || b.enemy.flavor, W / 2, 280, 500, 18);
    const opts = ['REMEMBER', 'FORGET', 'ACT', 'ITEMS', 'FLEE'];
    ctx.textAlign = 'left'; ctx.font = 'bold 15px monospace';
    opts.forEach((opt, i) => {
      const sel = b.menuIndex === i;
      const bx = 20 + i * 148; const by = H - 42;
      if (sel) { ctx.fillStyle = '#111111'; ctx.fillRect(bx - 4, by - 18, ctx.measureText('  ' + opt).width + 10, 24); }
      ctx.fillStyle = sel ? C.white : C.dim;
      ctx.fillText((sel ? '> ' : '  ') + opt, bx, by);
    });
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
    const barX = 264; const barY = 400; const barW = 240; const barH = 24;
    ctx.fillStyle = '#111111'; ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = C.silver; ctx.lineWidth = 2; ctx.strokeRect(barX, barY, barW, barH);
    ctx.fillStyle = b.minigame!.type === 'REMEMBER' ? '#555555' : '#444444';
    ctx.fillRect(barX + 96, barY, 48, barH);
    ctx.fillStyle = '#888888'; ctx.fillRect(barX + 108, barY + 4, 24, barH - 8);
    const cx = barX + Math.floor(b.minigame!.cursorX * barW);
    ctx.fillStyle = C.white; ctx.fillRect(cx - 2, barY - 4, 4, barH + 8);
    ctx.fillStyle = C.gray; ctx.font = '11px monospace'; ctx.textAlign = 'center';
    ctx.fillText('ZONE', barX + 120, barY + barH + 16);
  } else if (b.phase === 'DODGE') {
    for (const p of b.projectiles) {
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.floor(p.x - p.w / 2), Math.floor(p.y - p.h / 2), p.w, p.h);
    }
    const flash = state.player.invincibility > 0 && Math.floor(state.frameCount / 4) % 2 === 0;
    if (!flash) {
      ctx.fillStyle = C.white;
      ctx.save(); ctx.translate(Math.floor(b.soulX), Math.floor(b.soulY)); ctx.rotate(Math.PI / 4);
      ctx.fillRect(-6, -6, 12, 12);
      ctx.strokeStyle = C.black; ctx.lineWidth = 1; ctx.strokeRect(-6, -6, 12, 12);
      ctx.restore();
    }
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
  if (id === 'wisp') {
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `rgba(180,180,180,${0.3 + i * 0.12})`;
      ctx.fillRect(cx - 28 + i * 4, cy - 28 + pulse + i * 3, 56 - i * 8, 40 - i * 6);
    }
    ctx.fillStyle = C.black; ctx.fillRect(cx - 10, cy - 14 + Math.floor(pulse), 6, 6);
    ctx.fillRect(cx + 4, cy - 14 + Math.floor(pulse), 6, 6);
  } else if (id === 'crawler') {
    ctx.fillStyle = '#444444'; ctx.fillRect(cx - 30, cy - 12, 60, 28);
    ctx.fillStyle = '#555555';
    ctx.fillRect(cx - 40, cy - 6, 12, 16); ctx.fillRect(cx + 28, cy - 6, 12, 16);
    ctx.fillRect(cx - 20, cy + 16, 8, 12); ctx.fillRect(cx - 6, cy + 16, 8, 12);
    ctx.fillRect(cx + 8, cy + 16, 8, 12);  ctx.fillRect(cx + 22, cy + 16, 8, 12);
    ctx.fillStyle = C.black; ctx.fillRect(cx - 14, cy - 6, 8, 8); ctx.fillRect(cx + 6, cy - 6, 8, 8);
    ctx.strokeStyle = C.dark; ctx.lineWidth = 1; ctx.strokeRect(cx - 30, cy - 12, 60, 28);
  } else if (id === 'specter') {
    const wave = Math.floor(Math.sin(frame * 0.08) * 4);
    ctx.fillStyle = '#b0b0b0'; ctx.fillRect(cx - 20, cy - 36, 40, 52 + wave);
    ctx.fillStyle = '#888888'; ctx.fillRect(cx - 28, cy - 20, 56, 28);
    for (let i = 0; i < 5; i++) {
      const ww = 10; const wx2 = cx - 24 + i * ww;
      const wh = 8 + Math.floor(Math.sin(frame * 0.1 + i) * 4);
      ctx.fillStyle = i % 2 === 0 ? '#999999' : '#777777';
      ctx.fillRect(wx2, cy + 16, ww, wh);
    }
    ctx.fillStyle = C.black; ctx.fillRect(cx - 12, cy - 26, 8, 8); ctx.fillRect(cx + 4, cy - 26, 8, 8);
  } else if (id === 'boss' || id === 'archivist') {
    const flicker = Math.floor(frame * 0.2) % 2;
    ctx.fillStyle = flicker ? '#181818' : '#202020';
    ctx.fillRect(cx - 40, cy - 52, 80, 72);
    ctx.fillStyle = '#111111'; ctx.fillRect(cx - 24, cy - 68, 48, 20);
    ctx.fillStyle = '#2a2a2a';
    for (let i = 0; i < 4; i++) {
      const tx = cx - 50 + i * 32;
      const ty2 = cy + 20 + Math.floor(Math.sin(frame * 0.07 + i) * 8);
      ctx.fillRect(tx, ty2, 6, 20);
    }
    ctx.fillStyle = C.white; ctx.fillRect(cx - 18, cy - 38, 10, 10); ctx.fillRect(cx + 8, cy - 38, 10, 10);
    ctx.fillStyle = C.black; ctx.fillRect(cx - 16, cy - 36, 6, 6); ctx.fillRect(cx + 10, cy - 36, 6, 6);
  } else if (id === 'city_shade' || id === 'street_wraith') {
    // ghost-like silhouette
    const drift = Math.floor(Math.sin(frame * 0.06) * 5);
    ctx.fillStyle = id === 'city_shade' ? '#888888' : '#6b7280';
    ctx.fillRect(cx - 16, cy - 28 + drift, 32, 44);
    ctx.fillStyle = '#444444';
    for (let i = 0; i < 4; i++) {
      const tw2 = 8; const tx2 = cx - 14 + i * 10;
      const th = 6 + Math.floor(Math.sin(frame * 0.1 + i * 1.2) * 3);
      ctx.fillRect(tx2, cy + 16 + drift, tw2, th);
    }
    ctx.fillStyle = C.black; ctx.fillRect(cx - 8, cy - 16 + drift, 6, 6); ctx.fillRect(cx + 3, cy - 16 + drift, 6, 6);
    ctx.strokeStyle = '#222222'; ctx.lineWidth = 1; ctx.strokeRect(cx - 16, cy - 28 + drift, 32, 44);
  } else if (id === 'hollow_guard') {
    // Armored guard silhouette
    ctx.fillStyle = '#9ca3af'; ctx.fillRect(cx - 22, cy - 36, 44, 60);
    ctx.fillStyle = '#6b7280'; ctx.fillRect(cx - 18, cy - 36, 36, 20); // helmet
    ctx.fillRect(cx - 26, cy - 16, 10, 30); ctx.fillRect(cx + 16, cy - 16, 10, 30); // shoulders
    ctx.fillStyle = '#4b5563'; ctx.fillRect(cx - 6, cy, 12, 24); // center plate
    ctx.fillStyle = C.black; ctx.fillRect(cx - 10, cy - 28, 8, 6); ctx.fillRect(cx + 2, cy - 28, 8, 6); // visor
    ctx.strokeStyle = '#374151'; ctx.lineWidth = 1; ctx.strokeRect(cx - 22, cy - 36, 44, 60);
  } else {
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
    'Resume', 'Inventory', 'Quest Log',
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
    const iy = 130 + i * 58;
    if (sel) { ctx.fillStyle = '#111111'; ctx.fillRect(82, iy - 20, W - 164, 52); }

    // Category tag
    ctx.font = '10px monospace';
    ctx.fillStyle = categoryTagColor(id);
    ctx.fillText(categoryTag(id), 94, iy - 6);

    ctx.fillStyle = sel ? C.white : C.gray; ctx.font = 'bold 14px monospace';
    ctx.fillText((sel ? '> ' : '  ') + item.name, 94, iy + 8);

    ctx.fillStyle = sel ? C.silver : C.dim; ctx.font = '13px monospace';
    ctx.fillText(`${item.price} Echoes`, 94, iy + 24);
    if (sel) { ctx.fillStyle = C.light; ctx.fillText(item.desc, 250, iy + 8); }
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
  ctx.fillStyle = 'rgba(0,0,0,0.88)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 150, 76, W - 300, H - 152, C.black, C.white, 3);

  ctx.fillStyle = C.white; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center';
  ctx.fillText('INVENTORY', W / 2, 108);
  ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(166, 116); ctx.lineTo(W - 166, 116); ctx.stroke();

  ctx.textAlign = 'left'; ctx.font = '14px monospace';

  if (state.player.inventory.length === 0) {
    ctx.fillStyle = C.dim; ctx.textAlign = 'center';
    ctx.fillText('-- empty --', W / 2, 200);
  } else {
    const rowH = 26;
    const listTop = 136;
    const maxVisible = 9;
    const total = state.player.inventory.length;
    const maxScroll = Math.max(0, total - maxVisible);
    const scrollOffset = Math.min(maxScroll, Math.max(0, state.inventoryIndex - maxVisible + 1));
    const visibleSlots = state.player.inventory.slice(scrollOffset, scrollOffset + maxVisible);

    visibleSlots.forEach((id, vi) => {
      const i = scrollOffset + vi;
      const sel = state.inventoryIndex === i;
      const equipped = state.player.equipment.weapon === id || state.player.equipment.armor === id;
      const displayName = itemDisplayName(state, i);
      const tag = categoryTag(id);
      const tagColor = categoryTagColor(id);

      // Row background for selected
      if (sel) {
        ctx.fillStyle = '#111111'; ctx.fillRect(162, listTop + vi * rowH - 18, W - 324, 24);
      }

      // Category tag
      ctx.font = '10px monospace'; ctx.fillStyle = tagColor; ctx.textAlign = 'left';
      ctx.fillText(tag, 166, listTop + vi * rowH - 6);

      // Item name — colored by tier (rare and above get a visible tint)
      ctx.font = sel ? 'bold 13px monospace' : '13px monospace';
      const nameX = 166 + ctx.measureText(tag + ' ').width;
      const itemTier = ITEMS[id]?.tier ?? 'common';
      if (itemTier === 'common' || itemTier === 'uncommon') {
        ctx.fillStyle = sel ? C.white : C.gray;
        ctx.fillText(displayName + (equipped ? ' [E]' : ''), nameX, listTop + vi * rowH - 6);
      } else {
        drawTierText(ctx, displayName + (equipped ? ' [E]' : ''), nameX, listTop + vi * rowH - 6, itemTier, state.frameCount);
      }
    });

    if (scrollOffset > 0) {
      ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
      ctx.fillText('▲', W / 2, listTop - 16);
    }
    if (scrollOffset + maxVisible < total) {
      ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
      ctx.fillText('▼', W / 2, listTop + maxVisible * rowH - 4);
    }

    ctx.textAlign = 'left';
    const curId = state.player.inventory[state.inventoryIndex];
    const cur = ITEMS[curId];
    if (cur) {
      // Divider
      const divY = H - 176;
      ctx.strokeStyle = '#222222'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(166, divY); ctx.lineTo(W - 166, divY); ctx.stroke();

      // Enchantment info
      const curEnch = state.player.enchantedSlots[state.inventoryIndex];
      if (curEnch) {
        const enchItem = ITEMS[curEnch];
        ctx.fillStyle = C.enchant; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
        ctx.fillText(`✦ ENCHANTED [Z] — ${enchItem?.enchantData?.atk ? `+${enchItem.enchantData.atk} ATK` : ''}${enchItem?.enchantData?.def ? `+${enchItem.enchantData.def} DEF` : ''}${enchItem?.enchantData?.maxHp ? `+${enchItem.enchantData.maxHp} HP` : ''}`, W / 2, divY + 16);
      }

      // Description
      ctx.fillStyle = C.silver; ctx.font = '12px monospace'; ctx.textAlign = 'center';
      ctx.fillText(cur.desc, W / 2, divY + (curEnch ? 32 : 16));

      // Action hint
      let actionLabel = '[X] close';
      if (cur.category === 'weapon' || cur.category === 'armor') {
        actionLabel = '[SPACE] equip/unequip  |  [X] close';
      } else if (cur.category === 'key') {
        actionLabel = '[X] close';
      } else if (cur.category === 'book') {
        actionLabel = '[SPACE] read  |  [X] close';
      } else if (cur.category === 'enchanted_book') {
        actionLabel = '[SPACE] enchant item  |  [X] close';
      } else {
        actionLabel = '[SPACE] use  |  [X] close';
      }
      ctx.fillStyle = C.dim; ctx.font = '11px monospace'; ctx.textAlign = 'center';
      ctx.fillText(actionLabel, W / 2, divY + (curEnch ? 48 : 32));
    }
  }

  ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '11px monospace';
  ctx.fillText(`${state.player.inventory.length} items  |  [N] memory transit`, W / 2, H - 84);

  // ── Item hover stat panel (right side) ──────────────────────────────
  const hoveredId = state.player.inventory[state.inventoryIndex];
  const hoveredItem = ITEMS[hoveredId];
  if (hoveredItem && state.player.inventory.length > 0) {
    const px = W - 144, py = 76, pw = 136, ph = H - 152;
    pixelBox(ctx, px, py, pw, ph, '#0a0a0a', TIER_COLOR[hoveredItem.tier] ?? C.dim, 2);

    // Tier badge
    ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
    ctx.fillStyle = TIER_COLOR[hoveredItem.tier] ?? C.gray;
    ctx.fillText((TIER_LABEL[hoveredItem.tier] ?? hoveredItem.tier).toUpperCase(), px + pw / 2, py + 16);

    // Item name (wrapped at ~15 chars)
    ctx.strokeStyle = TIER_COLOR[hoveredItem.tier] ?? C.dim; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px + 6, py + 22); ctx.lineTo(px + pw - 6, py + 22); ctx.stroke();
    const nameWords = hoveredItem.name.split(' ');
    let nameLine = ''; let nameY = py + 36;
    ctx.font = 'bold 11px monospace'; ctx.textAlign = 'left';
    for (const w of nameWords) {
      const test = nameLine ? nameLine + ' ' + w : w;
      if (ctx.measureText(test).width > pw - 14 && nameLine) {
        ctx.fillStyle = C.white; ctx.fillText(nameLine, px + 7, nameY); nameY += 14; nameLine = w;
      } else { nameLine = test; }
    }
    if (nameLine) { ctx.fillStyle = C.white; ctx.fillText(nameLine, px + 7, nameY); nameY += 18; }

    // Stats
    const ench = state.player.enchantedSlots[state.inventoryIndex];
    const enchItem = ench ? ITEMS[ench] : null;
    const hasStats = hoveredItem.atk || hoveredItem.def || hoveredItem.maxHp;
    if (hasStats) {
      ctx.strokeStyle = '#222222'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px + 6, nameY - 4); ctx.lineTo(px + pw - 6, nameY - 4); ctx.stroke();
      ctx.font = '11px monospace'; ctx.textAlign = 'left';
      if (hoveredItem.atk)   { ctx.fillStyle = '#ff9977'; ctx.fillText(`ATK  +${hoveredItem.atk}`, px + 7, nameY + 10); nameY += 16; }
      if (hoveredItem.def)   { ctx.fillStyle = '#77aaff'; ctx.fillText(`DEF  +${hoveredItem.def}`, px + 7, nameY + 10); nameY += 16; }
      if (hoveredItem.maxHp) { ctx.fillStyle = '#77dd77'; ctx.fillText(`HP   +${hoveredItem.maxHp}`, px + 7, nameY + 10); nameY += 16; }
      nameY += 6;
    }
    // Enchantment stats
    if (enchItem?.enchantData) {
      ctx.strokeStyle = '#331144'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px + 6, nameY - 2); ctx.lineTo(px + pw - 6, nameY - 2); ctx.stroke();
      ctx.font = 'bold 9px monospace'; ctx.fillStyle = C.enchant; ctx.textAlign = 'center';
      ctx.fillText('✦ ENCHANTED', px + pw / 2, nameY + 10); nameY += 16;
      ctx.font = '11px monospace'; ctx.textAlign = 'left';
      if (enchItem.enchantData.atk)   { ctx.fillStyle = '#dd99ff'; ctx.fillText(`ATK  +${enchItem.enchantData.atk}`, px + 7, nameY + 10); nameY += 16; }
      if (enchItem.enchantData.def)   { ctx.fillStyle = '#dd99ff'; ctx.fillText(`DEF  +${enchItem.enchantData.def}`, px + 7, nameY + 10); nameY += 16; }
      if (enchItem.enchantData.maxHp) { ctx.fillStyle = '#dd99ff'; ctx.fillText(`HP   +${enchItem.enchantData.maxHp}`, px + 7, nameY + 10); nameY += 16; }
      nameY += 6;
    }
    // Description (wrapped)
    ctx.strokeStyle = '#222222'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px + 6, nameY - 2); ctx.lineTo(px + pw - 6, nameY - 2); ctx.stroke();
    ctx.font = '9px monospace'; ctx.fillStyle = C.silver; ctx.textAlign = 'left';
    const descWords = hoveredItem.desc.split(' ');
    let descLine = ''; let descY = nameY + 12;
    for (const dw of descWords) {
      const test = descLine ? descLine + ' ' + dw : dw;
      if (ctx.measureText(test).width > pw - 10 && descLine) {
        ctx.fillText(descLine, px + 7, descY); descY += 12; descLine = dw;
      } else { descLine = test; }
    }
    if (descLine) ctx.fillText(descLine, px + 7, descY);
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

  const active = QUESTS.filter(q => q.isActive(state));
  for (const q of active) {
    const done = q.isDone(state);
    const label = q.label(state);
    const prefix = q.kind === 'ACT' ? '[Act] ' : q.kind === 'SACT' ? '[SACT] ' : '[SQ] ';
    const doneMark = done ? '[DONE] ' : '';
    ctx.font = '13px monospace';
    ctx.fillStyle = done ? C.silver : C.light;
    ctx.fillText(doneMark + prefix, 124, qy);
    const prefixW = ctx.measureText(doneMark + prefix).width;
    // Reward-tier coloring: the label text itself is tinted by the highest
    // possible reward tier for this quest (probabilistic pools use their best case).
    const tier = getHighestTier(q.rewardPool, q.rewardItem);
    if (tier === 'common' || tier === 'uncommon') {
      ctx.fillStyle = done ? C.silver : C.light;
      ctx.fillText(label, 124 + prefixW, qy);
    } else {
      drawTierText(ctx, label, 124 + prefixW, qy, tier, state.frameCount);
    }
    qy += 26;
  }

  if (active.length === 0) {
    ctx.fillStyle = C.dim; ctx.textAlign = 'center';
    ctx.fillText('No active quests.  Speak to villagers to begin.', W / 2, 200);
  }

  ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
  ctx.fillText('[Q] or [X] to close', W / 2, H - 110);
}

// ── TOME CRAFT (Tomes Blessing) ───────────────────────────────────
// ── MEMORY TRANSIT ─────────────────────────────────────────────────
function renderTeleport(ctx: CanvasRenderingContext2D, state: GameStateData) {
  const available = TELEPORT_POINTS.filter(p => state.player.flags['discovered_' + p.id]);
  ctx.fillStyle = 'rgba(0,0,0,0.88)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 224, 100, 320, Math.max(240, 80 + available.length * 40 + 60), '#05050f', '#6666cc', 3);

  ctx.fillStyle = '#9999ee'; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center';
  ctx.fillText('MEMORY TRANSIT', W / 2, 132);
  ctx.fillStyle = '#555577'; ctx.font = '11px monospace';
  ctx.fillText('Teleport to a known location', W / 2, 150);
  ctx.strokeStyle = '#333355'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(244, 160); ctx.lineTo(544, 160); ctx.stroke();

  if (available.length === 0) {
    ctx.fillStyle = '#555577'; ctx.font = '13px monospace'; ctx.textAlign = 'center';
    ctx.fillText('No locations discovered yet.', W / 2, 200);
  } else {
    ctx.textAlign = 'left';
    available.forEach((pt, i) => {
      const sel = state.teleportIndex === i;
      const iy = 182 + i * 40;
      if (sel) {
        ctx.fillStyle = '#111133'; ctx.fillRect(240, iy - 20, 288, 34);
        ctx.strokeStyle = '#6666cc'; ctx.lineWidth = 1; ctx.strokeRect(240, iy - 20, 288, 34);
      }
      ctx.font = sel ? 'bold 14px monospace' : '14px monospace';
      ctx.fillStyle = sel ? '#ccccff' : '#888899';
      ctx.fillText((sel ? '▶  ' : '   ') + pt.name, 252, iy);
      ctx.font = '10px monospace'; ctx.fillStyle = sel ? '#5555aa' : '#333355';
      ctx.fillText(pt.mapId, 252, iy + 13);
    });
  }

  ctx.fillStyle = '#333355'; ctx.textAlign = 'center'; ctx.font = '11px monospace';
  ctx.fillText('[↑↓] select  |  [SPACE] travel  |  [X] cancel', W / 2, H - 110);
}

function renderTomeCraft(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.9)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 120, 90, W - 240, H - 180, '#050510', C.enchant, 3);

  ctx.fillStyle = C.enchant; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center';
  ctx.fillText('TOMES BLESSING', W / 2, 124);
  ctx.fillStyle = C.silver; ctx.font = '12px monospace';
  ctx.fillText('Craft any enchantment from scratch. The Empty Book and Blessing are consumed.', W / 2, 144);

  ctx.strokeStyle = '#333355'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(150, 156); ctx.lineTo(W - 150, 156); ctx.stroke();

  ctx.textAlign = 'left';
  CRAFTABLE_ENCHANTS.forEach((id, i) => {
    const sel = state.tomeCraft.cursorIndex === i;
    const item = ITEMS[id];
    if (!item) return;
    const iy = 184 + i * 34;

    if (sel) {
      ctx.fillStyle = '#1a1a33'; ctx.fillRect(134, iy - 18, W - 268, 30);
      ctx.strokeStyle = C.enchant; ctx.lineWidth = 1; ctx.strokeRect(134, iy - 18, W - 268, 30);
    }

    ctx.font = sel ? 'bold 14px monospace' : '14px monospace';
    const prefix = sel ? '> ' : '  ';
    ctx.fillStyle = sel ? C.white : C.gray;
    ctx.fillText(prefix, 146, iy);
    const prefixW = ctx.measureText(prefix).width;
    drawTierText(ctx, `${item.name}  [${TIER_LABEL[item.tier] ?? item.tier}]`, 146 + prefixW, iy, item.tier, state.frameCount);

    ctx.fillStyle = sel ? '#ffcc88' : '#886644';
    ctx.font = '11px monospace';
    ctx.fillText(item.desc, 146, iy + 13);
  });

  ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
  ctx.fillText('[UP/DOWN] select  |  [SPACE] forge & enchant  |  [X] cancel', W / 2, H - 96);
}
