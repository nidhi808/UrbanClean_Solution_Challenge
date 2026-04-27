import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCK6LBh9hl22A27By8bhResppHyT33Ehc4",
  authDomain: "urbanclean-solution-challenge.firebaseapp.com",
  projectId: "urbanclean-solution-challenge",
  storageBucket: "urbanclean-solution-challenge.firebasestorage.app",
  messagingSenderId: "375106012466",
  appId: "1:375106012466:web:3b0224ab7644617b22032b",
  measurementId: "G-RGGEE3ZSDG"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, analytics, db, storage, auth };
