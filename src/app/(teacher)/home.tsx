import { Text } from "@react-navigation/elements";
import { StyleSheet, View } from "react-native";

export default function homeTeacher() {
  return (
    <View style={styles.container}>
      <Text>Tela Inicial do Professor</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})