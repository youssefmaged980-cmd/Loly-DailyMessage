import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA1oc53lGQDU7-D8sfDCgORzkFiP_Wbvyo",
  authDomain: "lolo-daily-messa.firebaseapp.com",
  projectId: "lolo-daily-messa",
  storageBucket: "lolo-daily-messa.firebasestorage.app",
  messagingSenderId: "878339416800",
  appId: "1:878339416800:web:efa8c9594af1c015146685"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
