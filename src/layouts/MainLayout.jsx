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

const MainLayout = () => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();
  const { setSelectedCart } = useCartStore();

  const [showPermissionBanner, setShowPermissionBanner] = useState(false);

  const handlePermissionNotification = async () => {
    await requestForToken();
    if (
      typeof globalThis !== "undefined" &&
      "Notification" in globalThis &&
      Notification.permission !== "default"
    ) {
      setShowPermissionBanner(false);
    }
  };

  useEffect(() => {
    const shouldShow =
      typeof globalThis !== "undefined" &&
      "Notification" in globalThis &&
      Notification.permission === "default" &&
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

  const renderPermissionBanner = useMemo(() => {
    return (
      <div className="mx-4 mt-3 mb-2 rounded-xl bg-blue-50 text-blue-900 p-3 shadow-soft relative z-50 pointer-events-auto">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm">Aktifkan izin notifikasi?</span>
          <button
            className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm"
            type="button"
            onClick={handlePermissionNotification}
          >
            Aktifkan
          </button>
        </div>
      </div>
    );
  }, [Notification.permission, showPermissionBanner]);

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
