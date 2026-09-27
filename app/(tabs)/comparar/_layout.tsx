import { Stack } from 'expo-router';
import { colors } from '../../../constants/colors';

export default function CompareLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg.canvas },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="resultado" />
    </Stack>
  );
}
