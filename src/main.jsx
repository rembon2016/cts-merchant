import React from "react";
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
    if (confirm("Konten baru tersedia. Refresh?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App siap bekerja offline");
  },
});

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
