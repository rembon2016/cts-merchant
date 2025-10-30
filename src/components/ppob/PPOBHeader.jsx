import React from 'react';
import { formatCurrency } from '../../helper/currency';

const PPOBHeader = ({ title, balance, showBalance = false }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        {showBalance && balance !== undefined && (
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Saldo PPOB</p>
            <p className="font-semibold text-blue-600 dark:text-blue-400">
              {formatCurrency(balance)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PPOBHeader;
