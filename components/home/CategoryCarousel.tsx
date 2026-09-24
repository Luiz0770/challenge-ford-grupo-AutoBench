import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { Category } from '../../types';
import { riseClass } from '../ui/motion';
import { PressableScale } from '../ui/PressableScale';
import { SectionHeader } from './SectionHeader';

const CARD = 132;
const GAP = 10;

interface CategoryCarouselProps {
  categories: Category[];
  onSelect: (categoryId: string) => void;
  onSeeAll: () => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ categories, onSelect, onSeeAll }) => (
  <View className="pt-[26px]">
    <View className={`mb-3 px-5 ${riseClass(500)}`}>
      <SectionHeader title="Explorar por categoria" action="Ver tudo" onAction={onSeeAll} />
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD + GAP}
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: 20, gap: GAP }}
    >
      {categories.map((c, i) => (
        <View key={c.id} className={riseClass(540 + i * 40)}>
          <PressableScale
            onPress={() => onSelect(c.id)}
            accessibilityLabel={`${c.label}, ${c.count} modelos`}
            className="justify-between overflow-hidden rounded-[14px]"
            style={{
              width: CARD,
              height: CARD,
              backgroundColor: c.color,
              boxShadow: '0 1px 2px rgba(16,24,40,0.06)',
            }}
          >
            {/* Arcos de acento */}
            <Svg
              width={CARD}
              height={CARD}
              viewBox={`0 0 ${CARD} ${CARD}`}
              style={{ position: 'absolute', opacity: 0.4 }}
            >
              <Circle cx={116} cy={20} r={50} fill="none" stroke={c.accent} strokeWidth={1.2} />
              <Circle cx={116} cy={20} r={78} fill="none" stroke={c.accent} strokeWidth={0.8} opacity={0.6} />
            </Svg>

            <View className="px-3 pt-3">
              <View className="self-start rounded bg-white/20 px-[7px] py-[3px]">
                <Text className="font-mono-bold text-[9px] tracking-[1.5px]" style={{ color: c.accent }}>
                  {c.code}
                </Text>
              </View>
            </View>
            <View className="px-3 pb-3">
              <Text className="font-sans-bold text-base leading-[18px] tracking-[-0.3px] text-white">
                {c.label}
              </Text>
              <View className="mt-1 flex-row items-baseline gap-1">
                <Text className="font-mono-semibold text-[11px]" style={{ color: c.accent }}>
                  {c.count}
                </Text>
                <Text className="font-sans text-[10px] text-white/70">modelos</Text>
              </View>
            </View>
          </PressableScale>
        </View>
      ))}
    </ScrollView>
  </View>
);
