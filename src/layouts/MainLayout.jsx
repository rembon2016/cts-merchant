import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

const MainLayout = () => {
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {}, [isLoggedIn]);

  return (
    <div className="bg-gray-100 dark:bg-slate-900 min-h-screen">
      <main className="max-w-sm mx-auto min-h-screen relative">
        {isLoggedIn && <Header />}
        <Outlet />
        <div className="h-28" />
        {isLoggedIn && <BottomNav />}
      </main>
    </div>
  );
};

export default MainLayout;
