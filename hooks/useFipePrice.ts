import { useEffect, useState } from 'react';
import { FipeService } from '../services/fipe';
import type { FipePrice, Vehicle } from '../types';

export function useFipePrice(vehicle: Vehicle | null) {
  const [price, setPrice] = useState<FipePrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!vehicle) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);
    setPrice(null);

    async function fetchPrice() {
      try {
        const years = await FipeService.getYearsByModel(
          vehicle!.brandFipeCode,
          vehicle!.modelFipeCode
        );
        const yearEntry = years.find((y) => y.codigo.startsWith(String(vehicle!.year)));
        if (!yearEntry) throw new Error('Ano não encontrado na tabela FIPE');
        const data = await FipeService.getVehiclePrice(
          vehicle!.brandFipeCode,
          vehicle!.modelFipeCode,
          yearEntry.codigo
        );
        if (!cancelled) setPrice(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPrice();
    return () => { cancelled = true; };
  }, [vehicle?.id]);

  return { price, loading, error };
}
