import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../constants/colors';

type BadgeVariant = 'danger' | 'warning' | 'success' | 'info';

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  danger: { bg: '#3B0A0A', text: colors.status.danger },
  warning: { bg: '#3B2000', text: colors.status.warning },
  success: { bg: '#052E16', text: colors.status.success },
  info: { bg: '#0C1A3B', text: colors.status.info },
};

export const Badge: React.FC<BadgeProps> = ({ label, variant }) => {
  const style = variantStyles[variant];
  return (
    <View
      style={{
        backgroundColor: style.bg,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 3,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color: style.text, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>
        {label}
      </Text>
    </View>
  );
};
