import { useSignIn } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { validateCref } from 'utils/validateCref';

export default function ProfessorSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cref, setCref] = useState('');
  const { signIn, setActive, isLoaded } = useSignIn();

  const handleSignIn = async () => {
    if (!isLoaded) return;

    // Validação básica do CREF (formato: 123456-G/UF)
    const crefValidation = validateCref(cref);
    if (!crefValidation.valid) {
      Alert.alert("CREF inválido", crefValidation.message);
      return;
}


    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });
      
      await setActive({ session: completeSignIn.createdSessionId });
      
      // Verificar se o usuário tem role de professor
      router.replace('/(teacher)/home');
    } catch (err: any) {
      const errorMessage = err?.errors?.[0]?.message ?? "Erro inesperado.";
      Alert.alert("Erro", errorMessage);
    }
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
      
      <TextInput
        style={[
            styles.input,
            cref && !validateCref(cref).valid && styles.invalidInput
        ]}
        placeholder="CREF (ex: 123456-G/SP)"
        value={cref}
        onChangeText={setCref}
      />
      {cref && !validateCref(cref).valid && (
        <Text style={styles.errorText}>{validateCref(cref).message}</Text>
      )}
      
      <Pressable style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>
      
      <Link href="/(auth)/registerTeacher" asChild>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Registrar-se</Text>
        </Pressable>
      </Link>
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
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  invalidInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 15,
    },

});