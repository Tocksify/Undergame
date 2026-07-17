import React, { useEffect, useRef, useState } from 'react';
import { GameStateData, GameMode } from './types';
import { updateGame } from './engine';
import { renderGame } from './renderer';
import TouchControls from './TouchControls';
import { audio, MODAL_MODES } from './audio';

const CONFIRM_KEYS = [' ', 'z', 'Enter'];
const CANCEL_KEYS = ['Escape', 'x', 'q'];
// Arrow/WASD keys double as movement (silent) in OVERWORLD and as menu
// navigation (audible) everywhere else, so the generic key-sfx below only
// suppresses them while actually walking the map.
const MOVEMENT_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];

interface GameProps {
  initialState: GameStateData;
  onSave: (state: GameStateData) => Promise<void> | void;
  onExit: () => void;
  // Called when the player chooses "End Legacy" on the true-ending screen —
  // App.tsx exits back to the slot list (no deletion).
  onEndLegacy: () => void;
  // Called when the player confirms slot erasure at the end of END_LEGACY_SEQ —
  // App.tsx deletes the active save slot and returns to the main menu.
  onDeleteLegacy: () => void;
  // Called when the player chooses "New Game+" on the true-ending screen —
  // App.tsx opens the NG+ difficulty picker screen.
  onNewGamePlus: () => void;
}

export default function Game({ initialState, onSave, onExit, onEndLegacy, onDeleteLegacy, onNewGamePlus }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameStateData>(initialState);
  const savingRef = useRef(false);
  const [isTouchDevice] = useState(
    () => typeof window !== 'undefined' && (('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia?.('(pointer: coarse)').matches)
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const onKeyDown = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key] = true;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','i','q','Escape','z','x','Enter'].includes(e.key)) {
         e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp);

    let animationFrameId: number;
    let lastLevel = stateRef.current.player.level;

    const loop = () => {
      const state = stateRef.current;
      updateGame(state);

      // Background/battle/ambient music, kept in sync with mode + map each frame
      // (playTrack() no-ops internally if the desired track hasn't changed).
      audio.syncMusic(state);

      // Muffle + quiet the music while any modal UI (inventory, menu, shop,
      // dialogue, etc.) is open, so UI sound effects actually cut through.
      audio.setDucked(MODAL_MODES.has(state.mode));

      // Level-up fanfare — this is a state transition, not a keypress, so it
      // needs its own detection rather than riding on the key-sfx logic below.
      if (state.player.level > lastLevel) audio.playSfx('levelup');
      lastLevel = state.player.level;

      // Discrete "key pressed" UI sound — fires once per rising edge, not per
      // held-key repeat, using the same keys/prevKeys pair engine.ts relies on.
      // Confirm (space/z/enter) and cancel (escape/x/q) get their own distinct
      // tones so equip/use/read and closing a menu are clearly audible.
      let firedSfx = false;
      for (const k of CONFIRM_KEYS) {
        if (state.keys[k] && !state.prevKeys[k]) { audio.playSfx('confirm'); firedSfx = true; break; }
      }
      if (!firedSfx) {
        for (const k of CANCEL_KEYS) {
          if (state.keys[k] && !state.prevKeys[k]) { audio.playSfx('cancel'); firedSfx = true; break; }
        }
      }
      if (!firedSfx) {
        for (const k in state.keys) {
          if (!state.keys[k] || state.prevKeys[k]) continue;
          if (state.mode === GameMode.OVERWORLD && MOVEMENT_KEYS.includes(k)) continue; // silent movement
          audio.playSfx('key');
          break;
        }
      }

      if (state.saveRequested && !savingRef.current) {
        savingRef.current = true;
        state.saveRequested = false;
        const quitAfter = state.quitAfterSave;
        state.quitAfterSave = false;
        Promise.resolve(onSave(state))
          .then(() => {
            if (quitAfter) { onExit(); return; }
            state.uiMessage = "Progress saved."; state.uiMessageTimer = 120;
          })
          .catch(() => { state.uiMessage = "Save failed. Check your connection."; state.uiMessageTimer = 150; })
          .finally(() => { savingRef.current = false; });
      }
      if (state.exitRequested) {
        state.exitRequested = false;
        onExit();
        return; // parent will unmount this component
      }
      if (state.endLegacyRequested) {
        state.endLegacyRequested = false;
        onEndLegacy();
        return; // parent will unmount this component
      }
      if (state.deleteSlotRequested) {
        state.deleteSlotRequested = false;
        onDeleteLegacy();
        return; // parent will unmount this component
      }
      if (state.ngPlusRequested) {
        state.ngPlusRequested = false;
        onNewGamePlus();
        return; // parent will unmount this component
      }

      renderGame(ctx, state);
      state.prevKeys = { ...state.keys };
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      cancelAnimationFrame(animationFrameId);
      // Stop procedural music so it doesn't bleed over the menu MP3.
      audio.stop();
    };
  }, [onSave, onExit, onEndLegacy, onDeleteLegacy, onNewGamePlus]);

  const isElectron = typeof window !== 'undefined' && !!(window as any).electronAPI?.isElectron;

  // ── Electron: letterbox-fill, no chrome ────────────────────────────
  if (isElectron) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
        <canvas
          ref={canvasRef}
          width={768}
          height={576}
          style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated', display: 'block' }}
        />
      </div>
    );
  }

  // ── Mobile (touch device): canvas shrinks to give room for buttons ──
  if (isTouchDevice) {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#000', overflow: 'hidden' }}>
        {/* Canvas area: flex:1 + minHeight:0 means it fills space above the buttons */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <canvas
            ref={canvasRef}
            width={768}
            height={576}
            style={{ maxWidth: '100%', maxHeight: '100%', imageRendering: 'pixelated', display: 'block' }}
          />
        </div>
        <TouchControls stateRef={stateRef} />
      </div>
    );
  }

  // ── Desktop browser: full black fill, no purple TV frame ───────────
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <canvas
        ref={canvasRef}
        width={768}
        height={576}
        style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated', display: 'block' }}
      />
    </div>
  );
}
