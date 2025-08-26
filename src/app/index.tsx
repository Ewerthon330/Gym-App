import { db } from "@/services/firebase";
import globalStyles from "@/styles/styles";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isSignedIn, isLoaded, userId, signOut } = useAuth();
  const [role, setRole] = useState<"user" | "teacher" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!isSignedIn || !userId) {
        setRole(null);
        setLoading(false);
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
          setRole(data.role === "teacher" ? "teacher" : data.role === "user" ? "user" : null);
        }
      } catch (err) {
        console.error("Erro ao buscar role:", err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) fetchRole();
  }, [isLoaded, isSignedIn, userId, signOut]);

  if (!isLoaded || loading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isSignedIn) return <Redirect href="/(public)/splashScreen" />;

  switch (role) {
  case "teacher":
    return <Redirect href="/(teacher)/home" />;
  case "user":
    return <Redirect href="/(user)/home" />;
  default:
    // Se a role não existir no Firestore, aí sim vai para onBoarding
    return <Redirect href="/(public)/onBoarding" />;
}

}
