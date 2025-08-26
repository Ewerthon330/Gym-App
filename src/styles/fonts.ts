// src/styles/fonts.ts
import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";

// Importando as fontes do Google Fonts
import { FascinateInline_400Regular } from "@expo-google-fonts/fascinate-inline";
import { Merienda_400Regular } from "@expo-google-fonts/merienda";
import { Roboto_400Regular, Roboto_500Medium_Italic, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { VastShadow_400Regular } from "@expo-google-fonts/vast-shadow";

import colors from "./colors";

// 🔹 Hook para carregar todas as fontes
export function useAppFonts() {
  const [fontsLoaded] = useFonts({
    FascinateInline_400Regular,
    Merienda_400Regular,
    Roboto_400Regular,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    VastShadow_400Regular,
  });

  return fontsLoaded;
}

// 🔹 Exportar nomes das fontes
export const fonts = {
  fascinate: "FascinateInline_400Regular",
  merienda: "Merienda_400Regular",
  roboto700B: "Roboto_700Bold",
  roboto500I: "Roboto_500Medium_Italic",
  robotoRegular: "Roboto_400Regular",
  vastShadow: "VastShadow_400Regular",
};

// 🔹 Estilos de botão centralizados usando StyleSheet
export const buttonStyles = StyleSheet.create({
  onBoarding: {
    backgroundColor: colors.darkGray,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    borderColor: colors.lightGray,
    borderWidth: 1,
    elevation: 5,
  },
  text: {
    fontFamily: fonts.merienda, // fonte Merienda
    color: colors.lightGray,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold"
  },
});
