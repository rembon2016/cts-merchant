import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../store/authStore";

export const useInstallPWA = () => {
  const [installEvent, setInstallEvent] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [platform, setPlatform] = useState("web");

  useEffect(() => {
    // Gunakan prompt yang sudah ditangkap secara global jika ada
    if (globalThis.deferredInstallPrompt) {
      setInstallEvent(globalThis.deferredInstallPrompt);
      setPlatform("android");
    }

    const handler = (e) => {
      e.preventDefault();
      setInstallEvent(e);
      setPlatform("android");
      globalThis.deferredInstallPrompt = e;
    };
    globalThis.addEventListener("beforeinstallprompt", handler);
    return () => {
      globalThis.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  useEffect(() => {
    const standalone =
      globalThis.matchMedia("(display-mode: standalone)").matches ||
      globalThis.navigator.standalone;
    setIsStandalone(!!standalone);

    // Listen for display-mode changes (e.g., when app becomes PWA)
    const mql = globalThis.matchMedia("(display-mode: standalone)");
    const onDisplayModeChange = (e) => {
      const matches = !!e.matches;
      setIsStandalone(matches);
      if (matches) setInstallEvent(null);

      // If display-mode changed to not-standalone, clear server flag when logged in
      if (!matches) {
        const { isLoggedIn, updateProfileUser } = useAuthStore.getState();
        if (isLoggedIn && updateProfileUser) {
          try {
            updateProfileUser({ pwa_installed: false });
          } catch (err) {
            console.error(
              "Error updating profile user on display mode change:",
              err,
            );
          }
        }
      }
    };
    if (mql.addEventListener) {
      mql.addEventListener("change", onDisplayModeChange);
    }

    const ua = (globalThis.navigator.userAgent || "").toLowerCase();
    const vendor = globalThis.navigator.userAgentData?.vendor || "";
    const uaData = globalThis.navigator.userAgentData || null;
    const brands = uaData?.brands?.map((b) => b.brand.toLowerCase()) || [];

    const isChromium =
      brands.includes("chromium") ||
      /chrome|crios|edg|opr|samsungbrowser/i.test(ua) ||
      vendor === "Google Inc.";

    const isSafariUA =
      /safari/i.test(ua) && !/chrome|crios|fxios|android/i.test(ua);
    // const isAppleVendor = vendor === "Apple Computer, Inc.";
    const isIOSDevice =
      /iphone|ipad|ipod|macintosh/i.test(ua) ||
      (globalThis.navigator.userAgentData?.platform === "MacIntel" &&
        globalThis.navigator.maxTouchPoints > 1);

    if (isSafariUA && isIOSDevice) {
      setPlatform("ios");
    } else if (isChromium) {
      setPlatform("android");
    } else {
      setPlatform("android");
    }

    // Check if there are any installed related apps on the device
    const checkRelatedApps = async () => {
      if (globalThis.navigator?.getInstalledRelatedApps) {
        try {
          const related = await globalThis.navigator.getInstalledRelatedApps();
          if (related && related.length > 0) {
            setIsStandalone(true);
            setInstallEvent(null);
          }
        } catch (err) {
          console.error("Error checking installed related apps:", err);
        }
      }
    };
    checkRelatedApps();

    // If user is logged in, check server-side profile flag for installed PWA
    const { isLoggedIn, token, getUser } = useAuthStore.getState();

    const checkServerFlag = async () => {
      if (!isLoggedIn) return;
      try {
        const resp = await getUser(
          token || sessionStorage.getItem("authToken"),
        );
        const installedFlag =
          resp?.data?.pwa_installed || resp?.data?.is_pwa_installed;
        if (installedFlag) {
          // if server says installed but we didn't detect locally, keep it until we verify
          setIsStandalone(true);
          setInstallEvent(null);
        }
      } catch (e) {
        console.error("Error fetching user profile for PWA flag:", e);
      }
    };
    checkServerFlag();

    const onInstalled = () => {
      setIsStandalone(true);
      setInstallEvent(null);
      const { isLoggedIn, updateProfileUser } = useAuthStore.getState();
      if (isLoggedIn && updateProfileUser) {
        try {
          updateProfileUser({ pwa_installed: true });
        } catch (err) {
          // ignore
        }
      }
    };
    globalThis.addEventListener("appinstalled", onInstalled);
    return () => {
      globalThis.removeEventListener("appinstalled", onInstalled);
      if (mql.removeEventListener) {
        mql.removeEventListener("change", onDisplayModeChange);
      }
    };
  }, []);

  const showInstallCTA = useMemo(() => {
    if (isStandalone) return false;
    if (platform === "android") return !!installEvent;
    if (platform === "ios") return !isStandalone;
    return !!installEvent;
  }, [isStandalone, installEvent, platform]);

  const install = async (targetPlatform) => {
    const activePlatform = targetPlatform || platform;

    if (activePlatform === "android") {
      if (installEvent) {
        installEvent.prompt();
        const choice = await installEvent.userChoice;
        if (choice?.outcome === "accepted") {
          setInstallEvent(null);
          setIsStandalone(true);
          const { isLoggedIn, updateProfileUser } = useAuthStore.getState();
          if (isLoggedIn && updateProfileUser) {
            try {
              updateProfileUser({ pwa_installed: true });
            } catch (err) {
              console.error("Error updating profile user on install:", err);
            }
          }
          // double-check installed related apps if supported
          if (globalThis.navigator?.getInstalledRelatedApps) {
            try {
              const related =
                await globalThis.navigator.getInstalledRelatedApps();
              if (related && related.length > 0) {
                setIsStandalone(true);
              }
            } catch (e) {
              console.error(
                "Error checking installed related apps after install:",
                e,
              );
            }
          }
          return { success: true, outcome: "accepted" };
        }
        return { success: false, outcome: choice?.outcome || "dismissed" };
      }
      return { success: false, outcome: "unavailable" };
    }
    if (activePlatform === "ios") {
      if (globalThis.navigator?.share) {
        await globalThis.navigator.share({
          title: "SpeakerKasirApp",
          text: "Pasang SpeakerKasirApp ke layar utama",
          url: globalThis.location.href,
        });
        return { success: true, outcome: "shared" };
      }
      return { success: false, outcome: "share_unavailable" };
    }
    return { success: false, outcome: "unsupported" };
  };

  return { platform, isStandalone, showInstallCTA, installEvent, install };
};
