// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
   apiKey: "AIzaSyBjnMWeLSz-nA_Ja5B-rRXHFXdbkWWWu18",
  authDomain: "upme-aut.firebaseapp.com",
  projectId: "upme-aut",
  storageBucket: "upme-aut.firebasestorage.app",
  messagingSenderId: "751931054460",
  appId: "1:751931054460:web:59fa52a66aa8b7e5d3acf9",
  measurementId: "G-ZVTQQTV9Z6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});