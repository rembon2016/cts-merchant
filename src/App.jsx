import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useThemeStore } from "./store/themeStore";
import {
  ProtectedRoute,
  PublicRoute,
} from "./components/customs/route/ProtectedRoute";
import { useAuthStore } from "./store/authStore";
import { useEffect, Suspense } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Toaster } from "sonner";
import { requestForToken, subscribeOnMessage } from "./firebase-config";
import { useCustomToast } from "./hooks/useCustomToast";
import { ListRoutes } from "./listroutes";
import MainLayout from "./layouts/MainLayout";
import CustomToast from "./components/customs/toast/CustomToast";
import LoadingSkeletonList from "./components/customs/loading/LoadingSkeletonList";

function App() {
  const { isDark } = useThemeStore();
  const { isLoggedIn, setupAutoLogout, clearAutoLogoutTimer } = useAuthStore();
  const { toast, success: showSuccess, hideToast } = useCustomToast();

  useEffect(() => {
    requestForToken();
    const unsubscribe = subscribeOnMessage((payload) => {
      showSuccess(
        <div className="flex flex-col gap-2 justify-center items-center">
          <h3 className="font-bold text-lg">{payload.notification.title}</h3>
          <p className="text-sm text-center">{payload.notification.body}</p>
        </div>,
      );
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  useEffect(() => {
    // Setup auto logout saat app pertama kali load
    if (isLoggedIn) {
      setupAutoLogout();
    }

    // Cleanup saat component unmount
    return () => {
      clearAutoLogoutTimer();
    };
  }, [isLoggedIn, setupAutoLogout, clearAutoLogoutTimer]);

  return (
    <div className={isDark ? "dark" : ""}>
      {needRefresh && (
        <div className="update-notification">
          <span>Update tersedia!</span>
          <button onClick={() => updateServiceWorker(true)}>Reload</button>
        </div>
      )}
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {Array?.isArray(ListRoutes()) &&
              ListRoutes()?.map((route, index) => {
                const WrappedElement = route?.protectRoute
                  ? ProtectedRoute
                  : PublicRoute;
                return (
                  <Route
                    index
                    key={route.path + index}
                    path={route.path}
                    element={
                      <WrappedElement>
                        <Suspense fallback={<LoadingSkeletonList />}>
                          {route?.element}
                        </Suspense>
                      </WrappedElement>
                    }
                  />
                );
              })}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
