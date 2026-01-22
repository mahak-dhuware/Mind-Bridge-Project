import { auth, fs } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  doc,
  getDoc,
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

function getInitials(title) {
  return title
    .trim()
    .split(/\s+/)
    .map(word => word[0].toUpperCase())
    .slice(0, 2)
    .join("");
}


const createPostBtn = document.getElementById("createPostBtn");
const postList = document.getElementById("postList");
const members = document.querySelector("#members");
const posts = document.querySelector("#posts");
const submitPost = document.querySelector("#submitPost");
const postTitle = document.querySelector("#postTitle");
const postAuthor = document.querySelector("#postAuthor")
const adminPanel = document.querySelector("#adminPanel")

createPostBtn.addEventListener("click", () => {
   postList.classList.remove('hidden');
   adminPanel.classList.add('hidden');
})
submitPost.addEventListener("click", () => {
  postList.classList.add('hidden');
  alert ("Post Created");
})
members.addEventListener("click", () => {
  posts.classList.remove('active');
  postList.classList.add('hidden');
  membersList.classList.remove('hidden');
  members.classList.add('active');
});
posts.addEventListener("click", () => {
  posts.classList.add('active');
  members.classList.remove('active');
  postList.classList.remove('hidden');
  membersList.classList.add('hidden');
});

const params = new URLSearchParams(window.location.search);
const circleId = params.get("id");
let currentUser = null;

// onAuthStateChanged(auth, async (user) => {
//   if (!user) {
//     window.location.href = "login.html";
//     return;
//   }

//   currentUser = user;
//   loadCircleDetails();

//   loadPosts();
//    await loadMembers(circleId);  
// });
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  await loadCircleDetails();
  await loadCircle();          // admin check inside
  await loadMembers(circleId);
  loadPosts();
});



// 🔑 Get circleId from URL


if (!circleId) {
  alert("Invalid circle");
  window.location.href = "circles.html";
}
//loadCircleDetails
async function loadCircleDetails() {
  const circleRef = doc(fs, "circles", circleId);
  const snap = await getDoc(circleRef);

  if (!snap.exists()) {
    alert("Circle not found");
    return;
  }

  const circle = snap.data();

  // 🔹 Update UI
  document.getElementById("circleTitle").innerText = circle.title;
  document.getElementById("circleDescription").innerText = circle.description;
  document.getElementById("circleVisibility").innerText = circle.visibility;
document.getElementById("circleAvatar").innerText = getInitials(circle.title);
  // 🔹 Tags
  const tagsDiv = document.getElementById("circleTags");
  tagsDiv.innerHTML = "";
  circle.tags?.forEach(tag => {
    tagsDiv.innerHTML += `<span class="tag">${tag}</span>`;
  });
}
//admin

let circleData = null;

// onAuthStateChanged(auth, async (user) => {
//   if (!user) {
//     window.location.href = "login.html";
//     return;
//   }

//   currentUser = user;
//   await loadCircle();
// });
// async function loadCircle() {
//   const ref = doc(fs, "circles", circleId);
//   const snap = await getDoc(ref);

//   if (!snap.exists()) return;

//   circleData = snap.data();

//   // Text
//   circleTitle.innerText = circleData.title;
//   circleDescription.innerText = circleData.description;

//   // Avatar initials
//   circleAvatar.innerText = getInitials(circleData.title);

//   // ADMIN CHECK
//   if (circleData.members?.[currentUser.uid] === "admin") {
//     adminPanel.classList.remove("hidden");

//     editTitle.value = circleData.title;
//     editDescription.value = circleData.description;

//     loadJoinRequests();
//   }
// }
async function loadCircle() {
  const ref = doc(fs, "circles", circleId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  circleData = snap.data();

  circleTitle.innerText = circleData.title;
  circleDescription.innerText = circleData.description;
  circleAvatar.innerText = getInitials(circleData.title);

  if (circleData.members?.[currentUser.uid] === "admin") {
    adminPanel.classList.remove("hidden");
    editTitle.value = circleData.title;
    editDescription.value = circleData.description;
    loadJoinRequests();
  } else {
    adminPanel.classList.add("hidden");
  }
}

updateCircleBtn.addEventListener("click", async () => {
  const newTitle = editTitle.value.trim();
  const newDesc = editDescription.value.trim();

  if (!newTitle || !newDesc) return alert("Fields required");

  const ref = doc(fs, "circles", circleId);

  await updateDoc(ref, {
    title: newTitle,
    description: newDesc
  });

  // Live UI update
  circleTitle.innerText = newTitle;
  circleDescription.innerText = newDesc;
  circleAvatar.innerText = getInitials(newTitle);

  alert("Circle updated ✅");
});
function loadJoinRequests() {
  const list = document.getElementById("requestList");
  list.innerHTML = "";

  const requests = circleData.joinRequests || {};

  Object.keys(requests).forEach(uid => {
    list.innerHTML += `
   
      <div class="request-item " >
        <span id="request-id">${uid}</span> 
        <span ><button onclick="approve('${uid}')" class="btn-primary" id="adminbtn">Approve</button></span>
        <span >
        <button onclick="reject('${uid}') " class="btn-primary ">Reject</button>
        </span>
      </div>
    
    `;
  });
}

window.approve = async (userId) => {
  const circleRef = doc(fs, "circles", circleId);

  // 1️⃣ Add member & remove request
  await updateDoc(circleRef, {
    [`members.${userId}`]: "member",
    [`joinRequests.${userId}`]: deleteField()
  });

  // 2️⃣ CREATE NOTIFICATION
  await addDoc(collection(fs, "notifications"), {
    toUserId: userId,
    message: `🎉 "Your request to join ${circleData.title} was approved "`,
    isRead: false,
    createdAt: serverTimestamp()
  });

  alert("Approved & notified ✅");
  
};

window.reject = async (uid) => {
  const ref = doc(fs, "circles", circleId);

  await updateDoc(ref, {
    [`joinRequests.${uid}`]: deleteField()
  });

  alert("Rejected ❌");
  
};
//admin panel view 


const circleRef = doc(fs, "circles", circleId);
const snap = await getDoc(circleRef);
const circledata = snap.data();

// 🔐 CHECK ADMIN
const role = circledata.members?.[currentUser.uid];

if (role === "admin") {
  adminPanel.classList.remove("hidden");
} else {
  adminPanel.classList.add("hidden");
}

//create post

submitPost.addEventListener("click", async () => {
      postList.classList.add('hidden');
      adminPanel.classList.remove('hidden');
  const title = postTitle.value.trim();
  const body = postBody.value.trim();
  postAuthor.innerText = ``;
  if (!title || !body) return alert("Fill all fields");

  await addDoc(collection(fs, "posts"), {
    circleId,
    title,
    body,
    createdBy: currentUser.uid,
    createdAt: serverTimestamp()
  });
 
  postTitle.value = "";
  postBody.value = "";
});
//loadpost
function loadPosts() {
  const q = query(
    collection(fs, "posts"),
    where("circleId", "==", circleId),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {
    
    postList.innerHTML = "";
    
    snapshot.forEach(docSnap => {
      const p = docSnap.data();
      postList.innerHTML += renderPost(docSnap.id, p);
      loadComments(docSnap.id);

    });
  });
}
function renderPost(postId, p) {
  return `
    <div class="post-card">
       
            
                <div class="post-header">
                    <div class="post-avatar"></div>
                    <div class="post-info">
                        <h4 class="post-author"></h4>
                        <p class="post-meta"></p>
                    </div>
                    <button class="post-menu">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                    </button>
                </div>
                <h3 class="post-title" id=>${p.title}</h3>
                <p class="post-content" id=>${p.body}</p>
                <div class="post-footer">
                     <button class="post-action">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        
                    </button>

      <div class="comments" id="comments-${postId}"></div>

      <input id="comment-${postId}" placeholder="Write a comment">
      <button onclick="addComment('${postId}')">Comment</button>
    </div>
  `;
}
//add comment
// window.Comment = async (postId) => {
//   const input = document.getElementById(`comment-${postId}`);
//   const text = input.value.trim();
//   if (!text) return;

//   await addDoc(collection(fs, "comments"), {
//     postId,
//     body: text,
//     createdBy: currentUser.uid,
//     createdAt: serverTimestamp()
//   });

//   input.value = "";
// };
//load comment
// function loadComments(postId) {
//   const q = query(
//     collection(fs, "comments"),
//     where("postId", "==", postId),
//     orderBy("createdAt", "asc")
//   );

//   onSnapshot(q, (snapshot) => {
//     const box = document.getElementById(`comments-${postId}`);
//     if (!box) return;

//     box.innerHTML = "";
//     snapshot.forEach(docSnap => {
//       const c = docSnap.data();
//       box.innerHTML += `<p>💬 ${c.body}</p>`;
//     });
//   });
// }
//remove member


const membersList = document.getElementById("membersList");
async function loadMembers(circleId) {
  const snap = await getDoc(doc(fs, "circles", circleId));
  const circle = snap.data();

  if (!circle?.members) return;

  membersList.innerHTML = "";

  const isAdmin = circle.members[currentUser.uid] === "admin";

  for (const [uid, role] of Object.entries(circle.members)) {
    membersList.innerHTML += `
    <div class="post-card">
      <div class="member-row ">
        <span class="member-id">${uid}</span>
        <span class="badge ${role}">${role}</span>

        ${
          isAdmin && role === "member"
            ? `<button class="btn-destructive btn-small" id="removemember"
                onclick="removeMember('${circleId}', '${uid}')">
                Remove
              </button>`
            : ""
        }
      </div>
      </div>
    `;
  }
}

window.removeMember = async (circleId, memberUid) => {
  if (!confirm("Remove this member from the circle?")) return;

  try {
    await updateDoc(doc(fs, "circles", circleId), {
      [`members.${memberUid}`]: deleteField()
    });
// 🔔 notification
    await addDoc(collection(fs, "notifications"), {
      toUserId: memberUid,
      type: "removed",
      message: `You were removed from the circle ${circleData.title}`,
      circleId,
      createdAt: serverTimestamp(),
      isRead: false
    });

    alert("Member removed");
    loadMembers(circleId);
  } catch (err) {
    console.error(err);
    alert("Failed to remove member");
  }
};
// await addDoc(collection(fs, "notifications"), {
//   toUserId: memberUid,
//   type: "removed",
//   message: `You were removed from the circle`,
//   circleId,
//   createdAt: serverTimestamp(),
//   read: false
// });