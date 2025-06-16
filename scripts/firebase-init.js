// scripts/firebase-init.js

// 1. Importera bara modular‑API från CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// 2. Din Firebase‑konfiguration (uppdatera om du bytt projekt)
const firebaseConfig = {
  apiKey: "AIzaSyDUem8OciTynoSujYyZSQqsExocoZeJu0Y",
  authDomain: "ghostgrid-cebe9.firebaseapp.com",
  projectId: "ghostgrid-cebe9",
  storageBucket: "ghostgrid-cebe9.appspot.com",
  messagingSenderId: "346259562017",
  appId: "1:346259562017:web:cf0166021bb45d72768d60",
  measurementId: "G-4BFC1G32H7"
};

// 3. Initiera
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// 4. (Valfritt) visa inloggningsstatus i konsolen
onAuthStateChanged(auth, user => {
  console.log(user ? `Inloggad som ${user.email}` : "Ingen användare inloggad");
});

// 5. Exportera för andra moduler
export { auth, db };
