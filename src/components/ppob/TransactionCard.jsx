import React from 'react';
import { formatCurrency } from '../../helper/currency';
import PPOBIcon from './PPOBIcon';

const TransactionCard = ({ transaction, onClick }) => {
  const statusColors = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  };
  
  const statusText = {
    success: 'Berhasil',
    failed: 'Gagal',
    pending: 'Pending',
  };
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  };
  
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200 text-left w-full card-hover border border-transparent hover:border-blue-100 dark:hover:border-blue-900"
    >
      <div className="flex items-start gap-3">
        <div>
          <PPOBIcon type={transaction.type} size="lg" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {transaction.product}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[transaction.status]}`}>
              {statusText[transaction.status]}
            </span>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {transaction.target}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatDate(transaction.timestamp)}
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(transaction.price)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default TransactionCard;
