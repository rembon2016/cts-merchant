import { create } from 'zustand';

const usePPOBTransactionStore = create((set, get) => ({
  transactions: [
    {
      id: 'PPOB-2025-10001',
      type: 'pulsa',
      product: 'Pulsa Telkomsel 50K',
      target: '081234567890',
      customerName: 'Budi Santoso',
      amount: 50000,
      price: 50500,
      adminFee: 500,
      commission: 1000,
      status: 'success',
      timestamp: '2025-10-28T14:30:00',
      refNumber: 'TKS-ABC123XYZ',
    },
    {
      id: 'PPOB-2025-10002',
      type: 'listrik',
      product: 'Token PLN 100K',
      target: '12345678901',
      customerName: 'Siti Aminah',
      amount: 100000,
      price: 100500,
      adminFee: 500,
      commission: 1500,
      status: 'success',
      timestamp: '2025-10-28T13:15:00',
      refNumber: 'PLN-XYZ789ABC',
      token: '1234-5678-9012-3456-7890',
    },
    {
      id: 'PPOB-2025-10003',
      type: 'ewallet',
      product: 'GoPay 50K',
      target: '081234567890',
      customerName: 'Ahmad Yani',
      amount: 50000,
      price: 50500,
      adminFee: 500,
      commission: 800,
      status: 'success',
      timestamp: '2025-10-28T12:00:00',
      refNumber: 'GPY-DEF456GHI',
    },
    {
      id: 'PPOB-2025-10004',
      type: 'game',
      product: 'Mobile Legends 100 Diamond',
      target: '123456789 (2070)',
      customerName: 'Joko Widodo',
      amount: 25000,
      price: 25500,
      adminFee: 500,
      commission: 600,
      status: 'success',
      timestamp: '2025-10-28T11:30:00',
      refNumber: 'ML-GHI789JKL',
    },
    {
      id: 'PPOB-2025-10005',
      type: 'pulsa',
      product: 'Pulsa Indosat 25K',
      target: '085612345678',
      customerName: 'Dewi Lestari',
      amount: 25000,
      price: 25500,
      adminFee: 500,
      commission: 600,
      status: 'success',
      timestamp: '2025-10-28T10:45:00',
      refNumber: 'IND-JKL012MNO',
    },
    {
      id: 'PPOB-2025-10006',
      type: 'pulsa',
      product: 'Pulsa XL 20K',
      target: '087712345678',
      customerName: 'Rina Susanti',
      amount: 20000,
      price: 20500,
      adminFee: 500,
      commission: 500,
      status: 'failed',
      timestamp: '2025-10-28T09:20:00',
      refNumber: 'XL-MNO345PQR',
      failReason: 'Saldo tidak mencukupi',
    },
    {
      id: 'PPOB-2025-10007',
      type: 'listrik',
      product: 'Token PLN 50K',
      target: '98765432109',
      customerName: 'Hendra Gunawan',
      amount: 50000,
      price: 50500,
      adminFee: 500,
      commission: 1000,
      status: 'pending',
      timestamp: '2025-10-28T08:15:00',
      refNumber: 'PLN-PQR678STU',
    },
  ],
  
  // Filters
  filters: {
    search: '',
    dateRange: 'all', // all, today, week, month
    status: 'all', // all, success, failed, pending
    type: 'all', // all, pulsa, listrik, ewallet, game, etc
  },
  
  // Actions
  addTransaction: (transaction) => set((state) => ({
    transactions: [
      {
        ...transaction,
        id: `PPOB-2025-${10000 + state.transactions.length + 1}`,
        timestamp: new Date().toISOString(),
      },
      ...state.transactions,
    ],
  })),
  
  getTransactionById: (id) => {
    const { transactions } = get();
    return transactions.find(t => t.id === id);
  },
  
  getFilteredTransactions: () => {
    const { transactions, filters } = get();
    let filtered = [...transactions];
    
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.id.toLowerCase().includes(search) ||
        t.target.toLowerCase().includes(search) ||
        t.customerName.toLowerCase().includes(search) ||
        t.product.toLowerCase().includes(search)
      );
    }
    
    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(t => {
        const transDate = new Date(t.timestamp);
        if (filters.dateRange === 'today') return transDate >= today;
        if (filters.dateRange === 'week') return transDate >= weekAgo;
        if (filters.dateRange === 'month') return transDate >= monthAgo;
        return true;
      });
    }
    
    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    
    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    
    return filtered;
  },
  
  setFilter: (key, value) => set((state) => ({
    filters: {
      ...state.filters,
      [key]: value,
    },
  })),
  
  resetFilters: () => set({
    filters: {
      search: '',
      dateRange: 'all',
      status: 'all',
      type: 'all',
    },
  }),
  
  // Generate random reference number
  generateRefNumber: (prefix) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ref = '';
    for (let i = 0; i < 9; i++) {
      ref += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}-${ref}`;
  },
  
  // Generate random token for PLN
  generateToken: () => {
    const segments = [];
    for (let i = 0; i < 5; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += Math.floor(Math.random() * 10);
      }
      segments.push(segment);
    }
    return segments.join('-');
  },
}));

export { usePPOBTransactionStore };
