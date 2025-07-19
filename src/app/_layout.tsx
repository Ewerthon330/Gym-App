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
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (!isAuthLoaded || !isUserLoaded || hasNavigated) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inPublicGroup = segments[0] === "(public)";
    const inUserGroup = segments[0] === "(user)";
    const inTeacherGroup = segments[0] === "(teacher)";

    if (isSignedIn) {
      // Se já está na área correta, não navegar
      if (inUserGroup || inTeacherGroup) {
        setHasNavigated(true);
        return;
      }
      
      // Se está em área pública ou auth, redirecionar
      if (inAuthGroup || inPublicGroup || !segments || segments.length === 0) {
        if (user?.publicMetadata?.role === "(user)") {
          router.replace("/(user)/home");
        } else if (user?.publicMetadata?.role === "(teacher)") {
          router.replace("/(teacher)/home");
        } else {
          router.replace("/(user)/home");
        }
        setHasNavigated(true);
      }
    } else {
      // Se não está logado e não está em área pública/auth
      if (!inPublicGroup && !inAuthGroup && segments.length > 0) {
        router.replace("/(public)/onBoarding");
        setHasNavigated(true);
      }
    }
  }, [isAuthLoaded, isUserLoaded, isSignedIn, segments, user?.publicMetadata?.role, hasNavigated]);

  // Reset hasNavigated quando o status de login muda
  useEffect(() => {
    setHasNavigated(false);
  }, [isSignedIn]);

  if (!isAuthLoaded || !isUserLoaded) {
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
