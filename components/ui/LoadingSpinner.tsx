import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../../constants/colors';

export const LoadingSpinner: React.FC = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.bg.primary,
    }}
  >
    <ActivityIndicator size="large" color={colors.accent.amber} />
  </View>
);
