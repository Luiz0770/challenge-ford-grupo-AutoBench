import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { PredictiveAlert } from '../../types';

interface PredictiveAlertCardProps {
  alert: PredictiveAlert;
}

const alertColors: Record<string, string> = {
  decontenting: colors.status.danger,
  price_increase: colors.status.warning,
  discontinuation: colors.status.info,
};

export const PredictiveAlertCard: React.FC<PredictiveAlertCardProps> = ({ alert }) => {
  const accentColor = alertColors[alert.type] ?? colors.status.warning;
  return (
    <View
      style={{
        backgroundColor: colors.bg.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: accentColor,
        marginBottom: 20,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Text style={{ fontSize: 18 }}>⚠️</Text>
        <Text style={{ color: accentColor, fontSize: 13, fontWeight: '700', flex: 1 }}>
          {alert.title}
        </Text>
      </View>

      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ color: colors.text.secondary, fontSize: 11 }}>Probabilidade</Text>
          <Text style={{ color: accentColor, fontSize: 11, fontWeight: '700' }}>
            {alert.probability}%
          </Text>
        </View>
        <View style={{ height: 4, backgroundColor: colors.bg.elevated, borderRadius: 2 }}>
          <View
            style={{
              height: 4,
              width: `${alert.probability}%`,
              backgroundColor: accentColor,
              borderRadius: 2,
            }}
          />
        </View>
      </View>

      <Text style={{ color: colors.text.secondary, fontSize: 13, lineHeight: 20, marginBottom: 10 }}>
        {alert.description}
      </Text>
      <View
        style={{
          backgroundColor: colors.bg.elevated,
          borderRadius: 8,
          padding: 10,
        }}
      >
        <Text style={{ color: colors.text.muted, fontSize: 11, fontWeight: '700', marginBottom: 3 }}>
          AÇÃO SUGERIDA
        </Text>
        <Text style={{ color: colors.accent.amber, fontSize: 12, lineHeight: 18 }}>
          {alert.actionSuggestion}
        </Text>
      </View>
    </View>
  );
};
