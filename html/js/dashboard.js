import { auth, fs } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  doc,
  getDocs,
  updateDoc,
   deleteField,
   addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  currentUser = user;

  loadCircleCount();
  loadJournalCount();
});

async function loadCircleCount() {
  const q = query(collection(fs, "circles"));
  const snapshot = await getDocs(q);

  let count = 0;

  snapshot.forEach(docSnap => {
    const circle = docSnap.data();
    if (circle.members && circle.members[currentUser.uid]) {
      count++;
    }
  });

  document.getElementById("circlesCount").innerText = count;
}

async function loadJournalCount() {
  const q = query(
    collection(fs, "journals"),
    where("createdBy", "==", currentUser.uid)
  );

  const snapshot = await getDocs(q);
  document.getElementById("journalCount").innerText = snapshot.size;
}
