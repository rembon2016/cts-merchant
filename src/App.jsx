import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useThemeStore } from "./store/themeStore";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Transaction from "./pages/Transaction";
import Profile from "./pages/Profile";
import FaQ from "./pages/FaQ";
import Pos from "./pages/POS";
import PosTransaction from "./pages/POS/transaction";
import PosTransactionDetail from "./pages/POS/detail";
import PosProducts from "./pages/POS/products";
import AccountInformation from "./pages/AccountInformation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notification from "./pages/Notification";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import EditProfile from "./pages/EditProfile";
import EditMerchant from "./pages/EditMerchant";
import DetailProduct from "./pages/ProductDetail";
import Invoice from "./pages/Invoice";
import DetailInvoice from "./pages/Invoice/detail";
import AddInvoice from "./pages/Invoice/add";

function App() {
  const { isDark } = useThemeStore();
  const { isLoggedIn, setupAutoLogout, clearAutoLogoutTimer } = useAuthStore();

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
                  <Pos />
                </ProtectedRoute>
              }
            />
            <Route
              path="pos/transaction"
              element={
                <ProtectedRoute>
                  <PosTransaction />
                </ProtectedRoute>
              }
            />
            <Route
              path="pos/transaction/:id"
              element={
                <ProtectedRoute>
                  <PosTransactionDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="pos/products"
              element={
                <ProtectedRoute>
                  <PosProducts />
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
            <Route
              path="register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="notification"
              element={
                <ProtectedRoute>
                  <Notification />
                </ProtectedRoute>
              }
            />
            <Route
              path="cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
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
            <Route
              path="product/:id"
              element={
                <ProtectedRoute>
                  <DetailProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="invoice"
              element={
                <ProtectedRoute>
                  <Invoice />
                </ProtectedRoute>
              }
            />
            <Route
              path="invoice/add"
              element={
                <ProtectedRoute>
                  <AddInvoice />
                </ProtectedRoute>
              }
            />
            <Route
              path="invoice/detail/:id"
              element={
                <ProtectedRoute>
                  <DetailInvoice />
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
