import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HierarchicalSearchBar } from '../../components/search/HierarchicalSearchBar';
import { Card } from '../../components/ui/Card';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { Wordmark } from '../../components/ui/Wordmark';
import { colors, fonts } from '../../constants/colors';
import { useFipePrice } from '../../hooks/useFipePrice';
import { VehicleDataService } from '../../services/vehicleData';
import { useUserStore } from '../../store/userStore';
import { fmtBRLFromReais } from '../../utils/format';

export default function HomeScreen() {
  const router = useRouter();
  const favorites = useUserStore((s) => s.favorites);
  const history = useUserStore((s) => s.history);

  const recentTrimmed = history.slice(0, 3);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg.canvas }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 18,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Wordmark />
        </View>

        <View style={{ paddingHorizontal: 20, paddingBottom: 18 }}>
          <Text
            style={{
              fontFamily: fonts.sansBold,
              fontSize: 28,
              lineHeight: 32,
              color: colors.brand.navy,
              letterSpacing: -0.8,
              marginBottom: 6,
            }}
          >
            Qual veículo{'\n'}vamos analisar hoje?
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <HierarchicalSearchBar
            onExactSearch={(vehicleId) => router.push(`/vehicle/${vehicleId}`)}
            onBroadSearch={(brand, model) =>
              router.push({ pathname: '/model-results', params: { brand, model } })
            }
          />
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 28 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <SectionLabel>Favoritos</SectionLabel>
            <Text style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.text.secondary }}>
              {favorites.length}
            </Text>
          </View>
          {favorites.length === 0 ? (
            <Card style={{ padding: 16 }}>
              <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.text.secondary }}>
                Toque em qualquer veículo e marque com a estrela para vê-lo aqui.
              </Text>
            </Card>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {favorites.slice(0, 4).map((f) => (
                <FavoriteTile
                  key={f.vehicleId}
                  vehicleId={f.vehicleId}
                  name={f.vehicleName}
                  onPress={() => router.push(`/vehicle/${f.vehicleId}`)}
                />
              ))}
            </View>
          )}
        </View>

        {recentTrimmed.length > 0 && (
          <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            <View style={{ marginBottom: 10 }}>
              <SectionLabel>Buscas recentes</SectionLabel>
            </View>
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              {recentTrimmed.map((h, i) => (
                <Pressable
                  key={h.vehicleId}
                  onPress={() => router.push(`/vehicle/${h.vehicleId}`)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 14,
                    borderTopWidth: i > 0 ? 1 : 0,
                    borderTopColor: colors.divider,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor: colors.bg.elevated,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Feather name="clock" size={15} color={colors.text.secondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: fonts.sansSemibold,
                        fontSize: 14,
                        color: colors.text.primary,
                      }}
                    >
                      {h.vehicleName}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.sans,
                        fontSize: 11,
                        color: colors.text.secondary,
                        marginTop: 2,
                      }}
                    >
                      {new Date(h.viewedAt).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={colors.text.muted} />
                </Pressable>
              ))}
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const FavoriteTile: React.FC<{ vehicleId: string; name: string; onPress: () => void }> = ({
  vehicleId,
  name,
  onPress,
}) => {
  const vehicle = VehicleDataService.getVehicleById(vehicleId);
  const { price, loading } = useFipePrice(vehicle);
  const fipe = price?.valor ?? 0;
  const parts = name.split(' ');
  const brand = parts[0] ?? '';
  const rest = parts.slice(1).join(' ');

  return (
    <Card style={{ flexBasis: '48%', flexGrow: 1, padding: 12 }} onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
        }}
      >
        <Feather name="star" size={14} color={colors.brand.blue} />
        <Feather name="arrow-up-right" size={14} color={colors.text.muted} />
      </View>
      <Text
        style={{
          fontFamily: fonts.monoMedium,
          fontSize: 9,
          color: colors.text.secondary,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        {brand}
      </Text>
      <Text
        style={{
          fontFamily: fonts.sansSemibold,
          fontSize: 14,
          color: colors.brand.navy,
          letterSpacing: -0.3,
          lineHeight: 17,
        }}
      >
        {rest}
      </Text>
      <View
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderStyle: 'dashed',
          borderTopColor: colors.bg.border,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <Text
          style={{
            fontFamily: fonts.mono,
            fontSize: 9,
            color: colors.text.muted,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          FIPE
        </Text>
        <Text
          style={{
            fontFamily: fonts.monoSemibold,
            fontSize: 12,
            color: colors.text.primary,
          }}
        >
          {loading ? '...' : fipe ? fmtBRLFromReais(fipe) : 'Indisponível'}
        </Text>
      </View>
    </Card>
  );
};
