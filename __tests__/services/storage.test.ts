import AsyncStorage from '@react-native-async-storage/async-storage';
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import { StorageService } from '../../services/storage';
import type { FavoriteEntry, HistoryEntry } from '../../types';

const mockFavorite: FavoriteEntry = {
  vehicleId: 'ford-ranger-raptor-2024',
  vehicleName: 'Ford Ranger Raptor 2024',
  savedAt: '2024-01-01T00:00:00.000Z',
};

const mockHistory: HistoryEntry = {
  vehicleId: 'ford-ranger-raptor-2024',
  vehicleName: 'Ford Ranger Raptor 2024',
  viewedAt: '2024-01-01T00:00:00.000Z',
};

describe('StorageService.favorites', () => {
  beforeEach(() => AsyncStorage.clear());

  it('saves and retrieves a favorite', async () => {
    await StorageService.saveFavorite(mockFavorite);
    const result = await StorageService.getFavorites();
    expect(result).toHaveLength(1);
    expect(result[0].vehicleId).toBe('ford-ranger-raptor-2024');
  });

  it('removes a favorite by vehicleId', async () => {
    await StorageService.saveFavorite(mockFavorite);
    await StorageService.removeFavorite('ford-ranger-raptor-2024');
    const result = await StorageService.getFavorites();
    expect(result).toHaveLength(0);
  });

  it('returns empty array when no favorites exist', async () => {
    const result = await StorageService.getFavorites();
    expect(result).toEqual([]);
  });
});

describe('StorageService.history', () => {
  beforeEach(() => AsyncStorage.clear());

  it('saves a history entry', async () => {
    await StorageService.addHistory(mockHistory);
    const result = await StorageService.getHistory();
    expect(result[0].vehicleId).toBe('ford-ranger-raptor-2024');
  });

  it('deduplicates history entries', async () => {
    await StorageService.addHistory(mockHistory);
    await StorageService.addHistory({ ...mockHistory, viewedAt: '2024-02-01T00:00:00.000Z' });
    const result = await StorageService.getHistory();
    expect(result).toHaveLength(1);
    expect(result[0].viewedAt).toBe('2024-02-01T00:00:00.000Z');
  });

  it('clears all history', async () => {
    await StorageService.addHistory(mockHistory);
    await StorageService.clearHistory();
    const result = await StorageService.getHistory();
    expect(result).toEqual([]);
  });
});
