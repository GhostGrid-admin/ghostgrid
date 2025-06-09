// scripts/login.js
import { auth, db } from "./firebase-init.js";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Funktion för att översätta sidan
const translations = {
  sv: {
    login_page_title: "Logga in – GhostGrid",
    login_title: "Logga in på GhostGrid",
    email: "E-postadress",
    email_placeholder: "Ange din e-post",
    password: "Lösenord",
    password_placeholder: "Ange ditt lösenord",
    login_button: "Logga in",
    forgot_password: "Glömt ditt lösenord?",
    create_account: "Skapa nytt konto"
  },
  en: {
    login_page_title: "Login – GhostGrid",
    login_title: "Log in to GhostGrid",
    email: "Email address",
    email_placeholder: "Enter your email",
    password: "Password",
    password_placeholder: "Enter your password",
    login_button: "Log in",
    forgot_password: "Forgot your password?",
    create_account: "Create account"
  }
};

function applyTranslations() {
  const lang = localStorage.getItem("lang") || "sv";
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key]) {
      if (el.placeholder !== undefined && el.tagName === "INPUT") {
        el.placeholder = translations[lang][`${key}_placeholder`] || translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
  document.title = translations[lang]["login_page_title"];
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();

  const form = document.getElementById("loginForm");
  const errorDisplay = document.createElement("p");
  errorDisplay.style.color = "red";
  errorDisplay.style.marginTop = "10px";
  errorDisplay.style.display = "none";
  form.appendChild(errorDisplay);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Inloggning lyckades för", email);
      window.location.href = "profile.html";
    } catch (err) {
      console.error("Inloggning misslyckades:", err.message);
      errorDisplay.textContent = "Fel: " + err.message;
      errorDisplay.style.display = "block";
    }
  });

  const audio = document.getElementById("keystrokeAudio");
  if (audio) {
    window.addEventListener("load", () => {
      audio.muted = false;
      audio.volume = 0.8;
      audio.play().catch(() => {});
    });
  }
});

// Skapa användarprofil automatiskt i Firestore vid första inloggning
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || "",
        profileCode: "",
        createdAt: new Date()
      });
    }
  }
});
