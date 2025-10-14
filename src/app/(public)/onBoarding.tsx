import { useEffect, useRef } from "react";
import { BackHandler, Alert } from "react-native";
import { buttonStyles, useAppFonts } from "@/styles/fonts";
import globalStyles from "@/styles/styles";
import { router } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function OnBoarding() {
  const fontsLoaded = useAppFonts();
  const backPressCount = useRef(0);

  useEffect(() => {
    const backAction = () => {
      if (backPressCount.current === 0) {
        backPressCount.current += 1;

        Alert.alert(
          "Sair do app",
          "Pressione voltar novamente para sair.",
          [{ text: "OK", onPress: () => {} }],
          { cancelable: true }
        );

        setTimeout(() => {
          backPressCount.current = 0;
        }, 2000);

        return true; // 🔹 Impede voltar pra Splash
      } else {
        BackHandler.exitApp();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={globalStyles.container}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Personal Trust</Text>

      <Pressable
        style={globalStyles.buttonOnBoarding}
        onPress={() => router.push("/(auth)/loginUser")}
      >
        <Text style={buttonStyles.text}>Aluno</Text>
      </Pressable>

      <Pressable
        style={buttonStyles.onBoarding}
        onPress={() => router.push("/(auth)/loginTeacher")}
      >
        <Text style={buttonStyles.text}>Professor</Text>
      </Pressable>
    </View>
  );
}
