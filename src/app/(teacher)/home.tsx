import colors from '@/styles/colors';
import globalStyles from '@/styles/styles';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { removeUser as removeUserAPI } from '../../services/api';
import { db } from '../../services/firebase';

export default function HomeProfessor() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const [userName, setUserName] = useState('');
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loadingAlunos, setLoadingAlunos] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);

  // Animação
  const slideAnim = useRef(new Animated.Value(200)).current; // menu fora da tela
  const fadeAnim = useRef(new Animated.Value(0)).current; // menu opacidade
  const overlayAnim = useRef(new Animated.Value(0)).current; // overlay opacidade

  const abrirMenu = () => {
    setMenuAberto(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0.5,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fecharMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 200,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
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

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const role = user?.unsafeMetadata?.role;

    if (role !== 'teacher') {
      Alert.alert('Acesso negado', 'Esta conta não tem permissão para acessar esta área.');
      router.replace('/(public)/onBoarding');
      return;
    }

    buscarNomeProfessor(user.id);
    buscarAlunos(user.id);
  }, [isLoaded, user]);

  async function buscarNomeProfessor(teacherId: string) {
    try {
      const userDocRef = doc(db, 'users', teacherId);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        setUserName(userSnap.data().name);
      } else {
        setUserName('Professor');
      }
    } catch (error) {
      console.error('Erro ao buscar nome do professor:', error);
      setUserName('Professor');
    }
  }

  async function buscarAlunos(teacherId: string) {
    setLoadingAlunos(true);
    try {
      const alunosRef = collection(db, 'users');
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

  // Função para remover aluno com confirmação e logs
  const handleRemoveUser = (userId: string) => {
    Alert.alert(
      'Remover Aluno',
      'Tem certeza que deseja remover este aluno? Isso apagará o perfil e todos os treinos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            console.log("🔹 Iniciando remoção do aluno:", userId);

            try {
              await removeUserAPI(userId);
              console.log("✅ removeUserAPI finalizou");

              // Atualiza lista local
              setAlunos(prev => prev.filter(a => a.id !== userId));
              Alert.alert('Sucesso', 'Aluno removido com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover o aluno.');
              console.error('❌ Erro ao remover aluno:', error);
            }
          },
        },
      ]
    );
  };

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
      <View style={globalStyles.loadingContainerHomeTeacher}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Carregando alunos...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.containerHomeTeacher}>
      <Pressable
        onPress={toggleMenu}
        style={{
          padding: 10,
          alignItems: 'center',
          width: 50,
          position: 'absolute',
          top: 53,
          right: 20,
          zIndex: 15,
        }}
      >
        <Ionicons name="menu" size={28} color={colors.black} />
      </Pressable>

      {/* Overlay semitransparente */}
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
              zIndex: 10,
            }}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Menu animado */}
      {menuAberto && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 110,
            right: 20,
            height: 70,
            width: 90,
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: colors.black,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
            zIndex: 20,
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }}
        >
          <TouchableOpacity
            onPress={handleLogout}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Ionicons
              name="log-out-outline"
              size={25}
              color={colors.red}
              style={{ left: 45, top: 10 }}
            />
            <Text style={globalStyles.logoutTeacher}>Sair</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <Text style={globalStyles.bemVindo}>Olá, {userName || 'Usuário'}</Text>

      <View style={globalStyles.containerCardsTeacher}>
        <Text style={globalStyles.textHomeTeacher}>Meus Alunos</Text>
        <Text style={globalStyles.line}>_____________________</Text>

        <FlatList
          data={alunos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={globalStyles.cardHomeTeacher}
              onPress={() =>
                router.push({
                  pathname: '/screens/profile/[id]',
                  params: { id: item.id },
                })
              }
            >
              <Ionicons
                style={{
                  position: 'absolute',
                  left: 310,
                  color: colors.black,
                  backgroundColor: colors.yellow,
                  borderRadius: 30,
                  padding: 2,
                }}
                name="arrow-forward"
                size={25}
              />
              <Text style={globalStyles.textNameHomeTeacher}>
                {item.name ?? 'Aluno sem nome'}
              </Text>
              <Text style={globalStyles.textEmail}>{item.email}</Text>

              {/* Linha pequena centralizada */}
              <View style={globalStyles.lineBetweenCards} />

              {/* Botão Remover aluno */}
              <TouchableOpacity
                style={globalStyles.removeStudentButton}
                onPress={() => handleRemoveUser(item.id)}
              >
                <Text style={globalStyles.removeStudentButtonText}>Remover</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 60, color: colors.white }}>
              Nenhum aluno cadastrado ainda.
            </Text>
          }
        />
      </View>
    </View>
  );
}
