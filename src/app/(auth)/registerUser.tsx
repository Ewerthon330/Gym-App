import colors from '@/styles/colors';
import globalStyles from '@/styles/styles';
import { useAuth, useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View
} from 'react-native';
import { db } from '../../services/firebase';

const DEFAULT_TEACHER_ID = 'user_31Tj6VqeQJiBGsMlU4GDUQLe7ri';

export default function RegisterUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, isLoaded } = useSignUp();
  const { signOut } = useAuth();

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
    if (!isLoaded || !signUp) return;

    setIsLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });

      if (completeSignUp.status !== 'complete') {
        throw new Error('Verificação não concluída. Tente novamente.');
      }

      const userId = completeSignUp.createdUserId;
      if (!userId) throw new Error('ID do usuário não foi retornado.');

      console.log('✅ Usuário verificado. Salvando no Firestore...');

      await setDoc(doc(db, 'users', userId), {
        name,
        email,
        role: 'user',
        teacherId: DEFAULT_TEACHER_ID,
        createdAt: serverTimestamp(),
      });

      console.log('✅ Usuário salvo no Firestore com sucesso.');

      await signOut();


      Alert.alert(
        'Verificação concluída',
        'Sua conta foi criada com sucesso! Agora faça login para continuar.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/loginUser'),
          },
        ]
      );
    } catch (err: any) {
      console.error('❌ Erro na verificação:', err);
      const msg =
        err.errors?.[0]?.message || err.message || 'Erro desconhecido na verificação';
      Alert.alert('Erro', msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Verifique seu Email</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Código"
          value={code}
          onChangeText={setCode}
          editable={!isLoading}
        />
        <Pressable
          style={globalStyles.buttonRegisterUser}
          onPress={handleVerify}
          disabled={isLoading}
        >
          <Text style={globalStyles.buttonText}>
            {isLoading ? 'Verificando...' : 'Verificar'}
          </Text>
        </Pressable>
        {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Pressable
        onPress={() => router.push('/(auth)/loginUser')}
        style={globalStyles.backButton}
      >
        <Ionicons name="arrow-back" size={30} color={colors.black} />
      </Pressable>

      <Text style={globalStyles.title}>Cadastro do Aluno</Text>

      <TextInput
        style={globalStyles.input}
        placeholder="Primeiro Nome"
        value={name}
        onChangeText={setName}
        editable={!isLoading}
      />

      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />

      <TextInput
        style={globalStyles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <Pressable
        style={globalStyles.buttonRegisterUser}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <Text style={globalStyles.buttonText}>
          {isLoading ? 'Carregando...' : 'Cadastrar-se'}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push('/(auth)/loginUser')}>
        <Text style={globalStyles.textButtonCad}>
          Já tem uma conta? Faça Login
        </Text>
        {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
      </Pressable>
    </View>
  );
}
