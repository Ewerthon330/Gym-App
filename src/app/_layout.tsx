import { db } from "@/services/firebase";
import globalStyles from "@/styles/styles";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const tokenCache = {
  async getToken(key: string) {
    const token = await SecureStore.getItemAsync(key);
    return token;
  },
  async saveToken(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
};

function AuthGuard() {
  const { isLoaded: isAuthLoaded, isSignedIn, userId, signOut } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const router = useRouter();

  const [role, setRole] = useState<"user" | "teacher" | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function fetchRole() {

      if (!isSignedIn || !userId) {
        setRole(null);
        setReady(true);
        return;
      }

      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await signOut();
          setRole(null);
        } else {
          const data = userSnap.data();
          setRole(
            data.role === "teacher"
              ? "teacher"
              : data.role === "user"
              ? "user"
              : null
          );
        }
      } catch (err) {
        setRole(null);
      } finally {
        setReady(true);
      }
    }

    if (isAuthLoaded && isUserLoaded) {
      fetchRole();
    } else {
    }
  }, [isAuthLoaded, isUserLoaded, isSignedIn, userId, user, signOut]);

  useEffect(() => {

    if (!ready) return;

    if (!isSignedIn) {
      router.replace("/(public)/splashScreen");
    } else if (role === "teacher") {
      router.replace("/(teacher)/home");
    } else if (role === "user") {
      router.replace("/(user)/home");
    }
  }, [ready, isSignedIn, role, router]);

  if (!ready) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <AuthGuard />
    </ClerkProvider>
  );
}
