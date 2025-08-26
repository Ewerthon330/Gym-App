import colors from '@/styles/colors';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      // anima o fade out do container do indicador antes de navegar
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        router.push('/(public)/onBoarding');
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("assets/images/LogoTrustFitness.png")}
        style={styles.image}
      />

      {/* Curva amarela topo */}
      <Svg
        width={200}
        height={250}
        viewBox="0 0 200 250"
        style={styles.topCurve}
      >
        <Path
          fill="#FFCC00"
          d="M0,0 C150,100 80,150 250,230 L200,0 Z"
        />
      </Svg>

      {/* Conteúdo central */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>Seu app de treino</Text>
        <Animated.View style={{ opacity: fadeAnim, top: 30, alignSelf: "center" }}>
          <ActivityIndicator size="large" color="#FFCC00" />
        </Animated.View>
      </View>

      {/* Curva amarela baixo */}
      <Svg
        width={200}
        height={250}
        viewBox="0 0 200 150"
        style={styles.bottomCurve}
      >
        <Path
          fill="#FFCC00"
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
  subtitle: {
    fontSize: 25,
    left: 5,
    alignSelf: "center",
    color: "#9b9b9bff",
    bottom: 40,
    textAlign: "center",
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
  image: {
    width: 400,
    height: 300,
    top: 270,
    alignSelf: "center",
  }
});
