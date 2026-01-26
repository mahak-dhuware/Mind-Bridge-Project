import { auth, fs } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  doc,
  getDocs,
  updateDoc,
   deleteField,
   addDoc,
   deleteDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const newjournal = document.querySelector("#newjournal");
const newentry = document.querySelector("#newentry");
const canceljournal = document.querySelector("#canceljournal");
const forminput = document.querySelector(".form-input");


newentry.addEventListener("click", () => {
    newjournal.classList.remove('hidden');
    
});
canceljournal.addEventListener("click", () => {
    newjournal.classList.add('hidden');
    
});

let currentUser;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  currentUser = user;
  loadJournals("all");
});
async function loadJournals(type) {
  let q;

  if (type === "private") {
    q = query(
      collection(fs, "journals"),
      where("createdBy", "==", currentUser.uid),
      where("visibility", "==", "private"),
      orderBy("createdAt", "desc")
    );
  } 
  else if (type === "public") {
    q = query(
      collection(fs, "journals"),
      where("visibility", "==", "public"),
      orderBy("createdAt", "desc")
    );
  }
  else {
    // ALL
    q = query(
      collection(fs, "journals"),
      where("createdBy", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );
  }

  const snapshot = await getDocs(q);
  renderJournals(snapshot);
};
function renderJournals(snapshot) {
  const container = document.getElementById("journalList");
  container.innerHTML = "";

  snapshot.forEach(docSnap => {
    const j = docSnap.data();
    const date = j.createdAt?.toDate();

    container.innerHTML += `
    <article class="journal-card">
                <div class="journal-header">
                    <div class="journal-date">
                        <strong>${date?.getDate()}</strong>
          <span>${date?.toLocaleString("default", { month: "short" })}</span>
                    </div>
                    <div class="journal-meta">
                        <span class="journal-tag">${j.visibility}</span>

                    </div>
                </div>
                <h3 class="journal-title">${j.title}</h3>
                <p class="journal-excerpt">${j.body.slice(0, 120)}...</p>
                <div class="journal-footer">
                    <button class="btn-outline btn-destructive" onclick="deleteJournal('${docSnap.id}')">
        Delete
      </button>
                    
                </div>
            </article>
`
  });
}



window.saveJournal = async () => {
  const title = document.getElementById("journalTitle").value.trim();
  const body = document.getElementById("journalBody").value.trim();

  const visibilityInput = document.querySelector(
    'input[name="visibility"]:checked'
  );
  const visibility = visibilityInput?.value;

  if (!title || !body || !visibility) {
    alert("Please fill all fields and select visibility");
    return;
  }

  await addDoc(collection(fs, "journals"), {
    title,
    body,
    visibility,
    createdBy: currentUser.uid,
    createdAt: serverTimestamp(),
    sharedCircles: []
  });

  alert("Journal saved ✅");
  newjournal.classList.add('hidden');
  loadJournals("all");

}


window.deleteJournal = async (journalId) => {
  const confirmDelete = confirm("Are you sure you want to delete this journal?");
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(fs, "journals", journalId));
    alert("Journal deleted successfully");
    loadJournals("all"); // reload list
  } catch (err) {
    console.error(err);
    alert("Failed to delete journal");
  }
};
