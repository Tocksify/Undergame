import { GameStateData, GameMode } from './types';
import { MAPS, ITEMS, ENEMIES, SHOPS, BOOKS, TILE_SIZE, TIER_COLOR, TIER_LABEL, CRAFTABLE_ENCHANTS, getHighestTier, TELEPORT_POINTS, STR_ATK_PER_POINT, VIT_HP_PER_POINT, DEF_DEF_PER_POINT, EQUIP_SLOTS, getWeaponAtkBonus, getArmorDefBonus, RECIPES, TIER_WAVE_SEQUENCES } from './constants';
import { ACHIEVEMENTS as ACH_DEFS, getEarnedAchievementIds } from '../achievementStore';
import { getGlobalCodex } from '../codexStore';
import { QUESTS } from './quests';
import { getNpcAppearance, PLAYER_APPEARANCE, SpriteAppearance, drawHair, drawSprite } from './npcAppearance';
import { PATH_ORDER, PATH_DEFS, SKILL_DEFS, HYBRID_BONUSES, getActiveHybrids, canLearnSkill, CHROMA_HUES } from './skillTree';
import { CHALLENGE_TIERS, getUnlockedTierIndex } from '../challengeStore';

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
  bookBorder: '#8899ff',
  enchant:  '#cc88ff',
};

const W = 768; const H = 576;

// Number of quests whose stage has changed since the player last opened the
// Quest Log (accepted, progressed, or completed) — drives the header badge.
function countQuestNotifications(state: GameStateData): number {
  const current = state.player.quests;
  const baseline = state.notifications.questsBaseline;
  const ids = new Set([...Object.keys(current), ...Object.keys(baseline)]);
  let count = 0;
  ids.forEach(id => { if ((current[id] || 0) !== (baseline[id] || 0)) count++; });
  return count;
}

function drawTile(ctx: CanvasRenderingContext2D, tx: number, ty: number, tile: string, frame: number) {
  const x = tx * TILE_SIZE; const y = ty * TILE_SIZE;
  let base = C.dark; let detail = C.darkest; let bright = false;

  if (tile === 'P')      { base = '#2e2e2e'; detail = '#222222'; }
  else if (tile === 'G') { base = '#1e1e1e'; detail = '#161616'; }
  else if (tile === 'CG') { base = '#2f8f3f'; detail = '#256e32'; } // Color's vibrant green grass — the only true color in the Realm
  else if (tile === 'CP') { base = '#c99a5b'; detail = '#a97b3f'; } // Color's warm sandy path
  else if (tile === 'CW') { base = '#3a8fc9'; detail = '#2a6f9f'; } // Color's pond water
  else if (tile === 'CF') { base = '#3fa350'; detail = '#2f8f3f'; } // flower meadow (drawn with colorful dots below)
  else if (tile === 'CH') { base = '#d9b06a'; detail = '#b5854a'; } // Color's warm terracotta cottages
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
  } else if (tile === 'CW') {
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    for (let r = 0; r < 3; r++) ctx.fillRect(x + 4, y + r * 14 + 8, TILE_SIZE - 8, 2);
  } else if (tile === 'CF') {
    const dots = ['#e85d9c', '#f2c14e', '#e0e0f0', '#f28c28'];
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = dots[i % dots.length];
      ctx.fillRect(x + 4 + (i * 7) % (TILE_SIZE - 8), y + 6 + (i * 11) % (TILE_SIZE - 8), 4, 4);
    }
  } else if (tile === 'CH') {
    ctx.fillStyle = '#8a4a2e'; ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
    ctx.fillStyle = '#c9683f'; ctx.fillRect(x, y - 4, TILE_SIZE, 12); // roof overhang
    ctx.fillStyle = '#ffe9a8';
    ctx.fillRect(x + 14, y + 16, 8, 8); ctx.fillRect(x + 28, y + 16, 8, 8);
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
// animated blue/violet moving gradient, keyed off frameCount so it visibly
// shifts over time. Colors are bright enough to read on a black background.
function drawTierText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, tier: string, frame: number) {
  if (tier === 'mythic') {
    const tw = ctx.measureText(text).width;
    const align = ctx.textAlign;
    const startX = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x;
    const shift = (frame * 1.5) % (tw + 60);
    const grad = ctx.createLinearGradient(startX - 30 + shift - (tw + 60), y, startX + 30 + shift, y);
    grad.addColorStop(0,   '#5533cc');
    grad.addColorStop(0.5, '#aabbff');
    grad.addColorStop(1,   '#5533cc');
    ctx.fillStyle = grad;
    ctx.fillText(text, x, y);
    return;
  }
  if (tier === 'chromatic') {
    const tw = ctx.measureText(text).width;
    const align = ctx.textAlign;
    const startX = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x;
    const shift = (frame * 2.5) % (tw + 80);
    const grad = ctx.createLinearGradient(startX - 40 + shift - (tw + 80), y, startX + 40 + shift, y);
    grad.addColorStop(0,    '#ff4488');
    grad.addColorStop(0.25, '#ffaa33');
    grad.addColorStop(0.5,  '#44ffaa');
    grad.addColorStop(0.75, '#33aaff');
    grad.addColorStop(1,    '#ff4488');
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
  if (id.startsWith('ch_')) return '[CH]';
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
  if (id.startsWith('ch_')) return '#ff77ee';
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

  // ── TRUE ENDING — the peaceful death, reached only through Morthus in Color ──
  if (state.mode === GameMode.TRUE_ENDING) {
    // A single warm, living green — the one splash of color permitted in the whole ending.
    const grad = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, 420);
    grad.addColorStop(0, '#1d4d27'); grad.addColorStop(1, '#050505');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    pixelBox(ctx, 90, 150, W - 180, 260, '#0a1a0d', '#7fd68a', 3);
    ctx.fillStyle = '#cdeed2'; ctx.font = 'bold 30px monospace'; ctx.textAlign = 'center';
    ctx.fillText('THE KEEPER RESTS', W / 2, 226);
    ctx.fillStyle = '#a9d9b0'; ctx.font = '16px monospace';
    ctx.fillText('The Void is banished. The Realm is whole.', W / 2, 274);
    ctx.fillText('Mother. Father. It has been so long.', W / 2, 300);
    ctx.fillText('You can finally close your eyes.', W / 2, 326);

    const options = ['Enter Sandbox Mode', 'End Legacy'];
    const optDesc = ['Keep playing, at your own pace.', 'Delete this save and let it rest.'];
    for (let i = 0; i < options.length; i++) {
      const oy = 348 + i * 22;
      const selected = state.trueEndingMenuIndex === i;
      ctx.fillStyle = selected ? '#cdeed2' : '#5f8f68';
      ctx.font = selected ? 'bold 15px monospace' : '15px monospace';
      ctx.fillText(`${selected ? '> ' : '  '}${options[i]}`, W / 2, oy);
    }
    ctx.fillStyle = '#7fa984'; ctx.font = '11px monospace';
    ctx.fillText(optDesc[state.trueEndingMenuIndex], W / 2, 348 + options.length * 22 + 6);
    if (Math.floor(state.frameCount / 25) % 2 === 0) {
      ctx.fillStyle = '#a9d9b0'; ctx.font = '11px monospace';
      ctx.fillText('↑↓ choose   [ SPACE ] confirm', W / 2, 403);
    }
    drawScanlines(ctx); return;
  }

  // ── COLOR_SANDBOX_FADE ──────────────────────────────────────────────
  if (state.mode === GameMode.COLOR_SANDBOX_FADE) {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    // Dim pink glow behind the text
    const glow = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, 280);
    glow.addColorStop(0, 'rgba(180,60,200,0.18)'); glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#dd88ff'; ctx.font = 'bold 20px monospace';
    ctx.fillText('You feel your undead form evolve.', W / 2, H / 2 - 14);
    if (Math.floor(state.frameCount / 28) % 2 === 0) {
      ctx.fillStyle = '#885599'; ctx.font = '12px monospace';
      ctx.fillText('[ SPACE ] continue', W / 2, H / 2 + 30);
    }
    drawScanlines(ctx); return;
  }

  // ── END_LEGACY_SEQ ──────────────────────────────────────────────────
  if (state.mode === GameMode.END_LEGACY_SEQ) {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    const step = state.endLegacyStep;

    if (step === 0) {
      // Message
      ctx.fillStyle = '#999'; ctx.font = '14px monospace';
      const lines = [
        'Your mortal body destroyed,',
        'you feel your corpse disintegrate.',
        '',
        'This undead form,',
        'you feel it start to evolve.',
        '',
        'Endure.',
      ];
      lines.forEach((l, i) => {
        ctx.fillText(l, W / 2, 200 + i * 26);
      });
    } else if (step === 1) {
      // Playtime
      const totalSec = Math.floor(state.playTimeSeconds);
      const hh = Math.floor(totalSec / 3600);
      const mm = Math.floor((totalSec % 3600) / 60);
      const ss = totalSec % 60;
      const timeStr = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
      ctx.fillStyle = '#888'; ctx.font = '13px monospace';
      ctx.fillText('Time played:', W / 2, H / 2 - 28);
      ctx.fillStyle = '#ccbbdd'; ctx.font = 'bold 32px monospace';
      ctx.fillText(timeStr, W / 2, H / 2 + 14);
    } else {
      // Erase confirm
      ctx.fillStyle = '#663333'; ctx.font = '14px monospace';
      ctx.fillText('This save will be erased.', W / 2, H / 2 - 18);
      ctx.fillStyle = '#884444'; ctx.font = '12px monospace';
      ctx.fillText('There is no going back.', W / 2, H / 2 + 10);
    }

    if (Math.floor(state.frameCount / 28) % 2 === 0) {
      ctx.fillStyle = step === 2 ? '#882222' : '#555566';
      ctx.font = '12px monospace';
      ctx.fillText(step === 2 ? '[ SPACE ] erase legacy' : '[ SPACE ] continue', W / 2, H - 60);
    }
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

  // ── STAT ALLOCATION ───────────────────────────────────────────────
  if (state.mode === GameMode.STAT_ALLOCATION) {
    renderStatAllocation(ctx, state); drawScanlines(ctx); return;
  }

  // ── SKILL TREE ────────────────────────────────────────────────────
  if (state.mode === GameMode.SKILL_TREE) {
    renderSkillTree(ctx, state); drawScanlines(ctx); return;
  }

  // ── ITEM CRAFT ────────────────────────────────────────────────────
  if (state.mode === GameMode.ITEM_CRAFT) {
    renderItemCraft(ctx, state); drawScanlines(ctx); return;
  }

  // ── ACHIEVEMENTS ──────────────────────────────────────────────────
  if (state.mode === GameMode.ACHIEVEMENTS) {
    renderAchievements(ctx, state); drawScanlines(ctx); return;
  }

  // ── CHALLENGE SELECT ──────────────────────────────────────────────
  if (state.mode === GameMode.CHALLENGE_SELECT) {
    renderChallengeSelect(ctx, state); drawScanlines(ctx); return;
  }

  // ── CHALLENGE RESULT ──────────────────────────────────────────────
  if (state.mode === GameMode.CHALLENGE_RESULT) {
    renderChallengeResult(ctx, state); drawScanlines(ctx); return;
  }

  // ── EXTRAS ────────────────────────────────────────────────────────
  if (state.mode === GameMode.EXTRAS) {
    renderExtras(ctx, state); drawScanlines(ctx); return;
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
  // Safety clamp — guards against saved player positions that exceed a resized map
  const layoutRows = map.layout.length;
  const layoutCols = map.layout[0]?.length ?? 0;

  for (let gy = startY; gy < endY; gy++) {
    if (gy >= layoutRows) continue;
    for (let gx = startX; gx < endX; gx++) {
      if (gx >= layoutCols) continue;
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
    drawSprite(ctx, npc.x * TILE_SIZE, npc.y * TILE_SIZE, getNpcAppearance(npc.id, npc.color), npc.id === 'maren');
  }

  // player
  if (state.player.invincibility <= 0 || Math.floor(state.frameCount / 4) % 2 === 0) {
    drawSprite(ctx, state.player.x, state.player.y, state.player.appearance ?? PLAYER_APPEARANCE);
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
    else if (int.type === 'NPC' && int.npc.type === 'CHALLENGE') label = '[SPACE] - Challenge Board';

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
  // Single-line HUD: HP/echoes/level, the Q/M/I shortcut hints, and the map
  // name all share one row (plus the thin HP bar right under it) — keep any
  // future additions here inline rather than adding a second text row.
  const HUD_H = 38;
  ctx.fillStyle = 'rgba(8,8,8,0.88)'; ctx.fillRect(0, 0, W, HUD_H);
  ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, HUD_H); ctx.lineTo(W, HUD_H); ctx.stroke();

  const hy = 20;
  ctx.textAlign = 'left'; ctx.font = 'bold 14px monospace';
  ctx.fillStyle = C.white;  ctx.fillText(`HP ${state.player.hp}/${state.player.maxHp}`, 14, hy);
  let sx = 14 + ctx.measureText(`HP ${state.player.hp}/${state.player.maxHp}`).width + 10;
  ctx.fillStyle = C.silver; ctx.fillText(`|`, sx, hy); sx += 10;
  ctx.fillStyle = C.light;  ctx.fillText(`${state.player.echoes} ECHOES`, sx, hy);
  sx += ctx.measureText(`${state.player.echoes} ECHOES`).width + 10;
  ctx.fillStyle = C.silver; ctx.fillText(`|`, sx, hy); sx += 10;
  ctx.fillStyle = C.light;  ctx.fillText(`LV.${state.player.level}`, sx, hy);
  sx += ctx.measureText(`LV.${state.player.level}`).width + 18;

  const hpPct = state.player.hp / state.player.maxHp;
  ctx.fillStyle = C.darkest; ctx.fillRect(14, 24, 80, 6);
  ctx.fillStyle = hpPct > 0.5 ? C.silver : hpPct > 0.25 ? C.gray : '#666666';
  ctx.fillRect(14, 24, Math.floor(80 * hpPct), 6);

  // ── Quest / Stats / Inventory hints, each with a notification badge
  // showing how many pending updates (quest changes, stat points, new items)
  // the player hasn't looked at yet. Rendered inline on the same HUD row as
  // HP/echoes/level (not a separate row) so the shortcuts stay glanceable
  // without eating extra vertical space.
  const questBadge = countQuestNotifications(state);
  const statBadge = state.player.statPoints;
  const itemBadge = Math.max(0, state.player.inventory.length - state.notifications.itemsBaseline);
  const skillBadge = state.player.skillPoints ?? 0;
  const sections: { label: string; key: string; badge: number }[] = [
    { label: 'QUESTS', key: 'Q', badge: questBadge },
    { label: 'STATS', key: 'M', badge: statBadge },
    { label: 'ITEMS', key: 'I', badge: itemBadge },
    { label: 'SKILLS', key: 'K', badge: skillBadge },
  ];
  ctx.textAlign = 'left';
  for (const sec of sections) {
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = sec.badge > 0 ? '#ffcc44' : C.silver;
    const secText = `[${sec.key}] ${sec.label}`;
    ctx.fillText(secText, sx, hy);
    const tw = ctx.measureText(secText).width;
    if (sec.badge > 0) {
      const bx = sx + tw + 10;
      const by = hy - 8;
      const pulse = 0.75 + 0.25 * Math.sin(state.frameCount * 0.12);
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.fillStyle = '#cc3333';
      ctx.beginPath(); ctx.arc(bx, by, 8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = C.white; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.font = 'bold 10px monospace';
      ctx.fillText(String(Math.min(sec.badge, 99)), bx, by + 3);
      ctx.restore();
      ctx.textAlign = 'left';
      sx = bx + 18;
    } else {
      sx += tw + 20;
    }
  }

  ctx.fillStyle = C.gray;   ctx.textAlign = 'right'; ctx.font = 'bold 13px monospace';
  ctx.fillText(map.name.toUpperCase(), W - 14, hy);

  ctx.textAlign = 'center'; ctx.font = '11px monospace'; ctx.fillStyle = C.dim;
  ctx.fillText('WASD Move  |  SPACE Interact  |  I Inventory  |  Q Quests  |  B Bestiary  |  M Stats  |  ESC Menu', W / 2, H - 6);

  if (state.uiMessage) {
    // Wrap notification text so long messages never overflow the canvas
    ctx.font = 'bold 14px monospace';
    const maxNotifInner = W - 80;
    const words = state.uiMessage.split(' ');
    const notifLines: string[] = [];
    let notifCur = '';
    for (const w of words) {
      const test = notifCur ? notifCur + ' ' + w : w;
      if (ctx.measureText(test).width > maxNotifInner && notifCur) { notifLines.push(notifCur); notifCur = w; }
      else notifCur = test;
    }
    if (notifCur) notifLines.push(notifCur);
    const notifLineH = 18;
    const notifBoxH = 14 + notifLines.length * notifLineH;
    const notifBoxW = Math.min(Math.max(...notifLines.map(l => ctx.measureText(l).width)) + 40, W - 40);
    const nmx = (W - notifBoxW) / 2;
    pixelBox(ctx, nmx, 52, notifBoxW, notifBoxH, C.black, C.white, 2);
    ctx.fillStyle = C.white; ctx.textAlign = 'center';
    notifLines.forEach((l, i) => ctx.fillText(l, W / 2, 68 + i * notifLineH));
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

  if (state.mode === GameMode.OVERWORLD) renderMinimap(ctx, state);

  if (state.mode === GameMode.DIALOGUE)  renderDialogue(ctx, state);
  if (state.mode === GameMode.MENU)      renderMenu(ctx, state);
  if (state.mode === GameMode.SHOP)      renderShop(ctx, state);
  if (state.mode === GameMode.INVENTORY) renderInventory(ctx, state);
  if (state.mode === GameMode.QUEST_LOG) renderQuests(ctx, state);
  if (state.mode === GameMode.BESTIARY)  renderBestiary(ctx, state);

  drawScanlines(ctx);
}

// ── MINIMAP (overworld corner overlay) ────────────────────────────
function renderMinimap(ctx: CanvasRenderingContext2D, state: GameStateData) {
  const map = MAPS[state.mapId];
  const MM = 120;
  const MM_X = W - MM - 10;
  const MM_Y = 44;

  // Background frame (includes room for map-name label at bottom)
  ctx.fillStyle = 'rgba(0,0,0,0.82)';
  ctx.fillRect(MM_X - 2, MM_Y - 2, MM + 4, MM + 16);
  ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 1;
  ctx.strokeRect(MM_X - 2, MM_Y - 2, MM + 4, MM + 16);

  const scale = Math.min(MM / map.width, MM / map.height);
  const offX = MM_X + (MM - map.width * scale) / 2;
  const offY = MM_Y + (MM - map.height * scale) / 2;
  const tw = Math.max(1, scale);
  const th = Math.max(1, scale);

  ctx.save();
  ctx.beginPath(); ctx.rect(MM_X, MM_Y, MM, MM); ctx.clip();

  // Tile layer — simplified palette
  for (let ty = 0; ty < map.height; ty++) {
    for (let tx = 0; tx < map.width; tx++) {
      const tile = map.layout[ty]?.[tx];
      let color: string | null = null;
      if      (tile === 'G') color = '#1e1e1e';
      else if (tile === 'CG') color = '#2f8f3f';
      else if (tile === 'CP') color = '#c99a5b';
      else if (tile === 'CW') color = '#3a8fc9';
      else if (tile === 'CF') color = '#3fa350';
      else if (tile === 'CH') color = '#d9b06a';
      else if (tile === 'P') color = '#2e2e2e';
      else if (tile === 'H') color = '#404040';
      else if (tile === 'W') color = '#505050';
      else if (tile === 'T') color = '#141414';
      else if (tile === 'V') color = '#0a0a1e';
      else if (tile === 'M') color = '#282828';
      else if (tile === '>' || tile === '<' || tile === '!' || tile === '@') color = '#888888';
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(Math.floor(offX + tx * scale), Math.floor(offY + ty * scale),
          Math.ceil(tw), Math.ceil(th));
      }
    }
  }

  // Building door markers (blue squares)
  for (const door of (map.doors || [])) {
    ctx.fillStyle = '#334499';
    ctx.fillRect(
      Math.floor(offX + door.x * scale) - 1, Math.floor(offY + door.y * scale) - 1,
      Math.max(2, Math.ceil(tw) + 2), Math.max(2, Math.ceil(th) + 2)
    );
  }

  // NPC quest markers — red ? for main-quest NPCs, orange ? for side-quest NPCs.
  // Bosses and shops get a colored dot but no ?. Completed quests show no marker.
  const MAIN_Q_NPCS = new Set([
    'maren', 'vess', 'warden_kess', 'ember_sentinel', 'boss',
    'archivist', 'echo_warden', 'ring_boss', 'city_gate_guard',
  ]);
  const SIDE_Q_ID_MAP: Record<string, string> = {
    hollow: 'quest_hollow',
    city_warden: 'quest_city',
    shivering_villager: 'quest_frost',
    burned_scholar: 'quest_ash',
  };
  const qMain = state.player.quests['quest_main'] || 0;

  // Shared so a quest-giver hidden inside a building can still surface a
  // marker on the door that leads to them (see below).
  function markerFor(npc: any): { dotColor: string; markerColor: string | null } {
    let dotColor = '#666666';
    let markerColor: string | null = null;
    if (npc.type === 'BOSS') {
      dotColor = '#ff3333';
      // bosses that haven't been defeated still show a red dot, no ?
    } else if (npc.type === 'SHOP') {
      dotColor = '#ffdd44';
    } else if (MAIN_Q_NPCS.has(npc.id)) {
      dotColor = '#ff3333';
      if (qMain < 7) markerColor = '#ff3333'; // red ? until story is done
    } else {
      const sqKey = SIDE_Q_ID_MAP[npc.id] ?? `quest_${npc.id.replace(/^npc_/, '')}`;
      const stage = state.player.quests[sqKey] || 0;
      if (stage < 2) {
        dotColor = '#ff8800';
        markerColor = '#ff8800'; // orange ? for unfinished side quests
      }
    }
    return { dotColor, markerColor };
  }

  function drawMarker(nx: number, ny: number, dotColor: string, markerColor: string | null) {
    ctx.fillStyle = dotColor;
    ctx.fillRect(nx - 1, ny - 1, 3, 3);
    if (markerColor) {
      ctx.save();
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = markerColor;
      ctx.fillText('?', nx + 1, ny - 2);
      ctx.restore();
    }
  }

  for (const npc of (map.npcs || [])) {
    if (npc.hideFlag && state.player.flags[npc.hideFlag]) continue;
    const nx = Math.floor(offX + npc.x * scale);
    const ny = Math.floor(offY + npc.y * scale);
    const { dotColor, markerColor } = markerFor(npc);
    drawMarker(nx, ny, dotColor, markerColor);
  }

  // Quest givers hidden inside buildings don't have their own tile on this
  // map, so surface their "?" on the door that leads to them — otherwise
  // there's no way to tell which building holds a quest from outside.
  for (const door of (map.doors || [])) {
    const inner = MAPS[door.targetMapId];
    if (!inner) continue;
    for (const npc of (inner.npcs || [])) {
      if (npc.hideFlag && state.player.flags[npc.hideFlag]) continue;
      const { markerColor } = markerFor(npc);
      if (!markerColor) continue;
      const dx = Math.floor(offX + door.x * scale);
      const dy = Math.floor(offY + door.y * scale);
      ctx.save();
      ctx.font = 'bold 7px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = markerColor;
      ctx.fillText('?', dx + 1, dy - 2);
      ctx.restore();
      break; // one marker per door is enough
    }
  }

  // Player dot (blinks every 15 frames)
  if (Math.floor(state.frameCount / 15) % 2 === 0) {
    const ptx = Math.floor(offX + (state.player.x / TILE_SIZE) * scale);
    const pty = Math.floor(offY + (state.player.y / TILE_SIZE) * scale);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(ptx - 1, pty - 1, 3, 3);
  }

  ctx.restore();

  // Map name label below minimap
  ctx.fillStyle = '#555555'; ctx.font = '8px monospace'; ctx.textAlign = 'center';
  ctx.fillText(map.name, MM_X + MM / 2, MM_Y + MM + 11);
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
  const rowH = 32;
  const listTop = 248;
  const listBottom = H - 150;
  const maxVisible = Math.max(1, Math.floor((listBottom - listTop) / rowH));
  const maxScroll = Math.max(0, compatible.length - maxVisible);
  const scrollOffset = Math.min(maxScroll, Math.max(0, state.enchantSelect.cursorIndex - maxVisible + 1));

  ctx.save();
  ctx.beginPath(); ctx.rect(140, listTop - 18, W - 280, listBottom - (listTop - 18)); ctx.clip();
  compatible.slice(scrollOffset, scrollOffset + maxVisible).forEach(({ id, i }, vi) => {
    const rowIdx = scrollOffset + vi;
    const sel = state.enchantSelect.cursorIndex === rowIdx;
    const item = ITEMS[id];
    const iy = listTop + vi * rowH;

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
  ctx.restore();

  if (scrollOffset > 0) {
    ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
    ctx.fillText('▲', W / 2, listTop - 8);
  }
  if (scrollOffset + maxVisible < compatible.length) {
    ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
    ctx.fillText('▼', W / 2, listBottom + 6);
  }

  if (compatible.length === 0) {
    ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '13px monospace';
    ctx.fillText('No compatible items. Acquire a weapon or armor first.', W / 2, 280);
  }

  ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
  ctx.fillText('[UP/DOWN] select  |  [SPACE] enchant  |  [X] cancel', W / 2, H - 130);
}

// ── DIALOGUE ───────────────────────────────────────────────────────
function renderDialogue(ctx: CanvasRenderingContext2D, state: GameStateData) {
  const BOX_H = 210;
  const BY = H - BOX_H - 14;
  pixelBox(ctx, 12, BY, W - 24, BOX_H, '#030303', C.white, 3);

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
  const textEndY = drawWrappedText(ctx, visible, 94, BY + 58, W - 130, 22);
  if (state.dialogue.charIndex >= node.text.length && node.options) {
    // Place options at least 12px below where the text ended, never overlapping
    const optY = Math.max(textEndY + 12, BY + 112);
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
      ctx.fillText('[SPACE]', W - 28, BY + BOX_H - 12);
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

  // ── Active status effects ──────────────────────────────────────────
  const statusEffects: { label: string; color: string }[] = [];
  if (b.poisonDmg > 0 && b.poisonTurns > 0) statusEffects.push({ label: `☠ POISON ×${b.poisonTurns}`, color: '#55ee55' });
  if (b.burnDmg > 0) statusEffects.push({ label: `♨ BURN ${b.burnDmg}`, color: '#ff7722' });
  if (b.flags.frozen)   statusEffects.push({ label: '❄ FROZEN',   color: '#88ddff' });
  if (b.flags.silenced) statusEffects.push({ label: '◎ SILENCED', color: '#aa88ff' });
  if (statusEffects.length) {
    ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
    const totalW = statusEffects.length * 120;
    const startX = W / 2 - totalW / 2 + 60;
    statusEffects.forEach((ef, i) => {
      ctx.fillStyle = ef.color;
      ctx.fillText(ef.label, startX + i * 120, 236);
    });
  }

  // ── Passive skill cooldown display (top-right) ──────────────────────────
  {
    const _pSkills = state.player.learnedSkills ?? [];
    const _cdDefs = [
      { id: 'void_drain',    label: 'V.Drain'  },
      { id: 'void_strike',   label: 'V.Strike' },
      { id: 'void_herald',   label: 'V.Herald' },
      { id: 'chroma_strike', label: 'C.Strike' },
      { id: 'echo_armor',    label: 'E.Armor'  },
      { id: 'chroma_veil',   label: 'C.Veil'   },
    ].filter(cs => _pSkills.includes(cs.id));
    if (_cdDefs.length > 0) {
      ctx.font = 'bold 9px monospace'; ctx.textAlign = 'right';
      let cdY = 36;
      ctx.fillStyle = '#332244';
      ctx.fillText('PASSIVES', W - 6, cdY); cdY += 13;
      for (const cs of _cdDefs) {
        const cd = b.skillCooldowns?.[cs.id] ?? 0;
        ctx.fillStyle = cd === 0 ? '#33bb55' : '#cc7722';
        ctx.fillText(`${cs.label}: ${cd === 0 ? 'READY' : `${cd}t`}`, W - 6, cdY);
        cdY += 12;
      }
    }
  }

  const BOX = { x: 234, y: 310, w: 300, h: 195 };
  pixelBox(ctx, BOX.x, BOX.y, BOX.w, BOX.h, '#000000', C.white, 3);

  if (b.phase === 'MENU') {
    ctx.fillStyle = C.silver; ctx.font = '13px monospace'; ctx.textAlign = 'center';
    drawWrappedText(ctx, b.actionMsg || b.enemy.flavor, W / 2, 280, BOX.w - 20, 18);
    const opts = ['REMEMBER', 'FORGET', 'ACT', 'ITEMS', 'FLEE'];
    ctx.textAlign = 'left'; ctx.font = 'bold 15px monospace';
    opts.forEach((opt, i) => {
      const sel = b.menuIndex === i;
      const greyed = opt === 'FLEE' && !!b.flags.fleeAttempted;
      const bx = 20 + i * 148; const by = H - 42;
      if (sel && !greyed) { ctx.fillStyle = '#111111'; ctx.fillRect(bx - 4, by - 18, ctx.measureText('  ' + opt).width + 10, 24); }
      ctx.fillStyle = greyed ? '#2d2d2d' : (sel ? C.white : C.dim);
      ctx.fillText((sel && !greyed ? '> ' : '  ') + opt, bx, by);
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
    ctx.fillStyle = C.light; ctx.font = '14px monospace'; ctx.textAlign = 'center';
    drawWrappedText(ctx, b.actionMsg || '...', W / 2, 370, BOX.w - 20, 20);
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
  pixelBox(ctx, 274, 130, 220, 280, C.black, C.white, 3);
  ctx.fillStyle = C.silver; ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center';
  ctx.fillText('MENU', W / 2, 156);
  ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(290, 164); ctx.lineTo(474, 164); ctx.stroke();
  const opts = [
    'Resume', 'Inventory', 'Quest Log',
    state.meta.isGuest ? 'Save (login req.)' : 'Save Game',
    state.meta.isGuest ? 'Quit to Title' : 'Save & Quit',
    'Exit to Title',
    'Bestiary [B]',
  ];
  ctx.textAlign = 'left'; ctx.font = '14px monospace';
  opts.forEach((opt, i) => {
    const sel = state.menuIndex === i;
    ctx.fillStyle = sel ? C.white : C.dim;
    ctx.fillText((sel ? '> ' : '  ') + opt, 300, 192 + i * 28);
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

  const rowH = 58;
  const listTop = 130;
  const listBottom = H - 92; // leave room for the message + footer hint below
  const maxVisible = Math.max(1, Math.floor((listBottom - listTop) / rowH));
  const maxScroll = Math.max(0, shopItems.length - maxVisible);
  const scrollOffset = Math.min(maxScroll, Math.max(0, state.shopIndex - maxVisible + 1));

  ctx.save();
  ctx.beginPath(); ctx.rect(60, listTop - 30, W - 120, listBottom - (listTop - 30)); ctx.clip();
  shopItems.slice(scrollOffset, scrollOffset + maxVisible).forEach((id, vi) => {
    const i = scrollOffset + vi;
    const item = ITEMS[id]; const sel = state.shopIndex === i;
    const iy = listTop + vi * rowH;
    if (sel) { ctx.fillStyle = '#111111'; ctx.fillRect(82, iy - 20, W - 164, 52); }

    // Category tag
    ctx.font = '10px monospace';
    ctx.fillStyle = categoryTagColor(id);
    ctx.fillText(categoryTag(id), 94, iy - 6);

    ctx.fillStyle = sel ? C.white : C.gray; ctx.font = 'bold 14px monospace';
    ctx.fillText((sel ? '> ' : '  ') + item.name, 94, iy + 8);

    ctx.fillStyle = sel ? C.silver : C.dim; ctx.font = '13px monospace';
    ctx.fillText(`${item.price} Echoes`, 94, iy + 24);
    if (sel) {
      ctx.fillStyle = C.light; ctx.font = '13px monospace'; ctx.textAlign = 'left';
      drawWrappedText(ctx, item.desc, 250, iy + 8, W - 90 - 250, 17);
    }
  });
  ctx.restore();

  if (scrollOffset > 0) {
    ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
    ctx.fillText('▲', W / 2, listTop - 16);
  }
  if (scrollOffset + maxVisible < shopItems.length) {
    ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
    ctx.fillText('▼', W / 2, listTop + maxVisible * rowH - 4);
  }

  if (state.uiMessage) {
    ctx.fillStyle = C.white; ctx.font = '14px monospace'; ctx.textAlign = 'center';
    ctx.fillText(state.uiMessage, W / 2, H - 75);
  }
  ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
  ctx.fillText('[UP/DOWN] browse  |  [SPACE] buy  |  [X] exit', W / 2, H - 58);
}

// ── INVENTORY ──────────────────────────────────────────────────────
function renderInventory(ctx: CanvasRenderingContext2D, state: GameStateData) {
  if (state.inventoryPage === 0) { renderEquipmentPanel(ctx, state); return; }
  renderItemsList(ctx, state);
}

// ── Page 0: Equipment paperdoll panel ──────────────────────────────
function renderEquipmentPanel(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.93)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 8, 16, W - 16, H - 32, C.black, C.white, 3);

  // ── Tab bar ──
  ctx.font = 'bold 13px monospace'; ctx.textAlign = 'left';
  // Equipment tab (active)
  ctx.fillStyle = C.white;
  ctx.fillText('[ EQUIPMENT ]', 22, 42);
  ctx.fillStyle = '#3a3a3a';
  ctx.fillText('[ ALL ITEMS ]', 170, 42);
  ctx.fillStyle = C.dim; ctx.font = '10px monospace'; ctx.textAlign = 'right';
  ctx.fillText('[Q / Tab] switch', W - 18, 42);
  ctx.strokeStyle = '#282828'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(12, 50); ctx.lineTo(W - 12, 50); ctx.stroke();

  // ── Layout constants ──
  const LEFT_X   = 14;
  const DIV_X    = 360;
  const RIGHT_CX = 564;           // centre of the right panel
  const LIST_TOP = 60;
  const ROW_H    = 30;

  // ── Character silhouette ──
  const CY = 76;                  // top of silhouette
  const CX = RIGHT_CX;

  type Rect = [number, number, number, number];
  // Silhouette rects (in draw order, back to front)
  const S_HEAD:      Rect = [CX - 24, CY,       48,  44];
  const S_NECK:      Rect = [CX - 10, CY + 44,  20,  12];
  const S_SHOULDER:  Rect = [CX - 52, CY + 56, 104,  24];
  const S_L_ARM:     Rect = [CX - 68, CY + 56,  16,  68];
  const S_R_ARM:     Rect = [CX + 52, CY + 56,  16,  68];
  const S_TORSO:     Rect = [CX - 30, CY + 80,  60,  70];
  const S_L_HAND:    Rect = [CX - 72, CY + 124, 20,  22];
  const S_R_HAND:    Rect = [CX + 52, CY + 124, 20,  22];
  const S_BELT:      Rect = [CX - 30, CY + 150, 60,  16];
  const S_L_LEG:     Rect = [CX - 28, CY + 166, 22,  80];
  const S_R_LEG:     Rect = [CX + 6,  CY + 166, 22,  80];
  const S_L_FOOT:    Rect = [CX - 32, CY + 246, 28,  18];
  const S_R_FOOT:    Rect = [CX + 4,  CY + 246, 28,  18];

  // Slot → body rects to highlight
  const SLOT_RECTS: Record<string, Rect[]> = {
    helmet:   [S_HEAD],
    necklace: [S_NECK],
    armor:    [S_TORSO],
    cloak:    [S_TORSO, S_L_ARM, S_R_ARM],
    gloves:   [S_L_HAND, S_R_HAND],
    belt:     [S_BELT],
    pants:    [S_L_LEG, S_R_LEG],
    boots:    [S_L_FOOT, S_R_FOOT],
    weapon:   [S_R_ARM, S_R_HAND],
    offhand:  [S_L_ARM, S_L_HAND],
    ring1:    [S_R_HAND],
    ring2:    [S_L_HAND],
    trinket:  [S_BELT],
  };
  // Body part centre for connector lines
  const SLOT_CENTERS: Record<string, [number, number]> = {
    helmet:   [CX,      CY + 22],
    necklace: [CX,      CY + 50],
    armor:    [CX,      CY + 115],
    cloak:    [CX + 12, CY + 115],
    gloves:   [CX + 62, CY + 135],
    belt:     [CX,      CY + 158],
    pants:    [CX,      CY + 206],
    boots:    [CX,      CY + 255],
    weapon:   [CX + 62, CY + 90],
    offhand:  [CX - 62, CY + 90],
    ring1:    [CX + 68, CY + 148],
    ring2:    [CX - 68, CY + 148],
    trinket:  [CX,      CY + 170],
  };

  // Determine which slot is "active" for highlighting
  const activeCursor = state.equipPanelCursor;
  const activeSlotId = EQUIP_SLOTS[activeCursor]?.id ?? '';
  const inMenu       = state.equipSlotMenu !== null;

  // Draw full silhouette in base colour
  const allRects: Rect[] = [
    S_HEAD, S_NECK, S_SHOULDER, S_L_ARM, S_R_ARM,
    S_TORSO, S_L_HAND, S_R_HAND, S_BELT,
    S_L_LEG, S_R_LEG, S_L_FOOT, S_R_FOOT,
  ];
  const eq = state.player.equipment as Record<string, string | null>;

  ctx.fillStyle = '#151515';
  for (const [rx, ry, rw, rh] of allRects) ctx.fillRect(rx, ry, rw, rh);

  // Tint body parts that have items equipped
  for (const slot of EQUIP_SLOTS) {
    if (!eq[slot.id]) continue;
    const rects = SLOT_RECTS[slot.id];
    if (!rects) continue;
    ctx.fillStyle = slot.id === activeSlotId ? '#224466' : '#282830';
    for (const [rx, ry, rw, rh] of rects) ctx.fillRect(rx, ry, rw, rh);
  }

  // Highlight selected-slot body parts
  if (!inMenu && SLOT_RECTS[activeSlotId]) {
    for (const [rx, ry, rw, rh] of SLOT_RECTS[activeSlotId]) {
      ctx.fillStyle = '#1e3a55'; ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeStyle = '#5599cc'; ctx.lineWidth = 1;
      ctx.strokeRect(rx - 1, ry - 1, rw + 2, rh + 2);
    }
  }

  // Small slot abbreviation labels on the silhouette
  const ABBREV: Record<string, string> = {
    helmet:'H', necklace:'N', armor:'C', cloak:'CL',
    gloves:'G', belt:'BL', pants:'P', boots:'BT',
    weapon:'W', offhand:'OH', ring1:'R1', ring2:'R2', trinket:'T',
  };
  ctx.font = '7px monospace'; ctx.textAlign = 'center';
  for (const slot of EQUIP_SLOTS) {
    const ctr = SLOT_CENTERS[slot.id];
    if (!ctr) continue;
    const hasItem = !!eq[slot.id];
    ctx.fillStyle = hasItem ? '#4477aa' : '#252535';
    ctx.fillText(ABBREV[slot.id] ?? slot.id, ctr[0], ctr[1] + 3);
  }

  // ── Slot list (left panel) ──
  for (let i = 0; i < EQUIP_SLOTS.length; i++) {
    const slot    = EQUIP_SLOTS[i];
    const rowY    = LIST_TOP + i * ROW_H;
    const isSel   = activeCursor === i && !inMenu;
    const itemId  = eq[slot.id];
    const item    = itemId ? ITEMS[itemId] : null;

    if (isSel) {
      ctx.fillStyle = '#0c1c2c';
      ctx.fillRect(LEFT_X, rowY + 1, DIV_X - LEFT_X - 4, ROW_H - 2);
    }

    // Cursor
    ctx.font = isSel ? 'bold 12px monospace' : '12px monospace';
    ctx.fillStyle = isSel ? '#5599cc' : C.dim; ctx.textAlign = 'left';
    ctx.fillText(isSel ? '►' : ' ', LEFT_X + 2, rowY + 19);

    // Slot label
    ctx.fillStyle = isSel ? C.white : '#606070';
    ctx.fillText(slot.label, LEFT_X + 16, rowY + 19);

    // Item name or (empty)
    if (item) {
      ctx.font = isSel ? 'bold 11px monospace' : '11px monospace';
      const tc = TIER_COLOR[item.tier] ?? C.gray;
      ctx.fillStyle = (item.tier === 'common' || item.tier === 'uncommon') ? (isSel ? C.white : C.silver) : tc;
      let nameStr = item.name;
      ctx.textAlign = 'left';
      while (ctx.measureText(nameStr).width > 162 && nameStr.length > 3) nameStr = nameStr.slice(0, -2) + '…';
      ctx.fillText(nameStr, LEFT_X + 92, rowY + 19);
    } else {
      ctx.font = '10px monospace'; ctx.fillStyle = '#252535'; ctx.textAlign = 'left';
      ctx.fillText('—', LEFT_X + 92, rowY + 19);
    }

    // Arrow + dotted connector to silhouette (selected row only)
    if (isSel) {
      ctx.fillStyle = '#3366aa'; ctx.font = '11px monospace'; ctx.textAlign = 'left';
      ctx.fillText('→', DIV_X - 14, rowY + 19);
      const ctr = SLOT_CENTERS[slot.id];
      if (ctr) {
        ctx.save();
        ctx.setLineDash([3, 5]);
        ctx.strokeStyle = '#1e3355'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(DIV_X + 2, rowY + 13);
        ctx.lineTo(ctr[0], ctr[1]);
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = '#4488bb';
        ctx.beginPath(); ctx.arc(ctr[0], ctr[1], 3, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  // Vertical divider
  ctx.strokeStyle = '#1a2030'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(DIV_X, 54); ctx.lineTo(DIV_X, H - 34); ctx.stroke();

  // ── Right panel: action/pick menu OR info below silhouette ──
  const RPANEL_X = DIV_X + 8;

  if (inMenu && state.equipSlotMenu) {
    const menu   = state.equipSlotMenu;
    const mslot  = EQUIP_SLOTS.find(s => s.id === menu.slotId);
    if (mslot) {
      const eqId   = eq[mslot.id];
      const eqItem = eqId ? ITEMS[eqId] : null;
      // Slot title
      ctx.font = 'bold 13px monospace'; ctx.fillStyle = '#5599cc'; ctx.textAlign = 'left';
      ctx.fillText(mslot.label, RPANEL_X, 70);
      if (eqItem) {
        ctx.font = '11px monospace';
        ctx.fillStyle = TIER_COLOR[eqItem.tier] ?? C.silver;
        ctx.fillText(eqItem.name, RPANEL_X, 86);
      }
      ctx.strokeStyle = '#1a2433'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(RPANEL_X, 92); ctx.lineTo(W - 14, 92); ctx.stroke();

      if (menu.mode === 'actions' && eqItem) {
        // Item stats block
        let sy = 106;
        ctx.font = '11px monospace'; ctx.textAlign = 'left';
        if (eqItem.atk)   { ctx.fillStyle = '#ff9977'; ctx.fillText(`ATK  +${eqItem.atk}`,   RPANEL_X, sy); sy += 15; }
        if (eqItem.def)   { ctx.fillStyle = '#77aaff'; ctx.fillText(`DEF  +${eqItem.def}`,   RPANEL_X, sy); sy += 15; }
        if (eqItem.maxHp) { ctx.fillStyle = '#77dd77'; ctx.fillText(`HP   +${eqItem.maxHp}`, RPANEL_X, sy); sy += 15; }
        if (eqItem.block) { ctx.fillStyle = '#aaccff'; ctx.fillText(`BLK  ${eqItem.block}/hit`, RPANEL_X, sy); sy += 15; }
        // Enchantment
        const ei = state.player.inventory.indexOf(eqId!);
        if (ei >= 0 && state.player.enchantedSlots[ei]) {
          const enc = ITEMS[state.player.enchantedSlots[ei]!];
          if (enc?.enchantData) {
            ctx.fillStyle = C.enchant; ctx.font = 'bold 9px monospace';
            ctx.fillText('✦ ENCHANTED', RPANEL_X, sy + 4); sy += 16;
            ctx.font = '11px monospace';
            if (enc.enchantData.atk)   { ctx.fillStyle = '#dd99ff'; ctx.fillText(`ATK  +${enc.enchantData.atk}`,   RPANEL_X, sy); sy += 15; }
            if (enc.enchantData.def)   { ctx.fillStyle = '#dd99ff'; ctx.fillText(`DEF  +${enc.enchantData.def}`,   RPANEL_X, sy); sy += 15; }
            if (enc.enchantData.maxHp) { ctx.fillStyle = '#dd99ff'; ctx.fillText(`HP   +${enc.enchantData.maxHp}`, RPANEL_X, sy); sy += 15; }
          }
        }
        // Description (wrapped)
        sy += 4;
        ctx.strokeStyle = '#1a1a2a'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(RPANEL_X, sy); ctx.lineTo(W - 14, sy); ctx.stroke();
        sy += 12;
        ctx.font = '10px monospace'; ctx.fillStyle = C.silver; ctx.textAlign = 'left';
        const dws = eqItem.desc.split(' '); let dl = ''; let dy = sy;
        for (const dw of dws) {
          const t = dl ? dl + ' ' + dw : dw;
          if (ctx.measureText(t).width > W - RPANEL_X - 18 && dl) { ctx.fillText(dl, RPANEL_X, dy); dy += 13; dl = dw; } else dl = t;
        }
        if (dl) ctx.fillText(dl, RPANEL_X, dy); dy += 18;

        // Action menu
        sy = Math.max(dy + 4, 280);
        ctx.strokeStyle = '#1a2433'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(RPANEL_X, sy - 6); ctx.lineTo(W - 14, sy - 6); ctx.stroke();
        const sellLabel = eqItem.price > 0 ? `Sell  (+${Math.floor(eqItem.price / 2)} ◈)` : 'Sell  (priceless)';
        const acts = ['Unequip', sellLabel, 'Back'];
        for (let ai = 0; ai < acts.length; ai++) {
          const asel = menu.menuIndex === ai;
          ctx.font = asel ? 'bold 13px monospace' : '13px monospace';
          ctx.fillStyle = asel
            ? (ai === 1 && eqItem.price === 0 ? '#555' : C.white)
            : '#404050';
          ctx.textAlign = 'left';
          ctx.fillText((asel ? '► ' : '  ') + acts[ai], RPANEL_X, sy + ai * 26 + 16);
        }
        ctx.font = '10px monospace'; ctx.fillStyle = C.dim; ctx.textAlign = 'center';
        ctx.fillText('[↑↓] select   [SPACE/Z] confirm   [X] cancel', (RPANEL_X + W) / 2, H - 38);

      } else if (menu.mode === 'pick') {
        // Item picker
        const compatible = state.player.inventory.filter(iid => {
          const it = ITEMS[iid];
          return it && mslot.categories.includes(it.category as any);
        });
        const hasEq = !!eqId;
        const totalOpts = compatible.length + (hasEq ? 1 : 0);
        const maxVis = 12;
        const scrollOff = Math.max(0, menu.menuIndex - maxVis + 1);

        ctx.font = '11px monospace'; ctx.fillStyle = C.silver; ctx.textAlign = 'left';
        ctx.fillText(hasEq ? 'Replace or unequip:' : 'Select item to equip:', RPANEL_X, 108);

        let ly = 126;
        if (hasEq) {
          const usel = menu.menuIndex === 0;
          ctx.font = usel ? 'bold 12px monospace' : '12px monospace';
          ctx.fillStyle = usel ? '#cc7777' : '#553333';
          ctx.fillText((usel ? '► ' : '  ') + `Unequip ${eqItem?.name ?? eqId}`, RPANEL_X, ly);
          ly += 22;
        }
        for (let pi = scrollOff; pi < Math.min(scrollOff + maxVis, compatible.length); pi++) {
          const optIdx = hasEq ? pi + 1 : pi;
          const psel = menu.menuIndex === optIdx;
          const cid = compatible[pi];
          const cit = ITEMS[cid];
          if (!cit) continue;
          ctx.font = psel ? 'bold 11px monospace' : '11px monospace';
          ctx.fillStyle = psel ? C.white : C.silver; ctx.textAlign = 'left';
          ctx.fillText((psel ? '► ' : '  ') + cit.name, RPANEL_X, ly);
          const sp: string[] = [];
          if (cit.atk)   sp.push(`+${cit.atk}ATK`);
          if (cit.def)   sp.push(`+${cit.def}DEF`);
          if (cit.maxHp) sp.push(`+${cit.maxHp}HP`);
          if (cit.block) sp.push(`${cit.block}BLK`);
          if (sp.length) {
            ctx.font = '10px monospace'; ctx.fillStyle = psel ? '#88aacc' : '#334455';
            ctx.textAlign = 'right'; ctx.fillText(sp.join(' '), W - 16, ly);
          }
          ctx.textAlign = 'left'; ly += 22;
        }
        if (totalOpts > maxVis) {
          ctx.font = '10px monospace'; ctx.fillStyle = C.dim; ctx.textAlign = 'center';
          if (scrollOff > 0) ctx.fillText('▲', (RPANEL_X + W) / 2, 118);
          if (scrollOff + maxVis < compatible.length) ctx.fillText('▼', (RPANEL_X + W) / 2, ly + 4);
        }
        ctx.font = '10px monospace'; ctx.fillStyle = C.dim; ctx.textAlign = 'center';
        ctx.fillText('[↑↓] select   [SPACE/Z] equip   [X] cancel', (RPANEL_X + W) / 2, H - 38);
      }
    }
  } else {
    // Below silhouette: show selected slot info + total stats
    const selSlot   = EQUIP_SLOTS[activeCursor];
    const selItemId = selSlot ? eq[selSlot.id] : null;
    const selItem   = selItemId ? ITEMS[selItemId] : null;
    const INFOY = CY + 274;

    ctx.strokeStyle = '#1a2433'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(RPANEL_X, INFOY); ctx.lineTo(W - 14, INFOY); ctx.stroke();

    ctx.font = 'bold 11px monospace'; ctx.textAlign = 'left'; ctx.fillStyle = '#5599cc';
    ctx.fillText(selSlot?.label ?? '', RPANEL_X, INFOY + 14);
    if (selItem) {
      ctx.font = '11px monospace'; ctx.fillStyle = TIER_COLOR[selItem.tier] ?? C.silver;
      ctx.fillText(selItem.name, RPANEL_X + 80, INFOY + 14);
      let sy2 = INFOY + 28;
      ctx.font = '11px monospace'; ctx.textAlign = 'left';
      if (selItem.atk)   { ctx.fillStyle = '#ff9977'; ctx.fillText(`ATK +${selItem.atk}`,   RPANEL_X, sy2); sy2 += 14; }
      if (selItem.def)   { ctx.fillStyle = '#77aaff'; ctx.fillText(`DEF +${selItem.def}`,   RPANEL_X, sy2); sy2 += 14; }
      if (selItem.maxHp) { ctx.fillStyle = '#77dd77'; ctx.fillText(`HP  +${selItem.maxHp}`, RPANEL_X, sy2); sy2 += 14; }
      if (selItem.block) { ctx.fillStyle = '#aaccff'; ctx.fillText(`BLK ${selItem.block}/hit`, RPANEL_X, sy2); }
    } else if (selSlot) {
      ctx.font = '10px monospace'; ctx.fillStyle = '#333344';
      ctx.fillText('(empty)', RPANEL_X + 80, INFOY + 14);
    }

    // Total stat summary
    const totalAtk = getWeaponAtkBonus(state);
    const totalDef = getArmorDefBonus(state);
    const atkStr = `ATK ${totalAtk > 0 ? '+' + totalAtk : 0}`;
    const defStr = `DEF ${totalDef > 0 ? '+' + totalDef : 0}`;
    const hpStr  = `HP ${state.player.hp}/${state.player.maxHp}`;
    ctx.font = 'bold 10px monospace'; ctx.textAlign = 'right';
    ctx.fillStyle = '#cc7755'; ctx.fillText(atkStr, W - 80, INFOY + 14);
    ctx.fillStyle = '#5577cc'; ctx.fillText(defStr, W - 80, INFOY + 28);
    ctx.fillStyle = '#55aa55'; ctx.fillText(hpStr,  W - 80, INFOY + 42);

    ctx.font = '10px monospace'; ctx.fillStyle = C.dim; ctx.textAlign = 'center';
    ctx.fillText('[↑↓] browse   [SPACE/Z] manage slot   [Q/Tab] all items   [X] close', W / 2, H - 38);
    if (selSlot && !selItemId) {
      ctx.fillStyle = '#334455';
      ctx.fillText('[SPACE] to equip a ' + selSlot.label.toLowerCase() + ' from inventory', W / 2, H - 24);
    }
  }
}

// ── Page 1: All Items list ──────────────────────────────────────────
function renderItemsList(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.88)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 150, 54, W - 300, H - 108, C.black, C.white, 3);

  // Tab bar
  ctx.font = 'bold 13px monospace'; ctx.textAlign = 'left';
  ctx.fillStyle = '#3a3a3a'; ctx.fillText('[ EQUIPMENT ]', 164, 44);
  ctx.fillStyle = C.white;  ctx.fillText('[ ALL ITEMS ]', 312, 44);
  ctx.fillStyle = C.dim; ctx.font = '10px monospace'; ctx.textAlign = 'right';
  ctx.fillText('[Q / Tab] switch', W - 164, 44);
  ctx.strokeStyle = '#282828'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(156, 50); ctx.lineTo(W - 156, 50); ctx.stroke();

  ctx.fillStyle = C.white; ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center';
  ctx.fillText('ALL ITEMS', W / 2, 76);
  ctx.strokeStyle = C.dim; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(166, 84); ctx.lineTo(W - 166, 84); ctx.stroke();

  ctx.textAlign = 'left'; ctx.font = '14px monospace';

  const eq = state.player.equipment as Record<string, string | null>;
  const equippedIds = new Set(Object.values(eq).filter(Boolean) as string[]);

  if (state.player.inventory.length === 0) {
    ctx.fillStyle = C.dim; ctx.textAlign = 'center';
    ctx.fillText('-- empty --', W / 2, 180);
  } else {
    const rowH = 26;
    const listTop = 102;
    const maxVisible = 10;
    const total = state.player.inventory.length;
    const maxScroll = Math.max(0, total - maxVisible);
    const scrollOffset = Math.min(maxScroll, Math.max(0, state.inventoryIndex - maxVisible + 1));
    const visibleSlots = state.player.inventory.slice(scrollOffset, scrollOffset + maxVisible);

    visibleSlots.forEach((id, vi) => {
      const i = scrollOffset + vi;
      const sel = state.inventoryIndex === i;
      const isEquipped = equippedIds.has(id);
      const isOffhand  = state.player.equipment.offhand === id;
      const displayName = itemDisplayName(state, i);
      const tag = categoryTag(id);
      const tagColor = categoryTagColor(id);

      if (sel) {
        ctx.fillStyle = '#111111'; ctx.fillRect(162, listTop + vi * rowH - 18, W - 324, 24);
      }
      ctx.font = '10px monospace'; ctx.fillStyle = tagColor; ctx.textAlign = 'left';
      ctx.fillText(tag, 166, listTop + vi * rowH - 6);

      ctx.font = sel ? 'bold 13px monospace' : '13px monospace';
      const nameX = 166 + ctx.measureText(tag + ' ').width;
      const itemTier = ITEMS[id]?.tier ?? 'common';
      const suffix = isEquipped ? ' [E]' : isOffhand ? ' [OH]' : '';
      if (itemTier === 'common' || itemTier === 'uncommon') {
        ctx.fillStyle = sel ? C.white : C.gray;
        ctx.fillText(displayName + suffix, nameX, listTop + vi * rowH - 6);
      } else {
        drawTierText(ctx, displayName + suffix, nameX, listTop + vi * rowH - 6, itemTier, state.frameCount);
      }
    });

    if (scrollOffset > 0) {
      ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
      ctx.fillText('▲', W / 2, listTop - 14);
    }
    if (scrollOffset + maxVisible < total) {
      ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
      ctx.fillText('▼', W / 2, listTop + maxVisible * rowH - 4);
    }

    ctx.textAlign = 'left';
    const curId = state.player.inventory[state.inventoryIndex];
    const cur = ITEMS[curId];
    if (cur) {
      const divY = H - 148;
      ctx.strokeStyle = '#222222'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(166, divY); ctx.lineTo(W - 166, divY); ctx.stroke();

      const curEnch = state.player.enchantedSlots[state.inventoryIndex];
      if (curEnch) {
        const enchItem = ITEMS[curEnch];
        ctx.fillStyle = C.enchant; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
        ctx.fillText(`✦ ENCHANTED — ${enchItem?.enchantData?.atk ? `+${enchItem.enchantData.atk} ATK` : ''}${enchItem?.enchantData?.def ? `+${enchItem.enchantData.def} DEF` : ''}${enchItem?.enchantData?.maxHp ? `+${enchItem.enchantData.maxHp} HP` : ''}`, W / 2, divY + 16);
      }

      const equipCats = new Set(['weapon','armor','shield','helmet','gloves','pants','boots','cloak','necklace','ring','belt','trinket']);
      let actionLabel = '[X] close';
      if (cur.category === 'weapon') {
        const mainEq = state.player.equipment.weapon === curId;
        const ohEq   = state.player.equipment.offhand === curId;
        if (mainEq)      actionLabel = '[SPACE] unequip (main)  |  [X] close';
        else if (ohEq)   actionLabel = '[SPACE] unequip (offhand)  |  [X] close';
        else if (state.player.equipment.weapon) actionLabel = '[SPACE] equip offhand  |  [X] close';
        else             actionLabel = '[SPACE] equip  |  [X] close';
      } else if (cur.category === 'shield') {
        actionLabel = '[SPACE] equip to offhand  |  [X] close';
      } else if (equipCats.has(cur.category)) {
        const isEq = equippedIds.has(curId);
        actionLabel = isEq ? '[SPACE] unequip  |  [X] close' : '[SPACE] equip  |  [X] close';
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
      ctx.fillText(actionLabel, W / 2, divY + (curEnch ? 36 : 22));
    }
  }

  ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '11px monospace';
  ctx.fillText(`${state.player.inventory.length} items  |  [N] memory transit`, W / 2, H - 62);

  // ── Item hover stat panel ──
  const hoveredId   = state.player.inventory[state.inventoryIndex];
  const hoveredItem = ITEMS[hoveredId];
  if (hoveredItem && state.player.inventory.length > 0) {
    const px = W - 144, py = 54, pw = 136, ph = H - 108;
    pixelBox(ctx, px, py, pw, ph, '#0a0a0a', TIER_COLOR[hoveredItem.tier] ?? C.dim, 2);

    ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center';
    ctx.fillStyle = TIER_COLOR[hoveredItem.tier] ?? C.gray;
    ctx.fillText((TIER_LABEL[hoveredItem.tier] ?? hoveredItem.tier).toUpperCase(), px + pw / 2, py + 16);

    ctx.strokeStyle = TIER_COLOR[hoveredItem.tier] ?? C.dim; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px + 6, py + 22); ctx.lineTo(px + pw - 6, py + 22); ctx.stroke();
    const nameWords = hoveredItem.name.split(' ');
    let nameLine = ''; let nameY = py + 36;
    ctx.font = 'bold 11px monospace'; ctx.textAlign = 'left';
    for (const ww of nameWords) {
      const test = nameLine ? nameLine + ' ' + ww : ww;
      if (ctx.measureText(test).width > pw - 14 && nameLine) {
        ctx.fillStyle = C.white; ctx.fillText(nameLine, px + 7, nameY); nameY += 14; nameLine = ww;
      } else { nameLine = test; }
    }
    if (nameLine) { ctx.fillStyle = C.white; ctx.fillText(nameLine, px + 7, nameY); nameY += 18; }

    const ench2 = state.player.enchantedSlots[state.inventoryIndex];
    const enchItem2 = ench2 ? ITEMS[ench2] : null;
    const hasStats = hoveredItem.atk || hoveredItem.def || hoveredItem.maxHp;
    if (hasStats) {
      ctx.strokeStyle = '#222222'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px + 6, nameY - 4); ctx.lineTo(px + pw - 6, nameY - 4); ctx.stroke();
      ctx.font = '11px monospace'; ctx.textAlign = 'left';
      if (hoveredItem.atk)   { ctx.fillStyle = '#ff9977'; ctx.fillText(`ATK  +${hoveredItem.atk}`,   px + 7, nameY + 10); nameY += 16; }
      if (hoveredItem.def)   { ctx.fillStyle = '#77aaff'; ctx.fillText(`DEF  +${hoveredItem.def}`,   px + 7, nameY + 10); nameY += 16; }
      if (hoveredItem.maxHp) { ctx.fillStyle = '#77dd77'; ctx.fillText(`HP   +${hoveredItem.maxHp}`, px + 7, nameY + 10); nameY += 16; }
      if (hoveredItem.block) { ctx.fillStyle = '#aaccff'; ctx.fillText(`BLK  ${hoveredItem.block}/hit`, px + 7, nameY + 10); nameY += 16; }
      nameY += 6;
    }
    if (enchItem2?.enchantData) {
      ctx.strokeStyle = '#331144'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px + 6, nameY - 2); ctx.lineTo(px + pw - 6, nameY - 2); ctx.stroke();
      ctx.font = 'bold 9px monospace'; ctx.fillStyle = C.enchant; ctx.textAlign = 'center';
      ctx.fillText('✦ ENCHANTED', px + pw / 2, nameY + 10); nameY += 16;
      ctx.font = '11px monospace'; ctx.textAlign = 'left';
      if (enchItem2.enchantData.atk)   { ctx.fillStyle = '#dd99ff'; ctx.fillText(`ATK  +${enchItem2.enchantData.atk}`,   px + 7, nameY + 10); nameY += 16; }
      if (enchItem2.enchantData.def)   { ctx.fillStyle = '#dd99ff'; ctx.fillText(`DEF  +${enchItem2.enchantData.def}`,   px + 7, nameY + 10); nameY += 16; }
      if (enchItem2.enchantData.maxHp) { ctx.fillStyle = '#dd99ff'; ctx.fillText(`HP   +${enchItem2.enchantData.maxHp}`, px + 7, nameY + 10); nameY += 16; }
      nameY += 6;
    }
    ctx.strokeStyle = '#222222'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px + 6, nameY - 2); ctx.lineTo(px + pw - 6, nameY - 2); ctx.stroke();
    ctx.font = '10px monospace'; ctx.fillStyle = C.silver; ctx.textAlign = 'left';
    const descWords2 = hoveredItem.desc.split(' ');
    let descLine2 = ''; let descY2 = nameY + 12;
    for (const dw2 of descWords2) {
      const t2 = descLine2 ? descLine2 + ' ' + dw2 : dw2;
      if (ctx.measureText(t2).width > pw - 10 && descLine2) {
        ctx.fillText(descLine2, px + 7, descY2); descY2 += 14; descLine2 = dw2;
      } else { descLine2 = t2; }
    }
    if (descLine2) ctx.fillText(descLine2, px + 7, descY2);
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
  const listTop = 150;
  const rowH = 42;  // tall enough for 2 wrapped lines
  const listBottom = H - 130;
  const maxVisible = Math.max(1, Math.floor((listBottom - listTop) / rowH));

  const active = QUESTS.filter(q => q.isActive(state));
  const maxScroll = Math.max(0, active.length - maxVisible);
  const scrollOffset = Math.min(maxScroll, state.questLogScroll);
  const visible = active.slice(scrollOffset, scrollOffset + maxVisible);

  ctx.save();
  ctx.beginPath(); ctx.rect(100, listTop - 20, W - 200, listBottom - (listTop - 20)); ctx.clip();
  let qy = listTop;
  for (const q of visible) {
    const done = q.isDone(state);
    const label = q.label(state);
    const prefix = q.kind === 'ACT' ? '[Act] ' : q.kind === 'SACT' ? '[SACT] ' : '[SQ] ';
    const doneMark = done ? '[DONE] ' : '';
    ctx.font = '13px monospace';
    ctx.fillStyle = done ? C.silver : C.light;
    ctx.fillText(doneMark + prefix, 124, qy);
    const prefixW = ctx.measureText(doneMark + prefix).width;

    // Reward-tier coloring: label tinted by the highest possible reward tier.
    const tier = getHighestTier(q.rewardPool, q.rewardItem);
    const flatColor = done ? C.silver : (tier === 'common' || tier === 'uncommon') ? C.light : (TIER_COLOR[tier] ?? C.light);

    // Wrap the label so long quest names don't run off the modal edge.
    const labelX = 124 + prefixW;
    const labelMaxW = W - 100 - labelX - 14;
    const words = label.split(' ');
    let line = ''; const lines: string[] = [];
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > labelMaxW && line) { lines.push(line); line = w; }
      else { line = test; }
    }
    if (line) lines.push(line);

    lines.forEach((ln, li) => {
      const ly = qy + li * 18;
      if (tier !== 'common' && tier !== 'uncommon' && !done) {
        drawTierText(ctx, ln, labelX, ly, tier, state.frameCount);
      } else {
        ctx.fillStyle = flatColor;
        ctx.fillText(ln, labelX, ly);
      }
    });

    qy += rowH;
  }
  ctx.restore();

  if (scrollOffset > 0) {
    ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
    ctx.fillText('▲', W / 2, listTop - 8);
  }
  if (scrollOffset + maxVisible < active.length) {
    ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
    ctx.fillText('▼', W / 2, listBottom + 4);
  }

  if (active.length === 0) {
    ctx.fillStyle = C.dim; ctx.textAlign = 'center';
    ctx.fillText('No active quests.  Speak to villagers to begin.', W / 2, 200);
  }

  ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
  ctx.fillText('[↑↓] scroll  |  [Q] or [X] to close', W / 2, H - 110);
}

// ── TOME CRAFT (Tomes Blessing) ───────────────────────────────────
// ── MEMORY TRANSIT ─────────────────────────────────────────────────
function renderTeleport(ctx: CanvasRenderingContext2D, state: GameStateData) {
  const available = TELEPORT_POINTS.filter(p => state.player.flags['discovered_' + p.id]);
  const rowH = 40;
  const listTop = 196; // enough room above first item for the 20px selection highlight
  const maxVisible = 7; // caps the box so it always fits on screen, even with every location discovered
  const boxH = Math.min(H - 140, Math.max(260, 96 + Math.min(available.length, maxVisible) * rowH + 60));

  ctx.fillStyle = 'rgba(0,0,0,0.88)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 224, 100, 320, boxH, '#05050f', '#6666cc', 3);

  ctx.fillStyle = '#9999ee'; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center';
  ctx.fillText('MEMORY TRANSIT', W / 2, 132);
  ctx.fillStyle = '#555577'; ctx.font = '11px monospace';
  ctx.fillText('Teleport to a known location', W / 2, 150);
  ctx.strokeStyle = '#333355'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(244, 160); ctx.lineTo(544, 160); ctx.stroke();

  if (available.length === 0) {
    ctx.fillStyle = '#555577'; ctx.font = '13px monospace'; ctx.textAlign = 'center';
    ctx.fillText('No locations discovered yet.', W / 2, 210);
  } else {
    const maxScroll = Math.max(0, available.length - maxVisible);
    const scrollOffset = Math.min(maxScroll, Math.max(0, state.teleportIndex - maxVisible + 1));
    const visible = available.slice(scrollOffset, scrollOffset + maxVisible);

    ctx.save();
    const clipH = Math.min(available.length, maxVisible) * rowH + 8;
    // clip starts 22px above listTop so the selection highlight on the first row is never cut off
    ctx.beginPath(); ctx.rect(224, listTop - 22, 320, clipH + 22); ctx.clip();
    ctx.textAlign = 'left';
    visible.forEach((pt, vi) => {
      const i = scrollOffset + vi;
      const sel = state.teleportIndex === i;
      const iy = listTop + vi * rowH;
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
    ctx.restore();

    if (scrollOffset > 0) {
      ctx.fillStyle = '#555577'; ctx.textAlign = 'center'; ctx.font = '12px monospace';
      ctx.fillText('▲', W / 2, listTop - 14);
    }
    if (scrollOffset + maxVisible < available.length) {
      ctx.fillStyle = '#555577'; ctx.textAlign = 'center'; ctx.font = '12px monospace';
      ctx.fillText('▼', W / 2, listTop + maxVisible * rowH - 6);
    }
  }

  ctx.fillStyle = '#333355'; ctx.textAlign = 'center'; ctx.font = '11px monospace';
  ctx.fillText('[↑↓/WS] select  |  [SPACE] travel  |  [X] cancel', W / 2, 100 + boxH - 20);
}

// ── STAT ALLOCATION (M key) ──────────────────────────────────────────
function renderStatAllocation(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.88)'; ctx.fillRect(0, 0, W, H);
  const boxW = 380, boxH = 300;
  const bx = (W - boxW) / 2, by = (H - boxH) / 2;
  pixelBox(ctx, bx, by, boxW, boxH, '#0a0a12', '#88cc99', 3);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#aaffcc'; ctx.font = 'bold 16px monospace';
  ctx.fillText('SPEND STAT POINTS', W / 2, by + 32);
  ctx.fillStyle = '#556655'; ctx.font = '11px monospace';
  ctx.fillText(`Level ${state.player.level}  —  XP ${state.player.xp}/${state.player.xpToNext}`, W / 2, by + 50);
  ctx.strokeStyle = '#334433'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(bx + 20, by + 62); ctx.lineTo(bx + boxW - 20, by + 62); ctx.stroke();

  ctx.fillStyle = '#ffcc44'; ctx.font = 'bold 14px monospace';
  ctx.fillText(`${state.player.statPoints} points available`, W / 2, by + 86);

  const rows: { key: 'str' | 'vit' | 'def'; label: string; effect: string }[] = [
    { key: 'str', label: 'STR', effect: `+${STR_ATK_PER_POINT} ATK / point` },
    { key: 'vit', label: 'VIT', effect: `+${VIT_HP_PER_POINT} Max HP / point` },
    { key: 'def', label: 'DEF', effect: `+${DEF_DEF_PER_POINT} DEF / point` },
  ];

  ctx.textAlign = 'left';
  rows.forEach((row, i) => {
    const sel = state.statAllocIndex === i;
    const ry = by + 118 + i * 46;
    if (sel) {
      ctx.fillStyle = '#132213'; ctx.fillRect(bx + 20, ry - 22, boxW - 40, 38);
      ctx.strokeStyle = '#88cc99'; ctx.lineWidth = 1; ctx.strokeRect(bx + 20, ry - 22, boxW - 40, 38);
    }
    ctx.font = sel ? 'bold 15px monospace' : '15px monospace';
    ctx.fillStyle = sel ? '#eeffee' : '#889988';
    ctx.fillText((sel ? '▶ ' : '  ') + `${row.label}  ${state.player.baseStats[row.key]}`, bx + 34, ry);
    ctx.font = '11px monospace';
    ctx.fillStyle = sel ? '#88cc99' : '#556655';
    ctx.fillText(row.effect, bx + 34, ry + 16);
  });

  ctx.fillStyle = '#556655'; ctx.textAlign = 'center'; ctx.font = '11px monospace';
  ctx.fillText('[↑↓] select  |  [SPACE] allocate point  |  [M]/[ESC] close', W / 2, by + boxH - 18);
}

// ── SKILL TREE ─────────────────────────────────────────────────────────────
function renderSkillTree(ctx: CanvasRenderingContext2D, state: GameStateData) {
  const learned = state.player.learnedSkills ?? [];
  const sp = state.player.skillPoints ?? 0;
  const activeHybrids = getActiveHybrids(learned);
  const { pathIdx, skillIdx } = state.skillTreeCursor;

  const NODE_W = 160; const NODE_H = 52;
  const NODE_TIER_Y = [82, 148, 214, 280]; // top Y of each tier
  const COL_CENTERS = [96, 288, 480, 672];

  // ── Background ────────────────────────────────────────────────────
  ctx.fillStyle = '#03030a'; ctx.fillRect(0, 0, W, H);

  // Faint per-path radial glows
  PATH_ORDER.forEach((pathId, pi) => {
    const path = PATH_DEFS[pathId];
    const cx = COL_CENTERS[pi];
    const alpha = pi === pathIdx ? 0.10 : 0.04;
    const grd = ctx.createRadialGradient(cx, 200, 0, cx, 200, 190);
    grd.addColorStop(0, path.color + Math.round(alpha * 255).toString(16).padStart(2, '0'));
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
  });

  // ── Top bar ───────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillRect(0, 0, W, 60);
  ctx.strokeStyle = '#1a1a26'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, 60); ctx.lineTo(W, 60); ctx.stroke();

  ctx.textAlign = 'center'; ctx.font = 'bold 20px monospace'; ctx.fillStyle = '#dde8dd';
  ctx.fillText('SKILL TREE', W / 2, 22);
  ctx.font = '11px monospace'; ctx.fillStyle = '#2a3a2a';
  ctx.fillText('[K / ESC]  Close     [← →]  Path     [↑ ↓]  Skill     [Z]  Learn', W / 2, 37);
  ctx.fillStyle = '#1a2a1a';
  ctx.fillText('All skills are passive — they activate automatically during battle based on your timing', W / 2, 52);

  ctx.textAlign = 'right'; ctx.font = 'bold 15px monospace';
  ctx.fillStyle = sp > 0 ? '#ffdd44' : '#2a2a2a';
  ctx.fillText(`${sp} Skill Pt${sp !== 1 ? 's' : ''}`, W - 14, 24);
  ctx.font = '10px monospace'; ctx.fillStyle = sp > 0 ? '#887722' : '#1a1a1a';
  ctx.fillText('available', W - 14, 38);
  ctx.textAlign = 'left';

  // ── Column separators ─────────────────────────────────────────────
  for (let pi = 1; pi < 4; pi++) {
    const sx = COL_CENTERS[pi] - 96;
    ctx.strokeStyle = '#0f0f18'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(sx, 52); ctx.lineTo(sx, 340); ctx.stroke();
  }

  // ── Path columns ──────────────────────────────────────────────────
  PATH_ORDER.forEach((pathId, pi) => {
    const path = PATH_DEFS[pathId];
    const cx = COL_CENTERS[pi];
    const nx = cx - NODE_W / 2;
    const isSelPath = pi === pathIdx;

    // Path name header
    ctx.textAlign = 'center'; ctx.font = isSelPath ? 'bold 12px monospace' : '11px monospace';
    ctx.fillStyle = isSelPath ? path.color : path.dimColor;
    ctx.fillText(path.name, cx, 68);

    // Skill nodes
    path.skills.forEach((skillId, si) => {
      const def = SKILL_DEFS[skillId];
      const ny = NODE_TIER_Y[si];
      const isLearned = learned.includes(skillId);
      const isCursor = isSelPath && si === skillIdx;
      const prereqMet = !def.prereq || learned.includes(def.prereq);
      const isAvail = prereqMet && !isLearned && sp > 0;

      // Node fill
      if (isLearned) {
        ctx.fillStyle = path.dimColor + '99';
        ctx.fillRect(nx, ny, NODE_W, NODE_H);
      } else if (isCursor) {
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.fillRect(nx, ny, NODE_W, NODE_H);
      }

      // Node border
      const bCol = isLearned ? path.color : isCursor ? '#aaaaaa' : prereqMet ? '#2e2e3a' : '#141420';
      ctx.strokeStyle = bCol; ctx.lineWidth = isLearned || isCursor ? 2 : 1;
      ctx.strokeRect(nx + 0.5, ny + 0.5, NODE_W - 1, NODE_H - 1);

      // Chromatic rainbow top-edge shimmer
      if (pathId === 'chroma' && (isCursor || isLearned)) {
        const segW = NODE_W / CHROMA_HUES.length;
        const offset = (state.frameCount * 2) % (CHROMA_HUES.length * segW);
        CHROMA_HUES.forEach((hue, hi) => {
          const gx = nx + ((hi * segW - offset + NODE_W * 2) % NODE_W);
          ctx.strokeStyle = hue; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(gx, ny); ctx.lineTo(Math.min(gx + segW, nx + NODE_W), ny); ctx.stroke();
        });
      }

      // Tier badge
      const tierStr = si === 3 ? '★' : `T${si + 1}`;
      ctx.font = '9px monospace'; ctx.textAlign = 'left';
      ctx.fillStyle = isLearned ? path.color : prereqMet ? '#333344' : '#1a1a26';
      ctx.fillText(tierStr, nx + 4, ny + 11);

      // Skill name
      ctx.textAlign = 'center'; ctx.font = (isCursor || isLearned) ? 'bold 12px monospace' : '11px monospace';
      ctx.fillStyle = isLearned ? '#ffffff' : isCursor && prereqMet ? '#dddddd' : isCursor ? '#888888' : prereqMet ? '#666677' : '#282833';
      const nameFit = def.name.length > 17 ? def.name.slice(0, 15) + '…' : def.name;
      ctx.fillText(nameFit, cx, ny + 22);

      // Short desc snippet
      ctx.font = '9px monospace';
      ctx.fillStyle = isLearned ? '#888899' : isCursor && prereqMet ? '#777788' : '#242430';
      const snip = def.shortDesc.length > 29 ? def.shortDesc.slice(0, 27) + '…' : def.shortDesc;
      ctx.fillText(snip, cx, ny + 36);

      // Bottom status line
      ctx.font = '9px monospace';
      if (isLearned) {
        ctx.fillStyle = path.color; ctx.fillText('✓ learned', cx, ny + 48);
      } else if (!prereqMet) {
        ctx.fillStyle = '#252530';
        const preName = SKILL_DEFS[def.prereq!]?.name ?? '';
        ctx.fillText(`need: ${preName.slice(0, 14)}`, cx, ny + 48);
      } else if (isAvail) {
        const pulse = 0.6 + 0.4 * Math.sin(state.frameCount * 0.09);
        ctx.globalAlpha = pulse; ctx.fillStyle = '#ffcc44';
        ctx.fillText('[Z] learn — 1 pt', cx, ny + 48);
        ctx.globalAlpha = 1;
      } else if (sp === 0 && !isLearned) {
        ctx.fillStyle = '#2a2a38'; ctx.fillText('no skill points', cx, ny + 48);
      }

      // Connector line to next node
      if (si < 3) {
        const nextNy = NODE_TIER_Y[si + 1];
        const connColor = learned.includes(path.skills[si + 1]) ? path.color + '88' : '#111120';
        ctx.strokeStyle = connColor; ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(cx, ny + NODE_H); ctx.lineTo(cx, nextNy); ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  });

  // ── Hybrid Bonds row ──────────────────────────────────────────────
  const hybridLabelY = 342;
  ctx.textAlign = 'center'; ctx.font = '10px monospace'; ctx.fillStyle = '#1e1e30';
  ctx.fillText('HYBRID BONDS — invest 2 skills in two paths to awaken', W / 2, hybridLabelY);

  const BADGE_W = 118; const BADGE_H = 28;
  const totalBW = HYBRID_BONUSES.length * BADGE_W + (HYBRID_BONUSES.length - 1) * 8;
  const bStartX = (W - totalBW) / 2;
  const badgesY = hybridLabelY + 6;

  HYBRID_BONUSES.forEach((h, hi) => {
    const bx = bStartX + hi * (BADGE_W + 8);
    const isActive = activeHybrids.includes(h.id);

    ctx.fillStyle = isActive ? h.color + '18' : '#07070e';
    ctx.fillRect(bx, badgesY, BADGE_W, BADGE_H);
    ctx.strokeStyle = isActive ? h.color : '#181825'; ctx.lineWidth = 1;
    ctx.strokeRect(bx + 0.5, badgesY + 0.5, BADGE_W - 1, BADGE_H - 1);

    ctx.textAlign = 'center'; ctx.font = isActive ? 'bold 9px monospace' : '9px monospace';
    ctx.fillStyle = isActive ? h.color : '#252530';
    ctx.fillText(h.name, bx + BADGE_W / 2, badgesY + 12);
    ctx.font = '8px monospace'; ctx.fillStyle = isActive ? '#555566' : '#141420';
    const reqLabel = `${h.paths[0]}≥2 + ${h.paths[1]}≥2`;
    ctx.fillText(reqLabel, bx + BADGE_W / 2, badgesY + 23);
  });

  // ── Detail panel ──────────────────────────────────────────────────
  const detailY = badgesY + BADGE_H + 8;
  pixelBox(ctx, 12, detailY, W - 24, H - detailY - 10, '#03030a',
    PATH_DEFS[PATH_ORDER[pathIdx]].color + '55', 1);

  const selPath = PATH_DEFS[PATH_ORDER[pathIdx]];
  const selSkillId = selPath.skills[skillIdx];
  const selDef = SKILL_DEFS[selSkillId];
  const selLearned = learned.includes(selSkillId);
  const selPrereqMet = !selDef.prereq || learned.includes(selDef.prereq);
  const selAvail = selPrereqMet && !selLearned && sp > 0;

  ctx.textAlign = 'left'; ctx.font = 'bold 14px monospace';
  ctx.fillStyle = selLearned ? '#ffffff' : selAvail ? selPath.color : '#666677';
  ctx.fillText(selDef.name, 24, detailY + 20);

  // Status tag after name
  const nameW = ctx.measureText(selDef.name).width;
  ctx.font = '10px monospace';
  if (selLearned) {
    ctx.fillStyle = selPath.color; ctx.fillText('  ✓', 24 + nameW, detailY + 20);
  } else if (selAvail) {
    const pulse2 = 0.6 + 0.4 * Math.sin(state.frameCount * 0.09);
    ctx.globalAlpha = pulse2; ctx.fillStyle = '#ffcc44';
    ctx.fillText('  [Z] learn (1 skill point)', 24 + nameW, detailY + 20);
    ctx.globalAlpha = 1;
  } else if (!selPrereqMet) {
    ctx.fillStyle = '#444455';
    ctx.fillText(`  — learn ${SKILL_DEFS[selDef.prereq!]?.name ?? ''} first`, 24 + nameW, detailY + 20);
  } else if (sp === 0 && !selLearned) {
    ctx.fillStyle = '#333344'; ctx.fillText('  — no skill points', 24 + nameW, detailY + 20);
  }

  // Full description word-wrapped
  ctx.font = '11px monospace'; ctx.fillStyle = '#888899';
  const maxTextW = W - 56;
  const descWords = selDef.fullDesc.split(' ');
  let line2 = ''; let lineY2 = detailY + 38;
  for (const w2 of descWords) {
    const test2 = line2 ? line2 + ' ' + w2 : w2;
    if (ctx.measureText(test2).width > maxTextW && line2) {
      ctx.fillText(line2, 24, lineY2); lineY2 += 15; line2 = w2;
      if (lineY2 > H - 20) break; // don't overflow canvas
    } else { line2 = test2; }
  }
  if (line2 && lineY2 <= H - 20) ctx.fillText(line2, 24, lineY2);
}

function renderTomeCraft(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.9)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 120, 90, W - 240, H - 180, '#050510', C.enchant, 3);

  ctx.fillStyle = C.enchant; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center';
  ctx.fillText('CRAFTING TABLE', W / 2, 124);
  ctx.fillStyle = C.silver; ctx.font = '12px monospace';
  drawWrappedText(ctx, 'Craft any enchantment from scratch. The Tomes Blessing and Empty Book are consumed.', 140, 140, W - 280, 16);

  ctx.strokeStyle = '#333355'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(150, 156); ctx.lineTo(W - 150, 156); ctx.stroke();

  ctx.textAlign = 'left';
  const rowH = 34;
  const listTop = 184;
  const listBottom = H - 116;
  const maxVisible = Math.max(1, Math.floor((listBottom - listTop) / rowH));
  const maxScroll = Math.max(0, CRAFTABLE_ENCHANTS.length - maxVisible);
  const scrollOffset = Math.min(maxScroll, Math.max(0, state.tomeCraft.cursorIndex - maxVisible + 1));

  ctx.save();
  ctx.beginPath(); ctx.rect(120, listTop - 20, W - 240, listBottom - (listTop - 20)); ctx.clip();
  CRAFTABLE_ENCHANTS.slice(scrollOffset, scrollOffset + maxVisible).forEach((id, vi) => {
    const i = scrollOffset + vi;
    const sel = state.tomeCraft.cursorIndex === i;
    const item = ITEMS[id];
    if (!item) return;
    const iy = listTop + vi * rowH;

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
  ctx.restore();

  if (scrollOffset > 0) {
    ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
    ctx.fillText('▲', W / 2, listTop - 10);
  }
  if (scrollOffset + maxVisible < CRAFTABLE_ENCHANTS.length) {
    ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
    ctx.fillText('▼', W / 2, listBottom + 6);
  }

  ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace';
  ctx.fillText('[UP/DOWN] select  |  [SPACE] forge & enchant  |  [X] cancel', W / 2, H - 96);
}

// ── BESTIARY / CODEX (B key) — row layout ────────────────────────────
function renderBestiary(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.92)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 60, 50, W - 120, H - 100, '#050510', '#8888cc', 3);

  ctx.fillStyle = '#aaaaee'; ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center';
  ctx.fillText('CODEX', W / 2, 86);
  ctx.fillStyle = '#444466'; ctx.font = '11px monospace';
  ctx.fillText('3 encounters reveal an enemy\'s traits  ·  Global — persists across all characters', W / 2, 104);
  ctx.strokeStyle = '#333355'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 113); ctx.lineTo(W - 80, 113); ctx.stroke();

  const globalCodex = getGlobalCodex();
  const getKills = (id: string) => Math.max(state.player.bestiary[id] ?? 0, globalCodex[id] ?? 0);
  const enemyIds = Object.keys(ENEMIES);

  const rowH = 42;
  const listLeft = 80; const listTop = 123;
  const listRight = W - 80; const listBottom = H - 108;
  const rowW = listRight - listLeft;
  const maxVis = Math.max(1, Math.floor((listBottom - listTop) / rowH));
  const maxScroll = Math.max(0, enemyIds.length - maxVis);
  state.bestiaryScroll = Math.min(maxScroll, Math.max(0, state.bestiaryScroll));
  const scrollOff = state.bestiaryScroll;

  ctx.save();
  ctx.beginPath(); ctx.rect(listLeft - 2, listTop - 1, rowW + 4, listBottom - listTop + 2); ctx.clip();

  enemyIds.slice(scrollOff, scrollOff + maxVis).forEach((id, vi) => {
    const enemy = ENEMIES[id];
    const kills = getKills(id);
    const encountered = kills > 0;
    const revealed = kills >= 3;
    const ry = listTop + vi * rowH;

    // Row background
    ctx.fillStyle = revealed ? 'rgba(100,100,200,0.07)' : (encountered ? 'rgba(60,60,90,0.05)' : 'transparent');
    ctx.fillRect(listLeft, ry, rowW, rowH - 2);
    ctx.strokeStyle = encountered ? '#1e1e3a' : '#111120';
    ctx.lineWidth = 1; ctx.strokeRect(listLeft, ry, rowW, rowH - 2);

    // Revealed accent bar on left
    if (revealed) { ctx.fillStyle = '#5555aa'; ctx.fillRect(listLeft, ry, 3, rowH - 2); }
    else if (encountered) { ctx.fillStyle = '#333355'; ctx.fillRect(listLeft, ry, 3, rowH - 2); }

    // Enemy name
    ctx.textAlign = 'left'; ctx.font = revealed ? 'bold 12px monospace' : '12px monospace';
    ctx.fillStyle = revealed ? '#ccccee' : (encountered ? '#888899' : '#333344');
    ctx.fillText(encountered ? enemy.name : '??? ???', listLeft + 10, ry + 15);

    // HP/ATK stats when revealed
    if (revealed) {
      ctx.font = '10px monospace'; ctx.fillStyle = '#445566';
      ctx.fillText(`HP:${enemy.hp}  ATK:${enemy.atk}  +${enemy.echoes}ec`, listLeft + 10, ry + 30);
    }

    // Encounter count
    ctx.textAlign = 'right'; ctx.font = '10px monospace';
    ctx.fillStyle = revealed ? '#77aa88' : (encountered ? '#445566' : '#222233');
    ctx.fillText(encountered ? `${kills}× seen` : 'not yet seen', listLeft + 130, ry + 15);

    // Trait badges
    if (revealed) {
      let tx = listLeft + 145;
      if (enemy.resistances) {
        Object.entries(enemy.resistances).forEach(([t, v]) => {
          const badge = v === 0 ? `IMM:${t}` : v >= 2 ? `WEAK:${t}` : `RES:${t}`;
          const bc = v === 0 ? '#aa3333' : v >= 2 ? '#aaaa33' : '#336688';
          ctx.font = '9px monospace'; ctx.textAlign = 'left';
          ctx.fillStyle = bc;
          ctx.fillText(badge, tx, ry + 15);
          tx += ctx.measureText(badge).width + 8;
        });
      } else {
        ctx.font = '9px monospace'; ctx.textAlign = 'left'; ctx.fillStyle = '#334433';
        ctx.fillText('no special traits', listLeft + 145, ry + 15);
      }
      // Flavor on second line
      ctx.font = '9px monospace'; ctx.textAlign = 'left'; ctx.fillStyle = '#332244';
      const flav = enemy.flavor.slice(0, 55) + (enemy.flavor.length > 55 ? '…' : '');
      ctx.fillText(flav, listLeft + 145, ry + 30);
    }
  });

  ctx.restore();

  if (scrollOff > 0) { ctx.fillStyle = '#555577'; ctx.textAlign = 'center'; ctx.font = '12px monospace'; ctx.fillText('▲', W/2, listTop - 5); }
  if (scrollOff + maxVis < enemyIds.length) { ctx.fillStyle = '#555577'; ctx.textAlign = 'center'; ctx.font = '12px monospace'; ctx.fillText('▼', W/2, listBottom + 6); }

  const totalSeen = enemyIds.filter(id => getKills(id) >= 3).length;
  ctx.fillStyle = '#33335a'; ctx.textAlign = 'center'; ctx.font = '11px monospace';
  ctx.fillText(`${totalSeen} / ${enemyIds.length} fully catalogued`, W / 2, H - 100);
  ctx.fillStyle = '#2a2a44'; ctx.font = '11px monospace';
  ctx.fillText('[↑↓] scroll  |  [B] or [X] close', W / 2, H - 84);
}

// Helper: draw text with an animated rainbow gradient (used for Color tier label)
function drawRainbowText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, frame: number) {
  const tw = ctx.measureText(text).width;
  const align = ctx.textAlign;
  const startX = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x;
  const shift = (frame * 2.5) % (tw + 80);
  const grad = ctx.createLinearGradient(startX - 40 + shift - (tw + 80), y, startX + 40 + shift, y);
  grad.addColorStop(0,    '#ff4488');
  grad.addColorStop(0.17, '#ffaa33');
  grad.addColorStop(0.33, '#ffee33');
  grad.addColorStop(0.5,  '#44ffaa');
  grad.addColorStop(0.67, '#33aaff');
  grad.addColorStop(0.83, '#aa55ff');
  grad.addColorStop(1,    '#ff4488');
  ctx.fillStyle = grad;
  ctx.fillText(text, x, y);
}

// ── CHALLENGE SELECT (Challenge Board — informational + attempt launcher) ──
function renderChallengeSelect(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.95)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 40, 40, W - 80, H - 80, '#080814', '#9966ff', 3);

  ctx.fillStyle = '#bb99ff'; ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center';
  ctx.fillText('CHALLENGE BOARD', W / 2, 76);
  ctx.fillStyle = '#443355'; ctx.font = '11px monospace';
  ctx.fillText('Select a tier to view possible rewards  ·  Beat all 5 trial waves to earn one at random', W / 2, 94);
  ctx.strokeStyle = '#2a1a44'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(60, 103); ctx.lineTo(W - 60, 103); ctx.stroke();

  const unlockedIdx = getUnlockedTierIndex();
  const tiers = CHALLENGE_TIERS;
  const { tierCursor } = state.challengeSelectState;

  // ── Left panel: tier list ──
  const tpX = 60; const tpW = 200;
  const tierListTop = 114; const tierRowH = 48;

  tiers.forEach((tier, i) => {
    const isUnlocked = i <= unlockedIdx;
    const isSel = tierCursor === i;
    const isDone = !!state.player.flags[`ch_claimed_${tier.name}`];
    const ty = tierListTop + i * tierRowH;

    if (isSel) {
      ctx.fillStyle = isUnlocked ? 'rgba(150,100,255,0.12)' : 'rgba(40,30,70,0.12)';
      ctx.fillRect(tpX - 2, ty, tpW + 4, tierRowH - 2);
      ctx.strokeStyle = isUnlocked ? '#6644aa' : '#2a2050'; ctx.lineWidth = 1;
      ctx.strokeRect(tpX - 2, ty, tpW + 4, tierRowH - 2);
    }

    // Tier name — Color tier gets rainbow gradient
    ctx.font = isSel ? 'bold 14px monospace' : '13px monospace'; ctx.textAlign = 'left';
    const nameText = (isSel ? '► ' : '  ') + tier.displayName;
    if (isUnlocked && tier.name === 'color') {
      ctx.fillStyle = tier.color; ctx.fillText('  ', tpX + 6, ty + 20); // prefix space (no gradient)
      drawRainbowText(ctx, nameText, tpX + 6, ty + 20, state.frameCount);
    } else {
      ctx.fillStyle = isUnlocked ? tier.color : '#2a2040';
      ctx.fillText(nameText, tpX + 6, ty + 20);
    }

    ctx.font = '10px monospace'; ctx.textAlign = 'right';
    if (!isUnlocked)  { ctx.fillStyle = '#2a2040'; ctx.fillText('LOCKED',    tpX + tpW - 4, ty + 20); }
    else if (isDone)  { ctx.fillStyle = '#557744'; ctx.fillText('✓ COMPLETE', tpX + tpW - 4, ty + 20); }
    else              { ctx.fillStyle = '#887733'; ctx.fillText('AVAILABLE',  tpX + tpW - 4, ty + 20); }
  });

  // ── Divider ──
  const divX = tpX + tpW + 14;
  ctx.strokeStyle = '#1a0e33'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(divX, 108); ctx.lineTo(divX, H - 72); ctx.stroke();

  // ── Right panel: possible rewards (informational) ──
  const poolX = divX + 12; const poolW = W - poolX - 52;
  const selTier = tiers[tierCursor];
  const isUnlocked = tierCursor <= unlockedIdx;

  if (!isUnlocked) {
    ctx.fillStyle = '#221133'; ctx.font = '14px monospace'; ctx.textAlign = 'center';
    const midX = poolX + poolW / 2;
    ctx.fillText('LOCKED', midX, 200);
    ctx.fillStyle = '#1a0e28'; ctx.font = '11px monospace';
    ctx.fillText('All tiers are currently available.', midX, 222);
  } else if (selTier) {
    const isDone = !!state.player.flags[`ch_claimed_${selTier.name}`];

    // Tier name header (Color = rainbow)
    ctx.font = 'bold 14px monospace'; ctx.textAlign = 'left';
    if (selTier.name === 'color') {
      drawRainbowText(ctx, `${selTier.displayName} Tier`, poolX, 122, state.frameCount);
    } else {
      ctx.fillStyle = selTier.color;
      ctx.fillText(`${selTier.displayName} Tier`, poolX, 122);
    }

    ctx.font = '10px monospace'; ctx.fillStyle = isDone ? '#334433' : '#554466';
    const _tierWaves = TIER_WAVE_SEQUENCES[selTier.name] ?? [];
    const subLine = isDone
      ? "You've completed this tier's challenge this journey."
      : `Beat all ${_tierWaves.length} trial waves — earn one reward at random based on the chances below.`;
    drawWrappedText(ctx, subLine, poolX, 136, poolW, 14);

    // ── Wave list ────────────────────────────────────────────────────
    let waveListEndY = 153;
    if (_tierWaves.length > 0) {
      ctx.font = 'bold 10px monospace'; ctx.textAlign = 'left';
      ctx.fillStyle = isDone ? '#2a2a3a' : '#7755aa';
      ctx.fillText(`WAVES (${_tierWaves.length}):`, poolX, waveListEndY);
      waveListEndY += 13;
      ctx.font = '10px monospace';
      _tierWaves.forEach((wId, wi) => {
        const eName = ENEMIES[wId]?.name ?? wId;
        const eColor = isDone ? '#2a2040' : (ENEMIES[wId]?.color ?? '#9988bb');
        ctx.fillStyle = eColor;
        ctx.fillText(`${wi + 1}. ${eName}`, poolX + 6, waveListEndY);
        waveListEndY += 12;
      });
      waveListEndY += 4;
    }

    // Pool items list
    const poolRowH = 52;
    const poolTop = waveListEndY;
    const totalChance = selTier.pool.reduce((s, p) => s + p.chance, 0);

    selTier.pool.forEach((item, pi) => {
      const itemData = ITEMS[item.itemId];
      const py = poolTop + pi * poolRowH;
      const pct = Math.round((item.chance / totalChance) * 100);
      const tc = TIER_COLOR[itemData?.tier ?? 'common'] ?? '#888';

      // Item row background
      ctx.fillStyle = isDone ? 'rgba(20,20,40,0.05)' : 'rgba(80,50,150,0.06)';
      ctx.fillRect(poolX - 4, py, poolW + 8, poolRowH - 4);
      ctx.strokeStyle = isDone ? '#1a1a2a' : '#332244'; ctx.lineWidth = 1;
      ctx.strokeRect(poolX - 4, py, poolW + 8, poolRowH - 4);

      // Item name
      ctx.font = '13px monospace'; ctx.textAlign = 'left';
      ctx.fillStyle = isDone ? '#3a3a4a' : '#ccbbee';
      ctx.fillText(item.label, poolX + 2, py + 15);

      // Tier tag
      if (itemData) {
        ctx.font = '10px monospace'; ctx.textAlign = 'right';
        ctx.fillStyle = isDone ? '#2a2a36' : tc;
        ctx.fillText(`[${(TIER_LABEL[itemData.tier] ?? itemData.tier).toUpperCase()}]`, poolX + poolW - 4, py + 15);
      }

      // Chance
      ctx.font = 'bold 11px monospace'; ctx.textAlign = 'right';
      ctx.fillStyle = isDone ? '#2a3a2a' : '#88dd66';
      ctx.fillText(`${pct}%`, poolX + poolW - 4, py + 30);

      // Description (wrapped)
      ctx.font = '10px monospace'; ctx.textAlign = 'left';
      ctx.fillStyle = isDone ? '#252530' : '#665577';
      drawWrappedText(ctx, item.desc, poolX + 2, py + 30, poolW - 40, 12);
    });

    // Attempt / done CTA
    const ctaY = poolTop + selTier.pool.length * poolRowH + 10;
    if (isDone) {
      ctx.font = '11px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#445544';
      ctx.fillText('Challenge complete for this journey  ·  [X] close', poolX + poolW / 2, Math.min(ctaY, H - 80));
    } else {
      ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
      const pulse = 0.65 + 0.35 * Math.sin(state.frameCount * 0.07);
      ctx.globalAlpha = pulse;
      ctx.fillStyle = '#bb99ff';
      ctx.fillText('[SPACE] Attempt Challenge', poolX + poolW / 2, Math.min(ctaY, H - 80));
      ctx.globalAlpha = 1;
    }
  }

  // ── Footer ──
  ctx.strokeStyle = '#1a0e33'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(60, H - 66); ctx.lineTo(W - 60, H - 66); ctx.stroke();
  ctx.fillStyle = '#3a2a55'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
  ctx.fillText('[↑↓] select tier  ·  [SPACE] attempt  ·  [X] close', W / 2, H - 48);
}

// ── CHALLENGE RESULT (post-challenge reward modal) ────────────────────
function renderChallengeResult(ctx: CanvasRenderingContext2D, state: GameStateData) {
  const cr = state.challengeResult;
  if (!cr) return;
  ctx.fillStyle = 'rgba(0,0,0,0.92)'; ctx.fillRect(0, 0, W, H);
  const bx = 100; const by = 70; const bw = W - 200; const bh = H - 140;
  pixelBox(ctx, bx, by, bw, bh, '#060611', '#9966ff', 3);

  // Title
  ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center';
  drawRainbowText(ctx, 'CHALLENGE COMPLETE', W / 2, by + 30, state.frameCount);

  ctx.strokeStyle = '#2a1a44'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(bx + 20, by + 40); ctx.lineTo(bx + bw - 20, by + 40); ctx.stroke();

  // Time
  const totalSec = Math.floor(cr.timeSeconds);
  const mm = Math.floor(totalSec / 60);
  const ss = totalSec % 60;
  const timeStr = `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  ctx.font = '12px monospace'; ctx.fillStyle = '#666688'; ctx.textAlign = 'center';
  ctx.fillText('Completion Time', W / 2, by + 58);
  ctx.font = 'bold 26px monospace'; ctx.fillStyle = '#aaaacc';
  ctx.fillText(timeStr, W / 2, by + 86);

  ctx.strokeStyle = '#221133'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(bx + 40, by + 98); ctx.lineTo(bx + bw - 40, by + 98); ctx.stroke();

  // Reward
  const rewardLabel = cr.isDuplicate ? 'Duplicate Reward — Converted to Echoes' : 'Reward Earned';
  ctx.font = '11px monospace'; ctx.fillStyle = cr.isDuplicate ? '#997733' : '#554466'; ctx.textAlign = 'center';
  ctx.fillText(rewardLabel, W / 2, by + 114);

  const itemData = ITEMS[cr.itemId];
  if (itemData) {
    const tc = TIER_COLOR[itemData.tier] ?? '#ff77ee';
    ctx.font = 'bold 15px monospace'; ctx.textAlign = 'center';
    if (itemData.tier === 'mythic') {
      drawTierText(ctx, itemData.name, W / 2, by + 135, 'mythic', state.frameCount);
    } else {
      ctx.fillStyle = cr.isDuplicate ? '#666655' : tc;
      ctx.fillText(itemData.name, W / 2, by + 135);
    }
    ctx.font = '10px monospace'; ctx.fillStyle = cr.isDuplicate ? '#444433' : tc;
    ctx.fillText(`[${(TIER_LABEL[itemData.tier] ?? itemData.tier).toUpperCase()}]`, W / 2, by + 150);
    // Description — truncate to single line to avoid overflow
    const desc = itemData.desc
      ? (itemData.desc.length > 68 ? itemData.desc.slice(0, 65) + '…' : itemData.desc)
      : '';
    ctx.font = '10px monospace'; ctx.fillStyle = cr.isDuplicate ? '#333328' : '#554466'; ctx.textAlign = 'center';
    ctx.fillText(desc, W / 2, by + 165);
    if (cr.isDuplicate) {
      ctx.font = '11px monospace'; ctx.fillStyle = '#aa8833'; ctx.textAlign = 'center';
      ctx.fillText(`+${itemData.price ?? 50} Echoes added to your returning inventory`, W / 2, by + 182);
    }
  } else {
    ctx.font = '14px monospace'; ctx.fillStyle = '#bb99ff'; ctx.textAlign = 'center';
    ctx.fillText(cr.itemId, W / 2, by + 135);
  }

  // ── Rerun / Return buttons ───────────────────────────────────────────
  ctx.strokeStyle = '#221133'; ctx.lineWidth = 1;
  const divY = by + bh - 88;
  ctx.beginPath(); ctx.moveTo(bx + 20, divY); ctx.lineTo(bx + bw - 20, divY); ctx.stroke();

  const btnW = Math.floor(bw / 2) - 20;
  const btn0X = bx + 10;
  const btn1X = bx + bw / 2 + 10;
  const btnY = by + bh - 70;
  const sel = state.challengeResultMenuIndex;

  // Rerun button
  const rerunSel = sel === 0;
  ctx.fillStyle = rerunSel ? 'rgba(140,100,255,0.18)' : 'rgba(30,20,60,0.4)';
  ctx.fillRect(btn0X, btnY, btnW, 44);
  ctx.strokeStyle = rerunSel ? '#9966ff' : '#2a1a44'; ctx.lineWidth = rerunSel ? 2 : 1;
  ctx.strokeRect(btn0X, btnY, btnW, 44);
  ctx.font = rerunSel ? 'bold 13px monospace' : '12px monospace';
  ctx.fillStyle = rerunSel ? '#ccaaff' : '#554466'; ctx.textAlign = 'center';
  ctx.fillText('RERUN', btn0X + btnW / 2, btnY + 18);
  ctx.font = '10px monospace'; ctx.fillStyle = rerunSel ? '#8866bb' : '#332244';
  ctx.fillText('same tier, no new reward', btn0X + btnW / 2, btnY + 34);

  // Return button
  const retSel = sel === 1;
  ctx.fillStyle = retSel ? 'rgba(100,200,140,0.18)' : 'rgba(20,40,30,0.4)';
  ctx.fillRect(btn1X, btnY, btnW, 44);
  ctx.strokeStyle = retSel ? '#66cc99' : '#142418'; ctx.lineWidth = retSel ? 2 : 1;
  ctx.strokeRect(btn1X, btnY, btnW, 44);
  ctx.font = retSel ? 'bold 13px monospace' : '12px monospace';
  ctx.fillStyle = retSel ? '#99eecc' : '#2a4434'; ctx.textAlign = 'center';
  ctx.fillText('RETURN', btn1X + btnW / 2, btnY + 18);
  ctx.font = '10px monospace'; ctx.fillStyle = retSel ? '#44aa77' : '#1a3022';
  ctx.fillText('back to the world', btn1X + btnW / 2, btnY + 34);

  // Navigation hint
  ctx.font = '10px monospace'; ctx.fillStyle = '#332244'; ctx.textAlign = 'center';
  const pulse = 0.65 + 0.35 * Math.sin(state.frameCount * 0.07);
  ctx.globalAlpha = pulse;
  ctx.fillText('[←→] select  ·  [SPACE] confirm  ·  [X] return', W / 2, by + bh - 12);
  ctx.globalAlpha = 1;
}

// ── EXTRAS ────────────────────────────────────────────────────────────
function renderChallengeCodex(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.95)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 60, 50, W - 120, H - 100, '#080814', '#9966ff', 3);

  ctx.fillStyle = '#bb99ff'; ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center';
  ctx.fillText('CHALLENGE CODEX', W / 2, 86);
  ctx.fillStyle = '#332244'; ctx.font = '11px monospace';
  ctx.fillText('Items claimable exclusively through the Challenge Board', W / 2, 104);
  ctx.strokeStyle = '#1e1035'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 113); ctx.lineTo(W - 80, 113); ctx.stroke();

  const TIER_CLR: Record<string, string> = {
    bronze: '#cd7f32', silver: '#c0c0c0', gold: '#ffd700',
    platinum: '#e5e4e2', diamond: '#b9f2ff', void: '#9966ff',
  };

  // Build codex rows: every item from every tier's pool
  type CodexEntry = { id: string; tierName: string; tierColor: string };
  const entries: CodexEntry[] = [];
  CHALLENGE_TIERS.forEach(tier => {
    tier.pool.forEach(p => entries.push({ id: p.itemId, tierName: tier.displayName, tierColor: TIER_CLR[tier.name] ?? '#888' }));
  });

  const rowH = 38; const listLeft = 80; const listTop = 124;
  const listRight = W - 80; const listBottom = H - 96;
  const rowW = listRight - listLeft;
  const maxVis = Math.max(1, Math.floor((listBottom - listTop) / rowH));
  const maxScroll = Math.max(0, entries.length - maxVis);
  state.extrasState.codexScroll = Math.min(maxScroll, Math.max(0, state.extrasState.codexScroll));
  const scrollOff = state.extrasState.codexScroll;

  ctx.save();
  ctx.beginPath(); ctx.rect(listLeft - 2, listTop - 1, rowW + 4, listBottom - listTop + 2); ctx.clip();

  entries.slice(scrollOff, scrollOff + maxVis).forEach((ce, vi) => {
    const ry = listTop + vi * rowH;
    const item = ITEMS[ce.id];
    if (!item) return;
    const obtained = state.player.inventory.includes(ce.id)
      || (state.player.equipment as Record<string, string | null>)[item.category as any] === ce.id;

    ctx.fillStyle = obtained ? 'rgba(80,50,160,0.07)' : 'transparent';
    ctx.fillRect(listLeft, ry, rowW, rowH - 2);
    ctx.strokeStyle = obtained ? '#1e1244' : '#101020'; ctx.lineWidth = 1;
    ctx.strokeRect(listLeft, ry, rowW, rowH - 2);

    // Tier color accent bar
    ctx.fillStyle = ce.tierColor; ctx.fillRect(listLeft, ry, 4, rowH - 2);

    // Item name
    ctx.font = obtained ? 'bold 12px monospace' : '12px monospace'; ctx.textAlign = 'left';
    ctx.fillStyle = obtained ? '#ccbbff' : '#443355';
    ctx.fillText(item.name, listLeft + 12, ry + 15);

    // Tier source label
    ctx.font = '10px monospace'; ctx.textAlign = 'left'; ctx.fillStyle = ce.tierColor;
    const tLabel = ce.tierName + ' tier';
    ctx.fillText(tLabel, listLeft + 12, ry + 30);

    // Item tier badge
    ctx.font = '10px monospace'; ctx.textAlign = 'right';
    ctx.fillStyle = TIER_COLOR[item.tier] ?? '#888';
    ctx.fillText(`[${(TIER_LABEL[item.tier] ?? item.tier).toUpperCase()}]`, listLeft + rowW - 4, ry + 15);

    // Obtained badge
    if (obtained) {
      ctx.fillStyle = '#557744'; ctx.font = '10px monospace'; ctx.textAlign = 'right';
      ctx.fillText('✓ OBTAINED', listLeft + rowW - 4, ry + 30);
    }
  });

  ctx.restore();

  if (scrollOff > 0) { ctx.fillStyle = '#553377'; ctx.textAlign = 'center'; ctx.font = '12px monospace'; ctx.fillText('▲', W/2, listTop - 5); }
  if (scrollOff + maxVis < entries.length) { ctx.fillStyle = '#553377'; ctx.textAlign = 'center'; ctx.font = '12px monospace'; ctx.fillText('▼', W/2, listBottom + 5); }

  const obtainedCount = entries.filter(e => {
    const item = ITEMS[e.id]; if (!item) return false;
    return state.player.inventory.includes(e.id);
  }).length;
  ctx.fillStyle = '#2a1a44'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
  ctx.fillText(`${obtainedCount} / ${entries.length} obtained this journey`, W / 2, H - 84);
  ctx.fillStyle = '#1e1235';
  ctx.fillText('[↑↓] scroll  ·  [X] back', W / 2, H - 68);
}

function renderExtras(ctx: CanvasRenderingContext2D, state: GameStateData) {
  if (state.extrasState.subScreen === 'codex') {
    renderChallengeCodex(ctx, state);
    return;
  }
  // Main Extras menu
  ctx.fillStyle = 'rgba(0,0,0,0.88)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 240, 180, 288, 188, C.black, '#8888cc', 3);

  ctx.fillStyle = '#aaaaee'; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center';
  ctx.fillText('EXTRAS', W / 2, 212);
  ctx.strokeStyle = '#333355'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(258, 222); ctx.lineTo(510, 222); ctx.stroke();

  const opts = ['Achievements', 'Challenge Codex', 'Close'];
  const descs = [
    'Global achievement tracker — persists across all characters',
    'View all challenge-board rewards and which you\'ve obtained',
    'Return to the world',
  ];
  ctx.textAlign = 'left'; ctx.font = '14px monospace';
  opts.forEach((opt, i) => {
    const sel = state.extrasState.menuIndex === i;
    ctx.fillStyle = sel ? '#ddddff' : '#555577';
    ctx.fillText((sel ? '> ' : '  ') + opt, 262, 248 + i * 38);
    if (sel) {
      ctx.font = '10px monospace'; ctx.fillStyle = '#33334a';
      ctx.fillText(descs[i], 278, 263 + i * 38);
    }
  });

  ctx.fillStyle = '#2a2a44'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
  ctx.fillText('[↑↓] select  ·  [SPACE] open  ·  [X] close', W / 2, H - 86);
}

// ── ITEM CRAFT (Crafting Table — GameMode.ITEM_CRAFT) ─────────────────
function renderItemCraft(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.9)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 80, 60, W - 160, H - 120, '#060611', '#aabb88', 3);

  ctx.fillStyle = '#aabb88'; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center';
  ctx.fillText('CRAFTING TABLE', W / 2, 94);

  // Category tabs
  const CATS: Array<{ key: string; label: string }> = [
    { key: 'material',   label: 'MATERIALS' },
    { key: 'weapon',     label: 'WEAPONS'   },
    { key: 'armor',      label: 'ARMOR'     },
    { key: 'trinket',    label: 'TRINKETS'  },
    { key: 'consumable', label: 'CONSUMABLES'},
  ];
  const tabW = Math.floor((W - 200) / CATS.length);
  const tabY = 110;
  CATS.forEach((cat, i) => {
    const tx = 100 + i * tabW;
    const sel = state.itemCraft.categoryIdx === i;
    ctx.fillStyle = sel ? '#1c2e10' : '#0d0d0d';
    ctx.fillRect(tx, tabY, tabW - 2, 22);
    ctx.strokeStyle = sel ? '#aabb88' : '#334433';
    ctx.lineWidth = 1;
    ctx.strokeRect(tx, tabY, tabW - 2, 22);
    ctx.font = sel ? 'bold 11px monospace' : '11px monospace';
    ctx.fillStyle = sel ? '#ccdd99' : '#445544';
    ctx.textAlign = 'center';
    ctx.fillText(cat.label, tx + tabW / 2 - 1, tabY + 15);
  });
  ctx.strokeStyle = '#334433'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(100, 134); ctx.lineTo(W - 100, 134); ctx.stroke();

  const catKey = CATS[state.itemCraft.categoryIdx].key as 'material'|'weapon'|'armor'|'trinket'|'consumable';
  const catRecipes = RECIPES.filter(r => r.category === catKey);

  if (catRecipes.length === 0) {
    ctx.fillStyle = '#333344'; ctx.font = '13px monospace'; ctx.textAlign = 'center';
    ctx.fillText('No recipes in this category.', W / 2, 200);
  }

  const rowH = 38;
  const listTop = 148;
  const listBottom = H - 150;
  const maxVisible = Math.max(1, Math.floor((listBottom - listTop) / rowH));
  const scrollOff = Math.max(0, state.itemCraft.cursorIndex - maxVisible + 1);

  ctx.save();
  ctx.beginPath(); ctx.rect(90, listTop - 4, W - 180, listBottom - listTop + 8); ctx.clip();

  catRecipes.slice(scrollOff, scrollOff + maxVisible).forEach((recipe, vi) => {
    const i = scrollOff + vi;
    const sel = state.itemCraft.cursorIndex === i;
    const ry = listTop + vi * rowH;
    const outItem = ITEMS[recipe.outputId];

    // Check if craftable
    const canCraft = recipe.ingredients.every(ing =>
      state.player.inventory.filter(id => id === ing.itemId).length >= ing.count
    );

    if (sel) {
      ctx.fillStyle = '#121f0a'; ctx.fillRect(100, ry, W - 200, rowH - 2);
      ctx.strokeStyle = canCraft ? '#88bb55' : '#555544'; ctx.lineWidth = 1;
      ctx.strokeRect(100, ry, W - 200, rowH - 2);
    }

    // Recipe name + output tier
    ctx.font = sel ? 'bold 13px monospace' : '13px monospace'; ctx.textAlign = 'left';
    ctx.fillStyle = sel ? (canCraft ? '#ccdd88' : '#887766') : '#667755';
    ctx.fillText((sel ? '► ' : '  ') + recipe.name, 108, ry + 16);

    if (outItem) {
      const tc = TIER_COLOR[outItem.tier] ?? '#888888';
      ctx.font = '10px monospace'; ctx.fillStyle = tc;
      ctx.textAlign = 'right';
      ctx.fillText(`[${(TIER_LABEL[outItem.tier] ?? outItem.tier).toUpperCase()}]`, W - 108, ry + 16);
    }

    // Ingredient list (abbreviated)
    ctx.font = '10px monospace'; ctx.textAlign = 'left';
    let ix = 108;
    recipe.ingredients.forEach((ing, idx2) => {
      const have = state.player.inventory.filter(id => id === ing.itemId).length;
      const ok = have >= ing.count;
      const ingName = ITEMS[ing.itemId]?.name ?? ing.itemId;
      ctx.fillStyle = ok ? '#558844' : '#774444';
      const label = `${have}/${ing.count} ${ingName}`;
      ctx.fillText(label, ix, ry + 30);
      ix += ctx.measureText(label).width + 16;
    });
  });
  ctx.restore();

  if (scrollOff > 0) { ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace'; ctx.fillText('▲', W/2, listTop - 6); }
  if (scrollOff + maxVisible < catRecipes.length) { ctx.fillStyle = C.dim; ctx.textAlign = 'center'; ctx.font = '12px monospace'; ctx.fillText('▼', W/2, listBottom + 6); }

  // ── Selected recipe output detail (anchored to box bottom, no overflow) ──
  const selRecipe = catRecipes[state.itemCraft.cursorIndex];
  const detailAreaY = H - 148; // fixed anchor — box ends at H-60=516, so 148px from bottom leaves safe margin
  ctx.strokeStyle = '#334433'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(100, detailAreaY); ctx.lineTo(W - 100, detailAreaY); ctx.stroke();
  if (selRecipe) {
    const outItem = ITEMS[selRecipe.outputId];
    const canCraft = selRecipe.ingredients.every(ing =>
      state.player.inventory.filter(id => id === ing.itemId).length >= ing.count
    );
    if (outItem) {
      // Item name + tier on one line
      const tc = TIER_COLOR[outItem.tier] ?? '#aabb88';
      ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left'; ctx.fillStyle = tc;
      ctx.fillText(`${outItem.name} × ${selRecipe.outputCount}`, 108, detailAreaY + 18);
      ctx.font = '10px monospace'; ctx.textAlign = 'right'; ctx.fillStyle = tc;
      ctx.fillText(`[${(TIER_LABEL[outItem.tier] ?? outItem.tier).toUpperCase()}]`, W - 108, detailAreaY + 18);
      // Description — single truncated line so it never overflows
      const desc = outItem.desc
        ? (outItem.desc.length > 80 ? outItem.desc.slice(0, 77) + '…' : outItem.desc)
        : '';
      ctx.font = '10px monospace'; ctx.textAlign = 'left'; ctx.fillStyle = '#778866';
      ctx.fillText(desc, 108, detailAreaY + 32);
    }
    ctx.font = '11px monospace'; ctx.fillStyle = canCraft ? '#88bb55' : '#774444'; ctx.textAlign = 'center';
    ctx.fillText(canCraft ? '[SPACE] Craft  ·  [←→] category  ·  [X] close' : 'Missing ingredients  ·  [←→] category  ·  [X] close', W / 2, detailAreaY + 52);
  } else {
    ctx.fillStyle = '#445544'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
    ctx.fillText('[←→] change category  ·  [X] close', W / 2, detailAreaY + 52);
  }
}

// ── ACHIEVEMENTS (A key) ──────────────────────────────────────────────
function renderAchievements(ctx: CanvasRenderingContext2D, state: GameStateData) {
  ctx.fillStyle = 'rgba(0,0,0,0.92)'; ctx.fillRect(0, 0, W, H);
  pixelBox(ctx, 80, 60, W - 160, H - 120, '#080810', '#ccaa55', 3);

  ctx.fillStyle = '#ccaa55'; ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center';
  ctx.fillText('ACHIEVEMENTS', W / 2, 96);

  const earnedIds = getEarnedAchievementIds();
  const total = ACH_DEFS.length;
  const earned = earnedIds.length;

  ctx.fillStyle = '#777755'; ctx.font = '12px monospace';
  ctx.fillText(`${earned} / ${total} earned`, W / 2, 114);
  ctx.strokeStyle = '#443300'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(100, 124); ctx.lineTo(W - 100, 124); ctx.stroke();

  const rowH = 40;
  const listTop = 136;
  const listBottom = H - 110;
  const maxVisible = Math.max(1, Math.floor((listBottom - listTop) / rowH));
  const maxScroll = Math.max(0, total - maxVisible);
  state.achievementsScroll = Math.min(maxScroll, Math.max(0, state.achievementsScroll));
  const scrollOff = state.achievementsScroll;

  ctx.save();
  ctx.beginPath(); ctx.rect(90, listTop - 2, W - 180, listBottom - listTop + 4); ctx.clip();

  ACH_DEFS.slice(scrollOff, scrollOff + maxVisible).forEach((ach, vi) => {
    const isEarned = earnedIds.includes(ach.id);
    const ay = listTop + vi * rowH;

    // Row bg
    if (isEarned) {
      ctx.fillStyle = 'rgba(180,150,30,0.07)';
      ctx.fillRect(100, ay, W - 200, rowH - 4);
    }

    // Icon
    ctx.font = '18px monospace'; ctx.textAlign = 'center';
    ctx.fillStyle = isEarned ? '#ffcc44' : '#333322';
    ctx.fillText(ach.icon, 122, ay + 26);

    // Name
    ctx.font = isEarned ? 'bold 13px monospace' : '13px monospace'; ctx.textAlign = 'left';
    ctx.fillStyle = isEarned ? '#ddcc77' : '#444433';
    ctx.fillText(ach.name, 140, ay + 18);

    // Description
    ctx.font = '10px monospace';
    ctx.fillStyle = isEarned ? '#88774d' : '#2a2a22';
    ctx.fillText(ach.desc, 140, ay + 33);

    // Earned badge
    if (isEarned) {
      ctx.font = '10px monospace'; ctx.textAlign = 'right';
      ctx.fillStyle = '#886633';
      ctx.fillText('✓ EARNED', W - 108, ay + 18);
    }
  });
  ctx.restore();

  if (scrollOff > 0) { ctx.fillStyle = '#555533'; ctx.textAlign = 'center'; ctx.font = '12px monospace'; ctx.fillText('▲', W/2, listTop - 6); }
  if (scrollOff + maxVisible < total) { ctx.fillStyle = '#555533'; ctx.textAlign = 'center'; ctx.font = '12px monospace'; ctx.fillText('▼', W/2, listBottom + 6); }

  ctx.fillStyle = '#443300'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
  ctx.fillText('[↑↓] scroll  |  [A] or [X] close', W/2, H - 86);
}
