import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { db, storage } from '@/services/firebase'; // ajuste conforme seu projeto
import { useUser } from '@clerk/clerk-expo';
import { useLocalSearchParams } from 'expo-router';

interface Treino {
  id: string;
  name: string;
  videoUrl: string;
  day: string;
}

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const safeId = Array.isArray(id) ? id[0] : id;

  const { user, isLoaded } = useUser();

  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoTreino, setNovoTreino] = useState({ name: '', videoUrl: '', day: '' });
  const [uploading, setUploading] = useState(false);
  const [loadingTreinos, setLoadingTreinos] = useState(false);

  useEffect(() => {
    if (safeId) carregarTreinos();
  }, [safeId]);

  async function carregarTreinos() {
    setLoadingTreinos(true);
    try {
      const snapshot = await getDocs(collection(db, 'alunos', safeId, 'treinos'));
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Treino[];
      setTreinos(lista);
    } catch (e) {
      Alert.alert('Erro ao buscar treinos');
      console.error('Erro ao buscar treinos:', e);
    } finally {
      setLoadingTreinos(false);
    }
  }

  async function escolherVideo() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos da permissão para acessar a galeria');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.7,
    });

    if (result.canceled) {
      return;
    }

    const localUri = result.assets[0].uri;
    const filename = localUri.split('/').pop();
    if (!filename) return;

    setUploading(true);
    try {
      const response = await fetch(localUri);
      const blob = await response.blob();

      const videoRef = ref(storage, `videos/${safeId}/${filename}`);

      await uploadBytes(videoRef, blob);

      const url = await getDownloadURL(videoRef);

      setNovoTreino((prev) => ({ ...prev, videoUrl: url }));

      Alert.alert('Upload concluído', 'Vídeo carregado com sucesso!');
    } catch (error) {
      Alert.alert('Erro no upload', 'Não foi possível carregar o vídeo.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  async function adicionarTreino() {
    if (!novoTreino.name || !novoTreino.day || !novoTreino.videoUrl) {
      Alert.alert('Preencha todos os campos do treino');
      return;
    }

    try {
      await addDoc(collection(db, 'alunos', safeId, 'treinos'), novoTreino);
      setNovoTreino({ name: '', videoUrl: '', day: '' });
      setModalVisible(false);
      carregarTreinos();
    } catch (e) {
      Alert.alert('Erro ao adicionar treino');
      console.error(e);
    }
  }

  async function excluirTreino(idTreino: string) {
    try {
      await deleteDoc(doc(db, 'alunos', safeId, 'treinos', idTreino));
      carregarTreinos();
    } catch (e) {
      Alert.alert('Erro ao excluir treino');
      console.error(e);
    }
  }

  if (!safeId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>ID do aluno inválido.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Treinos Prescritos</Text>

      {loadingTreinos ? (
        <ActivityIndicator size="large" />
      ) : treinos.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum treino cadastrado.</Text>
      ) : (
        treinos.map((treino) => (
          <View key={treino.id} style={styles.workoutCard}>
            <Text style={styles.workoutName}>{treino.name}</Text>
            <Text>{treino.day}</Text>
            {treino.videoUrl ? (
              <Text style={{ color: 'blue' }} onPress={() => {
                // opcional: abrir vídeo no navegador
              }}>
                {treino.videoUrl}
              </Text>
            ) : null}
            {isLoaded && user?.unsafeMetadata?.role === 'teacher' && (
              <Pressable onPress={() => excluirTreino(treino.id)}>
                <Text style={{ color: 'red', marginTop: 4 }}>Excluir</Text>
              </Pressable>
            )}
          </View>
        ))
      )}

      {isLoaded && user?.unsafeMetadata?.role === 'teacher' && (
        <>
          <Pressable onPress={() => setModalVisible(true)} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Treino</Text>
          </Pressable>

          <Modal visible={modalVisible} animationType="slide">
            <View style={styles.modalContainer}>
              <Text style={styles.sectionTitle}>Novo Treino</Text>
              <TextInput
                placeholder="Nome do exercício"
                style={styles.input}
                value={novoTreino.name}
                onChangeText={(text) => setNovoTreino({ ...novoTreino, name: text })}
              />
              <TextInput
                placeholder="Dia da semana (ex: segunda)"
                style={styles.input}
                value={novoTreino.day}
                onChangeText={(text) => setNovoTreino({ ...novoTreino, day: text.toLowerCase() })}
              />

              <Pressable
                style={styles.uploadButton}
                onPress={escolherVideo}
                disabled={uploading}
              >
                <Text style={styles.uploadButtonText}>
                  {uploading ? 'Enviando vídeo...' : 'Selecionar Vídeo do Aparelho'}
                </Text>
              </Pressable>

              {novoTreino.videoUrl ? (
                <Text style={{ marginTop: 8, color: 'green' }}>
                  Vídeo carregado!
                </Text>
              ) : null}

              <Button title="Salvar" onPress={adicionarTreino} />
              <Button
                title="Cancelar"
                onPress={() => setModalVisible(false)}
                color="gray"
              />
            </View>
          </Modal>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  workoutCard: {
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    borderColor: '#ccc',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
