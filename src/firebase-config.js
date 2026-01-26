import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

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

const checkMessagingSupport = async () => {
  const supported = await isSupported();
  if (supported) {
    try {
      messaging = getMessaging(app);
      return true;
    } catch (e) {
      console.warn("Firebase messaging initialization failed:", e);
      messaging = null;
      return false;
    }
  }
  return false;
};

// Start initial support check
checkMessagingSupport();

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

    // Ensure messaging is initialized if supported
    if (!messaging) {
      const supported = await checkMessagingSupport();
      if (!supported) {
        console.warn("Messaging unsupported in this browser/environment");
        return null;
      }
    }

    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    isGettingToken = true;

    // Use globalThis.Notification to avoid ReferenceError in environments where Notification is not defined
    const NotificationObj = globalThis?.Notification;

    if (NotificationObj) {
      // Jika permission saat ini bukan 'granted', segera hapus token yang tersimpan
      if (NotificationObj.permission !== "granted") {
        sessionStorage.removeItem(SESSION_KEY);
      }

      const permission = await NotificationObj.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_VAPID_KEY,
        });
        settingToken(token);
        return token;
      } else {
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

/**
 * Detects whether the current environment is an iOS device without standalone
 * web app mode (i.e., running as a normal web page, not as a standalone web app).
 *
 * @returns {boolean} True if the environment is an iOS device without standalone
 * web app mode, false otherwise.
 */
export const detectIosWebPushUnavailable = () => {
  if (typeof globalThis === "undefined") return false;

  const ua = navigator.userAgent.toLowerCase();
  // Check for iPhone/iPad/iPod, or Macintosh with touch points (iPad Pro in desktop mode)
  const isIos =
    /iphone|ipad|ipod/.test(ua) ||
    (ua.includes("macintosh") && navigator.maxTouchPoints > 0);

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
  const NotificationObj = globalThis?.Notification;
  if (!NotificationObj) return;

  if (NotificationObj.permission === "default") {
    const handler = () => {
      requestForToken();
    };
    globalThis?.addEventListener("click", handler, { once: true });
  }
};
