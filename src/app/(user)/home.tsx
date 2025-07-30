// app/home.tsx
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Video } from 'expo-av';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { getUserWorkouts } from '../../services/api';

const initialLayout = { width: Dimensions.get('window').width };

const diasSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

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


  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/loginUser'); // ou a rota inicial que desejar
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  useEffect(() => {
    const carregarTreinos = async () => {
      try {
        if (!user?.id) return;

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
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {treinos.length > 0 ? (
          treinos.map((treino, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.titulo}>{treino.name}</Text>
              <Video
                source={{ uri: treino.videoUrl }}
                useNativeControls
                style={styles.video}
              />
            </View>
          ))
        ) : (
          <Text style={{ fontStyle: 'italic' }}>Nenhum treino cadastrado para este dia.</Text>
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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={styles.bemVindo}>
        Olá, {user?.firstName || 'Usuário'}!
      </Text>
      <Pressable
        onPress={handleLogout}
        style={{
          backgroundColor: '#ff3b30',
          padding: 10,
          borderRadius: 8,
          marginTop: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Sair</Text>
  </Pressable>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: 'black' }}
            style={{ backgroundColor: 'white' }}
            activeColor="black"
            inactiveColor="#888"
          />
        )}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  bemVindo: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  card: {
    marginBottom: 24,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#000',
  },
  header: {
  padding: 16,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

logout: {
  color: '#ff3b30',
  fontWeight: '600',
  fontSize: 16,
},

});
