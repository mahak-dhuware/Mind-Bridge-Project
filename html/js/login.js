import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
}
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";
import { doc, getDoc, updateDoc, setDoc, getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyBDVgcl4pSviGZqlDfsNucWmJjPFrg8sdo",
//   authDomain: "minfsridgestart.firebaseapp.com",
//   projectId: "minfsridgestart",
//   storageBucket: "minfsridgestart.firebasestorage.app",
//   messagingSenderId: "620392039604",
//   appId: "1:620392039604:web:0755bf19954b729dd103e1",
//   measurementId: "G-NFR1XGX12B"
// };
const firebaseConfig = {
  apiKey: "AIzaSyBDVgcl4pSviGZqlDfsNucWmJjPFrg8sdo",
  authDomain: "mindbridgestart.firebaseapp.com",
  databaseURL: "https://mindbridgestart-default-rtdb.firebaseio.com",
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

await setPersistence(auth, browserLocalPersistence);

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
const DEFAULT_AVATAR = "../assests/default-avatar.png";

// onAuthStateChanged(auth, (user) => {
//   if (!user) {
//     window.location.href = "login.html";
//   }
// });

//sign up
// btn.addEventListener("click", async (e) => {
//   e.preventDefault();

//   // 🔸 Validation
//   if (!terms.checked) {
//     alert("Please accept Terms & Privacy Policy");
//     return;
//   }

//   if (password.value !== confirmPassword.value) {
//     alert("Passwords do not match");
//     return;
//   }

//   try {
//     // 🔹 Create user
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       email.value,
//       password.value
//     );

//     const user = userCredential.user;

//     // 🔹 Update display name
//     await updateProfile(user, {
//       displayName: displayName.value
//     });

//     // 🔹 Save extra data in fs (SAFE)
//     await set(ref(fs, "users/" + user.uid), {
//       name: displayName.value,
//       email: email.value,
//       createdAt: new Date().toISOString()
//     });

//     alert("Account created successfully 🎉");
//     window.location.href = "login.html";

//   } catch (error) {
//     alert(error.message);
//     console.error(error);
//   }
// });
// btn.onclick = async (e) => {
//   e.preventDefault();

//   try {
//     const cred =
//       await createUserWithEmailAndPassword(
//         auth,
//         email.value,
//         password.value
//       );

//     await updateProfile(cred.user, {
//       displayName: displayName.value
//     });

//     await setDoc(doc(db, "users", cred.user.uid), {
//       name: displayName.value,
//       email: email.value,
//       avatar: "",
//       bio: "",
//       createdAt: serverTimestamp()
//     });

//     alert("Signup success");

//   } catch (e) {
//     console.error(e);
//     alert(e.message);
//   }
// };

// btn.addEventListener("click", async (e) => {
//   e.preventDefault();

//   if (!terms.checked) {
//     alert("Please accept Terms & Privacy Policy");
//     return;
//   }

//   if (password.value !== confirmPassword.value) {
//     alert("Passwords do not match");
//     return;
//   }

//   try {
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       email.value,
//       password.value
//     );

//     const user = userCredential.user;

//     // 🔹 Update Auth profile
//     await updateProfile(user, {
//       displayName: displayName.value
//     });

//     // 🔹 SAVE TO FIRESTORE (THIS CREATES DOCUMENT)
//     await setDoc(doc(fs, "users", user.uid), {
//       name: displayName.value,
//       email: email.value,
//       avatar:"",
//       bio: "",
//       createdAt: serverTimestamp(),
//     });



//     alert("Account created successfully 🎉");
//     window.location.href = "login.html";

//   } catch (error) {
//     alert(error.message);
//     console.error(error);
//   }
// });


// btn.addEventListener("click", async (e) => {
//   e.preventDefault();

//   // 🔸 Validation
//   if (!terms.checked) {
//     alert("Please accept Terms & Privacy Policy");
//     return;
//   }

//   if (password.value !== confirmPassword.value) {
//     alert("Passwords do not match");
//     return;
//   }

//   try {
//     // 🔹 Create user
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       email.value,
//       password.value
//     );

//     const user = userCredential.user;

//     // 🔹 Update display name
//     await updateProfile(user, {
//       displayName: displayName.value
//     });

//     // 🔹 Save extra data in DB (SAFE)
//     await set(ref(db, "users/" + user.uid), {
//       name: displayName.value,
//       email: email.value,
//       createdAt: new Date().toISOString()
//     });

//     alert("Account created successfully 🎉");
//     window.location.href = "login.html";

//   } catch (error) {
//     alert(error.message);
//     console.error(error);
//   }
// });

btn.addEventListener("click", async (e) => {
  e.preventDefault();


  if (!terms.checked) {
    alert("Accept terms first");
    return;
  }


  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match");
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth,
      email.value.trim(),
      password.value.trim());

    await updateProfile(cred.user, {
      displayName: name
    });

    await setDoc(doc(fs, "users", cred.user.uid), {
      name: displayName.value.trim(),
      email: email.value.trim(),
      avatar: "",
      bio: "",
      createdAt: serverTimestamp()
    });

    alert("Account created 🎉");
    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});



//sign in
loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    // 🔸 Remember Me
    const persistence = rememberMe.checked
      ? browserLocalPersistence
      : browserSessionPersistence;

    await setPersistence(auth, persistence);

    //     // 🔹 Sign in
    await signInWithEmailAndPassword(
      auth,
      signinemail.value,
      signinpassword.value
    );

    alert("Login successful ✅");
    window.location.href = "dashboard.html";

  } catch (error) {
    alert(error.message);
    console.error(error);
  }
});



