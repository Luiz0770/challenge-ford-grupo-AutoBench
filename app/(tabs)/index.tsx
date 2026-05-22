import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandSelector } from '../../components/search/BrandSelector';
import { ModelSelector } from '../../components/search/ModelSelector';
import { VersionCard } from '../../components/vehicle/VersionCard';
import { colors } from '../../constants/colors';
import { VehicleDataService } from '../../services/vehicleData';
import { useSearchStore } from '../../store/searchStore';
import type { FipeBrand, FipeModel } from '../../types';

type Step = 'brand' | 'model' | 'versions';

export default function HomeScreen() {
  const router = useRouter();
  const {
    selectedBrandCode,
    selectedBrandName,
    selectedModelCode,
    selectedModelName,
    setSelectedBrand,
    setSelectedModel,
    reset,
  } = useSearchStore();

  const currentStep: Step =
    !selectedBrandCode ? 'brand' : !selectedModelCode ? 'model' : 'versions';

  const versions =
    currentStep === 'versions' && selectedBrandCode && selectedModelCode
      ? VehicleDataService.searchByBrandModelFipeCodes(
          selectedBrandCode,
          String(selectedModelCode)
        )
      : [];

  const handleSelectBrand = (brand: FipeBrand) =>
    setSelectedBrand(brand.codigo, brand.nome);

  const handleSelectModel = (model: FipeModel) =>
    setSelectedModel(model.codigo, model.nome);

  const handleBackFromModel = () => {
    setSelectedBrand(selectedBrandCode!, selectedBrandName!);
  };

  const stepTitle: Record<Step, string> = {
    brand: 'Selecione a Marca',
    model: `Modelos · ${selectedBrandName ?? ''}`,
    versions: `${selectedBrandName ?? ''} ${selectedModelName ?? ''}`,
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{ flex: 1, backgroundColor: colors.bg.primary }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 12,
          gap: 12,
        }}
      >
        {currentStep !== 'brand' && (
          <Pressable
            onPress={currentStep === 'model' ? reset : handleBackFromModel}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
          </Pressable>
        )}
        <Text
          style={{
            color: colors.text.primary,
            fontSize: 20,
            fontWeight: '700',
            flex: 1,
          }}
        >
          {stepTitle[currentStep]}
        </Text>
        {currentStep !== 'brand' && (
          <Pressable onPress={reset} hitSlop={8}>
            <Ionicons name="close-circle" size={22} color={colors.text.muted} />
          </Pressable>
        )}
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {currentStep === 'brand' && <BrandSelector onSelect={handleSelectBrand} />}
        {currentStep === 'model' && (
          <ModelSelector
            brandCode={selectedBrandCode!}
            onSelect={handleSelectModel}
          />
        )}
        {currentStep === 'versions' && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {versions.length > 0 ? (
              versions.map((v) => (
                <VersionCard
                  key={v.id}
                  vehicle={v}
                  onPress={() => router.push(`/vehicle/${v.id}`)}
                />
              ))
            ) : (
              <View style={{ alignItems: 'center', marginTop: 60 }}>
                <Ionicons name="car-outline" size={48} color={colors.text.muted} />
                <Text
                  style={{
                    color: colors.text.muted,
                    fontSize: 15,
                    marginTop: 12,
                    textAlign: 'center',
                    lineHeight: 22,
                  }}
                >
                  Versões detalhadas não disponíveis para este modelo.{'\n'}
                  Tente: Ford → Ranger para ver a demonstração.
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
