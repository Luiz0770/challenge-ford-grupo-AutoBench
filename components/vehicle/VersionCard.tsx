import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { Vehicle } from '../../types';

interface VersionCardProps {
  vehicle: Vehicle;
  onPress: () => void;
}

const formatPrice = (cents: number): string =>
  `R$ ${(cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;

export const VersionCard: React.FC<VersionCardProps> = ({ vehicle, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => ({
      opacity: pressed ? 0.85 : 1,
      backgroundColor: colors.bg.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.bg.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    })}
  >
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.text.primary, fontSize: 18, fontWeight: '700' }}>
        {vehicle.version}
      </Text>
      <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 2 }}>
        {vehicle.brand} {vehicle.model} • {vehicle.year}
      </Text>
    </View>
    <View style={{ alignItems: 'flex-end' }}>
      <Text style={{ color: colors.accent.amber, fontSize: 16, fontWeight: '700' }}>
        {formatPrice(vehicle.priceInCents)}
      </Text>
      <Text style={{ color: colors.text.muted, fontSize: 11, marginTop: 2 }}>
        Ver ficha técnica →
      </Text>
    </View>
  </Pressable>
);
