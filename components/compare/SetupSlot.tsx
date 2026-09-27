import { Feather } from '@expo/vector-icons';
import { Car } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import { SIDE, type CompareSide } from '../../constants/compare';
import type { CategoryVehicleEntry } from '../../types';
import { Rise } from '../ui/Rise';
import { SETUP_SLOT_HEIGHT } from './SetupHero';

interface SetupSlotProps {
  side: CompareSide;
  vehicle: CategoryVehicleEntry | null;
  onOpen: () => void;
  onClear: () => void;
  delay?: number;
}

export const SetupSlot: React.FC<SetupSlotProps> = ({ side, vehicle, onOpen, onClear, delay = 0 }) => {
  const s = SIDE[side];

  return (
    <Rise delay={delay} style={{ flex: 1, minWidth: 0 }}>
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={vehicle ? `Trocar veículo ${s.label}` : `Escolher veículo ${s.label}`}
      >
        {({ pressed }) => (
          <View
            style={{
              minHeight: SETUP_SLOT_HEIGHT,
              borderRadius: 14,
              padding: 14,
              backgroundColor: colors.bg.surface,
              borderWidth: vehicle ? 1 : 1.5,
              borderStyle: vehicle ? 'solid' : 'dashed',
              borderColor: vehicle ? colors.bg.border : s.border,
              transform: [{ scale: pressed ? 0.985 : 1 }],
              ...(vehicle && {
                shadowColor: colors.brand.navy,
                shadowOpacity: 0.1,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 6 },
                elevation: 4,
              }),
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, backgroundColor: s.bg }}>
                <Text style={{ fontFamily: fonts.monoBold, fontSize: 9, color: s.color, letterSpacing: 1.2 }}>
                  {s.label}
                </Text>
              </View>
              {vehicle && (
                <Pressable
                  onPress={onClear}
                  hitSlop={8}
                  accessibilityLabel={`Remover veículo ${s.label}`}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.bg.borderStrong,
                    backgroundColor: colors.bg.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name="x" size={11} color={colors.text.secondary} />
                </Pressable>
              )}
            </View>

            {vehicle ? (
              <View style={{ marginTop: 'auto' }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: s.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Car size={18} color={s.color} strokeWidth={2.2} />
                </View>
                <Text
                  style={{
                    fontFamily: fonts.monoMedium,
                    fontSize: 9,
                    color: colors.text.secondary,
                    letterSpacing: 1.1,
                    textTransform: 'uppercase',
                  }}
                >
                  {vehicle.brand}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: fonts.sansBold,
                    fontSize: 16,
                    color: colors.brand.navy,
                    letterSpacing: -0.3,
                    lineHeight: 18,
                    marginTop: 2,
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
                    lineHeight: 15,
                  }}
                >
                  {vehicle.version} · {vehicle.year}
                </Text>
              </View>
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: s.color,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: s.color,
                    shadowOpacity: 0.35,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 4,
                  }}
                >
                  <Feather name="plus" size={20} color={colors.text.inverse} />
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontFamily: fonts.sansSemibold, fontSize: 13.5, color: colors.brand.navy }}>
                    Veículo {s.label}
                  </Text>
                  <Text style={{ fontFamily: fonts.sans, fontSize: 11.5, color: colors.text.secondary, marginTop: 2 }}>
                    Toque para escolher
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </Pressable>
    </Rise>
  );
};
