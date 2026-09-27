import { BlurTargetView } from 'expo-blur';
import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { HeroBackground } from '../ui/HeroBackground';
import { HeroBrandRow } from '../ui/HeroBrandRow';
import { LivePulse } from '../ui/LivePulse';
import { Rise } from '../ui/Rise';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const accent = colors.brand.bright;

export const HomeHero: React.FC = () => {
  const insets = useSafeAreaInsets();
  const blurTarget = useRef<View | null>(null);
  const now = new Date();
  const fipeRef = `${MONTHS[now.getMonth()]}/${now.getFullYear()}`;

  return (
    <View className="relative overflow-hidden pb-[70px]" style={{ paddingTop: insets.top + 14 }}>
      {/* Conteúdo que o BlurView do header desfoca no Android */}
      <BlurTargetView ref={blurTarget} style={StyleSheet.absoluteFill}>
        <HeroBackground />
      </BlurTargetView>

      <HeroBrandRow />

      {/* Saudação */}
      <Rise delay={60} className="px-5 pt-1.5 pb-1">
        <View className="mb-2.5 flex-row items-center gap-2">
          <LivePulse color={accent} size={6} />
          <Text className="font-mono-medium text-[10px] uppercase tracking-[1.4px] text-white/70">
            FIPE {fipeRef} · live
          </Text>
        </View>
        <Text className="mb-2 font-sans-bold text-[30px] leading-[32px] tracking-[-0.9px] text-white">
          Qual veículo{'\n'}vamos analisar?
        </Text>
        <Text className="max-w-[300px] font-sans text-sm leading-[21px] text-white/70">
          Especificações determinísticas + sinais preditivos do Oráculo IA.
        </Text>
      </Rise>
    </View>
  );
};
