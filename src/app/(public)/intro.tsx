import colors from '@/styles/colors';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function Intro() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/(public)/onBoarding');
    }, );

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>

      <Image
        source={require("assets/images/LogoTrustFitness.png")}
        style={styles.image}
      />

      <Svg
        width={200}
        height={250} 
        viewBox="0 0 200 250"
        style={styles.topCurve}
      >
        <Path
          fill="#eeb805ff"
          d="M0,0 C150,100 80,150 250,230 L200,0 Z"
        />
      </Svg>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Seu app de treino</Text>
      </View>

      <Svg
        width={200}
        height={250}
        viewBox="0 0 200 150"
        style={styles.bottomCurve}
      >
        <Path
          fill="#eeb805ff"
          d="M200,300 C200,110 90,150 0,-30 L0,200 Z"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.black,
  },
  subtitle: {
    fontSize: 25,
    color: colors.yellow,
    bottom: 60,
    left: 5,
    justifyContent: "center",
    alignContent: "center"
  },
  topCurve: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bottomCurve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  image:{
    width: 400,
    height: 300,
    top: 270,
    justifyContent: "center",
    alignContent: "center"
  }
});
