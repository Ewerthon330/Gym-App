import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function useAuthRedirect() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      const role = user?.unsafeMetadata?.role || 'aluno'; // Assume 'aluno' como padrão
      
      if (role === 'professor') {
        router.replace('/(teacher)/home');
      } else {
        router.replace('/(user)/home');
      }
    } else {
      router.replace('/(public)/onBoarding');
    }
  }, [isLoaded, isSignedIn, user]);
}