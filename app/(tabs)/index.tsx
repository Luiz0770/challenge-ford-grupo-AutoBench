import { useIsFocused, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Database } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { BrandGrid } from '../../components/home/BrandGrid';
import { CategoryCarousel } from '../../components/home/CategoryCarousel';
import { FavoritesSection } from '../../components/home/FavoritesSection';
import { HomeHero } from '../../components/home/HomeHero';
import { OracleInsightCard } from '../../components/home/OracleInsightCard';
import { PersonaShortcuts } from '../../components/home/PersonaShortcuts';
import { RecentSearches } from '../../components/home/RecentSearches';
import { TrendingList } from '../../components/home/TrendingList';
import { HierarchicalSearchBar } from '../../components/search/HierarchicalSearchBar';
import { FipeLoadingOverlay } from '../../components/ui/FipeLoadingOverlay';
import { Rise } from '../../components/ui/Rise';
import { colors } from '../../constants/colors';
import { CatalogService } from '../../services/catalog';
import { VehicleDataService } from '../../services/vehicleData';
import { useUserStore } from '../../store/userStore';
import { useFipeReady } from '../../hooks/useFipeReady';
import { useScrollToTopOnFocus } from '../../hooks/useScrollToTopOnFocus';

export default function HomeScreen() {
  const scrollRef = useScrollToTopOnFocus();
  const router = useRouter();
  const isFocused = useIsFocused();
  const favorites = useUserStore((s) => s.favorites);
  const history = useUserStore((s) => s.history);

  const categories = useMemo(() => CatalogService.getAvailableCategories(), []);
  const trending = useMemo(() => VehicleDataService.getTopByAlert(4), []);
  const brands = useMemo(() => VehicleDataService.getBrands().slice(0, 8), []);
  const totals = useMemo(() => VehicleDataService.getTotals(), []);
  const dailyAlert = useMemo(() => VehicleDataService.getDailyAlertVehicle(), []);

  // Espera os preços FIPE dos cards visíveis (em alta + favoritos) antes de mostrar a home
  const fipeReady = useFipeReady([
    ...trending,
    ...favorites.slice(0, 4).map((f) => VehicleDataService.getVehicleById(f.vehicleId)),
  ]);

  const openVehicle = (vehicleId: string) => router.push(`/vehicle/${vehicleId}`);
  const openCategory = (categoryId: string) =>
    router.push({ pathname: '/category-results', params: { categoria: categoryId } });
  const openBrand = (brand: string) =>
    router.push({ pathname: '/brand-results', params: { brand } });

  return (
    <View className="flex-1 bg-paper">
      {/* Hero escuro: texto da status bar claro só enquanto a home está em foco */}
      {isFocused && <StatusBar style="light" />}

      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <HomeHero />

        {/* Busca flutuando sobre o hero */}
        <Rise delay={140} className="relative z-10 -mt-[34px] px-5">
          <HierarchicalSearchBar
            floating
            onExactSearch={openVehicle}
            onBroadSearch={(brand, model, version, year) =>
              router.push({
                pathname: '/model-results',
                params: {
                  brand,
                  model,
                  ...(version ? { version } : {}),
                  ...(year != null ? { year: String(year) } : {}),
                },
              })
            }
          />
        </Rise>

        <PersonaShortcuts onSelectCategory={openCategory} />

        {dailyAlert && (
          <OracleInsightCard vehicle={dailyAlert} onPress={() => openVehicle(dailyAlert.id)} />
        )}

        <CategoryCarousel
          categories={categories.slice(0, 8)}
          onSelect={openCategory}
          onSeeAll={() => router.navigate('/busca')}
        />

        <TrendingList vehicles={trending} categories={categories} onSelect={openVehicle} />

        <BrandGrid brands={brands} onSelectBrand={openBrand} />

        <FavoritesSection favorites={favorites} onSelect={openVehicle} />

        <RecentSearches history={history.slice(0, 3)} onSelect={openVehicle} />

        <View className="flex-row items-center gap-2 px-5 pt-7">
          <Database size={11} color={colors.text.muted} strokeWidth={2.2} />
          <Text className="font-mono text-[9.5px] tracking-[0.4px] text-ink-400">
            {totals.vehicles} veículos · {totals.brands} marcas · FIPE
          </Text>
        </View>
      </ScrollView>

      <FipeLoadingOverlay visible={!fipeReady} />
    </View>
  );
}
