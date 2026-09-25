import { ArrowUpRight, Car, Sparkles } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { Vehicle } from '../../types';
import { GradientFill } from '../ui/GradientFill';
import { Rise } from '../ui/Rise';
import { PressableScale } from '../ui/PressableScale';

const accent = colors.brand.bright;

// Brilho único que atravessa o card (antigo `animate-sweep`)
const Sweep: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const progress = React.useRef(new Animated.Value(0)).current;
  const [width, setWidth] = useState(0);

  useFocusEffect(
    useCallback(() => {
      progress.setValue(0);
      const a = Animated.timing(progress, {
        toValue: 1,
        duration: 1600,
        delay: 280,
        easing: Easing.bezier(0.22, 0.94, 0.4, 1),
        useNativeDriver: true,
      });
      a.start();
      return () => a.stop();
    }, [progress])
  );

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [-width, width] });

  return (
    <View
      pointerEvents="none"
      className="absolute inset-0"
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
    >
      <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>{children}</Animated.View>
    </View>
  );
};

// Rotação lenta contínua (antigo `animate-spin-slow`)
const SlowSpin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const turn = React.useRef(new Animated.Value(0)).current;

  // Só gira enquanto a tela está em foco
  useFocusEffect(
    useCallback(() => {
      const loop = Animated.loop(
        Animated.timing(turn, { toValue: 1, duration: 14000, easing: Easing.linear, useNativeDriver: true })
      );
      loop.start();
      return () => loop.stop();
    }, [turn])
  );

  const rotate = turn.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return <Animated.View style={{ transform: [{ rotate }] }}>{children}</Animated.View>;
};

interface OracleInsightCardProps {
  vehicle: Vehicle;
  onPress: () => void;
}

// Alerta preditivo do dia (VehicleDataService.getDailyAlertVehicle)
export const OracleInsightCard: React.FC<OracleInsightCardProps> = ({ vehicle, onPress }) => {
  const { alert } = vehicle;

  return (
    <Rise delay={420} className="px-5 pt-[22px]">
      <PressableScale
        onPress={onPress}
        accessibilityLabel={`${alert.title}. Abrir ${vehicle.brand} ${vehicle.model}`}
        className="relative overflow-hidden rounded-2xl border border-white/10 p-4"
        style={{ backgroundColor: colors.brand.ink, boxShadow: '0 4px 14px rgba(0,26,77,0.18)' }}
      >
        <GradientFill
          angle={135}
          stops={[
            { color: colors.brand.ink, offset: 0 },
            { color: '#11244A', offset: 1 },
          ]}
        />

        {/* Brilho único atravessando o card (.ab-sweep) */}
        <Sweep>
          <GradientFill
            angle={115}
            stops={[
              { color: '#60A5FA', offset: 0.3, opacity: 0 },
              { color: '#60A5FA', offset: 0.5, opacity: 0.18 },
              { color: '#60A5FA', offset: 0.7, opacity: 0 },
            ]}
          />
        </Sweep>

        {/* Selo */}
        <View className="absolute right-0 top-0 rounded-bl-[10px] px-3 py-2" style={{ backgroundColor: accent }}>
          <Text className="font-mono-bold text-[9px] uppercase tracking-[1.4px] text-brand-ink">
            Oráculo IA
          </Text>
        </View>

        <View className="mb-3 flex-row items-center gap-1.5 opacity-70">
          <SlowSpin>
            <Sparkles size={13} color={accent} strokeWidth={2.2} />
          </SlowSpin>
          <Text className="font-mono text-[10px] uppercase tracking-[1.4px] text-white/70">
            Oráculo · hoje
          </Text>
        </View>

        <Text className="mb-2 font-sans-bold text-[19px] leading-[23px] tracking-[-0.5px] text-white">
          {alert.title}
        </Text>
        <Text className="mb-3.5 font-sans text-[13px] leading-[19.5px] text-white/70">
          {alert.description}
        </Text>

        <View className="flex-row items-center gap-2.5">
          <View className="flex-shrink flex-row items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1.5">
            <Car size={12} color={accent} strokeWidth={2.4} />
            <Text numberOfLines={1} className="flex-shrink font-mono-semibold text-[11px] text-white">
              {vehicle.brand} {vehicle.model}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1.5">
            <View className="h-[5px] w-[5px] rounded-full" style={{ backgroundColor: accent }} />
            <Text className="font-mono-semibold text-[11px] text-white">{alert.probability}% conf.</Text>
          </View>
          <View className="flex-1" />
          <ArrowUpRight size={18} color="#fff" strokeWidth={2.4} />
        </View>
      </PressableScale>
    </Rise>
  );
};
