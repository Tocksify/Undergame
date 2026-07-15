// ── AUDIO ENGINE ─────────────────────────────────────────────────────
// Fully procedural (no external audio files): background/ambient/battle
// music and UI sound effects are synthesized at runtime with the Web
// Audio API. Safe to import from non-browser contexts (verification
// scripts, SSR) — every entry point no-ops when `window`/AudioContext
// isn't available.
import { GameMode } from './types';

type SfxKind = 'hover' | 'click' | 'key';

interface TrackDef {
  bpm: number;
  chord: number[];           // sustained pad frequencies (Hz)
  chordWave: OscillatorType;
  filterFreq: number;
  volume: number;            // 0-1, overall loudness of this track
  bass?: (number | null)[];  // one entry per step; null = rest
  bassWave?: OscillatorType;
  lead?: (number | null)[];
  leadWave?: OscillatorType;
  stepsPerBeat?: number;     // default 2 (eighth notes)
}

// ── note name -> frequency (equal temperament, A4 = 440Hz) ──
const NOTE_SEMITONE: Record<string, number> = {
  C: -9, 'C#': -8, D: -7, 'D#': -6, E: -5, F: -4, 'F#': -3, G: -2, 'G#': -1, A: 0, 'A#': 1, B: 2,
};
function f(note: string): number {
  const m = /^([A-G]#?)(\d)$/.exec(note);
  if (!m) return 440;
  const oct = parseInt(m[2], 10);
  const semi = NOTE_SEMITONE[m[1]] + (oct - 4) * 12;
  return 440 * Math.pow(2, semi / 12);
}

// ── track catalog ─────────────────────────────────────────────────
const TRACKS: Record<string, TrackDef> = {
  title: {
    bpm: 70, chordWave: 'sine', filterFreq: 1400, volume: 0.5,
    chord: [f('A3'), f('C4'), f('E4')],
    bass: [f('A2'), null, null, null, f('E3'), null, null, null],
    bassWave: 'triangle',
  },
  town_vh: {
    bpm: 96, chordWave: 'sawtooth', filterFreq: 900, volume: 0.4,
    chord: [f('C4'), f('E4'), f('G4')],
    bass: [f('C3'), null, f('G3'), null, f('F3'), null, f('G3'), null],
    bassWave: 'triangle',
    lead: [null, f('E5'), null, null, null, f('G5'), null, null],
    leadWave: 'sine',
  },
  town_ct: {
    bpm: 88, chordWave: 'sawtooth', filterFreq: 750, volume: 0.4,
    chord: [f('D4'), f('F4'), f('A4')],
    bass: [f('D3'), null, null, f('A3'), null, null, f('F3'), null],
    bassWave: 'triangle',
    lead: [null, null, null, null, f('D5'), null, null, null],
    leadWave: 'triangle',
  },
  town_ar: {
    bpm: 80, chordWave: 'sawtooth', filterFreq: 500, volume: 0.42,
    chord: [f('C4'), f('F#4'), f('A4')],
    bass: [f('C3'), null, null, null, f('F#2'), null, null, null],
    bassWave: 'sawtooth',
  },
  town_co: {
    bpm: 72, chordWave: 'sine', filterFreq: 1600, volume: 0.42,
    chord: [f('F4'), f('A4'), f('C5')],
    bass: [f('F3'), null, null, null, null, null, f('C4'), null],
    bassWave: 'sine',
    lead: [null, null, f('A5'), null, null, null, f('C6'), null],
    leadWave: 'sine',
  },
  overworld: {
    bpm: 100, chordWave: 'sawtooth', filterFreq: 650, volume: 0.36,
    chord: [f('G3'), f('D4')],
    bass: [f('G2'), null, null, f('D3'), null, null, f('G2'), null],
    bassWave: 'triangle',
  },
  south_road: {
    bpm: 84, chordWave: 'sine', filterFreq: 1100, volume: 0.4,
    chord: [f('E4'), f('G4'), f('B4')],
    bass: [f('E3'), null, null, null, f('B2'), null, null, null],
    bassWave: 'triangle',
    lead: [null, null, null, f('B4'), null, null, null, f('G4')],
    leadWave: 'sine',
  },
  dungeon: {
    bpm: 60, chordWave: 'sawtooth', filterFreq: 340, volume: 0.4,
    chord: [f('C3'), f('C#4')],
    bass: [f('C2'), null, null, null, null, null, f('C2'), null],
    bassWave: 'sawtooth',
  },
  dungeon_deep: {
    bpm: 50, chordWave: 'sawtooth', filterFreq: 260, volume: 0.46,
    chord: [f('C3'), f('F#3'), f('C4')],
    bass: [f('C2'), null, null, null, null, null, null, null],
    bassWave: 'sawtooth',
    lead: [null, null, null, null, f('F#4'), null, null, null],
    leadWave: 'sawtooth',
  },
  interior: {
    bpm: 90, chordWave: 'sine', filterFreq: 1200, volume: 0.24,
    chord: [f('A3'), f('E4')],
  },
  battle: {
    bpm: 140, chordWave: 'sawtooth', filterFreq: 900, volume: 0.4,
    chord: [f('A3'), f('C4'), f('E4')],
    bass: [f('A2'), null, f('A2'), null, f('E2'), null, f('E2'), null],
    bassWave: 'triangle',
    lead: [f('A4'), f('C5'), f('E5'), f('C5'), f('A4'), f('C5'), f('E5'), f('C5')],
    leadWave: 'square',
  },
  battle_boss: {
    bpm: 152, chordWave: 'sawtooth', filterFreq: 1100, volume: 0.46,
    chord: [f('A3'), f('D#4'), f('E4')],
    bass: [f('A2'), f('A2'), null, f('A2'), f('D#2'), f('D#2'), null, f('D#2')],
    bassWave: 'sawtooth',
    lead: [f('E5'), f('A4'), f('D#5'), f('A4'), f('E5'), f('A4'), f('D#5'), f('E5')],
    leadWave: 'square',
  },
  true_ending: {
    bpm: 66, chordWave: 'sine', filterFreq: 1800, volume: 0.44,
    chord: [f('C4'), f('E4'), f('G4'), f('C5')],
    lead: [null, null, null, f('G5'), null, null, null, f('E5')],
    leadWave: 'sine',
  },
};

const BOSS_ENEMY_IDS = new Set(['boss', 'echo_warden', 'ring_boss']);
const TOWN_TRACKS: Record<string, string> = { VH: 'town_vh', CT: 'town_ct', AR: 'town_ar', CO: 'town_co' };
const DUNGEON_MAPS = new Set(['MS', 'SA', 'FR', 'AD', 'SECRET_DUNGEON', 'CT_ASHDOOR', 'ASHFALL_STAIRS']);
const DEEP_DUNGEON_MAPS = new Set(['VN', 'AR_ARENA_BOSS']);
const OVERWORLD_MAPS = new Set(['WW']);

function trackForMap(mapId: string): string {
  if (TOWN_TRACKS[mapId]) return TOWN_TRACKS[mapId];
  if (DEEP_DUNGEON_MAPS.has(mapId)) return 'dungeon_deep';
  if (DUNGEON_MAPS.has(mapId)) return 'dungeon';
  if (mapId === 'SR') return 'south_road';
  if (OVERWORLD_MAPS.has(mapId)) return 'overworld';
  if (mapId.startsWith('CT_') || mapId.startsWith('AR_')) return 'interior'; // house/building interiors
  return 'overworld';
}

interface SyncState {
  mode: GameMode;
  mapId: string;
  battle: { enemy: { id: string } } | null;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private currentKey: string | null = null;
  private currentNodes: OscillatorNode[] = [];
  private trackGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private activeDef: TrackDef | null = null;
  private schedulerTimer: number | null = null;
  private stepIndex = 0;
  private nextStepTime = 0;

  private ensureCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AC: typeof AudioContext | undefined = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    if (!this.ctx) {
      const ctx = new AC();
      this.ctx = ctx;
      this.masterGain = ctx.createGain();
      this.masterGain.gain.value = 0.55;
      this.masterGain.connect(ctx.destination);
      this.musicGain = ctx.createGain();
      this.musicGain.gain.value = 1;
      this.musicGain.connect(this.masterGain);
      this.sfxGain = ctx.createGain();
      this.sfxGain.gain.value = 0.9;
      this.sfxGain.connect(this.masterGain);
    }
    return this.ctx;
  }

  /** Call from any user-gesture handler (keydown/click/pointerdown) to satisfy autoplay policy. */
  unlock() {
    const ctx = this.ensureCtx();
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  }

  // ── SFX ──
  playSfx(kind: SfxKind) {
    const ctx = this.ensureCtx();
    if (!ctx || !this.sfxGain) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const now = ctx.currentTime;
    if (kind === 'hover') this.blip(now, 720, 900, 'sine', 0.05, 0.1);
    else if (kind === 'click') this.blip(now, 520, 300, 'square', 0.09, 0.2);
    else this.blip(now, 640, 660, 'triangle', 0.035, 0.13);
  }

  private blip(time: number, f0: number, f1: number, wave: OscillatorType, dur: number, vol: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = wave;
    osc.frequency.setValueAtTime(f0, time);
    osc.frequency.linearRampToValueAtTime(f1, time + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(g);
    g.connect(this.sfxGain!);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  // ── Music ──
  syncMusic(state: SyncState) {
    let key: string;
    if (state.mode === GameMode.TITLE) key = 'title';
    else if (state.mode === GameMode.TRUE_ENDING) key = 'true_ending';
    else if (state.mode === GameMode.BATTLE && state.battle) key = BOSS_ENEMY_IDS.has(state.battle.enemy.id) ? 'battle_boss' : 'battle';
    else key = trackForMap(state.mapId);
    this.playTrack(key);
  }

  private playTrack(key: string) {
    if (this.currentKey === key) return;
    this.currentKey = key;
    const ctx = this.ensureCtx();
    if (!ctx || !this.musicGain) return;
    this.stopCurrentTrack(0.7);
    const def = TRACKS[key];
    if (!def) return;
    this.startTrack(def);
  }

  private stopCurrentTrack(fadeSec: number) {
    if (this.schedulerTimer !== null) { window.clearInterval(this.schedulerTimer); this.schedulerTimer = null; }
    const ctx = this.ctx;
    if (ctx && this.trackGain) {
      const g = this.trackGain;
      const now = ctx.currentTime;
      try {
        g.gain.cancelScheduledValues(now);
        g.gain.setValueAtTime(g.gain.value, now);
        g.gain.linearRampToValueAtTime(0, now + fadeSec);
      } catch { /* ignore */ }
      const nodes = this.currentNodes;
      window.setTimeout(() => { for (const osc of nodes) { try { osc.stop(); } catch { /* already stopped */ } } }, fadeSec * 1000 + 60);
    }
    this.currentNodes = [];
    this.trackGain = null;
    this.filter = null;
    this.activeDef = null;
  }

  private startTrack(def: TrackDef) {
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    const trackGain = ctx.createGain();
    trackGain.gain.value = 0;
    trackGain.gain.linearRampToValueAtTime(def.volume, now + 1.2);
    trackGain.connect(this.musicGain!);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = def.filterFreq;
    filter.connect(trackGain);

    const nodes: OscillatorNode[] = [];
    for (const freq of def.chord) {
      const osc = ctx.createOscillator();
      osc.type = def.chordWave;
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.value = 1 / def.chord.length;
      osc.connect(g);
      g.connect(filter);
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12 + Math.random() * 0.12;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 2.5;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.detune);
      lfo.start(now);
      osc.start(now);
      nodes.push(osc, lfo);
    }
    this.trackGain = trackGain;
    this.filter = filter;
    this.currentNodes = nodes;
    this.activeDef = def;

    const stepDur = 60 / def.bpm / (def.stepsPerBeat ?? 2);
    this.stepIndex = 0;
    this.nextStepTime = ctx.currentTime + 0.05;
    this.schedulerTimer = window.setInterval(() => this.scheduleSteps(stepDur), 50);
  }

  private scheduleSteps(stepDur: number) {
    const ctx = this.ctx;
    const def = this.activeDef;
    const filter = this.filter;
    if (!ctx || !def || !filter) return;
    while (this.nextStepTime < ctx.currentTime + 0.15) {
      const i = this.stepIndex;
      if (def.bass && def.bass.length) {
        const note = def.bass[i % def.bass.length];
        if (note) this.pluck(note, this.nextStepTime, def.bassWave || 'triangle', stepDur * 0.9, filter, 0.5);
      }
      if (def.lead && def.lead.length) {
        const note = def.lead[i % def.lead.length];
        if (note) this.pluck(note, this.nextStepTime, def.leadWave || 'square', stepDur * 0.4, filter, 0.22);
      }
      this.stepIndex++;
      this.nextStepTime += stepDur;
    }
  }

  private pluck(freq: number, time: number, wave: OscillatorType, dur: number, dest: AudioNode, vol: number) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    osc.type = wave;
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(vol, time + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(g);
    g.connect(dest);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }
}

export const audio = new AudioEngine();

// Auto-unlock on the very first user gesture anywhere on the page —
// browsers block audio until one occurs, so this saves every call site
// from having to remember to do it themselves.
if (typeof window !== 'undefined') {
  const unlockOnce = () => {
    audio.unlock();
    window.removeEventListener('pointerdown', unlockOnce);
    window.removeEventListener('keydown', unlockOnce);
  };
  window.addEventListener('pointerdown', unlockOnce, { once: true });
  window.addEventListener('keydown', unlockOnce, { once: true });
}
