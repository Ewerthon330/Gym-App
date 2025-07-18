import { useAuth } from '@clerk/clerk-expo';
import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { getUserProfile, getUserWorkouts } from '../../../services/api';
import { styles } from '../../styles/styles';

// Adicione estas interfaces para tipagem
interface Workout {
  id: number;
  name: string;
  description?: string;
  videoUrl?: string;
}

interface Profile {
  name: string;
  email: string;
  teacherId: string | null;
}

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const { userId } = useAuth();
  const [profile, setProfile] = useState<Profile>({ name: '', email: '', teacherId: null });
  const [workouts, setWorkouts] = useState<Workout[]>([]); // Alterado para array vazio
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const safeId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentId = Array.isArray(id) ? id[0] : id;
        const [profileData, workoutsData] = await Promise.all([
          getUserProfile(currentId),
          getUserWorkouts(currentId)
        ]);
        setProfile(profileData);
        setWorkouts(workoutsData || []); // Garante que seja array mesmo se for null/undefined
      } catch (err) {
        setError('Erro ao carregar dados do aluno');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileEmail}>{profile.email}</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Treinos Prescritos</Text>
        {userId === profile.teacherId && (
          <Link href={{
            pathname: "/",
            params: { studentId: safeId }
          }} asChild>
            <Pressable style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Treino</Text>
            </Pressable>
          </Link>
        )}
      </View>
      
      {workouts.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum treino prescrito ainda.</Text>
      ) : (
        workouts.map((workout) => (
          <Link 
            key={workout.id} 
            href={{
              pathname: "/screens/workout/add-workout",
              params: {
                id: String(workout.id),
                studentId: safeId // Já tratamos o safeId anteriormente
              }
            }} 
            asChild
          >
            <Pressable style={styles.workoutCard}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <Text style={styles.workoutDescription}>{workout.description}</Text>
              {workout.videoUrl && (
                <Text style={styles.videoIndicator}>Possui vídeo</Text>
              )}
            </Pressable>
          </Link>
        ))
      )}
    </ScrollView>
  );
}