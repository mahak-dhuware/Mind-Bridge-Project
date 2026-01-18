import { auth, fs } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  deleteField,
  serverTimestamp,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

let count = 0;
onAuthStateChanged(auth, (user) => {
  console.log("AUTH STATE CHANGED:", user);
});

const createCircleBtn = document.querySelector("#createCircleBtn");
const createcircle = document.querySelector(".create-circle");
const closecreatecircle = document.querySelector("#closecreatecircle");
const createBtn = document.querySelector("#createBtn")


closecreatecircle.addEventListener("click", () => {
  createcircle.classList.add('hidden');
})


const titleInput = document.querySelector("#circleTitle");
const descInput = document.querySelector("#circleDescription");
const tagsInput = document.querySelector("#circleTags");
const circleList = document.getElementById("myCircles");
const nocircle = document.querySelector("#nocircle")
const recommendedCircles = document.querySelector("#recommendedCircles")
// AUTH CHECK






let authResolved = false;
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  console.log("Auth state:", user);

  if (!authResolved) {
    authResolved = true;
    if (!user) return; // ⛔ wait for restore
  }

  if (!user) {
    window.location.replace("login.html");
    return;
  }

  currentUser = user;
  // loadCircles();
  loadMyCircles();
  loadRecommendedCircles();
 
});

createCircleBtn.addEventListener("click", () => {
  // if (!currentUser) {
  //   alert("Login required");
  //   return;
  // }
  createcircle.classList.remove('hidden');
})



// CREATE CIRCLE
createBtn.addEventListener("click", async () => {

  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const visibility =
    document.querySelector('input[name="visibility"]:checked')?.value;

  const tags = tagsInput.value
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

  if (!title || !description || !visibility) {
    alert("Fill all fields");
    return;
  }
  console.log("User:", currentUser);

  // await addDoc(collection(fs, "circles"), {
  //   title: "Test Circle",
  //   description: "This is a test",
  //   tags: ["test"],
  //   visibility: "public",
  //   createdBy: currentUser.uid,
  //   createdAt: serverTimestamp(),
  //   members: { [currentUser.uid]: "admin" },
  //   joinRequests: {}
  // });
  // console.log("Circle created!");



  try {
    await addDoc(collection(fs, "circles"), {
      title,
      description,
      tags,
      visibility,
      coverImage: "",
      createdBy: currentUser.uid,
      createdAt: serverTimestamp(),
      members: {
        [currentUser.uid]: "admin"
      },
      joinRequests: {}
    });

    alert("Circle created 🎉");
    count = +1;
    createcircle.classList.add('hidden');
    titleInput.value = "";
    descInput.value = "";
    tagsInput.value = "";
    loadCircles(); // refresh list
  } catch (err) {
    console.error("Create circle error:", err);
    alert(err.message);
  }
});

function getInitials(title) {
  return title
    .trim()
    .split(/\s+/)      // split by spaces
    .map(word => word[0].toUpperCase())
    .slice(0, 2)       // max 2 initials (optional)
    .join("");
}



//LOAD CIRCLES
async function loadCircles() {
  if (!currentUser) return;

  const q = query(
    collection(fs, "circles"),
    where("createdBy", "==", currentUser.uid)
  );

  // const snapshot = await getDocs(collection(fs, "circles"));
  const snapshot = await getDocs(q);
  circleList.innerHTML = "";

  snapshot.forEach(docSnap => {
    const c = docSnap.data();
    const tagsHtml = c.tags?.map(tag => `<span class="tag">${tag}</span>`)
      .join("");
    circleList.innerHTML += `
    <div class="circle-card" >
                    <div class="circle-header blue-gradient">
                        <div class="circle-avatar">${getInitials(c.title)}</div>
                        <span class="badge-circle">Admin</span>
                    </div>
                    <div class="circle-content">
                        <h3 class="circle-title">${c.title}</h3>
                        <p class="circle-description">${c.description}</p>
                        <div class="circle-tags">
                        ${tagsHtml}
                        </div>
                        <div class="circle-meta">
                          
                            <span class="badge-small">${c.visibility}</span>
                        </div>
                        <button class="btn-outline btn-small" onclick="joinCircle('${docSnap.id}', '${c.visibility}') ">
                        
          ${c.visibility === "public" ? "Join" : "Request to Join"}
        </button>
        <a href="circle-detail.html?id=${docSnap.id}"
   class="btn-primary btn-small">
   View Circle
</a>
         </div>             
    `;

  });
};

// JOIN / REQUEST
// window.joinCircle = async (circleId, visibility) => {
//   if (!currentUser) return;

//   const circleRef = doc(fs, "circles", circleId);

//   try {
//     if (visibility === "public") {
//       await updateDoc(circleRef, {
//         [`members.${currentUser.uid}`]: "member"
//       });
//       alert("Joined 🎉");
//     } else {
//       await updateDoc(circleRef, {
//         [`joinRequests.${currentUser.uid}`]: true
//       });
//       alert("Request sent ⏳");
//       console.log("sent");
//         const q = query(
//     collection(fs, "circles"),
//     where("createdBy", "==", currentUser.uid)
//   );
//       const snapshot = await getDocs(q);
//       snapshot.forEach(docSnap => {
//     const c = docSnap.data();
//     const tagsHtml = c.tags?.map(tag => `<span class="tag">${tag}</span>`)
//       .join("");
//       circleList.innerHTML += `
//       <div class="circle-card" >
//                     <div class="circle-header blue-gradient">
//                         <div class="circle-avatar">${getInitials(c.title)}</div>
//                         <span class="badge-circle">Admin</span>
//                     </div>
//                     <div class="circle-content">
//                         <h3 class="circle-title">${c.title}</h3>
//                         <p class="circle-description">${c.description}</p>
//                         <div class="circle-tags">
//                         ${tagsHtml}
//                         </div>
//                         <div class="circle-meta">
                          
//                             <span class="badge-small">${c.visibility}</span>
//                         </div>
     
//        <button class="btn-outline btn-small" onclick="joinCircle('${docSnap.id}', '${c.visibility}') ">
                        
//           ${c.visibility === "public" ? "Join" : "Request Sent"}
//         </button>
//       `;
//     }
//       )}
//   } catch (err) {
//     console.error(err);
//     alert("Action failed");
//   };
// };
window.joinCircle = async (circleId, visibility) => {
  if (!currentUser) return;

  const circleRef = doc(fs, "circles", circleId);

  try {
    if (visibility === "public") {
      await updateDoc(circleRef, {
        [`members.${currentUser.uid}`]: "member"
      });

      alert("Joined 🎉");
      loadMyCircles();
      loadRecommendedCircles();

    } else {
      await updateDoc(circleRef, {
        [`joinRequests.${currentUser.uid}`]: true
      });

      alert("Request sent ⏳");
      loadMyCircles();
      loadRecommendedCircles(); // remove from recommended
    }
  } catch (err) {
    console.error(err);
    alert("Action failed");
  }
};

window._auth = auth;
//load Circles for admin




//admin
async function loadJoinRequests(circleId) {
  const circleRef = doc(fs, "circles", circleId);
  const snap = await getDocs(circleRef);

  if (!snap.exists()) return;

  const data = snap.data();
  const requests = data.joinRequests || {};

  const container = document.getElementById("joinRequests");
  container.innerHTML = "";

  Object.keys(requests).forEach(uid => {
    container.innerHTML += `
      <div class="request-card">
        <span>User: ${uid}</span>
        <button onclick="approveRequest('${circleId}','${uid}')">Approve</button>
        <button onclick="rejectRequest('${circleId}','${uid}')">Reject</button>
      </div>
    `;
  });
}
//approve/reject request
window.approveRequest = async (circleId, userId) => {
  const circleRef = doc(fs, "circles", circleId);

  await updateDoc(circleRef, {
    [`members.${userId}`]: "member",
    [`joinRequests.${userId}`]: deleteField()
  });

  createNotification(userId, "Your join request was approved 🎉");
  loadJoinRequests(circleId);
};
window.rejectRequest = async (circleId, userId) => {
  const circleRef = doc(fs, "circles", circleId);

  await updateDoc(circleRef, {
    [`joinRequests.${userId}`]: deleteField()
  });

  createNotification(userId, "Your join request was rejected ❌");
  loadJoinRequests(circleId);
};

async function loadMyCircles() {
  const snapshot = await getDocs(collection(fs, "circles"));
  const myList = document.getElementById("myCircles");
  myList.innerHTML = "";

  snapshot.forEach(docSnap => {
    const c = docSnap.data();
    const role = c.members?.[currentUser.uid];
if (role) {
      myList.innerHTML += renderCircleCard(docSnap.id, c, true, role);
      
    }
  });
}

// async function loadRecommendedCircles() {
//   const snapshot = await getDocs(collection(fs, "circles"));
//   const recList = document.getElementById("recommendedCircles");
//   recList.innerHTML = "";

//   snapshot.forEach(docSnap => {
//     const c = docSnap.data();
//     const isMember = c.members?.[currentUser.uid];
//     const requested = c.joinRequests?.[currentUser.uid];

//     if (!isMember && !requested) {
//       recList.innerHTML += renderCircleCard(docSnap.id, c, false);
//     }
//   });
// }
// function renderCircleCard(id, c, isMine, role = "") {
//   const tags = c.tags?.map(t => `<span class="tag">${t}</span>`).join("");

//   let badge = "";
//   if (isMine) {
//     badge =
//       role === "admin"
//         ? `<span class="badge admin">Admin</span>`
//         : `<span class="badge member">Member</span>`;
//   }
//   return `
//       <div class="circle-card" >
//                     <div class="circle-header blue-gradient">
//                         <div class="circle-avatar">${getInitials(c.title)}</div>
//                      <span class="badge-circle">Admin</span>
//                    </div>
//                  <div class="circle-content">
//                        <h3 class="circle-title">${c.title}</h3>
//                         <p class="circle-description">${c.description}</p>
//                          <div class="circle-tags">
//                         ${tags}
//                         </div>
//                         <div class="circle-meta">
                          
//                            <span class="badge-small">${c.visibility}</span>
//                        </div>
    
//       ${
//         isMine
//           ? `<span class="badge btn-outline btn-small">Joined</span>
//              <a href="circle-detail.html?id=${id}"
//    class="btn-primary btn-small">
//    View Circle
// </a>`
//           : `<button class="btn-outline btn-small" onclick="joinCircle('${id}', '${c.visibility}')">
//                ${c.visibility === "public" ? "Join" : "Request"}
//              </button>`
               
//       }
    
//   `;
//     }
async function loadRecommendedCircles() {
  const snapshot = await getDocs(collection(fs, "circles"));
  const recList = document.getElementById("recommendedCircles");
  recList.innerHTML = "";

  snapshot.forEach(docSnap => {
    const c = docSnap.data();

    const isMember = c.members?.[currentUser.uid];
    const requested = c.joinRequests?.[currentUser.uid];

    // 👇 THIS IS WHERE YOUR LINE GOES
    if (!isMember) {
      recList.innerHTML += renderCircleCard(
        docSnap.id,
        c,
        false,
        requested // pass pending state
      );
    }
  });
}
function renderCircleCard(id, c, isMine, roleOrRequested = "") {
  const tags = c.tags?.map(t => `<span class="tag">${t}</span>`).join("");

  // ----- BADGE (Admin / Member) -----
  let roleBadge = "";
  if (isMine) {
    roleBadge =
      roleOrRequested === "admin"
        ? `<span class="badge admin">Admin</span>`
        : `<span class="badge member">Member</span>`;
  }

  // ----- ACTION BUTTON -----
  let actionBtn = "";

  if (isMine) {
    actionBtn = `
      <span class="badge joined">Joined</span>
      <a href="circle-detail.html?id=${id}"
         class="btn-primary btn-small">
         View Circle
      </a>
    `;
  } else {
    if (roleOrRequested) {
      // join request already sent
      actionBtn = `<span class="badge pending">Pending Approval</span>`;
    } else {
      actionBtn = `
        <button class="btn-outline btn-small"
          onclick="joinCircle('${id}', '${c.visibility}')">
          ${c.visibility === "public" ? "Join" : "Request"}
        </button>
      `;
    }
  }

  if (isMine) {
  if (roleOrRequested === "admin") {
    actionBtn = `
      <a href="circle-detail.html?id=${id}" class="btn-primary btn-small">
        Manage
      </a>
      <button class="btn-destructive btn-outline btn-small"
        onclick="deleteCircle('${id}')">
        Delete Group
      </button>
    `;
  } else {
    actionBtn = `
      <a href="circle-detail.html?id=${id}" class="btn-primary btn-small">
        View
      </a>
      <button class="btn-outline btn-small"
        onclick="leaveCircle('${id}')">
        Leave Group
      </button>
    `;
  }
}

  // ----- FINAL CARD -----
  return `
    <div class="circle-card">
      <div class="circle-header blue-gradient">
        <div class="circle-avatar">${getInitials(c.title)}</div>
        ${roleBadge}
      </div>

      <div class="circle-content">
        <h3 class="circle-title">${c.title}</h3>
        <p class="circle-description">${c.description}</p>

        <div class="circle-tags">${tags}</div>

        <div class="circle-meta">
          <span class="badge-small">${c.visibility}</span>
        </div>

        ${actionBtn}
      </div>
    </div>
  `;
}

//delete

window.deleteCircle = async (circleId) => {
  if (!confirm("Delete this circle permanently?")) return;

  try {
    await deleteDoc(doc(fs, "circles", circleId));
    alert("Circle deleted 🗑️");

    loadMyCircles();
    loadRecommendedCircles();
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};
//leave
window.leaveCircle = async (circleId) => {
  if (!confirm("Leave this circle?")) return;

  try {
    await updateDoc(doc(fs, "circles", circleId), {
      [`members.${currentUser.uid}`]: deleteField()
    });

    alert("Left circle");

    loadMyCircles();
    loadRecommendedCircles();
  } catch (err) {
    console.error(err);
    alert("Failed to leave");
  }
};