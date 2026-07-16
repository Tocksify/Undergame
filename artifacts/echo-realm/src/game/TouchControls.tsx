import React, { useCallback, useRef } from 'react';
import { GameStateData } from './types';
import { audio } from './audio';

interface TouchControlsProps {
  stateRef: React.MutableRefObject<GameStateData>;
}

// On-screen touch controls for mobile/tablet play. engine.ts checks different
// but overlapping key names depending on game mode (e.g. the title screen
// only accepts ' ' or 'Enter', while dialogue/menus accept ' ' or 'z') — so
// each logical action here presses every key name that any mode treats as
// that action, acting as a translator between "touch button" and "keyboard key".
export default function TouchControls({ stateRef }: TouchControlsProps) {
  const activeKeys = useRef<Set<string>>(new Set());

  const setKeys = useCallback((keys: string[], pressed: boolean) => {
    for (const key of keys) {
      stateRef.current.keys[key] = pressed;
      if (pressed) activeKeys.current.add(key);
      else activeKeys.current.delete(key);
    }
  }, [stateRef]);

  const bind = (key: string | string[]) => {
    const keys = Array.isArray(key) ? key : [key];
    return {
      onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); audio.playSfx('click'); setKeys(keys, true); },
      onPointerUp: (e: React.PointerEvent) => { e.preventDefault(); setKeys(keys, false); },
      onPointerEnter: (e: React.PointerEvent) => { if (e.pointerType === 'mouse') audio.playSfx('hover'); },
      onPointerLeave: (e: React.PointerEvent) => { e.preventDefault(); setKeys(keys, false); },
      onPointerCancel: (e: React.PointerEvent) => { e.preventDefault(); setKeys(keys, false); },
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    };
  };

  // ── Shared button styles (noir: black bg, white border/text) ──────
  const dpad = [
    'flex items-center justify-center select-none touch-none rounded',
    'bg-black border border-[#3a3a3a] text-white text-lg font-bold',
    'active:bg-white active:text-black transition-colors',
  ].join(' ');

  const util = [
    'flex items-center justify-center select-none touch-none rounded',
    'bg-black border border-[#2e2e2e] text-[#999] text-[10px] tracking-widest',
    'active:bg-white active:text-black transition-colors',
  ].join(' ');

  const action = [
    'flex items-center justify-center select-none touch-none rounded-full',
    'bg-black border-2 border-[#555] text-white font-bold shadow-[0_0_8px_rgba(255,255,255,0.08)]',
    'active:bg-white active:text-black transition-colors',
  ].join(' ');

  return (
    <div
      className="w-full max-w-[768px] mt-3 flex items-center justify-between px-2 select-none"
      style={{ touchAction: 'none' }}
    >
      {/* D-pad */}
      <div className="grid grid-cols-3 grid-rows-3 gap-1 w-36 h-36">
        <div />
        <button aria-label="Up"    className={dpad} {...bind('ArrowUp')}>▲</button>
        <div />
        <button aria-label="Left"  className={dpad} {...bind('ArrowLeft')}>◀</button>
        <div />
        <button aria-label="Right" className={dpad} {...bind('ArrowRight')}>▶</button>
        <div />
        <button aria-label="Down"  className={dpad} {...bind('ArrowDown')}>▼</button>
        <div />
      </div>

      {/* Utility buttons — 2 rows of 3 / 2 */}
      <div className="grid grid-cols-3 gap-1">
        <button aria-label="Menu"      className={`${util} w-14 h-9`} {...bind('Escape')}>MENU</button>
        <button aria-label="Inventory" className={`${util} w-14 h-9`} {...bind('i')}>ITEM</button>
        <button aria-label="Quest Log" className={`${util} w-14 h-9`} {...bind('q')}>QUEST</button>
        <button aria-label="Stats"     className={`${util} w-14 h-9`} {...bind('m')}>STATS</button>
        <button aria-label="Memory Transit" className={`${util} w-14 h-9`} {...bind('n')}>TRNST</button>
        <button aria-label="Skills"    className={`${util} w-14 h-9`} {...bind('k')}>SKILL</button>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 w-28">
        <button aria-label="Cancel"  className={`${action} w-14 h-14 col-start-1`}      {...bind('x')}>B</button>
        <button aria-label="Confirm" className={`${action} w-14 h-14 col-start-2 -mt-6`} {...bind([' ', 'z', 'Enter'])}>A</button>
      </div>
    </div>
  );
}
