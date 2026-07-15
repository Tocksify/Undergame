// Global type augmentation for the Electron context bridge.
// Only present when the game is running inside Electron.

declare global {
  interface Window {
    electronAPI?: {
      readonly isElectron: true;

      /** List all saved slots, sorted most-recently-saved first. */
      listSlots(): Promise<ElectronLocalSlot[]>;
      /** Get a single slot by its folder-id. */
      getSlot(id: string): Promise<ElectronLocalSlot | null>;
      /** Create a new slot folder and write progress.ersav. Returns the new id. */
      createSlot(data: ElectronErsavFile): Promise<string>;
      /** Overwrite an existing slot's progress.ersav. */
      updateSlot(id: string, data: ElectronErsavFile): Promise<void>;
      /** Rename a slot (updates name inside progress.ersav). */
      renameSlot(id: string, name: string): Promise<void>;
      /** Delete a slot folder permanently. */
      deleteSlot(id: string): Promise<void>;
      /** Open a native Save dialog and write a portable .ersav file. */
      exportErsav(slot: ElectronLocalSlot): Promise<void>;
      /** Open a native Open dialog and return the parsed save, or null. */
      importErsav(): Promise<ElectronErsavFile | null>;
    };
  }
}

// Minimal shape mirrors ErsavFile / LocalSlot from ersav.ts.
// Kept inline here to avoid circular imports from a .d.ts file.
interface ElectronErsavFile {
  version: 1;
  name: string;
  summary: string;
  savedAt: string;
  state: unknown;
}
interface ElectronLocalSlot extends ElectronErsavFile {
  id: string;
}

export {};
