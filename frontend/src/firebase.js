// src/firebase.js

import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from "firebase/auth";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

import { getStorage } from "firebase/storage";


// 🔧 Replace these values with your own Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyAIqjwNWS5y3dNxD_y4MmIK821YC1L-ucM",
    authDomain: "chatapp-b9d54.firebaseapp.com",
    projectId: "chatapp-b9d54",
    storageBucket: "chatapp-b9d54.firebasestorage.app",
    messagingSenderId: "566031867550",
    appId: "1:566031867550:web:de83494d75726bb81be58f",
    measurementId: "G-NLJB8H063S"
    };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ add this line

export {
  auth,
  db,
  storage, // ✅ export this
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
};
