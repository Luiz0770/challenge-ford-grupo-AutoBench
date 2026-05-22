import '../global.css';
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  useFonts as useGeist,
} from '@expo-google-fonts/geist';
import {
  GeistMono_400Regular,
  GeistMono_500Medium,
  GeistMono_600SemiBold,
  GeistMono_700Bold,
  useFonts as useGeistMono,
} from '@expo-google-fonts/geist-mono';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [geistLoaded] = useGeist({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  });
  const [geistMonoLoaded] = useGeistMono({
    GeistMono_400Regular,
    GeistMono_500Medium,
    GeistMono_600SemiBold,
    GeistMono_700Bold,
  });

  const ready = geistLoaded && geistMonoLoaded;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: colors.bg.canvas }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg.canvas },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="vehicle/[id]" options={{ animation: 'slide_from_bottom' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
