import React, { useEffect } from 'react';
import { Animated, View } from 'react-native';

interface LivePulseProps {
  color: string;
  size?: number;
}

export const LivePulse: React.FC<LivePulseProps> = ({ color, size = 6 }) => {
  const scale = React.useRef(new Animated.Value(0.6)).current;
  const opacity = React.useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.timing(scale, { toValue: 2.2, duration: 1600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scale, opacity]);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: color,
        position: 'relative',
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: -3,
          left: -3,
          right: -3,
          bottom: -3,
          borderRadius: size,
          backgroundColor: color,
          opacity,
          transform: [{ scale }],
        }}
      />
    </View>
  );
};
