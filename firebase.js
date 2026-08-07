// Firebase configuration with your project details
const firebaseConfig = {
  apiKey: "AIzaSyCxZ_pqLanqJgcQrVmFsFouQ17fmaYPy30",
  authDomain: "anikous-music-institute.firebaseapp.com",
  projectId: "anikous-music-institute",
  storageBucket: "anikous-music-institute.firebasestorage.app",
  messagingSenderId: "529726639589",
  appId: "1:529726639589:web:573382dd91e4a3be8a330c",
  measurementId: "G-C1DHT2QCCZ"
};

// Initialize Firebase (Compat version matching index.html)
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

let loggedInUserName = "User";

function loginWithGoogle() {
    // Popup-க்கு பதிலாக Redirect முறை (Mobile & Desktop-க்கு மிகவும் சிறந்தது)
    auth.signInWithRedirect(googleProvider).catch((error) => {
        console.error("Login Error:", error);
        alert("Login Error: " + error.message);
    });
}

// பக்கம் லோட் ஆனவுடன் Redirect ஆன யூசரை செக் செய்ய
auth.getRedirectResult().then((result) => {
    if (result.user) {
        loggedInUserName = result.user.displayName || "User";
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('room-section').style.display = 'block';
        document.getElementById('user-name').innerText = loggedInUserName;
    }
}).catch((error) => {
    console.error("Redirect Error:", error);
});

document.getElementById('google-login-btn').addEventListener('click', loginWithGoogle);
