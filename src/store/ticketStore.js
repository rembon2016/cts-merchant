import { create } from 'zustand';

// Mock data for development
const mockTickets = [
  {
    id: 'TKT-2025-001',
    userId: 'user123',
    category: 'transaction',
    priority: 'high',
    status: 'in-progress',
    title: 'Pembayaran sudah dilakukan tapi belum masuk',
    description: 'Halo, saya sudah melakukan pembayaran melalui QRIS kemarin pukul 15:30 WIB untuk Order #ORD-20251026-789 sejumlah Rp 250.000 tapi sampai hari ini belum masuk ke saldo merchant saya. Mohon bantuannya untuk dicek. Terima kasih.',
    attachments: ['bukti-transfer.jpg', 'screenshot-qris.png'],
    orderId: 'ORD-20251026-789',
    createdAt: '2025-10-26T08:30:00Z',
    updatedAt: '2025-10-27T09:15:00Z',
    replies: [
      {
        id: 'reply1',
        sender: 'agent',
        senderName: 'CS Agent - Budi',
        message: 'Selamat pagi, terima kasih sudah menghubungi Customer Support CTS Merchant. Saya Budi akan membantu menyelesaikan masalah Anda.',
        attachments: [],
        createdAt: '2025-10-26T09:00:00Z'
      },
      {
        id: 'reply2',
        sender: 'agent',
        senderName: 'CS Agent - Budi',
        message: 'Saya sudah mengecek sistem kami dan menemukan bahwa pembayaran Anda tertunda di sistem payment gateway. Tim teknis sedang melakukan proses verifikasi manual. Estimasi 1-2 jam lagi dana akan masuk ke saldo Anda.',
        attachments: [],
        createdAt: '2025-10-26T09:10:00Z'
      },
      {
        id: 'reply3',
        sender: 'user',
        senderName: 'John Doe',
        message: 'Baik, terima kasih infonya. Saya tunggu ya.',
        attachments: [],
        createdAt: '2025-10-26T09:15:00Z'
      },
      {
        id: 'reply4',
        sender: 'agent',
        senderName: 'CS Agent - Budi',
        message: 'Update: Dana sudah masuk ke saldo Anda. Silakan cek di halaman Transaksi. Mohon maaf atas ketidaknyamanannya.',
        attachments: [],
        createdAt: '2025-10-26T11:00:00Z'
      },
      {
        id: 'reply5',
        sender: 'user',
        senderName: 'John Doe',
        message: 'Sudah masuk! Terima kasih banyak atas bantuannya 🙏',
        attachments: [],
        createdAt: '2025-10-26T11:05:00Z'
      }
    ]
  },
  {
    id: 'TKT-2025-002',
    userId: 'user123',
    category: 'pos',
    priority: 'medium',
    status: 'open',
    title: 'Produk tidak muncul di halaman POS',
    description: 'Saya baru saja menambahkan 5 produk baru melalui dashboard merchant, tapi produk-produk tersebut tidak muncul di halaman POS. Saya sudah coba refresh dan logout-login tapi tetap tidak muncul.\n\nProduk yang tidak muncul:\n- Kopi Latte\n- Cappuccino\n- Matcha Latte\n- Green Tea\n- Thai Tea\n\nMohon bantuannya untuk dicek. Terima kasih.',
    attachments: [],
    orderId: null,
    createdAt: '2025-10-27T07:20:00Z',
    updatedAt: '2025-10-27T07:20:00Z',
    replies: []
  }
];

export const useTicketStore = create((set, get) => ({
  // State
  tickets: mockTickets, // Initialize with mock data
  selectedTicket: null,
  loading: false,
  filter: 'all',
  
  // Actions
  fetchTickets: async (userId) => {
    set({ loading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // For development, show all mock tickets regardless of userId
      // In production, this should filter by userId: const userTickets = mockTickets.filter(t => t.userId === userId);
      const userTickets = mockTickets;
      set({ tickets: userTickets, loading: false });
      return userTickets;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      set({ loading: false });
      return [];
    }
  },
  
  fetchTicketById: async (id) => {
    set({ loading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      const ticket = mockTickets.find(t => t.id === id);
      set({ selectedTicket: ticket, loading: false });
      return ticket;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      set({ loading: false });
      return null;
    }
  },
  
  createTicket: async (data) => {
    set({ loading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const newTicket = {
        id: `TKT-2025-${String(mockTickets.length + 1).padStart(3, '0')}`,
        userId: data.userId,
        category: data.category,
        priority: data.priority,
        status: 'open',
        title: data.title,
        description: data.description,
        attachments: data.attachments || [],
        orderId: data.orderId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        replies: []
      };
      
      mockTickets.unshift(newTicket);
      const tickets = get().tickets;
      set({ tickets: [newTicket, ...tickets], loading: false });
      return newTicket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      set({ loading: false });
      throw error;
    }
  },
  
  updateTicket: async (id, data) => {
    set({ loading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const ticketIndex = mockTickets.findIndex(t => t.id === id);
      if (ticketIndex !== -1) {
        mockTickets[ticketIndex] = {
          ...mockTickets[ticketIndex],
          ...data,
          updatedAt: new Date().toISOString()
        };
        
        const tickets = get().tickets.map(t => 
          t.id === id ? mockTickets[ticketIndex] : t
        );
        set({ tickets, loading: false });
        return mockTickets[ticketIndex];
      }
      set({ loading: false });
      return null;
    } catch (error) {
      console.error('Error updating ticket:', error);
      set({ loading: false });
      throw error;
    }
  },
  
  closeTicket: async (id) => {
    return get().updateTicket(id, { status: 'closed' });
  },
  
  addReply: async (ticketId, message, sender = 'user', senderName = 'User') => {
    set({ loading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const ticketIndex = mockTickets.findIndex(t => t.id === ticketId);
      if (ticketIndex !== -1) {
        const newReply = {
          id: `reply${Date.now()}`,
          sender,
          senderName,
          message,
          attachments: [],
          createdAt: new Date().toISOString()
        };
        
        mockTickets[ticketIndex].replies.push(newReply);
        mockTickets[ticketIndex].updatedAt = new Date().toISOString();
        
        if (get().selectedTicket?.id === ticketId) {
          set({ selectedTicket: mockTickets[ticketIndex] });
        }
        
        const tickets = get().tickets.map(t => 
          t.id === ticketId ? mockTickets[ticketIndex] : t
        );
        set({ tickets, loading: false });
        return newReply;
      }
      set({ loading: false });
      return null;
    } catch (error) {
      console.error('Error adding reply:', error);
      set({ loading: false });
      throw error;
    }
  },
  
  setFilter: (filter) => {
    set({ filter });
  },
  
  getFilteredTickets: () => {
    const { tickets, filter } = get();
    if (filter === 'all') return tickets;
    return tickets.filter(t => t.status === filter);
  }
}));
