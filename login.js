import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  indexedDBLocalPersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCxZ_pqLanqJgcQrVmFsFouQ17fmaYPy30",
  authDomain: "anikous-music-institute.firebaseapp.com",
  projectId: "anikous-music-institute",
  storageBucket: "anikous-music-institute.firebasestorage.app",
  messagingSenderId: "529726639589",
  appId: "1:529726639589:web:573382dd91e4a3be8a330c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Safari / iPhone-ல் லாகின் ஸ்டக் ஆகாமல் இருக்க இது அவசியம்
setPersistence(auth, indexedDBLocalPersistence)
  .catch(() => {
    // ஒருவேளை IndexedDB வேலை செய்யவில்லை என்றால் LocalStorage-க்கு மாறும்
    return setPersistence(auth, browserLocalPersistence);
  })
  .catch((error) => {
    console.error("Persistence setting error: ", error);
  });

window.loginUser = function () {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!emailInput || !passwordInput) {
    alert("Email அல்லது Password ஃபார்ம் கிடைக்கவில்லை.");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("தயவுசெய்து Email மற்றும் Password-ஐ உள்ளிடவும்.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      document.getElementById("loginPage").style.display = "none";
      document.getElementById("mainPage").style.display = "block";
      
      setTimeout(() => {
        const pScroll = document.getElementById("pianoScroll");
        if (pScroll) pScroll.scrollLeft = (pScroll.scrollWidth - pScroll.clientWidth) / 2;
      }, 100);
    })
    .catch((error) => {
      // என்ன பிழை என்பதை போன் ஸ்கிரீன்லயே காட்டும்
      alert("Login Error: " + error.message);
    });
};

window.logout = function () {
  signOut(auth).then(() => {
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("mainPage").style.display = "none";
  });
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainPage").style.display = "block";
  } else {
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("mainPage").style.display = "none";
  }
});
