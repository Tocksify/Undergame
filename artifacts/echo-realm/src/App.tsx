import React, { useCallback, useEffect, useRef, useState } from 'react';
import Game from './game/Game';
import CharacterCustomization from './game/CharacterCustomization';
import { GameStateData } from './game/types';
import { buildInitialState, serializeGameState, summarizeSavedState } from './game/save';
import { audio } from './game/audio';
import { SpriteAppearance } from './game/npcAppearance';
import {
  ErsavFile, LocalSlot,
  createSlot, updateSlot, getSlotById,
} from './ersav';
import MainMenu from './MainMenu';
import SaveSlots from './SaveSlots';
import Options from './Options';
import Extras from './Extras';
import './index.css';

type Screen = 'menu' | 'slots' | 'customization' | 'game' | 'options' | 'extras';

function App() {
  const [screen, setScreen]             = useState<Screen>('menu');
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [initialState, setInitialState] = useState<GameStateData | null>(null);
  const menuAudioRef = useRef<HTMLAudioElement | null>(null);

  // ── Menu music (MP3) ─────────────────────────────────────────────
  useEffect(() => {
    if (screen === 'game') {
      menuAudioRef.current?.pause();
      return;
    }
    if (!menuAudioRef.current) {
      const el = new Audio('/MainMenu.mp3');
      el.loop = true; el.volume = 0.55;
      menuAudioRef.current = el;
    }
    menuAudioRef.current.play().catch(() => {});
  }, [screen]);

  // ── Load an existing slot ────────────────────────────────────────
  const handleLoadSlot = useCallback((slot: LocalSlot) => {
    setActiveSlotId(slot.id);
    setInitialState(buildInitialState(slot.state, false));
    setScreen('game');
  }, []);

  // ── Start a new game (opens customization first) ─────────────────
  const handleNewSlot = useCallback(() => {
    setActiveSlotId(null); // slot created after customization
    setScreen('customization');
  }, []);

  // ── Import .ersav → creates a new named slot automatically ───────
  const handleLoadFromFile = useCallback((file: ErsavFile) => {
    const date = new Date().toLocaleDateString('en-US', {
      month: '2-digit', day: '2-digit', year: 'numeric',
    });
    const id = createSlot({
      ...file,
      name: `Loaded File ${date}`,
      savedAt: new Date().toISOString(),
    });
    setActiveSlotId(id);
    setInitialState(buildInitialState(file.state, false));
    setScreen('game');
  }, []);

  // ── Customization done → create slot with initial state ──────────
  const confirmCustomization = useCallback((appearance: SpriteAppearance) => {
    const state = buildInitialState(null, false);
    state.player.appearance = appearance;

    const serialized = serializeGameState(state);
    const id = createSlot({
      version: 1,
      name: 'New Save',
      summary: summarizeSavedState(serialized),
      savedAt: new Date().toISOString(),
      state: serialized,
    });

    setActiveSlotId(id);
    setInitialState(state);
    setScreen('game');
  }, []);

  // ── Autosave ─────────────────────────────────────────────────────
  const onSave = useCallback(async (state: GameStateData) => {
    if (!activeSlotId) return;
    const saved   = serializeGameState(state);
    const existing = getSlotById(activeSlotId);
    updateSlot(activeSlotId, {
      version: 1,
      name: existing?.name ?? 'Save',
      summary: summarizeSavedState(saved),
      savedAt: new Date().toISOString(),
      state: saved,
    });
  }, [activeSlotId]);

  // ── Exit game → back to save slots ───────────────────────────────
  const onExit = useCallback(() => {
    setInitialState(null);
    setActiveSlotId(null);
    setScreen('slots');
  }, []);

  // ── End-of-legacy → wipe slot, return to menu ────────────────────
  const onEndLegacy = useCallback(() => {
    setInitialState(null);
    setActiveSlotId(null);
    setScreen('menu');
  }, []);

  // ── Screens ──────────────────────────────────────────────────────
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
        onLoadSlot={handleLoadSlot}
        onNewSlot={handleNewSlot}
        onLoadFromFile={handleLoadFromFile}
      />
    );
  }

  if (screen === 'customization') {
    return (
      <CharacterCustomization
        onConfirm={confirmCustomization}
        onBack={() => setScreen('slots')}
      />
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
  if (screen === 'extras') return <Extras  onBack={() => setScreen('menu')} />;

  return null;
}

export default App;
