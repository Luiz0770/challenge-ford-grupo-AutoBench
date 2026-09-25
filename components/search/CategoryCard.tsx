import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';
import type { Category } from '../../types';
import { PressableScale } from '../ui/PressableScale';
import { RadialFill, categoryGlow } from '../ui/RadialFill';
import { Rise } from '../ui/Rise';

interface CategoryCardProps {
  category: Category;
  // Posição na grade, usada no atraso da entrada escalonada
  index?: number;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, index = 0, onPress }) => (
  <Rise delay={index * 35} style={{ width: '48%' }}>
    <PressableScale
      onPress={onPress}
      accessibilityLabel={`${category.label}, ${category.count} modelos`}
      style={{
        height: 96,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: category.color,
        padding: 14,
      }}
    >
      <RadialFill layers={categoryGlow(category.accent, 0.15, 0.18)} />

      <Text
        style={{
          position: 'absolute',
          bottom: -10,
          right: -2,
          fontFamily: fonts.monoBold,
          fontSize: 56,
          color: category.accent,
          opacity: 0.22,
          letterSpacing: -3,
          lineHeight: 56,
        }}
      >
        {category.code}
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Feather name="arrow-up-right" size={14} color="rgba(255,255,255,0.55)" />
      </View>

      <View style={{ position: 'absolute', left: 14, bottom: 12 }}>
        <Text
          style={{
            fontFamily: fonts.sansBold,
            fontSize: 16,
            color: colors.bg.surface,
            letterSpacing: -0.4,
            lineHeight: 18,
          }}
        >
          {category.label}
        </Text>
        <Text
          style={{
            fontFamily: fonts.monoMedium,
            fontSize: 10,
            color: 'rgba(255,255,255,0.65)',
            letterSpacing: 0.4,
            marginTop: 4,
          }}
        >
          {category.count} modelos
        </Text>
      </View>
    </PressableScale>
  </Rise>
);
