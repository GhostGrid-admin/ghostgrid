// scripts/thread-core.js

// 1. Hämta auth och db från vår init‑modul
import { auth, db } from "./firebase-init.js";

// 2. Importera Modular‑Firestore‑funktioner
import {
  collection,
  query,
  orderBy,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// 3. Importera auth‑hjälp
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// 4. Språkstöd
const lang = localStorage.getItem("language") || "sv";
const translations = {
  sv: {
    title: "💻 Tech Heaven",
    createButton: "➕ Skapa ny tråd",
    threadTitle: "Rubrik på tråden",
    threadContent: "Vad vill du diskutera?",
    submit: "Skicka",
    loginRequired: "Du måste vara inloggad för att reagera.",
    commentPlaceholder: "Skriv en kommentar...",
    commentSubmit: "Kommentera"
  },
  en: {
    title: "💻 Tech Heaven",
    createButton: "➕ Create new thread",
    threadTitle: "Thread title",
    threadContent: "What do you want to discuss?",
    submit: "Submit",
    loginRequired: "You must be logged in to react.",
    commentPlaceholder: "Write a comment...",
    commentSubmit: "Comment"
  }
};
const t = translations[lang];

// 5. Emojis
const emojis      = ["👍","👎","❤️","💔","😂","😢","😡","😮","😇","😳"];
const emojiLabels = ["like","dislike","love","broken","laugh","cry","angry","wow","angel","shy"];

// 6. Färgfunktion för användarnamn
async function renderColoredUsername(uid, element, fallbackEmail = "") {
  try {
    const snap = await getDoc(doc(db, "profiles", uid));
    if (snap.exists()) {
      const data = snap.data();
      element.textContent = data.username || fallbackEmail || "Användare";
      if (data.nameColor) element.style.color = data.nameColor;
      else element.style.color = "";
    } else {
      element.textContent = fallbackEmail || "Användare";
      element.style.color = "";
    }
  } catch (err) {
    element.textContent = fallbackEmail || "Användare";
    element.style.color = "";
  }
}

// 7. När DOM är klar
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("forum-title").innerText     = t.title;
  document.getElementById("create-btn").innerText      = t.createButton;
  document.getElementById("threadTitle").placeholder   = t.threadTitle;
  document.getElementById("threadContent").placeholder = t.threadContent;
  document.getElementById("submit-btn").innerText      = t.submit;
  loadThreads();
});

// 8. Visa/dölj formulär
export function toggleForm() {
  const f = document.getElementById("formSection");
  f.style.display = f.style.display === "block" ? "none" : "block";
}

// 9. Skapa ny tråd (spara även uid)
export async function submitThread() {
  const user = auth.currentUser;
  if (!user) return alert(t.loginRequired);

  const title   = document.getElementById("threadTitle").value.trim();
  const content = document.getElementById("threadContent").value.trim();
  if (!title || !content) {
    return alert("Fyll i både rubrik och innehåll.");
  }

  try {
    await addDoc(collection(db, "threads"), {
      title,
      content,
      user: user.email,
      uid: user.uid, // <-- Lägg till UID!
      timestamp: Date.now()
    });
    document.getElementById("threadTitle").value   = "";
    document.getElementById("threadContent").value = "";
    toggleForm();
    loadThreads();
  } catch (e) {
    console.error("Skapande misslyckades:", e);
    alert("Kunde inte skapa tråden, försök igen.");
  }
}

// 10. Ladda och rendera trådar
async function loadThreads() {
  const container = document.getElementById("thread-list");
  container.innerHTML = "";

  const q    = query(collection(db, "threads"), orderBy("timestamp", "desc"));
  const snap = await getDocs(q);

  snap.forEach(d => {
    const data = d.data(), id = d.id;
    const div = document.createElement("div");
    div.className = "thread";
    div.id        = `thread-${id}`;
    div.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.content}</p>
      <span class="user-name" id="thread-user-${id}"></span>
      <div class="reactions" id="reactions-${id}"></div>
      <div class="comment-section" id="comments-${id}"></div>
      <div class="comment-form">
        <textarea id="commentInput-${id}" rows="2" placeholder="${t.commentPlaceholder}"></textarea>
        <button onclick="submitComment('${id}')">${t.commentSubmit}</button>
      </div>
    `;
    container.appendChild(div);
    // Färgat namn för trådskapare
    if (data.uid)
      renderColoredUsername(data.uid, div.querySelector(`#thread-user-${id}`), data.user);
    else
      div.querySelector(`#thread-user-${id}`).textContent = data.user || "Användare";

    renderReactions(id);
    loadComments(id);
  });
}

// 11. Räkna och visa reaktioner
async function renderReactions(threadId) {
  const container = document.getElementById(`reactions-${threadId}`);
  container.innerHTML = "";

  for (let i = 0; i < emojis.length; i++) {
    const label = emojiLabels[i];
    const q     = query(
      collection(db, "threads", threadId, "reactions"),
      where("type", "==", label)
    );
    const snap  = await getDocs(q);
    const span  = document.createElement("span");
    span.innerHTML = `${emojis[i]} <span class="reaction-count">${snap.size}</span>`;
    span.onclick  = () => react(threadId, label);
    container.appendChild(span);
  }
}

// 12. Ge användare en reaktion
async function react(threadId, type) {
  const user = auth.currentUser;
  if (!user) return alert(t.loginRequired);

  const ref     = doc(db, "threads", threadId, "reactions", user.uid);
  const docSnap = await getDoc(ref);

  if (docSnap.exists() && docSnap.data().type === type) {
    await deleteDoc(ref);
  } else {
    await setDoc(ref, { type, timestamp: Date.now() });
  }
  renderReactions(threadId);
}

// 13. Kommentera (spara även uid)
export async function submitComment(threadId) {
  const user = auth.currentUser;
  if (!user) return alert(t.loginRequired);

  const ta   = document.getElementById(`commentInput-${threadId}`);
  const txt  = ta.value.trim();
  if (!txt || txt.length > 200) return;

  await addDoc(collection(db, "threads", threadId, "comments"), {
    content: txt,
    user: user.email,
    uid: user.uid, // <-- Lägg till UID!
    timestamp: Date.now()
  });
  ta.value = "";
  loadComments(threadId);
}

// 14. Visa kommentarer (med färg på namn)
async function loadComments(threadId) {
  const container = document.getElementById(`comments-${threadId}`);
  container.innerHTML = "";

  const q    = query(collection(db, "threads", threadId, "comments"), orderBy("timestamp"));
  const snap = await getDocs(q);
  snap.forEach(d => {
    const div = document.createElement("div");
    div.className = "comment";

    const nameSpan = document.createElement("span");
    nameSpan.className = "user-name";
    div.appendChild(nameSpan);

    const commentContent = document.createElement("span");
    commentContent.textContent = `: ${d.data().content}`;
    div.appendChild(commentContent);

    container.appendChild(div);

    if (d.data().uid)
      renderColoredUsername(d.data().uid, nameSpan, d.data().user);
    else
      nameSpan.textContent = d.data().user || "Användare";
  });
}
