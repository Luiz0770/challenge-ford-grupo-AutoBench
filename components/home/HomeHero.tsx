import { BlurTargetView, BlurView } from 'expo-blur';
import { User } from 'lucide-react-native';
import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Path, Pattern, RadialGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../../constants/colors';
import { LivePulse } from '../ui/LivePulse';
import { riseClass } from '../ui/motion';
import { Wordmark } from '../ui/Wordmark';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const accent = colors.brand.bright;

// Fundo do hero: gradiente azul + grade + halo + arcos (decoração do design)
const HeroBackground: React.FC = () => (
  <Svg
    width="100%"
    height="100%"
    style={StyleSheet.absoluteFill}
    viewBox="0 0 390 320"
    preserveAspectRatio="xMidYMid slice"
  >
    <Defs>
      <LinearGradient id="heroBg" x1="0.33" y1="0" x2="0.67" y2="1">
        <Stop offset="0" stopColor={colors.brand.deep} />
        <Stop offset="0.78" stopColor={colors.brand.mid} />
        <Stop offset="1" stopColor="#0A52D6" />
      </LinearGradient>
      <RadialGradient id="heroHalo" cx="80%" cy="0%" r="60%">
        <Stop offset="0" stopColor={accent} stopOpacity={0.55} />
        <Stop offset="1" stopColor={accent} stopOpacity={0} />
      </RadialGradient>
      <Pattern id="heroGrid" width={36} height={36} patternUnits="userSpaceOnUse">
        <Path d="M36 0H0V36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#heroBg)" />
    <Rect width="100%" height="100%" fill="url(#heroGrid)" opacity={0.55} />
    <Rect width="100%" height="100%" fill="url(#heroHalo)" opacity={0.55} />
    <Circle cx={340} cy={40} r={120} fill="none" stroke="rgba(255,255,255,0.08)" opacity={0.55} />
    <Circle cx={340} cy={40} r={180} fill="none" stroke="rgba(255,255,255,0.05)" opacity={0.55} />
    <Circle cx={340} cy={40} r={240} fill="none" stroke="rgba(255,255,255,0.04)" opacity={0.55} />
  </Svg>
);

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
      <View className={`flex-row items-center justify-between px-5 pt-2 pb-[18px] ${riseClass(0)}`}>
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
      </View>

      {/* Saudação */}
      <View className={`px-5 pt-1.5 pb-1 ${riseClass(60)}`}>
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
      </View>
    </View>
  );
};
