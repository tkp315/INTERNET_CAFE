import { ADMIN } from "./constants";
import admin from 'firebase-admin'

export async function subscribeToTopic(role:string,token: string, topic: string) {
  try {
    if(role===ADMIN){
    const res = await admin.messaging().subscribeToTopic([token], topic);
    console.log(`Successfully subscribed token to topic: ${topic}`, res);
    if (res.failureCount > 0) {
        console.log("Errors:", res.errors);
      }
    }
    else{
        console.log("this is only for admins")
    }
  } catch (error) {
    console.error(`Error subscribing token to topic: ${topic}`, error);
  }
}

export async function sendNotificationToTopic(
  topic: string,
  title: string,
  body: string
) {
  try {
    const message = {
      topic,
      notification: {
        title,
        body,
      },
    };
    const response = await admin.messaging().send(message);
    console.log(`Notification sent to topic: ${topic}`, response);
    return response;
  } catch (error) {
    console.error(`Error sending notification to topic: ${topic}`, error);
    throw error;
  }
}
