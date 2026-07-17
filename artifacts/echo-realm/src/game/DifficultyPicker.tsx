import React, { useState } from 'react';

type Difficulty = 'normal' | 'challenger' | 'void';

interface DifficultyPickerProps {
  onConfirm: (difficulty: Difficulty, slotName: string) => void;
  onBack: () => void;
}

const DIFFICULTIES: {
  id: Difficulty;
  label: string;
  tagline: string;
  desc: string;
  color: string;
  accent: string;
}[] = [
  {
    id: 'normal',
    label: 'NORMAL',
    tagline: 'A second chance at a familiar world.',
    desc: 'Enemy HP ×1.2  ·  ATK ×1.15  ·  Exclusive NG+ items drop from the boss.',
    color: '#a9d9b0',
    accent: '#2d5a35',
  },
  {
    id: 'challenger',
    label: 'CHALLENGER',
    tagline: 'The Realm remembers how you fought.',
    desc: 'Enemy HP ×1.5  ·  ATK ×1.3  ·  Exclusive NG+ items drop from the boss.',
    color: '#f0c060',
    accent: '#5a3a10',
  },
  {
    id: 'void',
    label: 'VOID',
    tagline: 'The Void does not forgive a second time.',
    desc: 'Enemy HP ×2.0  ·  ATK ×1.5  ·  Exclusive NG+ items drop from the boss.',
    color: '#cc88ff',
    accent: '#3a1060',
  },
];

export default function DifficultyPicker({ onConfirm, onBack }: DifficultyPickerProps) {
  const [selected, setSelected] = useState<Difficulty>('normal');
  const [slotName, setSlotName] = useState('');
  const [error, setError] = useState('');

  const diff = DIFFICULTIES.find(d => d.id === selected)!;

  const handleConfirm = () => {
    const name = slotName.trim();
    if (!name) { setError('Please enter a name for this run.'); return; }
    if (name.length > 28) { setError('Name must be 28 characters or fewer.'); return; }
    onConfirm(selected, name);
  };

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#020208',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'monospace',
      color: '#ccccee',
      userSelect: 'none',
    }}>
      {/* CRT scanline overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 2px)',
        zIndex: 10,
      }} />

      {/* Panel */}
      <div style={{
        border: `2px solid ${diff.color}`,
        background: '#070712',
        padding: '40px 48px',
        maxWidth: 520,
        width: '90%',
        boxShadow: `0 0 40px ${diff.accent}`,
        transition: 'box-shadow 0.3s, border-color 0.3s',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: '#555577', letterSpacing: 4, marginBottom: 8 }}>NEW GAME+</div>
          <div style={{ fontSize: 26, fontWeight: 'bold', color: diff.color, transition: 'color 0.3s' }}>
            BEGIN AGAIN
          </div>
          <div style={{ fontSize: 11, color: '#555577', marginTop: 6 }}>
            Skills reset. Items lost. Memories remain.
          </div>
        </div>

        {/* Difficulty selection */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: '#444466', letterSpacing: 2, marginBottom: 10 }}>DIFFICULTY</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {DIFFICULTIES.map(d => (
              <button
                key={d.id}
                onClick={() => { setSelected(d.id); setError(''); }}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  background: selected === d.id ? d.accent : 'transparent',
                  border: `1px solid ${selected === d.id ? d.color : '#222240'}`,
                  color: selected === d.id ? d.color : '#444466',
                  fontFamily: 'monospace',
                  fontSize: 11,
                  fontWeight: selected === d.id ? 'bold' : 'normal',
                  cursor: 'pointer',
                  letterSpacing: 1,
                  transition: 'all 0.15s',
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div style={{
            marginTop: 12,
            padding: '10px 14px',
            background: 'rgba(0,0,0,0.4)',
            border: `1px solid ${diff.accent}`,
            fontSize: 10,
            color: '#888899',
            lineHeight: 1.6,
          }}>
            <span style={{ color: diff.color, fontWeight: 'bold' }}>{diff.tagline}</span>
            <br />
            {diff.desc}
          </div>
        </div>

        {/* NG+ exclusive items preview */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: '#444466', letterSpacing: 2, marginBottom: 8 }}>EXCLUSIVE REWARDS</div>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 6,
            padding: '10px 14px',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid #1a1a33',
          }}>
            {[
              { name: 'Void-Touched Crown',   tier: 'LEGENDARY', color: '#e0aa40', desc: 'Helmet — +6 DEF  +15 HP  +3 ATK' },
              { name: "Keeper's Second Seal", tier: 'LEGENDARY', color: '#e0aa40', desc: 'Necklace — +4 DEF  +18 HP  +2 ATK' },
              { name: 'Fragment of Another',  tier: 'MYTHIC',    color: '#8866ff', desc: 'Trinket — +3 DEF  +20 HP  +5 ATK' },
            ].map(item => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 11, color: item.color, fontWeight: 'bold' }}>{item.name}</span>
                <span style={{ fontSize: 10, color: '#555577', whiteSpace: 'nowrap' }}>{item.desc}</span>
              </div>
            ))}
            <div style={{ fontSize: 9, color: '#333355', marginTop: 4 }}>
              Drop from Memory Wraith boss · NG+ only
            </div>
          </div>
        </div>

        {/* Slot name */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: '#444466', letterSpacing: 2, marginBottom: 8 }}>RUN NAME</div>
          <input
            type="text"
            placeholder="e.g. The Second Keeper"
            maxLength={28}
            value={slotName}
            onChange={e => { setSlotName(e.target.value); setError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') handleConfirm(); }}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px',
              background: '#0a0a18',
              border: `1px solid ${error ? '#aa3333' : '#222240'}`,
              color: '#ccccee',
              fontFamily: 'monospace',
              fontSize: 13,
              outline: 'none',
            }}
            autoFocus
          />
          {error && (
            <div style={{ fontSize: 10, color: '#cc4444', marginTop: 6 }}>{error}</div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onBack}
            style={{
              flex: 1, padding: '10px', background: 'transparent',
              border: '1px solid #222240', color: '#444466',
              fontFamily: 'monospace', fontSize: 12, cursor: 'pointer',
            }}
          >
            ← Back
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 2, padding: '10px',
              background: diff.accent,
              border: `1px solid ${diff.color}`,
              color: diff.color,
              fontFamily: 'monospace', fontSize: 13,
              fontWeight: 'bold', cursor: 'pointer',
              letterSpacing: 1,
              transition: 'all 0.15s',
            }}
          >
            CONTINUE →
          </button>
        </div>
      </div>
    </div>
  );
}
