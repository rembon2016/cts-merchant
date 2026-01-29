import React from "react";
// Capture PWA install prompt globally to ensure it's not missed before hooks mount
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    window.deferredInstallPrompt = e;
  });
}
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "boxicons/css/boxicons.min.css";

// Import registerSW dari vite-plugin-pwa
import { registerSW } from "virtual:pwa-register";

// Registrasi Service Worker untuk PWA
const updateSW = registerSW({
  onNeedRefresh() {
    // Kita langsung update tanpa konfirmasi untuk memastikan selalu versi terbaru
    // sessuai permintaan user agar selalu update dengan website
    updateSW(true);
  },
  onOfflineReady() {
    console.log("App siap bekerja offline");
  },
});

// Cek update setiap 1 jam atau saat window focused
if (typeof window !== "undefined") {
  const checkUpdate = () => {
    updateSW();
  };

  // Cek saat pertama kali load
  checkUpdate();

  // Cek saat focus kembali ke app
  window.addEventListener("focus", checkUpdate);

  // Interval cek (setiap 1 jam)
  setInterval(checkUpdate, 60 * 60 * 1000);
}

// Initialize performance monitoring
// if (import.meta.env.DEV) {
//   initializePerformanceMonitoring();
//   optimizeLongTasks();
// }

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
