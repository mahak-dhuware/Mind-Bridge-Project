import { auth, fs } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) return;
  currentUser = user;
  loadNotifications();
});

function loadNotifications() {
  const q = query(
    collection(fs, "notifications"),
    where("toUserId", "==", currentUser.uid),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    const list = document.getElementById("notificationList");
    if (!list) return;

    list.innerHTML = "";

    snapshot.forEach(docSnap => {
      const n = docSnap.data();
      list.innerHTML += `
        <div class="notification ${n.isRead ? "" : "unread"}"
             onclick="markRead('${docSnap.id}')">
          ${n.message}
        </div>
      `;
    });
  });
}

// mark notification as read
window.markRead = async (id) => {
  await updateDoc(doc(fs, "notifications", id), {
    isRead: true
  });
};
