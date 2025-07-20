import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

export default function ProfessorLayout() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();

  const role = user?.publicMetadata?.role;
  const isProfessor = role === 'professor';

  useEffect(() => {
    if (!isAuthLoaded || !isUserLoaded) return;

    if (!isSignedIn) {
      router.replace('/(auth)/loginTeacher');
      return;
    }

    if (!isProfessor) {
      Alert.alert('Acesso negado', 'Somente professores podem acessar esta área');
      router.replace('/(public)/onBoarding');
    }
  }, [isAuthLoaded, isUserLoaded, isSignedIn, isProfessor]);

  if (!isAuthLoaded || !isUserLoaded || !isSignedIn || !isProfessor) {
    return null;
  }

  return (
  <View style={styles.container}>
    <ActivityIndicator size="large" />
  </View>
);
}


const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})