// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZKFtEvfDIYMG9NztN59clCBPTdOLaf1A",
  authDomain: "walletto-82ea8.firebaseapp.com",
  projectId: "walletto-82ea8",
  storageBucket: "walletto-82ea8.firebasestorage.app",
  messagingSenderId: "43203611858",
  appId: "1:43203611858:web:efc8c8e94f626ed863f10b",
  measurementId: "G-T6FXWSFPP9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
