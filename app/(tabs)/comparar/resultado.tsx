import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { CompareMatrix } from '../../../components/compare/CompareMatrix';
import { ResultHeader } from '../../../components/compare/ResultHeader';
import { VehiclePickerSheet } from '../../../components/compare/VehiclePickerSheet';
import { VehicleSlot } from '../../../components/compare/VehicleSlot';
import { VerdictCard } from '../../../components/compare/VerdictCard';
import { VsBadge } from '../../../components/compare/VsBadge';
import { FipeLoadingOverlay } from '../../../components/ui/FipeLoadingOverlay';
import { Rise } from '../../../components/ui/Rise';
import { SectionLabel } from '../../../components/ui/SectionLabel';
import { colors, fonts } from '../../../constants/colors';
import type { CompareSide } from '../../../constants/compare';
import { useFipePrice } from '../../../hooks/useFipePrice';
import { CatalogService } from '../../../services/catalog';
import { VehicleDataService } from '../../../services/vehicleData';
import type { CategoryVehicleEntry, CompareCategoryId } from '../../../types';
import { useScrollToTopOnFocus } from '../../../hooks/useScrollToTopOnFocus';

const CATEGORY_TABS: {
  id: CompareCategoryId;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { id: 'motorizacao', label: 'Motorização', icon: 'activity' },
  { id: 'dimensoes', label: 'Dimensões', icon: 'maximize-2' },
  { id: 'tecnologia', label: 'Tecnologia', icon: 'cpu' },
  { id: 'seguranca', label: 'Segurança', icon: 'shield' },
];

export default function CompareResultScreen() {
  const scrollRef = useScrollToTopOnFocus();
  const router = useRouter();
  const params = useLocalSearchParams<{ a?: string; b?: string }>();
  const [cat, setCat] = useState<CompareCategoryId>('motorizacao');
  const [swap, setSwap] = useState<CompareSide | null>(null);

  const a = useMemo(() => (params.a ? VehicleDataService.getVehicleById(params.a) : null), [params.a]);
  const b = useMemo(() => (params.b ? VehicleDataService.getVehicleById(params.b) : null), [params.b]);
  const invalid = !a || !b;

  // Ids inválidos ou ausentes: volta ao setup
  useEffect(() => {
    if (invalid) router.replace('/comparar');
  }, [invalid, router]);

  const verdict = useMemo(() => (a && b ? CatalogService.getCompareVerdict(a, b) : null), [a, b]);
  const rows = useMemo(() => CatalogService.buildCompareRows(cat, a, b), [cat, a, b]);

  const { price: aPrice, loading: aLoading } = useFipePrice(a);
  const { price: bPrice, loading: bLoading } = useFipePrice(b);

  if (!a || !b || !verdict) return null;

  const handlePick = (entry: CategoryVehicleEntry) => {
    router.setParams(swap === 'a' ? { a: entry.vehicleId } : { b: entry.vehicleId });
    setSwap(null);
  };

  const backToSetup = () => router.dismissTo('/comparar');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.canvas }}>
      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <ResultHeader onBack={backToSetup} onNew={backToSetup} />

        {/* Slots sobrepostos ao header */}
        <View style={{ paddingHorizontal: 16, marginTop: -12, flexDirection: 'row', gap: 8, alignItems: 'stretch' }}>
          <VehicleSlot
            vehicle={a}
            side="a"
            delay={120}
            onSwap={() => setSwap('a')}
            fipeAvg={aPrice?.valor}
            fipeLoading={aLoading}
          />
          <VehicleSlot
            vehicle={b}
            side="b"
            delay={200}
            onSwap={() => setSwap('b')}
            fipeAvg={bPrice?.valor}
            fipeLoading={bLoading}
          />
          <VsBadge variant="light" />
        </View>

        {/* Veredito do Oráculo */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
              paddingHorizontal: 4,
            }}
          >
            <SectionLabel>Veredito do Oráculo</SectionLabel>
            <Text style={{ fontFamily: fonts.monoSemibold, fontSize: 9.5, color: colors.brand.blue }}>BETA</Text>
          </View>
          <Rise delay={320}>
            <VerdictCard verdict={verdict} />
          </Rise>
        </View>

        {/* Matriz comparativa */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
              paddingHorizontal: 4,
            }}
          >
            <SectionLabel>Matriz comparativa</SectionLabel>
            <Text style={{ fontFamily: fonts.mono, fontSize: 9.5, color: colors.text.muted }}>Determinístico</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6, paddingBottom: 12 }}
          >
            {CATEGORY_TABS.map((c) => {
              const isActive = c.id === cat;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setCat(c.id)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 10,
                      backgroundColor: isActive ? colors.brand.navy : colors.bg.surface,
                      borderWidth: 1,
                      borderColor: isActive ? colors.brand.navy : colors.bg.borderStrong,
                    }}
                  >
                    <Feather name={c.icon} size={13} color={isActive ? colors.bg.surface : colors.text.secondary} />
                    <Text
                      style={{
                        fontFamily: fonts.sansMedium,
                        fontSize: 12.5,
                        color: isActive ? colors.bg.surface : colors.text.primary,
                      }}
                    >
                      {c.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <CompareMatrix
            key={cat}
            rows={rows}
            aLabel={`${a.brand} ${a.model}`}
            bLabel={`${b.brand} ${b.model}`}
          />
        </View>

        {/* Rodapé técnico */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Feather name="activity" size={11} color={colors.text.muted} />
          <Text style={{ fontFamily: fonts.mono, fontSize: 9.5, color: colors.text.muted, letterSpacing: 0.4 }}>
            Análise cruzada · {CATEGORY_TABS.length} categorias · {rows.length} atributos
          </Text>
        </View>
      </ScrollView>

      <FipeLoadingOverlay visible={aLoading || bLoading} />

      <VehiclePickerSheet
        open={!!swap}
        side={swap}
        excludedId={swap === 'a' ? b.id : a.id}
        onClose={() => setSwap(null)}
        onPick={handlePick}
      />
    </View>
  );
}
