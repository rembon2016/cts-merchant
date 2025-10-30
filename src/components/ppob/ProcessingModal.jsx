import React from 'react';
import { formatCurrency } from '../../helper/currency';

const ProcessingModal = ({ isOpen, status, data, onClose }) => {
  if (!isOpen) return null;
  
  const statusConfig = {
    processing: {
      icon: (
        <div className="relative">
          <svg className="animate-spin h-20 w-20 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ),
      title: 'Memproses Pembayaran',
      description: 'Mohon tunggu, transaksi sedang diproses...',
      color: 'blue',
    },
    success: {
      icon: (
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      ),
      title: 'Pembayaran Berhasil',
      description: 'Transaksi Anda telah berhasil diproses',
      color: 'green',
    },
    failed: {
      icon: (
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
      ),
      title: 'Pembayaran Gagal',
      description: data?.failReason || 'Terjadi kesalahan saat memproses transaksi',
      color: 'red',
    },
  };
  
  const config = statusConfig[status] || statusConfig.processing;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden animate-scaleIn">
        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            {config.icon}
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-2">
              {config.title}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {config.description}
            </p>
            
            {status !== 'processing' && data && (
              <div className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                <div className="space-y-3 text-sm">
                  {data.refNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">No. Referensi</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {data.refNumber}
                      </span>
                    </div>
                  )}
                  
                  {data.productName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Produk</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {data.productName}
                      </span>
                    </div>
                  )}
                  
                  {data.target && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tujuan</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {data.target}
                      </span>
                    </div>
                  )}
                  
                  {data.token && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mt-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Token PLN</p>
                      <p className="font-mono font-bold text-blue-600 dark:text-blue-400 text-lg tracking-wide">
                        {data.token}
                      </p>
                    </div>
                  )}
                  
                  {status === 'success' && data.total && (
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                      <div className="flex justify-between text-base font-bold">
                        <span className="text-gray-900 dark:text-white">Total Bayar</span>
                        <span className="text-blue-600 dark:text-blue-400">
                          {formatCurrency(data.total)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {status === 'success' && data.commission && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                      <div className="flex justify-between">
                        <span className="text-green-700 dark:text-green-400 text-sm">
                          Komisi Anda
                        </span>
                        <span className="text-green-700 dark:text-green-400 font-semibold">
                          {formatCurrency(data.commission)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {status !== 'processing' && (
            <div className="flex gap-3">
              {status === 'success' && (
                <>
                  <button
                    onClick={() => {
                      // TODO: Implement share functionality
                      console.log('Share receipt');
                    }}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl py-3 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Bagikan
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement print functionality
                      console.log('Print receipt');
                    }}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl py-3 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Print
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className={`flex-1 ${status === 'success' ? 'bg-[var(--c-primary)]' : 'bg-gray-600'} text-white rounded-xl py-3 font-semibold hover:opacity-90 transition-opacity`}
              >
                {status === 'success' ? 'Selesai' : 'Tutup'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingModal;
