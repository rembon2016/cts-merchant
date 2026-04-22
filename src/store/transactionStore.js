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

  // Referral bonus state
  referralBonus: 0,
  hasPendingWithdrawal: false,
  isLoadingReferral: false,
  referralError: null,

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

    // const defaultDateStart = new Date().toISOString().split("T")[0];
    const defaultDateStart = "";

    // Get the last date of the given month
    const getLastDateOfMonth = (year, month) => {
      return new Date(year, month, 0).getDate();
    };

    // Ensure value is a valid number before passing to getLastDateOfMonth
    const monthValue = Number(value);
    const lastDate = getLastDateOfMonth(
      yearNow,
      Number.isNaN(monthValue) ? 1 : monthValue
    );

    let queryParams;

    if (type === "range") {
      queryParams = `${params?.startDate}=${value?.from}&${params?.endDate}=${value?.to}`;
    } else if (type === "month") {
      queryParams = `${params?.startDate}=${yearNow}-${value}-01&${params?.endDate}=${yearNow}-${value}-${lastDate}`;
    } else if (type === "year") {
      queryParams = `${params?.startDate}=${value}-01-01&${params?.endDate}=${value}-12-31`;
    } else {
      queryParams = `${params?.startDate}=${defaultDateStart}&${params?.endDate}=${defaultDateStart}`;
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

  claimReferralBonus: async (pointsAmount) => {
    const token = sessionStorage.getItem("authToken");

    // Guard: token harus ada
    if (!token) {
      return { success: false, message: "Sesi tidak valid, silakan login ulang" };
    }

    // Guard: pointsAmount harus angka positif
    const sanitizedAmount = Number(pointsAmount);
    if (!sanitizedAmount || sanitizedAmount <= 0 || !Number.isFinite(sanitizedAmount)) {
      return { success: false, message: "Nominal bonus tidak valid" };
    }

    try {
      set({ isLoadingReferral: true, referralError: null });

      const response = await fetch(
        `${import.meta.env.VITE_API_ROUTES}/v1/merchant/referral/withdraw`,
        {
          method: "POST",
          headers: {
            ...get().headersAPIContent,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ points_amount: sanitizedAmount }),
        }
      );

      // Parse JSON dengan aman — server bisa return non-JSON saat 5xx
      let result;
      try {
        result = await response.json();
      } catch {
        set({ isLoadingReferral: false, referralError: "Terjadi kesalahan pada server" });
        return { success: false, message: "Terjadi kesalahan pada server" };
      }

      if (!response.ok) {
        const message = result?.message ?? "Gagal klaim bonus";
        set({ isLoadingReferral: false, referralError: message });
        return { success: false, message };
      }

      // Re-fetch agar state sinkron dengan server
      await get().getReferralBonus();

      return { success: true, message: result?.message ?? "Berhasil klaim bonus" };
    } catch (error) {
      const message = error.message || "Terjadi kesalahan jaringan";
      set({ isLoadingReferral: false, referralError: message });
      return { success: false, message };
    }
  },

  getReferralBonus: async () => {
    const token = sessionStorage.getItem("authToken");

    try {
      set({ isLoadingReferral: true, referralError: null });

      const response = await fetch(
        `${import.meta.env.VITE_API_ROUTES}/v1/merchant/referral`,
        {
          headers: {
            ...get().headersAPIContent,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        set({ isLoadingReferral: false, referralBonus: 0, referralError: `HTTP error! status: ${response.status}` });
        return;
      }

      const result = await response.json();
      const hasPending = result?.data?.has_pending_withdrawal ?? false;
      const totalPoints = result?.data?.total_points ?? 0;
      const pendingAmount = result?.data?.pending_withdrawal_amount ?? 0;

      // Jika ada pending withdrawal, kurangi total_points dengan pending_withdrawal_amount
      const effectiveBonus = hasPending ? Math.max(0, totalPoints - pendingAmount) : totalPoints;

      set({ isLoadingReferral: false, referralBonus: effectiveBonus, hasPendingWithdrawal: hasPending, referralError: null });
    } catch (error) {
      set({ isLoadingReferral: false, referralBonus: 0, hasPendingWithdrawal: false, referralError: error.message });
    }
  },
}));

export { useTransactionStore };
