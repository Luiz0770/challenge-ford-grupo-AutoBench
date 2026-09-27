import { useEffect, useRef } from 'react';
import { Animated, LayoutChangeEvent, PanResponder } from 'react-native';
import { shouldCloseSheet } from '../utils/dragToClose';

// Arrasta a alça da sheet para baixo para fechar: a sheet acompanha o dedo
// e, ao soltar, fecha (se passou do limiar/flick) ou volta com uma mola.
// `open` reseta a posição toda vez que a sheet é reaberta.
export function useDragToCloseSheet(open: boolean, onClose: () => void) {
  const translateY = useRef(new Animated.Value(0)).current;
  const sheetHeight = useRef(0);

  useEffect(() => {
    if (open) translateY.setValue(0);
  }, [open, translateY]);

  const onSheetLayout = (e: LayoutChangeEvent) => {
    sheetHeight.current = e.nativeEvent.layout.height;
  };

  const snapBack = () => {
    Animated.spring(translateY, { toValue: 0, useNativeDriver: true, bounciness: 6 }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: (_, gestureState) => Math.abs(gestureState.dy) > 4,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (shouldCloseSheet(gestureState.dy, gestureState.vy, sheetHeight.current)) {
          Animated.timing(translateY, {
            toValue: sheetHeight.current || 800,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onClose());
        } else {
          snapBack();
        }
      },
      onPanResponderTerminate: snapBack,
    }),
  ).current;

  return { translateY, panHandlers: panResponder.panHandlers, onSheetLayout };
}
