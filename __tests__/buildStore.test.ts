jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import { vehicles } from '../data/vehicles';
import { BuildService } from '../services/build';
import { useBuildStore } from '../store/buildStore';
import type { Build } from '../types';

const fullBase = vehicles.find((v) => {
  const b = BuildService.createFromBase(v.id);
  return !!b && BuildService.summarize(b).complete;
})!;

const complete = (now = 1): Build => BuildService.createFromBase(fullBase.id, now)!;

const state = () => useBuildStore.getState();

beforeEach(() => {
  useBuildStore.setState({ builds: [], draft: null, notice: null });
});

describe('buildStore — rascunho', () => {
  it('startDraft define o rascunho', () => {
    const b = complete();
    state().startDraft(b);
    expect(state().draft).toEqual(b);
  });

  it('setPart e setName alteram o rascunho; sem rascunho não fazem nada', () => {
    state().setName('x');
    state().setPart('motor', 'k');
    expect(state().draft).toBeNull();

    state().startDraft(complete());
    state().setName('Minha');
    state().setPart('motor', 'motor|mono|a|b');
    expect(state().draft?.name).toBe('Minha');
    expect(state().draft?.parts.motor).toBe('motor|mono|a|b');
  });

  it('restoreDraft volta às peças originais (base) ou limpa (do zero)', () => {
    const b = complete();
    state().startDraft({ ...b, parts: { ...b.parts, motor: 'motor|mono|a|b' } });
    state().restoreDraft();
    expect(state().draft?.parts).toEqual(b.parts);

    state().startDraft({ ...BuildService.createFromScratch('mono'), parts: { motor: 'x' } });
    state().restoreDraft();
    expect(state().draft?.parts).toEqual({});
  });

  it('discardDraft limpa o rascunho', () => {
    state().startDraft(complete());
    state().discardDraft();
    expect(state().draft).toBeNull();
  });
});

describe('buildStore — salvar, abrir e excluir', () => {
  it('não salva montagem incompleta', () => {
    const b = complete();
    const incomplete = { ...b, parts: { ...b.parts, motor: undefined } };
    state().startDraft(incomplete);
    state().saveDraft();
    expect(state().builds).toEqual([]);
    expect(state().draft).not.toBeNull();
    expect(state().notice).toBeNull();
  });

  it('salva no topo, limpa o rascunho e emite o aviso', () => {
    const first = complete(1);
    const second = complete(2);
    state().startDraft(first);
    state().saveDraft();
    state().startDraft(second);
    state().saveDraft();

    expect(state().builds.map((b) => b.id)).toEqual([second.id, first.id]);
    expect(state().draft).toBeNull();
    expect(state().notice).toBe('Montagem salva');
  });

  it('salvar o mesmo id substitui em vez de duplicar', () => {
    const b = complete(1);
    state().startDraft(b);
    state().saveDraft();
    state().openBuild(b.id);
    state().setName('Renomeada');
    state().saveDraft();
    expect(state().builds).toHaveLength(1);
    expect(state().builds[0].name).toBe('Renomeada');
  });

  it('nome vazio vira "Minha montagem" e o nome é aparado', () => {
    state().startDraft({ ...complete(1), name: '   ' });
    state().saveDraft();
    expect(state().builds[0].name).toBe('Minha montagem');

    state().startDraft({ ...complete(2), name: '  Ranger off-road  ' });
    state().saveDraft();
    expect(state().builds[0].name).toBe('Ranger off-road');
  });

  it('openBuild copia a montagem: editar o rascunho não altera a salva', () => {
    const b = complete(1);
    state().startDraft(b);
    state().saveDraft();
    state().openBuild(b.id);
    state().setPart('motor', 'motor|mono|a|b');
    expect(state().builds[0].parts.motor).toBe(b.parts.motor);
    expect(state().draft?.parts.motor).toBe('motor|mono|a|b');
  });

  it('openBuild com id inexistente não altera o rascunho', () => {
    state().openBuild('nao-existe');
    expect(state().draft).toBeNull();
  });

  it('deleteBuild remove a montagem', () => {
    const b = complete(1);
    state().startDraft(b);
    state().saveDraft();
    state().deleteBuild(b.id);
    expect(state().builds).toEqual([]);
  });

  it('clearNotice limpa o aviso', () => {
    useBuildStore.setState({ notice: 'Montagem salva' });
    state().clearNotice();
    expect(state().notice).toBeNull();
  });
});
