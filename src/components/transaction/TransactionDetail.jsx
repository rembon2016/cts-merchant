import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { formatCurrency } from "../../helper/currency";
import { formatDate } from "../../helper/format-date";
import LoadingSkeletonList from "../customs/loading/LoadingSkeletonList";
import useFetchDataStore from "../../store/fetchDataStore";
import NotFound from "../../pages/NotFound";

const ROOT_API = import.meta.env.VITE_API_ROUTES;

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, fetchData } = useFetchDataStore();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const headersApi = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
  };

  // Fetch transaction list and find the matching one by ID
  useEffect(() => {
    if (id) {
      const searchParams = new URLSearchParams({
        page: "1",
        per_page: "100", // Fetch more records to ensure we find the transaction
      });

      fetchData(
        `${ROOT_API}/v1/merchant/transaction?${searchParams.toString()}`,
        {
          method: "GET",
          headers: headersApi,
        },
      );
    }
  }, [id]);

  // Find the transaction from the fetched list
  useEffect(() => {
    if (data?.transactions && id) {
      const transaction = data.transactions.find(
        (item) => item.id.toString() === id,
      );
      setSelectedTransaction(transaction || null);
    }
  }, [data, id]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/transaction");
  };

  if (loading) {
    return <LoadingSkeletonList items={5} />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  }

  if (!selectedTransaction) {
    return <NotFound />;
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return "bg-green-100 dark:bg-green-900/30";
      case "PENDING":
        return "bg-yellow-100 dark:bg-yellow-900/30";
      case "FAILED":
        return "bg-red-100 dark:bg-red-900/30";
      default:
        return "bg-slate-100 dark:bg-slate-900/30";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return "text-green-600 dark:text-green-400";
      case "PENDING":
        return "text-yellow-600 dark:text-yellow-400";
      case "FAILED":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-slate-600 dark:text-slate-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return "✓";
      case "PENDING":
        return "⏱";
      case "FAILED":
        return "✗";
      default:
        return "?";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-800 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Detail Transaksi
          </h3>
          <button
            onClick={handleModalClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-700 dark:text-slate-300" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 space-y-4">
          {/* Status Badge */}
          <div className="text-center py-6">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${getStatusColor(selectedTransaction?.status)}`}
            >
              <span className="text-3xl">
                {getStatusIcon(selectedTransaction?.status)}
              </span>
            </div>
            <h4
              className={`text-xl font-bold ${getStatusTextColor(selectedTransaction?.status)}`}
            >
              {selectedTransaction?.status === "SUCCESS"
                ? "Transaksi Berhasil"
                : selectedTransaction?.status === "PENDING"
                  ? "Menunggu"
                  : "Transaksi Gagal"}
            </h4>
          </div>

          {/* Transaction Details */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Kode Transaksi
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {selectedTransaction?.code}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Tipe Transaksi
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                {selectedTransaction?.type}
              </span>
            </div>
            {/* <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Metode Pembayaran
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {getPaymentTypeLabel(selectedTransaction?.payment_type)}
              </span>
            </div> */}
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                ID Merchant
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {selectedTransaction?.mid}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Tanggal Transaksi
              </span>
              <div className="text-right">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {formatDate(selectedTransaction?.transaction_at)}
                </span>
                <br />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(
                    selectedTransaction?.transaction_at,
                  ).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Tanggal Pembayaran
              </span>
              <div className="text-right">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {formatDate(selectedTransaction?.paid_at)}
                </span>
                <br />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(selectedTransaction?.paid_at).toLocaleTimeString(
                    "id-ID",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    },
                  )}
                </span>
              </div>
            </div>
            {selectedTransaction?.title && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Judul
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {selectedTransaction?.title}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                ID Transaksi
              </span>
              <span className="text-sm font-mono text-slate-900 dark:text-white">
                {selectedTransaction?.id}
              </span>
            </div>
          </div>

          {/* Amount Details */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Jumlah
              </span>
              <span className="text-sm text-slate-900 dark:text-white">
                {formatCurrency(selectedTransaction?.amount)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-600">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Total
              </span>
              <span className="text-sm font-bold text-[var(--c-primary)] dark:text-blue-400">
                {formatCurrency(selectedTransaction?.amount)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              onClick={handleModalClose}
              className="w-full px-4 py-3 bg-[var(--c-primary)] text-white rounded-xl font-medium hover:opacity-90 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
