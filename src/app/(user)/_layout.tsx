import { useAuth } from "@clerk/clerk-expo";
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function AlunoLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/(auth)/loginUser");
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || !isSignedIn) {
    return (
      <View style={styles.container}>
        <ActivityIndicator/>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: "Home Aluno",
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
