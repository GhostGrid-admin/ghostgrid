import { auth, db, storage } from "./firebase-init.js";
import {
  doc, getDoc, setDoc, collection, addDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";

document.addEventListener("DOMContentLoaded", () => {
  // Alla elementreferenser EN gång i toppen
  const codeField     = document.getElementById("custom-code");
  const saveBtn       = document.getElementById("saveBtn");
  const viewBtn       = document.getElementById("btn-view-profile");
  const editBtn       = document.getElementById("editProfileBtn");
  const preview       = document.getElementById("fullscreenPreview");
  const profileContent= document.getElementById("profileContent");
  const profilePicInput = document.getElementById("profile-pic");
  const notice        = document.getElementById("saveNotice");
  const themeSelect   = document.getElementById("theme");
  const saveColorBtn  = document.getElementById("saveNameColorBtn");
  const colorPicker   = document.getElementById("nameColorPicker");
  const colorSavedMsg = document.getElementById("colorSavedMsg");
  const logoutLink    = document.getElementById("logoutLink");

  // Skydd: om någon ID saknas, sluta
  if (!codeField || !saveBtn || !viewBtn || !editBtn || !preview ||
      !profileContent || !profilePicInput || !notice || !themeSelect ||
      !saveColorBtn || !colorPicker || !colorSavedMsg || !logoutLink) {
    alert("Fel i profilsidans HTML. Kontrollera att ALLA id finns!");
    return;
  }

  // Temamallar
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

  let currentUser = null;

  auth.onAuthStateChanged(async user => {
    if (!user) return location.href = "login.html";
    currentUser = user;
    const uid = user.uid;
    const profileRef = doc(db, "profiles", uid);

    // Hämta profil och LADDA FÄRG
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      const data = snap.data();

      // Debugg-logg 1 – visa exakt vad du laddar!
      console.log("Profile data loaded:", data);

      codeField.value = data.profileCode || "";
      document.getElementById("profile-email").textContent = "E-post: " + user.email;

      // Om du har "profile-username" på sidan
      if (document.getElementById("profile-username")) {
        document.getElementById("profile-username").textContent = "Användarnamn: " + (user.displayName || "okänd");
      }

      // --- Ladda in färgen från Firestore och sätt på både färgväljare och namn! ---
      if (data.nameColor) {
        colorPicker.value = data.nameColor;
        const profileNameElem = document.getElementById("profile-username");
        if (profileNameElem) {
          profileNameElem.style.color = data.nameColor;
        }
        console.log("Laddad färg från Firestore:", data.nameColor);
      } else {
        colorPicker.value = "#00ffe0"; // fallback om ingen färg finns
        const profileNameElem = document.getElementById("profile-username");
        if (profileNameElem) profileNameElem.style.color = "#00ffe0";
        console.log("Ingen färg hittad, default #00ffe0");
      }

      if (data.profileTheme) themeSelect.value = data.profileTheme;
    }

    // Temabyte = byt kod
    themeSelect.addEventListener("change", () => {
      codeField.value = themeTemplates[themeSelect.value] || "";
    });

    // SPARA FÄRG
    saveColorBtn.onclick = async () => {
      const color = colorPicker.value;
      await setDoc(profileRef, { nameColor: color }, { merge: true });
      // Sätt färg direkt när man sparar
      const profileNameElem = document.getElementById("profile-username");
      if (profileNameElem) {
        profileNameElem.style.color = color;
      }
      colorSavedMsg.style.display = "block";
      setTimeout(() => { colorSavedMsg.style.display = "none"; }, 1800);

      // Debugg-logg 2 – logga exakt vad som sparas
      console.log("Sparad färg till Firestore:", color);
    };

    // SPARA KOD + TEMA
    saveBtn.onclick = async () => {
      await setDoc(profileRef, {
        profileCode: codeField.value,
        profileTheme: themeSelect.value
      }, { merge: true });
      notice.style.display = "block";
      setTimeout(() => notice.style.display = "none", 3000);
    };

    // Visa profil (preview)
    viewBtn.onclick = () => {
      profileContent.innerHTML = codeField.value;
      preview.classList.remove("hidden");
      editBtn.classList.remove("hidden");
    };
    editBtn.onclick = () => preview.classList.add("hidden");

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
    logoutLink.onclick = () => {
      auth.signOut().then(() => location.href = "login.html");
    };
  });
});
