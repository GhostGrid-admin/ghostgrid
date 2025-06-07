// scripts/firebase-init.js

// Importera Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js"; // ✅ VIKTIGT!

// Firebase-konfiguration för GhostGrid
const firebaseConfig = {
  apiKey: "AIzaSyCMeJhxPqWyXB1tZqpN0YdYHOEzKlCB-RM",
authDomain: "ghostgrid.firebaseapp.com",
projectId: "ghostgrid",
storageBucket: "ghostgrid.appspot.com",
  messagingSenderId: "867043406657",
  appId: "1:867043406657:web:0cd071cddcf463aaaae7c0",
  measurementId: "G-MS8XVKCJT2"
};

// Initiera Firebase
const app = initializeApp(firebaseConfig);

// Aktivera Firestore och autentisering
const db = getFirestore(app); // ✅ Behövs för trådar, kommentarer, sök
const auth = getAuth(app);

// Exportera båda
export { db, auth };
