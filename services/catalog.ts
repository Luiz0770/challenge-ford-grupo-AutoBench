import categoriesData from '../data/categories.json';
import type {
  Category,
  CategoryVehicleEntry,
  CompareCategoryId,
  CompareRow,
  CompareVerdict,
  Vehicle,
} from '../types';
import { VehicleDataService } from './vehicleData';

type CategoryBase = Omit<Category, 'count'>;
const categoryBases = categoriesData.categories as CategoryBase[];

const compareCategoryMap: Record<CompareCategoryId, string[]> = {
  motorizacao: ['engine', 'transmission'],
  dimensoes:   ['dimensions', 'wheels'],
  tecnologia:  ['tech', 'lighting', 'driving_modes'],
  seguranca:   ['safety', 'suspension'],
};

const compareVerdicts: Record<string, CompareVerdict> = {
  'ford-ranger-raptor-2024|ford-ranger-limited-2024': {
    title: 'Veredito Oráculo',
    summary: 'Raptor lidera em performance e tração; Limited compensa em valor e conforto urbano.',
    scores: [
      { cat: 'Motorização', a: 72, b: 28, leans: 'a' },
      { cat: 'Dimensões',   a: 52, b: 48, leans: 'a' },
      { cat: 'Tecnologia',  a: 61, b: 39, leans: 'a' },
      { cat: 'Segurança',   a: 54, b: 46, leans: 'a' },
    ],
    recommendations: [
      { tag: 'Off-road extremo',   winner: 'a', detail: 'Raptor — V6 397 cv, suspensão Live Valve FOX e 8 modos de condução. Sem rival nesta lista.' },
      { tag: 'Uso urbano + valor', winner: 'b', detail: 'Limited — torque diesel, 10 marchas e equipamentos premium por R$ 150 mil a menos.' },
    ],
    priceGap: { absolute: 150000, percent: 30.1, cheaper: 'b' },
  },
};

export const CatalogService = {
  getCategories(): Category[] {
    return categoryBases.map((c) => ({
      ...c,
      count: VehicleDataService.countByCategory(c.id),
    }));
  },

  getCategoryVehicles(categoryId: string): CategoryVehicleEntry[] {
    return VehicleDataService.getByCategory(categoryId);
  },

  getSuggestions(query: string) {
    return VehicleDataService.search(query);
  },

  searchGrouped(query: string) {
    return VehicleDataService.searchGrouped(query);
  },

  getModelVersionStrings(brand: string, model: string) {
    return VehicleDataService.getModelVersionStrings(brand, model);
  },

  getModelYears(brand: string, model: string) {
    return VehicleDataService.getModelYears(brand, model);
  },

  findExactVehicle(brand: string, model: string, version: string, year: number) {
    return VehicleDataService.findExactVehicle(brand, model, version, year);
  },

  getModelVehicles(brand: string, model: string) {
    return VehicleDataService.getVersionsByModel(brand, model);
  },

  getCompareAlternatives(): CategoryVehicleEntry[] {
    return VehicleDataService.getAllAsEntries();
  },

  getCompareVerdict(aId: string, bId: string): CompareVerdict {
    const key = `${aId}|${bId}`;
    const reverseKey = `${bId}|${aId}`;
    const found = compareVerdicts[key];
    if (found) return found;
    const reversed = compareVerdicts[reverseKey];
    if (reversed) {
      return {
        ...reversed,
        scores: reversed.scores.map((s) => ({
          cat: s.cat,
          a: s.b,
          b: s.a,
          leans: s.leans === 'a' ? 'b' : s.leans === 'b' ? 'a' : 'tie',
        })),
        recommendations: reversed.recommendations.map((r) => ({
          ...r,
          winner: r.winner === 'a' ? 'b' : 'a',
        })),
        priceGap: {
          ...reversed.priceGap,
          cheaper: reversed.priceGap.cheaper === 'a' ? 'b' : 'a',
        },
      };
    }
    return synthesizeVerdict(aId, bId);
  },

  buildCompareRows(category: CompareCategoryId, a: Vehicle | null, b: Vehicle | null): CompareRow[] {
    if (!a && !b) return [];
    const sectionIds = compareCategoryMap[category] ?? [];
    const aSpecs = a ? collectSpecs(a, sectionIds) : new Map<string, string>();
    const bSpecs = b ? collectSpecs(b, sectionIds) : new Map<string, string>();
    const keys = unionLabels(aSpecs, bSpecs);

    return keys.map((label) => {
      const av = a ? (aSpecs.get(label) ?? 'Não Disponível') : '—';
      const bv = b ? (bSpecs.get(label) ?? 'Não Disponível') : '—';
      const nullA = !a || av === 'Não Disponível';
      const nullB = !b || bv === 'Não Disponível';
      const aNum = parseNum(av);
      const bNum = parseNum(bv);
      const isNum = aNum !== null && bNum !== null;
      let winner: CompareRow['w'] = null;
      if (a && b) {
        if (isNum && aNum !== bNum) winner = aNum > bNum ? 'a' : 'b';
        else if (isNum && aNum === bNum) winner = 'tie';
        else if (av === bv) winner = 'tie';
      }
      return { k: label, a: av, b: bv, w: winner, num: isNum, nullA, nullB };
    });
  },
};

const collectSpecs = (vehicle: Vehicle, sectionIds: string[]) => {
  const out = new Map<string, string>();
  vehicle.sections
    .filter((s) => sectionIds.includes(s.id))
    .forEach((s) =>
      s.specs.forEach((spec) => {
        out.set(spec.label, spec.unit ? `${spec.value} ${spec.unit}` : spec.value);
      })
    );
  return out;
};

const unionLabels = (a: Map<string, string>, b: Map<string, string>): string[] => {
  const set = new Set<string>();
  a.forEach((_, k) => set.add(k));
  b.forEach((_, k) => set.add(k));
  return Array.from(set);
};

const parseNum = (value: string): number | null => {
  if (!value || value === 'Não Disponível' || value === '—') return null;
  const m = value.replace(/\./g, '').replace(',', '.').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
};

const synthesizeVerdict = (aId: string, bId: string): CompareVerdict => ({
  title: 'Veredito Oráculo',
  summary: 'Comparativo equilibrado — sem dados curados para esta combinação.',
  scores: [
    { cat: 'Motorização', a: 50, b: 50, leans: 'tie' },
    { cat: 'Dimensões',   a: 50, b: 50, leans: 'tie' },
    { cat: 'Tecnologia',  a: 50, b: 50, leans: 'tie' },
    { cat: 'Segurança',   a: 50, b: 50, leans: 'tie' },
  ],
  recommendations: [
    { tag: 'Análise indisponível', winner: 'a', detail: `Sem veredito curado para ${aId} vs ${bId}.` },
  ],
  priceGap: { absolute: 0, percent: 0, cheaper: 'a' },
});
