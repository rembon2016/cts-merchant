import { create } from "zustand";

export const useDashboardStore = create((set, get) => ({
  isLoading: false,
  data: [],
  dataOverview: [],
  error: null,
  getChartSales: async (type = "day", isDateRange = false, params = {}) => {
    const tokenPos = sessionStorage?.getItem("authPosToken");
    const branchId = sessionStorage?.getItem("branchActive");

    const {
      date = "",
      start_date = "",
      end_date = "",
      user = "",
      group_by = "year",
    } = params;

    try {
      const queryParams = new URLSearchParams({
        branch_id: branchId,
        group_by,
        start_date,
        end_date,
        user,
        date,
      });

      set({ isLoading: true, error: null });

      const urlCondition = !isDateRange ? `${type}-sales` : `${type}`;

      const response = await fetch(
        `${
          import.meta.env.VITE_API_POS_ROUTES
        }/dashboard/charts/${urlCondition}?${queryParams}`,
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
  getChartOverView: async (type = "today", params = {}) => {
    const tokenPos = sessionStorage?.getItem("authPosToken");
    const branchId = sessionStorage?.getItem("branchActive");

    const { start_date = "", end_date = "", date = "", user = "" } = params;

    const queryParams = new URLSearchParams({
      branch_id: branchId,
      start_date,
      end_date,
      user,
      date,
    });

    try {
      set({ isLoading: true, error: null });

      const response = await fetch(
        `${
          import.meta.env.VITE_API_POS_ROUTES
        }/dashboard/overview/${type}?${queryParams}`,
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
  getLowStockProduct: async () => {
    const tokenPos = sessionStorage?.getItem("authPosToken");
    const branchId = sessionStorage?.getItem("branchActive");

    try {
      set({ isLoading: true, error: null });

      const response = await fetch(
        `${
          import.meta.env.VITE_API_POS_ROUTES
        }/dashboard/low-stock-products?branch_id=${branchId}`,
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
