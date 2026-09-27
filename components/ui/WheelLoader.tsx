import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { colors } from '../../constants/colors';

const SPOKES = 5;

interface WheelLoaderProps {
  size?: number;
}

// Roda de carro girando: pneu, aro com raios e cubo central
export const WheelLoader: React.FC<WheelLoaderProps> = ({ size = 72 }) => {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={{ width: size, height: size, transform: [{ rotate }] }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Pneu */}
        <Circle cx="50" cy="50" r="48" fill={colors.brand.navyDeep} />
        <Circle cx="50" cy="50" r="43" fill="none" stroke={colors.brand.navyLight} strokeWidth="1.5" strokeDasharray="4 5" />
        {/* Aro */}
        <Circle cx="50" cy="50" r="33" fill="#E4E8EF" />
        <Circle cx="50" cy="50" r="33" fill="none" stroke={colors.brand.navy} strokeWidth="2" />
        {/* Raios */}
        {Array.from({ length: SPOKES }).map((_, i) => (
          // rotate(ângulo cx cy) em vez de `origin`: no web o `origin` vira o atributo inválido `transform-origin`
          <G key={i} transform={`rotate(${(360 / SPOKES) * i} 50 50)`}>
            <Path d="M46 50 L44 22 Q50 18 56 22 L54 50 Z" fill={colors.brand.navy} />
          </G>
        ))}
        {/* Cubo */}
        <Circle cx="50" cy="50" r="10" fill={colors.brand.navyLight} />
        <Circle cx="50" cy="50" r="4" fill="#FFFFFF" />
      </Svg>
    </Animated.View>
  );
};
