import vehiclesData from '../data/vehicles.json';
import type { CategoryVehicleEntry, Vehicle } from '../types';

const vehicles: Vehicle[] = vehiclesData.vehicles as Vehicle[];

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
