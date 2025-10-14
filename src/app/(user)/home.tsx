import colors from '@/styles/colors';
import { fonts, useAppFonts } from '@/styles/fonts';
import globalStyles from '@/styles/styles';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  Linking,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { getUserWorkouts } from '../../services/api';
import { db } from '../../services/firebase';

const initialLayout = { width: Dimensions.get('window').width };
const diasSemana = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

interface Treino {
  name: string;
  videoUrl: string;
  day: string;
  volume: string;
  rest: string;
}

export default function Home() {
  const { user } = useUser();
  const [index, setIndex] = useState(0);
  const [routes] = useState(
    diasSemana.map((dia) => ({ key: dia, title: dia.slice(0, 3).toUpperCase() }))
  );

  const [treinosPorDia, setTreinosPorDia] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const { signOut } = useAuth();

  const [menuAberto, setMenuAberto] = useState(false);
  const [exerciciosFeitos, setExerciciosFeitos] = useState<Record<string, boolean>>({});
  const fontsLoaded = useAppFonts();

  // animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(150)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const abrirMenu = () => {
    setMenuAberto(true);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(overlayAnim, { toValue: 0.5, duration: 250, useNativeDriver: true }),
    ]).start();
  };

  const fecharMenu = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 150, duration: 200, useNativeDriver: true }),
      Animated.timing(overlayAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setMenuAberto(false));
  };

  const toggleMenu = () => (menuAberto ? fecharMenu() : abrirMenu());

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/loginUser');
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  const toggleFeito = (treinoName: string) => {
    setExerciciosFeitos((prev) => ({
      ...prev,
      [treinoName]: !prev[treinoName],
    }));
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Sair do app',
          'Você realmente deseja sair?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Sim', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: true }
        );
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    const carregarTreinos = async () => {
      try {
        if (!user?.id) return;

        const userDocRef = doc(db, 'users', user.id);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().name);
        } else {
          setUserName('Usuário');
        }

        const treinos = await getUserWorkouts(user.id);
        const agrupado: Record<string, any[]> = {};
        diasSemana.forEach((dia) => (agrupado[dia] = []));
        treinos.forEach((treino: Treino) => {
          agrupado[treino.day]?.push(treino);
        });
        setTreinosPorDia(agrupado);
      } catch (err) {
        console.error('Erro ao carregar treinos:', err);
      } finally {
        setLoading(false);
      }
    };
    carregarTreinos();
  }, [user]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    const treinos = treinosPorDia[route.key] || [];
    return (
      <FlatList
        style={globalStyles.containerStyle}
        data={treinos}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item: treino }) => (
          <View style={globalStyles.card}>
            <Pressable
              onPress={() => toggleFeito(treino.name)}
              style={{
                marginRight: 10,
                width: 22,
                height: 22,
                borderRadius: 11,
                borderWidth: 2,
                borderColor: colors.black,
                alignItems: 'center',
                justifyContent: 'center',
                left: 330,
                top: 128,
                backgroundColor: exerciciosFeitos[treino.name] ? colors.green : 'transparent',
              }}
            >
              {exerciciosFeitos[treino.name] && (
                <Ionicons name="checkmark" size={14} color={colors.white} />
              )}
            </Pressable>

            <Text style={globalStyles.textNameExercise}>{treino.name}</Text>
            <Text style={globalStyles.volume}>Volume:</Text>
            <Text style={globalStyles.textVolumeExercise}>{treino.volume}</Text>
            <Text style={globalStyles.rest}>Descanso:</Text>
            <Text style={globalStyles.textRestExercise}>{treino.rest}</Text>

            <Pressable
              style={globalStyles.buttonShowVideo}
              onPress={() => Linking.openURL(treino.videoUrl)}
            >
              <Text style={globalStyles.textShowVideo}>Ver execução</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text
            style={{
              fontStyle: 'italic',
              color: colors.lightGray,
              justifyContent: 'center',
              left: 15,
            }}
          >
            Nenhum treino cadastrado para este dia.
          </Text>
        }
      />
    );
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.yellow} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.yellow }}>
      <Text style={globalStyles.bemVindo}>Olá, {userName || 'Usuário'}</Text>

      <Pressable
        onPress={toggleMenu}
        style={{
          position: 'absolute',
          top: 60,
          right: 20,
          zIndex: 10,
          padding: 5,
        }}
      >
        <Ionicons name="menu" size={28} color="black" />
      </Pressable>

      <View style={globalStyles.viewHomeUser}>
        <Text style={globalStyles.textHomeUser}>Rotina de Treinos</Text>
      </View>

      {menuAberto && (
        <TouchableWithoutFeedback onPress={fecharMenu}>
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: colors.black,
              opacity: overlayAnim,
              zIndex: 9,
            }}
          />
        </TouchableWithoutFeedback>
      )}

      {menuAberto && (
        <Animated.View
          style={{
            ...globalStyles.menuUser,
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }}
        >
          {/* Botão de contato via WhatsApp */}
          <Pressable
            onPress={async () => {
              const phoneNumber = "5511984402797"; // DDI + DDD + número
              const message = "Olá, gostaria de falar sobre os treinos.";

              const appUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
              const webUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

              try {
                const supported = await Linking.canOpenURL(appUrl);

                if (supported) {
                  await Linking.openURL(appUrl);
                } else {
                  // fallback para navegador → redireciona para o app se estiver instalado
                  await Linking.openURL(webUrl);
                }
              } catch {
                Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
              }
            }}
            style={{
              alignItems: 'center',
              alignSelf: "center",
              width: 80,
              position: 'absolute',
              bottom: 70,
              left: 85,
              zIndex: 1,
            }}
          >
            <Text style={{ ...globalStyles.contact, fontFamily: fonts.merienda }}>
              Contato
            </Text>
            <Ionicons name="call-outline" size={25} color={colors.yellow} />
          </Pressable>

          {/* Botão de logout */}
          <Pressable
            onPress={handleLogout}
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              width: 80,
              position: 'absolute',
              top: 50,
              right: 15,
              zIndex: 1,
            }}
          >
            <Text style={{ ...globalStyles.logoutUser, fontFamily: fonts.merienda }}>
              Sair
            </Text>
            <Ionicons name="log-out-outline" size={25} color={colors.red} />
          </Pressable>
        </Animated.View>
      )}

      <View style={globalStyles.containerHomeUser}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              scrollEnabled
              indicatorStyle={{ backgroundColor: '#FFCC00' }}
              style={{ backgroundColor: colors.darkGray }}
              activeColor="#FFCC00"
              inactiveColor="#E0E0E0"
            />
          )}
        />
      </View>
    </View>
  );
}
