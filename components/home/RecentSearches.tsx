import { ChevronRight, Clock } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { VehicleDataService } from '../../services/vehicleData';
import type { HistoryEntry } from '../../types';
import { riseClass } from '../ui/motion';
import { PressableScale } from '../ui/PressableScale';
import { SectionHeader } from './SectionHeader';

const cardShadow = { boxShadow: '0 1px 2px rgba(16,24,40,0.04)' };

interface RecentSearchesProps {
  history: HistoryEntry[];
  onSelect: (vehicleId: string) => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({ history, onSelect }) => (
  <View className="px-5 pt-6">
    <View className={`mb-2.5 ${riseClass(1480)}`}>
      <SectionHeader title="Buscas recentes" />
    </View>

    {history.length > 0 ? (
      <View className="overflow-hidden rounded-[14px] border border-ink-200 bg-surface" style={cardShadow}>
        {history.map((h, i) => {
          const vehicle = VehicleDataService.getVehicleById(h.vehicleId);
          return (
            <View key={h.vehicleId} className={riseClass(1520 + i * 60)}>
              <PressableScale
                onPress={() => onSelect(h.vehicleId)}
                accessibilityLabel={h.vehicleName}
                className={`flex-row items-center gap-3 p-3.5 ${i > 0 ? 'border-t border-ink-100' : ''}`}
              >
                <View className="h-9 w-9 items-center justify-center rounded-lg bg-ink-100">
                  <Clock size={15} color={colors.text.secondary} strokeWidth={2.2} />
                </View>
                <View className="min-w-0 flex-1">
                  <Text numberOfLines={1} className="font-sans-semibold text-sm tracking-[-0.2px] text-ink-900">
                    {vehicle ? `${vehicle.brand} ${vehicle.model}` : h.vehicleName}
                  </Text>
                  <Text numberOfLines={1} className="mt-px font-sans text-xs text-ink-700">
                    {vehicle
                      ? `${vehicle.version} · ${vehicle.year}`
                      : new Date(h.viewedAt).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.text.muted} strokeWidth={2.2} />
              </PressableScale>
            </View>
          );
        })}
      </View>
    ) : (
      <View
        className={`flex-row items-center gap-3.5 rounded-[14px] border border-ink-200 bg-surface p-[18px] ${riseClass(1520)}`}
        style={cardShadow}
      >
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-ink-100">
          <Clock size={20} color={colors.text.secondary} strokeWidth={2.2} />
        </View>
        <View className="flex-1">
          <Text className="font-sans-semibold text-sm tracking-[-0.2px] text-brand-deep">Sem buscas ainda</Text>
          <Text className="mt-0.5 font-sans text-xs leading-[17px] text-ink-700">
            Comece pelos atalhos acima ou digite no campo de busca.
          </Text>
        </View>
      </View>
    )}
  </View>
);
