import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Profile() {
  const { user } = useUser();
  const router = useRouter();
  const { signOut } = useAuth()
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    
    if (user && user.unsafeMetadata) {
      const metadata = user.unsafeMetadata as {
        firstName?: string;
        lastName?: string;
      };

      setFirstName(metadata.firstName ?? "");
      setLastName(metadata.lastName ?? "");
    } else if (user) {
      // fallback para fullName dividido
      const names = (user.fullName || "").split(" ");
      setFirstName(names[0] || "");
      setLastName(names.slice(1).join(" ") || "");
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(public)/onBoarding");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair.");
      console.error("Erro no logout:", error);
    }
  };


  async function handleUpdateProfile() {
    try {
      if (!user) {
        Alert.alert("Erro", "Usuário não carregado.");
        return;
      }

      // Atualiza usando unsafeMetadata (melhor suporte no mobile)
      await user.update({
        unsafeMetadata: {
          firstName,
          lastName,
        },
      });

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      router.replace("/(user)/home"); // volta para home atualizada
    } catch (err: any) {
      console.error("Erro ao atualizar perfil:", err);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    }
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Carregando usuário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Bem-vindo {firstName} {lastName}
      </Text>

      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Digite seu primeiro nome..."
        style={styles.input}
      />
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        placeholder="Digite seu sobrenome..."
        style={styles.input}
      />

      <Button
        title="Atualizar perfil"
        onPress={handleUpdateProfile}
        color="#121212"
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title="Voltar"
          onPress={() => router.back()}
          color="#777"
      />
      <View style={{margin: 10}}>
        <Button
            title="Sair"
            onPress={handleLogout}
            color="#777"
        />
      </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 40
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
  text: {
    textAlign: "center",
    marginBottom: 20,
  },
});
