import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth,
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

window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      document.getElementById("loginPage").style.display = "none";
      document.getElementById("mainPage").style.display = "block";
    })
    .catch(() => {
      alert("Wrong Email or Password");
    });
};

window.logout = function () {
  signOut(auth);
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
