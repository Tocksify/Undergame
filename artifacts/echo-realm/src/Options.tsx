import React, { useState, useEffect } from 'react';
import { audio } from './game/audio';

interface Props { onBack: () => void; }

const LS = {
  musicVol:  'er_music_vol',
  sfxVol:    'er_sfx_vol',
  crt:       'er_crt',
  textSpeed: 'er_textspeed',
};

function loadInt(key: string, def: number) {
  const v = localStorage.getItem(key);
  return v !== null ? Math.max(0, Math.min(100, Number(v))) : def;
}
function loadStr(key: string, def: string) {
  return localStorage.getItem(key) ?? def;
}

export default function Options({ onBack }: Props) {
  const [musicVol,  setMusicVol]  = useState(() => loadInt(LS.musicVol,  75));
  const [sfxVol,   setSfxVol]    = useState(() => loadInt(LS.sfxVol,    75));
  const [crt,      setCrt]       = useState<boolean>(() => {
    const saved = localStorage.getItem(LS.crt);
    const on = saved !== null ? saved === '1' : true;
    document.documentElement.classList.toggle('no-crt', !on);
    return on;
  });
  const [textSpeed, setTextSpeed] = useState(() => loadStr(LS.textSpeed, 'normal'));
  const [isFullscreen, setIsFullscreen] = useState(() => !!document.fullscreenElement);

  // Keep fullscreen indicator in sync
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  function handleMusicVol(v: number) {
    setMusicVol(v);
    audio.setMusicVolume(v);
  }
  function handleSfxVol(v: number) {
    setSfxVol(v);
    audio.setSfxVolume(v);
  }
  function handleCrt(on: boolean) {
    setCrt(on);
    document.documentElement.classList.toggle('no-crt', !on);
    localStorage.setItem(LS.crt, on ? '1' : '0');
    audio.playSfx('click');
  }
  function handleTextSpeed(s: string) {
    setTextSpeed(s);
    localStorage.setItem(LS.textSpeed, s);
    audio.playSfx('click');
  }
  function toggleFullscreen() {
    audio.playSfx('click');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  const TEXT_SPEEDS = ['SLOW', 'NORMAL', 'FAST'] as const;

  return (
    <div className="menu-root">
      <div className="crt-bars"      aria-hidden="true" />
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-vignette"  aria-hidden="true" />

      <div className="menu-layout">
        <div className="menu-left opt-panel">

          <div className="menu-title-block">
            <h1 className="menu-title" style={{ fontSize: '2.8rem' }}>OPTIONS</h1>
            <div className="menu-title-line" />
          </div>

          <div className="opt-list">

            {/* ── Music Volume ── */}
            <div className="opt-row">
              <span className="opt-label">MUSIC VOLUME</span>
              <div className="opt-control">
                <input
                  type="range" min={0} max={100} value={musicVol}
                  className="opt-slider"
                  onMouseEnter={() => audio.playSfx('hover')}
                  onChange={e => handleMusicVol(Number(e.target.value))}
                />
                <span className="opt-value">{musicVol}</span>
              </div>
            </div>

            {/* ── SFX Volume ── */}
            <div className="opt-row">
              <span className="opt-label">SFX VOLUME</span>
              <div className="opt-control">
                <input
                  type="range" min={0} max={100} value={sfxVol}
                  className="opt-slider"
                  onMouseEnter={() => audio.playSfx('hover')}
                  onChange={e => handleSfxVol(Number(e.target.value))}
                />
                <span className="opt-value">{sfxVol}</span>
              </div>
            </div>

            {/* ── CRT Effects ── */}
            <div className="opt-row">
              <span className="opt-label">CRT EFFECTS</span>
              <div className="opt-control">
                <button
                  className={`opt-toggle${crt ? ' opt-toggle--on' : ''}`}
                  onClick={() => handleCrt(!crt)}
                  onMouseEnter={() => audio.playSfx('hover')}
                >
                  {crt ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* ── Text Speed ── */}
            <div className="opt-row">
              <span className="opt-label">TEXT SPEED</span>
              <div className="opt-control" style={{ gap: '0.5rem' }}>
                {TEXT_SPEEDS.map(s => (
                  <button
                    key={s}
                    className={`opt-toggle${textSpeed === s.toLowerCase() ? ' opt-toggle--on' : ''}`}
                    onClick={() => handleTextSpeed(s.toLowerCase())}
                    onMouseEnter={() => audio.playSfx('hover')}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Fullscreen ── */}
            <div className="opt-row">
              <span className="opt-label">FULLSCREEN</span>
              <div className="opt-control">
                <button
                  className={`opt-toggle${isFullscreen ? ' opt-toggle--on' : ''}`}
                  onClick={toggleFullscreen}
                  onMouseEnter={() => audio.playSfx('hover')}
                >
                  {isFullscreen ? 'EXIT' : 'ENTER'}
                </button>
              </div>
            </div>

          </div>

          <button
            className="menu-btn"
            style={{ marginTop: '2.5rem' }}
            onMouseEnter={() => audio.playSfx('hover')}
            onClick={() => { audio.playSfx('cancel'); onBack(); }}
          >
            <span className="menu-btn-arrow">◀</span>
            BACK
          </button>
        </div>
      </div>
    </div>
  );
}
