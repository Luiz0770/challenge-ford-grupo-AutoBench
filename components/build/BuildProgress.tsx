import React from 'react';
import { View } from 'react-native';
import { colors } from '../../constants/colors';
import type { PartStatus } from '../../types';

interface BuildProgressProps {
  /** Um item por sistema; null = ainda não definido */
  segments: (PartStatus | null)[];
}

export const BuildProgress: React.FC<BuildProgressProps> = ({ segments }) => (
  <View style={{ flexDirection: 'row', gap: 3, marginTop: 8 }}>
    {segments.map((status, i) => (
      <View
        key={i}
        style={{
          flex: 1,
          height: 5,
          borderRadius: 3,
          backgroundColor: !status
            ? colors.bg.borderStrong
            : status === 'adapt'
              ? colors.accent.amber
              : colors.brand.bright,
        }}
      />
    ))}
  </View>
);
