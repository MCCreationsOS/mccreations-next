import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_KEY,
    authDomain: "mccreations-c3cb8.firebaseapp.com",
    databaseURL: "https://mccreations-c3cb8.firebaseio.com",
    projectId: "mccreations-c3cb8",
    storageBucket: "mccreations-c3cb8.appspot.com",
    messagingSenderId: "92325017566",
    appId: "1:92325017566:web:949acc99082d5c969c4f4f",
    measurementId: "G-0MSTKN2G62"
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);