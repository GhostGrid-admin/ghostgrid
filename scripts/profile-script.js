// profile-script.js
import { auth, db, storage } from "./firebase-init.js";
import {
  doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, addDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const codeField = document.getElementById("custom-code");
  const saveBtn = document.getElementById("saveBtn");
  const viewBtn = document.getElementById("viewProfileBtn");
  const editBtn = document.getElementById("editProfileBtn");
  const preview = document.getElementById("fullscreenPreview");
  const profileContent = document.getElementById("profileContent");
  const profilePicInput = document.getElementById("profile-pic");
  const notice = document.getElementById("saveNotice");

  auth.onAuthStateChanged(async user => {
    if (!user) return location.href = "login.html";
    const uid = user.uid;

    const profileRef = doc(db, "profiles", uid);
    const snap = await getDoc(profileRef);

    if (snap.exists()) {
      const data = snap.data();
      codeField.value = data.profileCode || "";
      document.getElementById("profile-email").textContent = "E-post: " + user.email;
      document.getElementById("profile-username").textContent = "Användarnamn: " + (user.displayName || "okänd");
    }

    // Spara kod
    saveBtn.addEventListener("click", async () => {
      await setDoc(profileRef, { profileCode: codeField.value }, { merge: true });
      notice.style.display = "block";
      setTimeout(() => notice.style.display = "none", 3000);
    });

    // Visa profil
    viewBtn.addEventListener("click", () => {
      profileContent.innerHTML = codeField.value;
      preview.classList.remove("hidden");
      editBtn.classList.remove("hidden");
    });

    // Tillbaka till redigering
    editBtn.addEventListener("click", () => {
      preview.classList.add("hidden");
    });

    // Profilbild-uppdatering
    profilePicInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const oldSnap = await getDoc(profileRef);
      const oldPicUrl = oldSnap.data()?.profilePic;

      if (oldPicUrl) {
        const picHistoryRef = collection(db, `profiles/${uid}/pictures`);
        await addDoc(picHistoryRef, {
          url: oldPicUrl,
          timestamp: new Date(),
          likes: oldSnap.data().pictureLikes || []
        });
      }

      const storageRef = ref(storage, `profile_pics/${uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      await setDoc(profileRef, {
        profilePic: downloadUrl,
        pictureLikes: []
      }, { merge: true });
    });

    // Logga ut
    document.getElementById("logoutLink").addEventListener("click", () => {
      auth.signOut().then(() => location.href = "login.html");
    });

    // Använd färdig mall
    document.getElementById("useTemplateBtn").addEventListener("click", () => {
      const template = `
      <div style="text-align:center; color:#00ff00; font-family:'Courier New', monospace;">
        <img src="${snap.data()?.profilePic || 'https://i.imgur.com/NXbZDJz.png'}" style="width:100px; border-radius:50%;">
        <h2>👤 Användarnamn</h2>
        <p>Välkommen till min profil!</p>
      </div>`;
      codeField.value = template.trim();
    });
  });
});
