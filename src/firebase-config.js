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

// Initialize messaging only when the browser supports the required APIs
let messaging = null;
const supportsMessaging =
  typeof globalThis !== "undefined" &&
  typeof navigator !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in globalThis &&
  "Notification" in globalThis &&
  globalThis.isSecureContext === true;

if (supportsMessaging) {
  try {
    messaging = getMessaging(app);
  } catch (e) {
    console.warn("Firebase messaging not supported in this environment:", e);
    messaging = null;
  }
} else {
  messaging = null;
}

const SESSION_KEY = "firebaseToken";
let isGettingToken = false;

const settingToken = (token) => {
  if (!token) return null;

  if (token) {
    sessionStorage.setItem(SESSION_KEY, token);
    return token;
  }
};

// Fungsi untuk meminta izin dan mendapatkan Token
export const requestForToken = async () => {
  try {
    if (isGettingToken) return null;
    const existing = sessionStorage.getItem(SESSION_KEY);

    if (existing) return existing;
    isGettingToken = true;

    if (typeof globalThis !== "undefined" && "Notification" in globalThis) {
      // Jika permission saat ini bukan 'granted', segera hapus token yang tersimpan
      if (Notification?.permission !== "granted") {
        sessionStorage.removeItem(SESSION_KEY);
      }

      const permission = await Notification?.requestPermission();
      if (permission === "granted") {
        if (!messaging) {
          console.warn("Messaging unsupported in this browser/environment");
          sessionStorage.removeItem(SESSION_KEY);
          return null;
        }
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_VAPID_KEY, // Masukkan VAPID Key disini
        });
        settingToken(token);
      } else {
        // permission is 'default' (user closed prompt) or 'denied' — hapus token jika ada
        sessionStorage.removeItem(SESSION_KEY);
        return null;
      }
    } else {
      console.log("Notifications are not supported in this environment.");
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
export const onMessageListener = () => {
  if (!messaging) {
    // Resolve to null when messaging is not available to avoid unhandled rejections
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

export const subscribeOnMessage = (callback) => {
  if (!messaging) return () => undefined;
  return onMessage(messaging, callback);
};

export const detectIosWebPushUnavailable = () => {
  if (typeof globalThis === "undefined") return false;

  const ua = navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(ua);
  const isStandalone =
    globalThis.matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone === true;
  return isIos && !isStandalone;
};

// Listener untuk mendeteksi perubahan permission (Permissions API)
// Jika permission berubah ke 'prompt' (setara dengan 'default'), hapus token dari sessionStorage
if (typeof navigator !== "undefined" && "permissions" in navigator) {
  try {
    const status = await navigator.permissions.query({ name: "notifications" });
    const removeWhenNotGranted = () => {
      if (status?.state === "prompt" || status?.state === "denied") {
        sessionStorage.removeItem(SESSION_KEY);
      }
    };
    // Periksa state awal dan pasang listener untuk perubahan
    removeWhenNotGranted();
    if (typeof status.addEventListener === "function") {
      status.addEventListener("change", removeWhenNotGranted);
    } else {
      status.onchange = removeWhenNotGranted;
    }
  } catch (e) {
    // Jika Permissions API tidak tersedia atau gagal, catat peringatan
    console.warn("Permissions API unavailable or failed", e);
  }
}

export const ensureNotificationPermission = () => {
  if (typeof globalThis === "undefined") return;
  if (!("Notification" in globalThis)) return;
  if (Notification?.permission === "default") {
    const handler = () => {
      requestForToken();
    };
    globalThis?.addEventListener("click", handler, { once: true });
  }
};
