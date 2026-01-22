import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
}
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";
import { doc, getDoc, updateDoc, setDoc, getFirestore, serverTimestamp, deleteDoc, deleteField } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL
// } from
// "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDVgcl4pSviGZqlDfsNucWmJjPFrg8sdo",
  authDomain: "mindbridgestart.firebaseapp.com",
  projectId: "mindbridgestart",
  storageBucket: "mindbridgestart.firebasestorage.app",
  messagingSenderId: "620392039604",
  appId: "1:620392039604:web:0755bf19954b729dd103e1",
  measurementId: "G-NFR1XGX12B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const fs = getFirestore();
// const storage = getStorage();

const displayName = document.querySelector("#signup-name");
const email = document.querySelector("#signup-email");
const password = document.querySelector("#signup-password");
const confirmPassword = document.querySelector("#signup-confirm");
const terms = document.querySelector("#terms");
const btn = document.querySelector("#create-account");

const signinemail = document.querySelector("#email");
const signinpassword = document.querySelector("#login-password");
const rememberMe = document.querySelector("#remember-me");
const loginBtn = document.querySelector(".signin");


const profilename = document.querySelector("#profile-name");
const profileemail = document.querySelector("#profile-email");
const profilebio = document.querySelector("#bio");
const saveBtn = document.querySelector("#savebtn");
const welcomename = document.querySelector("#welcome-name");
const welcomeemail = document.querySelector("#welcome-email");
const profileform = document.querySelector(".profile-form");
const bio = document.querySelector("#bio-added");
const avatarImg = document.querySelector("#avatar");
const avatarInput = document.querySelector("#avatarInput");
const changeAvatarBtn = document.querySelector("#changeAvatarBtn");

const removeAvatarBtn = document.getElementById("removeAvatarBtn");
const deleteBtn = document.querySelector("#deleteAccountBtn");

const DEFAULT_AVATAR = "https://cdn.vectorstock.com/i/500p/78/35/single-gray-circle-with-a-simple-human-silhouette-vector-53897835.jpg";

// 🔹 Load avatar
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const snap = await getDoc(doc(fs, "users", user.uid));
  if (snap.exists() && snap.data().avatar) {
    avatarImg.src = snap.data().avatar;
  } else {
    avatarImg.src = DEFAULT_AVATAR;
  }
});

// 🔹 Open picker
changeAvatarBtn.addEventListener("click", () => {
  avatarInput.click();
});

// 🔹 Convert → Base64 → Firestore
avatarInput.addEventListener("change", () => {
  const file = avatarInput.files[0];
  if (!file) return;

  // 🔴 SIZE LIMIT
  if (file.size > 50 * 1024) {
    alert("Avatar must be under 50KB");
    return;
  }

  const reader = new FileReader();

  reader.onload = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const base64Image = reader.result;

    await updateDoc(doc(fs, "users", user.uid), {
      avatar: base64Image
    });

    avatarImg.src = base64Image;
    alert("Avatar updated ✅");
const snap = await getDoc(doc(fs, "users", user.uid));
    if (snap.exists() && snap.data().avatar) {
      avatarImg.src = snap.data().avatar;
      removeAvatarBtn.classList.remove("hidden");
      changeAvatarBtn.innerText = "Change Image";
    };
  }
    reader.readAsDataURL(file);
    

});

// onAuthStateChanged(auth, async (user) => {
//   if (!user) return;

//   const snap = await getDoc(doc(fs, "users", user.uid));

//   if (snap.exists() && snap.data().avatar) {
//     avatarImg.src = snap.data().avatar;
//     removeAvatarBtn.classList.remove("hidden"); 
//     changeAvatarBtn.innerText = "Change Image";
//   } else {
//     avatarImg.src = DEFAULT_AVATAR;
//     removeAvatarBtn.classList.add("hidden"); 
//     changeAvatarBtn.innerText = "Upload Image";
//   }
// });

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  
    const snap = await getDoc(doc(fs, "users", user.uid));
    if (snap.exists() && snap.data().avatar) {
      avatarImg.src = snap.data().avatar;
      removeAvatarBtn.classList.remove("hidden");
      changeAvatarBtn.innerText = "Change Image";
    }

});


// 🔹 Remove avatar
removeAvatarBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const confirmRemove = confirm("Remove profile picture?");
  if (!confirmRemove) return;

  try {
    await updateDoc(doc(fs, "users", user.uid), {
      avatar: deleteField()
    });

    avatarImg.src = DEFAULT_AVATAR;
    removeAvatarBtn.classList.add("hidden"); // 👈 HIDE AGAIN
    changeAvatarBtn.innerText = "Upload Image";
    // alert("Avatar removed ✅");

  } catch (error) {
    console.error(error);
    alert("Failed to remove avatar");
  }
});

// const avatarImg = document.getElementById("profileAvatar");

// const DEFAULT_AVATAR = "/assets/default-avatar.png";

removeAvatarBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const confirmRemove = confirm(
    "Remove profile picture and revert to default avatar?"
  );

  if (!confirmRemove) return;

  try {
    // 🔥 Remove avatar field
    await updateDoc(doc(fs, "users", user.uid), {
      avatar: ""
    });

    // 🔄 Update UI
    avatarImg.src = DEFAULT_AVATAR;

    alert("Avatar removed successfully ✅");

  } catch (error) {
    console.error(error);
    alert("Failed to remove avatar");
  }
});
// 🔹 Load profile




profileform.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) return;

  await updateDoc(doc(fs, "users", user.uid), {
    name: profilename.value,
    bio: profilebio.value
  });

  // alert("Profile updated ✅");
});

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const snap = await getDoc(doc(fs, "users", user.uid));
  if (snap.exists()) {
    profilename.value = snap.data().name;
    profileemail.value = snap.data().email;
    profilebio.value = snap.data().bio || "";
  }
});


onAuthStateChanged(auth, (user) => {
  if (!user) return;

  saveBtn.addEventListener("click", async () => {
    try {
      await updateDoc(doc(fs, "users", user.uid), {
        name: profilename.value,
        bio: profilebio.value
      });

      // 🔥 update UI instantly
      welcomename.innerText =
        profilename.value;
      bio.innerText = profilebio.value;
      // profilebio.value="";
      alert("Profile updated successfully ✅");

    } catch (err) {
      console.error(err);
      alert("Update failed: " + err.message);
    }
  });
});


onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // 🔹 Email from Auth
  welcomeemail.textContent = user.email;

  // 🔹 Name from Firestore
  const docRef = doc(fs, "users", user.uid);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    welcomename.textContent = snap.data().name;
    bio.textContent = snap.data().bio;
  } else {
    // fallback
    welcomename.textContent = user.displayName || "User";
  }
});

//delete
deleteBtn.addEventListener("click", async () => {
  const user = auth.currentUser;

  if (!user) return;

  const confirmDelete = confirm(
    "⚠️ This will permanently delete your account.\nThis action cannot be undone.\n\nAre you sure?"
  );

  if (!confirmDelete) return;

  try {
    const uid = user.uid;

    // 🔹 1. Delete Firestore user data
    await deleteDoc(doc(fs, "users", uid));

    // 🔹 2. Delete avatar from Storage (ignore if not exists)
    // const avatarRef = ref(storage, `avatars/${uid}/profile.jpg`);
    // await deleteObject(avatarRef).catch(() => {});

    // 🔹 3. Delete Auth account
    await deleteUser(user);

    alert("Account deleted successfully ❌");

    // 🔹 4. Redirect
    window.location.href = "login.html";

  } catch (error) {
    console.error(error);

    // 🔐 Firebase security rule
    if (error.code === "auth/requires-recent-login") {
      alert("Please log in again to delete your account.");
      window.location.href = "login.html";
    } else {
      alert(error.message);
    }
  }
});

//changepassword
const changeBtn = document.querySelector("#changePasswordBtn");
const save = document.querySelector("#savePasswordBtn");
const passwordBox = document.querySelector("#passwordBox");

const currentPassword = document.querySelector("#currentPassword");
const newPassword = document.querySelector("#newPassword");

// 🔹 Show input box
changeBtn.addEventListener("click", () => {
  passwordBox.style.display = "block";
});

// 🔹 Update password
save.addEventListener("click", async () => {
  const user = auth.currentUser;

  if (!user) {
    alert("Not logged in");
    return;
  }

  if (!currentPassword.value || !newPassword.value) {
    alert("Fill all fields");
    return;
  }

  try {
    // 🔐 Re-authentication (required by Firebase)
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword.value
    );

    await reauthenticateWithCredential(user, credential);

    // 🔁 Update password
    await updatePassword(user, newPassword.value);

    alert("Password updated successfully ✅");

    // Reset UI
    passwordBox.style.display = "none";
    currentPassword.value = "";
    newPassword.value = "";

  } catch (error) {
    console.error(error);

    if (error.code === "auth/wrong-password") {
      alert("Current password is incorrect");
    } else if (error.code === "auth/weak-password") {
      alert("Password should be at least 6 characters");
    } else {
      alert(error.message);
    }
  }
});