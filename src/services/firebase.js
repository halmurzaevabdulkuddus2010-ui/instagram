// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB75rCNs-4WlzocCOXahxzPMTYbHSDQG6g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "instsgram-ecc08.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "instsgram-ecc08",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "instsgram-ecc08.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "73357476846",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:73357476846:web:679a910b2d8be6d388c4ff",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-EV80NPP5R6"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
