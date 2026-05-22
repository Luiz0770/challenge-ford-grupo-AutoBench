import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { useUserStore } from '../../store/userStore';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useUserStore();
  const router = useRouter();

  const handleRemove = (vehicleId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    removeFavorite(vehicleId);
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {favorites.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="heart-outline" size={52} color={colors.text.muted} />
            <Text
              style={{ color: colors.text.muted, fontSize: 16, marginTop: 16 }}
            >
              Nenhum favorito salvo
            </Text>
            <Text
              style={{ color: colors.text.muted, fontSize: 13, marginTop: 6 }}
            >
              Toque no ♡ na ficha técnica de um veículo.
            </Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.vehicleId}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: colors.bg.surface,
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: colors.bg.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Pressable
                  style={{ flex: 1 }}
                  onPress={() => router.push(`/vehicle/${item.vehicleId}`)}
                >
                  <Text
                    style={{ color: colors.text.primary, fontSize: 15, fontWeight: '600' }}
                  >
                    {item.vehicleName}
                  </Text>
                  <Text style={{ color: colors.text.muted, fontSize: 11, marginTop: 2 }}>
                    Salvo em {new Date(item.savedAt).toLocaleDateString('pt-BR')}
                  </Text>
                </Pressable>
                <Pressable onPress={() => handleRemove(item.vehicleId)} hitSlop={10}>
                  <Ionicons name="heart" size={22} color={colors.status.danger} />
                </Pressable>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
