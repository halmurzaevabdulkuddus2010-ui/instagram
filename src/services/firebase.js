// firebase.js - Firebase initialization config file
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB75rCNs-4WlzocCOXahxzPMTYbHSDQG6g",
  authDomain: "instsgram-ecc08.firebaseapp.com",
  projectId: "instsgram-ecc08",
  storageBucket: "instsgram-ecc08.firebasestorage.app",
  messagingSenderId: "73357476846",
  appId: "1:73357476846:web:679a910b2d8be6d388c4ff",
  measurementId: "G-EV80NPP5R6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
