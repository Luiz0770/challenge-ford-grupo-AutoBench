export interface SpecItem {
  label: string;
  value: string;   // NUNCA null — sempre "Não Disponível" quando ausente
  unit?: string;
  highlight?: boolean;
}

export interface SpecSection {
  id: string;
  title: string;
  icon: string;
  specs: SpecItem[];
}

export interface Vehicle {
  id: string;
  categoryId: string;
  brand: string;
  brandFipeCode: string;
  model: string;
  modelFipeCode: string;
  version: string;
  year: number;
  sections: SpecSection[];
}

export interface FipeYear {
  codigo: string;
  nome: string;
}

export interface FipePrice {
  valor: number;
  codigoFipe: string;
  mesReferencia: string;
  modelo: string;
  anoModelo: number;
}

export interface HistoryEntry {
  vehicleId: string;
  vehicleName: string;
  viewedAt: string;
}

export interface FavoriteEntry {
  vehicleId: string;
  vehicleName: string;
  savedAt: string;
}

export interface Category {
  id: string;
  label: string;
  code: string;
  count: number;
  color: string;
  accent: string;
}

export interface CategoryVehicleEntry {
  vehicleId: string;
  brand: string;
  model: string;
  version: string;
  year: number;
}

export interface CompareVerdict {
  title: string;
  summary: string;
  scores: { cat: string; a: number; b: number; leans: 'a' | 'b' | 'tie' }[];
  recommendations: { tag: string; winner: 'a' | 'b'; detail: string }[];
  priceGap: { absolute: number; percent: number; cheaper: 'a' | 'b' };
}

export type CompareCategoryId = 'motorizacao' | 'dimensoes' | 'tecnologia' | 'seguranca';

export interface CompareRow {
  k: string;
  a: string;
  b: string;
  w: 'a' | 'b' | 'tie' | null;
  num: boolean;
  nullA?: boolean;
  nullB?: boolean;
}
