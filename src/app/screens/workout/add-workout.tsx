import { useAuth } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { createWorkout, uploadVideo } from '../../../services/api';
import { styles } from '../../styles/styles';

export default function AddWorkoutScreen() {
  const { studentId } = useLocalSearchParams();
  const { userId } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [exercises, setExercises] =  useState<string[]>([]);
  const [currentExercise, setCurrentExercise] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  
  const pickVideo = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'videos',
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setVideoUri(result.assets[0].uri);
    }
  } catch (err) {
    setError('Erro ao selecionar vídeo');
    console.error(err);
  }
};

  const addExercise = () => {
  if (currentExercise?.trim()) {
    setExercises(prev => [...prev, currentExercise.trim()]);
    setCurrentExercise('');
  }
};

  const removeExercise = (indexToRemove: number) => {
  setExercises(prev => prev.filter((_, index) => index !== indexToRemove));
};

  const handleSubmit = async () => {
    if (!name || !description || exercises.length === 0) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      let videoUrl = '';
      if (videoUri) {
        videoUrl = await uploadVideo(videoUri);
      }

      await createWorkout({
        studentId,
        teacherId: userId,
        name,
        description,
        videoUrl,
        exercises,
      });

      router.back();
    } catch (err) {
      setError('Erro ao criar treino');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Novo Treino</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.label}>Nome do Treino</Text>
      <TextInput
        placeholder="Ex: Treino de Peito"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        placeholder="Descrição detalhada do treino"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, styles.textArea]}
      />

      <Text style={styles.label}>Vídeo Demonstrativo (Opcional)</Text>
      <Pressable
        onPress={pickVideo}
        style={videoUri ? styles.videoButtonSelected : styles.videoButton}
      >
        <Text style={styles.buttonText}>
          {videoUri ? 'Vídeo Selecionado' : 'Selecionar Vídeo'}
        </Text>
      </Pressable>

      <Text style={styles.label}>Exercícios</Text>
      <View style={styles.exerciseInputContainer}>
        <TextInput
          placeholder="Adicionar exercício"
          value={currentExercise}
          onChangeText={setCurrentExercise}
          style={[styles.input, styles.exerciseInput]}
          onSubmitEditing={addExercise}
        />
        <Pressable
          onPress={addExercise}
          style={styles.addExerciseButton}
        >
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>

      {exercises?.map((exercise, index) => (
        <View key={index} style={styles.exerciseItem}>
          <Text style={styles.exerciseText}>{exercise}</Text>
          <Pressable
            onPress={() => removeExercise(index)}
            style={styles.removeExerciseButton}
          >
            <Text style={styles.buttonText}>×</Text>
          </Pressable>
        </View>
      ))}

      <Pressable
        onPress={handleSubmit}
        disabled={loading}
        style={[styles.submitButton, loading && styles.disabledButton]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Salvar Treino</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}