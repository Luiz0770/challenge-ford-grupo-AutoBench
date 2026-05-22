import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LivePulse } from "../../components/ui/LivePulse";
import { SectionLabel } from "../../components/ui/SectionLabel";
import { Wordmark } from "../../components/ui/Wordmark";
import { MarketBand } from "../../components/vehicle/MarketBand";
import { SpecsMatrix } from "../../components/vehicle/SpecsMatrix";
import { colors, fonts } from "../../constants/colors";
import { useFipePrice } from "../../hooks/useFipePrice";
import { CatalogService } from "../../services/catalog";
import { VehicleDataService } from "../../services/vehicleData";
import { useUserStore } from "../../store/userStore";

export default function VehicleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const vehicleId = Array.isArray(id) ? id[0] : (id ?? "");
  const vehicle = VehicleDataService.getVehicleById(vehicleId);
  const meta = CatalogService.getVehicleMeta(vehicleId);
  const {
    price: fipePrice,
    loading: fipeLoading,
    error: fipeError,
  } = useFipePrice(vehicle);

  const { isFavorite, addFavorite, removeFavorite, addHistory } =
    useUserStore();

  useEffect(() => {
    if (vehicle) {
      addHistory({
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.brand} ${vehicle.model} ${vehicle.version} ${vehicle.year}`,
        viewedAt: new Date().toISOString(),
      });
    }
  }, [vehicleId]);

  if (!vehicle) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.canvas }}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Feather name="alert-circle" size={32} color={colors.text.muted} />
          <Text
            style={{
              fontFamily: fonts.sans,
              color: colors.text.secondary,
              marginTop: 8,
            }}
          >
            Veículo não encontrado.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const saved = isFavorite(vehicle.id);
  const toggleFavorite = () => {
    Haptics.impactAsync(
      saved
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium,
    ).catch(() => {});
    if (saved) {
      removeFavorite(vehicle.id);
    } else {
      addFavorite({
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.brand} ${vehicle.model} ${vehicle.version} ${vehicle.year}`,
        savedAt: new Date().toISOString(),
      });
    }
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
            paddingTop: 8,
            paddingBottom: 18,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingBottom: 14,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: "rgba(255,255,255,0.10)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.14)",
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Feather
                name="chevron-left"
                size={16}
                color={colors.bg.surface}
              />
            </Pressable>

            <Wordmark small light />

            <Pressable
              onPress={toggleFavorite}
              style={({ pressed }) => ({
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: saved
                  ? colors.brand.blue
                  : "rgba(255,255,255,0.10)",
                borderWidth: 1,
                borderColor: saved
                  ? colors.brand.blue
                  : "rgba(255,255,255,0.14)",
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Feather name="bookmark" size={15} color={colors.bg.surface}/>
            </Pressable>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            <Text
              style={{
                fontFamily: fonts.monoMedium,
                fontSize: 10,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {vehicle.brand}
            </Text>
            <View>
              <Text
                style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 26,
                  color: colors.bg.surface,
                  letterSpacing: -0.8,
                  lineHeight: 28,
                }}
              >
                {vehicle.model}{" "}
                <Text
                  style={{
                    fontFamily: fonts.sansMedium,
                    color: "rgba(255,255,255,0.78)",
                  }}
                >
                  {vehicle.version}
                </Text>
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                alignSelf: "flex-start",
                marginTop: 10,
                backgroundColor: "rgba(255,255,255,0.08)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.12)",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.monoSemibold,
                  fontSize: 11,
                  color: colors.bg.surface,
                }}
              >
                {vehicle.year}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {meta && (
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 14,
              backgroundColor: colors.bg.surface,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.bg.border,
              paddingHorizontal: 12,
              paddingVertical: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <LivePulse color={colors.status.success} size={6} />
              <Text
                style={{
                  fontFamily: fonts.sansMedium,
                  fontSize: 11.5,
                  color: colors.text.primary,
                }}
              >
                Confiança da fonte:{" "}
                <Text
                  style={{
                    fontFamily: fonts.sansSemibold,
                    color: colors.status.success,
                  }}
                >
                  {meta.sources.confidence}
                </Text>
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Feather name="info" size={11} color={colors.text.secondary} />
              <Text
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 9.5,
                  color: colors.text.secondary,
                }}
              >
                {meta.sources.cross} fontes cruzadas
              </Text>
            </View>
          </View>
        )}

        {meta && (
          <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <SectionLabel>Mercado · FIPE API</SectionLabel>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <LivePulse color={colors.status.success} size={5} />
                <Text
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 9.5,
                    color: colors.text.secondary,
                  }}
                >
                  ao vivo
                </Text>
              </View>
            </View>
            <MarketBand
              fipeCode={fipePrice?.codigoFipe ?? meta.fipe.code}
              fipeMonth={fipePrice?.mesReferencia ?? meta.fipe.month}
              fipeAvg={fipePrice?.valor ?? meta.market.fipeAvg}
              modelo={fipePrice?.modelo}
              loading={fipeLoading}
              error={fipeError}
            />
          </View>
        )}

        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <SectionLabel>Matriz de Especificações</SectionLabel>
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 9.5,
                color: colors.text.muted,
              }}
            >
              Determinístico
            </Text>
          </View>
          <SpecsMatrix vehicle={vehicle} />
        </View>
      </ScrollView>
    </View>
  );
}
