import { Feather } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { BuildHero, heroPill } from '../../../components/build/BuildHero';
import { BuildProgress } from '../../../components/build/BuildProgress';
import { PartPickerSheet } from '../../../components/build/PartPickerSheet';
import { StatusBadge } from '../../../components/build/StatusBadge';
import { SystemRow } from '../../../components/build/SystemRow';
import { Rise } from '../../../components/ui/Rise';
import { SectionLabel } from '../../../components/ui/SectionLabel';
import { SYSTEMS, platformLabel } from '../../../constants/build';
import { colors, fonts } from '../../../constants/colors';
import { BuildService } from '../../../services/build';
import { useBuildStore } from '../../../store/buildStore';
import type { SystemId } from '../../../types';
import { useScrollToTopOnFocus } from '../../../hooks/useScrollToTopOnFocus';

export default function EditarMontagemScreen() {
  const scrollRef = useScrollToTopOnFocus();
  const router = useRouter();
  const draft = useBuildStore((s) => s.draft);
  const setPart = useBuildStore((s) => s.setPart);
  const setName = useBuildStore((s) => s.setName);
  const restoreDraft = useBuildStore((s) => s.restoreDraft);
  const discardDraft = useBuildStore((s) => s.discardDraft);
  const saveDraft = useBuildStore((s) => s.saveDraft);

  const [sysId, setSysId] = useState<SystemId | null>(null);
  const leaving = useRef(false);
  const lastDraft = useRef(draft);
  if (draft) lastDraft.current = draft;
  // Ao sair, mantém o último rascunho na tela durante a transição.
  const view = draft ?? (leaving.current ? lastDraft.current : null);

  const summary = useMemo(() => (view ? BuildService.summarize(view) : null), [view]);

  // Sem rascunho (ex.: recarga do app): volta para a tela inicial.
  // Ao sair de propósito o rascunho some da store, mas não redireciona durante a transição de volta.
  if (!view || !summary) return leaving.current ? null : <Redirect href="/montagem" />;

  const base = view.baseId ? BuildService.getBase(view.baseId) : null;
  const hasBase = !!base;
  const system = SYSTEMS.find((s) => s.id === sysId) ?? null;
  const missing = summary.total - summary.defined;

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/montagem');
  };

  const handleBack = () => {
    leaving.current = true;
    discardDraft();
    goBack();
  };

  const handleSave = () => {
    leaving.current = true;
    saveDraft();
    goBack();
  };

  const handlePick = (key: string) => {
    if (sysId) setPart(sysId, key);
    setSysId(null);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: colors.bg.canvas }}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <BuildHero
            onBack={handleBack}
            right={
              <Pressable onPress={restoreDraft} accessibilityRole="button">
                {({ pressed }) => (
                  <View style={[heroPill, { opacity: pressed ? 0.7 : 1 }]}>
                    <Text style={{ fontFamily: fonts.sansMedium, fontSize: 12, color: colors.text.inverse }}>
                      {hasBase ? 'Restaurar original' : 'Limpar'}
                    </Text>
                  </View>
                )}
              </Pressable>
            }
            eyebrow={
              base
                ? `Base · ${base.brand} ${base.model} ${base.year}`
                : `Do zero · ${platformLabel(view.platform)}`
            }
            title={hasBase ? 'Modificar peças' : 'Montar do zero'}
            bottomPad={56}
          />

          <Rise
            delay={60}
            style={{
              marginHorizontal: 16,
              marginTop: -36,
              padding: 14,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.bg.border,
              backgroundColor: colors.bg.surface,
              shadowColor: '#001A4D',
              shadowOpacity: 0.1,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 6 },
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 9,
                color: colors.text.secondary,
                letterSpacing: 1.4,
                textTransform: 'uppercase',
              }}
            >
              Nome da montagem
            </Text>
            <TextInput
              value={view.name}
              onChangeText={setName}
              placeholder="Minha montagem"
              placeholderTextColor={colors.text.muted}
              maxLength={40}
              style={{
                marginTop: 4,
                paddingTop: 4,
                paddingBottom: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.bg.borderStrong,
                fontFamily: fonts.sansBold,
                fontSize: 17,
                color: colors.brand.navy,
                letterSpacing: -0.3,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 12,
              }}
            >
              <Text style={{ fontFamily: fonts.sansMedium, fontSize: 12.5, color: colors.text.primary }}>
                {summary.defined} de {summary.total} sistemas definidos
              </Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {hasBase && (
                  <StatusBadge
                    tone="swap"
                    label={`${summary.swaps} ${summary.swaps === 1 ? 'trocada' : 'trocadas'}`}
                  />
                )}
                {summary.adapts > 0 && <StatusBadge tone="adapt" label={`${summary.adapts} adaptação`} />}
              </View>
            </View>
            <BuildProgress segments={SYSTEMS.map((s) => BuildService.getStatus(view, s.id))} />
          </Rise>

          <View style={{ paddingHorizontal: 16, paddingTop: 22 }}>
            <View style={{ marginBottom: 10 }}>
              <SectionLabel>Sistemas do veículo</SectionLabel>
            </View>
            <View
              style={{
                borderRadius: 14,
                borderWidth: 1,
                borderColor: colors.bg.border,
                backgroundColor: colors.bg.surface,
                overflow: 'hidden',
              }}
            >
              {SYSTEMS.map((s, i) => {
                const part = BuildService.getPart(view.parts[s.id]);
                return (
                  <SystemRow
                    key={s.id}
                    system={s}
                    part={part}
                    status={part ? BuildService.getPartStatus(view, part) : null}
                    hasBase={hasBase}
                    origin={part ? BuildService.describeOrigin(part, view.baseId).label : null}
                    index={i}
                    onPress={() => setSysId(s.id)}
                  />
                );
              })}
            </View>
          </View>

          <View style={{ paddingHorizontal: 16, paddingTop: 18 }}>
            <Pressable
              disabled={!summary.complete}
              onPress={handleSave}
              accessibilityRole="button"
              accessibilityState={{ disabled: !summary.complete }}
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
                    backgroundColor: summary.complete ? colors.brand.bright : '#E2E6EB',
                    transform: [{ scale: summary.complete && pressed ? 0.985 : 1 }],
                    ...(summary.complete && {
                      shadowColor: colors.brand.bright,
                      shadowOpacity: 0.3,
                      shadowRadius: 20,
                      shadowOffset: { width: 0, height: 8 },
                      elevation: 6,
                    }),
                  }}
                >
                  {summary.complete && <Feather name="check" size={16} color={colors.text.inverse} />}
                  <Text
                    style={{
                      fontFamily: fonts.sansSemibold,
                      fontSize: 15,
                      color: summary.complete ? colors.text.inverse : '#8A939C',
                    }}
                  >
                    {summary.complete
                      ? 'Salvar montagem'
                      : `Faltam ${missing} ${missing === 1 ? 'sistema' : 'sistemas'}`}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </ScrollView>

        <PartPickerSheet system={system} build={view} onClose={() => setSysId(null)} onPick={handlePick} />
      </View>
    </KeyboardAvoidingView>
  );
}
