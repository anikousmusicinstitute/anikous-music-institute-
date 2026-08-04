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

// HTML-ல் உள்ள loginUser() பங்க்ஷனுடன் இது இணைக்கilmiştir
window.loginUser = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      document.getElementById("loginPage").style.display = "none";
      document.getElementById("mainPage").style.display = "block";
      
      // பியானோ ஸ்கிரீன் சரியாக சென்டர் ஆக
      setTimeout(() => {
        const pScroll = document.getElementById("pianoScroll");
        if(pScroll) pScroll.scrollLeft = (pScroll.scrollWidth - pScroll.clientWidth)/2;
      }, 100);
    })
    .catch((error) => {
      alert("Wrong Email or Password: " + error.message);
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
