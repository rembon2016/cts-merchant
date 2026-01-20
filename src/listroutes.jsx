import * as LazyRoute from "./utils/routeLoading";

export const ListRoutes = () => {
  return [
    {
      path: "/",
      element: <LazyRoute.LazyHome />,
      protectRoute: true,
    },
    {
      path: "transaction",
      element: <LazyRoute.LazyTransaction />,
      protectRoute: true,
    },
    {
      path: "products",
      element: <LazyRoute.LazyProduct />,
      protectRoute: true,
    },
    {
      path: "profile",
      element: <LazyRoute.LazyProfile />,
      protectRoute: true,
    },
    {
      path: "customer-support",
      element: <LazyRoute.LazyCustomerSupport />,
      protectRoute: true,
    },
    {
      path: "account/edit/:id",
      element: <LazyRoute.LazyEditProfile />,
      protectRoute: true,
    },
    {
      path: "merchant/edit/:id",
      element: <LazyRoute.LazyEditMerchant />,
      protectRoute: true,
    },
    {
      path: "account-information",
      element: <LazyRoute.LazyAccountInformation />,
      protectRoute: true,
    },
    {
      path: "faq",
      element: <LazyRoute.LazyFaQ />,
      protectRoute: true,
    },
    {
      path: "pos",
      element: <LazyRoute.LazyPos />,
      protectRoute: true,
    },
    {
      path: "pos/transaction",
      element: <LazyRoute.LazyPosTransaction />,
      protectRoute: true,
    },
    {
      path: "pos/transaction/:id",
      element: <LazyRoute.LazyPosTransactionDetail />,
      protectRoute: true,
    },
    {
      path: "pos/products",
      element: <LazyRoute.LazyPosProducts />,
      protectRoute: true,
    },
    {
      path: "pos/products/:id",
      element: <LazyRoute.LazyPosProductsDetail />,
      protectRoute: true,
    },
    {
      path: "pos/tambah-produk",
      element: <LazyRoute.LazyPosAddProducts />,
      protectRoute: true,
    },
    {
      path: "pos/edit-produk/:id",
      element: <LazyRoute.LazyPosEditProducts />,
      protectRoute: true,
    },
    {
      path: "pos/tambah-kategori",
      element: <LazyRoute.LazyPosAddCategories />,
      protectRoute: true,
    },
    {
      path: "pos/edit-kategori/:id",
      element: <LazyRoute.LazyPosEditCategories />,
      protectRoute: true,
    },
    {
      path: "login",
      element: <LazyRoute.LazyLogin />,
      protectRoute: false,
    },
    {
      path: "register",
      element: <LazyRoute.LazyRegister />,
      protectRoute: false,
    },
    {
      path: "notification",
      element: <LazyRoute.LazyNotification />,
      protectRoute: true,
    },
    {
      path: "cart",
      element: <LazyRoute.LazyCart />,
      protectRoute: true,
    },
    {
      path: "checkout",
      element: <LazyRoute.LazyCheckout />,
      protectRoute: true,
    },
    {
      path: "product/:id",
      element: <LazyRoute.LazyProductDetail />,
      protectRoute: true,
    },
    {
      path: "invoice",
      element: <LazyRoute.LazyInvoice />,
      protectRoute: true,
    },
    {
      path: "invoice/add",
      element: <LazyRoute.LazyAddInvoice />,
      protectRoute: true,
    },
    {
      path: "invoice/detail/:id",
      element: <LazyRoute.LazyDetailInvoice />,
      protectRoute: true,
    },
    {
      path: "invoice/detail/:id",
      element: <LazyRoute.LazyDetailInvoice />,
      protectRoute: true,
    },
    {
      path: "cs/email",
      element: <LazyRoute.LazyEmailSupportPage />,
      protectRoute: true,
    },
    {
      path: "cs/chat",
      element: <LazyRoute.LazyLiveChatPage />,
      protectRoute: true,
    },
    {
      path: "cs/guide",
      element: <LazyRoute.LazyGuidePage />,
      protectRoute: true,
    },
    {
      path: "cs/guide",
      element: <LazyRoute.LazyGuidePage />,
      protectRoute: true,
    },
    {
      path: "cs/terms",
      element: <LazyRoute.LazyTermsPage />,
      protectRoute: true,
    },
    {
      path: "cs/ticket/create",
      element: <LazyRoute.LazyTicketCreate />,
      protectRoute: true,
    },
    {
      path: "cs/ticket/create",
      element: <LazyRoute.LazyTicketCreate />,
      protectRoute: true,
    },
    {
      path: "cs/tickets",
      element: <LazyRoute.LazyTicketListPage />,
      protectRoute: true,
    },
    {
      path: "cs/ticket/:id",
      element: <LazyRoute.LazyTicketListPage />,
      protectRoute: true,
    },
    {
      path: "cs/feedback",
      element: <LazyRoute.LazyFeedbackPage />,
      protectRoute: true,
    },
    {
      path: "ppob",
      element: <LazyRoute.LazyPPOB />,
      protectRoute: true,
    },
    {
      path: "ppob/history",
      element: <LazyRoute.LazyPPOBHistory />,
      protectRoute: true,
    },
    {
      path: "ppob/pulsa",
      element: <LazyRoute.LazyPPOBPulsa />,
      protectRoute: true,
    },
    {
      path: "ppob/listrik",
      element: <LazyRoute.LazyPPOBListrik />,
      protectRoute: true,
    },
    {
      path: "ppob/ewallet",
      element: <LazyRoute.LazyPPOBEWallet />,
      protectRoute: true,
    },
    {
      path: "ppob/ewallet",
      element: <LazyRoute.LazyPPOBEWallet />,
      protectRoute: true,
    },
    {
      path: "ppob/game",
      element: <LazyRoute.LazyPPOBGame />,
      protectRoute: true,
    },
    {
      path: "ppob/pdam",
      element: <LazyRoute.LazyPPOBPdam />,
      protectRoute: true,
    },
    {
      path: "ppob/pdam",
      element: <LazyRoute.LazyPPOBPdam />,
      protectRoute: true,
    },
    {
      path: "ppob/pascabayar",
      element: <LazyRoute.LazyPPOBPascabayar />,
      protectRoute: true,
    },
    {
      path: "ppob/pascabayar",
      element: <LazyRoute.LazyPPOBPascabayar />,
      protectRoute: true,
    },
    {
      path: "ppob/bpjs",
      element: <LazyRoute.LazyPPOBBPJS />,
      protectRoute: true,
    },
    {
      path: "ppob/bpjs",
      element: <LazyRoute.LazyPPOBBPJS />,
      protectRoute: true,
    },
    {
      path: "ppob/withdraw",
      element: <LazyRoute.LazyPPOBWithdraw />,
      protectRoute: true,
    },
  ];
};
