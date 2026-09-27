import type { Vehicle } from '../../types';

import compacto from './compacto.json';
import conversivel from './conversivel.json';
import crossover from './crossover.json';
import cupe from './cupe.json';
import eletrico from './eletrico.json';
import esportivo from './esportivo.json';
import hatch from './hatch.json';
import hibrido from './hibrido.json';
import minivan from './minivan.json';
import picape from './picape.json';
import sedan from './sedan.json';
import suv from './suv.json';

const sources = [
  compacto, conversivel, crossover, cupe, eletrico, esportivo,
  hatch, hibrido, minivan, picape, sedan, suv,
];

export const vehicles: Vehicle[] = sources.flatMap((s) => s.vehicles as Vehicle[]);

if (__DEV__) {
  const seen = new Set<string>();
  for (const v of vehicles) {
    if (seen.has(v.id)) console.warn(`Duplicate vehicle id: ${v.id}`);
    seen.add(v.id);
  }
}
