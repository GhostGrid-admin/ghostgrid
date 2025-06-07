// scripts/firebase-init.js

// Importera Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";

// Din uppdaterade Firebase-konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyDUem8OciTynoSujYyZSQqsExocoZeJu0Y",
  authDomain: "ghostgrid-cebe9.firebaseapp.com",
  projectId: "ghostgrid-cebe9",
  storageBucket: "ghostgrid-cebe9.appspot.com", // 🔧 fixade detta
  messagingSenderId: "346259562017",
  appId: "1:346259562017:web:cf0166021bb45d72768d60",
  measurementId: "G-4BFC1G32H7"
};

// Initiera Firebase
const app = initializeApp(firebaseConfig);

// Initiera Analytics (valfritt)
const analytics = getAnalytics(app);

// Initiera Firestore och Authentication
const db = getFirestore(app);
const auth = getAuth(app);

// Exportera
export { db, auth };
