import { useSignUp } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ProfessorSignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [cref, setCref] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, setActive, isLoaded } = useSignUp();

  const handleSignUp = async () => {
    if (!isLoaded) return;

    const crefRegex = /^\d{6}-[A-Z]\/[A-Z]{2}$/;
    if (!crefRegex.test(cref)) {
      Alert.alert('CREF inválido', 'Formato correto: 123456-G/UF');
      return;
    }

    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: {
          role: 'professor',
          cref: cref,
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message ?? "Erro ao registrar.";
      Alert.alert("Erro", msg);
      if (__DEV__) {
        console.log("ERRO NO CADASTRO:", JSON.stringify(err, null, 2));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
      router.replace('/(teacher)/home');
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message ?? "Erro ao verificar código.";
      Alert.alert("Erro", msg);
      if (__DEV__) {
        console.log("ERRO NA VERIFICAÇÃO:", JSON.stringify(err, null, 2));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verifique seu Email</Text>
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          Digite o código enviado para {email}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Código de verificação"
          value={code}
          onChangeText={setCode}
          editable={!isLoading}
        />

        <Pressable style={styles.button} onPress={onPressVerify} disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? "Verificando..." : "Verificar Email"}
          </Text>
        </Pressable>

        {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro Professor</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="CREF (ex: 123456-G/SP)"
        value={cref}
        onChangeText={setCref}
        editable={!isLoading}
      />

      <Pressable style={styles.button} onPress={handleSignUp} disabled={isLoading}>
        <Text style={styles.buttonText}>
          {isLoading ? "Carregando..." : "Registrar"}
        </Text>
      </Pressable>

      {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}

      <Link href="/(auth)/loginTeacher" asChild>
        <Pressable style={styles.secondaryButton} disabled={isLoading}>
          <Text style={styles.secondaryButtonText}>Já tem conta? Faça login</Text>
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
    backgroundColor: "#fff",
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
});
