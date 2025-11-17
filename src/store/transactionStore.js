import { create } from "zustand";

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
  getListTransactions: async (params = {}) => {
    const { page = 1, per_page = 10, search = "" } = params;

    const tokenPos = sessionStorage.getItem("authPosToken");
    const activeBranch = sessionStorage.getItem("branchActive");

    const queryParams = new URLSearchParams({
      branch_id: activeBranch,
      page: page.toString(),
      per_page: per_page.toString(),
      search,
    });

    try {
      set({ isLoading: true, error: null });

      const response = await fetch(
        `${
          import.meta.env.VITE_API_POS_ROUTES
        }/transactions?${queryParams.toString()}`,
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

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/transactions/${transactionId}`,
        {
          method: "GET",
          headers: {
            ...get().headersAPIContent,
            Authorization: `Bearer ${tokenPos}`,
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
        `${
          import.meta.env.VITE_API_ROUTES
        }/v1/merchant/transaction/summary?${queryParams}`,
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
