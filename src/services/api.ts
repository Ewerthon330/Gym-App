import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

const API_BASE_URL = 'https://your-api-url.com/api';

// Funções existentes...

// Novas funções para o sistema de treinos
export const getStudents = async (teacherId: string) => {
  const response = await fetch(`${API_BASE_URL}/students?teacherId=${teacherId}`);
  if (!response.ok) throw new Error('Erro ao buscar alunos');
  return await response.json();
};

export const getUserProfile = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);
  if (!response.ok) throw new Error('Erro ao buscar perfil');
  return await response.json();
};

export const getUserWorkouts = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/workouts?userId=${userId}`);
  if (!response.ok) throw new Error('Erro ao buscar treinos');
  return await response.json();
};

export const uploadVideo = async (uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  
  const storageRef = ref(storage, `workout-videos/${Date.now()}`);
  await uploadBytes(storageRef, blob);
  
  return await getDownloadURL(storageRef);
};

export const createWorkout = async (workoutData: any) => {
  const response = await fetch(`${API_BASE_URL}/workouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workoutData),
  });
  if (!response.ok) throw new Error('Erro ao criar treino');
  return await response.json();
};