// useAppVersion.js
import { useEffect, useState } from "react";

export const useAppVersion = () => {
  const [needsUpdate, setNeedsUpdate] = useState(false);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const res = await fetch("/version.json?" + Date.now(), {
          cache: "no-cache",
        });
        const meta = await res.json();

        const localVersion = localStorage.getItem("app_version");

        if (localVersion && localVersion !== meta?.version) {
          setNeedsUpdate(true);
        }

        localStorage.setItem("app_version", meta.version);
      } catch (err) {
        console.error("Failed to check version:", err);
      }
    };

    checkForUpdates();
    const interval = setInterval(checkForUpdates, 10 * 60 * 1000); // Check every 10 min

    return () => clearInterval(interval);
  }, []);

  const reload = () => {
    globalThis.location.reload(true);
  };

  return { needsUpdate, reload };
};
