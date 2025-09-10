// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfHrGMJxL6l4wvY3cwnJS0lqFB8N-pkGI",
  authDomain: "walletto-57635.firebaseapp.com",
  projectId: "walletto-57635",
  storageBucket: "walletto-57635.firebasestorage.app",
  messagingSenderId: "950474308836",
  appId: "1:950474308836:web:383c646eee89755e80c0f1",
  measurementId: "G-ZB4S3BTWVQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
