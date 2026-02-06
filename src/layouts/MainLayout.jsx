import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import BottomNav from "../components/customs/menu/BottomNav";
import Header from "../components/homepage/Header";
import ChatBubble from "../components/cs/ChatBubble";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import {
  requestForToken,
  detectIosWebPushUnavailable,
} from "../firebase-config";
import { MdNotificationsActive } from "react-icons/md";

const MainLayout = () => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();
  const { setSelectedCart } = useCartStore();

  const [showPermissionBanner, setShowPermissionBanner] = useState(false);

  const hasNotificationSupport =
    typeof globalThis !== "undefined" && "Notification" in globalThis;

  const getNotificationPermission = () =>
    hasNotificationSupport ? globalThis?.Notification?.permission : null;

  const handlePermissionNotification = async () => {
    try {
      if (!hasNotificationSupport) return;
      const permission = await globalThis?.Notification?.requestPermission();
      if (permission === "granted") {
        await requestForToken()
          .then(() => {
            console.log("Notification permission granted.");
            setShowPermissionBanner(false);
          })
          .catch((error) => {
            console.log("Error requesting notification permission: ", error);
          });
      }
      setShowPermissionBanner(permission === "default");
    } catch (error) {
      console.log("Error requesting notification permission: ", error);
    }
  };

  useEffect(() => {
    const shouldShow =
      hasNotificationSupport &&
      getNotificationPermission() === "default" &&
      !detectIosWebPushUnavailable();
    setShowPermissionBanner(shouldShow);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // Clear selectedCart when user navigates away from cart or checkout
    const path = location.pathname || "";
    if (!path.includes("/cart") && !path.includes("/checkout")) {
      setSelectedCart([]);
      sessionStorage.removeItem("cart");
    }
  }, [location.pathname, setSelectedCart]);

  const currentNotificationPermission = getNotificationPermission();

  const renderPermissionBanner = useMemo(() => {
    if (!hasNotificationSupport || currentNotificationPermission === "granted")
      return null;
    if (!isLoggedIn) return null;

    return (
      <div className="mx-4 mb-2 rounded-xl bg-white dark:bg-gray-700 text-blue-900 dark:text-gray-300 p-3 shadow-soft relative z-50 pointer-events-auto flex items-center gap-3">
        <div className="w-16 h-16 bg-[var(--c-accent)] rounded-2xl flex justify-center items-center">
          <MdNotificationsActive className="text-5xl text-[var(--c-primary)] rotate-[20deg]" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-lg">Aktifkan izin notifikasi?</span>
          <button
            className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm mr-auto"
            onClick={handlePermissionNotification}
          >
            Aktifkan
          </button>
        </div>
      </div>
    );
  }, [hasNotificationSupport, currentNotificationPermission, isLoggedIn]);

  return (
    <div className="bg-gray-100 dark:bg-slate-900 min-h-screen">
      <main className="max-w-sm mx-auto min-h-screen relative">
        {isLoggedIn && <Header />}
        {showPermissionBanner && renderPermissionBanner}
        <Outlet />
        <div className="h-28" />
        {isLoggedIn && <BottomNav />}
        {isLoggedIn && <ChatBubble />}
      </main>
    </div>
  );
};

export default MainLayout;
