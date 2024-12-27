importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Initialize Firebase with your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCAGJaihLSJWUEvt4TB26AXUTvqx2gUNhU",
    authDomain: "shop-app-fc719.firebaseapp.com",
    projectId: "shop-app-fc719",
    storageBucket: "shop-app-fc719.firebasestorage.app",
    messagingSenderId: "285213012909",
    appId: "1:285213012909:web:1b76a3dd82756b0111a724",
    measurementId: "G-564DPLGFXK"
  };

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const link = payload.fcmOptions?.link||payload.data?.link;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './file.svg', // Example icon
    data:{url:link}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick',function(event){
  console.log('[firebase-messaging-sw.js] Notificatioin click received');

  event.notification.close();

  event.waitUntill(
    clients
    .matchAll({type:'window', includeUncontrolled:true})
    .then(function (clientList){
     const url = event.notification.data.url;

     if(!url){
      return;
     }
     for(const client of clientList){
      if(client.url===url && 'focus' in client){return client.focus}
     }

     if(clients.openWindow){
      console.log("OPENWINDOW ON CLIENT");
      return clients.openWindow(url);
     }
    })
  )
})
