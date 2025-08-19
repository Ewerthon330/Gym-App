import colors from '@/styles/colors';
import globalStyles from '@/styles/styles';
import { useAuth, useSignIn, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // useRouter adicionado
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

export default function ProfessorSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter(); // hook router
  const { user } = useUser();

  const handleSignIn = async () => {
    if (!isLoaded) return;

    if (isSignedIn) {
      router.replace('/(teacher)/home');
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });

    // Atualiza role se ainda não estiver salvo
    if (user && !user.unsafeMetadata?.role) {
      await user.update({
        unsafeMetadata: {
          role: 'teacher',
        },
      });
    }

    router.replace('/(teacher)/home');


      await setActive({ session: completeSignIn.createdSessionId });

      router.replace('/(teacher)/home');
    } catch (err: any) {
      const code = err?.errors?.[0]?.code;
      const errorMessage = err?.errors?.[0]?.message ?? "Erro inesperado.";

      if (code === 'session_exists') {
        Alert.alert("Sessão já existe", "Você já está logado. Redirecionando...");
        router.replace('/(teacher)/home');
        return;
      }

      Alert.alert("Erro", errorMessage);
      if (__DEV__) {
        console.log("Erro no login:", JSON.stringify(err, null, 2));
      }
    }
  };

  return (
    <View style={globalStyles.container}>

      <Pressable
        onPress={() => router.push('/(public)/onBoarding')}
        style={globalStyles.backButton}
      >
        <Ionicons name="arrow-back" size={30} color={colors.black} />
      </Pressable>

      <Text style={globalStyles.title}>Trust Fitness App</Text>
      <Text style={globalStyles.subtitle}>Professor</Text>

      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={globalStyles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={globalStyles.buttonOnBoarding} onPress={handleSignIn}>
        <Text style={globalStyles.buttonText}>Entrar</Text>
      </Pressable>
    </View>
  );
}