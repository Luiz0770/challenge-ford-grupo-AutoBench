import { CatalogService } from '../services/catalog';
import { VehicleDataService } from '../services/vehicleData';
import type { Vehicle } from '../types';

const get = (id: string) => VehicleDataService.getVehicleById(id) as Vehicle;

describe('VehicleDataService.searchVehicles', () => {
  it('retorna vazio para busca em branco', () => {
    expect(VehicleDataService.searchVehicles('   ')).toEqual([]);
  });

  it('busca por marca, modelo e versão sem diferenciar maiúsculas', () => {
    const byModel = VehicleDataService.searchVehicles('ranger');
    expect(byModel.length).toBeGreaterThanOrEqual(3);
    expect(byModel.every((e) => e.model.toLowerCase().includes('ranger'))).toBe(true);

    const byVersion = VehicleDataService.searchVehicles('RAPTOR');
    expect(byVersion.some((e) => e.vehicleId === 'ford-ranger-raptor-2024')).toBe(true);

    const byBrandModel = VehicleDataService.searchVehicles('ford ranger');
    expect(byBrandModel.length).toBe(byModel.filter((e) => e.brand === 'Ford').length);
  });

  it('não limita os resultados a 6', () => {
    const all = VehicleDataService.searchVehicles('a');
    expect(all.length).toBeGreaterThan(6);
  });
});

describe('CatalogService.getCompareDuels', () => {
  it('só devolve pares cujos dois lados existem no catálogo', () => {
    const duels = CatalogService.getCompareDuels();
    expect(duels.length).toBeGreaterThan(0);
    duels.forEach(([x, y]) => {
      expect(VehicleDataService.getVehicleById(x.vehicleId)).not.toBeNull();
      expect(VehicleDataService.getVehicleById(y.vehicleId)).not.toBeNull();
      expect(x.vehicleId).not.toBe(y.vehicleId);
    });
  });
});

describe('CatalogService.getCompareVerdict', () => {
  it('usa o veredito curado quando existe', () => {
    const v = CatalogService.getCompareVerdict(
      get('ford-ranger-raptor-2024'),
      get('ford-ranger-limited-2024'),
    );
    expect(v.priceGap.absolute).toBe(150000);
  });

  it('inverte o veredito curado quando a ordem é trocada', () => {
    const v = CatalogService.getCompareVerdict(
      get('ford-ranger-limited-2024'),
      get('ford-ranger-raptor-2024'),
    );
    expect(v.scores[0].leans).toBe('b');
    expect(v.priceGap.cheaper).toBe('a');
  });

  it('sintetiza o veredito pelos vencedores da matriz quando não há curadoria', () => {
    const a = get('ford-ranger-xls-2024');
    const b = get('toyota-hilux-sr5-2024');
    const v = CatalogService.getCompareVerdict(a, b);
    expect(v.scores).toHaveLength(4);
    (['motorizacao', 'dimensoes', 'tecnologia', 'seguranca'] as const).forEach((cat, i) => {
      const rows = CatalogService.buildCompareRows(cat, a, b);
      const wa = rows.filter((r) => r.w === 'a').length;
      const wb = rows.filter((r) => r.w === 'b').length;
      const s = v.scores[i];
      expect(s.a + s.b).toBe(100);
      if (wa === wb) {
        expect(s.leans).toBe('tie');
        expect(s.a).toBe(50);
      } else {
        expect(s.leans).toBe(wa > wb ? 'a' : 'b');
        expect(s.a > s.b).toBe(wa > wb);
      }
    });
    expect(v.priceGap.absolute).toBe(0);
  });

  it('é simétrico: trocar A e B espelha os scores sintetizados', () => {
    const a = get('ford-ranger-xls-2024');
    const b = get('toyota-hilux-sr5-2024');
    const ab = CatalogService.getCompareVerdict(a, b);
    const ba = CatalogService.getCompareVerdict(b, a);
    ab.scores.forEach((s, i) => {
      expect(ba.scores[i].a).toBe(s.b);
      expect(ba.scores[i].b).toBe(s.a);
    });
  });
});
