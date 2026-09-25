import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import { SIDE } from '../../constants/compare';
import type { CategoryVehicleEntry } from '../../types';
import { PressableScale } from '../ui/PressableScale';
import { Rise } from '../ui/Rise';

interface DuelRowProps {
  a: CategoryVehicleEntry;
  b: CategoryVehicleEntry;
  delay?: number;
  onPress: () => void;
}

export const DuelRow: React.FC<DuelRowProps> = ({ a, b, delay = 0, onPress }) => (
  <Rise delay={delay}>
    <PressableScale
      onPress={onPress}
      accessibilityLabel={`Usar duelo ${a.model} contra ${b.model}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: colors.bg.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.bg.border,
      }}
    >
      <Text
        numberOfLines={1}
        style={{ flex: 1, minWidth: 0, fontFamily: fonts.sansSemibold, fontSize: 13.5, color: colors.brand.navy }}
      >
        <Text style={{ color: SIDE.a.color }}>{a.model} {a.version}</Text>
        <Text style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.text.muted }}>{'  VS  '}</Text>
        <Text style={{ color: SIDE.b.color }}>{b.model} {b.version}</Text>
      </Text>
      <View>
        <Text style={{ fontFamily: fonts.sansMedium, fontSize: 12, color: colors.brand.mid }}>Usar</Text>
      </View>
    </PressableScale>
  </Rise>
);
