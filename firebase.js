
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";



const app=initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: "https://smartbodausers-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_FIREBASE_APPID

})

const db = getDatabase(app); // Realtime Database

const auth= getAuth(app);
export  {auth,app,db}