// ── AUDIO ENGINE ─────────────────────────────────────────────────────
// Fully procedural (no external audio files): background/ambient/battle
// music and UI sound effects are synthesized at runtime with the Web
// Audio API. Safe to import from non-browser contexts (verification
// scripts, SSR) — every entry point no-ops when `window`/AudioContext
// isn't available.
import { GameMode } from './types';

export type SfxKind = 'hover' | 'click' | 'key' | 'confirm' | 'cancel' | 'levelup';

interface TrackDef {
  bpm: number;
  chord: number[];           // sustained pad frequencies (Hz), phase A
  chordAlt?: number[];       // pad frequencies for phase B — smoothly re-tuned to, for variety
  chordWave: OscillatorType;
  filterFreq: number;
  volume: number;            // 0-1, overall loudness of this track
  bass?: (number | null)[];  // one entry per step; null = rest. Phase A pattern.
  bassAlt?: (number | null)[]; // phase B pattern (falls back to `bass` if omitted)
  bassWave?: OscillatorType;
  lead?: (number | null)[];
  leadAlt?: (number | null)[];
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

// Each track plays a 16-step phase-A pattern, then — if an Alt pattern/chord is
// given — smoothly modulates into phase B for 16 steps before returning to A,
// so loops don't feel like the same 2 bars looping forever.
const TRACKS: Record<string, TrackDef> = {
  title: {
    bpm: 70, chordWave: 'sine', filterFreq: 1400, volume: 0.5,
    chord: [f('A3'), f('C4'), f('E4')],
    chordAlt: [f('F3'), f('A3'), f('C4')],
    bass: [f('A2'), null, null, null, f('E3'), null, null, null, f('A2'), null, null, null, f('C3'), null, null, null],
    bassAlt: [f('F2'), null, null, null, f('C3'), null, null, null, f('F2'), null, null, null, f('A2'), null, null, null],
    bassWave: 'triangle',
  },
  town_vh: {
    bpm: 96, chordWave: 'sawtooth', filterFreq: 900, volume: 0.4,
    chord: [f('C4'), f('E4'), f('G4')],
    chordAlt: [f('A3'), f('C4'), f('E4')],
    bass: [f('C3'), null, f('G3'), null, f('F3'), null, f('G3'), null, f('C3'), null, f('E3'), null, f('G3'), null, f('F3'), null],
    bassAlt: [f('A2'), null, f('E3'), null, f('F3'), null, f('E3'), null, f('A2'), null, f('C3'), null, f('D3'), null, f('E3'), null],
    bassWave: 'triangle',
    lead: [null, f('E5'), null, null, null, f('G5'), null, null, null, f('C5'), null, null, null, f('G5'), null, null],
    leadAlt: [null, f('C5'), null, null, null, f('E5'), null, null, null, f('A4'), null, null, null, f('E5'), null, null],
    leadWave: 'sine',
  },
  town_ct: {
    bpm: 88, chordWave: 'sawtooth', filterFreq: 750, volume: 0.4,
    chord: [f('D4'), f('F4'), f('A4')],
    chordAlt: [f('G3'), f('A3'), f('D4')],
    bass: [f('D3'), null, null, f('A3'), null, null, f('F3'), null, f('D3'), null, null, f('C4'), null, null, f('A3'), null],
    bassAlt: [f('G2'), null, null, f('D3'), null, null, f('A2'), null, f('G2'), null, null, f('D3'), null, null, f('F3'), null],
    bassWave: 'triangle',
    lead: [null, null, null, null, f('D5'), null, null, null, null, null, null, null, f('A4'), null, null, null],
    leadWave: 'triangle',
  },
  town_ar: {
    bpm: 80, chordWave: 'sawtooth', filterFreq: 500, volume: 0.42,
    chord: [f('C4'), f('F#4'), f('A4')],
    chordAlt: [f('A#3'), f('E4'), f('G4')],
    bass: [f('C3'), null, null, null, f('F#2'), null, null, null, f('C3'), null, null, null, f('A#2'), null, null, null],
    bassWave: 'sawtooth',
  },
  town_co: {
    bpm: 72, chordWave: 'sine', filterFreq: 1600, volume: 0.42,
    chord: [f('F4'), f('A4'), f('C5')],
    chordAlt: [f('D4'), f('F4'), f('A4')],
    bass: [f('F3'), null, null, null, null, null, f('C4'), null, f('D3'), null, null, null, null, null, f('A3'), null],
    bassWave: 'sine',
    lead: [null, null, f('A5'), null, null, null, f('C6'), null, null, null, f('F5'), null, null, null, f('A5'), null],
    leadWave: 'sine',
  },
  overworld: {
    bpm: 100, chordWave: 'sawtooth', filterFreq: 650, volume: 0.36,
    chord: [f('G3'), f('D4')],
    chordAlt: [f('E3'), f('B3')],
    bass: [f('G2'), null, null, f('D3'), null, null, f('G2'), null, f('C3'), null, null, f('D3'), null, null, f('G2'), null],
    bassAlt: [f('E2'), null, null, f('B2'), null, null, f('E2'), null, f('A2'), null, null, f('B2'), null, null, f('E2'), null],
    bassWave: 'triangle',
  },
  south_road: {
    bpm: 84, chordWave: 'sine', filterFreq: 1100, volume: 0.4,
    chord: [f('E4'), f('G4'), f('B4')],
    chordAlt: [f('C4'), f('E4'), f('G4')],
    bass: [f('E3'), null, null, null, f('B2'), null, null, null, f('C3'), null, null, null, f('G2'), null, null, null],
    bassWave: 'triangle',
    lead: [null, null, null, f('B4'), null, null, null, f('G4'), null, null, null, f('C5'), null, null, null, f('G4')],
    leadWave: 'sine',
  },
  dungeon: {
    bpm: 60, chordWave: 'sawtooth', filterFreq: 340, volume: 0.4,
    chord: [f('C3'), f('C#4')],
    chordAlt: [f('B2'), f('F3')],
    bass: [f('C2'), null, null, null, null, null, f('C2'), null, f('B1'), null, null, null, null, null, f('B1'), null],
    bassWave: 'sawtooth',
  },
  dungeon_deep: {
    bpm: 50, chordWave: 'sawtooth', filterFreq: 260, volume: 0.46,
    chord: [f('C3'), f('F#3'), f('C4')],
    chordAlt: [f('A#2'), f('E3'), f('A#3')],
    bass: [f('C2'), null, null, null, null, null, null, null, f('A#1'), null, null, null, null, null, null, null],
    bassWave: 'sawtooth',
    lead: [null, null, null, null, f('F#4'), null, null, null, null, null, null, null, f('E4'), null, null, null],
    leadWave: 'sawtooth',
  },
  interior: {
    bpm: 90, chordWave: 'sine', filterFreq: 1200, volume: 0.24,
    chord: [f('A3'), f('E4')],
    chordAlt: [f('F3'), f('C4')],
  },
  battle: {
    bpm: 140, chordWave: 'sawtooth', filterFreq: 900, volume: 0.4,
    chord: [f('A3'), f('C4'), f('E4')],
    chordAlt: [f('F3'), f('A3'), f('D4')],
    bass: [f('A2'), null, f('A2'), null, f('E2'), null, f('E2'), null, f('A2'), null, f('A2'), null, f('D2'), null, f('E2'), null, null],
    bassWave: 'triangle',
    lead: [f('A4'), f('C5'), f('E5'), f('C5'), f('A4'), f('C5'), f('E5'), f('C5'), f('F4'), f('A4'), f('D5'), f('A4'), f('E4'), f('A4'), f('C5'), f('E4')],
    leadWave: 'square',
  },
  battle_boss: {
    bpm: 152, chordWave: 'sawtooth', filterFreq: 1100, volume: 0.46,
    chord: [f('A3'), f('D#4'), f('E4')],
    chordAlt: [f('F3'), f('A3'), f('D#4')],
    bass: [f('A2'), f('A2'), null, f('A2'), f('D#2'), f('D#2'), null, f('D#2'), f('F2'), f('F2'), null, f('F2'), f('A2'), f('A2'), null, f('D#2')],
    bassWave: 'sawtooth',
    lead: [f('E5'), f('A4'), f('D#5'), f('A4'), f('E5'), f('A4'), f('D#5'), f('E5'), f('F5'), f('A4'), f('C5'), f('A4'), f('F5'), f('A4'), f('C5'), f('F5')],
    leadWave: 'square',
  },
  true_ending: {
    bpm: 66, chordWave: 'sine', filterFreq: 1800, volume: 0.44,
    chord: [f('C4'), f('E4'), f('G4'), f('C5')],
    chordAlt: [f('F3'), f('A3'), f('C4'), f('F4')],
    lead: [null, null, null, f('G5'), null, null, null, f('E5'), null, null, null, f('C5'), null, null, null, f('E5')],
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

// Modes that show a full-screen/overlay UI. Music is ducked (muffled + quieted)
// while any of these are active, so UI sound effects actually cut through.
export const MODAL_MODES = new Set<GameMode>([
  GameMode.INVENTORY, GameMode.MENU, GameMode.QUEST_LOG, GameMode.SHOP,
  GameMode.BOOK_READ, GameMode.ENCHANT_SELECT, GameMode.TOME_CRAFT,
  GameMode.TELEPORT, GameMode.STAT_ALLOCATION, GameMode.DIALOGUE,
]);

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
  private duckFilter: BiquadFilterNode | null = null;
  private duckGain: GainNode | null = null;
  private duckActive = false;

  private currentKey: string | null = null;
  private currentNodes: OscillatorNode[] = [];
  private chordOscillators: OscillatorNode[] = [];
  private trackGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private activeDef: TrackDef | null = null;
  private patternLen = 16;
  private lastPhase = 0;
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

      // Music routes through a duck filter+gain so we can "blur" it (muffle +
      // quiet it) whenever a modal UI is open, without touching SFX.
      this.duckFilter = ctx.createBiquadFilter();
      this.duckFilter.type = 'lowpass';
      this.duckFilter.frequency.value = 19000;
      this.duckGain = ctx.createGain();
      this.duckGain.gain.value = 1;
      this.duckFilter.connect(this.duckGain);
      this.duckGain.connect(this.masterGain);

      this.musicGain = ctx.createGain();
      this.musicGain.gain.value = 1;
      this.musicGain.connect(this.duckFilter);

      this.sfxGain = ctx.createGain();
      this.sfxGain.gain.value = 0.95;
      this.sfxGain.connect(this.masterGain);
    }
    return this.ctx;
  }

  /** Call from any user-gesture handler (keydown/click/pointerdown) to satisfy autoplay policy. */
  unlock() {
    const ctx = this.ensureCtx();
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  }

  /** Muffle + quiet the music (e.g. inventory/menu/shop/dialogue open) so UI SFX stay audible. */
  setDucked(active: boolean) {
    const ctx = this.ensureCtx();
    if (!ctx || !this.duckFilter || !this.duckGain) return;
    if (this.duckActive === active) return;
    this.duckActive = active;
    const now = ctx.currentTime;
    const freq = active ? 420 : 19000;
    const gain = active ? 0.32 : 1;
    for (const [param, target] of [[this.duckFilter.frequency, freq], [this.duckGain.gain, gain]] as const) {
      param.cancelScheduledValues(now);
      param.setValueAtTime(param.value, now);
      param.linearRampToValueAtTime(target, now + 0.28);
    }
  }

  // ── SFX ──
  playSfx(kind: SfxKind) {
    const ctx = this.ensureCtx();
    if (!ctx || !this.sfxGain) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const now = ctx.currentTime;
    if (kind === 'hover') this.blip(now, 720, 900, 'sine', 0.05, 0.14);
    else if (kind === 'click') this.blip(now, 520, 300, 'square', 0.09, 0.24);
    else if (kind === 'confirm') this.blip(now, 560, 840, 'triangle', 0.09, 0.3);
    else if (kind === 'cancel') this.blip(now, 480, 240, 'square', 0.1, 0.26);
    else if (kind === 'levelup') this.levelUpFanfare(now);
    else this.blip(now, 640, 660, 'triangle', 0.035, 0.18);
  }

  private levelUpFanfare(startTime: number) {
    const ctx = this.ctx!;
    const notes = [f('C5'), f('E5'), f('G5'), f('C6')];
    notes.forEach((freq, i) => this.pluck(freq, startTime + i * 0.09, 'square', 0.22, this.sfxGain!, 0.28));
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
    this.chordOscillators = [];
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
    const chordOscillators: OscillatorNode[] = [];
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
      chordOscillators.push(osc);
    }
    this.trackGain = trackGain;
    this.filter = filter;
    this.currentNodes = nodes;
    this.chordOscillators = chordOscillators;
    this.activeDef = def;
    this.patternLen = Math.max(def.bass?.length ?? 0, def.lead?.length ?? 0, 16);
    this.lastPhase = 0;

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
      const phase = Math.floor(i / this.patternLen) % 2;
      if (phase !== this.lastPhase) {
        this.lastPhase = phase;
        this.retuneChord(phase === 1 && def.chordAlt ? def.chordAlt : def.chord, this.nextStepTime);
      }
      const bassPattern = (phase === 1 && def.bassAlt) ? def.bassAlt : def.bass;
      const leadPattern = (phase === 1 && def.leadAlt) ? def.leadAlt : def.lead;
      if (bassPattern && bassPattern.length) {
        const note = bassPattern[i % bassPattern.length];
        if (note) this.pluck(note, this.nextStepTime, def.bassWave || 'triangle', stepDur * 0.9, filter, 0.5);
      }
      if (leadPattern && leadPattern.length) {
        const note = leadPattern[i % leadPattern.length];
        if (note) this.pluck(note, this.nextStepTime, def.leadWave || 'square', stepDur * 0.4, filter, 0.22);
      }
      this.stepIndex++;
      this.nextStepTime += stepDur;
    }
  }

  private retuneChord(targetFreqs: number[], time: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    this.chordOscillators.forEach((osc, i) => {
      const target = targetFreqs[i % targetFreqs.length];
      try {
        osc.frequency.cancelScheduledValues(time);
        osc.frequency.setValueAtTime(osc.frequency.value, time);
        osc.frequency.linearRampToValueAtTime(target, time + 1.8);
      } catch { /* ignore */ }
    });
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
