import colors from '@/styles/colors';
import globalStyles from '@/styles/styles';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
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

  // Animações para menu e overlay
  const fadeAnim = useRef(new Animated.Value(0)).current; // opacidade menu
  const slideAnim = useRef(new Animated.Value(150)).current; // slide menu da direita
  const overlayAnim = useRef(new Animated.Value(0)).current; // opacidade overlay

  const abrirMenu = () => {
    setMenuAberto(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0.5, // meio transparente
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fecharMenu = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 150,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setMenuAberto(false));
  };

  const toggleMenu = () => {
    if (menuAberto) {
      fecharMenu();
    } else {
      abrirMenu();
    }
  };

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

  useEffect(() => {
    const carregarTreinos = async () => {
      try {
        if (!user?.id) return;

        const userDocRef = doc(db, 'users', user.id);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().name);
        } else {
          console.log('Documento do usuário não encontrado');
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
      <ScrollView style={globalStyles.containerStyle}>
        {treinos.length > 0 ? (
          treinos.map((treino, index) => (
            <View key={index} style={globalStyles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                      left: 318,
                      top: 55,
                      backgroundColor: exerciciosFeitos[treino.name] ? colors.green : 'transparent',
                    }}
                  >
                    {exerciciosFeitos[treino.name] && (
                      <Ionicons name="checkmark" size={14} color={colors.white} />
                    )}
                  </Pressable>
                  <Text style={globalStyles.textNameExercise}>{treino.name}</Text>
                </View>

                <Pressable style={globalStyles.buttonShowVideo} onPress={() => Linking.openURL(treino.videoUrl)}>
                  <Text style={globalStyles.textShowVideo}>Ver execução</Text>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ fontStyle: 'italic', color: colors.lightGray, justifyContent: "center", left: 15 }}>
            Nenhum treino cadastrado para este dia.
          </Text>
        )}
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.yellow }}>
      <Text style={globalStyles.bemVindo}>
        Olá, {userName || 'Usuário'}
      </Text>

      <Pressable
        onPress={toggleMenu}
        style={{
          position: 'absolute',
          top: 50,
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
      {/* Overlay semitransparente para escurecer o fundo e fechar menu ao tocar */}
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
            position: 'absolute',
            top: 100,
            right: 0,
            width: '40%',
            height: '15%',
            backgroundColor: colors.lightGray,
            zIndex: 10,
            paddingTop: 80,
            paddingHorizontal: 20,
            shadowColor: colors.lightGray,
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            elevation: 5,
            borderRadius: 8,
            borderColor: colors.black,
            borderWidth: 2,
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }}
        >
          <Pressable
            onPress={() => {
              const phoneNumber = '5511984402797';
              const url = `https://wa.me/${phoneNumber}`;

              Linking.canOpenURL(url)
                .then((supported) => {
                  if (supported) {
                    Linking.openURL(url);
                  } else {
                    alert('Não foi possível abrir o WhatsApp');
                  }
                })
                .catch(() => alert('Erro ao tentar abrir o WhatsApp'));
            }}
            style={{
              alignItems: 'center',
              width: 80,
              position: 'absolute',
              left: 80,
              zIndex: 1
            }}
          >
            <Text style={globalStyles.contact}>Contato</Text>
            <Ionicons name='call-outline' size={25} color={colors.black} />
          </Pressable>
          <Pressable
            onPress={handleLogout}
            style={{
              alignItems: 'center',
              alignSelf: "center",
              width: 80,
              position: 'absolute',
              top: 60,
              right: 20,
              zIndex: 1
            }}
          >
            <Text style={globalStyles.logoutUser}>Sair</Text>
            <Ionicons name='log-out-outline' size={25} color={colors.red} />
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
