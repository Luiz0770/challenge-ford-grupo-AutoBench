import { vehicles } from '../data/vehicles';
import type { BrandSummary, CategoryVehicleEntry, Vehicle } from '../types';

const byAlertProbability = (a: Vehicle, b: Vehicle) =>
  b.alert.probability - a.alert.probability || a.id.localeCompare(b.id);

const dayOfYear = (date: Date) =>
  Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000);

const sanitizeSpecs = (vehicle: Vehicle): Vehicle => ({
  ...vehicle,
  sections: vehicle.sections.map((section) => ({
    ...section,
    specs: section.specs.map((spec) => ({
      ...spec,
      value: spec.value?.trim() || 'Não Disponível',
    })),
  })),
});

export const VehicleDataService = {
  getVehicleById(id: string): Vehicle | null {
    const vehicle = vehicles.find((v) => v.id === id) ?? null;
    return vehicle ? sanitizeSpecs(vehicle) : null;
  },

  getByCategory(categoryId: string): CategoryVehicleEntry[] {
    return vehicles
      .filter((v) => v.categoryId === categoryId)
      .map((v) => ({
        vehicleId: v.id,
        brand: v.brand,
        model: v.model,
        version: v.version,
        year: v.year,
      }));
  },

  getAllAsEntries(): CategoryVehicleEntry[] {
    return vehicles.map((v) => ({
      vehicleId: v.id,
      brand: v.brand,
      model: v.model,
      version: v.version,
      year: v.year,
    }));
  },

  countByCategory(categoryId: string): number {
    return vehicles.filter((v) => v.categoryId === categoryId).length;
  },

  getTotals(): { vehicles: number; brands: number } {
    return {
      vehicles: vehicles.length,
      brands: new Set(vehicles.map((v) => v.brand)).size,
    };
  },

  // Marcas ordenadas pela quantidade de modelos no catálogo
  getBrands(): BrandSummary[] {
    const counts = new Map<string, number>();
    vehicles.forEach((v) => counts.set(v.brand, (counts.get(v.brand) ?? 0) + 1));
    return Array.from(counts, ([name, count]) => ({ name, count })).sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name, 'pt-BR')
    );
  },

  // Veículos com maior probabilidade de alerta do Oráculo ("Em alta")
  getTopByAlert(limit: number): Vehicle[] {
    return [...vehicles].sort(byAlertProbability).slice(0, limit).map(sanitizeSpecs);
  },

  // Alerta em destaque do dia: gira entre os veículos, estável ao longo do dia
  getDailyAlertVehicle(date: Date = new Date()): Vehicle | null {
    if (!vehicles.length) return null;
    const sorted = [...vehicles].sort(byAlertProbability);
    return sanitizeSpecs(sorted[dayOfYear(date) % sorted.length]);
  },

  getByBrand(brand: string): CategoryVehicleEntry[] {
    return vehicles
      .filter((v) => v.brand === brand)
      .map((v) => ({
        vehicleId: v.id,
        brand: v.brand,
        model: v.model,
        version: v.version,
        year: v.year,
      }));
  },

  getCategoryIdOf(vehicleId: string): string | null {
    return vehicles.find((v) => v.id === vehicleId)?.categoryId ?? null;
  },

  getVersionsByModel(brand: string, model: string): CategoryVehicleEntry[] {
    return vehicles
      .filter((v) => v.brand === brand && v.model === model)
      .map((v) => ({
        vehicleId: v.id,
        brand: v.brand,
        model: v.model,
        version: v.version,
        year: v.year,
      }));
  },

  searchGrouped(query: string): { brand: string; model: string; key: string }[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const seen = new Set<string>();
    const results: { brand: string; model: string; key: string }[] = [];
    for (const v of vehicles) {
      if (v.brand.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)) {
        const key = `${v.brand}|${v.model}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({ brand: v.brand, model: v.model, key });
        }
        if (results.length >= 6) break;
      }
    }
    return results;
  },

  getModelVersionStrings(brand: string, model: string): string[] {
    return [
      ...new Set(
        vehicles
          .filter((v) => v.brand === brand && v.model === model)
          .map((v) => v.version)
      ),
    ];
  },

  getModelYears(brand: string, model: string): number[] {
    return [
      ...new Set(
        vehicles
          .filter((v) => v.brand === brand && v.model === model)
          .map((v) => v.year)
      ),
    ].sort((a, b) => b - a);
  },

  findExactVehicle(
    brand: string,
    model: string,
    version: string,
    year: number
  ): string | null {
    const found = vehicles.find(
      (v) =>
        v.brand === brand &&
        v.model === model &&
        v.version === version &&
        v.year === year
    );
    return found?.id ?? null;
  },
};
