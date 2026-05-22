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

export type AlertType = 'decontenting' | 'price_increase' | 'discontinuation';
export type AlertSeverity = 'low' | 'medium' | 'high';

export interface PredictiveAlert {
  probability: number;
  type: AlertType;
  title: string;
  description: string;
  actionSuggestion: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  brandFipeCode: string;
  model: string;
  modelFipeCode: string;
  version: string;
  year: number;
  priceInCents: number;
  sections: SpecSection[];
  alert: PredictiveAlert;
}

export interface FipeBrand {
  codigo: string;
  nome: string;
}

export interface FipeModel {
  codigo: number;
  nome: string;
}

export interface FipeModelsResponse {
  modelos: FipeModel[];
  anos: { codigo: string; nome: string }[];
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

export interface TrendingBrand {
  name: string;
  count: number;
}

export interface CategoryVehicleEntry {
  vehicleId: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  fipe: number;
}

export interface Suggestion {
  brand: string;
  model: string;
  vehicleId: string;
}

export interface AiSignal {
  label: string;
  value: string;
  weight: number;
}

export interface VehicleAi {
  title: string;
  engine: string;
  confidence: number;
  severity: AlertSeverity;
  timeframe: string;
  summary: string;
  detail: string;
  action: string;
  signals: AiSignal[];
  lastRun: string;
}

export interface MarketCompetitor {
  name: string;
  delta: number;
  fipe: number;
}

export interface VehicleMarket {
  fipeAvg: number;
  delta30: number;
  delta90: number;
  offers: number;
  offerMin: number;
  offerMax: number;
  sparkline: number[];
  ranking: { position: number; total: number; segment: string };
  competitors: MarketCompetitor[];
}

export interface VehicleSources {
  primary: string;
  secondary: string;
  confidence: 'Alta' | 'Média' | 'Baixa';
  cross: number;
}

export interface VehicleMeta {
  segment: string;
  bodyStyle: string;
  fipe: { code: string; month: string };
  sources: VehicleSources;
  market: VehicleMarket;
  ai: VehicleAi;
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
