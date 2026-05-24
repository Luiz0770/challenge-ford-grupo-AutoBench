import { CatalogService } from '../../services/catalog';

describe('CatalogService.buildCompareRows — null vehicle support', () => {
  it('returns [] when both vehicles are null', () => {
    const rows = CatalogService.buildCompareRows('motorizacao', null, null);
    expect(rows).toEqual([]);
  });

  it('returns rows with "—" on the b-side when b is null', () => {
    const fakeA = {
      id: 'fake-a',
      sections: [
        {
          id: 'engine',
          specs: [{ label: 'Potência', value: '300', unit: 'cv' }],
        },
      ],
    } as any;

    const rows = CatalogService.buildCompareRows('motorizacao', fakeA, null);

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].b).toBe('—');
    expect(rows[0].nullB).toBe(true);
    expect(rows[0].w).toBeNull();
  });

  it('returns rows with "—" on the a-side when a is null', () => {
    const fakeB = {
      id: 'fake-b',
      sections: [
        {
          id: 'engine',
          specs: [{ label: 'Potência', value: '250', unit: 'cv' }],
        },
      ],
    } as any;

    const rows = CatalogService.buildCompareRows('motorizacao', null, fakeB);

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].a).toBe('—');
    expect(rows[0].nullA).toBe(true);
    expect(rows[0].w).toBeNull();
  });
});
