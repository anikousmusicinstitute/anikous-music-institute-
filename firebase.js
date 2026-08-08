// ============================================================
// ANIKOUS MUSIC INSTITUTE - FIREBASE MASTER CONFIG
// Phase 1: Authentication + Firestore + Analytics
// ============================================================

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs
} from "firebase/firestore";

// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyCxZ_pqLanqJgcQrVmFsFouQ17fmaYPy30",
  authDomain: "anikous-music-institute.firebaseapp.com",
  projectId: "anikous-music-institute",
  storageBucket: "anikous-music-institute.firebasestorage.app",
  messagingSenderId: "529726639589",
  appId: "1:529726639589:web:573382dd91e4a3be8a330c",
  measurementId: "G-C1DHT2QCCZ"
};

// ============================================================
// INITIALIZE FIREBASE
// ============================================================

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

const auth = getAuth(app);

const db = getFirestore(app);

// ============================================================
// USER PROFILE
// ============================================================

async function createUserProfile(user, role = "student", extra = {}) {

  if (!user) return null;

  const userRef = doc(db, "users", user.uid);

  const existing = await getDoc(userRef);

  const profile = {
    uid: user.uid,
    email: user.email || "",
    name:
      extra.name ||
      user.displayName ||
      user.email?.split("@")[0] ||
      "User",

    role: role,

    photoURL: user.photoURL || "",

    status: "active",

    updatedAt: serverTimestamp()
  };

  if (!existing.exists()) {

    await setDoc(userRef, {
      ...profile,
      createdAt: serverTimestamp(),

      attendancePercentage: 0,
      assignmentCompleted: 0,
      assignmentTotal: 0,
      progressPercentage: 0,

      grade: "Grade 1"
    });

  } else {

    await updateDoc(userRef, profile);

  }

  return profile;
}

// ============================================================
// GET USER PROFILE
// ============================================================

async function getUserProfile(uid) {

  if (!uid) return null;

  const snap = await getDoc(
    doc(db, "users", uid)
  );

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };
}

// ============================================================
// UPDATE USER PROFILE
// ============================================================

async function updateUserProfile(uid, data) {

  if (!uid) return false;

  await updateDoc(
    doc(db, "users", uid),
    {
      ...data,
      updatedAt: serverTimestamp()
    }
  );

  return true;
}

// ============================================================
// ATTENDANCE
// ============================================================

async function saveAttendance(data) {

  const attendanceRef = collection(
    db,
    "attendance"
  );

  await addDoc(attendanceRef, {
    ...data,
    createdAt: serverTimestamp()
  });

  return true;
}

// ============================================================
// GET STUDENT ATTENDANCE
// ============================================================

async function getStudentAttendance(studentId) {

  const q = query(
    collection(db, "attendance"),
    where("studentId", "==", studentId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// ============================================================
// ASSIGNMENTS
// ============================================================

async function createAssignment(data) {

  await addDoc(
    collection(db, "assignments"),
    {
      ...data,
      createdAt: serverTimestamp()
    }
  );

  return true;
}

// ============================================================
// GET ASSIGNMENTS
// ============================================================

async function getAssignments(studentId = null) {

  let q;

  if (studentId) {

    q = query(
      collection(db, "assignments"),
      where("studentId", "==", studentId)
    );

  } else {

    q = query(
      collection(db, "assignments")
    );

  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// ============================================================
// UPDATE ASSIGNMENT
// ============================================================

async function updateAssignment(
  assignmentId,
  data
) {

  await updateDoc(
    doc(db, "assignments", assignmentId),
    {
      ...data,
      updatedAt: serverTimestamp()
    }
  );

  return true;
}

// ============================================================
// PROGRESS
// ============================================================

async function saveProgress(
  studentId,
  data
) {

  const progressRef = doc(
    db,
    "progress",
    studentId
  );

  await setDoc(
    progressRef,
    {
      studentId,

      ...data,

      updatedAt: serverTimestamp()
    },
    {
      merge: true
    }
  );

  await updateUserProfile(
    studentId,
    {
      progressPercentage:
        Number(data.progressPercentage || 0)
    }
  );

  return true;
}

// ============================================================
// GET PROGRESS
// ============================================================

async function getProgress(studentId) {

  const snap = await getDoc(
    doc(db, "progress", studentId)
  );

  if (!snap.exists()) return null;

  return snap.data();
}

// ============================================================
// CLASS NOTES
// ============================================================

async function saveClassNote(data) {

  await addDoc(
    collection(db, "classNotes"),
    {
      ...data,
      createdAt: serverTimestamp()
    }
  );

  return true;
}

// ============================================================
// NOTIFICATIONS
// ============================================================

async function createNotification(data) {

  await addDoc(
    collection(db, "notifications"),
    {
      ...data,
      read: false,
      createdAt: serverTimestamp()
    }
  );

  return true;
}

// ============================================================
// GET USER NOTIFICATIONS - REAL TIME
// ============================================================

function listenNotifications(
  userId,
  callback
) {

  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId)
  );

  return onSnapshot(q, snapshot => {

    const notifications =
      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    callback(notifications);

  });

}

// ============================================================
// MARK NOTIFICATION AS READ
// ============================================================

async function markNotificationRead(
  notificationId
) {

  await updateDoc(
    doc(db, "notifications", notificationId),
    {
      read: true,
      readAt: serverTimestamp()
    }
  );

}

// ============================================================
// SAVE SCORE
// ============================================================

async function saveScore(data) {

  await addDoc(
    collection(db, "scores"),
    {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  );

  return true;
}

// ============================================================
// GET STUDENT SCORES
// ============================================================

async function getStudentScores(
  studentId
) {

  const q = query(
    collection(db, "scores"),
    where("studentId", "==", studentId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

}

// ============================================================
// AUTH STATE
// ============================================================

function watchAuth(callback) {

  return onAuthStateChanged(
    auth,
    async user => {

      if (user) {

        const profile =
          await getUserProfile(user.uid);

        callback(user, profile);

      } else {

        callback(null, null);

      }

    }
  );

}

// ============================================================
// LOGOUT
// ============================================================

async function logoutUser() {

  await signOut(auth);

}

// ============================================================
// GLOBAL EXPORT
// ============================================================

window.AMI_FIREBASE = {

  app,

  analytics,

  auth,

  db,

  createUserProfile,
  getUserProfile,
  updateUserProfile,

  saveAttendance,
  getStudentAttendance,

  createAssignment,
  getAssignments,
  updateAssignment,

  saveProgress,
  getProgress,

  saveClassNote,

  createNotification,
  listenNotifications,
  markNotificationRead,

  saveScore,
  getStudentScores,

  watchAuth,
  logoutUser
};

console.log(
  "🎹 AMI Firebase Master System Loaded"
);
