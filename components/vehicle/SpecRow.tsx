import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../constants/colors';

interface SpecRowProps {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}

export const SpecRow: React.FC<SpecRowProps> = ({ label, value, unit, highlight = false }) => {
  const isUnavailable = value === 'Não Disponível';
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.bg.border,
      }}
    >
      <Text
        style={{
          flex: 1,
          color: colors.text.secondary,
          fontSize: 13,
          marginRight: 12,
        }}
      >
        {label}
      </Text>
      <View style={{ flex: 1.2, alignItems: 'flex-end' }}>
        <Text
          style={{
            color: isUnavailable
              ? colors.text.muted
              : highlight
              ? colors.accent.amber
              : colors.text.primary,
            fontSize: 13,
            fontWeight: highlight ? '700' : '400',
            textAlign: 'right',
            fontStyle: isUnavailable ? 'italic' : 'normal',
          }}
        >
          {value}
        </Text>
        {unit && !isUnavailable && (
          <Text style={{ color: colors.text.muted, fontSize: 11, marginTop: 1 }}>{unit}</Text>
        )}
      </View>
    </View>
  );
};
