// ── Codex Store (Global Bestiary) ─────────────────────────────────────
// Stores bestiary encounter counts globally across all save slots.
// Enemies you study on any character are added to the global codex.
// The codex only ever increases — it's a high-water mark per enemy.

const STORE_KEY = 'er-codex';

export function getGlobalCodex(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? '{}') as Record<string, number>;
  } catch {
    return {};
  }
}

/**
 * Sync a single enemy's count upward in the global codex.
 * Only writes if the new count is higher than what's stored.
 */
export function syncCodexEntry(enemyId: string, count: number): void {
  const codex = getGlobalCodex();
  if ((codex[enemyId] ?? 0) < count) {
    codex[enemyId] = count;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(codex)); } catch { /* noop */ }
  }
}

/**
 * Merge the global codex into a player's bestiary object.
 * Used when loading a save so previously-earned codex progress is visible.
 */
export function mergeCodexIntoPlayer(playerBestiary: Record<string, number>): Record<string, number> {
  const codex = getGlobalCodex();
  const merged = { ...playerBestiary };
  for (const [id, count] of Object.entries(codex)) {
    if ((merged[id] ?? 0) < count) merged[id] = count;
  }
  return merged;
}

/**
 * Sync an entire player bestiary to the global codex.
 * Call this whenever the player's bestiary changes (after battle).
 */
export function syncBestiary(bestiary: Record<string, number>): void {
  const codex = getGlobalCodex();
  let changed = false;
  for (const [id, count] of Object.entries(bestiary)) {
    if ((codex[id] ?? 0) < count) { codex[id] = count; changed = true; }
  }
  if (changed) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(codex)); } catch { /* noop */ }
  }
}
