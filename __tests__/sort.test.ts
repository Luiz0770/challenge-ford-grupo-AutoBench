import { sortByName } from '../utils/sort';

const item = (brand: string, model: string, version: string, year: number) => ({
  brand,
  model,
  version,
  year,
});

const list = [
  item('Toyota', 'Hilux', 'SR', 2024),
  item('Ford', 'Ranger', 'XLT', 2025),
  item('Ford', 'Maverick', 'FX4', 2024),
  item('Ford', 'Maverick', 'FX4', 2023),
  item('Citroën', 'C3', 'Live', 2024),
];

describe('sortByName', () => {
  it('default mantém a ordem original sem alterar a lista recebida', () => {
    const out = sortByName(list, 'default');
    expect(out).toEqual(list);
    expect(out).not.toBe(list);
  });

  it('name-asc ordena por marca, modelo, versão e ano', () => {
    const out = sortByName(list, 'name-asc').map((v) => `${v.brand} ${v.model} ${v.year}`);
    expect(out).toEqual([
      'Citroën C3 2024',
      'Ford Maverick 2023',
      'Ford Maverick 2024',
      'Ford Ranger 2025',
      'Toyota Hilux 2024',
    ]);
  });

  it('name-desc é o inverso de name-asc', () => {
    expect(sortByName(list, 'name-desc')).toEqual([...sortByName(list, 'name-asc')].reverse());
  });
});
