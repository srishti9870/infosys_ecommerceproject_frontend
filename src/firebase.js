import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// ⬇️ YAHAN APNA CONFIG PASTE KARO ⬇️
const firebaseConfig = {
  apiKey: "AIzaSyD2HTqgwf0yWr-NaiVs41XUfrLMgJmzuyA",
  authDomain: "e-shop-dcc4f.firebaseapp.com",
  projectId: "e-shop-dcc4f",
  storageBucket: "e-shop-dcc4f.firebasestorage.app",
  messagingSenderId: "252641740871",
  appId: "1:252641740871:web:e5afc29469fa3babd38962",
  measurementId: "G-JG6L1GV3F7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.log('Google Sign-In Error:', error.message);
        return null;
    }
};