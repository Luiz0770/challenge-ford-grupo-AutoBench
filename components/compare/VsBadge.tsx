import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../constants/colors';

interface VsBadgeProps {
  // dark: badge do setup (com anel na cor do fundo). light: badge do resultado (com pop).
  variant?: 'dark' | 'light';
}

// Badge "VS" centralizado sobre os dois slots (não intercepta toques)
export const VsBadge: React.FC<VsBadgeProps> = ({ variant = 'dark' }) => {
  const dark = variant === 'dark';
  const progress = useRef(new Animated.Value(dark ? 1 : 0)).current;

  useEffect(() => {
    if (dark) return;
    const a = Animated.sequence([
      Animated.delay(260),
      Animated.spring(progress, { toValue: 1, friction: 5, tension: 120, useNativeDriver: true }),
    ]);
    a.start();
    return () => a.stop();
  }, [dark, progress]);

  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['-25deg', '0deg'] });

  return (
    <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]} pointerEvents="none">
      <Animated.View
        style={{
          opacity: progress.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1, 1] }),
          transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }, { rotate }],
          width: dark ? 30 : 28,
          height: dark ? 30 : 28,
          borderRadius: 15,
          backgroundColor: dark ? colors.brand.navy : colors.bg.surface,
          borderWidth: dark ? 3 : 1,
          borderColor: dark ? colors.bg.canvas : colors.bg.border,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 3,
          shadowColor: '#101828',
          shadowOpacity: dark ? 0 : 0.1,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <Text
          style={{
            fontFamily: fonts.monoBold,
            fontSize: 10,
            color: dark ? colors.text.inverse : colors.brand.navy,
            letterSpacing: 0.5,
          }}
        >
          VS
        </Text>
      </Animated.View>
    </View>
  );
};
