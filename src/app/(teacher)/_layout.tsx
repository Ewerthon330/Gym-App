import { useAuth, useUser } from '@clerk/clerk-expo';
import { Slot, router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

export default function ProfessorLayout() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();

  useEffect(() => {
    if (!isAuthLoaded || !isUserLoaded) return;

    if (!isSignedIn) {
      router.replace('/(auth)/loginTeacher');
      return;
    }

    const role = user?.unsafeMetadata?.role;
    const isProfessor = role === 'teacher';

    if (!isProfessor) {
      Alert.alert('Acesso negado', 'Somente professores podem acessar esta área');
      router.replace('/(public)/onBoarding');
    }
  }, [isAuthLoaded, isUserLoaded, isSignedIn, user]);

  const isLoading = !isAuthLoaded || !isUserLoaded || !isSignedIn;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
