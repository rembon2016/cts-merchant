import React from 'react';
import PPOBIcon from './PPOBIcon';

const PPOBCard = ({ icon, type, title, description, popular, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200 text-center w-full card-hover border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
    >
      {popular && (
        <div className="absolute -top-1 -right-1 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 dark:from-orange-300 dark:via-orange-400 dark:to-red-400 p-2 rounded-full shadow-lg" style={{ boxShadow: '0 4px 12px rgba(251, 146, 60, 0.4), 0 0 8px rgba(251, 146, 60, 0.3)' }}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            className="w-3.5 h-3.5 text-white"
          >
            <path fillRule="evenodd" d="M13.5 4.938a7 7 0 11-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 01.572-2.759 6.026 6.026 0 012.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0013.5 4.938zM14 12a4 4 0 01-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 001.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 011.315-4.192.447.447 0 01.431-.16A4.001 4.001 0 0114 12z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <div className="mb-2 flex justify-center pt-2">
        {type ? (
          <PPOBIcon type={type} size="xl" />
        ) : (
          <i className={icon}></i>
        )}
      </div>
      <h3 className="text-sm font-medium text-primary dark:text-white mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </button>
  );
};

export default PPOBCard;
