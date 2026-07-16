# Echo Realm — Desktop Build (Windows)

This folder contains the build scripts for packaging Echo Realm as a
Windows desktop application (.exe installer + portable .exe).

---

## Requirements (install these first)

| Tool | Download |
|------|----------|
| **Node.js 20 LTS** (includes npm) | https://nodejs.org |
| **Git** | https://git-scm.com |

> You do NOT need Python, Visual Studio, or any other build tools.

---

## How to build

1. **Clone or download the repo** to your Windows PC  
   ```
   git clone <your-repo-url>
   cd <repo-folder>
   ```

2. **Double-click `Desktop-Setup\build.bat`**  
   (or right-click → *Run as administrator* if you see permission errors)

   The script will:
   - Install all Node dependencies
   - Build the game with Vite
   - Package it with Electron into a Windows installer

3. **Find your files in** `artifacts\echo-realm\release\`

   | File | What it is |
   |------|-----------|
   | `Echo Realm Setup.exe` | Installer — picks your install folder, adds a desktop shortcut |
   | `EchoRealm-portable.exe` | Single file — run from anywhere, no install needed |

---

## Troubleshooting

**"node is not recognized"** — Node.js isn't in your PATH. Re-run the Node.js
installer and tick *"Add to PATH"*, then restart your terminal.

**Build hangs on "downloading electron"** — Electron downloads its runtime on
first build (~80 MB). Wait for it to finish; subsequent builds are instant.

**Antivirus blocks the .exe** — The unsigned binary may trigger Windows
Defender SmartScreen. Click *More info → Run anyway* to proceed.

---

## Save files

Save data lives next to the `.exe` in a `saves\` folder (for the portable
version) or in your chosen install directory (for the installer version).
You can back up or move the `saves\` folder freely.
