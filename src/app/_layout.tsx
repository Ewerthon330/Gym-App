import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export const publishKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      console.error('Failed to get token:', err);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error('Failed to get token:', err);
      return;
    }
  },
};

const InitialLayout = () => {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isAuthLoaded && isUserLoaded) {
      setIsReady(true);
    }
  }, [isAuthLoaded, isUserLoaded]);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "onBoarding";
    const inPublicGroup = segments[0] === "(public)";

    if (isSignedIn) {
      if (inAuthGroup || inOnboarding || inPublicGroup) {
        if (user?.publicMetadata?.role === "(user)") {
          router.replace("/(user)/home");
        } else if (user?.publicMetadata?.role === "(teacher)") {
          router.replace("/(teacher)/home");
        }
      }
    } else {
      if (!inOnboarding && !inPublicGroup && !inAuthGroup) {
        router.replace("/(public)/onBoarding");
      }
    }
  }, [isReady, router, isSignedIn, segments, user?.publicMetadata?.role]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
};

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey="pk_test_ZXZvbHZpbmctc3RhcmxpbmctNDguY2xlcmsuYWNjb3VudHMuZGV2JA" tokenCache={tokenCache}>
      <InitialLayout />
    </ClerkProvider>
  );
}
