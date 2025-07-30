import { useAuth, useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { getStudents } from '../../../services/api';
import { styles } from '../../../styles/styles';

interface Student {
  id: string;
  name: string;
  email: string;
}

export default function StudentsScreen() {
  const { userId } = useAuth();
  const { user } = useUser();
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const role = user?.publicMetadata?.role;

  // Mesma lógica, mas com melhorias no carregamento inicial e feedback

useEffect(() => {
  if (!user) return;

  const fetchStudents = async () => {
    try {
      if (userId && role === 'professor') {
        const data = await getStudents(userId);
        setStudents(data);
      } else {
        setError("Acesso negado");
      }
    } catch (err) {
      setError('Erro ao carregar alunos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchStudents();
}, [user, userId, role]);


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Alunos</Text>
      
      {students.length > 0 ? (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: '/screens/profile/[id]',
                params: { id: item.id }
              }}
            >
              <Pressable style={styles.studentCard}>
                <Text style={styles.studentName}>{item.name}</Text>
                <Text style={styles.studentEmail}>{item.email}</Text>
              </Pressable>
            </Link>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>Nenhum aluno encontrado</Text>
      )}
    </View>
  );
}
