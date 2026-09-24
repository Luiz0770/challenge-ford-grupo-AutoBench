import { Sparkles, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { Category, Vehicle } from '../../types';
import { riseClass } from '../ui/motion';
import { PressableScale } from '../ui/PressableScale';
import { FipeValue } from './FipeValue';
import { SectionHeader } from './SectionHeader';

interface TrendingListProps {
  vehicles: Vehicle[];
  categories: Category[];
  onSelect: (vehicleId: string) => void;
}

// "Em alta": veículos com maior probabilidade de alerta do Oráculo
export const TrendingList: React.FC<TrendingListProps> = ({ vehicles, categories, onSelect }) => (
  <View className="px-5 pt-[26px]">
    <View className={`mb-3 ${riseClass(720)}`}>
      <SectionHeader title="Em alta no Oráculo" icon={TrendingUp} iconColor={colors.brand.warm} />
    </View>
    <View
      className="overflow-hidden rounded-[14px] border border-ink-200 bg-surface"
      style={{ boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}
    >
      {vehicles.map((v, i) => {
        const category = categories.find((c) => c.id === v.categoryId);
        const tone = category?.color ?? colors.brand.mid;
        return (
          <View key={v.id} className={riseClass(760 + i * 50)}>
            <PressableScale
              onPress={() => onSelect(v.id)}
              accessibilityLabel={`${v.brand} ${v.model} ${v.version}`}
              className={`flex-row items-center gap-3 px-3.5 py-3 ${i > 0 ? 'border-t border-ink-100' : ''}`}
            >
              {/* Posição */}
              <View
                className="h-6 w-6 items-center justify-center rounded-md"
                style={{ backgroundColor: `${tone}14` }}
              >
                <Text className="font-mono-bold text-[11px]" style={{ color: tone }}>
                  {i + 1}
                </Text>
              </View>

              <View className="min-w-0 flex-1">
                <View className="flex-row items-baseline gap-1.5">
                  <Text className="font-mono text-[9px] uppercase tracking-[1.1px] text-ink-700">
                    {v.brand}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="flex-shrink font-sans-bold text-sm tracking-[-0.2px] text-brand-deep"
                  >
                    {v.model}
                  </Text>
                </View>
                <View className="mt-0.5 flex-row items-center gap-2">
                  <Text numberOfLines={1} className="max-w-[130px] font-sans text-[11.5px] text-ink-700">
                    {v.version}
                  </Text>
                  {category && (
                    <>
                      <View className="h-[3px] w-[3px] rounded-full bg-ink-300" />
                      <Text className="font-mono text-[10px] text-ink-700">{category.label}</Text>
                    </>
                  )}
                </View>
              </View>

              <View className="items-end">
                <FipeValue vehicle={v} className="font-mono-semibold text-xs text-brand-deep" />
                <View className="mt-0.5 flex-row items-center gap-[3px] rounded-full bg-warm-soft px-1.5 py-0.5">
                  <Sparkles size={9} color={colors.brand.warm} strokeWidth={2.6} />
                  <Text className="font-mono-bold text-[10px] text-brand-warm">{v.alert.probability}%</Text>
                </View>
              </View>
            </PressableScale>
          </View>
        );
      })}
    </View>
  </View>
);
