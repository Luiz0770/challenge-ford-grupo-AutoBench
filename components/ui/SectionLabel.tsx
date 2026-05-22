import React from 'react';
import { Text, TextStyle } from 'react-native';
import { colors, fonts } from '../../constants/colors';

interface SectionLabelProps {
  children: string;
  mono?: boolean;
  style?: TextStyle;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ children, mono = true, style }) => (
  <Text
    style={[
      {
        fontFamily: mono ? fonts.monoSemibold : fonts.sansSemibold,
        fontSize: 10,
        letterSpacing: 1.6,
        color: colors.text.secondary,
        textTransform: 'uppercase',
      },
      style,
    ]}
  >
    {children}
  </Text>
);
