import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { colors, fonts } from '../../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.96)',
          borderTopColor: 'rgba(0,28,70,0.06)',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 78 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 22 : 10,
        },
        tabBarActiveTintColor: colors.brand.navy,
        tabBarInactiveTintColor: colors.text.muted,
        tabBarLabelStyle: {
          fontFamily: fonts.sansMedium,
          fontSize: 10,
          letterSpacing: -0.1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="home" size={20} color={color} strokeWidth={focused ? 2.4 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="busca"
        options={{
          title: 'Busca',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="search" size={20} color={color} strokeWidth={focused ? 2.4 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="comparar"
        options={{
          title: 'Comparar',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="git-pull-request" size={20} color={color} strokeWidth={focused ? 2.4 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
