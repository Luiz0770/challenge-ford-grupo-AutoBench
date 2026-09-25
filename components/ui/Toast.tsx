import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';

interface ToastProps {
  message: string | null;
  onHide: () => void;
}

// Aviso rápido no rodapé da tela (some sozinho após ~2s)
export const Toast: React.FC<ToastProps> = ({ message, onHide }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const onHideRef = useRef(onHide);
  onHideRef.current = onHide;

  useEffect(() => {
    if (!message) return;
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    const timer = setTimeout(() => {
      Animated.timing(anim, { toValue: 0, duration: 180, useNativeDriver: true }).start(
        ({ finished }) => {
          if (finished) onHideRef.current();
        },
      );
    }, 2200);
    return () => clearTimeout(timer);
  }, [message, anim]);

  if (!message) return null;

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });

  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center' }}
    >
      <Animated.View
        style={{
          opacity: anim,
          transform: [{ translateY }],
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 999,
          backgroundColor: colors.brand.navy,
          shadowColor: '#001A4D',
          shadowOpacity: 0.25,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 8 },
          elevation: 6,
        }}
      >
        <Feather name="check" size={14} color={colors.brand.cyan} />
        <Text style={{ fontFamily: fonts.sansMedium, fontSize: 13, color: colors.text.inverse }}>
          {message}
        </Text>
      </Animated.View>
    </View>
  );
};
