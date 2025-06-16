// scripts/firebase-init.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDdMt1JyT-Mz2eOVeH0GvqJMijtIIZRORs",
  authDomain: "ghostgrid-fb278.firebaseapp.com",
  projectId: "ghostgrid-fb278",
  storageBucket: "ghostgrid-fb278.appspot.com",
  messagingSenderId: "283208202937",
  appId: "1:283208202937:web:11c0cea81fd18a31163968"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const storage = getStorage(app);

// Detta är bara för debug/felsökning:
onAuthStateChanged(auth, user => {
  console.log(user ? `Inloggad som ${user.email}` : "Ingen användare inloggad");
});

export { auth, db, storage };
