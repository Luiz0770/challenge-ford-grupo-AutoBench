import React, { useId } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Pattern, RadialGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '../../constants/colors';

const accent = colors.brand.bright;

// Fundo azul do hero da Início: gradiente + grade + halo + arcos.
// Sem `height`, preenche o pai (absolute); o pai precisa de overflow: hidden.
// Com `height`, ancora no topo do pai com altura explícita (pode passar do pai).
interface HeroBackgroundProps {
  height?: number;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = ({ height }) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const bg = `heroBg${uid}`;
  const halo = `heroHalo${uid}`;
  const grid = `heroGrid${uid}`;

  const svg = (
    <Svg
      width="100%"
      height="100%"
      style={StyleSheet.absoluteFill}
      viewBox="0 0 390 320"
      preserveAspectRatio="xMidYMid slice"
      pointerEvents="none"
    >
      <Defs>
        <LinearGradient id={bg} x1="0.33" y1="0" x2="0.67" y2="1">
          <Stop offset="0" stopColor={colors.brand.deep} />
          <Stop offset="0.78" stopColor={colors.brand.mid} />
          <Stop offset="1" stopColor="#0A52D6" />
        </LinearGradient>
        <RadialGradient id={halo} cx="80%" cy="0%" r="60%">
          <Stop offset="0" stopColor={accent} stopOpacity={0.55} />
          <Stop offset="1" stopColor={accent} stopOpacity={0} />
        </RadialGradient>
        <Pattern id={grid} width={36} height={36} patternUnits="userSpaceOnUse">
          <Path d="M36 0H0V36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${bg})`} />
      <Rect width="100%" height="100%" fill={`url(#${grid})`} opacity={0.55} />
      <Rect width="100%" height="100%" fill={`url(#${halo})`} opacity={0.55} />
      <Circle cx={340} cy={40} r={120} fill="none" stroke="rgba(255,255,255,0.08)" opacity={0.55} />
      <Circle cx={340} cy={40} r={180} fill="none" stroke="rgba(255,255,255,0.05)" opacity={0.55} />
      <Circle cx={340} cy={40} r={240} fill="none" stroke="rgba(255,255,255,0.04)" opacity={0.55} />
    </Svg>
  );

  if (height === undefined) return svg;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, height, overflow: 'hidden' }}>
      {svg}
    </View>
  );
};

// Altura do fundo: cobre o hero medido, e nunca menos que 40% da tela.
export const useHeroBackdropHeight = (heroHeight: number) => {
  const { height: screen } = useWindowDimensions();
  return Math.max(heroHeight, screen * 0.375);
};
