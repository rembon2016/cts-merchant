import { create } from "zustand";

const SESSION_KEY = "authUser";

const userData = JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null;

export const useUserStore = create((set) => ({
  user: {
    name: userData?.name || "User",
    avatar: userData?.name[0] || "U",
    greeting: "Selamat datang",
    email: userData?.email || "",
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
