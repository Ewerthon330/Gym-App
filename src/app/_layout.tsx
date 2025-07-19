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
  const [isMounted, setIsMounted] = useState(false);

  // Aguardar a montagem do componente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Só navegar se o componente estiver montado e os dados carregados
    if (!isMounted || !isAuthLoaded || !isUserLoaded) return;

    const currentSegment = segments[0];
    const inAuthGroup = currentSegment === "(auth)";
    const inPublicGroup = currentSegment === "(public)";
    const inUserGroup = currentSegment === "(user)";
    const inTeacherGroup = currentSegment === "(teacher)";

    if (isSignedIn) {
      // Se já está na área correta, não redirecionar
      if (inUserGroup || inTeacherGroup) {
        return;
      }
      
      // Se está em área pública/auth ou na raiz, redirecionar baseado no role
      if (inAuthGroup || inPublicGroup || !currentSegment) {
        const userRole = user?.publicMetadata?.role;
        if (userRole === "teacher") {
          router.replace("/(teacher)/home");
        } else {
          router.replace("/(user)/home");
        }
      }
    } else {
      // Se não está logado e não está em área pública/auth
      if (!inPublicGroup && !inAuthGroup && currentSegment) {
        router.replace("/(public)/onBoarding");
      }
    }
  }, [isMounted, isAuthLoaded, isUserLoaded, isSignedIn, segments, user?.publicMetadata?.role]);

  if (!isMounted || !isAuthLoaded || !isUserLoaded) {
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