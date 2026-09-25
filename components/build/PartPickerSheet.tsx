import { Feather } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { statusLabel, type SystemDef } from '../../constants/build';
import { colors, fonts } from '../../constants/colors';
import { BuildService } from '../../services/build';
import type { Build, BuildPart } from '../../types';
import { BuildSheet } from './BuildSheet';
import { StatusBadge } from './StatusBadge';
import { SystemIcon } from './SystemIcon';

interface PartPickerSheetProps {
  /** null = fechado */
  system: SystemDef | null;
  build: Build;
  onClose: () => void;
  onPick: (key: string) => void;
}

export const PartPickerSheet: React.FC<PartPickerSheetProps> = ({ system, build, onClose, onPick }) => {
  const [q, setQ] = useState('');
  const [onlyCompatible, setOnlyCompatible] = useState(true);
  const open = !!system;

  useEffect(() => {
    if (open) {
      setQ('');
      setOnlyCompatible(true);
    }
  }, [open]);

  const stockKey = system && build.baseId ? BuildService.getStock(build.baseId)[system.id] : undefined;

  const options = useMemo(
    () =>
      system
        ? BuildService.getOptions(system.id, {
            query: q,
            platform: build.platform,
            onlyCompatible,
            stockKey,
          })
        : [],
    [system, q, onlyCompatible, build.platform, stockKey],
  );

  const renderItem = ({ item }: { item: BuildPart }) => {
    const on = build.parts[item.systemId] === item.key;
    const status = BuildService.getPartStatus(build, item);
    const origin = BuildService.describeOrigin(item, build.baseId);
    return (
      <Pressable onPress={() => onPick(item.key)} accessibilityRole="button" accessibilityState={{ selected: on }}>
        {({ pressed }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingHorizontal: 10,
              paddingVertical: 12,
              borderRadius: 12,
              marginBottom: 2,
              backgroundColor: on ? 'rgba(0,102,255,0.06)' : 'transparent',
              opacity: pressed ? 0.7 : 1,
            }}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: on ? colors.brand.bright : colors.bg.elevated,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SystemIcon
                id={item.systemId}
                size={17}
                color={on ? colors.text.inverse : colors.brand.navy}
              />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text
                style={{ fontFamily: fonts.sansSemibold, fontSize: 13.5, color: colors.text.primary }}
              >
                {item.name}
              </Text>
              {item.detail ? (
                <Text
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 11.5,
                    color: colors.text.secondary,
                    marginTop: 1,
                  }}
                >
                  {item.detail}
                </Text>
              ) : null}
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5, flexWrap: 'wrap' }}
              >
                <Text style={{ fontFamily: fonts.sansMedium, fontSize: 11, color: colors.brand.mid }}>
                  de {origin.label}
                  {origin.extra > 0 ? ` e mais ${origin.extra}` : ''}
                </Text>
                {status === 'orig' && (
                  <StatusBadge tone="orig" label={statusLabel('orig', !!build.baseId)} />
                )}
                {status === 'adapt' && (
                  <StatusBadge tone="adapt" label={statusLabel('adapt', !!build.baseId)} />
                )}
              </View>
            </View>
            {on && <Feather name="check" size={18} color={colors.brand.bright} />}
          </View>
        )}
      </Pressable>
    );
  };

  const header = (
    <View style={{ paddingHorizontal: 20, paddingBottom: 12, gap: 10 }}>
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
          placeholder="Buscar peça ou veículo de origem"
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
        {q.length > 0 && (
          <Pressable onPress={() => setQ('')} hitSlop={8} accessibilityLabel="Limpar busca">
            <Feather name="x" size={14} color={colors.text.secondary} />
          </Pressable>
        )}
      </View>

      <View style={{ flexDirection: 'row', padding: 3, borderRadius: 10, backgroundColor: colors.bg.elevated }}>
        {(
          [
            [true, 'Compatíveis'],
            [false, 'Todas'],
          ] as const
        ).map(([value, label]) => {
          const active = onlyCompatible === value;
          return (
            <Pressable
              key={label}
              onPress={() => setOnlyCompatible(value)}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 8,
                alignItems: 'center',
                backgroundColor: active ? colors.bg.surface : 'transparent',
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

      <Text
        style={{
          fontFamily: fonts.mono,
          fontSize: 10,
          color: colors.text.secondary,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        }}
      >
        {options.length} {options.length === 1 ? 'peça' : 'peças'}
      </Text>
    </View>
  );

  return (
    <BuildSheet
      open={open}
      fill
      scroll={false}
      eyebrow={system?.hint ?? ''}
      title={system?.label ?? ''}
      onClose={onClose}
      header={header}
    >
      <FlatList
        data={options}
        keyExtractor={(p) => p.key}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={12}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 8 }}
        ListEmptyComponent={
          <Text
            style={{
              paddingVertical: 24,
              textAlign: 'center',
              fontFamily: fonts.sans,
              fontSize: 13,
              color: colors.text.secondary,
            }}
          >
            Nenhuma peça encontrada.
          </Text>
        }
      />
    </BuildSheet>
  );
};
