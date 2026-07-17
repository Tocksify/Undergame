// ── Echo Realm — Electron Main Process ───────────────────────────────
// CJS (.cjs) so it stays CommonJS even inside the "type":"module" workspace.

const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path  = require('path');
const http  = require('http');
const fs    = require('fs');

// ── Paths ─────────────────────────────────────────────────────────────

const distPath = path.join(__dirname, '..', 'dist', 'public');

/** Where save-slot folders live: next to the .exe in production, or
 *  artifacts/echo-realm/saves/ during development. */
function savesDir() {
  return app.isPackaged
    ? path.join(path.dirname(app.getPath('exe')), 'saves')
    : path.join(__dirname, '..', 'saves');
}

function ensureSaves() {
  const d = savesDir();
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  return d;
}

/** Where global game data lives: next to the .exe in production, or
 *  artifacts/echo-realm/gamedata/ during development. */
function gamedataDir() {
  return app.isPackaged
    ? path.join(path.dirname(app.getPath('exe')), 'gamedata')
    : path.join(__dirname, '..', 'gamedata');
}

/** Ensure the gamedata folder exists. If gamedata.json is missing, seed it
 *  with an empty object so the folder is never blank. */
function ensureGamedata() {
  const d = gamedataDir();
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  const f = path.join(d, 'gamedata.json');
  if (!fs.existsSync(f)) fs.writeFileSync(f, '{}', 'utf8');
  return d;
}

// ── Static HTTP server (so /MainMenu.mp3 and all asset paths work) ───

function startServer() {
  const mime = {
    '.html': 'text/html', '.js': 'application/javascript',
    '.mjs': 'application/javascript', '.css': 'text/css',
    '.mp3': 'audio/mpeg', '.svg': 'image/svg+xml',
    '.png': 'image/png', '.ico': 'image/x-icon',
    '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff',
    '.ttf': 'font/ttf',
  };

  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let urlPath = req.url.split('?')[0];
      if (urlPath === '/') urlPath = '/index.html';

      const filePath = path.normalize(path.join(distPath, urlPath));
      // Guard: never escape distPath
      if (!filePath.startsWith(distPath)) { res.writeHead(403); res.end(); return; }

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        // SPA fallback — serve index.html for any unknown route
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(path.join(distPath, 'index.html')).pipe(res);
        return;
      }

      const ext  = path.extname(filePath).toLowerCase();
      const type = mime[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type });
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(0, '127.0.0.1', () => {
      resolve(`http://127.0.0.1:${server.address().port}`);
    });
  });
}

// ── Window ────────────────────────────────────────────────────────────

async function createWindow() {
  const url = await startServer();

  Menu.setApplicationMenu(null); // hide default menu bar

  const win = new BrowserWindow({
    width: 960,
    height: 760,
    minWidth: 700,
    minHeight: 600,
    title: 'Echo Realm',
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL(url);
}

app.whenReady().then(() => {
  ensureGamedata();
  createWindow();
});

ipcMain.on('er-quit', () => app.quit());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ═════════════════════════════════════════════════════════════════════
//  IPC — Save Slot File System
// ═════════════════════════════════════════════════════════════════════

/** Read progress.ersav from a slot folder and return LocalSlot. */
function readSlotFromDisk(id) {
  const p = path.join(savesDir(), id, 'progress.ersav');
  if (!fs.existsSync(p)) return null;
  try { return { ...JSON.parse(fs.readFileSync(p, 'utf8')), id }; }
  catch { return null; }
}

/** List all slots, sorted by most-recently-saved first. */
ipcMain.handle('er-list-slots', () => {
  const dir = ensureSaves();
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isDirectory());

  const slots = entries
    .map(e => readSlotFromDisk(e.name))
    .filter(Boolean);

  slots.sort((a, b) =>
    new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
  return slots;
});

/** Get one slot by id. */
ipcMain.handle('er-get-slot', (_, id) => readSlotFromDisk(id));

/** Create a new slot folder. Returns the new slot id. */
ipcMain.handle('er-create-slot', (_, data) => {
  const id      = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const slotDir = path.join(ensureSaves(), id);
  fs.mkdirSync(slotDir, { recursive: true });
  fs.writeFileSync(path.join(slotDir, 'progress.ersav'), JSON.stringify(data, null, 2));
  return id;
});

/** Overwrite a slot's progress.ersav (autosave). */
ipcMain.handle('er-update-slot', (_, id, data) => {
  const slotDir = path.join(savesDir(), id);
  if (!fs.existsSync(slotDir)) fs.mkdirSync(slotDir, { recursive: true });
  fs.writeFileSync(path.join(slotDir, 'progress.ersav'), JSON.stringify(data, null, 2));
});

/** Rename a slot (updates name field inside progress.ersav, folder stays same). */
ipcMain.handle('er-rename-slot', (_, id, name) => {
  const p = path.join(savesDir(), id, 'progress.ersav');
  if (!fs.existsSync(p)) return;
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  fs.writeFileSync(p, JSON.stringify({ ...data, name }, null, 2));
});

/** Delete a slot folder and everything in it. */
ipcMain.handle('er-delete-slot', (_, id) => {
  const slotDir = path.join(savesDir(), id);
  if (fs.existsSync(slotDir))
    fs.rmSync(slotDir, { recursive: true, force: true });
});

/** Native save dialog — write the slot as a portable .ersav file. */
ipcMain.handle('er-export-ersav', async (event, slot) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const { id: _id, ...file } = slot; // strip internal id
  const safeName = (slot.name || 'save').replace(/[^a-z0-9_\-]/gi, '_');
  const result = await dialog.showSaveDialog(win, {
    title: 'Export Save File',
    defaultPath: `${safeName}.ersav`,
    filters: [{ name: 'Echo Realm Save', extensions: ['ersav'] }],
  });
  if (result.canceled || !result.filePath) return;
  fs.writeFileSync(result.filePath, JSON.stringify(file, null, 2));
});

/** Native open dialog — returns the parsed ErsavFile or null. */
ipcMain.handle('er-import-ersav', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const result = await dialog.showOpenDialog(win, {
    title: 'Load Save File',
    filters: [{ name: 'Echo Realm Save', extensions: ['ersav'] }],
    properties: ['openFile'],
  });
  if (result.canceled || !result.filePaths[0]) return null;
  try { return JSON.parse(fs.readFileSync(result.filePaths[0], 'utf8')); }
  catch { return null; }
});
