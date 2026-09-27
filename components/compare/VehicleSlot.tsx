import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import { SIDE, type CompareSide } from '../../constants/compare';
import type { Vehicle } from '../../types';
import { fmtBRLFromReais } from '../../utils/format';
import { Rise } from '../ui/Rise';

interface VehicleSlotProps {
  vehicle: Vehicle;
  side: CompareSide;
  onSwap: () => void;
  fipeAvg?: number;
  fipeLoading?: boolean;
  delay?: number;
}

export const VehicleSlot: React.FC<VehicleSlotProps> = ({
  vehicle,
  side,
  onSwap,
  fipeAvg,
  fipeLoading,
  delay = 0,
}) => {
  const s = SIDE[side];
  const priceLabel = fipeLoading ? '...' : fipeAvg != null ? fmtBRLFromReais(fipeAvg) : 'Indisponível';

  return (
    <Rise delay={delay} style={{ flex: 1, minWidth: 0 }}>
      <Pressable
        onPress={onSwap}
        accessibilityRole="button"
        accessibilityLabel={`Trocar veículo ${s.label}`}
      >
        {({ pressed }) => (
          <View
            style={{
              backgroundColor: colors.bg.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.bg.border,
              padding: 12,
              transform: [{ scale: pressed ? 0.985 : 1 }],
              shadowColor: '#101828',
              shadowOpacity: 0.04,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 1 },
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 12,
              }}
            >
              <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, backgroundColor: s.bg }}>
                <Text style={{ fontFamily: fonts.monoBold, fontSize: 9, color: s.color, letterSpacing: 1.2 }}>
                  {s.label}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: fonts.monoMedium,
                  fontSize: 9,
                  color: colors.text.muted,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                {vehicle.brand}
              </Text>
            </View>

            <Text
              numberOfLines={1}
              style={{
                fontFamily: fonts.sansBold,
                fontSize: 14,
                color: colors.brand.navy,
                letterSpacing: -0.3,
                lineHeight: 17,
              }}
            >
              {vehicle.model}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: fonts.sans,
                fontSize: 11.5,
                color: colors.text.secondary,
                marginTop: 2,
                minHeight: 30,
              }}
            >
              {vehicle.version}
            </Text>

            <View
              style={{
                marginTop: 10,
                paddingTop: 10,
                borderTopWidth: 1,
                borderTopColor: colors.bg.border,
                borderStyle: 'dashed',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 9,
                  color: colors.text.muted,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                {vehicle.year}
              </Text>
              <Text style={{ fontFamily: fonts.monoSemibold, fontSize: 11.5, color: colors.text.primary }}>
                {priceLabel}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: colors.bg.canvas,
                borderWidth: 1,
                borderColor: colors.bg.borderStrong,
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 7,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <Feather name="layers" size={12} color={colors.brand.blue} />
              <Text style={{ fontFamily: fonts.sansMedium, fontSize: 11.5, color: colors.brand.navy }}>Trocar</Text>
            </View>
          </View>
        )}
      </Pressable>
    </Rise>
  );
};
