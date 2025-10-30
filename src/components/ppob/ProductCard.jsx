import React from 'react';
import { formatCurrency } from '../../helper/currency';

const ProductCard = ({ product, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative bg-white dark:bg-gray-800 rounded-xl p-4 border-2 transition-all duration-200 text-left w-full card-hover ${
        selected
          ? 'border-[var(--c-primary)] bg-blue-50 dark:bg-blue-900/20 shadow-md'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:shadow-lg'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {product.name}
        </h3>
        {selected && (
          <div className="w-5 h-5 bg-[var(--c-primary)] rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-small font-bold text-gray-900 dark:text-white">
          {formatCurrency(product.price)}
        </p>
       
        {product.estimatedKwh && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ~{product.estimatedKwh}
          </p>
        )}
      </div>
    </button>
  );
};

export default ProductCard;
