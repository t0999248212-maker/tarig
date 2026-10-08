// Firebase Configuration Template
// Replace the values below with your actual Firebase project credentials
// Get these from Firebase Console > Project Settings > Web App

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // optional
};

// Steps to get your Firebase config:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project or select existing one
// 3. Click Project Settings (gear icon)
// 4. Go to "Your apps" section
// 5. Click on your web app
// 6. Copy the firebaseConfig object
// 7. Replace the placeholder values above with your actual credentials

// After filling in your credentials, your firebase-config.js file will look like:
// const firebaseConfig = {
//   apiKey: "AIzaSyD_2...",
//   authDomain: "myproject-abc123.firebaseapp.com",
//   projectId: "myproject-abc123",
//   storageBucket: "myproject-abc123.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "1:123456789:web:abc123def456"
// };
