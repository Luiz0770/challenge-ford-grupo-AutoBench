import { vehicles } from '../data/vehicles';

describe('platform dos veículos', () => {
  it('todo veículo tem platform "mono" ou "chassi"', () => {
    expect(vehicles.length).toBeGreaterThan(0);
    vehicles.forEach((v) => {
      expect(['mono', 'chassi']).toContain(v.platform);
    });
  });

  it('picapes de chassi sobre longarinas', () => {
    const chassi = ['Ranger', 'Hilux', 'S10', 'Amarok'];
    vehicles
      .filter((v) => chassi.includes(v.model))
      .forEach((v) => expect(v.platform).toBe('chassi'));
  });

  it('picapes monobloco (Toro, Santa Cruz, Ridgeline) não são chassi', () => {
    vehicles
      .filter((v) => v.model === 'Toro' || v.model === 'Santa Cruz' || v.model === 'Ridgeline')
      .forEach((v) => expect(v.platform).toBe('mono'));
  });

  it('há veículos das duas plataformas', () => {
    expect(vehicles.some((v) => v.platform === 'mono')).toBe(true);
    expect(vehicles.some((v) => v.platform === 'chassi')).toBe(true);
  });
});
