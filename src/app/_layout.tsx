import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const tokenCache = {
  async getToken(key: string) {
    return await SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
};

function AuthGuard() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const segments = useSegments();
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isAuthLoaded && isUserLoaded) {
      setReady(true);
    }
  }, [isAuthLoaded, isUserLoaded]);

  useEffect(() => {
    if (!ready || hasRedirected.current) return;

    const currentSegment = segments[0]; // Ex: (public), (user), (teacher)
    const role = user?.unsafeMetadata?.role ?? null;

    if (isSignedIn) {
      const isInPrivateArea =
        currentSegment === "(user)" || currentSegment === "(teacher)";
      if (!isInPrivateArea) {
        hasRedirected.current = true;

        if (role === "teacher") {
          router.replace("/(teacher)/home");
        } else if (role === "user") {
          router.replace("/(user)/home");
        } else {
          router.replace("/(public)/onBoarding");
        }
      }
    } else {
      const isInPublic =
        currentSegment === "(auth)" || currentSegment === "(public)";
      if (!isInPublic && currentSegment) {
        hasRedirected.current = true;
        router.replace("/(public)/onBoarding");
      }
    }
  }, [ready, isSignedIn, segments, router, user]);

  if (!ready) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        headerShown: false,
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey="pk_test_c2Vuc2libGUtY291Z2FyLTYxLmNsZXJrLmFjY291bnRzLmRldiQ"
      tokenCache={tokenCache}
    >
      <AuthGuard />
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
