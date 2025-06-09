import { db, auth } from "./firebase-init.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

auth.onAuthStateChanged(async user => {
  if (!user) return location.href = "login.html";

  const email = user.email;
  document.getElementById("profile-email").textContent = "E-post: " + email;
  document.getElementById("profile-username").textContent = "Användarnamn: " + (user.displayName || "okänd");

  const docRef = doc(db, "users", user.uid);
  const snap = await getDoc(docRef);
  if (snap.exists() && snap.data().profileCode) {
    document.getElementById("custom-code").value = snap.data().profileCode;
  }

  const profileContent = document.getElementById("profileContent");
  const preview = document.getElementById("fullscreenPreview");

  document.getElementById("viewProfileBtn").addEventListener("click", () => {
    const html = document.getElementById("custom-code").value;
    profileContent.innerHTML = html;
    preview.classList.remove("hidden");
    document.getElementById("editProfileBtn").classList.remove("hidden");
  });

  document.getElementById("editProfileBtn").addEventListener("click", () => {
    preview.classList.add("hidden");
  });
});

document.getElementById("saveBtn").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const code = document.getElementById("custom-code").value;
  await setDoc(doc(db, "profiles", user.uid), { profileCode: code }, { merge: true });

  const notice = document.getElementById("saveNotice");
  notice.style.display = "block";
  setTimeout(() => notice.style.display = "none", 3000);
});

document.getElementById("useTemplateBtn").addEventListener("click", () => {
  const example = `
<div style="text-align:center; font-family:'Courier New', monospace; color:#00ff00; background-color:#000; padding:20px; border:2px solid #00ff00; border-radius:12px; box-shadow:0 0 20px #00ff00;">
  <img src="https://i.imgur.com/NXbZDJz.png" style="width:100px; border-radius:50%; border:2px solid #00ff00;">
  <h2>👤 CodeRebel</h2>
  <p>🌌 Skapa din verklighet. Välkommen till GhostGrid.</p>
</div>`;
  document.getElementById("custom-code").value = example.trim();
});

document.getElementById("logoutLink").addEventListener("click", () => {
  auth.signOut().then(() => location.href = "login.html");
});
