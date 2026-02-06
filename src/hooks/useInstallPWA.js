import { useEffect, useMemo, useState } from "react";

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

    const onInstalled = () => {
      setIsStandalone(true);
      setInstallEvent(null);
    };
    globalThis.addEventListener("appinstalled", onInstalled);
    return () => globalThis.removeEventListener("appinstalled", onInstalled);
  }, []);

  const showInstallCTA = useMemo(() => {
    if (isStandalone) return false;
    return true;
  }, [isStandalone]);

  const install = async (targetPlatform) => {
    const activePlatform = targetPlatform || platform;

    if (activePlatform === "android") {
      if (installEvent) {
        installEvent.prompt();
        const choice = await installEvent.userChoice;
        if (choice?.outcome === "accepted") {
          setInstallEvent(null);
          return { success: true, outcome: "accepted" };
        }
        return { success: false, outcome: choice?.outcome || "dismissed" };
      }
      return { success: false, outcome: "unavailable" };
    }
    if (activePlatform === "ios") {
      if (globalThis.navigator?.share) {
        await globalThis.navigator.share({
          title: "CTS Merchant",
          text: "Pasang CTS Merchant ke layar utama",
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
