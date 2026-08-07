const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

let loggedInUserName = "User";

function loginWithGoogle() {
    auth.signInWithPopup(googleProvider)
    .then((result) => {
        loggedInUserName = result.user.displayName || "User";
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('room-section').style.display = 'block';
        document.getElementById('user-name').innerText = loggedInUserName;
    })
    .catch((error) => {
        console.error("Login Error:", error);
    });
}

document.getElementById('google-login-btn').addEventListener('click', loginWithGoogle);
