import { useAuth, useUser } from '@clerk/clerk-expo';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { getUserProfile, getUserWorkouts } from '../../../services/api';
import { styles } from '../../styles/styles';

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
  const safeId = Array.isArray(id) ? id[0] : id;

  const { userId } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();

  const [profile, setProfile] = useState<Profile>({ name: '', email: '', teacherId: null });
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasRedirected, setHasRedirected] = useState(false);

  const isReady = isUserLoaded && user;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, workoutsData] = await Promise.all([
          getUserProfile(safeId),
          getUserWorkouts(safeId)
        ]);
        setProfile(profileData);
        setWorkouts(workoutsData || []);
      } catch (err) {
        setError('Erro ao carregar dados do aluno');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [safeId]);

  useEffect(() => {
    if (!isReady || hasRedirected) return;

    if (profile.teacherId && userId && userId !== profile.teacherId) {
      Alert.alert("Acesso negado", "Você não tem permissão para ver este perfil.");
      setHasRedirected(true);
      router.replace("/(public)/onBoarding");
    }
  }, [isReady, userId, profile.teacherId, hasRedirected]);

  if (!isReady || loading) {
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
          <Link
            href={{ pathname: "/", params: { studentId: safeId } }}
            asChild
          >
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
                studentId: safeId
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
