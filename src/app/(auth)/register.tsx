import { useSignUp } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { useState } from "react";
import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";


export default function Register(){

    const { isLoaded, setActive, signUp} = useSignUp();


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [pendingEmailCode, setPendingEmailCode] = useState(false);
    const [code, setCode] = useState ("")

    async function handleSignUp() {
    if (!isLoaded) return;

    try {
        console.log("Criando conta..."); // Debug
        const result = await signUp.create({
            emailAddress: email,
            password: password
        });
        
        console.log("Conta criada, status:", result.status); // Debug
        
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        console.log("Verificação de e-mail preparada"); // Debug
        
        setPendingEmailCode(true);
    } catch(e) {
        console.log("ERRO NO CADASTRO:", JSON.stringify(e, null, 2)); // Debug detalhado
    }
}

async function handleVerifyUser() {
    if(!isLoaded) return;

    try {
        console.log("Verificando código:", code); // Debug
        const completeSignup = await signUp?.attemptEmailAddressVerification({
            code
        });

        console.log("Resultado verificação:", completeSignup); // Debug
        
        await setActive({ session: completeSignup.createdSessionId });
        console.log("Sessão ativada"); // Debug
    } catch(e) {
        console.log("ERRO NA VERIFICAÇÃO:", JSON.stringify(e, null, 2)); // Debug detalhado
    }
}

    return(
        <View style={styles.container}>
            {!pendingEmailCode && (
                <View>
                    <Text style={styles.title}>Crie sua conta</Text>

                    <TextInput
                        autoCapitalize="none"
                        placeholder="Digite seu email..."
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
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
                            title="Criar uma conta"
                            color="#121212"
                            onPress={handleSignUp}
                        />

                        <Link href= "/(auth)/loginUser" asChild>
                            <Pressable style={styles.button}>
                                <Text>Já possuia uma conta? Faça o login</Text>
                            </Pressable>
                        </Link>
                </View>
            )}

            {pendingEmailCode &&(
                <View>
                    <Text style={styles.title}>Digite o código:</Text>
                    <TextInput
                        autoCapitalize="none"
                        placeholder="Digite seu código..."
                        style={styles.input}
                        value={code}
                        onChangeText={setCode}
                        />
                        <Button
                        title="Ativar conta"
                        color="#121212"
                        onPress={handleVerifyUser}
                        />
                </View>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 40,
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