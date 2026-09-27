import React from 'react';
import { Text, View } from 'react-native';
import type { BrandSummary } from '../../types';
import { BrandLogo } from '../ui/BrandLogo';
import { PressableScale } from '../ui/PressableScale';
import { Rise } from '../ui/Rise';
import { SectionHeader } from './SectionHeader';

interface BrandGridProps {
  brands: BrandSummary[];
  onSelectBrand: (brand: string) => void;
}

// Marcas com mais modelos no catálogo
export const BrandGrid: React.FC<BrandGridProps> = ({ brands, onSelectBrand }) => (
  <View className="px-5 pt-[26px]">
    <Rise delay={960} className="mb-3">
      <SectionHeader title="Marcas no catálogo" />
    </Rise>
    <View className="flex-row flex-wrap gap-2">
      {brands.map((b, i) => (
        <Rise key={b.name} delay={1000 + i * 30} style={{ width: '23%', flexGrow: 1 }}>
          <PressableScale
            onPress={() => onSelectBrand(b.name)}
            accessibilityLabel={`${b.name}, ${b.count} modelos`}
            className="items-center gap-1 rounded-xl border border-ink-200 bg-surface px-1.5 py-2.5"
            style={{ boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}
          >
            <BrandLogo name={b.name} size={36} />
            <Text
              numberOfLines={1}
              className="text-center font-sans-semibold text-[11px] leading-[13px] tracking-[-0.1px] text-brand-deep"
            >
              {b.name}
            </Text>
            <Text className="font-mono text-[9px] text-ink-700">{b.count}</Text>
          </PressableScale>
        </Rise>
      ))}
    </View>
  </View>
);
