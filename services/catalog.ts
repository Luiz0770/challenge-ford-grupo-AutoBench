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

const popularDuels: [string, string][] = [
  ['ford-ranger-raptor-2024', 'ford-ranger-limited-2024'],
  ['ford-ranger-limited-2024', 'toyota-hilux-sr5-2024'],
  ['fiat-toro-ultra-2024', 'ford-ranger-limited-2024'],
];

export const CatalogService = {
  getCategories(): Category[] {
    return categoryBases.map((c) => ({
      ...c,
      count: VehicleDataService.countByCategory(c.id),
    }));
  },

  // Apenas categorias com ao menos um veículo no catálogo
  getAvailableCategories(): Category[] {
    return CatalogService.getCategories().filter((c) => c.count > 0);
  },

  getCategoryById(categoryId: string): Category | null {
    return CatalogService.getCategories().find((c) => c.id === categoryId) ?? null;
  },

  getCategoryVehicles(categoryId: string): CategoryVehicleEntry[] {
    return VehicleDataService.getByCategory(categoryId);
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

  // Pares em destaque no setup; um par só aparece se os dois lados existirem no catálogo
  getCompareDuels(): [CategoryVehicleEntry, CategoryVehicleEntry][] {
    const all = VehicleDataService.getAllAsEntries();
    const find = (id: string) => all.find((e) => e.vehicleId === id);
    return popularDuels
      .map(([x, y]) => [find(x), find(y)] as const)
      .filter((p): p is readonly [CategoryVehicleEntry, CategoryVehicleEntry] => !!p[0] && !!p[1])
      .map(([x, y]) => [x, y]);
  },

  getCompareVerdict(a: Vehicle, b: Vehicle): CompareVerdict {
    const key = `${a.id}|${b.id}`;
    const reverseKey = `${b.id}|${a.id}`;
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
    return synthesizeVerdict(a, b);
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
      const lowerIsBetter = LOWER_IS_BETTER_LABELS.has(label);
      const aAbsent = isAbsentValue(av);
      const bAbsent = isAbsentValue(bv);
      let winner: CompareRow['w'] = null;
      if (a && b) {
        if (isNum && aNum !== bNum) {
          winner = lowerIsBetter ? (aNum < bNum ? 'a' : 'b') : aNum > bNum ? 'a' : 'b';
        } else if (isNum && aNum === bNum) winner = 'tie';
        else if (aAbsent && !bAbsent) winner = 'b';
        else if (bAbsent && !aAbsent) winner = 'a';
        else if (av === bv) winner = 'tie';
      }
      return { k: label, a: av, b: bv, w: winner, num: isNum, nullA, nullB };
    });
  },
};

// Especificações numéricas onde o menor valor é o melhor (ex.: tempo de aceleração).
const LOWER_IS_BETTER_LABELS = new Set<string>(['0-100 km/h']);

// Valores que representam ausência do item — quando só um lado tem, o outro perde essa linha.
const isAbsentValue = (value: string) => value === 'Não Possui' || value === 'Não Disponível';

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

const compareCategoryLabels: Record<CompareCategoryId, string> = {
  motorizacao: 'Motorização',
  dimensoes: 'Dimensões',
  tecnologia: 'Tecnologia',
  seguranca: 'Segurança',
};

const vehicleName = (v: Vehicle) => `${v.brand} ${v.model} ${v.version}`;

// Sem curadoria: os scores saem dos vencedores da matriz comparativa (determinístico).
// Não há preço aqui, então priceGap fica zerado e a UI oculta a linha de diferença FIPE.
const synthesizeVerdict = (a: Vehicle, b: Vehicle): CompareVerdict => {
  const ids = Object.keys(compareCategoryLabels) as CompareCategoryId[];
  const wonBy: Record<'a' | 'b', string[]> = { a: [], b: [] };

  const scores = ids.map((id) => {
    const rows = CatalogService.buildCompareRows(id, a, b);
    const wa = rows.filter((r) => r.w === 'a').length;
    const wb = rows.filter((r) => r.w === 'b').length;
    const cat = compareCategoryLabels[id];
    const pctA = wa + wb === 0 ? 50 : Math.round((100 * wa) / (wa + wb));
    const leans: 'a' | 'b' | 'tie' = wa === wb ? 'tie' : wa > wb ? 'a' : 'b';
    if (leans !== 'tie') wonBy[leans].push(cat);
    return { cat, a: pctA, b: 100 - pctA, leans };
  });

  const recommendations = (['a', 'b'] as const)
    .filter((side) => wonBy[side].length > 0)
    .map((side) => ({
      tag: wonBy[side].join(' + '),
      winner: side,
      detail: `${vehicleName(side === 'a' ? a : b)} leva vantagem nas especificações de ${wonBy[side]
        .join(' e ')
        .toLowerCase()}.`,
    }));

  const winsA = wonBy.a.length;
  const winsB = wonBy.b.length;
  const summary =
    winsA === winsB
      ? 'Comparativo equilibrado: os dois veículos se alternam nas especificações.'
      : `${vehicleName(winsA > winsB ? a : b)} lidera em ${Math.max(winsA, winsB)} de ${ids.length} categorias.`;

  return {
    title: 'Veredito Oráculo',
    summary,
    scores,
    recommendations,
    priceGap: { absolute: 0, percent: 0, cheaper: 'a' },
  };
};
