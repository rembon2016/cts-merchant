import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../helper/currency';

const BalanceCard = ({ balance, commission, stats }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-[var(--c-primary)] rounded-xl p-5 text-white shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm opacity-90 mb-1">Saldo PPOB</p>
          <h2 className="text-3xl font-bold">{formatCurrency(balance)}</h2>
        </div>
        {/* Hidden buttons - DO NOT DELETE */}
        <div className="hidden gap-2">
          <button 
            onClick={() => navigate('/ppob/withdraw')}
            className="bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Tarik Saldo
          </button>
          <button className="bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
            Isi Saldo
          </button>
        </div>
      </div>

      {/* Transaction Statistics */}
      {stats && (
        <div className="border-t border-white/20 pt-4 mt-2">
          <p className="text-xs opacity-75 mb-3">Statistik Transaksi PPOB</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-2xl font-bold">{stats.today}</p>
              <p className="text-xs opacity-75 mt-1">Hari Ini</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-2xl font-bold">{stats.thisWeek}</p>
              <p className="text-xs opacity-75 mt-1">Minggu Ini</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-2xl font-bold">{stats.thisMonth}</p>
              <p className="text-xs opacity-75 mt-1">Bulan Ini</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceCard;
