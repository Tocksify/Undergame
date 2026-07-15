import React, { useCallback, useEffect, useState } from 'react';
import { audio } from './game/audio';
import {
  LocalSlot, ErsavFile,
  listSlots, renameSlot, deleteSlotById, exportErsav, importErsav,
} from './ersav';

interface Props {
  onBack: () => void;
  /** User wants to load an existing slot. */
  onLoadSlot: (slot: LocalSlot) => void;
  /** User wants to start a brand-new game (will open customization). */
  onNewSlot: () => void;
  /** User imported a .ersav file — create a slot for it and start. */
  onLoadFromFile: (file: ErsavFile) => void;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch { return ''; }
}

export default function SaveSlots({ onBack, onLoadSlot, onNewSlot, onLoadFromFile }: Props) {
  const [slots, setSlots]             = useState<LocalSlot[]>([]);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [editName, setEditName]       = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const refresh = useCallback(() => setSlots(listSlots()), []);
  useEffect(() => { refresh(); }, [refresh]);

  // Dismiss confirm-delete when clicking elsewhere
  const dismissConfirm = useCallback(() => setConfirmDeleteId(null), []);

  function startEdit(id: string, current: string) {
    setEditingId(id); setEditName(current);
  }

  function commitEdit(id: string) {
    const trimmed = editName.trim();
    if (trimmed) { renameSlot(id, trimmed); refresh(); }
    setEditingId(null);
  }

  function handleDelete(id: string) {
    if (confirmDeleteId === id) {
      audio.playSfx('cancel');
      deleteSlotById(id);
      refresh();
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  }

  async function handleImport() {
    setImportError(null);
    const file = await importErsav();
    if (!file) {
      setImportError('Could not read file — make sure it is a valid .ersav file.');
      return;
    }
    audio.playSfx('confirm');
    onLoadFromFile(file);
  }

  return (
    <div className="menu-root" onClick={dismissConfirm}>
      <div className="crt-bars"      aria-hidden="true" />
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-vignette"  aria-hidden="true" />

      <div className="slots-layout">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="slots-header">
          <button
            className="slots-back-btn"
            onMouseEnter={() => audio.playSfx('hover')}
            onClick={e => { e.stopPropagation(); audio.playSfx('cancel'); onBack(); }}
          >
            ◀&nbsp;&nbsp;BACK
          </button>
          <h2 className="slots-title">SAVED GAMES</h2>
        </div>

        {/* ── Slot list ───────────────────────────────────────────── */}
        <div className="slots-scroll">
          {slots.length === 0 && (
            <p className="slots-empty-hint">No saves yet — start a New Slot below.</p>
          )}

          {slots.map(slot => {
            const isEditing  = editingId === slot.id;
            const isConfirm  = confirmDeleteId === slot.id;

            return (
              <div
                key={slot.id}
                className="slot-card"
                onClick={e => e.stopPropagation()}
              >
                {/* Left: info */}
                <div className="slot-card-info">
                  <div className="slot-name-row">
                    {isEditing ? (
                      <input
                        className="slot-name-input"
                        value={editName}
                        autoFocus
                        maxLength={40}
                        onChange={e => setEditName(e.target.value)}
                        onBlur={() => commitEdit(slot.id)}
                        onKeyDown={e => {
                          if (e.key === 'Enter')  { commitEdit(slot.id); }
                          if (e.key === 'Escape') { setEditingId(null); }
                          e.stopPropagation();
                        }}
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <span className="slot-name">{slot.name}</span>
                    )}
                    {!isEditing && (
                      <button
                        className="slot-edit-btn"
                        title="Rename save"
                        onClick={e => { e.stopPropagation(); startEdit(slot.id, slot.name); }}
                      >
                        ✎
                      </button>
                    )}
                  </div>

                  <div className="slot-meta">
                    <span className="slot-summary">{slot.summary}</span>
                    <span className="slot-date">{formatDate(slot.savedAt)}</span>
                  </div>
                </div>

                {/* Right: actions */}
                <div className="slot-card-actions" onClick={e => e.stopPropagation()}>
                  <button
                    className="slot-btn slot-btn-export"
                    title="Export as .ersav file"
                    onMouseEnter={() => audio.playSfx('hover')}
                    onClick={() => { audio.playSfx('click'); exportErsav(slot); }}
                  >
                    EXPORT
                  </button>
                  <button
                    className={`slot-btn slot-btn-delete${isConfirm ? ' slot-btn-delete--confirm' : ''}`}
                    onMouseEnter={() => audio.playSfx('hover')}
                    onClick={() => handleDelete(slot.id)}
                  >
                    {isConfirm ? 'CONFIRM?' : 'DELETE'}
                  </button>
                  <button
                    className="slot-btn slot-btn-primary"
                    onMouseEnter={() => audio.playSfx('hover')}
                    onClick={() => { audio.playSfx('confirm'); onLoadSlot(slot); }}
                  >
                    LOAD GAME
                  </button>
                </div>
              </div>
            );
          })}

          {/* ── New Slot button (always visible at bottom of list) ── */}
          <button
            className="slots-new-btn"
            onMouseEnter={() => audio.playSfx('hover')}
            onClick={e => { e.stopPropagation(); audio.playSfx('confirm'); onNewSlot(); }}
          >
            + NEW SLOT
          </button>
        </div>

        {/* ── Load from file ──────────────────────────────────────── */}
        <div className="slots-import-section" onClick={e => e.stopPropagation()}>
          <button
            className="slots-import-btn"
            onMouseEnter={() => audio.playSfx('hover')}
            onClick={handleImport}
          >
            LOAD FROM FILE&nbsp;&nbsp;<span className="slots-import-ext">.ersav</span>
          </button>
          {importError && <p className="slots-import-error">{importError}</p>}
          <p className="slots-import-hint">
            Load a .ersav file from your PC or a community save — creates a new slot automatically
          </p>
        </div>

      </div>
    </div>
  );
}
