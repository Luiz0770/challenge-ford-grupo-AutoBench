import vehiclesData from '../data/vehicles.json';
import type { Vehicle } from '../types';

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
};
