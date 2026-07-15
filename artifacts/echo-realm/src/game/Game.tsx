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
  // App.tsx deletes the active save slot, then exits back to the slot list.
  onEndLegacy: () => void;
}

export default function Game({ initialState, onSave, onExit, onEndLegacy }: GameProps) {
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
  }, [onSave, onExit, onEndLegacy]);

  return (
    <div className="flex flex-col items-center w-full max-w-[768px]">
      <div className="relative shadow-[0_0_50px_rgba(168,85,247,0.3)] rounded-lg overflow-hidden w-full">
        <canvas
          ref={canvasRef}
          width={768}
          height={576}
          className="block bg-[#0f0518] border-4 border-[#3a205e] w-full h-auto"
        />
      </div>
      {isTouchDevice && <TouchControls stateRef={stateRef} />}
    </div>
  );
}
