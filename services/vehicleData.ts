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
  getVersionsByModel(brand: string, model: string): Vehicle[] {
    return vehicles
      .filter((v) => v.brand === brand && v.model === model)
      .map(sanitizeSpecs);
  },

  getVehicleById(id: string): Vehicle | null {
    const vehicle = vehicles.find((v) => v.id === id) ?? null;
    return vehicle ? sanitizeSpecs(vehicle) : null;
  },

  searchByBrandModelFipeCodes(brandCode: string, modelCode: string): Vehicle[] {
    return vehicles
      .filter(
        (v) => v.brandFipeCode === brandCode && v.modelFipeCode === String(modelCode)
      )
      .map(sanitizeSpecs);
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
        fipe: v.priceInCents / 100,
      }));
  },

  getAllAsEntries(): CategoryVehicleEntry[] {
    return vehicles.map((v) => ({
      vehicleId: v.id,
      brand: v.brand,
      model: v.model,
      version: v.version,
      year: v.year,
      fipe: v.priceInCents / 100,
    }));
  },

  search(query: string): { brand: string; model: string; vehicleId: string }[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return vehicles
      .filter(
        (v) =>
          v.brand.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.version.toLowerCase().includes(q)
      )
      .slice(0, 6)
      .map((v) => ({ brand: v.brand, model: v.model, vehicleId: v.id }));
  },
};
