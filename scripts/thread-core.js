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

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("forum-title")) document.getElementById("forum-title").innerText = t.title;
  if (document.getElementById("create-btn")) document.getElementById("create-btn").innerText = t.createButton;
  if (document.getElementById("threadTitle")) document.getElementById("threadTitle").placeholder = t.threadTitle;
  if (document.getElementById("threadContent")) document.getElementById("threadContent").placeholder = t.threadContent;
  if (document.getElementById("submit-btn")) document.getElementById("submit-btn").innerText = t.submit;

  loadThreads();
});

const emojis = ["👍", "👎", "❤️", "💔", "😂", "😢", "😡", "😮", "😇", "😳"];
const emojiLabels = ["like", "dislike", "love", "broken", "laugh", "cry", "angry", "wow", "angel", "shy"];

function toggleForm() {
  const form = document.getElementById("formSection");
  form.style.display = form.style.display === "none" ? "block" : "none";
}

function submitThread() {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      alert(t.loginRequired);
      return;
    }

    const title = document.getElementById("threadTitle").value.trim();
    const content = document.getElementById("threadContent").value.trim();
    if (!title || !content) {
      alert("Fyll i både rubrik och innehåll.");
      return;
    }

    firebase.firestore().collection("threads").add({
      title,
      content,
      user: user.email,
      timestamp: Date.now()
    }).then(() => {
      document.getElementById("threadTitle").value = "";
      document.getElementById("threadContent").value = "";
      document.getElementById("formSection").style.display = "none";
      loadThreads();
    }).catch(error => {
      console.error("Fel vid trådskapande:", error);
      alert("Kunde inte skapa tråden. Försök igen.");
    });
  });
}

function loadThreads() {
  const container = document.getElementById("thread-list");
  container.innerHTML = "";
  firebase.firestore().collection("threads").orderBy("timestamp", "desc").get().then(snapshot => {
    snapshot.forEach(doc => {
      const thread = doc.data();
      const id = doc.id;
      const div = document.createElement("div");
      div.className = "thread";
      div.id = `thread-${id}`;
      div.innerHTML = `
        <h3>${thread.title}</h3>
        <p>${thread.content}</p>
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
  });
}

function renderReactions(threadId) {
  const container = document.getElementById(`reactions-${threadId}`);
  if (!container) return;
  container.innerHTML = "";
  emojis.forEach((emoji, index) => {
    const label = emojiLabels[index];
    firebase.firestore().collection("threads").doc(threadId).collection("reactions")
      .where("type", "==", label).get().then(snapshot => {
        const count = snapshot.size;
        const span = document.createElement("span");
        span.innerHTML = `${emoji} <span class='reaction-count'>${count}</span>`;
        span.onclick = () => react(threadId, label);
        container.appendChild(span);
      });
  });
}

function react(threadId, type) {
  const user = firebase.auth().currentUser;
  if (!user) return alert(t.loginRequired);
  const ref = firebase.firestore().collection("threads").doc(threadId).collection("reactions").doc(user.uid);
  ref.get().then(doc => {
    if (doc.exists && doc.data().type === type) {
      ref.delete();
    } else {
      ref.set({ type, timestamp: Date.now() });
    }
    renderReactions(threadId);
  });
}

function submitComment(threadId) {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) return alert(t.loginRequired);
    const textarea = document.getElementById(`commentInput-${threadId}`);
    if (!textarea) return;
    const content = textarea.value.trim();
    if (!content || content.length > 200) return;
    firebase.firestore().collection("threads").doc(threadId).collection("comments").add({
      content,
      user: user.email,
      timestamp: Date.now()
    }).then(() => {
      textarea.value = "";
      loadComments(threadId);
    });
  });
}

function loadComments(threadId) {
  const container = document.getElementById(`comments-${threadId}`);
  if (!container) return;
  container.innerHTML = "";
  firebase.firestore().collection("threads").doc(threadId).collection("comments")
    .orderBy("timestamp").get().then(snapshot => {
      snapshot.forEach(doc => {
        const div = document.createElement("div");
        div.className = "comment";
        div.innerText = `${doc.data().user}: ${doc.data().content}`;
        container.appendChild(div);
      });
    });
}
