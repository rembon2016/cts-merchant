import { create } from "zustand";

export const useCheckoutStore = create((set, get) => ({
  cartItems: [],
  totalPrice: 0,
  isLoading: false,
  paymentData: [],
  error: null,
  tokenPos: sessionStorage.getItem("authPosToken") || null,
  activeBranch: sessionStorage.getItem("branchActive") || null,
  setCartItems: (items) => set({ cartItems: items }),
  setTotalPrice: (price) => set({ totalPrice: price }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  getPaymentMethods: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/pos/payment-methods`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${get().tokenPos}`,
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
}));
