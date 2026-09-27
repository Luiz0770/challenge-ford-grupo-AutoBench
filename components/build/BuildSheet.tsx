import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Animated, KeyboardAvoidingView, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../../constants/colors';
import { useDragToCloseSheet } from '../../hooks/useDragToCloseSheet';

interface BuildSheetProps {
  open: boolean;
  eyebrow: string;
  title: string;
  onClose: () => void;
  /** Conteúdo fixo abaixo do título (ex.: busca e chips) */
  header?: React.ReactNode;
  /** true: ocupa 80% da altura (listas longas); false: altura do conteúdo */
  fill?: boolean;
  /** false: o filho gerencia a rolagem (ex.: FlatList) */
  scroll?: boolean;
  children: React.ReactNode;
}

// Bottom sheet genérico da Montagem (mesmo padrão do VehiclePickerSheet)
export const BuildSheet: React.FC<BuildSheetProps> = ({
  open,
  eyebrow,
  title,
  onClose,
  header,
  fill = false,
  scroll = true,
  children,
}) => {
  const insets = useSafeAreaInsets();
  const { translateY, panHandlers, onSheetLayout } = useDragToCloseSheet(open, onClose);

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      // Android: cobre a tela inteira, inclusive status/navigation bar
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,28,70,0.42)',
          }}
          onPress={onClose}
        />
        <Animated.View
          onLayout={onSheetLayout}
          style={{
            height: fill ? '80%' : undefined,
            maxHeight: '80%',
            backgroundColor: colors.bg.surface,
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            paddingTop: 12,
            paddingBottom: Math.max(30, insets.bottom + 12),
            transform: [{ translateY }],
          }}
        >
          <View
            {...panHandlers}
            hitSlop={{ top: 12, bottom: 12, left: 60, right: 60 }}
            style={{ paddingTop: 10, paddingBottom: 14, marginTop: -10 }}
          >
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 4,
                backgroundColor: colors.bg.borderStrong,
                alignSelf: 'center',
              }}
            />
          </View>

          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fonts.monoBold,
                  fontSize: 9,
                  color: colors.text.secondary,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                  marginBottom: 2,
                }}
              >
                {eyebrow}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 17,
                  color: colors.brand.navy,
                  letterSpacing: -0.4,
                }}
              >
                {title}
              </Text>
            </View>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar">
              {({ pressed }) => (
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: colors.bg.borderStrong,
                    backgroundColor: colors.bg.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.7 : 1,
                  }}
                >
                  <Feather name="x" size={14} color={colors.text.secondary} />
                </View>
              )}
            </Pressable>
          </View>

          {header}

          {scroll ? (
            <ScrollView
              style={{ flexGrow: 0 }}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 8 }}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={{ flex: 1 }}>{children}</View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
