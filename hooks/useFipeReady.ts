import { useEffect, useState } from 'react';
import { FipeService } from '../services/fipe';
import type { Vehicle } from '../types';

// Limite para nunca prender a tela no loading se a API não responder
const MAX_WAIT_MS = 15000;

// Indica se os preços FIPE de todos os veículos já foram resolvidos (com sucesso
// ou falha). Reaproveita o cache do FipeService, então não gera requisições extras.
export function useFipeReady(vehicles: (Vehicle | null | undefined)[]): boolean {
  const list = vehicles.filter((v): v is Vehicle => !!v);
  // Ordenado: reordenar a mesma lista não deve reiniciar o loading
  const key = list.map((v) => v.id).sort().join('|');
  const [ready, setReady] = useState(list.length === 0);

  useEffect(() => {
    if (list.length === 0) {
      setReady(true);
      return;
    }

    let cancelled = false;
    setReady(false);

    const done = () => {
      if (!cancelled) setReady(true);
    };
    const timer = setTimeout(done, MAX_WAIT_MS);

    Promise.allSettled(list.map((v) => FipeService.getPriceForVehicle(v))).then(done);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [key]);

  return ready;
}
