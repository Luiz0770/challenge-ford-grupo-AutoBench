import { CatalogService } from '../services/catalog';
import { VehicleDataService } from '../services/vehicleData';

describe('VehicleDataService', () => {
  it('todos os veículos têm alerta com probabilidade entre 0 e 100', () => {
    const all = VehicleDataService.getTopByAlert(Number.MAX_SAFE_INTEGER);
    expect(all.length).toBe(VehicleDataService.getTotals().vehicles);
    all.forEach((v) => {
      expect(v.alert.probability).toBeGreaterThanOrEqual(0);
      expect(v.alert.probability).toBeLessThanOrEqual(100);
      expect(v.alert.title).toBeTruthy();
    });
  });

  it('getTopByAlert ordena pela probabilidade decrescente', () => {
    const top = VehicleDataService.getTopByAlert(4);
    expect(top).toHaveLength(4);
    for (let i = 1; i < top.length; i++) {
      expect(top[i - 1].alert.probability).toBeGreaterThanOrEqual(top[i].alert.probability);
    }
  });

  it('getBrands soma o total de veículos e vem ordenado por contagem', () => {
    const brands = VehicleDataService.getBrands();
    const { vehicles, brands: brandCount } = VehicleDataService.getTotals();
    expect(brands).toHaveLength(brandCount);
    expect(brands.reduce((s, b) => s + b.count, 0)).toBe(vehicles);
    for (let i = 1; i < brands.length; i++) {
      expect(brands[i - 1].count).toBeGreaterThanOrEqual(brands[i].count);
    }
  });

  it('getDailyAlertVehicle é estável no mesmo dia e muda no dia seguinte', () => {
    const morning = VehicleDataService.getDailyAlertVehicle(new Date(2026, 8, 23, 8));
    const night = VehicleDataService.getDailyAlertVehicle(new Date(2026, 8, 23, 22));
    const tomorrow = VehicleDataService.getDailyAlertVehicle(new Date(2026, 8, 24, 8));
    expect(morning?.id).toBe(night?.id);
    expect(tomorrow?.id).not.toBe(morning?.id);
  });
});

describe('CatalogService', () => {
  it('getAvailableCategories só retorna categorias com veículos', () => {
    const available = CatalogService.getAvailableCategories();
    expect(available.length).toBeGreaterThan(0);
    available.forEach((c) => expect(c.count).toBeGreaterThan(0));
  });
});

describe('filtro por marca', () => {
  it('getByBrand devolve só veículos da marca e bate com a contagem de getBrands', () => {
    VehicleDataService.getBrands().forEach(({ name, count }) => {
      const list = VehicleDataService.getByBrand(name);
      expect(list).toHaveLength(count);
      list.forEach((v) => expect(v.brand).toBe(name));
    });
  });

  it('getByBrand devolve lista vazia para marca inexistente', () => {
    expect(VehicleDataService.getByBrand('Marca Inexistente')).toEqual([]);
  });

  it('getCategoryIdOf resolve a categoria de um veículo do catálogo', () => {
    const [first] = VehicleDataService.getAllAsEntries();
    expect(VehicleDataService.getCategoryIdOf(first.vehicleId)).toBeTruthy();
    expect(VehicleDataService.getCategoryIdOf('nao-existe')).toBeNull();
  });
});
