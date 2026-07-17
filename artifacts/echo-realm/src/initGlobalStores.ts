// ── Global Store Initialiser ──────────────────────────────────────────
// When running in Electron, reads the earned arrays from the gamedata
// folder files (Achievements.json / ChallengeItems.json) and merges
// them into localStorage so the existing store functions work unchanged.
//
// Merge strategy: any ID present in the file but absent in localStorage
// is added. IDs already in localStorage are left alone, so in-game
// progress is never lost.
//
// Call once at startup, before React renders.

declare global {
  interface Window {
    electronAPI?: {
      isElectron: boolean;
      readGamedataAchievements:    () => Promise<string[]>;
      readGamedataChallengeItems:  () => Promise<string[]>;
      writeGamedataAchievements:   (earned: string[]) => Promise<void>;
      writeGamedataChallengeItems: (earned: string[]) => Promise<void>;
    };
  }
}

function mergeIntoLocalStorage(key: string, incoming: string[]): void {
  if (!incoming.length) return;
  try {
    const existing: string[] = JSON.parse(localStorage.getItem(key) ?? '[]');
    const merged = Array.from(new Set([...existing, ...incoming]));
    localStorage.setItem(key, JSON.stringify(merged));
  } catch {
    // If localStorage is unavailable, silently skip.
  }
}

export async function initGlobalStores(): Promise<void> {
  if (!window.electronAPI?.isElectron) return;

  const [achievements, challengeItems] = await Promise.all([
    window.electronAPI.readGamedataAchievements(),
    window.electronAPI.readGamedataChallengeItems(),
  ]);

  mergeIntoLocalStorage('er-achievements',        achievements);
  mergeIntoLocalStorage('er-challenge-items-v1',  challengeItems);
}
