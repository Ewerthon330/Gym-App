import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginUser() {
    const { isLoaded, setActive, signIn } = useSignIn();
    const { isSignedIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
      if (isSignedIn) {
        router.replace('/(user)/home'); // Altere para sua rota principal
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
        <View style={styles.container}>
            <Text style={styles.title1}>Bem Vindo Aluno</Text>
            
            <TextInput
                autoCapitalize="none"
                placeholder="Digite seu email..."
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TextInput
                autoCapitalize="none"
                placeholder="Digite sua senha..."
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button
                title={isLoading ? "Carregando..." : "Acessar"}
                color="#121212"
                onPress={handleSignIn}
                disabled={isLoading}
            />

            {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}

            <Link href="/(auth)/registerUser" asChild>
                <Pressable style={styles.button}>
                    <Text>Ainda não possui uma conta? Cadastre-se</Text>
                </Pressable>
            </Link>
        </View>
    );
}

// Seus estilos permanecem os mesmos

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0', // Cor de fundo cinza claro
        justifyContent: "center",
        padding: 20
    },
    title1: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 50,
        fontStyle:"italic",
        marginBottom: 14,
    },
    title2: {
        textAlign: "center",
        fontWeight: "normal",
        fontSize: 15,
        marginBottom: 14,
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderColor: "#121212",
        borderRadius: 8,
        padding: 10,
        backgroundColor:"#fff"
    },
    button: {
        margin: 8,
        alignItems: "center",
    },
})