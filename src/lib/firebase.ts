import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBjhYMlKjdVuCYHyhGy-6ZenO2znadXqhE",
  authDomain: "seismic-inverter-6gtt6.firebaseapp.com",
  projectId: "seismic-inverter-6gtt6",
  storageBucket: "seismic-inverter-6gtt6.firebasestorage.app",
  messagingSenderId: "687659979685",
  appId: "1:687659979685:web:6c800d4d4f80d4b16d8e4c"
};

// Initialize App
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Set Google Auth Custom Parameters to always select account
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore with custom databaseId
export const db = getFirestore(app, "ai-studio-cleanaircitizenp-89db7b99-9f46-421e-912c-70939736908d");
