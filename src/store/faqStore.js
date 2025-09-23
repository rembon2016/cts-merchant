import { create } from "zustand";

export const useFaqStore = create((set) => ({
  faqData: [],
  setFaqData: (faqData) => set({ faqData }),
}));
