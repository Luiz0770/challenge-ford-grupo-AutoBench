import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { DuelRow } from '../../../components/compare/DuelRow';
import { SETUP_HERO_OVERLAP, SetupHero } from '../../../components/compare/SetupHero';
import { SetupSlot } from '../../../components/compare/SetupSlot';
import { VehiclePickerSheet } from '../../../components/compare/VehiclePickerSheet';
import { VsBadge } from '../../../components/compare/VsBadge';
import { Rise } from '../../../components/ui/Rise';
import { SectionLabel } from '../../../components/ui/SectionLabel';
import { colors, fonts } from '../../../constants/colors';
import type { CompareSide } from '../../../constants/compare';
import { CatalogService } from '../../../services/catalog';
import type { CategoryVehicleEntry } from '../../../types';
import { useScrollToTopOnFocus } from '../../../hooks/useScrollToTopOnFocus';

export default function CompareSetupScreen() {
  const scrollRef = useScrollToTopOnFocus();
  const router = useRouter();
  const [a, setA] = useState<CategoryVehicleEntry | null>(null);
  const [b, setB] = useState<CategoryVehicleEntry | null>(null);
  const [picking, setPicking] = useState<CompareSide | null>(null);

  const duels = useMemo(() => CatalogService.getCompareDuels(), []);
  const ready = !!a && !!b;
  const step = !a ? 1 : 2;

  const handlePick = (entry: CategoryVehicleEntry) => {
    if (picking === 'a') setA(entry);
    else setB(entry);
    setPicking(null);
  };

  const handleCompare = () => {
    if (!a || !b) return;
    router.push({ pathname: '/comparar/resultado', params: { a: a.vehicleId, b: b.vehicleId } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.canvas }}>
      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <SetupHero step={step} />

        <View style={{ paddingHorizontal: 16, marginTop: -SETUP_HERO_OVERLAP, flexDirection: 'row', gap: 10 }}>
          <SetupSlot side="a" vehicle={a} delay={80} onOpen={() => setPicking('a')} onClear={() => setA(null)} />
          <SetupSlot side="b" vehicle={b} delay={140} onOpen={() => setPicking('b')} onClear={() => setB(null)} />
          <VsBadge variant="dark" />
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <Pressable
            disabled={!ready}
            onPress={handleCompare}
            accessibilityRole="button"
            accessibilityState={{ disabled: !ready }}
          >
            {({ pressed }) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  paddingVertical: 15,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: ready ? colors.brand.bright : '#E2E6EB',
                  transform: [{ scale: ready && pressed ? 0.985 : 1 }],
                  ...(ready && {
                    shadowColor: colors.brand.bright,
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 6,
                  }),
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.sansSemibold,
                    fontSize: 15,
                    letterSpacing: -0.2,
                    color: ready ? colors.text.inverse : '#8A939C',
                  }}
                >
                  {ready ? 'Comparar agora' : !a ? 'Escolha o veículo A' : 'Escolha o veículo B'}
                </Text>
                {ready && <Feather name="arrow-right" size={17} color={colors.text.inverse} />}
              </View>
            )}
          </Pressable>
        </View>

        {duels.length > 0 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 28 }}>
            <Rise delay={200} style={{ marginBottom: 10 }}>
              <SectionLabel>Duelos populares</SectionLabel>
            </Rise>
            <View style={{ gap: 8 }}>
              {duels.map(([x, y], i) => (
                <DuelRow
                  key={`${x.vehicleId}|${y.vehicleId}`}
                  a={x}
                  b={y}
                  delay={220 + i * 60}
                  onPress={() => {
                    setA(x);
                    setB(y);
                  }}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <VehiclePickerSheet
        open={!!picking}
        side={picking}
        excludedId={picking === 'a' ? b?.vehicleId : a?.vehicleId}
        onClose={() => setPicking(null)}
        onPick={handlePick}
      />
    </View>
  );
}
