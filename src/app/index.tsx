import { db } from "@/services/firebase";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [role, setRole] = useState<"user" | "teacher" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (isSignedIn && userId) {
        // Primeiro tenta pegar a role do Clerk
        const clerkRole = user?.unsafeMetadata?.role;
        if (clerkRole === "teacher" || clerkRole === "user") {
          setRole(clerkRole);
          setLoading(false);
          return;
        }

        // Se não tiver no Clerk, busca no Firestore
        try {
          const userRef = doc(db, "users", userId);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.role === "teacher" || data.role === "") {
              setRole(data.role);
            }
          }
        } catch (err) {
          console.error("Erro ao buscar role:", err);
        }
      }
      setLoading(false);
    }

    fetchRole();
  }, [isSignedIn, userId, user]);

  if (!isLoaded || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(public)/intro" />;
  }

  if (role === "teacher") {
    return <Redirect href="/(teacher)/home" />;
  }

  if (role === "user") {
    return <Redirect href="/(user)/home" />;
  }

  return <Redirect href="/(public)/onBoarding" />;
}
