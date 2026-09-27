import React from 'react';
import { View } from 'react-native';
import { WheelLoader } from './WheelLoader';

interface FipeLoadingOverlayProps {
  /** Enquanto true, cobre a tela com fundo branco e a roda girando ao centro. */
  visible: boolean;
}

// Deve ser filho direto do container da tela (position: relative) para cobri-la
export const FipeLoadingOverlay: React.FC<FipeLoadingOverlayProps> = ({ visible }) => {
  if (!visible) return null;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Carregando valores da FIPE"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        elevation: 100,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <WheelLoader size={72} />
    </View>
  );
};
