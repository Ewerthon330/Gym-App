import { useAuth, useSignIn, useUser } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router'; // useRouter adicionado
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

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

  // Função para voltar para onBoarding
  const handleBack = () => {
    router.replace('/(public)/onBoarding');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Professor</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>

      <Link href="/(auth)/registerTeacher" asChild>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Registrar-se</Text>
        </Pressable>
      </Link>

      {/* Botão Voltar */}
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    marginBottom: 15,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  backButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
  },
  backButtonText: {
    color: '#555',
    fontSize: 16,
  },
});
