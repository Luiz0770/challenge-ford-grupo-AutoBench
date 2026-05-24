import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import { useFipePrice } from '../../hooks/useFipePrice';
import { VehicleDataService } from '../../services/vehicleData';
import type { Category, CategoryVehicleEntry } from '../../types';
import { fmtBRLFromReais } from '../../utils/format';

export const VehicleListRow: React.FC<{
  vehicle: CategoryVehicleEntry;
  category: Category;
  isFirst: boolean;
  onPress: () => void;
}> = ({ vehicle, category, isFirst, onPress }) => {
  const vehicleObj = VehicleDataService.getVehicleById(vehicle.vehicleId);
  const { price, loading } = useFipePrice(vehicleObj);
  const fipe = price?.valor;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderTopWidth: isFirst ? 0 : 1,
        borderTopColor: colors.divider,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 9,
          backgroundColor: category.color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: fonts.monoBold,
            fontSize: 11,
            color: category.accent,
            letterSpacing: 0.5,
          }}
        >
          {category.code}
        </Text>
      </View>

      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            fontFamily: fonts.monoMedium,
            fontSize: 9,
            color: colors.text.secondary,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          {vehicle.brand}
        </Text>
        <Text
          style={{
            fontFamily: fonts.sansSemibold,
            fontSize: 14,
            color: colors.text.primary,
            letterSpacing: -0.2,
            marginTop: 1,
          }}
        >
          {vehicle.model}
        </Text>
        <Text
          style={{
            fontFamily: fonts.sans,
            fontSize: 11.5,
            color: colors.text.secondary,
            marginTop: 2,
          }}
          numberOfLines={1}
        >
          {vehicle.version} · {vehicle.year}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text
          style={{
            fontFamily: fonts.mono,
            fontSize: 9,
            color: colors.text.muted,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
          }}
        >
          FIPE
        </Text>
        <Text
          style={{
            fontFamily: fonts.monoSemibold,
            fontSize: 12,
            color: colors.brand.navy,
            marginTop: 2,
          }}
        >
          {loading ? '...' : fipe != null ? fmtBRLFromReais(fipe) : 'Indisponível'}
        </Text>
      </View>
    </Pressable>
  );
};
