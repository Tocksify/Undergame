import React, { useEffect, useRef } from 'react';
import { GameStateData, GameMode } from './types';
import { INITIAL_STATE } from './constants';
import { updateGame } from './engine';
import { renderGame } from './renderer';

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameStateData>(JSON.parse(JSON.stringify(INITIAL_STATE)));

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
      updateGame(stateRef.current);
      renderGame(ctx, stateRef.current);
      stateRef.current.prevKeys = { ...stateRef.current.keys };
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative shadow-[0_0_50px_rgba(168,85,247,0.3)] rounded-lg overflow-hidden">
      <canvas 
        ref={canvasRef} 
        width={768} 
        height={576} 
        className="block bg-[#0f0518] border-4 border-[#3a205e]"
      />
    </div>
  );
}