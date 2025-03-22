"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.app = void 0;
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
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
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.app = app;
const auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
