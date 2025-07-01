import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function TeacherLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) router.replace("/(public)/onBoarding");
  }, [isLoaded, isSignedIn, router]);

  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: "#121212" },
      headerTintColor: "#FFF"
    }}>
      <Stack.Screen name="home" options={{ title: "Home" }} />
    </Stack>
  );
}