import { buttonStyles, useAppFonts } from "@/styles/fonts"; // 🔹 importa hook e estilos de botão
import globalStyles from "@/styles/styles";
import { router } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function OnBoarding() {
  // 🔹 Carrega todas as fontes do fonts.ts
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {/* 🔹 Título */}
      <Text style={{ ...globalStyles.title, fontFamily: "FascinateInline_400Regular" }}>
        Personal Trust
      </Text>

      {/* 🔹 Botão Aluno */}
      <Pressable style={globalStyles.buttonOnBoarding} onPress={() => router.push("/(auth)/loginUser")}>
        <Text style={buttonStyles.text}>
          Aluno
        </Text>
      </Pressable>

      {/* 🔹 Botão Professor */}
      <Pressable style={buttonStyles.onBoarding} onPress={() => router.push("/(auth)/loginTeacher")}>
        <Text style={buttonStyles.text}>
          Professor
        </Text>
      </Pressable>
    </View>
  );
}
