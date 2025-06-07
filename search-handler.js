// search-handler.js
import { db } from "./scripts/firebase-init.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Kör detta när sökfältet ändras
export function initSearch(inputId, resultCallback) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.addEventListener("input", async () => {
    const search = input.value.trim().toLowerCase();
    if (!search || search.length < 2) return;

    const results = {
      users: [],
      threads: []
    };

    // Sök användare
    const usersRef = collection(db, "users");
    const usersQuery = query(usersRef, where("username", ">=", search));
    const userSnap = await getDocs(usersQuery);
    userSnap.forEach(doc => {
      results.users.push({ id: doc.id, ...doc.data() });
    });

    // Sök forumtrådar
    const threadsRef = collection(db, "forumThreads");
    const threadQuery = query(threadsRef, where("title", ">=", search));
    const threadSnap = await getDocs(threadQuery);
    threadSnap.forEach(doc => {
      results.threads.push({ id: doc.id, ...doc.data() });
    });

    resultCallback(results);
  });
}