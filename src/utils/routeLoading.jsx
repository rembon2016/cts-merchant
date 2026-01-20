/**
 * Route Code Splitting Utilities
 * Enables dynamic imports for route-based code splitting
 * Reduces initial bundle size and improves page load performance
 */

import { lazy, Suspense, Component } from "react";

/**
 * Route Loading Fallback Component
 * Shows while route chunk is being loaded
 */
export const RouteLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
      <p className="text-slate-600 dark:text-slate-400 text-sm">
        Loading page...
      </p>
    </div>
  </div>
);

/**
 * Error Boundary Component for Route Loading Errors
 * Handles errors that occur during route loading
 */
const RouteErrorBoundary = ({ children }) => {
  const [hasError, setError] = useState(false);
  const [error, setErrMsg] = useState(null);

  const componentDidCatch = (error, errorInfo) => {
    console.error("Route loading error:", error, errorInfo);
    setErrMsg(error);
    setError(true);
  };

  return (
    <React.ErrorBoundary
      onError={commandedCatch}
      fallback={
        hasError ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-red-600 dark:text-red-400 text-sm">
                Terjadi kesalahan memuat halaman
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Muat Ulang
              </button>
            </div>
          </div>
        ) : (
          children
        )
      }
    >
      {children}
    </React.ErrorBoundary>
  );
};

/**
 * Create route component with code splitting and error handling
 * @param {Function} importFunc - Dynamic import function
 * @returns {JSX.Element} Lazy loaded component with fallback and error boundary
 */
export const LazyLoadRoute = (importName) => {
  if (!importName) return null;
  const Component = lazy(importName);
  return (props) => (
    <RouteErrorBoundary>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Component {...props} />
      </Suspense>
    </RouteErrorBoundary>
  );
};

// ============================================
// LAZY LOADED ROUTES WITH SUSPENSE WRAPPER
// ============================================

/**
 * Wrapper component untuk lazy routes dengan Suspense dan Error Boundary
 */
export const withLazyRoute = (LazyComponent) => {
  return (props) => (
    <RouteErrorBoundary>
      <Suspense fallback={<RouteLoadingFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    </RouteErrorBoundary>
  );
};

// Main pages
export const LazyHome = lazy(() => import("../pages/Home"));
export const LazyTransaction = lazy(() => import("../pages/Transaction"));
export const LazyProfile = lazy(() => import("../pages/Profile"));
export const LazyFaQ = lazy(() => import("../pages/FaQ"));
export const LazyNotification = lazy(() => import("../pages/Notification"));
export const LazyCart = lazy(() => import("../pages/Cart"));
export const LazyCheckout = lazy(() => import("../pages/Checkout"));
export const LazyEditProfile = lazy(() => import("../pages/EditProfile"));
export const LazyEditMerchant = lazy(() => import("../pages/EditMerchant"));
export const LazyProductDetail = lazy(() => import("../pages/ProductDetail"));
export const LazyAccountInformation = lazy(
  () => import("../pages/AccountInformation"),
);

// Auth pages
export const LazyLogin = lazy(() => import("../pages/Login"));
export const LazyRegister = lazy(() => import("../pages/Register"));

// Invoice pages
export const LazyInvoice = lazy(() => import("../pages/Invoice"));
export const LazyDetailInvoice = lazy(() => import("../pages/Invoice/detail"));
export const LazyAddInvoice = lazy(() => import("../pages/Invoice/add"));

// POS pages
export const LazyPos = lazy(() => import("../pages/POS"));
export const LazyPosTransaction = lazy(
  () => import("../pages/POS/transaction"),
);
export const LazyPosTransactionDetail = lazy(
  () => import("../pages/POS/detail"),
);
export const LazyPosProducts = lazy(() => import("../pages/POS/products"));
export const LazyPosProductsDetail = lazy(
  () => import("../pages/POS/products-detail"),
);
export const LazyPosAddProducts = lazy(
  () => import("../pages/POS/add-products"),
);
export const LazyPosEditProducts = lazy(
  () => import("../pages/POS/edit-products"),
);
export const LazyPosAddCategories = lazy(
  () => import("../pages/POS/add-categories"),
);
export const LazyPosEditCategories = lazy(
  () => import("../pages/POS/edit-categories"),
);

// PPOB pages
export const LazyPPOB = lazy(() => import("../pages/ppob/PPOB"));
export const LazyPPOBHistory = lazy(() => import("../pages/ppob/PPOBHistory"));
export const LazyPPOBPulsa = lazy(() => import("../pages/ppob/PPOBPulsa"));
export const LazyPPOBListrik = lazy(() => import("../pages/ppob/PPOBListrik"));
export const LazyPPOBEWallet = lazy(() => import("../pages/ppob/PPOBEWallet"));
export const LazyPPOBGame = lazy(() => import("../pages/ppob/PPOBGame"));
export const LazyPPOBPdam = lazy(() => import("../pages/ppob/PPOBPdam"));
export const LazyPPOBPascabayar = lazy(
  () => import("../pages/ppob/PPOBPascabayar"),
);
export const LazyPPOBBPJS = lazy(() => import("../pages/ppob/PPOBBPJS"));
export const LazyPPOBWithdraw = lazy(
  () => import("../pages/ppob/PPOBWithdraw"),
);

// Support & Help pages
export const LazyCustomerSupport = lazy(
  () => import("../pages/CustomerSupport"),
);
export const LazyEmailSupportPage = lazy(
  () => import("../pages/EmailSupportPage"),
);
export const LazyLiveChatPage = lazy(() => import("../pages/LiveChatPage"));
export const LazyGuidePage = lazy(() => import("../pages/GuidePage"));
export const LazyTermsPage = lazy(() => import("../pages/TermsPage"));
export const LazyTicketCreate = lazy(() => import("../pages/TicketCreate"));
export const LazyTicketListPage = lazy(() => import("../pages/TicketListPage"));
export const LazyTicketDetailPage = lazy(
  () => import("../pages/TicketDetailPage"),
);
export const LazyFeedbackPage = lazy(() => import("../pages/FeedbackPage"));

export default {
  LazyLoadRoute,
  RouteLoadingFallback,
  RouteErrorBoundary,
  withLazyRoute,
  // Main pages
  LazyHome,
  LazyTransaction,
  LazyProfile,
  LazyFaQ,
  LazyNotification,
  LazyCart,
  LazyCheckout,
  LazyEditProfile,
  LazyEditMerchant,
  LazyProductDetail,
  LazyAccountInformation,
  // Auth
  LazyLogin,
  LazyRegister,
  // Invoice
  LazyInvoice,
  LazyDetailInvoice,
  LazyAddInvoice,
  // POS
  LazyPos,
  LazyPosTransaction,
  LazyPosTransactionDetail,
  LazyPosProducts,
  LazyPosProductsDetail,
  LazyPosAddProducts,
  LazyPosEditProducts,
  LazyPosAddCategories,
  LazyPosEditCategories,
  // PPOB
  LazyPPOB,
  LazyPPOBHistory,
  LazyPPOBPulsa,
  LazyPPOBListrik,
  LazyPPOBEWallet,
  LazyPPOBGame,
  LazyPPOBPdam,
  LazyPPOBPascabayar,
  LazyPPOBBPJS,
  LazyPPOBWithdraw,
  // Support
  LazyCustomerSupport,
  LazyEmailSupportPage,
  LazyLiveChatPage,
  LazyGuidePage,
  LazyTermsPage,
  LazyTicketCreate,
  LazyTicketListPage,
  LazyTicketDetailPage,
  LazyFeedbackPage,
};
