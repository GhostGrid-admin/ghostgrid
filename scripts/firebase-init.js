// scripts/firebase-init.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjWQB0hAO1r686hVdpBKBJkaIYMXOM8l8",
  authDomain: "ghostgrid-cebe9.firebaseapp.com",
  projectId: "ghostgrid-cebe9",
  storageBucket: "ghostgrid-cebe9.appspot.com",
  messagingSenderId: "346259562017",
  appId: "1:346259562017:web:cf0166021bb45d72768d60",
  measurementId: "G-4BFC1G32H7"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const storage = getStorage(app);

onAuthStateChanged(auth, user => {
  console.log(user ? `Inloggad som ${user.email}` : "Ingen användare inloggad");
});

export { auth, db, storage };
