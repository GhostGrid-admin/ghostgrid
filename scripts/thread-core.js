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

// 6. När DOM är klar
document.addEventListener("DOMContentLoaded", () => {
  // Sätt UI‑texter
  document.getElementById("forum-title").innerText     = t.title;
  document.getElementById("create-btn").innerText      = t.createButton;
  document.getElementById("threadTitle").placeholder   = t.threadTitle;
  document.getElementById("threadContent").placeholder = t.threadContent;
  document.getElementById("submit-btn").innerText      = t.submit;

  // Ladda in trådar
  loadThreads();
});

// 7. Visa/dölj formulär
export function toggleForm() {
  const f = document.getElementById("formSection");
  f.style.display = f.style.display === "block" ? "none" : "block";
}

// 8. Skapa ny tråd
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
      title, content, user: user.email, timestamp: Date.now()
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

// 9. Ladda och rendera trådar
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
      <div class="reactions" id="reactions-${id}"></div>
      <div class="comment-section" id="comments-${id}"></div>
      <div class="comment-form">
        <textarea id="commentInput-${id}" rows="2" placeholder="${t.commentPlaceholder}"></textarea>
        <button onclick="submitComment('${id}')">${t.commentSubmit}</button>
      </div>
    `;
    container.appendChild(div);
    renderReactions(id);
    loadComments(id);
  });
}

// 10. Räkna och visa reaktioner
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

// 11. Ge användare en reaktion
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

// 12. Kommentera
export async function submitComment(threadId) {
  const user = auth.currentUser;
  if (!user) return alert(t.loginRequired);

  const ta   = document.getElementById(`commentInput-${threadId}`);
  const txt  = ta.value.trim();
  if (!txt || txt.length > 200) return;

  await addDoc(collection(db, "threads", threadId, "comments"), {
    content: txt, user: user.email, timestamp: Date.now()
  });
  ta.value = "";
  loadComments(threadId);
}

// 13. Visa kommentarer
async function loadComments(threadId) {
  const container = document.getElementById(`comments-${threadId}`);
  container.innerHTML = "";

  const q    = query(collection(db, "threads", threadId, "comments"), orderBy("timestamp"));
  const snap = await getDocs(q);
  snap.forEach(d => {
    const div = document.createElement("div");
    div.className = "comment";
    div.innerText = `${d.data().user}: ${d.data().content}`;
    container.appendChild(div);
  });
}
