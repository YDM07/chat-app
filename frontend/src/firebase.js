// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
export const auth = getAuth(app);