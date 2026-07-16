import React, { useState } from 'react';
import { audio } from './game/audio';

interface Props {
  onPlay: () => void;
  onChallenge: () => void;
  onOptions: () => void;
  onExtras: () => void;
  onQuit: () => void;
}

type Item = { label: string; key: string };

const ITEMS: Item[] = [
  { label: 'PLAY',      key: 'play'      },
  { label: 'CHALLENGE', key: 'challenge' },
  { label: 'OPTIONS',   key: 'options'   },
  { label: 'EXTRAS',    key: 'extras'    },
  { label: 'QUIT',      key: 'quit'      },
];

export default function MainMenu({ onPlay, onChallenge, onOptions, onExtras, onQuit }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  function handle(key: string) {
    audio.playSfx('click');
    if (key === 'play')      onPlay();
    if (key === 'challenge') onChallenge();
    if (key === 'options')   onOptions();
    if (key === 'extras')    onExtras();
    if (key === 'quit')      onQuit();
  }

  return (
    <div className="menu-root">
      {/* CRT overlay layers */}
      <div className="crt-bars"      aria-hidden="true" />
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-vignette"  aria-hidden="true" />

      {/* Main content */}
      <div className="menu-layout">
        <div className="menu-left">

          {/* Title block */}
          <div className="menu-title-block">
            <h1 className="menu-title">ECHO<br />REALM</h1>
            <div className="menu-title-line" />
            <p className="menu-subtitle">A MEMORY KEEPER'S TALE</p>
          </div>

          {/* Nav */}
          <nav className="menu-nav" role="navigation">
            {ITEMS.map((item) => {
              const active = hovered === item.key;
              return (
                <button
                  key={item.key}
                  className={`menu-btn${active ? ' menu-btn--active' : ''}`}
                  onMouseEnter={() => { setHovered(item.key); audio.playSfx('hover'); }}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handle(item.key)}
                >
                  <span className="menu-btn-arrow">{active ? '▶' : ''}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <span className="menu-version">ECHO REALM · EARLY ACCESS</span>
    </div>
  );
}
