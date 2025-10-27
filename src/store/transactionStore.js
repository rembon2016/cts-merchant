import { create } from "zustand";

const ROOT_API = import.meta.env.VITE_API_ROUTES;
const ROOT_API_POS = import.meta.env.VITE_API_POS_ROUTES;

const useTransactionStore = create((set, get) => ({
  // Categories state
  isLoading: false,
  error: null,
  transactions: [],
  statistic: [],
  currentPage: 1,
  total: 0,
  headersAPIContent: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },

  // Get transactions from API with pagination and filters
  getListTransactions: async () => {
    const tokenPos = sessionStorage.getItem("authPosToken");
    const activeBranch = sessionStorage.getItem("branchActive");

    try {
      set({ isLoading: true, error: null });

      const response = await fetch(
        `/api/transactions?branch_id=${activeBranch}`,
        {
          method: "GET",
          headers: {
            ...get().headersAPIContent,
            Authorization: `Bearer ${tokenPos}`,
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

      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: "GET",
        headers: {
          ...get().headersAPIContent,
          Authorization: `Bearer ${tokenPos}`,
        },
      });

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

  // Get Statitstic Transaction
  getStatisticTransaction: async (value, type) => {
    const tokenPos = sessionStorage.getItem("authToken");

    const params = { startDate: "start_date", endDate: "end_date" };

    const yearNow = new Date().getFullYear();
    const monthNow = new Date().getMonth() + 1;
    const dayNow = new Date().getDate();

    const defaultDateStart = "2020-01-01";

    let queryParams;

    if (type === "range") {
      queryParams = `${params?.startDate}=${value?.from}&${params?.endDate}=${value?.to}`;
    } else if (type === "month") {
      queryParams = `${params?.startDate}=${defaultDateStart}&${params?.endDate}=${yearNow}-${value}-01`;
    } else if (type === "year") {
      queryParams = `${params?.startDate}=${defaultDateStart}&${params?.endDate}=${value}-${monthNow}-01`;
    } else {
      queryParams = `${params?.startDate}=${defaultDateStart}&${params?.endDate}=${yearNow}-${monthNow}-${dayNow}`;
    }

    try {
      set({ isLoading: true, error: null });

      const response = await fetch(
        `/api/v1/merchant/transaction/summary?${queryParams}`,
        {
          headers: {
            ...get().headersAPIContent,
            Authorization: `Bearer ${tokenPos}`,
          },
        }
      );

      if (!response.ok) {
        set({ isLoading: false, statistic: [], error: "Terjadi Kesalahan" });
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();

      set({ isLoading: false, statistic: result.data, error: null });
    } catch (error) {
      set({ isLoading: false, statistic: [], error: error.message });
    }
  },
}));

export { useTransactionStore };
