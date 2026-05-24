import { VehicleDataService } from '../../services/vehicleData';

describe('VehicleDataService.getVersionsByModel', () => {
  it('returns versions for Ford Ranger', () => {
    const versions = VehicleDataService.getVersionsByModel('Ford', 'Ranger');
    expect(versions.length).toBeGreaterThanOrEqual(3);
    expect(versions.every((v) => v.brand === 'Ford')).toBe(true);
    expect(versions.every((v) => v.model === 'Ranger')).toBe(true);
  });

  it('returns empty array for unknown model', () => {
    const versions = VehicleDataService.getVersionsByModel('Ford', 'NonExistent');
    expect(versions).toEqual([]);
  });
});

describe('VehicleDataService.getVehicleById', () => {
  it('returns vehicle for valid id', () => {
    const vehicle = VehicleDataService.getVehicleById('ford-ranger-raptor-2024');
    expect(vehicle).not.toBeNull();
    expect(vehicle?.version).toBe('Raptor');
  });

  it('returns null for unknown id', () => {
    const vehicle = VehicleDataService.getVehicleById('unknown-id');
    expect(vehicle).toBeNull();
  });

  it('never has null or empty string spec values', () => {
    const vehicle = VehicleDataService.getVehicleById('ford-ranger-raptor-2024');
    vehicle!.sections.forEach((section) => {
      section.specs.forEach((spec) => {
        expect(spec.value).not.toBeNull();
        expect(spec.value.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('VehicleDataService.searchByBrandModelFipeCodes', () => {
  it('returns Ford Ranger Raptor by FIPE code', () => {
    const versions = VehicleDataService.searchByBrandModelFipeCodes('22', '10891');
    expect(versions.length).toBeGreaterThanOrEqual(1);
  });

  it('returns empty array for unknown codes', () => {
    const versions = VehicleDataService.searchByBrandModelFipeCodes('99', '9999');
    expect(versions).toEqual([]);
  });
});

describe('VehicleDataService.searchGrouped', () => {
  it('deduplicates brand+model results', () => {
    const results = VehicleDataService.searchGrouped('ranger');
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({ brand: 'Ford', model: 'Ranger', key: 'Ford|Ranger' });
  });

  it('returns empty array for empty query', () => {
    expect(VehicleDataService.searchGrouped('')).toHaveLength(0);
  });

  it('matches on brand name', () => {
    const results = VehicleDataService.searchGrouped('ford');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].brand).toBe('Ford');
  });
});

describe('VehicleDataService.getModelVersionStrings', () => {
  it('returns unique version strings for a brand+model', () => {
    const versions = VehicleDataService.getModelVersionStrings('Ford', 'Ranger');
    expect(versions).toContain('Raptor');
    expect(versions).toContain('Limited');
    expect(versions).toContain('XLS');
    expect(new Set(versions).size).toBe(versions.length);
  });

  it('returns empty array for unknown brand+model', () => {
    expect(VehicleDataService.getModelVersionStrings('Unknown', 'Car')).toHaveLength(0);
  });
});

describe('VehicleDataService.getModelYears', () => {
  it('returns unique years sorted descending', () => {
    const years = VehicleDataService.getModelYears('Ford', 'Ranger');
    expect(years).toContain(2024);
    expect(new Set(years).size).toBe(years.length);
    for (let i = 0; i < years.length - 1; i++) {
      expect(years[i]).toBeGreaterThanOrEqual(years[i + 1]);
    }
  });

  it('returns empty array for unknown brand+model', () => {
    expect(VehicleDataService.getModelYears('Unknown', 'Car')).toHaveLength(0);
  });
});

describe('VehicleDataService.findExactVehicle', () => {
  it('returns vehicleId for exact match', () => {
    const id = VehicleDataService.findExactVehicle('Ford', 'Ranger', 'Raptor', 2024);
    expect(id).toBe('ford-ranger-raptor-2024');
  });

  it('returns null when year does not match', () => {
    const id = VehicleDataService.findExactVehicle('Ford', 'Ranger', 'Raptor', 2020);
    expect(id).toBeNull();
  });
});
