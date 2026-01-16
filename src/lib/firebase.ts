// Firebase Configuration for Anticca
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArg0ZchND1oauOq932hg-bX3JXUctdpW4",
  authDomain: "anticcareale.firebaseapp.com",
  projectId: "anticcareale",
  storageBucket: "anticcareale.firebasestorage.app",
  messagingSenderId: "394629292480",
  appId: "1:394629292480:web:417db33b9fc0a0b91a2825",
  measurementId: "G-95JPJ4PNJH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser)
let analytics: ReturnType<typeof getAnalytics> | null = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Initialize other services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export { analytics };
export default app;
