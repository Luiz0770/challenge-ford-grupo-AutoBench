import { ArrowUpRight, Star } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { VehicleDataService } from '../../services/vehicleData';
import type { FavoriteEntry } from '../../types';
import { Rise } from '../ui/Rise';
import { PressableScale } from '../ui/PressableScale';
import { FipeValue } from './FipeValue';
import { SectionHeader } from './SectionHeader';

const accent = colors.brand.bright;
const cardShadow = { boxShadow: '0 1px 2px rgba(16,24,40,0.04)' };

interface FavoritesSectionProps {
  favorites: FavoriteEntry[];
  onSelect: (vehicleId: string) => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({ favorites, onSelect }) => (
  <View className="px-5 pt-7">
    <Rise delay={1240} className="mb-2.5">
      <SectionHeader title={`Favoritos · ${favorites.length}`} />
    </Rise>

    {favorites.length > 0 ? (
      <View className="flex-row flex-wrap justify-between gap-y-2.5">
        {favorites.slice(0, 4).map((f, i) => {
          const vehicle = VehicleDataService.getVehicleById(f.vehicleId);
          return (
            <Rise key={f.vehicleId} delay={1280 + i * 70} className="w-[48.5%]">
              <PressableScale
                onPress={() => onSelect(f.vehicleId)}
                accessibilityLabel={f.vehicleName}
                className="rounded-[14px] border border-ink-200 bg-surface p-3"
                style={cardShadow}
              >
                <View className="mb-6 flex-row items-start justify-between">
                  <Star size={14} color={accent} fill={accent} strokeWidth={2.2} />
                  <ArrowUpRight size={14} color={colors.text.muted} strokeWidth={2.2} />
                </View>
                <Text className="mb-1 font-mono text-[9px] uppercase tracking-[1.2px] text-ink-700">
                  {vehicle?.brand ?? f.vehicleName.split(' ')[0]}
                </Text>
                <Text
                  numberOfLines={1}
                  className="font-sans-semibold text-sm leading-[17px] tracking-[-0.3px] text-brand-deep"
                >
                  {vehicle?.model ?? f.vehicleName}
                </Text>
                {vehicle && (
                  <Text numberOfLines={1} className="mt-0.5 font-sans text-xs leading-4 text-ink-700">
                    {vehicle.version} · {vehicle.year}
                  </Text>
                )}
                <View className="mt-2.5 flex-row items-baseline justify-between border-t border-dashed border-ink-200 pt-2.5">
                  <Text className="font-mono text-[9px] uppercase tracking-[1px] text-ink-400">FIPE</Text>
                  <FipeValue vehicle={vehicle} className="font-mono-semibold text-xs text-ink-900" />
                </View>
              </PressableScale>
            </Rise>
          );
        })}
      </View>
    ) : (
      <Rise
        delay={1280} className="flex-row items-center gap-3.5 rounded-[14px] border border-ink-200 bg-surface p-[18px]"
        style={cardShadow}
      >
        <View
          className="h-11 w-11 items-center justify-center rounded-xl border border-dashed"
          style={{ backgroundColor: `${accent}14`, borderColor: `${accent}66` }}
        >
          <Star size={20} color={accent} strokeWidth={2.2} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="font-sans-semibold text-sm tracking-[-0.2px] text-brand-deep">
            Salve seus primeiros favoritos
          </Text>
          <Text className="mt-0.5 font-sans text-xs leading-[17px] text-ink-700">
            Toque ★ em qualquer veículo para acompanhar o preço FIPE e os sinais do Oráculo.
          </Text>
        </View>
      </Rise>
    )}
  </View>
);
