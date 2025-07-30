import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../services/firebase';

export default function HomeProfessor() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const [alunos, setAlunos] = useState<any[]>([]);
  const [loadingAlunos, setLoadingAlunos] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const role = user?.unsafeMetadata?.role;

    if (role !== 'teacher') {
      Alert.alert('Acesso negado', 'Esta conta não tem permissão para acessar esta área.');
      router.replace('/(public)/onBoarding');
      return;
    }

    buscarAlunos(user.id);
  }, [isLoaded, user]);

  async function buscarAlunos(teacherId: string) {
    setLoadingAlunos(true);
    try {
      const alunosRef = collection(db, 'users'); // ✅ Agora busca na coleção "users"
      const q = query(
        alunosRef,
        where('role', '==', 'user'),
        where('teacherId', '==', teacherId)
      );
      const querySnapshot = await getDocs(q);

      const lista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlunos(lista);
    } catch (error) {
      Alert.alert('Erro ao buscar alunos');
      console.error('Erro ao buscar alunos:', error);
    } finally {
      setLoadingAlunos(false);
    }
  }

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(public)/onBoarding');
    } catch (error) {
      Alert.alert('Erro ao deslogar');
      console.error('Erro no logout:', error);
    }
  };

  if (!isLoaded || loadingAlunos) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Carregando alunos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoutContainer}>
        <Button title="Sair" onPress={handleLogout} color="#d9534f" />
      </View>

      <Text style={styles.title}>Meus Alunos</Text>

      <FlatList
        data={alunos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/screens/profile/[id]',
                params: { id: item.id },
              })
            }
          >
            <Text style={styles.nome}>{item.name ?? 'Aluno sem nome'}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Nenhum aluno cadastrado ainda.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoutContainer: { marginBottom: 10, alignItems: 'flex-end' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  nome: { fontSize: 18, fontWeight: '500' },
  email: { fontSize: 14, color: '#555' },
});
