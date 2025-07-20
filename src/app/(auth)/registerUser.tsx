import { useSignUp } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Register() {
  const { isLoaded, setActive, signUp } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingEmailCode, setPendingEmailCode] = useState(false);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignUp() {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress: email,
        password: password,
    });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingEmailCode(true);
    } catch (e: any) {
      const message = e?.errors?.[0]?.message ?? "Erro ao criar conta";
      Alert.alert("Erro", message);
      if (__DEV__) {
        console.log("ERRO NO CADASTRO:", JSON.stringify(e, null, 2));
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyUser() {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      const completeSignup = await signUp?.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignup.createdSessionId });
    } catch (e: any) {
      const message = e?.errors?.[0]?.message ?? "Erro ao verificar código";
      Alert.alert("Erro", message);
      if (__DEV__) {
        console.log("ERRO NA VERIFICAÇÃO:", JSON.stringify(e, null, 2));
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
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
            editable={!isLoading}
          />

          <TextInput
            autoCapitalize="none"
            placeholder="Digite sua senha..."
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          <Button
            title={isLoading ? "Carregando..." : "Criar uma conta"}
            color="#121212"
            onPress={handleSignUp}
            disabled={isLoading}
          />

          {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}

          <Link href="/(auth)/loginUser" asChild>
            <Pressable style={styles.button} disabled={isLoading}>
              <Text>Já possui uma conta? Faça o login</Text>
            </Pressable>
          </Link>
        </View>
      )}

      {pendingEmailCode && (
        <View>
          <Text style={styles.title}>Verifique seu email</Text>
          <Text style={{ textAlign: "center", marginBottom: 10 }}>
            Digite o código enviado para {email}
          </Text>

          <TextInput
            autoCapitalize="none"
            placeholder="Digite seu código..."
            style={styles.input}
            value={code}
            onChangeText={setCode}
            editable={!isLoading}
          />

          <Button
            title={isLoading ? "Verificando..." : "Ativar conta"}
            color="#121212"
            onPress={handleVerifyUser}
            disabled={isLoading}
          />

          {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
        </View>
      )}
    </View>
  );
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
    backgroundColor: "#fff",
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
});
