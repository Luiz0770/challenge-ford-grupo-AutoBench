import { Building, Truck, Users, Zap, type LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { Rise } from '../ui/Rise';
import { PressableScale } from '../ui/PressableScale';
import { SectionHeader } from './SectionHeader';

interface Persona {
  id: string;
  label: string;
  icon: LucideIcon;
  categoryId: string;
}

// Cada necessidade abre a aba Busca na categoria correspondente
const PERSONAS: Persona[] = [
  { id: 'familia', label: 'Família', icon: Users, categoryId: 'suv' },
  { id: 'urbano', label: 'Urbano', icon: Building, categoryId: 'hatch' },
  { id: 'trabalho', label: 'Trabalho', icon: Truck, categoryId: 'picape' },
  { id: 'economico', label: 'Econômico', icon: Zap, categoryId: 'compacto' },
];

interface PersonaShortcutsProps {
  onSelectCategory: (categoryId: string) => void;
}

export const PersonaShortcuts: React.FC<PersonaShortcutsProps> = ({ onSelectCategory }) => (
  <View className="px-5 pt-[22px]">
    <Rise delay={180} className="mb-2.5">
      <SectionHeader title="Começar por necessidade" />
    </Rise>
    <View className="flex-row gap-2">
      {PERSONAS.map((p, i) => {
        const Icon = p.icon;
        return (
          <Rise key={p.id} delay={220 + i * 50} className="flex-1">
            <PressableScale
              onPress={() => onSelectCategory(p.categoryId)}
              accessibilityLabel={p.label}
              className="items-center gap-1.5 rounded-[14px] border border-ink-200 bg-surface px-1.5 pt-3 pb-2.5"
              style={{ boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }}
            >
              <View className="h-9 w-9 items-center justify-center">
                <Icon size={22} color={colors.brand.mid} strokeWidth={2} />
              </View>
              <Text className="font-sans-semibold text-[11.5px] tracking-[-0.2px] text-brand-deep">
                {p.label}
              </Text>
            </PressableScale>
          </Rise>
        );
      })}
    </View>
  </View>
);
