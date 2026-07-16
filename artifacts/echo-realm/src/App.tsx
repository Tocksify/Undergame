import React, { useCallback, useEffect, useRef, useState } from 'react';
import Game from './game/Game';
import CharacterCustomization from './game/CharacterCustomization';
import { GameStateData, GameMode } from './game/types';
import { buildInitialState, serializeGameState, summarizeSavedState } from './game/save';
import { TILE_SIZE } from './game/constants';
import { audio } from './game/audio';
import { SpriteAppearance } from './game/npcAppearance';
import { CHALLENGE_EMBLEMS } from './challengeStore';
import {
  ErsavFile, LocalSlot,
  createSlot, updateSlot, getSlotById,
} from './ersav';
import MainMenu from './MainMenu';
import SaveSlots from './SaveSlots';
import Options from './Options';
import Extras from './Extras';
import './index.css';

type Screen = 'menu' | 'slots' | 'customization' | 'game' | 'options' | 'extras' | 'challenge';

function App() {
  const [screen, setScreen]             = useState<Screen>('menu');
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);
  const [initialState, setInitialState] = useState<GameStateData | null>(null);
  const menuAudioRef = useRef<HTMLAudioElement | null>(null);

  // ── Register battle / special MP3 tracks once on mount ───────────
  useEffect(() => {
    audio.registerMp3Track('battle',     '/BattleMusic1.mp3');
    audio.registerMp3Track('battle2',    '/BattleMusic2.mp3');
    audio.registerMp3Track('battle3',    '/BattleMusic3.mp3');
    audio.registerMp3Track('child_void', '/ChildVoidEnemy.mp3');
  }, []);

  // ── Menu music (MP3) ─────────────────────────────────────────────
  useEffect(() => {
    if (screen === 'game') { menuAudioRef.current?.pause(); return; }
    if (!menuAudioRef.current) {
      const el = new Audio('/MainMenu.mp3');
      el.loop = true;
      menuAudioRef.current = el;
      audio.setMenuAudioElement(el); // hands volume control to the audio engine
    }
    menuAudioRef.current.play().catch(() => {});
  }, [screen]);

  // ── Load existing slot ───────────────────────────────────────────
  const handleLoadSlot = useCallback((slot: LocalSlot) => {
    setActiveSlotId(slot.id);
    setInitialState(buildInitialState(slot.state, false));
    setScreen('game');
  }, []);

  // ── New game (go to customization first) ─────────────────────────
  const handleNewSlot = useCallback(() => {
    setActiveSlotId(null);
    setScreen('customization');
  }, []);

  // ── Import .ersav → create a named slot, then play ───────────────
  const handleLoadFromFile = useCallback(async (file: ErsavFile) => {
    const date = new Date().toLocaleDateString('en-US', {
      month: '2-digit', day: '2-digit', year: 'numeric',
    });
    const id = await createSlot({
      ...file,
      name: `Loaded File ${date}`,
      savedAt: new Date().toISOString(),
    });
    setActiveSlotId(id);
    setInitialState(buildInitialState(file.state, false));
    setScreen('game');
  }, []);

  // ── Challenge Mode ───────────────────────────────────────────────
  const handleChallenge = useCallback(() => {
    const state = buildInitialState(null, false);
    state.mapId = 'CHALLENGE_ARENA';
    state.player.x = 9 * TILE_SIZE;
    state.player.y = 9 * TILE_SIZE;
    state.player.targetX = 9 * TILE_SIZE;
    state.player.targetY = 9 * TILE_SIZE;
    state.player.hp = 40;
    state.player.maxHp = 40;
    state.player.inventory.push('tonic');
    state.player.enchantedSlots.push(null);
    state.mode = GameMode.OVERWORLD;
    setActiveSlotId(null);
    setInitialState(state);
    setScreen('challenge');
  }, []);

  // ── Customization done → create slot with initial state ──────────
  const confirmCustomization = useCallback(async (appearance: SpriteAppearance, emblemId?: string) => {
    const state      = buildInitialState(null, false);
    state.player.appearance = appearance;

    // Apply emblem starting buffs if one was selected
    if (emblemId) {
      const emblem = CHALLENGE_EMBLEMS.find((e) => e.id === emblemId);
      if (emblem) {
        if (emblem.buffs.maxHp)  { state.player.maxHp += emblem.buffs.maxHp; state.player.hp += emblem.buffs.maxHp; }
        if (emblem.buffs.str)    state.player.baseStats.str += emblem.buffs.str;
        if (emblem.buffs.vit)    state.player.baseStats.vit += emblem.buffs.vit;
        if (emblem.buffs.def)    state.player.baseStats.def += emblem.buffs.def;
        if (emblem.buffs.echoes) state.player.echoes += emblem.buffs.echoes;
        if (emblem.buffs.item)   { state.player.inventory.push(emblem.buffs.item); state.player.enchantedSlots.push(null); }
      }
    }
    const serialized = serializeGameState(state);
    const id         = await createSlot({
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
    const saved    = serializeGameState(state);
    const existing = await getSlotById(activeSlotId);
    await updateSlot(activeSlotId, {
      version: 1,
      name:    existing?.name ?? 'Save',
      summary: summarizeSavedState(saved),
      savedAt: new Date().toISOString(),
      state:   saved,
    });
  }, [activeSlotId]);

  // ── Exit game ────────────────────────────────────────────────────
  const onExit = useCallback(() => {
    setInitialState(null); setActiveSlotId(null); setScreen('slots');
  }, []);

  // ── Exit challenge mode ──────────────────────────────────────────
  const onChallengeExit = useCallback(() => {
    setInitialState(null); setActiveSlotId(null); setScreen('menu');
  }, []);

  const onEndLegacy = useCallback(() => {
    setInitialState(null); setActiveSlotId(null); setScreen('menu');
  }, []);

  // ── Screens ──────────────────────────────────────────────────────
  if (screen === 'menu') {
    return (
      <MainMenu
        onPlay={() => setScreen('slots')}
        onChallenge={handleChallenge}
        onOptions={() => setScreen('options')}
        onExtras={() => setScreen('extras')}
        onQuit={() => {
          audio.playSfx('cancel');
          if ((window as any).electronAPI?.quit) (window as any).electronAPI.quit();
        }}
      />
    );
  }

  if (screen === 'slots') {
    return (
      <SaveSlots
        onBack={() => setScreen('menu')}
        onLoadSlot={handleLoadSlot}
        onNewSlot={handleNewSlot}
        onLoadFromFile={file => { void handleLoadFromFile(file); }}
      />
    );
  }

  if (screen === 'customization') {
    return (
      <CharacterCustomization
        onConfirm={(appearance, emblemId) => { void confirmCustomization(appearance, emblemId); }}
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

  if (screen === 'challenge' && initialState) {
    return (
      <div className="fullscreen-black">
        <Game
          initialState={initialState}
          onSave={onSave}
          onExit={onChallengeExit}
          onEndLegacy={onChallengeExit}
        />
      </div>
    );
  }

  if (screen === 'options') return <Options onBack={() => setScreen('menu')} />;
  if (screen === 'extras') return <Extras  onBack={() => setScreen('menu')} />;
  return null;
}

export default App;
