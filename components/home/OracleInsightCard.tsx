import { ArrowUpRight, Car, Sparkles } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import type { Vehicle } from '../../types';
import { GradientFill } from '../ui/GradientFill';
import { riseClass } from '../ui/motion';
import { PressableScale } from '../ui/PressableScale';

const accent = colors.brand.bright;

interface OracleInsightCardProps {
  vehicle: Vehicle;
  onPress: () => void;
}

// Alerta preditivo do dia (VehicleDataService.getDailyAlertVehicle)
export const OracleInsightCard: React.FC<OracleInsightCardProps> = ({ vehicle, onPress }) => {
  const { alert } = vehicle;

  return (
    <View className={`px-5 pt-[22px] ${riseClass(420)}`}>
      <PressableScale
        onPress={onPress}
        accessibilityLabel={`${alert.title}. Abrir ${vehicle.brand} ${vehicle.model}`}
        className="relative overflow-hidden rounded-2xl border border-white/10 p-4"
        style={{ backgroundColor: colors.brand.ink, boxShadow: '0 4px 14px rgba(0,26,77,0.18)' }}
      >
        <GradientFill
          angle={135}
          stops={[
            { color: colors.brand.ink, offset: 0 },
            { color: '#11244A', offset: 1 },
          ]}
        />

        {/* Brilho único atravessando o card (.ab-sweep) */}
        <View pointerEvents="none" className="absolute inset-0 animate-sweep">
          <GradientFill
            angle={115}
            stops={[
              { color: '#60A5FA', offset: 0.3, opacity: 0 },
              { color: '#60A5FA', offset: 0.5, opacity: 0.18 },
              { color: '#60A5FA', offset: 0.7, opacity: 0 },
            ]}
          />
        </View>

        {/* Selo */}
        <View className="absolute right-0 top-0 rounded-bl-[10px] px-3 py-2" style={{ backgroundColor: accent }}>
          <Text className="font-mono-bold text-[9px] uppercase tracking-[1.4px] text-brand-ink">
            Oráculo IA
          </Text>
        </View>

        <View className="mb-3 flex-row items-center gap-1.5 opacity-70">
          <View className="animate-spin-slow">
            <Sparkles size={13} color={accent} strokeWidth={2.2} />
          </View>
          <Text className="font-mono text-[10px] uppercase tracking-[1.4px] text-white/70">
            Oráculo · hoje
          </Text>
        </View>

        <Text className="mb-2 font-sans-bold text-[19px] leading-[23px] tracking-[-0.5px] text-white">
          {alert.title}
        </Text>
        <Text className="mb-3.5 font-sans text-[13px] leading-[19.5px] text-white/70">
          {alert.description}
        </Text>

        <View className="flex-row items-center gap-2.5">
          <View className="flex-shrink flex-row items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1.5">
            <Car size={12} color={accent} strokeWidth={2.4} />
            <Text numberOfLines={1} className="flex-shrink font-mono-semibold text-[11px] text-white">
              {vehicle.brand} {vehicle.model}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1.5">
            <View className="h-[5px] w-[5px] rounded-full" style={{ backgroundColor: accent }} />
            <Text className="font-mono-semibold text-[11px] text-white">{alert.probability}% conf.</Text>
          </View>
          <View className="flex-1" />
          <ArrowUpRight size={18} color="#fff" strokeWidth={2.4} />
        </View>
      </PressableScale>
    </View>
  );
};
