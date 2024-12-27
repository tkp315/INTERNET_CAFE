"use client"

import { messaging } from "@/lib/firebase";
import { getToken } from "firebase/messaging";
import { useEffect } from "react"

function FirebaseServiceWorker() {
    useEffect(()=>{
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            console.log("This browser supports push notifications.");
          } else {
            console.log("This browser does NOT support push notifications.");
          }
    if('serviceWorker'in navigator){
        navigator.serviceWorker
        // C:\Users\HP\Desktop\Internet_shop\shop-app\public\firebase-messaging-sw.js
        .register('/firebase-messaging-sw.js')
        .then((registration)=>{
            console.log("Service Worker registered",registration);
            getToken(messaging,{vapidKey:process.env.NEXT_PUBLIC_FIREBASE_VAPID}).then((currentToken)=>{
                if(currentToken){
                    console.log('FCM token',currentToken)
                }
                else{
                    console.log('no FCM token available')
                }
            }) .catch((err) => {
                console.log("An error occurred while retrieving the token", err);
              });
        }) .catch((error) => {
            console.log("Service Worker registration failed:", error);
          });
    }
    },[])
  return null
}

export default FirebaseServiceWorker
