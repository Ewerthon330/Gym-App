import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBW86vjdd7EYj2s-Jt22mz9a3d4kGHGXhM",
  authDomain: "gym-app-3c78c.firebaseapp.com",
  projectId: "gym-app-3c78c",
  storageBucket: "gym-app-3c78c.appspot.com",
  messagingSenderId: "240958036841",
  appId: "1:240958036841:android:d723704e8c37e71164fbf8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

