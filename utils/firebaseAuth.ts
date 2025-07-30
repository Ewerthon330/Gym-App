// services/firebaseAuth.ts
/*import { signInWithCustomToken } from 'firebase/auth';
import { auth } from 'src/services/firebase';

export async function loginWithClerkToken(clerkToken: string) {
  try {
    const response = await fetch('http://SEU_IP_LOCAL:3000/create-custom-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerkToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao gerar token do Firebase');
    }

    const { firebaseToken } = await response.json();

    // Faz login no Firebase
    await signInWithCustomToken(auth, firebaseToken);

    console.log('✅ Login no Firebase realizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao logar no Firebase:', error);
    throw error;
  }
}*/