import { BlurTargetView, BlurView } from 'expo-blur';
import { User } from 'lucide-react-native';
import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { HeroBackground } from '../ui/HeroBackground';
import { LivePulse } from '../ui/LivePulse';
import { Rise } from '../ui/Rise';
import { Wordmark } from '../ui/Wordmark';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const accent = colors.brand.bright;

export const HomeHero: React.FC = () => {
  const insets = useSafeAreaInsets();
  const blurTarget = useRef<View | null>(null);
  const now = new Date();
  const fipeRef = `${MONTHS[now.getMonth()]}/${now.getFullYear()}`;

  return (
    <View className="relative overflow-hidden pb-[70px]" style={{ paddingTop: insets.top + 6 }}>
      {/* Conteúdo que o BlurView do avatar desfoca no Android */}
      <BlurTargetView ref={blurTarget} style={StyleSheet.absoluteFill}>
        <HeroBackground />
      </BlurTargetView>

      {/* Marca + avatar */}
      <Rise delay={0} className="flex-row items-center justify-between px-5 pt-2 pb-[18px]">
        <Wordmark light />
        <View className="relative">
          <BlurView
            intensity={30}
            tint="dark"
            blurTarget={blurTarget}
            blurMethod="dimezisBlurViewSdk31Plus"
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.18)',
              backgroundColor: 'rgba(255,255,255,0.12)',
            }}
          >
            <User size={17} color="#fff" strokeWidth={2.2} />
          </BlurView>
          <View
            className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2"
            style={{ backgroundColor: accent, borderColor: colors.brand.deep }}
          />
        </View>
      </Rise>

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
