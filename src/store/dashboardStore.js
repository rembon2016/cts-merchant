import { create } from "zustand";

export const useDashboardStore = create((set, get) => ({
  isLoading: false,
  data: [],
  dataOverview: [],
  error: null,
  getChartSales: async (type = "day", params = {}) => {
    const { date = "", user = "" } = params;

    try {
      const tokenPos = sessionStorage.getItem("authPosToken");
      const branchId = sessionStorage.getItem("branchActive");

      const queryParams = new URLSearchParams({
        branch_id: branchId,
        user,
        date,
      });

      set({ isLoading: true, error: null });

      const response = await fetch(
        `${
          import.meta.env.VITE_API_POS_ROUTES
        }/dashboard/charts/${type}-sales?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${tokenPos}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      set({ data: result.data, isLoading: false });

      return result;
    } catch (error) {
      console.log(error.message);
      set({ error: error.message, isLoading: false });
    }
  },
  getSalesByDateRanges: async () => {
    try {
      const tokenPos = sessionStorage.getItem("authPosToken");

      set({ isLoading: true, error: null });

      const response = await fetch(
        `${
          import.meta.env.VITE_API_POS_ROUTES
        }/dashboard/charts/sales-by-date-range`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${tokenPos}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      set({ data: result.data, isLoading: false });
      return result;
    } catch (error) {
      console.log(error.message);
      set({ error: error.message, isLoading: false });
    }
  },
  getChartOverView: async (type = "today") => {
    try {
      const tokenPos = sessionStorage.getItem("authPosToken");

      set({ isLoading: true, error: null });

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/dashboard/overview/${type}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${tokenPos}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      set({ dataOverview: result.data, isLoading: false });
      return result;
    } catch (error) {
      console.log(error.message);
      set({ error: error.message, isLoading: false });
    }
  },
  getCurrentCustomDateRangeSales: async () => {
    try {
      const tokenPos = sessionStorage.getItem("authPosToken");

      set({ isLoading: true, error: null });

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/dashboard/overview/custom-date`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${tokenPos}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      set({ data: result.data, isLoading: false });
      return result;
    } catch (error) {
      console.log(error.message);
      set({ error: error.message, isLoading: false });
    }
  },
  getLowStockProduct: async () => {
    try {
      const tokenPos = sessionStorage.getItem("authPosToken");

      set({ isLoading: true, error: null });

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/dashboard/low-stock-products`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${tokenPos}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      set({ data: result.data, isLoading: false });
      return result;
    } catch (error) {
      console.log(error.message);
      set({ error: error.message, isLoading: false });
    }
  },
}));
