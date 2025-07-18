import { StyleSheet, View } from "react-native";

export default function Index(){
    return(
        <View style={styles.container}></View>
    )
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