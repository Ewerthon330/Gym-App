import globalStyles from "@/styles/styles";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function onBoarding(){
    
    return(
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Trust Fitness App</Text>

               <Pressable 
                    style={globalStyles.buttonOnBoarding}
                    onPress={() => router.push("/(auth)/loginUser")}
                    >
                    <Text style={globalStyles.buttonText}>Aluno</Text>
                </Pressable>

                <Pressable 
                    style={globalStyles.buttonOnBoarding}
                    onPress={() => router.push("/(auth)/loginTeacher")}
                    >
                    <Text style={globalStyles.buttonText}>Professor</Text>
                </Pressable>
        </View>
    )
}