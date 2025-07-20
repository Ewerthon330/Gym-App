// components/AuthRedirect.tsx
import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function AuthRedirect() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      // Verifica se é professor (adaptar conforme sua lógica)
      const isProfessor = user?.publicMetadata?.role === 'professor';
      
      if (isProfessor) {
        router.replace('/(teacher)/home');
      } else {
        router.replace('/(user)/home');
      }
    } else {
      router.replace('/(public)/onBoarding');
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}