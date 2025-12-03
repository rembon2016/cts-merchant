import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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

  return (
    <div className="bg-gray-100 dark:bg-slate-900 min-h-screen">
      <main className="max-w-sm mx-auto min-h-screen relative">
        {isLoggedIn && <Header />}
        {showPermissionBanner && (
          <div className="mx-4 mt-3 mb-2 rounded-xl bg-blue-50 text-blue-900 p-3 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm">
                Aktifkan notifikasi untuk update real-time
              </span>
              <button
                className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm"
                onClick={async () => {
                  await requestForToken();
                  if (
                    typeof window !== "undefined" &&
                    "Notification" in window &&
                    Notification.permission !== "default"
                  ) {
                    setShowPermissionBanner(false);
                  }
                }}
              >
                Aktifkan
              </button>
            </div>
          </div>
        )}
        <Outlet />
        <div className="h-28" />
        {isLoggedIn && <BottomNav />}
        {isLoggedIn && <ChatBubble />}
      </main>
    </div>
  );
};

export default MainLayout;
