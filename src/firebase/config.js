// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjnMWeLSz-nA_Ja5B-rRXHFXdbkWWWu18",
  authDomain: "upme-aut.firebaseapp.com",
  projectId: "upme-aut",
  storageBucket: "upme-aut.appspot.com",
  messagingSenderId: "751931054460",
  appId: "1:751931054460:web:59fa52a66aa8b7e5d3acf9",
  measurementId: "G-ZVTQQTV926"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Proveedores de autenticación
export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');

googleProvider.setCustomParameters({
  prompt: "select_account"
});

microsoftProvider.setCustomParameters({
  prompt: "select_account",
  tenant: "organizations" // o "consumers" según tus necesidades
});