import React, { useEffect } from 'react';
import { Animated, View, ViewStyle } from 'react-native';

interface GrowBarProps {
  pct: number;
  delay?: number;
  duration?: number;
  trackColor: string;
  fillColor: string;
  height?: number;
  style?: ViewStyle;
}

export const GrowBar: React.FC<GrowBarProps> = ({
  pct,
  delay = 0,
  duration = 900,
  trackColor,
  fillColor,
  height = 4,
  style,
}) => {
  const anim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.timing(anim, {
      toValue: Math.max(0, Math.min(100, pct)),
      duration,
      delay,
      useNativeDriver: false,
    });
    a.start();
    return () => a.stop();
  }, [pct, delay, duration, anim]);

  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View
      style={[
        { height, borderRadius: height, backgroundColor: trackColor, overflow: 'hidden' },
        style,
      ]}
    >
      <Animated.View style={{ height, width, backgroundColor: fillColor, borderRadius: height }} />
    </View>
  );
};
