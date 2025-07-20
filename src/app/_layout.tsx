import { useAuth, useUser } from "@clerk/clerk-expo";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export function RootNavigationHandler() {
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

    const currentSegment = segments[0];
    const role = user?.publicMetadata?.role ?? "user";

    if (isSignedIn) {
      const isInPrivateArea = currentSegment === "(user)" || currentSegment === "(teacher)";
      if (!isInPrivateArea) {
        hasRedirected.current = true;
        setTimeout(() => {
          if (role === "teacher") {
            router.replace("/(teacher)/home");
          } else {
            router.replace("/(user)/home");
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
  }, [ready, isSignedIn, segments]);

  if (!ready) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

return <Slot />;
}


const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})