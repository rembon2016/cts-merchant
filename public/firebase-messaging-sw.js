importScripts(
  "https://www.gstatic.com/firebasejs/9.1.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/9.1.0/firebase-messaging-compat.js"
);
const firebaseConfig = {
  apiKey: "AIzaSyBT9HDQjyKowoIrspQDG0vbVLCMjYBoX_k",
  authDomain: "cts-merchant-9629f.firebaseapp.com",
  projectId: "cts-merchant-9629f",
  storageBucket: "cts-merchant-9629f.firebasestorage.app",
  messagingSenderId: "796404841178",
  appId: "1:796404841178:web:b5007292b794ada3ab83e3",
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "";
  const options = {
    body: payload.notification?.body || "",
    icon: "/images/pwa-192x192.png",
  };
  globalThis.registration.showNotification(title, options);
});
