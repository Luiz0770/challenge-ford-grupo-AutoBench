import categoriesData from '../data/categories.json';
import compareData from '../data/compare.json';
import marketData from '../data/market.json';
import type {
  Category,
  CategoryVehicleEntry,
  CompareCategoryId,
  CompareRow,
  CompareVerdict,
  Suggestion,
  TrendingBrand,
  Vehicle,
  VehicleMeta,
} from '../types';
import { VehicleDataService } from './vehicleData';

const categories = categoriesData.categories as Category[];
const trendingBrands = categoriesData.trendingBrands as TrendingBrand[];
const categoryVehicles = categoriesData.categoryVehicles as Record<string, CategoryVehicleEntry[]>;
const suggestions = categoriesData.suggestions as Suggestion[];

const marketByVehicleId = marketData.byVehicleId as Record<string, VehicleMeta>;
const compareCategoryMap = compareData.categoryMap as Record<CompareCategoryId, string[]>;
const compareAlternatives = compareData.alternatives as CategoryVehicleEntry[];
const compareVerdicts = compareData.verdicts as Record<string, CompareVerdict>;
const compareDefaultPair = compareData.defaultPair as { a: string; b: string };

export const CatalogService = {
  getCategories(): Category[] {
    return categories;
  },

  getCategoryById(id: string): Category | null {
    return categories.find((c) => c.id === id) ?? null;
  },

  getTrendingBrands(): TrendingBrand[] {
    return trendingBrands;
  },

  getCategoryVehicles(categoryId: string): CategoryVehicleEntry[] {
    return categoryVehicles[categoryId] ?? [];
  },

  getSuggestions(query: string): Suggestion[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return suggestions
      .filter(
        (s) => s.brand.toLowerCase().includes(q) || s.model.toLowerCase().includes(q)
      )
      .slice(0, 6);
  },

  getVehicleMeta(vehicleId: string): VehicleMeta | null {
    return marketByVehicleId[vehicleId] ?? null;
  },

  getCompareAlternatives(): CategoryVehicleEntry[] {
    return compareAlternatives;
  },

  getCompareDefaultPair(): { a: Vehicle | null; b: Vehicle | null } {
    return {
      a: VehicleDataService.getVehicleById(compareDefaultPair.a),
      b: VehicleDataService.getVehicleById(compareDefaultPair.b),
    };
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

  buildCompareRows(category: CompareCategoryId, a: Vehicle, b: Vehicle): CompareRow[] {
    const sectionIds = compareCategoryMap[category] ?? [];
    const aSpecs = collectSpecs(a, sectionIds);
    const bSpecs = collectSpecs(b, sectionIds);
    const keys = unionLabels(aSpecs, bSpecs);

    return keys.map((label) => {
      const av = aSpecs.get(label) ?? 'Não Disponível';
      const bv = bSpecs.get(label) ?? 'Não Disponível';
      const aNum = parseNum(av);
      const bNum = parseNum(bv);
      const isNum = aNum !== null && bNum !== null;
      let winner: CompareRow['w'] = null;
      if (isNum && aNum !== bNum) winner = aNum > bNum ? 'a' : 'b';
      else if (isNum && aNum === bNum) winner = 'tie';
      else if (av === bv) winner = 'tie';
      return {
        k: label,
        a: av,
        b: bv,
        w: winner,
        num: isNum,
        nullA: av === 'Não Disponível',
        nullB: bv === 'Não Disponível',
      };
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
  if (!value || value === 'Não Disponível') return null;
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
