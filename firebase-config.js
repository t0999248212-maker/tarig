const firebaseConfig = {
  apiKey: "AIzaSyCcO0CPFjcVn4uK7bFSsUCt5TWgMMK6DMA",
  authDomain: "tarig-portfolio.firebaseapp.com",
  projectId: "tarig-portfolio",
  storageBucket: "tarig-portfolio.firebasestorage.app",
  messagingSenderId: "160305798272",
  appId: "1:160305798272:web:0cc535191d4260abac9a65",
  measurementId: "G-G450D2HX87"
};

if (!window.firebase || !window.firebase.apps || !window.firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const app = firebase.app();
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics ? firebase.analytics() : null;

// Admin emails configuration (client-side fallback).
// Update this array to change allowed admin email(s) quickly.
// For stronger security, set a custom claim `admin: true` for admin users
// in the Firebase Console using the Admin SDK instead of relying on this list.
window.ADMIN_EMAILS = window.ADMIN_EMAILS || [
  "Tarighitblh@email.com"
];