import colors from '@/styles/colors';
import { buttonStyles, useAppFonts } from '@/styles/fonts';
import globalStyles from '@/styles/styles';
import { useAuth, useSignIn, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput } from 'react-native';

export default function ProfessorSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();

  // 🔹 Carrega todas as fontes centralizadas
  const fontsLoaded = useAppFonts();

  // 🔹 Redireciona automaticamente quem já está logado como professor
  useEffect(() => {
    if (isSignedIn && isUserLoaded && user?.unsafeMetadata?.role === 'teacher') {
      router.replace('/(teacher)/home');
    }
  }, [isSignedIn, isUserLoaded, user]);

  const handleSignIn = async () => {
    if (!isLoaded) return;
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      const completeSignIn = await signIn.create({ identifier: email, password });
      await setActive({ session: completeSignIn.createdSessionId });

      // 🔹 Atualiza role do usuário caso ainda não tenha
      if (user && !user.unsafeMetadata?.role) {
        await user.update({ unsafeMetadata: { role: 'teacher' } });
      }
    } catch (err: any) {
      const errorMessage = err?.errors?.[0]?.message ?? "Erro inesperado.";
      Alert.alert("Erro", errorMessage);
      if (__DEV__) console.log("Erro no login:", JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !isUserLoaded || !fontsLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.yellow }}
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: colors.yellow }} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.push('/(public)/onBoarding')} style={globalStyles.backButton}>
          <Ionicons name="arrow-back" size={30} color={colors.black} />
        </Pressable>

        <Text style={globalStyles.title}>Personal Trust</Text>
        <Text style={{ ...globalStyles.subtitle, fontFamily: 'Merienda_400Regular' }}>Professor</Text>

        <TextInput style={globalStyles.input}
          placeholder="Digite seu email..."
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none" />
        <TextInput style={globalStyles.input}
          placeholder="Digite sua senha..."
          value={password}
          onChangeText={setPassword}
          secureTextEntry />

        <Pressable style={buttonStyles.onBoarding} onPress={handleSignIn}>
          <Text style={buttonStyles.text}>Entrar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
