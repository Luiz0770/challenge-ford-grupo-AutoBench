import { Stack } from 'expo-router';
import { colors } from '../../../constants/colors';

export default function MontagemLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg.canvas },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="editar" />
    </Stack>
  );
}
