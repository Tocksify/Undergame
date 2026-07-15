// ── ERSAV — local save file management ───────────────────────────────
// Unlimited named save slots stored in localStorage. Each slot has a
// unique string ID. The list of IDs is stored in an index key.
//
// .ersav files are exported without the internal `id` field so they
// stay portable across installs / players.

import { SavedGameState } from './game/save';

// ── Types ─────────────────────────────────────────────────────────────

/** Portable save file format (used for .ersav export/import). */
export interface ErsavFile {
  version: 1;
  name: string;
  summary: string;
  savedAt: string; // ISO-8601
  state: SavedGameState;
}

/** An ErsavFile that lives in a local slot (has an internal ID). */
export interface LocalSlot extends ErsavFile {
  id: string;
}

// ── Internal storage helpers ──────────────────────────────────────────

const INDEX_KEY = 'er-save-index';
const slotKey   = (id: string) => `er-save-${id}`;

function getIndex(): string[] {
  try { return JSON.parse(localStorage.getItem(INDEX_KEY) ?? '[]'); }
  catch { return []; }
}

function setIndex(ids: string[]): void {
  try { localStorage.setItem(INDEX_KEY, JSON.stringify(ids)); } catch {}
}

function readSlot(id: string): LocalSlot | null {
  try {
    const raw = localStorage.getItem(slotKey(id));
    if (!raw) return null;
    return { ...JSON.parse(raw), id } as LocalSlot;
  } catch { return null; }
}

function writeSlot(slot: LocalSlot): void {
  try { localStorage.setItem(slotKey(slot.id), JSON.stringify(slot)); } catch {}
}

/** One-time migration from the old fixed-slot (er-save-1/2/3) format. */
function migrateOldSlots(): void {
  const index = getIndex();
  const newIds: string[] = [];

  for (const n of [1, 2, 3]) {
    const oldKey = `er-save-${n}`;
    try {
      const raw = localStorage.getItem(oldKey);
      if (!raw) continue;
      const data = JSON.parse(raw) as ErsavFile;
      const id = `migrated-slot-${n}`;
      // Don't migrate if already in index
      if (index.includes(id)) { localStorage.removeItem(oldKey); continue; }
      writeSlot({ ...data, id });
      newIds.push(id);
      localStorage.removeItem(oldKey);
    } catch {}
  }

  if (newIds.length) setIndex([...newIds, ...index]);
}

// ── Public API ────────────────────────────────────────────────────────

/** Return all slots in creation order. */
export function listSlots(): LocalSlot[] {
  migrateOldSlots();
  return getIndex().map(readSlot).filter(Boolean) as LocalSlot[];
}

/** Read a single slot by ID. */
export function getSlotById(id: string): LocalSlot | null {
  return readSlot(id);
}

/** Create a new slot. Returns the new slot's ID. */
export function createSlot(data: ErsavFile): string {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const slot: LocalSlot = { ...data, id };
  writeSlot(slot);
  setIndex([...getIndex(), id]);
  return id;
}

/** Overwrite an existing slot's data (preserves ID and position in list). */
export function updateSlot(id: string, data: ErsavFile): void {
  writeSlot({ ...data, id });
}

/** Rename a slot without touching its game state. */
export function renameSlot(id: string, name: string): void {
  const slot = readSlot(id);
  if (slot) writeSlot({ ...slot, name });
}

/** Permanently delete a slot. */
export function deleteSlotById(id: string): void {
  setIndex(getIndex().filter(x => x !== id));
  try { localStorage.removeItem(slotKey(id)); } catch {}
}

// ── File I/O ──────────────────────────────────────────────────────────

/** Trigger a browser download of the save as a .ersav file. */
export function exportErsav(slot: LocalSlot): void {
  // Strip internal `id` from the exported file so it's portable
  const { id: _id, ...file }: { id: string } & ErsavFile = slot;
  const safeName = (slot.name || 'save').replace(/[^a-z0-9_\-]/gi, '_');
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `${safeName}.ersav`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

/** Open a file picker for .ersav files and parse the selection. */
export function importErsav(): Promise<ErsavFile | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.ersav';

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) { resolve(null); return; }
      const reader = new FileReader();
      reader.onload  = () => {
        try { resolve(JSON.parse(reader.result as string) as ErsavFile); }
        catch { resolve(null); }
      };
      reader.onerror = () => resolve(null);
      reader.readAsText(file);
    };
    input.oncancel = () => resolve(null);

    document.body.appendChild(input); input.click();
    setTimeout(() => { try { document.body.removeChild(input); } catch {} }, 500);
  });
}
