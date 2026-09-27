import React, { useCallback, useRef } from 'react';
import { Animated, Easing, type ImageProps } from 'react-native';

// Mesma curva/duração do Rise, pra combinar com a entrada do resto da tela.
const easeOut = Easing.bezier(0.22, 0.94, 0.4, 1);

interface FadeImageProps extends ImageProps {
  duration?: number;
}

// Substitui a <Image> nua nos cards/cabeçalhos: em vez de "estourar" na tela
// assim que o bitmap fica pronto (que costuma acontecer antes do resto do
// card terminar de entrar), começa transparente e faz um fade de opacidade
// no onLoad — carro e texto aparecem no mesmo ritmo.
export const FadeImage: React.FC<FadeImageProps> = ({ style, duration = 320, onLoad, ...rest }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  const handleLoad = useCallback(
    (event: Parameters<NonNullable<ImageProps['onLoad']>>[0]) => {
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        easing: easeOut,
        useNativeDriver: true,
      }).start();
      onLoad?.(event);
    },
    [opacity, duration, onLoad]
  );

  return <Animated.Image {...rest} onLoad={handleLoad} style={[style, { opacity }]} />;
};
