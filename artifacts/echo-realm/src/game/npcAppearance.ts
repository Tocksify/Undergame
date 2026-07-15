// ── NPC APPEARANCE ────────────────────────────────────────────────────
// Derives per-NPC visual variety (skin tone, hairstyle, eye color, body
// size, clothing jitter) deterministically from the NPC's id. This means
// every NPC gets a stable, distinct look across renders/sessions without
// hand-authoring appearance fields on every one of the game's NPCs —
// including the many generated "filler" NPCs scattered through houses.
// drawHair and drawSprite live here so they can be shared between the
// in-game renderer and the character-customization preview canvas.

export type HairStyle = 'bald' | 'buzz' | 'short' | 'long' | 'ponytail' | 'spiky' | 'mohawk';
export type Accessory = 'none' | 'glasses' | 'beard' | 'earrings';

export interface SpriteAppearance {
  cloth: string;
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  eye: string;
  bodyW: number;
  bodyH: number;
  headSize: number;
  accessory: Accessory;
  hat?: boolean; // player customization — draws a simple cap over hair
}

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: readonly T[], h: number, salt: number): T {
  return arr[Math.floor(h / (salt || 1)) % arr.length];
}

export const SKIN_TONES = ['#f2d0a9', '#e8b788', '#d39c68', '#b97f4d', '#8d5f3c', '#6b4530'] as const;
export const HAIR_COLORS = ['#1a1a1a', '#3a2a1c', '#5c3a21', '#8a5a2e', '#c9a24c', '#e8dcc0', '#8c8c8c', '#5a5a5a', '#7a2020'] as const;
export const HAIR_STYLES: readonly HairStyle[] = ['bald', 'buzz', 'short', 'long', 'ponytail', 'spiky', 'mohawk'];
export const EYE_COLORS = ['#080808', '#2b1a0e', '#25405c', '#2f4d33'] as const;
export const ACCESSORIES: readonly Accessory[] = ['none', 'none', 'none', 'glasses', 'beard', 'earrings'];
export const CLOTH_COLORS = [
  '#f0f0f0', '#c0d0e8', '#52a0e0', '#52c066', '#e05252',
  '#d4a054', '#8c52e0', '#e08840', '#404040', '#e0c840', '#40b0b0', '#c060a0',
] as const;

function jitterColor(hex: string, amount: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((n >> 16) & 0xff) + amount);
  const g = clamp(((n >> 8) & 0xff) + amount * 0.7);
  const b = clamp((n & 0xff) + amount * 0.5);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** Fixed "no variation" appearance used for the player sprite (unchanged look). */
export const PLAYER_APPEARANCE: SpriteAppearance = {
  cloth: '#f0f0f0', skin: '#f2d0a9', hair: '#1a1a1a', hairStyle: 'short', eye: '#080808',
  bodyW: 16, bodyH: 16, headSize: 12, accessory: 'none', hat: false,
};

const appearanceCache = new Map<string, SpriteAppearance>();

export function getNpcAppearance(id: string, baseColor: string): SpriteAppearance {
  const cacheKey = `${id}|${baseColor}`;
  const cached = appearanceCache.get(cacheKey);
  if (cached) return cached;

  const h = hashStr(id);
  const jitterAmt = ((h >>> 3) % 41) - 20;
  const appearance: SpriteAppearance = {
    cloth: jitterColor(baseColor, jitterAmt),
    skin: pick(SKIN_TONES, h, 2),
    hair: pick(HAIR_COLORS, h, 8),
    hairStyle: pick(HAIR_STYLES, h, 32),
    eye: pick(EYE_COLORS, h, 128),
    bodyW: 15 + (h % 3),
    bodyH: 15 + ((h >>> 5) % 4),
    headSize: 11 + ((h >>> 9) % 2),
    accessory: pick(ACCESSORIES, h, 512),
  };
  appearanceCache.set(cacheKey, appearance);
  return appearance;
}

// ── Shared sprite drawing — used by both in-game renderer and preview canvas ──

export function drawHair(ctx: CanvasRenderingContext2D, hxL: number, hyT: number, hs: number, color: string, style: HairStyle) {
  ctx.fillStyle = color;
  switch (style) {
    case 'bald':
      break;
    case 'buzz':
      ctx.fillRect(hxL, hyT - 1, hs, 3);
      break;
    case 'short':
      ctx.fillRect(hxL - 1, hyT - 2, hs + 2, 4);
      ctx.fillRect(hxL - 1, hyT, 2, hs * 0.4);
      ctx.fillRect(hxL + hs - 1, hyT, 2, hs * 0.4);
      break;
    case 'long':
      ctx.fillRect(hxL - 1, hyT - 2, hs + 2, 4);
      ctx.fillRect(hxL - 2, hyT, 3, hs + 3);
      ctx.fillRect(hxL + hs - 1, hyT, 3, hs + 3);
      break;
    case 'ponytail':
      ctx.fillRect(hxL - 1, hyT - 2, hs + 2, 4);
      ctx.fillRect(hxL + hs, hyT + 1, 3, hs * 0.9);
      break;
    case 'spiky':
      for (let i = 0; i < 3; i++) ctx.fillRect(hxL + i * (hs / 3), hyT - 4, hs / 3 - 1, 5);
      break;
    case 'mohawk':
      ctx.fillRect(hxL + hs * 0.35, hyT - 5, hs * 0.3, 6);
      break;
  }
}

/**
 * Draw a pixel-art character sprite.
 * @param hat — override: pass true/false for NPCs (e.g. Maren wears a hat).
 *              For the player, omit and the function uses ap.hat.
 */
export function drawSprite(ctx: CanvasRenderingContext2D, wx: number, wy: number, ap: SpriteAppearance, hat?: boolean) {
  const useHat = hat !== undefined ? hat : (ap.hat ?? false);
  const px = wx + 16; const py = wy + 8;
  const cx = px + 8;

  // body — width/height vary slightly per NPC; bottom edge stays fixed
  const bw = ap.bodyW; const bh = ap.bodyH;
  const bodyBottom = py + 4 + 16;
  const bx = cx - bw / 2; const by = bodyBottom - bh;
  ctx.fillStyle = ap.cloth; ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = '#111111'; ctx.lineWidth = 1; ctx.strokeRect(bx, by, bw, bh);

  // head
  const hs = ap.headSize;
  const headBottom = py + 8;
  const hxL = cx - hs / 2; const hyT = headBottom - hs;
  ctx.fillStyle = ap.skin; ctx.fillRect(hxL, hyT, hs, hs);
  ctx.strokeStyle = '#111111'; ctx.strokeRect(hxL, hyT, hs, hs);

  // eyes
  ctx.fillStyle = ap.eye;
  ctx.fillRect(hxL + hs * 0.2, hyT + hs * 0.4, hs * 0.22, hs * 0.22);
  ctx.fillRect(hxL + hs * 0.58, hyT + hs * 0.4, hs * 0.22, hs * 0.22);

  // hat or hair (mutually exclusive)
  if (useHat) {
    ctx.fillStyle = '#555555';
    ctx.fillRect(hxL - 1, hyT - 3, hs + 2, 3); // brim
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(hxL + 1, hyT - 7, hs - 2, 5);  // crown
  } else {
    drawHair(ctx, hxL, hyT, hs, ap.hair, ap.hairStyle);
  }

  // facial accessory
  if (ap.accessory === 'glasses') {
    ctx.strokeStyle = '#111111'; ctx.lineWidth = 1;
    ctx.strokeRect(hxL + hs * 0.14, hyT + hs * 0.36, hs * 0.32, hs * 0.28);
    ctx.strokeRect(hxL + hs * 0.54, hyT + hs * 0.36, hs * 0.32, hs * 0.28);
  } else if (ap.accessory === 'beard') {
    ctx.fillStyle = ap.hair;
    ctx.fillRect(hxL + hs * 0.15, hyT + hs * 0.7, hs * 0.7, hs * 0.3);
  } else if (ap.accessory === 'earrings') {
    ctx.fillStyle = '#e8d98a';
    ctx.fillRect(hxL - 2, hyT + hs * 0.5, 2, 2); ctx.fillRect(hxL + hs, hyT + hs * 0.5, 2, 2);
  }
}
