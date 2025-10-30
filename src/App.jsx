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
import PosProductsDetail from "./pages/POS/products-detail";
import PosAddProducts from "./pages/POS/add-products";
import PosEditProducts from "./pages/POS/edit-products";
import PosAddCategories from "./pages/POS/add-categories";
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
import CustomerSupport from "./pages/CustomerSupport";
import EmailSupportPage from "./pages/EmailSupportPage";
import LiveChatPage from "./pages/LiveChatPage";
import GuidePage from "./pages/GuidePage";
import TermsPage from "./pages/TermsPage";
import TicketCreate from "./pages/TicketCreate";
import TicketListPage from "./pages/TicketListPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import FeedbackPage from "./pages/FeedbackPage";
import PPOB from "./pages/ppob/PPOB";
import PPOBHistory from "./pages/ppob/PPOBHistory";
import PPOBPulsa from "./pages/ppob/PPOBPulsa";
import PPOBListrik from "./pages/ppob/PPOBListrik";
import PPOBEWallet from "./pages/ppob/PPOBEWallet";
import PPOBGame from "./pages/ppob/PPOBGame";
import PPOBPdam from "./pages/ppob/PPOBPdam";
import PPOBPascabayar from "./pages/ppob/PPOBPascabayar";
import PPOBBPJS from "./pages/ppob/PPOBBPJS";
import PPOBWithdraw from "./pages/ppob/PPOBWithdraw";

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
              path="pos/products/:id"
              element={
                <ProtectedRoute>
                  <PosProductsDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="pos/tambah-produk"
              element={
                <ProtectedRoute>
                  <PosAddProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="pos/edit-produk/:id"
              element={
                <ProtectedRoute>
                  <PosEditProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="pos/tambah-kategori"
              element={
                <ProtectedRoute>
                  <PosAddCategories />
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
            <Route
              path="customer-support"
              element={
                <ProtectedRoute>
                  <CustomerSupport />
                </ProtectedRoute>
              }
            />
            <Route
              path="cs/email"
              element={
                <ProtectedRoute>
                  <EmailSupportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="cs/chat"
              element={
                <ProtectedRoute>
                  <LiveChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="cs/guide"
              element={
                <ProtectedRoute>
                  <GuidePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="cs/terms"
              element={
                <ProtectedRoute>
                  <TermsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="cs/ticket/create"
              element={
                <ProtectedRoute>
                  <TicketCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="cs/tickets"
              element={
                <ProtectedRoute>
                  <TicketListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="cs/ticket/:id"
              element={
                <ProtectedRoute>
                  <TicketDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="cs/feedback"
              element={
                <ProtectedRoute>
                  <FeedbackPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="ppob"
              element={
                <ProtectedRoute>
                  <PPOB />
                </ProtectedRoute>
              }
            />
            <Route
              path="ppob/history"
              element={
                <ProtectedRoute>
                  <PPOBHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="ppob/pulsa"
              element={
                <ProtectedRoute>
                  <PPOBPulsa />
                </ProtectedRoute>
              }
            />
            <Route
              path="ppob/listrik"
              element={
                <ProtectedRoute>
                  <PPOBListrik />
                </ProtectedRoute>
              }
            />
            <Route
              path="ppob/ewallet"
              element={
                <ProtectedRoute>
                  <PPOBEWallet />
                </ProtectedRoute>
              }
            />
            <Route
              path="ppob/game"
              element={
                <ProtectedRoute>
                  <PPOBGame />
                </ProtectedRoute>
              }
            />
            <Route
              path="ppob/pdam"
              element={
                <ProtectedRoute>
                  <PPOBPdam />
                </ProtectedRoute>
              }
            />
            <Route
              path="ppob/pascabayar"
              element={
                <ProtectedRoute>
                  <PPOBPascabayar />
                </ProtectedRoute>
              }
            />
            <Route
              path="ppob/bpjs"
              element={
                <ProtectedRoute>
                  <PPOBBPJS />
                </ProtectedRoute>
              }
            />
            <Route
              path="ppob/withdraw"
              element={
                <ProtectedRoute>
                  <PPOBWithdraw />
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
