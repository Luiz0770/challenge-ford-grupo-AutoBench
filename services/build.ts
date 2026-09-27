import { SYSTEMS, type SpecRef } from '../constants/build';
import { vehicles } from '../data/vehicles';
import type { Build, BuildPart, PartStatus, Platform, SystemId, Vehicle } from '../types';

type PartMap = Partial<Record<SystemId, string>>;

export interface OptionsFilter {
  query?: string;
  /** Plataforma da montagem: define "compatível" e a ordem da lista */
  platform: Platform;
  onlyCompatible?: boolean;
  /** Chave da peça original da base (sempre aparece, sempre primeiro) */
  stockKey?: string;
}

export interface BuildSummary {
  defined: number;
  total: number;
  swaps: number;
  adapts: number;
  complete: boolean;
}

const NOT_AVAILABLE = /^n[ãa]o (dispon[ií]vel|possui|aplic[áa]vel)\b/i;

const specValue = (v: Vehicle, ref: SpecRef): string | null => {
  const spec = v.sections
    .find((s) => s.id === ref.section)
    ?.specs.find((sp) => sp.label === ref.label);
  const value = spec?.value?.trim();
  return value && !NOT_AVAILABLE.test(value) ? value : null;
};

interface Catalog {
  parts: Map<string, BuildPart>;
  bySystem: Map<SystemId, BuildPart[]>;
  stock: Map<string, PartMap>;
  vehicles: Map<string, Vehicle>;
}

let cache: Catalog | null = null;

const buildCatalog = (): Catalog => {
  const parts = new Map<string, BuildPart>();
  const bySystem = new Map<SystemId, BuildPart[]>(SYSTEMS.map((s) => [s.id, []]));
  const stock = new Map<string, PartMap>();
  const byId = new Map<string, Vehicle>();

  for (const v of vehicles) {
    byId.set(v.id, v);
    const vehicleStock: PartMap = {};

    for (const system of SYSTEMS) {
      const name = specValue(v, system.name);
      if (!name) continue;

      const detail = system.detail
        .map((ref) => {
          const value = specValue(v, ref);
          return value ? `${ref.prefix ?? ''}${value}` : null;
        })
        .filter((d): d is string => d !== null)
        .join(' · ');

      const key = `${system.id}|${v.platform}|${name}|${detail}`;
      const existing = parts.get(key);
      if (existing) {
        existing.sources.push(v.id);
      } else {
        const part: BuildPart = {
          key,
          systemId: system.id,
          name,
          detail,
          platform: v.platform,
          sources: [v.id],
        };
        parts.set(key, part);
        bySystem.get(system.id)!.push(part);
      }
      vehicleStock[system.id] = key;
    }
    stock.set(v.id, vehicleStock);
  }

  return { parts, bySystem, stock, vehicles: byId };
};

const catalog = (): Catalog => (cache ??= buildCatalog());

const searchText = (part: BuildPart, byId: Map<string, Vehicle>): string =>
  [
    part.name,
    part.detail,
    ...part.sources.map((id) => {
      const v = byId.get(id);
      return v ? `${v.brand} ${v.model}` : '';
    }),
  ]
    .join(' ')
    .toLowerCase();

export const BuildService = {
  getPart(key: string | undefined): BuildPart | null {
    return key ? (catalog().parts.get(key) ?? null) : null;
  },

  // Peças originais do veículo: sistema → chave da peça
  getStock(vehicleId: string): PartMap {
    return catalog().stock.get(vehicleId) ?? {};
  },

  getPlatformOf(vehicleId: string): Platform | null {
    return catalog().vehicles.get(vehicleId)?.platform ?? null;
  },

  getBase(
    vehicleId: string,
  ): { id: string; brand: string; model: string; version: string; year: number; platform: Platform } | null {
    const v = catalog().vehicles.get(vehicleId);
    return v
      ? { id: v.id, brand: v.brand, model: v.model, version: v.version, year: v.year, platform: v.platform }
      : null;
  },

  // Opções de um sistema: original primeiro, depois compatíveis, depois "requer adaptação"
  getOptions(systemId: SystemId, filter: OptionsFilter): BuildPart[] {
    const { query = '', platform, onlyCompatible = false, stockKey } = filter;
    const q = query.trim().toLowerCase();
    const { bySystem, vehicles: byId } = catalog();
    const rank = (p: BuildPart) => (p.key === stockKey ? 0 : p.platform === platform ? 1 : 2);

    return (bySystem.get(systemId) ?? [])
      .filter((p) => !onlyCompatible || p.key === stockKey || p.platform === platform)
      .filter((p) => !q || searchText(p, byId).includes(q))
      .sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, 'pt-BR'));
  },

  getPartStatus(build: Pick<Build, 'baseId' | 'platform'>, part: BuildPart): PartStatus {
    const stockKey = build.baseId ? BuildService.getStock(build.baseId)[part.systemId] : undefined;
    if (stockKey === part.key) return 'orig';
    return part.platform !== build.platform ? 'adapt' : 'swap';
  },

  // null quando o sistema não está definido (ou a peça salva não existe mais)
  getStatus(build: Build, systemId: SystemId): PartStatus | null {
    const part = BuildService.getPart(build.parts[systemId]);
    return part ? BuildService.getPartStatus(build, part) : null;
  },

  summarize(build: Build): BuildSummary {
    let defined = 0;
    let swaps = 0;
    let adapts = 0;
    for (const system of SYSTEMS) {
      const status = BuildService.getStatus(build, system.id);
      if (!status) continue;
      defined += 1;
      if (status === 'adapt') adapts += 1;
      if (build.baseId && status !== 'orig') swaps += 1;
    }
    return { defined, total: SYSTEMS.length, swaps, adapts, complete: defined === SYSTEMS.length };
  },

  // "de Marca Modelo" (+ quantas outras origens); prefere a própria base
  describeOrigin(part: BuildPart, baseId: string | null): { label: string; extra: number } {
    const id = baseId && part.sources.includes(baseId) ? baseId : part.sources[0];
    const v = catalog().vehicles.get(id);
    return { label: v ? `${v.brand} ${v.model}` : '', extra: part.sources.length - 1 };
  },

  createFromBase(vehicleId: string, now: number = Date.now()): Build | null {
    const v = catalog().vehicles.get(vehicleId);
    if (!v) return null;
    return {
      id: `b${now}`,
      name: `${v.model} personalizada`,
      baseId: v.id,
      platform: v.platform,
      parts: { ...BuildService.getStock(v.id) },
      updatedAt: new Date(now).toISOString(),
    };
  },

  createFromScratch(platform: Platform, now: number = Date.now()): Build {
    return {
      id: `b${now}`,
      name: 'Minha montagem',
      baseId: null,
      platform,
      parts: {},
      updatedAt: new Date(now).toISOString(),
    };
  },

  // "Restaurar original" (com base) ou "Limpar" (do zero)
  restore(build: Build): Build {
    return { ...build, parts: build.baseId ? { ...BuildService.getStock(build.baseId) } : {} };
  },
};
