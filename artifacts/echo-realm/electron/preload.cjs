// ── Echo Realm — Electron Preload ─────────────────────────────────────
// Exposes a safe IPC bridge as window.electronAPI via contextBridge.
// The renderer (React) detects this to switch from localStorage to
// the native file-system save backend.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,

  // ── Slots ──────────────────────────────────────────────────────────
  listSlots:  ()              => ipcRenderer.invoke('er-list-slots'),
  getSlot:    (id)            => ipcRenderer.invoke('er-get-slot',     id),
  createSlot: (data)          => ipcRenderer.invoke('er-create-slot',  data),
  updateSlot: (id, data)      => ipcRenderer.invoke('er-update-slot',  id, data),
  renameSlot: (id, name)      => ipcRenderer.invoke('er-rename-slot',  id, name),
  deleteSlot: (id)            => ipcRenderer.invoke('er-delete-slot',  id),

  // ── File I/O ──────────────────────────────────────────────────────
  exportErsav: (slot)         => ipcRenderer.invoke('er-export-ersav', slot),
  importErsav: ()             => ipcRenderer.invoke('er-import-ersav'),

  // ── Global game data (Achievements + Challenge Items) ─────────────
  readGamedataAchievements:   () => ipcRenderer.invoke('er-read-gamedata-achievements'),
  readGamedataChallengeItems: () => ipcRenderer.invoke('er-read-gamedata-challenge-items'),

  // ── App control ───────────────────────────────────────────────────
  quit: ()                    => ipcRenderer.send('er-quit'),
});
