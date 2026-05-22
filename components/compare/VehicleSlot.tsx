import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import type { Vehicle } from '../../types';
import { fmtBRLFromReais } from '../../utils/format';

interface VehicleSlotProps {
  vehicle: Vehicle;
  side: 'A' | 'B';
  onSwap: () => void;
  fipeAvg?: number;
}

export const VehicleSlot: React.FC<VehicleSlotProps> = ({ vehicle, side, onSwap, fipeAvg }) => {
  const accent = side === 'A' ? colors.brand.blue : colors.status.warning;
  const accentBg = side === 'A' ? 'rgba(0,102,204,0.08)' : 'rgba(180,83,9,0.08)';
  const fipe = fipeAvg ?? vehicle.priceInCents / 100;

  return (
    <Pressable
      onPress={onSwap}
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: colors.bg.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.bg.border,
        padding: 12,
        opacity: pressed ? 0.95 : 1,
        shadowColor: '#101828',
        shadowOpacity: 0.04,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
      })}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 12,
        }}
      >
        <View
          style={{
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 3,
            backgroundColor: accentBg,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.monoBold,
              fontSize: 9,
              color: accent,
              letterSpacing: 1.2,
            }}
          >
            {side}
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
        style={{
          fontFamily: fonts.sans,
          fontSize: 11.5,
          color: colors.text.secondary,
          marginTop: 2,
          minHeight: 30,
        }}
        numberOfLines={2}
      >
        {vehicle.version}
      </Text>

      <View
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderStyle: 'dashed',
          borderTopColor: colors.bg.border,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
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
        <Text
          style={{
            fontFamily: fonts.monoSemibold,
            fontSize: 11.5,
            color: colors.text.primary,
          }}
        >
          {fmtBRLFromReais(fipe)}
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
        <Feather name="repeat" size={12} color={colors.brand.blue} />
        <Text
          style={{
            fontFamily: fonts.sansMedium,
            fontSize: 11.5,
            color: colors.brand.navy,
          }}
        >
          Trocar
        </Text>
      </View>
    </Pressable>
  );
};
