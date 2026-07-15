// ── ERSAV — local save file management ───────────────────────────────
// Saves are stored in localStorage for quick-slot use, and can be
// exported / imported as .ersav files (JSON with a custom extension)
// for PC-local persistence and community sharing.

import { SavedGameState } from './game/save';

export interface ErsavFile {
  version: 1;
  name: string;
  summary: string;
  savedAt: string; // ISO-8601
  state: SavedGameState;
}

const slotKey = (slot: number) => `er-save-${slot}`;

export function loadSlot(slot: number): ErsavFile | null {
  try {
    const raw = localStorage.getItem(slotKey(slot));
    return raw ? (JSON.parse(raw) as ErsavFile) : null;
  } catch {
    return null;
  }
}

export function saveSlot(slot: number, data: ErsavFile): void {
  try { localStorage.setItem(slotKey(slot), JSON.stringify(data)); } catch { /* soft fail */ }
}

export function deleteSlot(slot: number): void {
  try { localStorage.removeItem(slotKey(slot)); } catch { /* soft fail */ }
}

/** Trigger a browser download of the save as a .ersav file. */
export function exportErsav(save: ErsavFile): void {
  const safeName = (save.name || 'save').replace(/[^a-z0-9_\-]/gi, '_');
  const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeName}.ersav`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Open a file picker for .ersav files and parse the selection. */
export function importErsav(): Promise<ErsavFile | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.ersav';

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) { resolve(null); return; }
      const reader = new FileReader();
      reader.onload = () => {
        try { resolve(JSON.parse(reader.result as string) as ErsavFile); }
        catch { resolve(null); }
      };
      reader.onerror = () => resolve(null);
      reader.readAsText(file);
    };

    // Some browsers fire cancel, others just never fire onchange
    input.oncancel = () => resolve(null);

    document.body.appendChild(input);
    input.click();
    // Small delay before removing so the dialog has a chance to open
    setTimeout(() => { try { document.body.removeChild(input); } catch { /* already removed */ } }, 500);
  });
}
