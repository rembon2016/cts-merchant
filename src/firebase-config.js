import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSANGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const SESSION_KEY = "firebaseToken";
let isGettingToken = false;

// Fungsi untuk meminta izin dan mendapatkan Token
export const requestForToken = async () => {
  try {
    if (isGettingToken) return null;
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    isGettingToken = true;
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPID_KEY, // Masukkan VAPID Key disini
      });
      if (token) {
        sessionStorage.setItem(SESSION_KEY, token);
        return token;
      } else {
        sessionStorage.removeItem(SESSION_KEY);
        return null;
      }
    } else {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
    return null;
  } finally {
    isGettingToken = false;
  }
};

// Listener untuk pesan saat aplikasi sedang dibuka (Foreground)
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export const subscribeOnMessage = (callback) => onMessage(messaging, callback);

export const detectIosWebPushUnavailable = () => {
  const ua = navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(ua);
  const isStandalone =
    globalThis.matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone === true;
  return isIos && !isStandalone;
};

export const ensureNotificationPermission = () => {
  if (typeof globalThis === "undefined") return;
  if (!("Notification" in globalThis)) return;
  if (Notification.permission === "default") {
    const handler = () => {
      requestForToken();
    };
    globalThis.addEventListener("click", handler, { once: true });
  }
};
