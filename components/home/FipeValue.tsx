import React from 'react';
import { Text } from 'react-native';
import { useFipePrice } from '../../hooks/useFipePrice';
import type { Vehicle } from '../../types';
import { fmtBRLFromReais } from '../../utils/format';

interface FipeValueProps {
  vehicle: Vehicle | null;
  className?: string;
}

// Preço sempre vindo da API FIPE (nunca do preço sugerido do JSON)
export const FipeValue: React.FC<FipeValueProps> = ({ vehicle, className }) => {
  const { price, loading, error } = useFipePrice(vehicle);
  const label = loading ? '…' : error || !price ? 'Indisponível' : fmtBRLFromReais(price.valor);
  return <Text className={className}>{label}</Text>;
};
