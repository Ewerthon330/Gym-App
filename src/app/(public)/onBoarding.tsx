import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function onBoarding(){
    
    return(
        <View style={styles.container}>
            <Text style={styles.title1}>Trust Fitness App</Text>
            <Text style={styles.title2}>Seu app de treino</Text>

               <Pressable 
                    style={[styles.button, {marginVertical: 5}]}
                    onPress={() => router.push("/(auth)/loginUser")}
                    >
                    <Text style={styles.buttonText}>Aluno</Text>
                </Pressable>

                <Pressable 
                    style={[styles.button, {marginVertical: 5}]}
                    onPress={() => router.push("/(auth)/loginTeacher")}
                    >
                    <Text style={styles.buttonText}>Professor</Text>
                </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    title1: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 50,
        fontStyle:"italic",
        marginBottom: 14,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    button:{
        backgroundColor: '#121212',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    title2: {
        textAlign: "center",
        fontWeight: "normal",
        fontSize: 20,
        marginBottom: 14,
    },
    text:{
        margin: 8,
        alignItems: "center",
    }
})