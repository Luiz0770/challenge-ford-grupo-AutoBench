import { Feather } from '@expo/vector-icons';
import { Car } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, fonts } from '../../constants/colors';
import { SIDE, type CompareSide } from '../../constants/compare';
import { CatalogService } from '../../services/catalog';
import { VehicleDataService } from '../../services/vehicleData';
import type { CategoryVehicleEntry } from '../../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientFill } from '../ui/GradientFill';

type Mode = 'brand' | 'cat';

interface VehiclePickerSheetProps {
  open: boolean;
  side?: CompareSide | null;
  // Sobrescreve o rótulo "Veículo A/B" do cabeçalho (uso fora do Comparar)
  eyebrow?: string;
  // Sobrescreve a cor do lado A/B (uso fora do Comparar)
  accent?: { color: string; bg: string };
  // Veículo já escolhido no outro slot (aparece desabilitado)
  excludedId?: string;
  onClose: () => void;
  onPick: (entry: CategoryVehicleEntry) => void;
}

const byName = (x: CategoryVehicleEntry, y: CategoryVehicleEntry) =>
  `${x.brand} ${x.model} ${x.version}`.localeCompare(`${y.brand} ${y.model} ${y.version}`, 'pt-BR');

// Grade em linhas com colunas flex:1 (largura em % + gap + flexGrow quebra no Android)
const chunk = <T,>(items: T[], size: number): (T | null)[][] => {
  const rows: (T | null)[][] = [];
  for (let i = 0; i < items.length; i += size) {
    const row: (T | null)[] = items.slice(i, i + size);
    while (row.length < size) row.push(null);
    rows.push(row);
  }
  return rows;
};

const circleButton = {
  width: 32,
  height: 32,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: colors.bg.borderStrong,
  backgroundColor: colors.bg.surface,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

export const VehiclePickerSheet: React.FC<VehiclePickerSheetProps> = ({
  open,
  side,
  eyebrow,
  accent,
  excludedId,
  onClose,
  onPick,
}) => {
  const [q, setQ] = useState('');
  const [mode, setMode] = useState<Mode>('brand');
  const [group, setGroup] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (open) {
      setQ('');
      setMode('brand');
      setGroup(null);
    }
  }, [open]);

  const s = accent ? { ...SIDE.a, ...accent } : SIDE[side ?? 'a'];
  const searching = q.trim().length > 0;

  const brands = useMemo(
    () => [...VehicleDataService.getBrands()].sort((x, y) => x.name.localeCompare(y.name, 'pt-BR')),
    [],
  );
  const categories = useMemo(() => CatalogService.getAvailableCategories(), []);

  const results = useMemo(() => VehicleDataService.searchVehicles(q), [q]);
  const groupList = useMemo(() => {
    if (!group) return [];
    const list =
      mode === 'brand' ? VehicleDataService.getByBrand(group) : CatalogService.getCategoryVehicles(group);
    return [...list].sort(byName);
  }, [group, mode]);

  const groupTitle = group
    ? mode === 'brand'
      ? group
      : (categories.find((c) => c.id === group)?.label ?? group)
    : 'Escolher veículo';

  const categoryLabelOf = (vehicleId: string) => {
    const id = VehicleDataService.getCategoryIdOf(vehicleId);
    return categories.find((c) => c.id === id)?.label;
  };

  const renderRow = (entry: CategoryVehicleEntry, sub?: string) => (
    <PickerRow
      key={entry.vehicleId}
      entry={entry}
      sub={sub}
      color={s.color}
      bg={s.bg}
      disabled={entry.vehicleId === excludedId}
      onPick={() => onPick(entry)}
    />
  );

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      // Android: sem isto o Modal para abaixo da status bar e acima da barra de
      // navegação, e o fundo escurecido não cobre a tela inteira
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1, justifyContent: 'flex-end' }}
      >
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,28,70,0.42)',
          }}
          onPress={onClose}
        />
        <View
          style={{
            height: '80%',
            backgroundColor: colors.bg.surface,
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            paddingTop: 12,
            paddingBottom: Math.max(30, insets.bottom + 12),
          }}
        >
          <View
            style={{
              width: 36,
              height: 4,
              borderRadius: 4,
              backgroundColor: colors.bg.borderStrong,
              alignSelf: 'center',
              marginBottom: 14,
            }}
          />

          {/* Cabeçalho */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {group && !searching && (
              <Pressable onPress={() => setGroup(null)} accessibilityLabel="Voltar">
                {({ pressed }) => (
                  <View style={[circleButton, { opacity: pressed ? 0.7 : 1 }]}>
                    <Feather name="chevron-left" size={15} color={colors.brand.navy} />
                  </View>
                )}
              </Pressable>
            )}
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={{
                  fontFamily: fonts.monoBold,
                  fontSize: 9,
                  color: s.color,
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                  marginBottom: 2,
                }}
              >
                {eyebrow ?? `Veículo ${s.label}`}
                {group && !searching ? (mode === 'brand' ? ' · Marca' : ' · Categoria') : ''}
              </Text>
              <Text
                numberOfLines={1}
                style={{ fontFamily: fonts.sansBold, fontSize: 17, color: colors.brand.navy, letterSpacing: -0.4 }}
              >
                {searching ? 'Resultados da busca' : groupTitle}
              </Text>
            </View>
            <Pressable onPress={onClose} accessibilityLabel="Fechar">
              {({ pressed }) => (
                <View style={[circleButton, { opacity: pressed ? 0.7 : 1 }]}>
                  <Feather name="x" size={14} color={colors.text.secondary} />
                </View>
              )}
            </Pressable>
          </View>

          {/* Busca */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 12,
                borderRadius: 10,
                backgroundColor: colors.bg.canvas,
                borderWidth: 1,
                borderColor: colors.bg.borderStrong,
              }}
            >
              <Feather name="search" size={16} color={colors.brand.navy} />
              <TextInput
                value={q}
                onChangeText={setQ}
                placeholder="Buscar em todos os veículos"
                placeholderTextColor={colors.text.muted}
                autoCorrect={false}
                style={{
                  flex: 1,
                  minWidth: 0,
                  paddingVertical: 10,
                  fontFamily: fonts.sans,
                  fontSize: 14,
                  color: colors.text.primary,
                }}
              />
              {searching && (
                <Pressable onPress={() => setQ('')} hitSlop={8} accessibilityLabel="Limpar busca">
                  <Feather name="x" size={14} color={colors.text.secondary} />
                </Pressable>
              )}
            </View>
          </View>

          {/* Por marca / Por categoria */}
          {!searching && !group && (
            <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
              <View style={{ flexDirection: 'row', padding: 3, borderRadius: 10, backgroundColor: colors.bg.elevated }}>
                {(
                  [
                    ['brand', 'Por marca'],
                    ['cat', 'Por categoria'],
                  ] as const
                ).map(([id, label]) => {
                  const active = mode === id;
                  return (
                    <Pressable
                      key={id}
                      onPress={() => setMode(id)}
                      style={{
                        flex: 1,
                        paddingVertical: 8,
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: active ? colors.bg.surface : 'transparent',
                        ...(active && {
                          shadowColor: '#101828',
                          shadowOpacity: 0.1,
                          shadowRadius: 3,
                          shadowOffset: { width: 0, height: 1 },
                          elevation: 1,
                        }),
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.sansSemibold,
                          fontSize: 13,
                          color: active ? colors.brand.navy : colors.text.secondary,
                        }}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 8 }}
          >
            {searching ? (
              results.length ? (
                results.map((e) => renderRow(e))
              ) : (
                <Text
                  style={{
                    paddingVertical: 24,
                    textAlign: 'center',
                    fontFamily: fonts.sans,
                    fontSize: 13,
                    color: colors.text.secondary,
                  }}
                >
                  Nenhum veículo encontrado.
                </Text>
              )
            ) : group ? (
              <>
                <Text
                  style={{
                    paddingHorizontal: 8,
                    paddingBottom: 6,
                    fontFamily: fonts.mono,
                    fontSize: 10,
                    color: colors.text.secondary,
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                  }}
                >
                  {groupList.length} {groupList.length === 1 ? 'veículo' : 'veículos'}
                </Text>
                {groupList.map((e) => renderRow(e, mode === 'brand' ? categoryLabelOf(e.vehicleId) : undefined))}
              </>
            ) : mode === 'brand' ? (
              <View style={{ gap: 8, paddingHorizontal: 8 }}>
                {chunk(brands, 3).map((row, ri) => (
                  <View key={ri} style={{ flexDirection: 'row', gap: 8 }}>
                    {row.map((b, ci) =>
                      b ? (
                        <Pressable
                          key={b.name}
                          onPress={() => setGroup(b.name)}
                          accessibilityLabel={`${b.name}, ${b.count} modelos`}
                          style={{ flex: 1 }}
                        >
                          {({ pressed }) => (
                            <View
                              style={{
                                alignItems: 'center',
                                gap: 6,
                                paddingTop: 12,
                                paddingBottom: 10,
                                paddingHorizontal: 6,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: colors.bg.border,
                                backgroundColor: colors.bg.surface,
                                transform: [{ scale: pressed ? 0.985 : 1 }],
                              }}
                            >
                              <View
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 18,
                                  overflow: 'hidden',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <GradientFill
                                  angle={135}
                                  stops={[
                                    { color: colors.brand.deep, offset: 0 },
                                    { color: colors.brand.mid, offset: 1 },
                                  ]}
                                />
                                <Text style={{ fontFamily: fonts.sansBold, fontSize: 12, color: colors.text.inverse }}>
                                  {b.name.slice(0, 2).toUpperCase()}
                                </Text>
                              </View>
                              <Text
                                numberOfLines={1}
                                style={{ fontFamily: fonts.sansSemibold, fontSize: 12, color: colors.brand.navy }}
                              >
                                {b.name}
                              </Text>
                              <Text style={{ fontFamily: fonts.mono, fontSize: 9.5, color: colors.text.secondary }}>
                                {b.count} {b.count === 1 ? 'modelo' : 'modelos'}
                              </Text>
                            </View>
                          )}
                        </Pressable>
                      ) : (
                        <View key={`empty-${ci}`} style={{ flex: 1 }} />
                      ),
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ gap: 8, paddingHorizontal: 8 }}>
                {chunk(categories, 2).map((row, ri) => (
                  <View key={ri} style={{ flexDirection: 'row', gap: 8 }}>
                    {row.map((c, ci) =>
                      c ? (
                        <Pressable
                          key={c.id}
                          onPress={() => setGroup(c.id)}
                          accessibilityLabel={`${c.label}, ${c.count} modelos`}
                          style={{ flex: 1 }}
                        >
                          {({ pressed }) => (
                            <View
                              style={{
                                height: 84,
                                borderRadius: 12,
                                padding: 12,
                                backgroundColor: c.color,
                                justifyContent: 'space-between',
                                transform: [{ scale: pressed ? 0.985 : 1 }],
                              }}
                            >
                              <View
                                style={{
                                  alignSelf: 'flex-start',
                                  paddingHorizontal: 6,
                                  paddingVertical: 2,
                                  borderRadius: 4,
                                  backgroundColor: 'rgba(255,255,255,0.16)',
                                }}
                              >
                                <Text
                                  style={{ fontFamily: fonts.monoBold, fontSize: 9, color: c.accent, letterSpacing: 1.3 }}
                                >
                                  {c.code}
                                </Text>
                              </View>
                              <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                <Text
                                  style={{
                                    fontFamily: fonts.sansBold,
                                    fontSize: 15,
                                    color: colors.text.inverse,
                                    letterSpacing: -0.3,
                                  }}
                                >
                                  {c.label}
                                </Text>
                                <Text style={{ fontFamily: fonts.mono, fontSize: 10, color: c.accent }}>{c.count}</Text>
                              </View>
                            </View>
                          )}
                        </Pressable>
                      ) : (
                        <View key={`empty-${ci}`} style={{ flex: 1 }} />
                      ),
                    )}
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const PickerRow: React.FC<{
  entry: CategoryVehicleEntry;
  sub?: string;
  color: string;
  bg: string;
  disabled: boolean;
  onPick: () => void;
}> = ({ entry, sub, color, bg, disabled, onPick }) => (
  <Pressable onPress={disabled ? undefined : onPick} accessibilityRole="button" accessibilityState={{ disabled }}>
    {({ pressed }) => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingHorizontal: 8,
          paddingVertical: 11,
          borderRadius: 10,
          opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
        }}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            backgroundColor: bg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Car size={18} color={color} strokeWidth={2.2} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            numberOfLines={1}
            style={{ fontFamily: fonts.sansSemibold, fontSize: 13.5, color: colors.text.primary, letterSpacing: -0.2 }}
          >
            {entry.brand} {entry.model}
          </Text>
          <Text
            numberOfLines={1}
            style={{ fontFamily: fonts.sans, fontSize: 11.5, color: colors.text.secondary, marginTop: 1 }}
          >
            {entry.version} · {entry.year}
            {sub ? ` · ${sub}` : ''}
            {disabled ? ' · Já selecionado' : ''}
          </Text>
        </View>
        <Feather name="chevron-right" size={16} color={colors.text.muted} />
      </View>
    )}
  </Pressable>
);
