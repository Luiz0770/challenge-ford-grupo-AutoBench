export type NameSort = 'default' | 'name-asc' | 'name-desc';

interface Nameable {
  brand: string;
  model: string;
  version: string;
  year: number;
}

const compare = (a: string, b: string) =>
  a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' });

// Ordem alfabética por marca > modelo > versão > ano
const byName = (a: Nameable, b: Nameable) =>
  compare(a.brand, b.brand) ||
  compare(a.model, b.model) ||
  compare(a.version, b.version) ||
  a.year - b.year;

// 'default' mantém a ordem original do catálogo
export const sortByName = <T extends Nameable>(items: readonly T[], order: NameSort): T[] => {
  const copy = [...items];
  if (order === 'name-asc') return copy.sort(byName);
  if (order === 'name-desc') return copy.sort((a, b) => byName(b, a));
  return copy;
};
