import { useAuth } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Pressable } from "react-native";

function LogoutButton(){
    const {signOut} = useAuth();

    function logout(){
        signOut();
    }

    return(
        <Pressable onPress={logout}>
            <Feather name="log-out" size={24} color="#FFF" />
        </Pressable>
    )
}

export default function StackPage(){

    const { isSignedIn } = useAuth()

    return(
        <Stack
        screenOptions={{
            headerShown:false
        }}
        >
            <Stack.Screen
                name="home"
                options={{
                   headerShown: false
                }}
                redirect={!isSignedIn}
            />
            <Stack.Screen
                name="profile"
                options={{
                    headerShown: false,
                    headerRight: () => <LogoutButton/>
                }}
                redirect={!isSignedIn}
            />
        </Stack>
    )
}
