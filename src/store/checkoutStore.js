import { create } from "zustand";

export const useCheckoutStore = create((set, get) => ({
  totalPrice: 0,
  isLoading: false,
  cartItems: [],
  paymentData: [],
  posSettingsData: [],
  pendingOrder: [],
  error: null,
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
  savePendingOrder: async (orderData) => {
    try {
      const tokenPos = sessionStorage.getItem("authPosToken");

      set({ isLoading: true, error: null });

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/pos/transaction/save-pending`,
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
        set({ error: "Failed to save pending order", isLoading: false });
        throw new Error("Failed to save pending order");
      }

      const result = await response.json();

      set({ pendingOrder: result.data, isLoading: false });
      return result;
    } catch (error) {
      console.log("Error:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },
}));
