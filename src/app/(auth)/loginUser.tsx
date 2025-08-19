import colors from "@/styles/colors";
import globalStyles from "@/styles/styles";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";

export default function LoginUser() {
    const { isLoaded, setActive, signIn } = useSignIn();
    const { isSignedIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
      if (isSignedIn) {
        router.replace('/(user)/home');
      }
    }, [isSignedIn]);

    async function handleSignIn() {
        if (!isLoaded) return;
        if (!email || !password) {
          alert("Por favor, preencha todos os campos");
          return;
        }

        setIsLoading(true);
        try {
            const signinUser = await signIn.create({
                identifier: email,
                password: password,
            });

            await setActive({ session: signinUser.createdSessionId });
            
        } catch (err: any) {
            if (__DEV__) {
                console.error("Erro detalhado:", JSON.stringify(err, null, 2));
            }
        } finally {
            setIsLoading(false);
        }
    }
    
    if (!isLoaded) return null;

    return (
        <View style={globalStyles.container}>

            <Pressable
                onPress={() => router.push("/(public)/onBoarding")}
                style={globalStyles.backButton}
            >
                <Ionicons name="arrow-back" size={30} color={colors.black} />
            </Pressable>

            <Text style={globalStyles.title}>Trust Fitness App</Text>
            <Text style={globalStyles.subtitle}>Aluno</Text>
            
            <TextInput
                autoCapitalize="none"
                placeholder="Digite seu email..."
                style={globalStyles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TextInput
                autoCapitalize="none"
                placeholder="Digite sua senha..."
                style={globalStyles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Pressable style={globalStyles.buttonOnBoarding} onPress={handleSignIn}>
                <Text style={globalStyles.buttonText}>Entrar</Text>
            </Pressable>

            {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}

            <Link href="/(auth)/registerUser" asChild>
                <Pressable style={globalStyles.button}>
                    <Text style={globalStyles.textButton}>Ainda não possui uma conta? Cadastre-se</Text>
                </Pressable>
            </Link>
        </View>
    );
}