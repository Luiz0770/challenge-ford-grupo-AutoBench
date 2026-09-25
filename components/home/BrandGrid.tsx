import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { BrandSummary } from '../../types';
import { GradientFill } from '../ui/GradientFill';
import { Rise } from '../ui/Rise';
import { SectionHeader } from './SectionHeader';

interface BrandGridProps {
  brands: BrandSummary[];
}

// Marcas com mais modelos no catálogo (sem filtro por marca na busca ainda,
// por isso os itens não são tocáveis)
export const BrandGrid: React.FC<BrandGridProps> = ({ brands }) => (
  <View className="px-5 pt-[26px]">
    <Rise delay={960} className="mb-3">
      <SectionHeader title="Marcas no catálogo" />
    </Rise>
    <View className="flex-row flex-wrap gap-2">
      {brands.map((b, i) => (
        <Rise
          key={b.name}
          delay={1000 + i * 30} className="items-center gap-1 rounded-xl border border-ink-200 bg-surface px-1.5 py-2.5"
          style={{ width: '23%', flexGrow: 1, boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}
        >
          <View className="h-8 w-8 items-center justify-center overflow-hidden rounded-full">
            <GradientFill
              angle={135}
              stops={[
                { color: colors.brand.deep, offset: 0 },
                { color: colors.brand.mid, offset: 1 },
              ]}
            />
            <Text className="font-sans-bold text-xs text-white">{b.name.slice(0, 2).toUpperCase()}</Text>
          </View>
          <Text
            numberOfLines={1}
            className="text-center font-sans-semibold text-[11px] leading-[13px] tracking-[-0.1px] text-brand-deep"
          >
            {b.name}
          </Text>
          <Text className="font-mono text-[9px] text-ink-700">{b.count}</Text>
        </Rise>
      ))}
    </View>
  </View>
);
