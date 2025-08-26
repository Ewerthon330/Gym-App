import colors from '@/styles/colors';
import { buttonStyles } from '@/styles/fonts';
import globalStyles from '@/styles/styles';
import { useAuth, useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput } from 'react-native';
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
      await signUp.create({ emailAddress: email, password, unsafeMetadata: { role: 'user', name } });
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
      if (completeSignUp.status !== 'complete') throw new Error('Verificação não concluída.');

      const userId = completeSignUp.createdUserId;
      if (!userId) throw new Error('ID do usuário não foi retornado.');

      await setDoc(doc(db, 'users', userId), { name, email, role: 'user', teacherId: DEFAULT_TEACHER_ID, createdAt: serverTimestamp() });
      await signOut();

      Alert.alert('Verificação concluída', 'Sua conta foi criada com sucesso!', [{ text: 'OK', onPress: () => router.replace('/(auth)/loginUser') }]);
    } catch (err: any) {
      const msg = err.errors?.[0]?.message || err.message || 'Erro desconhecido na verificação';
      Alert.alert('Erro', msg);
    } finally { setIsLoading(false); }
  };

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.yellow }} behavior={Platform.OS === 'android' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.yellow }} keyboardShouldPersistTaps="handled">
          <Text style={globalStyles.title}>Verifique seu Email</Text>
          <TextInput style={globalStyles.input} placeholder="Código" value={code} onChangeText={setCode} editable={!isLoading} />
          <Pressable style={globalStyles.buttonRegisterUser} onPress={handleVerify} disabled={isLoading}>
            <Text style={buttonStyles.text}>{isLoading ? 'Verificando...' : 'Verificar'}</Text>
          </Pressable>
          {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.yellow  }} behavior={Platform.OS === 'android' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.yellow  }} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.push('/(auth)/loginUser')} style={globalStyles.backButton}>
          <Ionicons name="arrow-back" size={30} color={colors.black} />
        </Pressable>

        <Text style={globalStyles.title}>Cadastro do Aluno</Text>

        <TextInput style={globalStyles.input} placeholder="Primeiro Nome" value={name} onChangeText={setName} editable={!isLoading} />
        <TextInput style={globalStyles.input} placeholder="Digite seu Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={!isLoading} />
        <TextInput style={globalStyles.input} placeholder="Digite sua Senha" value={password} onChangeText={setPassword} secureTextEntry editable={!isLoading} />

        <Pressable style={globalStyles.buttonRegisterUser} onPress={handleSignUp} disabled={isLoading}>
          <Text style={buttonStyles.text}>{isLoading ? 'Carregando...' : 'Cadastrar-se'}</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/(auth)/loginUser')}>
          <Text style={globalStyles.textButtonCad}>Já tem uma conta? Faça Login</Text>
          {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
