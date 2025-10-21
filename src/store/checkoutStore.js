import { create } from "zustand";

export const useCheckoutStore = create((set, get) => ({
  totalPrice: 0,
  selectPaymentMethod: 1,
  isLoading: false,
  cartItems: [],
  paymentData: [],
  posSettingsData: [],
  pendingOrder: [],
  transactionData: [],
  error: null,
  success: null,
  response: null,
  setSelectPaymentMethod: (method) => set({ selectPaymentMethod: method }),
  setCartItems: (items) => set({ cartItems: items }),
  setTotalPrice: (price) => set({ totalPrice: price }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  getPaymentMethods: async () => {
    try {
      const tokenPos = sessionStorage.getItem("authPosToken");

      set({ isLoading: true, error: null });

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/pos/payment-methods`,
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
        throw new Error("Failed to fetch payment methods");
      }

      const result = await response.json();
      set({ paymentData: result.data, isLoading: false });
      return result.data;
    } catch (error) {
      console.log(error.message);
      set({ error: error.message, isLoading: false });
    }
  },
  getPosSettings: async () => {
    try {
      const tokenPos = sessionStorage.getItem("authPosToken");

      set({ isLoading: true, error: null });

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/pos/settings`,
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
        set({ error: "Failed to fetch" });
        throw new Error("Failed to check tax");
      }

      const result = await response.json();
      set({ posSettingsData: result.data, isLoading: false });
    } catch (error) {
      console.log("Error:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },
  saveOrder: async (orderData) => {
    try {
      const tokenPos = sessionStorage.getItem("authPosToken");

      set({ isLoading: true, error: null });

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/pos/transaction/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${tokenPos}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        set({
          error: "Failed to save pending order",
          isLoading: false,
          success: null,
          response,
        });
        throw new Error("Failed to save pending order");
      }

      const result = await response.json();

      set({
        pendingOrder: result.data,
        isLoading: false,
        success: true,
        response,
      });

      if (response) {
        setTimeout(() => {
          set({ success: null });
        }, 2000);
      }

      return result;
    } catch (error) {
      console.log("Error:", error.message);
      set({ error: error.message, isLoading: false, success: null });
    }
  },
  getTransactionDetail: async (transactionId) => {
    try {
      const tokenPos = sessionStorage.getItem("authPosToken");

      set({ isLoading: true, error: null });

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/transactions/${transactionId}`,
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
        set({ error: "Failed to fetch" });
        throw new Error("Failed to check tax");
      }

      const result = await response.json();
      set({ transactionData: result.data, isLoading: false });
      return result;
    } catch (error) {
      console.log("Error:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },
}));
