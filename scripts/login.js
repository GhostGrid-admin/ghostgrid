// scripts/login.js
import { auth } from "./firebase-init.js";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await setPersistence(auth, browserLocalPersistence); // 👈 Håller användaren inloggad

    await signInWithEmailAndPassword(auth, email, password);
    location.href = "profile.html";
  } catch (err) {
    alert("Fel vid inloggning: " + err.message);
  }
});
