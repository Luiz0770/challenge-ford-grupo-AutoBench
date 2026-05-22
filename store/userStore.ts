import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FavoriteEntry, HistoryEntry } from '../types';

interface UserState {
  favorites: FavoriteEntry[];
  history: HistoryEntry[];
  addFavorite: (entry: FavoriteEntry) => void;
  removeFavorite: (vehicleId: string) => void;
  isFavorite: (vehicleId: string) => boolean;
  addHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      favorites: [],
      history: [],
      addFavorite: (entry) =>
        set((s) => ({
          favorites: [
            ...s.favorites.filter((f) => f.vehicleId !== entry.vehicleId),
            entry,
          ],
        })),
      removeFavorite: (vehicleId) =>
        set((s) => ({
          favorites: s.favorites.filter((f) => f.vehicleId !== vehicleId),
        })),
      isFavorite: (vehicleId) =>
        get().favorites.some((f) => f.vehicleId === vehicleId),
      addHistory: (entry) =>
        set((s) => ({
          history: [
            entry,
            ...s.history.filter((h) => h.vehicleId !== entry.vehicleId),
          ].slice(0, 20),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'oraculo-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
