import { create } from "zustand";

export const useTotalPriceStore = create((set) => ({
  totalPrice: 0,
  setTotalPrice: (price) => {
    // Mendukung functional update dan direct value
    if (typeof price === "function") {
      set((state) => ({ totalPrice: price(state.totalPrice) }));
    } else {
      set({ totalPrice: price });
    }
  },
  resetTotalPrice: () => set({ totalPrice: 0 }),
}));
