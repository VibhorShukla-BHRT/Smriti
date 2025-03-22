// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKAKRViCo804KwM9lNqNuMI4S9I-wJJpM",
  authDomain: "codeutsava-80.firebaseapp.com",
  projectId: "codeutsava-80",
  storageBucket: "codeutsava-80.firebasestorage.app",
  messagingSenderId: "68859582386",
  appId: "1:68859582386:web:5f8a092e711acd55ca36ab",
  measurementId: "G-SLV8NKY72Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth }