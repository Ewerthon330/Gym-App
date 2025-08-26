import colors from '@/styles/colors';
import { useAppFonts } from '@/styles/fonts';
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
  BackHandler,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { removeUser } from '../../services/api';
import { db } from '../../services/firebase';

export default function HomeProfessor() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const [userName, setUserName] = useState('');
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loadingAlunos, setLoadingAlunos] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);
  const [checkedAccess, setCheckedAccess] = useState(false); // 🔹 flag de verificação
  const [loading, setLoading] = useState(true);

  const fontsLoaded = useAppFonts();

  // Animações
  const slideAnim = useRef(new Animated.Value(200)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const abrirMenu = () => {
    setMenuAberto(true);
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.timing(overlayAnim, { toValue: 0.5, duration: 250, useNativeDriver: true }),
    ]).start();
  };

  const fecharMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 200, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(overlayAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setMenuAberto(false));
  };

  const toggleMenu = () => (menuAberto ? fecharMenu() : abrirMenu());

  // ------------------- BACK BUTTON -------------------
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Sair do app',
        'Deseja realmente sair?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sair', style: 'destructive', onPress: async () => {
              await signOut();
              BackHandler.exitApp();
            }
          },
        ]
      );
      return true; // previne comportamento padrão
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  // ------------------- AUTENTICAÇÃO E BUSCA -------------------
  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const checarAcesso = async () => {
      try {
        const userDocRef = doc(db, 'users', user.id);
        const userSnap = await getDoc(userDocRef);

        if (!userSnap.exists()) {
          Alert.alert('Conta removida', 'Sua conta foi removida. Faça login novamente.');
          await signOut();
          return;
        }

        const role = userSnap.data().role;
        if (role !== 'teacher') {
          Alert.alert('Acesso negado', 'Esta conta não tem permissão para acessar esta área.');
          await signOut();
          return;
        }

        setUserName(userSnap.data().name || 'Professor');
        buscarAlunos(user.id);
      } catch (error) {
        console.error('Erro ao verificar acesso:', error);
        Alert.alert('Erro', 'Não foi possível verificar acesso. Tente novamente.');
      } finally {
        setCheckedAccess(true); // 🔹 marca que verificação terminou
        setLoading(false)
      }
    };

    checarAcesso();
  }, [isLoaded, user]);

  const buscarAlunos = async (teacherId: string) => {
    setLoadingAlunos(true);
    try {
      const alunosRef = collection(db, 'users');
      const q = query(alunosRef, where('role', '==', 'user'), where('teacherId', '==', teacherId));
      const querySnapshot = await getDocs(q);

      const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAlunos(lista);
    } catch (error) {
      Alert.alert('Erro ao buscar alunos');
      console.error('Erro ao buscar alunos:', error);
    } finally {
      setLoadingAlunos(false);
    }
  };

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
            try {
              await removeUser(userId);
              setAlunos(prev => prev.filter(a => a.id !== userId));
              Alert.alert('Sucesso', 'Aluno removido com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover o aluno.');
              console.error('Erro ao remover aluno:', error);
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

  // 🔹 Só renderiza a tela quando o usuário está carregado, verificado e alunos carregados
  if (!isLoaded || !checkedAccess || loadingAlunos) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.yellow} />
        <Text style={{ marginTop: 10, color: colors.lightGray }}>Carregando alunos...</Text>
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
    <View style={globalStyles.containerHomeTeacher}>
      {/* Botão de menu */}
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

      {/* Overlay */}
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
          style={{...globalStyles.menuTeacher, opacity: fadeAnim, transform: [{ translateX: slideAnim }]}}>
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
        router.push({ pathname: '/screens/profile/[id]', params: { id: item.id }})
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
  ItemSeparatorComponent={() => (
    <View
      style={{
        height: 1.5,
        backgroundColor: colors.yellow,
        marginVertical: 10,
      }}
    />
  )}
  contentContainerStyle={{ paddingBottom: 80 }} // 🔹 espaço extra p/ último card não ficar colado
/>

      </View>
    </View>
  );
}
