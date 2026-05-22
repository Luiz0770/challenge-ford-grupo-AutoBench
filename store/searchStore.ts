import { create } from 'zustand';

interface SearchState {
  selectedBrandCode: string | null;
  selectedBrandName: string | null;
  selectedModelCode: number | null;
  selectedModelName: string | null;
  setSelectedBrand: (code: string, name: string) => void;
  setSelectedModel: (code: number, name: string) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  selectedBrandCode: null,
  selectedBrandName: null,
  selectedModelCode: null,
  selectedModelName: null,
  setSelectedBrand: (code, name) =>
    set({
      selectedBrandCode: code,
      selectedBrandName: name,
      selectedModelCode: null,
      selectedModelName: null,
    }),
  setSelectedModel: (code, name) =>
    set({ selectedModelCode: code, selectedModelName: name }),
  reset: () =>
    set({
      selectedBrandCode: null,
      selectedBrandName: null,
      selectedModelCode: null,
      selectedModelName: null,
    }),
}));
