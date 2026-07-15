import React, { useCallback, useEffect, useState } from 'react';
import { audio } from './game/audio';
import { ErsavFile, loadSlot, saveSlot, deleteSlot, exportErsav, importErsav } from './ersav';

interface Props {
  onBack: () => void;
  onStartSlot: (slot: number, existing: ErsavFile | null) => void;
  onStartFromFile: (save: ErsavFile) => void;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return ''; }
}

export default function SaveSlots({ onBack, onStartSlot, onStartFromFile }: Props) {
  const [slots, setSlots] = useState<(ErsavFile | null)[]>([null, null, null]);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const refresh = useCallback(() => {
    setSlots([loadSlot(1), loadSlot(2), loadSlot(3)]);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  function startEdit(slot: number, current: string) {
    setEditingSlot(slot);
    setEditName(current);
  }

  function commitEdit(slot: number) {
    const existing = loadSlot(slot);
    if (existing) {
      saveSlot(slot, { ...existing, name: editName.trim() || `Save ${slot}` });
      refresh();
    }
    setEditingSlot(null);
  }

  function handleDelete(slot: number) {
    if (confirmDelete === slot) {
      audio.playSfx('cancel');
      deleteSlot(slot);
      refresh();
      setConfirmDelete(null);
    } else {
      setConfirmDelete(slot);
    }
  }

  async function handleImport() {
    setImportError(null);
    const save = await importErsav();
    if (!save) {
      setImportError('Could not read file — make sure it is a valid .ersav file.');
      return;
    }
    audio.playSfx('confirm');
    onStartFromFile(save);
  }

  return (
    <div className="menu-root">
      <div className="crt-bars"      aria-hidden="true" />
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-vignette"  aria-hidden="true" />

      <div className="slots-layout">
        {/* Header */}
        <div className="slots-header">
          <button
            className="slots-back-btn"
            onMouseEnter={() => audio.playSfx('hover')}
            onClick={() => { audio.playSfx('cancel'); onBack(); }}
          >
            ◀&nbsp;&nbsp;BACK
          </button>
          <h2 className="slots-title">SAVED GAMES</h2>
        </div>

        {/* Slot cards */}
        <div className="slots-list">
          {([1, 2, 3] as const).map((slot, i) => {
            const save = slots[i];
            const isEditing = editingSlot === slot;
            const isConfirmingDelete = confirmDelete === slot;

            return (
              <div
                key={slot}
                className="slot-card"
                onClick={() => setConfirmDelete(null)} /* dismiss confirm on click-away */
              >
                {/* Left: info */}
                <div className="slot-card-info">
                  <div className="slot-name-row">
                    {isEditing ? (
                      <input
                        className="slot-name-input"
                        value={editName}
                        autoFocus
                        maxLength={32}
                        onChange={e => setEditName(e.target.value)}
                        onBlur={() => commitEdit(slot)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') commitEdit(slot);
                          if (e.key === 'Escape') setEditingSlot(null);
                          e.stopPropagation();
                        }}
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <span className="slot-name">{save?.name ?? `SAVE ${slot}`}</span>
                    )}
                    {save && !isEditing && (
                      <button
                        className="slot-edit-btn"
                        title="Rename save"
                        onClick={e => { e.stopPropagation(); startEdit(slot, save.name); }}
                      >
                        ✎
                      </button>
                    )}
                  </div>

                  <div className="slot-meta">
                    {save ? (
                      <>
                        <span className="slot-summary">{save.summary}</span>
                        <span className="slot-date">{formatDate(save.savedAt)}</span>
                      </>
                    ) : (
                      <span className="slot-empty">— EMPTY —</span>
                    )}
                  </div>
                </div>

                {/* Right: actions */}
                <div className="slot-card-actions" onClick={e => e.stopPropagation()}>
                  {save && (
                    <button
                      className="slot-btn slot-btn-export"
                      title="Export as .ersav file"
                      onMouseEnter={() => audio.playSfx('hover')}
                      onClick={() => { audio.playSfx('click'); exportErsav(save); }}
                    >
                      EXPORT
                    </button>
                  )}

                  {save && (
                    <button
                      className={`slot-btn slot-btn-delete${isConfirmingDelete ? ' slot-btn-delete--confirm' : ''}`}
                      onMouseEnter={() => audio.playSfx('hover')}
                      onClick={() => handleDelete(slot)}
                    >
                      {isConfirmingDelete ? 'CONFIRM?' : 'DELETE'}
                    </button>
                  )}

                  <button
                    className="slot-btn slot-btn-primary"
                    onMouseEnter={() => audio.playSfx('hover')}
                    onClick={() => { audio.playSfx('confirm'); onStartSlot(slot, save ?? null); }}
                  >
                    {save ? 'LOAD GAME' : 'NEW GAME'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Import from file */}
        <div className="slots-import-section">
          <button
            className="slots-import-btn"
            onMouseEnter={() => audio.playSfx('hover')}
            onClick={handleImport}
          >
            📂&nbsp;&nbsp;LOAD FROM FILE&nbsp;&nbsp;<span className="slots-import-ext">.ersav</span>
          </button>
          {importError && <p className="slots-import-error">{importError}</p>}
          <p className="slots-import-hint">
            Load a .ersav file from your PC or from a community save
          </p>
        </div>
      </div>
    </div>
  );
}
