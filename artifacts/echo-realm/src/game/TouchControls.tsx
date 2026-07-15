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

  const dpadBtn = "flex items-center justify-center select-none touch-none active:bg-[#a855f7]/40 bg-[#1a0f2e] border-2 border-[#3a205e] text-[#c084fc] text-xl font-bold rounded";
  const actionBtn = "flex items-center justify-center select-none touch-none active:bg-[#a855f7]/40 bg-[#1a0f2e] border-2 border-[#a855f7] text-[#e9d5ff] font-bold rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]";

  return (
    <div className="w-full max-w-[768px] mt-3 flex items-center justify-between px-2 select-none" style={{ touchAction: 'none' }}>
      {/* D-pad */}
      <div className="grid grid-cols-3 grid-rows-3 gap-1 w-36 h-36">
        <div />
        <button aria-label="Up" className={dpadBtn} {...bind('ArrowUp')}>▲</button>
        <div />
        <button aria-label="Left" className={dpadBtn} {...bind('ArrowLeft')}>◀</button>
        <div />
        <button aria-label="Right" className={dpadBtn} {...bind('ArrowRight')}>▶</button>
        <div />
        <button aria-label="Down" className={dpadBtn} {...bind('ArrowDown')}>▼</button>
        <div />
      </div>

      {/* Menu / inventory / quest log */}
      <div className="flex flex-col gap-2 items-center">
        <button aria-label="Menu" className={`${dpadBtn} w-14 h-9 text-xs`} {...bind('Escape')}>MENU</button>
        <button aria-label="Inventory" className={`${dpadBtn} w-14 h-9 text-xs`} {...bind('i')}>ITEM</button>
        <button aria-label="Quest Log" className={`${dpadBtn} w-14 h-9 text-xs`} {...bind('q')}>QUEST</button>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 w-28">
        <button aria-label="Cancel" className={`${actionBtn} w-14 h-14 col-start-1`} {...bind('x')}>B</button>
        <button aria-label="Confirm" className={`${actionBtn} w-14 h-14 col-start-2 -mt-6`} {...bind([' ', 'z', 'Enter'])}>A</button>
      </div>
    </div>
  );
}
