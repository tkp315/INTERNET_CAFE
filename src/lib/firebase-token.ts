import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import axios from "axios";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID,
      });
      console.log(token);

      const res = await axios.post("/api/user/firebase-token", {
        fcmToken: token,
      });
      console.log(res);

      return token;
    } else if (permission === "denied") {
      alert("you will not able to get notifications");
    }
  } catch (error) {
    console.error("Error getting notification permission", error);
  }
};

export const onMessageListner = () => {
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Foreground Notification", payload);
      return resolve(payload);
    });
  });
};
