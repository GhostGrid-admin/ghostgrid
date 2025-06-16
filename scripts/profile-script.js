import { auth, db, storage } from "./firebase-init.js";
import {
  doc, getDoc, setDoc, collection, addDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const codeField = document.getElementById("custom-code");
  const saveBtn = document.getElementById("saveBtn");
  const viewBtn = document.querySelector("button[data-i18n='view_profile']");
  const editBtn = document.getElementById("editProfileBtn");
  const preview = document.getElementById("fullscreenPreview");
  const profileContent = document.getElementById("profileContent");
  const profilePicInput = document.getElementById("profile-pic");
  const notice = document.getElementById("saveNotice");
  const themeSelect = document.getElementById("theme");

  // Koder för teman:
  const themeTemplates = {
    "50s": `<div style="background:#f6e6d7; border-radius:20px; padding:24px; text-align:center;">
      <h1 style="color:#cc0066; font-family: 'Pacifico', cursive; font-size:2.6em;">🍦 50-talets Stjärna</h1>
      <p style="font-family: 'Courier New', monospace; color:#333;">Sockersöt, klassisk och med rock'n'roll i hjärtat!</p>
    </div>`,
    "60s": `<div style="background:#c1e1c1; border-radius:20px; padding:24px; text-align:center;">
      <h1 style="color:#ff8800; font-family: 'Dancing Script', cursive; font-size:2.5em;">✌️ 60-talets Frihetsdröm</h1>
      <p style="color:#333;">Flower power, fred & musik!</p>
    </div>`,
    "70s": `<div style="background:#fcfbb6; border-radius:20px; padding:24px; text-align:center;">
      <h1 style="color:#bb8800; font-family: 'Permanent Marker', cursive; font-size:2.5em;">🌼 70-tals Groove</h1>
      <p style="color:#884400;">Disco, peace & flower power!</p>
    </div>`,
    "80s": `<div style="background:#cdf0ff; border-radius:20px; padding:24px; text-align:center;">
      <h1 style="color:#ff44ee; font-family:'Monoton', cursive; font-size:2.3em;">🕹️ 80-tals Neon</h1>
      <p style="color:#0033aa;">Synthwave, pastell & axelvaddar!</p>
    </div>`,
    "90s": `<div style="background:#ffe9f9; border-radius:20px; padding:24px; text-align:center;">
      <h1 style="color:#0055bb; font-family:'Comic Sans MS', cursive;">📟 90-tals Kid</h1>
      <p style="color:#333;">Gameboy, färgsprak & pogs!</p>
    </div>`,
    "y2k": `<div style="background:#f2faff; border-radius:20px; padding:24px; text-align:center;">
      <h1 style="color:#ff22dd; font-family:'Orbitron', sans-serif;">💾 Y2K Millennium</h1>
      <p style="color:#444;">Tech, metallic & bling bling!</p>
    </div>`,
    "raggare": `<div style="background:#fafafa; border-radius:20px; padding:24px; text-align:center;">
      <h1 style="color:#222;">🚗 Raggare</h1>
      <p style="color:#ba2222;">Volvo Amazon, brylcreem & rockabilly!</p>
    </div>`,
    "rock": `<div style="background:#111; border-radius:20px; padding:24px; text-align:center;">
      <h1 style="color:#bb0000;">🤘 Rock Legend</h1>
      <p style="font-style:italic;">Gör världen till din scen!</p>
    </div>`,
    "punk": `<div style="background:#ffe357; border-radius:20px; padding:24px; text-align:center;">
      <h1 style="color:#e00; font-family:Impact;">☠️ Punk</h1>
      <p style="font-weight:bold; color:#000;">Frihet, nitar & revolt!</p>
    </div>`,
    "cyberpunk": `<div style="background:#0f0027; border-radius:20px; padding:24px; text-align:center;">
      <h1 style="color:#0ff;">👾 Cyberpunk</h1>
      <p>Neon, hacking & dystopier.</p>
    </div>`,
    "romantik": `<div style="background:#fff0f6; border-radius:20px; padding:24px; text-align:center; color:#b8004b;">
      <h1>💕 Romantisk själ</h1>
      <p>Kärlek, poesi & varma känslor.</p>
    </div>`
  };

  auth.onAuthStateChanged(async user => {
    if (!user) return location.href = "login.html";
    const uid = user.uid;
    const profileRef = doc(db, "profiles", uid);
    const snap = await getDoc(profileRef);

    // Hämta sparad profil
    if (snap.exists()) {
      const data = snap.data();
      codeField.value = data.profileCode || "";
      document.getElementById("profile-email").textContent = "E-post: " + user.email;
      document.getElementById("profile-username").textContent = "Användarnamn: " + (user.displayName || "okänd");
      // Sätt valt tema i listan (om sparat)
      if (data.profileTheme && themeSelect) {
        themeSelect.value = data.profileTheme;
      }
    }

    // När användaren väljer ett tema – byt kod automatiskt!
    themeSelect.addEventListener("change", () => {
      codeField.value = themeTemplates[themeSelect.value] || "";
    });

    // Spara kod + tema
    saveBtn.addEventListener("click", async () => {
      await setDoc(profileRef, {
        profileCode: codeField.value,
        profileTheme: themeSelect.value
      }, { merge: true });
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

    // Extra-mall-knapp (om du använder denna)
    // if (useTemplateBtn) {
    //   useTemplateBtn.addEventListener("click", () => {
    //     codeField.value = ... ;
    //   });
    // }
  });
});
