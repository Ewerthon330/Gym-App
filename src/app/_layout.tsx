import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      console.log("Erro ao obter token:", err);
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.log("Erro ao salvar token:", err);
    }
  },
};

function RootNavigationHandler() {
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
    const role = user?.unsafeMetadata?.role ?? "user";

    if (isSignedIn) {
      const isInPrivateArea = currentSegment === "(user)" || currentSegment === "(teacher)";
      if (!isInPrivateArea) {
        hasRedirected.current = true;
        setTimeout(() => {
          if (role === "teacher") {
            router.replace("/(teacher)/home");
          } else {
            router.replace("/(public)/onBoarding");
          }
        }, 0);
      }
    } else {
      const isInPublic = currentSegment === "(auth)" || currentSegment === "(public)";
      if (!isInPublic && currentSegment) {
        hasRedirected.current = true;
        setTimeout(() => {
          router.replace("/(public)/onBoarding");
        }, 0);
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

  return <Slot />;
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey="pk_test_c2Vuc2libGUtY291Z2FyLTYxLmNsZXJrLmFjY291bnRzLmRldiQ"
      tokenCache={tokenCache}
    >
      <RootNavigationHandler />
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
