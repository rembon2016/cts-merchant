import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Transaction from "./pages/Transaction";
import Profile from "./pages/Profile";
import FaQ from "./pages/FaQ";
import POS from "./pages/POS";
import AccountInformation from "./pages/AccountInformation";
import Login from "./pages/Login";
import Notification from "./pages/Notification";
import { useThemeStore } from "./store/themeStore";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import EditProfile from "./pages/EditProfile";
import EditMerchant from "./pages/EditMerchant";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

function App() {
  const { isDark } = useThemeStore();
  const { startAutoLogoutTimer, isLoggedIn, checkTokenExpiry, logout } =
    useAuthStore();

  useEffect(() => {
    // Cek apakah sudah expired saat aplikasi dimuat
    if (isLoggedIn) {
      if (checkTokenExpiry()) {
        logout();
      } else {
        startAutoLogoutTimer();
      }
    }
  }, [isLoggedIn]);

  return (
    <div className={isDark ? "dark" : ""}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="transaction"
              element={
                <ProtectedRoute>
                  <Transaction />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="account-information"
              element={
                <ProtectedRoute>
                  <AccountInformation />
                </ProtectedRoute>
              }
            />
            <Route
              path="faq"
              element={
                <ProtectedRoute>
                  <FaQ />
                </ProtectedRoute>
              }
            />
            <Route
              path="pos"
              element={
                <ProtectedRoute>
                  <POS />
                </ProtectedRoute>
              }
            />
            <Route
              path="login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            {/* <Route
              path="register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            /> */}
            <Route
              path="notification"
              element={
                <ProtectedRoute>
                  <Notification />
                </ProtectedRoute>
              }
            />
            <Route
              path="account/edit/:id"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="merchant/edit/:id"
              element={
                <ProtectedRoute>
                  <EditMerchant />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
