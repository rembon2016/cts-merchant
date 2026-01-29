// version-checker.js
const currentVersion = "1.0.5"; // Update setiap deploy

export const checkVersion = async () => {
  try {
    const response = await fetch("/version.json?" + Date.now());
    const data = await response.json();

    if (data.version !== currentVersion) {
      // Tampilkan notifikasi ke user
      if (globalThis.confirm("Versi baru tersedia! Refresh halaman?")) {
        globalThis.location.reload(true);
      }
    }
  } catch (error) {
    console.error("Version check failed:", error);
  }
};

// Jalankan setiap 5 menit
