import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { useUserStore } from '../../store/userStore';

export default function HistoryScreen() {
  const { history, clearHistory } = useUserStore();
  const router = useRouter();

  const handleClear = () => {
    Alert.alert(
      'Limpar Histórico',
      'Deseja apagar todo o histórico de visualizações?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: clearHistory },
      ]
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {history.length > 0 && (
          <Pressable
            onPress={handleClear}
            style={{ alignSelf: 'flex-end', paddingVertical: 12 }}
          >
            <Text style={{ color: colors.status.danger, fontSize: 13 }}>Limpar tudo</Text>
          </Pressable>
        )}
        {history.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="time-outline" size={52} color={colors.text.muted} />
            <Text style={{ color: colors.text.muted, fontSize: 16, marginTop: 16 }}>
              Histórico vazio
            </Text>
            <Text style={{ color: colors.text.muted, fontSize: 13, marginTop: 6 }}>
              Veículos visualizados aparecerão aqui.
            </Text>
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.vehicleId}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`/vehicle/${item.vehicleId}`)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  backgroundColor: colors.bg.surface,
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: colors.bg.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                })}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: colors.bg.elevated,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="car" size={18} color={colors.accent.amber} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ color: colors.text.primary, fontSize: 14, fontWeight: '600' }}
                  >
                    {item.vehicleName}
                  </Text>
                  <Text style={{ color: colors.text.muted, fontSize: 11, marginTop: 2 }}>
                    {new Date(item.viewedAt).toLocaleString('pt-BR')}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.text.muted} />
              </Pressable>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
