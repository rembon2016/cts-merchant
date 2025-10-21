import { create } from "zustand";

const useTransactionStore = create((set, get) => ({
  // Categories state
  isLoading: false,
  error: null,
  transactions: [],
  currentPage: 1,
  total: 0,

  // Get transactions from API with pagination and filters
  getListTransactions: async () => {
    const token = sessionStorage.getItem("authPosToken");
    const activeBranch = sessionStorage.getItem("branchActive");

    try {
      set({ isLoading: true, error: null });

      const response = await fetch(
        `${
          import.meta.env.VITE_API_POS_ROUTES
        }/transactions?branch_id=${activeBranch}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        set({
          isLoading: false,
          error: `HTTP error! status: ${response?.status}`,
        });
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const result = await response.json();

      set({
        transactions: result?.data?.grouped_transactions,
        total: result?.data?.pagination?.total,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        transactions: [],
        total: 0,
        error: error.message || "Terjadi kesalahan saat mengambil transaksi",
      });
    }
  },

  // Get detail transaksi
  getDetailTransactions: async (transactionId) => {
    const tokenPos = sessionStorage.getItem("authPosToken");

    try {
      set({ isLoading: true, error: null });

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/transactions/${transactionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenPos}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        set({ isLoading: false, error: `Gagal mendapatkan produk` });
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const result = await response.json();

      set({ error: null, isLoading: false, transactions: result });
    } catch (error) {
      set({
        error: error.message || "Terjadi kesalahan saat mengambil produk",
      });
      return null;
    }
  },
}));

export { useTransactionStore };
