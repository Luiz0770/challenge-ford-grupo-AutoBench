import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryListView } from '../components/search/CategoryListView';
import { FipeLoadingOverlay } from '../components/ui/FipeLoadingOverlay';
import { colors } from '../constants/colors';
import { useFipeReady } from '../hooks/useFipeReady';
import { CatalogService } from '../services/catalog';
import { VehicleDataService } from '../services/vehicleData';

// Aberta a partir da Início (atalhos de necessidade e carrossel de categorias):
// tela própria na pilha para que "voltar" retorne à Início, não à aba Busca.
export default function CategoryResultsScreen() {
  const router = useRouter();
  const { categoria } = useLocalSearchParams<{ categoria: string }>();

  const category = useMemo(() => CatalogService.getCategoryById(categoria ?? ''), [categoria]);

  const fipeReady = useFipeReady(
    category
      ? CatalogService.getCategoryVehicles(category.id).map((v) => VehicleDataService.getVehicleById(v.vehicleId))
      : []
  );

  if (!category) {
    return <View style={{ flex: 1, backgroundColor: colors.bg.canvas }} />;
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.bg.canvas }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <CategoryListView
          category={category}
          onBack={() => router.back()}
          onSelect={(vehicleId) => router.push(`/vehicle/${vehicleId}`)}
        />
      </ScrollView>

      <FipeLoadingOverlay visible={!fipeReady} />
    </SafeAreaView>
  );
}
