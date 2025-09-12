import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: {
    name: "Alex",
    avatar: "A",
    greeting: "Selamat datang",
  },
  income: {
    amount: "10.000",
    period: "Bulan ini",
    lastUpdated: "Diperbarui barusan",
  },
  setUser: (user) => set({ user }),
  setIncome: (income) =>
    set((state) => ({
      income: { ...state.income, ...income },
    })),
  updateIncomeAmount: (amount) =>
    set((state) => ({
      income: { ...state.income, amount },
    })),
}));
