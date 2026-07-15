import React from 'react';
import { audio } from './game/audio';

interface Props { onBack: () => void; }

export default function Options({ onBack }: Props) {
  return (
    <div className="menu-root">
      <div className="crt-bars"      aria-hidden="true" />
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-vignette"  aria-hidden="true" />

      <div className="menu-layout">
        <div className="menu-left">
          <div className="menu-title-block">
            <h1 className="menu-title" style={{ fontSize: '2.8rem' }}>OPTIONS</h1>
            <div className="menu-title-line" />
          </div>

          <p className="menu-coming-soon">COMING SOON</p>

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
