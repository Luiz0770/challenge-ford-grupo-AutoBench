import { vehicles } from '../data/vehicles';

describe('platform dos veículos', () => {
  it('todo veículo tem platform "mono" ou "chassi"', () => {
    expect(vehicles.length).toBeGreaterThan(0);
    vehicles.forEach((v) => {
      expect(['mono', 'chassi']).toContain(v.platform);
    });
  });

  it('picapes de chassi sobre longarinas', () => {
    const chassi = [
      ['Chevrolet', 'S10'],
      ['Ford', 'Ranger'],
      ['Toyota', 'Hilux'],
      ['Volkswagen', 'Amarok'],
      ['Jeep', 'Wrangler'],
    ];
    const found = vehicles.filter((v) => chassi.some(([b, m]) => v.brand === b && v.model === m));
    expect(found.length).toBeGreaterThan(0);
    found.forEach((v) => expect(v.platform).toBe('chassi'));
  });

  it('picapes monobloco (Toro, Santa Cruz, Ridgeline) não são chassi', () => {
    const found = vehicles.filter(
      (v) => v.model === 'Toro' || v.model === 'Santa Cruz' || v.model === 'Ridgeline',
    );
    expect(found.length).toBeGreaterThan(0);
    found.forEach((v) => expect(v.platform).toBe('mono'));
  });

  it('há veículos das duas plataformas', () => {
    expect(vehicles.some((v) => v.platform === 'mono')).toBe(true);
    expect(vehicles.some((v) => v.platform === 'chassi')).toBe(true);
  });
});
