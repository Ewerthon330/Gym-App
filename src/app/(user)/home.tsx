import { Label, Text } from "@react-navigation/elements";
import { Pressable, StyleSheet, View } from "react-native";

export default function homeUser() {
  return (
    <View style={styles.container}>
                <Label style={styles.labelTop}>
                </Label>
    
                <View style={styles.avatar}>
                </View>
    
                <View style={styles.text}>
                    <Text>Siga o videos para melhorar sua execução</Text>
                </View>
    
                <Pressable style ={styles.card1}>
                </Pressable>
    
                
               
            </View>
  );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#808080"
    },
    text:{
        alignItems:"center",
        fontWeight: "bold",
        fontSize: 50,
        
        marginBottom: 200
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 150,
        backgroundColor: "#d37400ff",
        bottom: 770,
        position: "absolute",
        marginHorizontal: 10,
        
    },
    card1: {
        alignItems: "center",
        justifyContent:"center",
        backgroundColor: "#D3D3D3",
        width: 330,
        height: 60,
        borderRadius: 10,
        marginHorizontal: 40,
        position: "absolute"
    },
    labelTop: {
        width: "100%",
        height: 90,
        bottom: 760,
        backgroundColor: "#696969",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 10},
        shadowOpacity: 3,
        shadowRadius: 3,
        position: "absolute"
    }



})