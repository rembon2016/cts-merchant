import React from 'react'

const About = () => {
  const transactions = [
    {
      id: 1,
      type: 'income',
      amount: 25000,
      description: 'Penjualan Produk A',
      date: '2024-01-15',
      time: '14:30'
    },
    {
      id: 2,
      type: 'income',
      amount: 15000,
      description: 'Penjualan Produk B',
      date: '2024-01-15',
      time: '12:15'
    },
    {
      id: 3,
      type: 'expense',
      amount: 5000,
      description: 'Biaya Admin',
      date: '2024-01-14',
      time: '09:00'
    }
  ]

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary dark:text-slate-200 mb-2">
          Riwayat Transaksi
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Lihat semua transaksi terbaru Anda
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <button className="px-4 py-2 rounded-full bg-[var(--c-primary)] text-white text-sm font-medium">
          Semua
        </button>
        <button className="px-4 py-2 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-600">
          Pemasukan
        </button>
        <button className="px-4 py-2 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-600">
          Pengeluaran
        </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-soft border border-slate-100 dark:border-slate-600"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-xl grid place-items-center ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 dark:bg-green-900/30' 
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {transaction.type === 'income' ? (
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {transaction.date} • {transaction.time}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}Rp {transaction.amount.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-6 text-center">
        <button className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
          Muat Lebih Banyak
        </button>
      </div>
    </div>
  )
}

export default About