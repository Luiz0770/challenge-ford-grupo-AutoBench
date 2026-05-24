import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompareMatrix } from "../../components/compare/CompareMatrix";
import { SwapSheet } from "../../components/compare/SwapSheet";
import { VehicleSlot } from "../../components/compare/VehicleSlot";
import { VerdictCard } from "../../components/compare/VerdictCard";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { colors, fonts } from "../../constants/colors";
import { useFipePrice } from "../../hooks/useFipePrice";
import { CatalogService } from "../../services/catalog";
import { VehicleDataService } from "../../services/vehicleData";
import type {
  CategoryVehicleEntry,
  CompareCategoryId,
  Vehicle,
} from "../../types";

const CATEGORY_TABS: {
  id: CompareCategoryId;
  label: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { id: "motorizacao", label: "Motorização", icon: "activity" },
  { id: "dimensoes", label: "Dimensões", icon: "maximize-2" },
  { id: "tecnologia", label: "Tecnologia", icon: "cpu" },
  { id: "seguranca", label: "Segurança", icon: "shield" },
];

export default function CompareScreen() {
  const [a, setA] = useState<Vehicle | null>(null);
  const [b, setB] = useState<Vehicle | null>(null);
  const [cat, setCat] = useState<CompareCategoryId>("motorizacao");
  const [swap, setSwap] = useState<"a" | "b" | null>(null);

  const verdict = useMemo(
    () => (a && b ? CatalogService.getCompareVerdict(a.id, b.id) : null),
    [a?.id, b?.id],
  );
  const rows = useMemo(
    () => (a || b ? CatalogService.buildCompareRows(cat, a, b) : []),
    [cat, a?.id, b?.id],
  );

  const { price: aPrice } = useFipePrice(a);
  const { price: bPrice } = useFipePrice(b);

  const handlePick = (entry: CategoryVehicleEntry) => {
    const v = VehicleDataService.getVehicleById(entry.vehicleId);
    if (!v) {
      setSwap(null);
      return;
    }
    if (swap === "a") setA(v);
    if (swap === "b") setB(v);
    setSwap(null);
  };

  const handleRemove = (slot: 'a' | 'b') => {
    if (slot === 'a') setA(null);
    else setB(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.canvas }}>
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: colors.brand.navy }}
      >
        <View
          style={{
            backgroundColor: colors.brand.navy,
            paddingTop: 18,
            paddingBottom: 18,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: fonts.monoMedium,
                  fontSize: 9,
                  color: "rgba(255,255,255,0.55)",
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                }}
              >
                Análise lado-a-lado
              </Text>
              <Text
                style={{
                  fontFamily: fonts.sansSemibold,
                  fontSize: 15,
                  color: colors.bg.surface,
                  marginTop: 4,
                  letterSpacing: -0.2,
                }}
              >
                Comparar
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 12,
            flexDirection: "row",
            gap: 8,
            alignItems: "stretch",
          }}
        >
          <VehicleSlot
            vehicle={a}
            side="A"
            onSwap={() => setSwap("a")}
            onRemove={() => handleRemove("a")}
            fipeAvg={aPrice?.valor}
          />
          <VehicleSlot
            vehicle={b}
            side="B"
            onSwap={() => setSwap("b")}
            onRemove={() => handleRemove("b")}
            fipeAvg={bPrice?.valor}
          />
          <View
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: [{ translateX: -14 }, { translateY: -14 }],
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: colors.bg.surface,
              borderWidth: 1,
              borderColor: colors.bg.border,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#101828",
              shadowOpacity: 0.1,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text
              style={{
                fontFamily: fonts.monoBold,
                fontSize: 10,
                color: colors.brand.navy,
                letterSpacing: 0.5,
              }}
            >
              VS
            </Text>
          </View>
        </View>

        {/* Matriz comparativa */}
        {(a || b) && (
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
              paddingHorizontal: 4,
            }}
          >
            <SectionLabel>Matriz comparativa</SectionLabel>
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
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 10,
                    backgroundColor: isActive
                      ? colors.brand.navy
                      : colors.bg.surface,
                    borderWidth: 1,
                    borderColor: isActive
                      ? colors.brand.navy
                      : colors.bg.borderStrong,
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Feather
                    name={c.icon}
                    size={13}
                    color={isActive ? colors.bg.surface : colors.text.secondary}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.sansMedium,
                      fontSize: 12.5,
                      color: isActive ? colors.bg.surface : colors.text.primary,
                    }}
                  >
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <CompareMatrix
            rows={rows}
            aLabel={a ? `${a.brand} ${a.model}` : 'Slot A'}
            bLabel={b ? `${b.brand} ${b.model}` : 'Slot B'}
          />
        </View>
        )}

        {/* Veredito do Oráculo */}
        {verdict && (
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
              paddingHorizontal: 4,
            }}
          >
            <SectionLabel>Veredito do Oráculo</SectionLabel>
            <Text
              style={{
                fontFamily: fonts.monoSemibold,
                fontSize: 9.5,
                color: colors.brand.blue,
              }}
            >
              BETA
            </Text>
          </View>
          <VerdictCard verdict={verdict} />
        </View>
        )}

        {/* Rodapé técnico */}
        {(a || b) && (
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Feather name="activity" size={11} color={colors.text.muted} />
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 9.5,
              color: colors.text.muted,
              letterSpacing: 0.4,
            }}
          >
            Análise cruzada · 4 categorias · {rows.length} atributos
          </Text>
        </View>
        )}
      </ScrollView>

      <SwapSheet
        open={!!swap}
        side={swap}
        onClose={() => setSwap(null)}
        onPick={handlePick}
        excludedId={swap === 'a' ? b?.id : a?.id}
      />
    </View>
  );
}
