// src/styles/fonts.ts
import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";

// Importando as fontes do Google Fonts
import { Merienda_400Regular } from "@expo-google-fonts/merienda";
import { Michroma_400Regular } from "@expo-google-fonts/michroma";
import { Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { VastShadow_400Regular } from "@expo-google-fonts/vast-shadow";

import colors from "./colors";

// 🔹 Hook para carregar todas as fontes
export function useAppFonts() {
  const [fontsLoaded] = useFonts({
    Merienda_400Regular,
    Michroma_400Regular,
    Roboto_400Regular,
    Roboto_700Bold,
    VastShadow_400Regular,
  });

  return fontsLoaded;
}

// 🔹 Exportar nomes das fontes
export const fonts = {
  merienda: "Merienda_400Regular",
  michroma: "Michroma_400Regular",
  roboto700B: "Roboto_700Bold",
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
    fontFamily: fonts.merienda,
    color: colors.lightGray,
    fontSize: 18,
    textAlign: "center",
  },
});
