import React, { useEffect, useRef, useState } from 'react';
import { GameStateData } from './types';
import { updateGame } from './engine';
import { renderGame } from './renderer';
import TouchControls from './TouchControls';

interface GameProps {
  initialState: GameStateData;
  onSave: (state: GameStateData) => Promise<void> | void;
  onExit: () => void;
}

export default function Game({ initialState, onSave, onExit }: GameProps) {
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

    const loop = () => {
      const state = stateRef.current;
      updateGame(state);

      if (state.saveRequested && !savingRef.current) {
        savingRef.current = true;
        state.saveRequested = false;
        Promise.resolve(onSave(state))
          .then(() => { state.uiMessage = "Progress saved."; state.uiMessageTimer = 120; })
          .catch(() => { state.uiMessage = "Save failed. Check your connection."; state.uiMessageTimer = 150; })
          .finally(() => { savingRef.current = false; });
      }
      if (state.exitRequested) {
        state.exitRequested = false;
        onExit();
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
    };
  }, [onSave, onExit]);

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
