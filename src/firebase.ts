import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDu3iiZ5d8ZaRwcvv7SUFB-Ex8Y8B4pDNg",
  authDomain: "hermony-nu.firebaseapp.com",
  projectId: "hermony-nu",
  storageBucket: "hermony-nu.firebasestorage.app",
  messagingSenderId: "590303261382",
  appId: "1:590303261382:web:e17b8f5892ff6223b41dc7",
  measurementId: "G-Y6KVCKZZSV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);