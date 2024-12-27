// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
};
// const firebaseConfig = {
//     apiKey: "AIzaSyCAGJaihLSJWUEvt4TB26AXUTvqx2gUNhU",
//     authDomain: "shop-app-fc719.firebaseapp.com",
//     projectId: "shop-app-fc719",
//     storageBucket: "shop-app-fc719.firebasestorage.app",
//     messagingSenderId: "285213012909",
//     appId: "1:285213012909:web:1b76a3dd82756b0111a724",
//     measurementId: "G-564DPLGFXK"
//   };


// Initialize Firebase

  const app = initializeApp(firebaseConfig);
  export const messaging = getMessaging(app)

