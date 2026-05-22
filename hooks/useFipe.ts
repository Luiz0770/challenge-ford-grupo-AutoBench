import { useEffect, useState } from 'react';
import { FipeService } from '../services/fipe';
import type { FipeBrand, FipeModel } from '../types';

export const useFipeBrands = () => {
  const [brands, setBrands] = useState<FipeBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    FipeService.getBrands()
      .then(setBrands)
      .catch(() => setError('Falha ao carregar marcas. Verifique sua conexão.'))
      .finally(() => setLoading(false));
  }, []);

  return { brands, loading, error };
};

export const useFipeModels = (brandCode: string | null) => {
  const [models, setModels] = useState<FipeModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!brandCode) return;
    setLoading(true);
    setError(null);
    FipeService.getModelsByBrand(brandCode)
      .then((res) => setModels(res.modelos))
      .catch(() => setError('Falha ao carregar modelos.'))
      .finally(() => setLoading(false));
  }, [brandCode]);

  return { models, loading, error };
};
