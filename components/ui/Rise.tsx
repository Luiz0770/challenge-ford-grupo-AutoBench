import { useFocusEffect } from 'expo-router';
import { cssInterop } from 'nativewind';
import React, { useCallback } from 'react';
import { Animated, Easing, ViewProps } from 'react-native';

// className -> style em um Animated.View. A animação em si usa só o Animated do
// React Native (driver nativo), sem passar pelo Reanimated do NativeWind.
const AnimatedView = cssInterop(Animated.View, { className: 'style' });

interface RiseProps extends ViewProps {
  className?: string;
  /** Atraso da entrada em ms. */
  delay?: number;
}

const easeOut = Easing.bezier(0.22, 0.94, 0.4, 1);

// Entrada escalonada (fade + sobe 10px). Equivale ao antigo `animate-rise`.
export const Rise: React.FC<RiseProps> = ({ delay = 0, style, children, ...rest }) => {
  const progress = React.useRef(new Animated.Value(0)).current;

  // Roda a cada vez que a tela ganha foco (troca de aba, voltar de outra tela)
  useFocusEffect(
    useCallback(() => {
      progress.setValue(0);
      const a = Animated.timing(progress, {
        toValue: 1,
        duration: 520,
        delay,
        easing: easeOut,
        useNativeDriver: true,
      });
      a.start();
      return () => a.stop();
    }, [progress, delay])
  );

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });

  return (
    <AnimatedView {...rest} style={[style, { opacity: progress, transform: [{ translateY }] }]}>
      {children}
    </AnimatedView>
  );
};
