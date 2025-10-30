import { create } from 'zustand';

const usePPOBStore = create((set) => ({
  // Balance data
  balance: 5000000,
  mainBalance: 2000000,
  
  // Commission data
  commission: {
    today: 25000,
    thisWeek: 125000,
    thisMonth: 250000,
  },
  
  // Transaction statistics
  stats: {
    today: 25,
    thisWeek: 120,
    thisMonth: 580,
  },
  
  // Actions
  updateBalance: (amount) => set((state) => ({
    balance: state.balance + amount,
  })),
  
  deductBalance: (amount) => set((state) => ({
    balance: state.balance - amount,
  })),
  
  addCommission: (amount, type = 'today') => set((state) => ({
    commission: {
      ...state.commission,
      [type]: state.commission[type] + amount,
    },
  })),
  
  incrementStats: (type = 'today') => set((state) => ({
    stats: {
      ...state.stats,
      [type]: state.stats[type] + 1,
    },
  })),
}));

export { usePPOBStore };
