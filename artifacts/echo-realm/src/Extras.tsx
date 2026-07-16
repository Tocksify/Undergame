import React, { useState, useEffect } from 'react';
import { audio } from './game/audio';
import { CHALLENGE_EMBLEMS, getEarnedEmblemIds } from './challengeStore';

interface Props { onBack: () => void; }

type Tab = 'credits' | 'sound' | 'lore' | 'codex';

const SOUND_TRACKS: { key: string; label: string }[] = [
  { key: 'title',        label: 'Title Theme'        },
  { key: 'overworld',    label: 'Whispering Woods'    },
  { key: 'south_road',   label: 'South Road'          },
  { key: 'town_vh',      label: 'Vale Hollow'         },
  { key: 'town_ct',      label: 'Crestfall City'      },
  { key: 'town_ar',      label: 'Ashfall Ring'        },
  { key: 'interior',     label: 'Interior'            },
  { key: 'dungeon',      label: 'Dungeon'             },
  { key: 'dungeon_deep', label: 'Deep Dungeon'        },
  { key: 'battle',       label: 'Battle (Vol. 1)'     },
  { key: 'battle2',      label: 'Battle (Vol. 2)'     },
  { key: 'battle3',      label: 'Boss Battle'         },
  { key: 'child_void',   label: 'The Kid'             },
  { key: 'true_ending',  label: 'True Ending'         },
];

const LORE: { title: string; body: string }[] = [
  {
    title: 'THE ECHO REALM',
    body: `Before the forgetting began, there were Keepers — archivists of memory, stewards of the living record. They believed that a name unspoken long enough ceases to exist. A face forgotten by all becomes a ghost even to itself.

The Echo Realm is what remains: a liminal space between memory and oblivion, where the forgotten linger in forms shaped by whatever scraps of identity they retain. To enter is to risk becoming part of it.`,
  },
  {
    title: 'THE WANDERING SOUL',
    body: `The soul at the centre of this tale carries no name — not because it was taken, but because it was given away. Memory Keepers sometimes do this deliberately: shedding their own identity to slip into the Echo Realm undetected, unanchored, and unafraid.

Without a name to lose, the forgetting has nothing to grab.`,
  },
  {
    title: 'RESONANCE',
    body: `The creatures of the Echo Realm are not evil. They are lost. Resonance is the act of bearing witness — of recognising the fragment of self that remains in a forgotten thing and reflecting it back clearly enough for it to remember itself.

This is why remembering is more powerful than defeating. A forgotten being that is truly seen does not vanish. It is restored.`,
  },
  {
    title: 'ECHOES',
    body: `Echoes are the currency of memory — crystallised moments of recognition, left behind whenever a forgotten creature is seen clearly. They are simultaneously experience, wealth, and light.

The oldest Keepers say that enough Echoes, gathered and spent wisely, can rewrite an ending. Whether that is metaphor or fact remains unclear.`,
  },
  {
    title: 'THE VOID CRAWLERS',
    body: `Void Crawlers were once cataloguers — junior Keepers who mapped the boundary regions of the Echo Realm. Over time, without anyone to remember them, their circular patrols became compulsive loops, their methodical movements lost all purpose.

They still trace their old routes. They have forgotten why.`,
  },
  {
    title: 'VALE HOLLOW',
    body: `Vale Hollow is the last outpost before the forest thickens into something that does not want to be crossed. Its few remaining residents are those who stayed too long and found they couldn't quite remember where else they were supposed to be.

The innkeeper still sets extra places at dinner. Old habit.`,
  },
];

const CREDITS: { heading: string; lines: string[] }[] = [
  { heading: 'GAME',       lines: ['Echo Realm', 'A Memory Keeper\'s Tale'] },
  { heading: 'ENGINE',     lines: ['React 19 · TypeScript 5', 'Vite 7 · Tailwind CSS'] },
  { heading: 'AUDIO',      lines: ['Procedurally synthesised', 'Web Audio API · Zero external files'] },
  { heading: 'DATABASE',   lines: ['PostgreSQL · Drizzle ORM'] },
  { heading: 'FONTS',      lines: ['Bebas Neue · Courier Prime'] },
  { heading: 'RENDERER',   lines: ['HTML5 Canvas · 60 fps game loop'] },
  { heading: 'SPECIAL THANKS', lines: ['To everyone who remembers.'] },
];

export default function Extras({ onBack }: Props) {
  const [tab,       setTab]       = useState<Tab>('credits');
  const [playing,   setPlaying]   = useState<string | null>(null);
  const [expanded,  setExpanded]  = useState<string | null>(null);

  // Release the preview lock when the Extras screen unmounts
  useEffect(() => () => { audio.setPreviewTrack(null); }, []);

  function playTrack(key: string) {
    setPlaying(key);
    audio.setPreviewTrack(key);
  }
  function stopPreview() {
    setPlaying(null);
    audio.setPreviewTrack(null);
  }
  function changeTab(t: Tab) {
    setTab(t);
    stopPreview();
    audio.playSfx('click');
  }
  function toggleLore(title: string) {
    setExpanded(e => e === title ? null : title);
    audio.playSfx('click');
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'credits', label: 'CREDITS'    },
    { id: 'sound',   label: 'SOUND TEST' },
    { id: 'lore',    label: 'LORE'       },
    { id: 'codex',   label: 'CODEX'      },
  ];

  return (
    <div className="menu-root">
      <div className="crt-bars"      aria-hidden="true" />
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-vignette"  aria-hidden="true" />

      <div className="menu-layout">
        <div className="menu-left opt-panel">

          <div className="menu-title-block">
            <h1 className="menu-title" style={{ fontSize: '2.8rem' }}>EXTRAS</h1>
            <div className="menu-title-line" />
          </div>

          {/* Tab bar */}
          <div className="extras-tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`opt-toggle${tab === t.id ? ' opt-toggle--on' : ''}`}
                onClick={() => changeTab(t.id)}
                onMouseEnter={() => audio.playSfx('hover')}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="extras-body">

            {/* ── CREDITS ── */}
            {tab === 'credits' && (
              <div className="extras-credits">
                {CREDITS.map(section => (
                  <div key={section.heading} className="extras-credit-block">
                    <p className="extras-credit-heading">{section.heading}</p>
                    {section.lines.map(l => (
                      <p key={l} className="extras-credit-line">{l}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* ── SOUND TEST ── */}
            {tab === 'sound' && (
              <div className="extras-sound">
                {SOUND_TRACKS.map(t => {
                  const active = playing === t.key;
                  return (
                    <div key={t.key} className={`extras-track-row${active ? ' extras-track-row--active' : ''}`}>
                      <span className="extras-track-indicator">{active ? '▶' : ' '}</span>
                      <span className="extras-track-name">{t.label}</span>
                      <button
                        className={`opt-toggle opt-toggle--sm${active ? ' opt-toggle--on' : ''}`}
                        onClick={() => active ? stopPreview() : playTrack(t.key)}
                        onMouseEnter={() => audio.playSfx('hover')}
                      >
                        {active ? 'STOP' : 'PLAY'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── LORE ── */}
            {tab === 'lore' && (
              <div className="extras-lore">
                {LORE.map(entry => (
                  <div key={entry.title} className="extras-lore-entry">
                    <button
                      className="extras-lore-title"
                      onClick={() => toggleLore(entry.title)}
                      onMouseEnter={() => audio.playSfx('hover')}
                    >
                      <span className="extras-lore-arrow">{expanded === entry.title ? '▼' : '▶'}</span>
                      {entry.title}
                    </button>
                    {expanded === entry.title && (
                      <p className="extras-lore-body">{entry.body}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── CODEX ── */}
            {tab === 'codex' && (() => {
              const earnedIds = getEarnedEmblemIds();
              return (
                <div className="extras-lore">
                  <p className="text-xs text-[#555] mb-4 leading-relaxed">
                    Emblems are earned by completing Challenge Mode. Each run awards a new emblem.
                    Earned emblems grant starting buffs on new characters.
                  </p>
                  {CHALLENGE_EMBLEMS.map((emblem) => {
                    const earned = earnedIds.includes(emblem.id);
                    return (
                      <div
                        key={emblem.id}
                        className="extras-lore-entry"
                        style={{
                          borderLeft: `3px solid ${earned ? emblem.color : '#333'}`,
                          paddingLeft: '12px',
                          marginBottom: '10px',
                        }}
                      >
                        <div
                          className="text-sm font-bold tracking-wider mb-1"
                          style={{ color: earned ? emblem.color : '#444' }}
                        >
                          {earned ? emblem.name : '???'}
                        </div>
                        <div className="text-xs" style={{ color: earned ? '#aaa' : '#333' }}>
                          {earned ? emblem.desc : 'Complete Challenge Mode to reveal this emblem.'}
                        </div>
                      </div>
                    );
                  })}
                  {earnedIds.length === 0 && (
                    <p className="text-xs text-[#444] mt-2 italic">
                      No emblems earned yet. Select CHALLENGE from the main menu to begin.
                    </p>
                  )}
                  {earnedIds.length > 0 && (
                    <p className="text-xs text-[#555] mt-3">
                      {earnedIds.length} / {CHALLENGE_EMBLEMS.length} emblems earned.
                    </p>
                  )}
                </div>
              );
            })()}

          </div>

          <button
            className="menu-btn"
            style={{ marginTop: '1.5rem' }}
            onMouseEnter={() => audio.playSfx('hover')}
            onClick={() => { audio.playSfx('cancel'); stopPreview(); onBack(); }}
          >
            <span className="menu-btn-arrow">◀</span>
            BACK
          </button>

        </div>
      </div>
    </div>
  );
}
