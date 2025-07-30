import { useSignUp } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { db } from '../../services/firebase'; // ajuste conforme seu projeto

// 🔁 Substitua pelo ID real do seu professor no Clerk
const DEFAULT_TEACHER_ID = 'user_30avU7VHt7iwOlZY6d28lIYQVjG';

export default function RegisterUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, setActive, isLoaded } = useSignUp();

  const handleSignUp = async () => {
    if (!isLoaded || !signUp) return;

    if (!name || !email || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: {
          role: 'user',
          name,
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert('Erro', err.errors?.[0]?.message ?? 'Erro ao registrar');
      console.log('Erro no signUp:', JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded || !setActive || !signUp) return;

    setIsLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });

      await setActive({ session: completeSignUp.createdSessionId });

      const userId = completeSignUp.createdUserId;
      if (!userId) throw new Error('ID do usuário não foi retornado.');

      // Salva aluno na coleção "users"
      await setDoc(doc(db, 'users', userId), {
        name,
        email,
        role: 'user',
        teacherId: DEFAULT_TEACHER_ID,
        createdAt: serverTimestamp(),
      });

      router.replace('/(user)/home');
    } catch (err: any) {
      Alert.alert('Erro', err.errors?.[0]?.message ?? 'Erro na verificação');
      console.log('Erro na verificação:', JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verifique seu Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Código"
          value={code}
          onChangeText={setCode}
          editable={!isLoading}
        />
        <Pressable style={styles.button} onPress={handleVerify} disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? 'Verificando...' : 'Verificar'}
          </Text>
        </Pressable>
        {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Aluno</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        editable={!isLoading}
      />

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

      <Pressable style={styles.button} onPress={handleSignUp} disabled={isLoading}>
        <Text style={styles.buttonText}>
          {isLoading ? 'Carregando...' : 'Registrar'}
        </Text>
      </Pressable>

      {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
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
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
