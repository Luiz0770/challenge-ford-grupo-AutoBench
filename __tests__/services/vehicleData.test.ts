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
  it('returns Ford Ranger versions by FIPE codes', () => {
    const versions = VehicleDataService.searchByBrandModelFipeCodes('22', '4596');
    expect(versions.length).toBeGreaterThanOrEqual(3);
  });

  it('returns empty array for unknown codes', () => {
    const versions = VehicleDataService.searchByBrandModelFipeCodes('99', '9999');
    expect(versions).toEqual([]);
  });
});
