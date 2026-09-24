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

    FipeService.getPriceForVehicle(vehicle)
      .then((data) => {
        if (!cancelled) setPrice(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [vehicle?.id]);

  return { price, loading, error };
}
