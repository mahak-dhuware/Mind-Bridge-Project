import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDVgcl4pSviGZqlDfsNucWmJjPFrg8sdo",
  authDomain: "mindbridgestart.firebaseapp.com",
  databaseURL: "https://mindbridgestart-default-rtdb.firebaseio.com",
  projectId: "mindbridgestart",
  storageBucket: "mindbridgestart.firebasestorage.app",
  messagingSenderId: "620392039604",
  appId: "1:620392039604:web:0755bf19954b729dd103e1",
  measurementId: "G-NFR1XGX12B"
};



const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const fs = getFirestore(app);

// 🔑 REQUIRED
await setPersistence(auth, browserLocalPersistence);

console.log("Firebase initialized");



