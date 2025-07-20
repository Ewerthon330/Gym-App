import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";

export default function AlunoLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) return null;

  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: "Home Aluno",
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
