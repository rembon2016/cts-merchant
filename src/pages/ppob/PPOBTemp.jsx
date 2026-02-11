import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { usePPOBStore } from "../../store/ppobStore";
import { usePPOBProductStore } from "../../store/ppobProductStore";
import { usePPOBTransactionStore } from "../../store/ppobTransactionStore";
import BalanceCard from "../../components/ppob/BalanceCard";
import PPOBCard from "../../components/ppob/PPOBCard";
import TransactionCard from "../../components/ppob/TransactionCard";
import PPOBIcon from "../../components/ppob/PPOBIcon";
import { formatCurrency } from "../../helper/currency";

const PPOBTemp = () => {
  const navigate = useNavigate();
  const { categories } = usePPOBProductStore();
  const { transactions } = usePPOBTransactionStore();
  const { balance, commission, stats } = usePPOBStore();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Get popular categories
  const popularCategories = categories.filter((cat) => cat.popular);

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  const handleCategoryClick = (categoryId) => navigate(`/ppob/${categoryId}`);

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const renderPopularProductsElements = useMemo(() => {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {popularCategories?.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 text-center flex flex-col items-center w-full"
          >
            <div className="mb-2 flex justify-center">
              <PPOBIcon type={category.id} size="xl" />
            </div>
            <p className="text-sm font-medium text-primary dark:text-white max-w-[50px] text-center">
              {category.name}
            </p>
          </button>
        ))}
      </div>
    );
  }, [popularCategories, handleCategoryClick]);

  const renderAllServicesElements = useMemo(() => {
    return (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Semua Layanan
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {categories?.map((category) => (
            <PPOBCard
              key={category.id}
              type={category.id}
              title={category.name}
              popular={category.popular}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
        </div>
      </div>
    );
  }, [categories, handleCategoryClick]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          PPOB
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Bayar Pulsa, Listrik, dan lainnya
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <BalanceCard balance={balance} commission={commission} stats={stats} />

        {/* Popular Products */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Produk Populer
          </h2>
          {renderPopularProductsElements}
        </div>

        {/* All Services */}
        {renderAllServicesElements}

        {/* Recent Transactions */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Transaksi Terakhir
            </h2>
            <button
              onClick={() => navigate("/ppob/history")}
              className="text-sm text-[var(--c-primary)] dark:text-blue-400 hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onClick={() => handleTransactionClick(transaction)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Belum ada transaksi
              </p>
            </div>
          )}
        </div>
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
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                    selectedTransaction.status === "success"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : selectedTransaction.status === "failed"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : "bg-yellow-100 dark:bg-yellow-900/30"
                  }`}
                >
                  <span className="text-3xl">
                    {selectedTransaction.status === "success"
                      ? "✓"
                      : selectedTransaction.status === "failed"
                        ? "✗"
                        : "⏱"}
                  </span>
                </div>
                <h4
                  className={`text-xl font-bold ${
                    selectedTransaction.status === "success"
                      ? "text-green-600 dark:text-green-400"
                      : selectedTransaction.status === "failed"
                        ? "text-red-600 dark:text-red-400"
                        : "text-yellow-600 dark:text-yellow-400"
                  }`}
                >
                  {selectedTransaction.status === "success"
                    ? "Transaksi Berhasil"
                    : selectedTransaction.status === "failed"
                      ? "Transaksi Gagal"
                      : "Menunggu"}
                </h4>
              </div>

              {/* Transaction Details */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ID Transaksi
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedTransaction.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Produk
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedTransaction.product}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Nomor Tujuan
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedTransaction.target}
                  </span>
                </div>
                {selectedTransaction.customerName && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Nama Pelanggan
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedTransaction.customerName}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Waktu
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(selectedTransaction.timestamp).toLocaleString(
                      "id-ID",
                    )}
                  </span>
                </div>
                {selectedTransaction.refNumber && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      No. Referensi
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedTransaction.refNumber}
                    </span>
                  </div>
                )}
              </div>

              {/* Price Details */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Nominal
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatCurrency(selectedTransaction.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Biaya Admin
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatCurrency(selectedTransaction.adminFee)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Total Bayar
                  </span>
                  <span className="text-sm font-bold text-[var(--c-primary)] dark:text-blue-400">
                    {formatCurrency(selectedTransaction.price)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() =>
                    toast.info("Fitur Bagikan akan segera hadir!", {
                      position: "top-center",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      theme: "light",
                    })
                  }
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
    </div>
  );
};

export default PPOBTemp;
