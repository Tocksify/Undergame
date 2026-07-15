import React, { useCallback, useEffect, useRef, useState } from 'react';
import Game from './game/Game';
import CharacterCustomization from './game/CharacterCustomization';
import { GameStateData } from './game/types';
import { buildInitialState, serializeGameState, summarizeSavedState } from './game/save';
import { audio } from './game/audio';
import { SpriteAppearance } from './game/npcAppearance';
import { ErsavFile, loadSlot, saveSlot, exportErsav } from './ersav';
import MainMenu from './MainMenu';
import SaveSlots from './SaveSlots';
import Options from './Options';
import Extras from './Extras';
import './index.css';

type Screen = 'menu' | 'slots' | 'customization' | 'game' | 'options' | 'extras';

function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [initialState, setInitialState] = useState<GameStateData | null>(null);
  const menuAudioRef = useRef<HTMLAudioElement | null>(null);

  // ── Menu music (MP3) ───────────────────────────────────────────────
  // Play whenever we're not in-game; pause the moment the game starts.
  useEffect(() => {
    if (screen === 'game') {
      menuAudioRef.current?.pause();
      return;
    }
    if (!menuAudioRef.current) {
      const el = new Audio('/MainMenu.mp3');
      el.loop = true;
      el.volume = 0.55;
      menuAudioRef.current = el;
    }
    menuAudioRef.current.play().catch(() => { /* autoplay blocked — user will hear on first click */ });
  }, [screen]);

  // ── Slot selection ────────────────────────────────────────────────
  const startSlot = useCallback((slot: number, existing: ErsavFile | null) => {
    setActiveSlot(slot);
    if (!existing) {
      setScreen('customization');
      return;
    }
    setInitialState(buildInitialState(existing.state, false));
    setScreen('game');
  }, []);

  // ── Load from .ersav file (no slot — soft-fail on autosave) ───────
  const startFromFile = useCallback((save: ErsavFile) => {
    setActiveSlot(null);
    setInitialState(buildInitialState(save.state, false));
    setScreen('game');
  }, []);

  // ── Character customization confirms into a new game ──────────────
  const confirmCustomization = useCallback((appearance: SpriteAppearance) => {
    const state = buildInitialState(null, false);
    state.player.appearance = appearance;
    setInitialState(state);
    setScreen('game');
  }, []);

  // ── In-game save (writes to the active localStorage slot) ─────────
  const onSave = useCallback(async (state: GameStateData) => {
    if (!activeSlot) return; // loaded from file — soft fail, skip autosave
    const saved = serializeGameState(state);
    const existing = loadSlot(activeSlot);
    saveSlot(activeSlot, {
      version: 1,
      name: existing?.name ?? `Save ${activeSlot}`,
      summary: summarizeSavedState(saved),
      savedAt: new Date().toISOString(),
      state: saved,
    });
  }, [activeSlot]);

  // ── Exit game (back to saves screen) ─────────────────────────────
  const onExit = useCallback(() => {
    setInitialState(null);
    setActiveSlot(null);
    setScreen('slots');
  }, []);

  // ── End-of-legacy (story complete — wipe slot and return) ─────────
  const onEndLegacy = useCallback(() => {
    setInitialState(null);
    setActiveSlot(null);
    setScreen('menu');
  }, []);

  // ── Screens ───────────────────────────────────────────────────────
  if (screen === 'menu') {
    return (
      <MainMenu
        onPlay={() => setScreen('slots')}
        onOptions={() => setScreen('options')}
        onExtras={() => setScreen('extras')}
        onQuit={() => { audio.playSfx('cancel'); window.location.reload(); }}
      />
    );
  }

  if (screen === 'slots') {
    return (
      <SaveSlots
        onBack={() => setScreen('menu')}
        onStartSlot={startSlot}
        onStartFromFile={startFromFile}
      />
    );
  }

  if (screen === 'customization') {
    return (
      <div className="fullscreen-black">
        <CharacterCustomization
          onConfirm={confirmCustomization}
          onBack={() => setScreen('slots')}
        />
      </div>
    );
  }

  if (screen === 'game' && initialState) {
    return (
      <div className="fullscreen-black">
        <Game
          initialState={initialState}
          onSave={onSave}
          onExit={onExit}
          onEndLegacy={onEndLegacy}
        />
      </div>
    );
  }

  if (screen === 'options') return <Options onBack={() => setScreen('menu')} />;
  if (screen === 'extras') return <Extras onBack={() => setScreen('menu')} />;

  return null;
}

export default App;
