import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase";

// -------------------- TIPOS --------------------
export interface Treino {
  id: string;
  name: string;
  videoUrl: string;
  day: string;
  volume: string;
  rest: string; // 🔹 descanso entre séries
}

// -------------------- PROFESSOR --------------------

// Criar professor
export const createTeacher = async () => {
  const teacherRef = doc(db, "teachers", "teacher_main");
  await setDoc(teacherRef, {
    name: "Ewerthon",
    email: "professor@email.com",
    createdAt: serverTimestamp(),
  });
};

// -------------------- ALUNO --------------------

// Criar aluno
export const createStudent = async (
  userId: string,
  name: string,
  email: string,
  teacherId = "teacher_main"
) => {
  const studentRef = doc(db, "users", userId);
  await setDoc(studentRef, {
    name,
    email,
    teacherId,
    createdAt: serverTimestamp(),
  });
};

// -------------------- TREINOS --------------------

// Buscar treinos do usuário
export const getUserWorkouts = async (userId: string): Promise<Treino[]> => {
  try {
    const snapshot = await getDocs(collection(db, "users", userId, "treinos"));
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",
        videoUrl: data.videoUrl || "",
        day: data.day || "",
        volume: data.volume || "",
        rest: data.rest || "", // 🔹 carrega descanso
      } as Treino;
    });
  } catch (error) {
    console.error("Erro ao buscar treinos no Firestore:", error);
    return [];
  }
};

// Criar treino
export const createWorkout = async ({
  userId,
  name,
  videoUrl,
  day,
  volume,
  rest,
}: {
  userId: string;
  name: string;
  videoUrl: string;
  day: string;
  volume: string;
  rest: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, "users", userId, "treinos"), {
      name,
      videoUrl,
      day: day.toLowerCase(),
      volume,
      rest,
    });
    return { id: docRef.id };
  } catch (error) {
    console.error("Erro ao criar treino no Firestore:", error);
    throw error;
  }
};

// Atualizar treino
export const updateWorkout = async ({
  userId,
  workoutId,
  name,
  videoUrl,
  day,
  volume,
  rest,
}: {
  userId: string;
  workoutId: string;
  name: string;
  videoUrl: string;
  day: string;
  volume: string;
  rest: string;
}) => {
  try {
    const docRef = doc(db, "users", userId, "treinos", workoutId);
    await updateDoc(docRef, {
      name,
      videoUrl,
      day: day.toLowerCase(),
      volume,
      rest,
    });
  } catch (error) {
    console.error("Erro ao atualizar treino:", error);
    throw error;
  }
};

// Remover treino
export const deleteWorkout = async (userId: string, workoutId: string) => {
  try {
    const docRef = doc(db, "users", userId, "treinos", workoutId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Erro ao excluir treino:", error);
    throw error;
  }
};

// -------------------- PERFIL --------------------

// Buscar perfil de usuário
export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    return null;
  }
};

// Buscar alunos vinculados a um professor
export const getStudents = async (teacherId: string) => {
  try {
    const q = query(collection(db, "users"), where("teacherId", "==", teacherId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    return [];
  }
};

// -------------------- UPLOAD DE VÍDEO --------------------
export const uploadVideo = async (uri: string) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `workout-videos/${Date.now()}`);
    await uploadBytes(storageRef, blob);

    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Erro ao fazer upload do vídeo:", error);
    throw error;
  }
};

// -------------------- REMOVER ALUNO (Firestore apenas) --------------------
export const removeUser = async (userId: string) => {
  try {
    const treinosSnap = await getDocs(collection(db, "users", userId, "treinos"));
    for (const treino of treinosSnap.docs) {
      await deleteDoc(doc(db, "users", userId, "treinos", treino.id));
    }
    await deleteDoc(doc(db, "users", userId));
  } catch (error) {
    console.error("❌ Erro ao remover aluno:", error);
    throw error;
  }
};

// -------------------- CHECAR USUÁRIO EXISTENTE NO CLERK --------------------
export const checkUserExists = async (userId: string) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/check-user/${userId}`);
    if (!response.ok) {
      const msg = await response.text().catch(() => "");
      throw new Error(`Erro ao checar usuário no Clerk: ${response.status} ${msg}`);
    }
    const data = await response.json();
    return data.exists;
  } catch (err) {
    console.error("Erro ao verificar usuário:", err);
    return false;
  }
};
