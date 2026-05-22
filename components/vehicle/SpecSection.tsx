import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { SpecSection as SpecSectionType } from '../../types';
import { SpecRow } from './SpecRow';

interface SpecSectionProps {
  section: SpecSectionType;
}

export const SpecSection: React.FC<SpecSectionProps> = ({ section }) => (
  <View style={{ marginBottom: 20 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: colors.bg.elevated,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons name={section.icon as any} size={16} color={colors.accent.amber} />
      </View>
      <Text style={{ color: colors.text.primary, fontSize: 15, fontWeight: '700' }}>
        {section.title}
      </Text>
    </View>
    <View
      style={{
        backgroundColor: colors.bg.surface,
        borderRadius: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: colors.bg.border,
      }}
    >
      {section.specs.map((spec, index) => (
        <SpecRow
          key={`${spec.label}-${index}`}
          label={spec.label}
          value={spec.value}
          unit={spec.unit}
          highlight={spec.highlight}
        />
      ))}
    </View>
  </View>
);
