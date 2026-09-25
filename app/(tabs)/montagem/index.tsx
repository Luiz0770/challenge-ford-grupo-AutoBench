import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform as RNPlatform, ScrollView, View } from 'react-native';
import { VehiclePickerSheet } from '../../../components/compare/VehiclePickerSheet';
import { BuildHero } from '../../../components/build/BuildHero';
import { PlatformSheet } from '../../../components/build/PlatformSheet';
import { SavedBuildsList } from '../../../components/build/SavedBuildsList';
import { StartCard } from '../../../components/build/StartCard';
import { Rise } from '../../../components/ui/Rise';
import { SectionLabel } from '../../../components/ui/SectionLabel';
import { Toast } from '../../../components/ui/Toast';
import { SYSTEMS } from '../../../constants/build';
import { colors } from '../../../constants/colors';
import { BuildService } from '../../../services/build';
import { VehicleDataService } from '../../../services/vehicleData';
import { useBuildStore } from '../../../store/buildStore';
import type { Build, CategoryVehicleEntry, Platform } from '../../../types';

type Sheet = 'base' | 'zero' | null;

export default function MontagemScreen() {
  const router = useRouter();
  const builds = useBuildStore((s) => s.builds);
  const notice = useBuildStore((s) => s.notice);
  const startDraft = useBuildStore((s) => s.startDraft);
  const openBuild = useBuildStore((s) => s.openBuild);
  const deleteBuild = useBuildStore((s) => s.deleteBuild);
  const clearNotice = useBuildStore((s) => s.clearNotice);

  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Aviso emitido pelo store ao salvar no builder → vira toast local
  useEffect(() => {
    if (notice) {
      setToast(notice);
      clearNotice();
    }
  }, [notice, clearNotice]);

  const hideToast = useCallback(() => setToast(null), []);

  const totals = VehicleDataService.getTotals();

  // iOS ignora navegação enquanto o Modal ainda está fechando
  const openEditor = () => {
    if (RNPlatform.OS === 'ios') setTimeout(() => router.push('/montagem/editar'), 350);
    else router.push('/montagem/editar');
  };

  const handlePickBase = (entry: CategoryVehicleEntry) => {
    const build = BuildService.createFromBase(entry.vehicleId);
    if (!build) return;
    setSheet(null);
    startDraft(build);
    openEditor();
  };

  const handleFromScratch = (platform: Platform) => {
    setSheet(null);
    startDraft(BuildService.createFromScratch(platform));
    openEditor();
  };

  const handleOpenSaved = (build: Build) => {
    openBuild(build.id);
    router.push('/montagem/editar');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.canvas }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <BuildHero
          eyebrow="Montagem"
          title={'Monte ou modifique\nseu veículo'}
          sub={`Combine peças de ${totals.vehicles} veículos do catálogo em ${SYSTEMS.length} sistemas.`}
          bottomPad={64}
        />

        <View style={{ paddingHorizontal: 16, marginTop: -38, gap: 10 }}>
          <StartCard
            title="Modificar um veículo"
            desc="Parta de um modelo existente e troque as peças que quiser."
            icon={<Feather name="truck" size={20} color={colors.text.inverse} />}
            gradient={[colors.brand.navy, colors.brand.mid]}
            delay={80}
            onPress={() => setSheet('base')}
          />
          <StartCard
            title="Criar do zero"
            desc="Escolha a plataforma e defina cada sistema, peça por peça."
            icon={<Feather name="plus" size={20} color={colors.text.inverse} />}
            gradient={[colors.brand.bright, colors.brand.cyan]}
            delay={140}
            onPress={() => setSheet('zero')}
          />
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 28 }}>
          <Rise delay={200} style={{ marginBottom: 10 }}>
            <SectionLabel>Minhas montagens</SectionLabel>
          </Rise>
          <SavedBuildsList builds={builds} onOpen={handleOpenSaved} onDelete={deleteBuild} />
        </View>
      </ScrollView>

      <VehiclePickerSheet
        open={sheet === 'base'}
        eyebrow="Modificar · veículo base"
        accent={{ color: colors.brand.bright, bg: 'rgba(0,102,255,0.08)' }}
        onClose={() => setSheet(null)}
        onPick={handlePickBase}
      />
      <PlatformSheet open={sheet === 'zero'} onClose={() => setSheet(null)} onStart={handleFromScratch} />

      <Toast message={toast} onHide={hideToast} />
    </View>
  );
}
