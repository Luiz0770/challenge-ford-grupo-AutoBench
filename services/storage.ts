import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FavoriteEntry, HistoryEntry } from '../types';

const KEYS = {
  favorites: '@oraculo:favorites',
  history: '@oraculo:history',
} as const;

const MAX_HISTORY = 20;

export const StorageService = {
  async getFavorites(): Promise<FavoriteEntry[]> {
    const raw = await AsyncStorage.getItem(KEYS.favorites);
    return raw ? JSON.parse(raw) : [];
  },

  async saveFavorite(entry: FavoriteEntry): Promise<void> {
    const current = await StorageService.getFavorites();
    const filtered = current.filter((f) => f.vehicleId !== entry.vehicleId);
    await AsyncStorage.setItem(KEYS.favorites, JSON.stringify([...filtered, entry]));
  },

  async removeFavorite(vehicleId: string): Promise<void> {
    const current = await StorageService.getFavorites();
    const updated = current.filter((f) => f.vehicleId !== vehicleId);
    await AsyncStorage.setItem(KEYS.favorites, JSON.stringify(updated));
  },

  async getHistory(): Promise<HistoryEntry[]> {
    const raw = await AsyncStorage.getItem(KEYS.history);
    return raw ? JSON.parse(raw) : [];
  },

  async addHistory(entry: HistoryEntry): Promise<void> {
    const current = await StorageService.getHistory();
    const filtered = current.filter((h) => h.vehicleId !== entry.vehicleId);
    const updated = [entry, ...filtered].slice(0, MAX_HISTORY);
    await AsyncStorage.setItem(KEYS.history, JSON.stringify(updated));
  },

  async clearHistory(): Promise<void> {
    await AsyncStorage.setItem(KEYS.history, JSON.stringify([]));
  },
};
