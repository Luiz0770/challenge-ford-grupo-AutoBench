import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { BuildService } from '../services/build';
import type { Build, SystemId } from '../types';

interface BuildState {
  /** Montagens salvas (persistidas), a mais recente primeiro */
  builds: Build[];
  /** Montagem em edição (não persistida) */
  draft: Build | null;
  /** Aviso transitório exibido como toast pela tela inicial (não persistido) */
  notice: string | null;
  startDraft: (build: Build) => void;
  setPart: (systemId: SystemId, key: string) => void;
  setName: (name: string) => void;
  restoreDraft: () => void;
  discardDraft: () => void;
  saveDraft: () => void;
  openBuild: (id: string) => void;
  deleteBuild: (id: string) => void;
  clearNotice: () => void;
}

export const useBuildStore = create<BuildState>()(
  persist(
    (set, get) => ({
      builds: [],
      draft: null,
      notice: null,

      startDraft: (build) => set({ draft: build }),

      setPart: (systemId, key) =>
        set((s) =>
          s.draft ? { draft: { ...s.draft, parts: { ...s.draft.parts, [systemId]: key } } } : s,
        ),

      setName: (name) => set((s) => (s.draft ? { draft: { ...s.draft, name } } : s)),

      restoreDraft: () => set((s) => (s.draft ? { draft: BuildService.restore(s.draft) } : s)),

      discardDraft: () => set({ draft: null }),

      // Só salva com os 7 sistemas definidos
      saveDraft: () => {
        const { draft, builds } = get();
        if (!draft || !BuildService.summarize(draft).complete) return;
        const saved: Build = {
          ...draft,
          name: draft.name.trim() || 'Minha montagem',
          updatedAt: new Date().toISOString(),
        };
        set({
          builds: [saved, ...builds.filter((b) => b.id !== saved.id)],
          draft: null,
          notice: 'Montagem salva',
        });
      },

      openBuild: (id) => {
        const found = get().builds.find((b) => b.id === id);
        if (found) set({ draft: { ...found, parts: { ...found.parts } } });
      },

      deleteBuild: (id) => set((s) => ({ builds: s.builds.filter((b) => b.id !== id) })),

      clearNotice: () => set({ notice: null }),
    }),
    {
      name: 'autobench-builds',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ builds: s.builds }),
    },
  ),
);
