// ── NPC APPEARANCE ────────────────────────────────────────────────────
// Derives per-NPC visual variety (skin tone, hairstyle, eye color, body
// size, clothing jitter) deterministically from the NPC's id. This means
// every NPC gets a stable, distinct look across renders/sessions without
// hand-authoring appearance fields on every one of the game's NPCs —
// including the many generated "filler" NPCs scattered through houses.

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

const SKIN_TONES = ['#f2d0a9', '#e8b788', '#d39c68', '#b97f4d', '#8d5f3c', '#6b4530'] as const;
const HAIR_COLORS = ['#1a1a1a', '#3a2a1c', '#5c3a21', '#8a5a2e', '#c9a24c', '#e8dcc0', '#8c8c8c', '#5a5a5a', '#7a2020'] as const;
const HAIR_STYLES: readonly HairStyle[] = ['bald', 'buzz', 'short', 'long', 'ponytail', 'spiky', 'mohawk'];
const EYE_COLORS = ['#080808', '#2b1a0e', '#25405c', '#2f4d33'] as const;
const ACCESSORIES: readonly Accessory[] = ['none', 'none', 'none', 'glasses', 'beard', 'earrings'];

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
  cloth: '#f0f0f0', skin: '#f0f0f0', hair: '#000000', hairStyle: 'bald', eye: '#080808',
  bodyW: 16, bodyH: 16, headSize: 12, accessory: 'none',
};

const appearanceCache = new Map<string, SpriteAppearance>();

export function getNpcAppearance(id: string, baseColor: string): SpriteAppearance {
  const cacheKey = `${id}|${baseColor}`;
  const cached = appearanceCache.get(cacheKey);
  if (cached) return cached;

  const h = hashStr(id);
  const jitterAmt = ((h >>> 3) % 41) - 20; // -20..20, keeps clothing recognizably close to its authored color
  const appearance: SpriteAppearance = {
    cloth: jitterColor(baseColor, jitterAmt),
    skin: pick(SKIN_TONES, h, 2),
    hair: pick(HAIR_COLORS, h, 8),
    hairStyle: pick(HAIR_STYLES, h, 32),
    eye: pick(EYE_COLORS, h, 128),
    bodyW: 15 + (h % 3),            // 15-17px (base 16)
    bodyH: 15 + ((h >>> 5) % 4),    // 15-18px (base 16)
    headSize: 11 + ((h >>> 9) % 2), // 11-12px (base 12)
    accessory: pick(ACCESSORIES, h, 512),
  };
  appearanceCache.set(cacheKey, appearance);
  return appearance;
}
