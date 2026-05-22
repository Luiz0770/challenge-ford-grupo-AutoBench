export interface SpecItem {
  label: string;
  value: string;   // NUNCA null — sempre "Não Disponível" quando ausente
  unit?: string;
  highlight?: boolean;
}

export interface SpecSection {
  id: string;
  title: string;
  icon: string;    // Ionicons icon name
  specs: SpecItem[];
}

export type AlertType = "decontenting" | "price_increase" | "discontinuation";

export interface PredictiveAlert {
  probability: number;       // 0–100
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
  vehicleName: string;   // "{brand} {model} {version} {year}"
  viewedAt: string;      // ISO 8601 string
}

export interface FavoriteEntry {
  vehicleId: string;
  vehicleName: string;
  savedAt: string;       // ISO 8601 string
}
