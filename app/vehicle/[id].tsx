import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FavoriteButton } from '../../components/vehicle/FavoriteButton';
import { PredictiveAlertCard } from '../../components/vehicle/PredictiveAlertCard';
import { SpecSection } from '../../components/vehicle/SpecSection';
import { colors } from '../../constants/colors';
import { useVehicle } from '../../hooks/useVehicle';

const formatPrice = (cents: number): string =>
  `R$ ${(cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vehicleId = Array.isArray(id) ? id[0] : id;
  const { vehicle, isFavorite, toggleFavorite } = useVehicle(vehicleId ?? '');
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (vehicle) {
      navigation.setOptions({
        title: `${vehicle.brand} ${vehicle.model} ${vehicle.version}`,
        headerRight: () => (
          <FavoriteButton isFavorite={isFavorite} onToggle={toggleFavorite} />
        ),
      });
    }
  }, [vehicle, isFavorite, toggleFavorite]);

  if (!vehicle) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg.primary,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: colors.text.muted }}>Veículo não encontrado.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: colors.text.secondary, fontSize: 13, marginBottom: 4 }}>
            {vehicle.brand} {vehicle.model} • {vehicle.year}
          </Text>
          <Text style={{ color: colors.text.primary, fontSize: 28, fontWeight: '800' }}>
            {vehicle.version}
          </Text>
          <Text
            style={{ color: colors.accent.amber, fontSize: 22, fontWeight: '700', marginTop: 4 }}
          >
            {formatPrice(vehicle.priceInCents)}
          </Text>
        </View>

        <PredictiveAlertCard alert={vehicle.alert} />

        {vehicle.sections.map((section) => (
          <SpecSection key={section.id} section={section} />
        ))}

        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <Text style={{ color: colors.text.muted, fontSize: 11 }}>
            Dados verificados · Oráculo Automotivo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
