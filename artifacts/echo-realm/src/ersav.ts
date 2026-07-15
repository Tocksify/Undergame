// ── ERSAV — save slot management ─────────────────────────────────────
// Two backends, same async API:
//   • Electron — file system via IPC (window.electronAPI)
//   • Browser  — localStorage fallback (dev server / web play)
//
// Slot layout on disk (Electron):
//   saves/<slot-id>/progress.ersav

import { SavedGameState } from './game/save';

// ── Types ──────────────────────────────────────────────────────────────

/** Portable save file format — what lives inside progress.ersav / .ersav exports. */
export interface ErsavFile {
  version: 1;
  name: string;
  summary: string;
  savedAt: string; // ISO-8601
  state: SavedGameState;
}

/** An ErsavFile that has been assigned a slot ID. */
export interface LocalSlot extends ErsavFile {
  id: string;
}

// ── Electron detection ────────────────────────────────────────────────

function el() {
  return typeof window !== 'undefined' ? window.electronAPI : undefined;
}

// ── localStorage helpers (browser fallback) ───────────────────────────

const INDEX_KEY = 'er-save-index';
const lsKey     = (id: string) => `er-save-${id}`;

function lsGetIndex(): string[] {
  try { return JSON.parse(localStorage.getItem(INDEX_KEY) ?? '[]'); }
  catch { return []; }
}
function lsSetIndex(ids: string[]) {
  try { localStorage.setItem(INDEX_KEY, JSON.stringify(ids)); } catch {}
}
function lsRead(id: string): LocalSlot | null {
  try {
    const raw = localStorage.getItem(lsKey(id));
    return raw ? { ...JSON.parse(raw) as ErsavFile, id } : null;
  } catch { return null; }
}
function lsWrite(slot: LocalSlot) {
  try { localStorage.setItem(lsKey(slot.id), JSON.stringify(slot)); } catch {}
}

/** One-time migration from the old fixed-slot (er-save-1/2/3) format. */
function lsMigrateOld() {
  const index = lsGetIndex();
  const newIds: string[] = [];
  for (const n of [1, 2, 3]) {
    const oldKey = `er-save-${n}`;
    try {
      const raw = localStorage.getItem(oldKey);
      if (!raw) continue;
      const id = `migrated-${n}`;
      if (index.includes(id)) { localStorage.removeItem(oldKey); continue; }
      lsWrite({ ...JSON.parse(raw) as ErsavFile, id });
      newIds.push(id);
      localStorage.removeItem(oldKey);
    } catch {}
  }
  if (newIds.length) lsSetIndex([...newIds, ...index]);
}

// ── Public async API ──────────────────────────────────────────────────

/** Return all slots, sorted most-recently-saved first. */
export async function listSlots(): Promise<LocalSlot[]> {
  const e = el();
  if (e) return e.listSlots() as Promise<LocalSlot[]>;
  lsMigrateOld();
  const slots = lsGetIndex().map(lsRead).filter(Boolean) as LocalSlot[];
  return slots.sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
}

/** Get one slot by ID. */
export async function getSlotById(id: string): Promise<LocalSlot | null> {
  const e = el();
  if (e) return e.getSlot(id) as Promise<LocalSlot | null>;
  return lsRead(id);
}

/** Create a new slot. Returns the new slot ID. */
export async function createSlot(data: ErsavFile): Promise<string> {
  const e = el();
  if (e) return e.createSlot(data) as Promise<string>;
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  lsWrite({ ...data, id });
  lsSetIndex([...lsGetIndex(), id]);
  return id;
}

/** Overwrite a slot's data (autosave). */
export async function updateSlot(id: string, data: ErsavFile): Promise<void> {
  const e = el();
  if (e) { await e.updateSlot(id, data); return; }
  lsWrite({ ...data, id });
}

/** Update only the name field. */
export async function renameSlot(id: string, name: string): Promise<void> {
  const e = el();
  if (e) { await e.renameSlot(id, name); return; }
  const slot = lsRead(id);
  if (slot) lsWrite({ ...slot, name });
}

/** Permanently delete a slot. */
export async function deleteSlotById(id: string): Promise<void> {
  const e = el();
  if (e) { await e.deleteSlot(id); return; }
  lsSetIndex(lsGetIndex().filter(x => x !== id));
  try { localStorage.removeItem(lsKey(id)); } catch {}
}

// ── File I/O ──────────────────────────────────────────────────────────

/** Export a slot as a .ersav file (native dialog in Electron, download in browser). */
export async function exportErsav(slot: LocalSlot): Promise<void> {
  const e = el();
  if (e) { await e.exportErsav(slot); return; }
  // Browser: trigger a download
  const { id: _id, ...file } = slot;
  const safeName = (slot.name || 'save').replace(/[^a-z0-9_\-]/gi, '_');
  const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `${safeName}.ersav`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

/** Import a .ersav file (native dialog in Electron, file-picker in browser). */
export async function importErsav(): Promise<ErsavFile | null> {
  const e = el();
  if (e) return e.importErsav() as Promise<ErsavFile | null>;
  // Browser fallback
  return new Promise<ErsavFile | null>((resolve) => {
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
