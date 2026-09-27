import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import type { PartStatus } from '../../types';

const TONES: Record<PartStatus, { bg: string; fg: string }> = {
  orig: { bg: colors.bg.elevated, fg: colors.text.secondary },
  swap: { bg: 'rgba(0,102,255,0.10)', fg: colors.brand.bright },
  adapt: { bg: '#FEF3E9', fg: colors.status.warning },
};

interface StatusBadgeProps {
  tone: PartStatus;
  label: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ tone, label }) => (
  <View
    style={{
      alignSelf: 'flex-start',
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 999,
      backgroundColor: TONES[tone].bg,
    }}
  >
    <Text
      style={{
        fontFamily: fonts.monoBold,
        fontSize: 9,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        color: TONES[tone].fg,
      }}
    >
      {label}
    </Text>
  </View>
);
