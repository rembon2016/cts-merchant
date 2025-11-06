import React from "react";
import { formatCurrency } from "../../helper/currency";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  data,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto animate-slideUp sm:animate-scaleIn">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Konfirmasi Pembayaran
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {data && (
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Detail Transaksi
                </h3>

                {data.productName && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Produk
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {data.productName}
                    </span>
                  </div>
                )}

                {data.target && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      {data.targetLabel || "Tujuan"}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {data.target}
                    </span>
                  </div>
                )}

                {data.customerName && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Nama
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {data.customerName}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-600 my-3"></div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Harga
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(data.amount || 0)}
                  </span>
                </div>

                {data.adminFee && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Biaya Admin
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(data.adminFee)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-2 text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">
                    Total Bayar
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {formatCurrency(data.total || 0)}
                  </span>
                </div>

                {data.commission && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 mt-3">
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

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl py-3 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-[var(--c-primary)] text-white rounded-xl py-3 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                "Bayar Sekarang"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
