// Mock API service untuk user data
const API_BASE_URL = 'https://api.example.com'

// Simulasi delay untuk API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock user data
const mockUserData = {
  id: 1,
  name: 'John Doe',
  avatar: 'JD',
  email: 'john.doe@example.com',
  phone: '+62 812 3456 7890',
  merchantType: 'Premium',
  status: 'active',
  totalTransactions: 156,
  rating: 4.8,
  joinDate: '2023-01-15'
}

// Mock income data
const mockIncomeData = {
  today: 45000,
  thisWeek: 320000,
  thisMonth: 1250000,
  lastUpdated: new Date().toISOString()
}

// Mock transactions data
const mockTransactions = [
  {
    id: 1,
    type: 'income',
    amount: 25000,
    description: 'Penjualan Produk A',
    date: '2024-01-15',
    time: '14:30',
    category: 'sales'
  },
  {
    id: 2,
    type: 'income',
    amount: 15000,
    description: 'Penjualan Produk B',
    date: '2024-01-15',
    time: '12:15',
    category: 'sales'
  },
  {
    id: 3,
    type: 'expense',
    amount: 5000,
    description: 'Biaya Admin',
    date: '2024-01-14',
    time: '09:00',
    category: 'admin'
  },
  {
    id: 4,
    type: 'income',
    amount: 35000,
    description: 'Penjualan Produk C',
    date: '2024-01-14',
    time: '16:45',
    category: 'sales'
  },
  {
    id: 5,
    type: 'expense',
    amount: 12000,
    description: 'Pembelian Stok',
    date: '2024-01-13',
    time: '10:30',
    category: 'inventory'
  }
]

export const userService = {
  // Get user profile
  async getUserProfile() {
    try {
      await delay(800) // Simulate API delay
      return {
        success: true,
        data: mockUserData
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch user profile'
      }
    }
  },

  // Update user profile
  async updateUserProfile(userData) {
    try {
      await delay(1000)
      return {
        success: true,
        data: { ...mockUserData, ...userData }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update user profile'
      }
    }
  },

  // Get income data
  async getIncomeData(period = 'today') {
    try {
      await delay(600)
      return {
        success: true,
        data: mockIncomeData
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch income data'
      }
    }
  },

  // Update income
  async updateIncome(amount, type = 'income') {
    try {
      await delay(500)
      const newAmount = type === 'income' 
        ? mockIncomeData.today + amount 
        : mockIncomeData.today - amount
      
      mockIncomeData.today = Math.max(0, newAmount)
      mockIncomeData.lastUpdated = new Date().toISOString()
      
      return {
        success: true,
        data: mockIncomeData
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update income'
      }
    }
  },

  // Get transactions
  async getTransactions(page = 1, limit = 10, filter = 'all') {
    try {
      await delay(700)
      
      let filteredTransactions = mockTransactions
      if (filter !== 'all') {
        filteredTransactions = mockTransactions.filter(t => t.type === filter)
      }
      
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)
      
      return {
        success: true,
        data: {
          transactions: paginatedTransactions,
          total: filteredTransactions.length,
          page,
          limit,
          hasMore: endIndex < filteredTransactions.length
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch transactions'
      }
    }
  },

  // Add new transaction
  async addTransaction(transactionData) {
    try {
      await delay(800)
      
      const newTransaction = {
        id: mockTransactions.length + 1,
        ...transactionData,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
      
      mockTransactions.unshift(newTransaction)
      
      // Update income if it's an income transaction
      if (transactionData.type === 'income') {
        mockIncomeData.today += transactionData.amount
      } else {
        mockIncomeData.today -= transactionData.amount
      }
      
      return {
        success: true,
        data: newTransaction
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to add transaction'
      }
    }
  },

  // Get dashboard stats
  async getDashboardStats() {
    try {
      await delay(900)
      
      const totalIncome = mockTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const totalExpense = mockTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      return {
        success: true,
        data: {
          totalIncome,
          totalExpense,
          netIncome: totalIncome - totalExpense,
          totalTransactions: mockTransactions.length,
          ...mockIncomeData
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch dashboard stats'
      }
    }
  }
}

export default userService