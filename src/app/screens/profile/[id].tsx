import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Linking,
  Modal,
  Pressable,
  Text,
  TextInput,
  View
} from 'react-native';

import { useUser } from '@clerk/clerk-expo';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { TabBar, TabView } from 'react-native-tab-view';

import { createWorkout, deleteWorkout, getUserWorkouts, Treino } from '@/services/api';
import { db } from '@/services/firebase';
import colors from '@/styles/colors';
import { fonts, useAppFonts } from '@/styles/fonts';
import globalStyles from '@/styles/styles';
import { Ionicons } from '@expo/vector-icons';

const initialLayout = { width: Dimensions.get('window').width };
const diasSemana = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const safeId = Array.isArray(id) ? id[0] : id;

  const { user, isLoaded } = useUser();

  const [index, setIndex] = useState(0);
  const [routes] = useState(
    diasSemana.map((dia) => ({ key: dia, title: dia.slice(0, 3).toUpperCase() }))
  );

  const [treinosPorDia, setTreinosPorDia] = useState<Record<string, Treino[]>>({});
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [novoTreino, setNovoTreino] = useState({
    name: '',
    videoUrl: '',
    day: '',
    volume: '',
    rest: '',
  });

  const fontsLoaded = useAppFonts();

  useEffect(() => {
    const carregarDados = async () => {
      if (!safeId) return;
      setLoading(true);

      try {
        // Busca nome do aluno
        const userDocRef = doc(db, 'users', safeId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().name);
        } else {
          setUserName('Usuário');
        }

        // Busca treinos
        const treinos = await getUserWorkouts(safeId);
        const agrupado: Record<string, Treino[]> = {};
        diasSemana.forEach((dia) => (agrupado[dia] = []));
        treinos.forEach((treino: Treino) => {
          agrupado[treino.day]?.push(treino);
        });
        setTreinosPorDia(agrupado);
      } catch (err) {
        Alert.alert('Erro ao carregar dados');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [safeId]);

  async function adicionarTreino() {
    if (
      !novoTreino.name ||
      !novoTreino.day ||
      !novoTreino.videoUrl ||
      !novoTreino.volume ||
      !novoTreino.rest
    ) {
      Alert.alert('Preencha todos os campos do treino');
      return;
    }

    try {
      await createWorkout({
        userId: safeId,
        name: novoTreino.name,
        videoUrl: novoTreino.videoUrl,
        day: novoTreino.day.toLowerCase(),
        volume: novoTreino.volume,
        rest: novoTreino.rest,
      });

      setNovoTreino({ name: '', videoUrl: '', day: '', volume: '', rest: '' });
      setModalVisible(false);

      // Atualiza treinos na tela
      const treinos = await getUserWorkouts(safeId);
      const agrupado: Record<string, Treino[]> = {};
      diasSemana.forEach((dia) => (agrupado[dia] = []));
      treinos.forEach((treino: Treino) => {
        agrupado[treino.day]?.push(treino);
      });
      setTreinosPorDia(agrupado);
    } catch (e) {
      Alert.alert('Erro ao adicionar treino');
      console.error(e);
    }
  }

 const renderScene = ({ route }: { route: { key: string } }) => {
  const treinos = treinosPorDia[route.key] || [];

  const handleRemoveTreino = (treinoId: string) => {
    Alert.alert('Remover Treino', 'Tem certeza que deseja remover este treino?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteWorkout(safeId, treinoId);

            setTreinosPorDia((prev) => {
              const novo = { ...prev };
              diasSemana.forEach((dia) => {
                if (novo[dia]) {
                  novo[dia] = novo[dia].filter((t) => t.id !== treinoId);
                }
              });
              return novo;
            });
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível remover o treino.');
            console.error(error);
          }
        },
      },
    ]);
  };

  return (
    <FlatList
      data={treinos}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 10 }}
      renderItem={({ item: treino }) => (
        <View style={globalStyles.card}>
          <Text style={globalStyles.textNameExerciseId}>{treino.name}</Text>

          {treino.volume ? (
            <Text style={globalStyles.textVolumeExerciseId}>{treino.volume}</Text>
          ) : null}
          <Text
            style={{
              fontFamily: fonts.roboto700B,
              left: 10,
              fontSize: 17,
              color: colors.green,
              textDecorationLine: 'underline',
            }}
          >
            Volume:
          </Text>

          {treino.rest ? (
            <Text style={globalStyles.textRestExerciseId}>{treino.rest}</Text>
          ) : null}
          <Text
            style={{
              fontFamily: fonts.roboto700B,
              left: 10,
              bottom: 15,
              fontSize: 17,
              color: colors.red,
              textDecorationLine: 'underline',
            }}
          >
            Descanso:
          </Text>

          {treino.videoUrl ? (
            <Pressable
              style={globalStyles.buttonShowVideoProfile}
              onPress={() => Linking.openURL(treino.videoUrl)}
            >
              <Text style={globalStyles.textShowVideoProfile}>Revisar vídeo</Text>
            </Pressable>
          ) : (
            <Text
              style={{ fontStyle: 'italic', color: colors.lightGray, marginTop: 5 }}
            >
              Vídeo não disponível
            </Text>
          )}

          {isLoaded && user?.unsafeMetadata?.role === 'teacher' && (
            <Pressable
              onPress={() => handleRemoveTreino(treino.id)}
              style={globalStyles.removeButtonExercise}
            >
              <Text style={{ color: colors.lightGray, fontWeight: 'bold' }}>
                Remover
              </Text>
            </Pressable>
          )}
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
      ListFooterComponent={<View style={{ height: 100 }} />} // espaço extra
    />
  );
};


  if (!safeId) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.errorText}>ID do aluno inválido.</Text>
      </View>
    );
  }

  if (!fontsLoaded || loading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.yellow} />
      </View>
    );
  }

  return (
    <View style={globalStyles.containerProfileId}>
      <Pressable
        onPress={() => router.push('/(teacher)/home')}
        style={{
          position: 'absolute',
          top: 60,
          left: 20,
          zIndex: 1,
        }}
      >
        <Ionicons name="arrow-back" size={30} color={colors.black} />
      </Pressable>
      <Text style={globalStyles.titleProfileId}>Perfil de {userName}</Text>

      <View style={globalStyles.containerProfileUser}>
        <Text style={globalStyles.textHomeUser}>Treinos Prescritos</Text>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              scrollEnabled
              indicatorStyle={{ backgroundColor: colors.yellow }}
              style={{ backgroundColor: colors.darkGray }}
              activeColor="#FFCC00"
              inactiveColor="#E0E0E0"
            />
          )}
        />
      </View>

      {isLoaded && user?.unsafeMetadata?.role === 'teacher' && (
        <>
          <Pressable
            onPress={() => setModalVisible(true)}
            style={globalStyles.addExerciseButton}
          >
            <Text style={{ color: colors.black, fontFamily: fonts.vastShadow }}>
              + Treino
            </Text>
          </Pressable>

          <Modal visible={modalVisible} animationType="slide">
            <View style={globalStyles.modalContainer}>
              <Text style={globalStyles.sectionTitle}>Adicione um novo Treino</Text>

              <TextInput
                placeholder="Nome do exercício"
                style={globalStyles.input}
                value={novoTreino.name}
                onChangeText={(text) => setNovoTreino({ ...novoTreino, name: text })}
              />

              <TextInput
                placeholder="Volume de treino (ex: 4 séries de 10 repetições)"
                style={globalStyles.input}
                value={novoTreino.volume}
                onChangeText={(text) => setNovoTreino({ ...novoTreino, volume: text })}
              />

              <TextInput
                placeholder="Tempo de descanso (ex: 60s ou 1min)"
                style={globalStyles.input}
                value={novoTreino.rest}
                onChangeText={(text) => setNovoTreino({ ...novoTreino, rest: text })}
              />

              <TextInput
                placeholder="Dia da semana (ex: segunda)"
                style={globalStyles.input}
                value={novoTreino.day}
                onChangeText={(text) =>
                  setNovoTreino({ ...novoTreino, day: text.toLowerCase() })
                }
              />

              <TextInput
                placeholder="Link do vídeo (Google Drive)"
                style={globalStyles.input}
                value={novoTreino.videoUrl}
                onChangeText={(text) => setNovoTreino({ ...novoTreino, videoUrl: text })}
              />

              <Pressable onPress={adicionarTreino} style={globalStyles.saveButton}>
                <Text style={globalStyles.saveButtonText}>Salvar</Text>
              </Pressable>

              <Pressable
                onPress={() => setModalVisible(false)}
                style={[
                  globalStyles.saveButton,
                  { backgroundColor: colors.darkGray, marginTop: 10 },
                ]}
              >
                <Text style={globalStyles.cancelButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}
