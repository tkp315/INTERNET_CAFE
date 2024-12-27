import admin from 'firebase-admin'
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECTID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
} else {
  console.log("Firebase app already initialized");
}

export default admin