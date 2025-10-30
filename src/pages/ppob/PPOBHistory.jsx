import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { usePPOBTransactionStore } from '../../store/ppobTransactionStore';
import { usePPOBProductStore } from '../../store/ppobProductStore';
import TransactionCard from '../../components/ppob/TransactionCard';
import { formatCurrency } from '../../helper/currency';

const PPOBHistory = () => {
  const navigate = useNavigate();
  const { transactions } = usePPOBTransactionStore();
  const { categories } = usePPOBProductStore();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  // Period filter options
  const periodFilters = [
    { id: 'all', label: 'Semua' },
    { id: 'today', label: 'Hari Ini' },
    { id: 'week', label: 'Minggu Ini' },
    { id: 'month', label: 'Bulan Ini' }
  ];
  
  // Status filter options
  const statusFilters = [
    { id: 'all', label: 'Semua Status' },
    { id: 'success', label: 'Berhasil' },
    { id: 'failed', label: 'Gagal' },
    { id: 'pending', label: 'Pending' }
  ];
  
  // Product type filter options
  const productFilters = [
    { id: 'all', label: 'Semua Produk' },
    ...categories.map(cat => ({ id: cat.id, label: cat.name }))
  ];
  
  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(trx => 
        trx.id.toLowerCase().includes(query) ||
        trx.target.toLowerCase().includes(query) ||
        trx.product.toLowerCase().includes(query) ||
        (trx.customerName && trx.customerName.toLowerCase().includes(query))
      );
    }
    
    // Filter by period
    if (selectedPeriod !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      result = result.filter(trx => {
        const trxDate = new Date(trx.timestamp);
        
        switch (selectedPeriod) {
          case 'today':
            return trxDate >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return trxDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return trxDate >= monthAgo;
          default:
            return true;
        }
      });
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      result = result.filter(trx => trx.status === selectedStatus);
    }
    
    // Filter by product type
    if (selectedProduct !== 'all') {
      result = result.filter(trx => trx.type === selectedProduct);
    }
    
    return result;
  }, [transactions, searchQuery, selectedPeriod, selectedStatus, selectedProduct]);
  
  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalTrx = filteredTransactions.length;
    const totalAmount = filteredTransactions.reduce((sum, trx) => sum + trx.price, 0);
    const totalCommission = filteredTransactions.reduce((sum, trx) => sum + trx.commission, 0);
    
    return { totalTrx, totalAmount, totalCommission };
  }, [filteredTransactions]);
  
  // Handle transaction click
  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Riwayat Transaksi PPOB
          </h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor, ID, nama..."
            className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 border-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-500 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Period Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {periodFilters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedPeriod(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedPeriod === filter.id
                  ? 'bg-[var(--c-primary)] text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        {/* Status & Product Filters */}
        <div className="grid grid-cols-2 gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            {statusFilters.map(filter => (
              <option key={filter.id} value={filter.id}>
                {filter.label}
              </option>
            ))}
          </select>
          
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            {productFilters.map(filter => (
              <option key={filter.id} value={filter.id}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Summary Card */}
        <div className="bg-[var(--c-primary)] rounded-xl p-5 text-white shadow-lg">
          <h3 className="text-xs opacity-75 mb-3">Ringkasan</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-2xl font-bold">{summary.totalTrx}</p>
              <p className="text-xs opacity-75 mt-1">Transaksi</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-lg font-bold">{formatCurrency(summary.totalAmount)}</p>
              <p className="text-xs opacity-75 mt-1">Total Nilai</p>
            </div>
          </div>
        </div>
        
        {/* Transaction List */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Menampilkan {filteredTransactions.length} transaksi
            </p>
            {filteredTransactions.map(transaction => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onClick={() => handleTransactionClick(transaction)}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tidak Ada Transaksi
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {searchQuery 
                ? 'Tidak ditemukan transaksi yang cocok dengan pencarian Anda'
                : 'Belum ada transaksi untuk filter yang dipilih'}
            </p>
          </div>
        )}
      </div>
      
      {/* Transaction Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-800 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Detail Transaksi
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Status Badge */}
              <div className="text-center py-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                  selectedTransaction.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                  selectedTransaction.status === 'failed' ? 'bg-red-100 dark:bg-red-900/30' :
                  'bg-yellow-100 dark:bg-yellow-900/30'
                }`}>
                  <span className="text-3xl">
                    {selectedTransaction.status === 'success' ? '✓' :
                     selectedTransaction.status === 'failed' ? '✗' : '⏱'}
                  </span>
                </div>
                <h4 className={`text-xl font-bold ${
                  selectedTransaction.status === 'success' ? 'text-green-600 dark:text-green-400' :
                  selectedTransaction.status === 'failed' ? 'text-red-600 dark:text-red-400' :
                  'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {selectedTransaction.status === 'success' ? 'Transaksi Berhasil' :
                   selectedTransaction.status === 'failed' ? 'Transaksi Gagal' : 'Menunggu'}
                </h4>
              </div>
              
              {/* Transaction Details */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">ID Transaksi</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Produk</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedTransaction.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nomor Tujuan</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedTransaction.target}</span>
                </div>
                {selectedTransaction.customerName && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Nama Pelanggan</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedTransaction.customerName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Waktu</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(selectedTransaction.timestamp).toLocaleString('id-ID')}
                  </span>
                </div>
                {selectedTransaction.refNumber && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">No. Referensi</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedTransaction.refNumber}</span>
                  </div>
                )}
              </div>
              
              {/* Price Details */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nominal</span>
                  <span className="text-sm text-gray-900 dark:text-white">{formatCurrency(selectedTransaction.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Biaya Admin</span>
                  <span className="text-sm text-gray-900 dark:text-white">{formatCurrency(selectedTransaction.adminFee)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Total Bayar</span>
                  <span className="text-sm font-bold text-[var(--c-primary)] dark:text-blue-400">{formatCurrency(selectedTransaction.price)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">Komisi</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">{formatCurrency(selectedTransaction.commission)}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => toast.info('Fitur Bagikan akan segera hadir!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                  })}
                  className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Bagikan
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-3 bg-[var(--c-primary)] text-white rounded-xl font-medium hover:opacity-90 transition-colors"
                >
                  Print Struk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
};

export default PPOBHistory;
