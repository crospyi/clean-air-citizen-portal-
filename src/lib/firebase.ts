import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA4PS37KyyCaKL2_xBErQtes3JxliTKTI8",
  authDomain: "clean-air-citizen.firebaseapp.com",
  projectId: "clean-air-citizen",
  storageBucket: "clean-air-citizen.firebasestorage.app",
  messagingSenderId: "86383947075",
  appId: "1:86383947075:web:dde662221dd6b3865f93f6"
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

// Initialize Firestore
export const db = getFirestore(app);
