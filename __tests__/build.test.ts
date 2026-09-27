import { SYSTEMS } from '../constants/build';
import { vehicles } from '../data/vehicles';
import { BuildService } from '../services/build';
import type { Build, Vehicle } from '../types';

const NOT_AVAILABLE = /n[ãa]o (dispon[ií]vel|possui|aplic[áa]vel)/i;

const isFull = (v: Vehicle) => {
  const b = BuildService.createFromBase(v.id);
  return !!b && BuildService.summarize(b).complete;
};

const monoBase = vehicles.find((v) => v.platform === 'mono' && isFull(v))!;
const chassiBase = vehicles.find((v) => v.platform === 'chassi' && isFull(v))!;

describe('BuildService — catálogo de peças', () => {
  it('existem bases completas das duas plataformas', () => {
    expect(monoBase).toBeDefined();
    expect(chassiBase).toBeDefined();
  });

  it('a peça original de cada sistema existe no pool de opções da base', () => {
    for (const v of vehicles) {
      const stock = BuildService.getStock(v.id);
      for (const system of SYSTEMS) {
        const key = stock[system.id];
        if (!key) continue;
        const keys = BuildService.getOptions(system.id, { platform: v.platform }).map((p) => p.key);
        expect(keys).toContain(key);
        expect(BuildService.getPart(key)?.sources).toContain(v.id);
      }
    }
  });

  it('não gera peças com valores "Não Disponível"/"Não Possui"', () => {
    for (const system of SYSTEMS) {
      for (const p of BuildService.getOptions(system.id, { platform: 'mono' })) {
        expect(p.name).not.toMatch(NOT_AVAILABLE);
        expect(p.detail).not.toMatch(NOT_AVAILABLE);
      }
    }
  });

  it('nenhuma peça tem "Não Aplicável" no nome ou no detalhe', () => {
    for (const system of SYSTEMS) {
      for (const p of BuildService.getOptions(system.id, { platform: 'mono' })) {
        expect(p.name).not.toMatch(/n[ãa]o aplic/i);
        expect(p.detail).not.toMatch(/n[ãa]o aplic/i);
      }
    }
  });

  it('tração não duplica peças que só diferem por um sufixo "Não Aplicável"', () => {
    const options = BuildService.getOptions('tracao', { platform: 'mono', onlyCompatible: true });
    expect(options.length).toBeGreaterThan(0);
    options.forEach((p) => expect(p.detail).not.toMatch(/n[ãa]o aplic/i));
    const keys = options.map((p) => `${p.name}|${p.detail}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('as chaves das opções são únicas (peças idênticas são agrupadas)', () => {
    for (const system of SYSTEMS) {
      const keys = BuildService.getOptions(system.id, { platform: 'mono' }).map((p) => p.key);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });

  it('getPart devolve null para chave inexistente ou vazia', () => {
    expect(BuildService.getPart('nao|existe|x|y')).toBeNull();
    expect(BuildService.getPart(undefined)).toBeNull();
  });

  it('getPlatformOf e getBase refletem o catálogo', () => {
    expect(BuildService.getPlatformOf(chassiBase.id)).toBe('chassi');
    expect(BuildService.getPlatformOf('inexistente')).toBeNull();
    expect(BuildService.getBase(monoBase.id)?.model).toBe(monoBase.model);
    expect(BuildService.getBase('inexistente')).toBeNull();
  });
});

describe('BuildService — opções', () => {
  it('a peça original vem primeiro, depois compatíveis, depois as que exigem adaptação', () => {
    const stockKey = BuildService.getStock(monoBase.id).motor!;
    const options = BuildService.getOptions('motor', { platform: 'mono', stockKey });
    expect(options[0].key).toBe(stockKey);
    const rank = (p: { key: string; platform: string }) =>
      p.key === stockKey ? 0 : p.platform === 'mono' ? 1 : 2;
    for (let i = 1; i < options.length; i++) {
      expect(rank(options[i])).toBeGreaterThanOrEqual(rank(options[i - 1]));
    }
    expect(options.some((p) => p.platform === 'chassi')).toBe(true);
  });

  it('onlyCompatible remove peças de outra plataforma', () => {
    const options = BuildService.getOptions('motor', { platform: 'mono', onlyCompatible: true });
    expect(options.length).toBeGreaterThan(0);
    options.forEach((p) => expect(p.platform).toBe('mono'));
  });

  it('busca por texto da peça e pelo nome do veículo de origem', () => {
    const p = BuildService.getPart(BuildService.getStock(monoBase.id).motor)!;
    const byName = BuildService.getOptions('motor', { platform: 'mono', query: p.name.slice(0, 6) });
    expect(byName.map((x) => x.key)).toContain(p.key);

    const byOrigin = BuildService.getOptions('motor', {
      platform: 'mono',
      query: `${monoBase.brand} ${monoBase.model}`.toUpperCase(),
    });
    expect(byOrigin.map((x) => x.key)).toContain(p.key);

    expect(BuildService.getOptions('motor', { platform: 'mono', query: 'zzzz-inexistente' })).toEqual([]);
  });
});

describe('BuildService — status e resumo', () => {
  it('createFromBase parte das peças originais: tudo "orig", sem trocas', () => {
    const b = BuildService.createFromBase(monoBase.id)!;
    expect(b.baseId).toBe(monoBase.id);
    expect(b.platform).toBe('mono');
    expect(b.name).toBe(`${monoBase.model} personalizada`);
    SYSTEMS.forEach((s) => expect(BuildService.getStatus(b, s.id)).toBe('orig'));
    expect(BuildService.summarize(b)).toEqual({
      defined: 7,
      total: 7,
      swaps: 0,
      adapts: 0,
      complete: true,
    });
  });

  it('createFromBase devolve null para veículo inexistente', () => {
    expect(BuildService.createFromBase('inexistente')).toBeNull();
  });

  it('peça de mesma plataforma = "swap"; de outra plataforma = "adapt"', () => {
    const b = BuildService.createFromBase(monoBase.id)!;
    const stockKey = b.parts.motor!;
    const swapPart = BuildService.getOptions('motor', { platform: 'mono', onlyCompatible: true }).find(
      (p) => p.key !== stockKey,
    )!;
    const adaptPart = BuildService.getPart(BuildService.getStock(chassiBase.id).motor)!;

    const swapped: Build = { ...b, parts: { ...b.parts, motor: swapPart.key } };
    expect(BuildService.getStatus(swapped, 'motor')).toBe('swap');

    const adapted: Build = { ...b, parts: { ...b.parts, motor: adaptPart.key } };
    expect(BuildService.getStatus(adapted, 'motor')).toBe('adapt');

    const both: Build = { ...b, parts: { ...b.parts, motor: adaptPart.key, cambio: undefined } };
    expect(BuildService.summarize(both)).toEqual({
      defined: 6,
      total: 7,
      swaps: 1,
      adapts: 1,
      complete: false,
    });
  });

  it('do zero: sem "orig" e sem contagem de trocas; "swap" só na mesma plataforma', () => {
    const b = BuildService.createFromScratch('chassi');
    expect(b.baseId).toBeNull();
    expect(b.parts).toEqual({});
    expect(BuildService.summarize(b)).toEqual({
      defined: 0,
      total: 7,
      swaps: 0,
      adapts: 0,
      complete: false,
    });
    const own = BuildService.getStock(chassiBase.id).motor!;
    const foreign = BuildService.getStock(monoBase.id).motor!;
    expect(BuildService.getStatus({ ...b, parts: { motor: own } }, 'motor')).toBe('swap');
    expect(BuildService.getStatus({ ...b, parts: { motor: foreign } }, 'motor')).toBe('adapt');
  });

  it('chave inexistente (catálogo mudou) conta como sistema não definido', () => {
    const b = BuildService.createFromBase(monoBase.id)!;
    const broken: Build = { ...b, parts: { ...b.parts, motor: 'motor|mono|removida|x' } };
    expect(BuildService.getStatus(broken, 'motor')).toBeNull();
    const s = BuildService.summarize(broken);
    expect(s.defined).toBe(6);
    expect(s.complete).toBe(false);
  });

  it('restore volta ao stock da base ou limpa o do zero', () => {
    const b = BuildService.createFromBase(monoBase.id)!;
    const changed: Build = { ...b, parts: { ...b.parts, motor: BuildService.getStock(chassiBase.id).motor } };
    expect(BuildService.restore(changed).parts).toEqual(b.parts);

    const scratch = { ...BuildService.createFromScratch('mono'), parts: { motor: b.parts.motor } };
    expect(BuildService.restore(scratch).parts).toEqual({});
  });

  it('describeOrigin prefere a própria base e conta as demais origens', () => {
    const b = BuildService.createFromBase(monoBase.id)!;
    const part = BuildService.getPart(b.parts.motor)!;
    const origin = BuildService.describeOrigin(part, monoBase.id);
    expect(origin.label).toBe(`${monoBase.brand} ${monoBase.model}`);
    expect(origin.extra).toBe(part.sources.length - 1);
    expect(BuildService.describeOrigin(part, null).extra).toBe(part.sources.length - 1);
  });
});
