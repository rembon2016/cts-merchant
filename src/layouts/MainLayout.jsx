import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import ChatBubble from "../components/cs/ChatBubble";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { useCartStore } from "../store/cartStore";

const MainLayout = () => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();
  const { setSelectedCart } = useCartStore();

  useEffect(() => {}, [isLoggedIn]);

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
        <Outlet />
        <div className="h-28" />
        {isLoggedIn && <BottomNav />}
        {isLoggedIn && <ChatBubble />}
      </main>
    </div>
  );
};

export default MainLayout;
