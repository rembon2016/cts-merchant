import VariantModal from "../customs/modal/VariantModal";
import SearchInput from "../customs/form/SearchInput";
import { formatCurrency } from "../../helper/currency";
import { useTransactionStore } from "../../store/transactionStore";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CustomLoading from "../customs/loading/CustomLoading";
import { XCircle } from "lucide-react";

export default function POSTransaction() {
  const { transactions, isLoading, getListTransactions } =
    useTransactionStore();

  const navigate = useNavigate();

  // compute total for "Today" group (summing trx.total values)
  const todayGroup = transactions.find((g) => g.date_group === "Today") || {
    transactions: [],
  };
  const totalToday = todayGroup.transactions.reduce(
    (sum, t) => sum + (Number(t.total) || 0),
    0
  );

  const renderElements = useMemo(() => {
    if (isLoading) {
      return <CustomLoading />;
    }

    if (!isLoading && transactions.length === 0) {
      return (
        <div className="col-span-2 flex flex-col items-center justify-center text-gray-500 p-4 bg-gray-100 rounded-lg h-[250px]">
          <XCircle className="w-16 h-16 mb-2 text-gray-400" />
          <span className="text-sm">Tidak ada Transaksi</span>
        </div>
      );
    }

    return (
      <div className="p-4 min-h-[70vh]">
        <div className="w-full space-y-4">
          {/* Header / Search / Filters */}
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              Transaksi POS
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Transaksi terbaru berdasarkan tanggal
            </p>

            <div className="mt-4">
              <div className="w-full">
                <SearchInput />
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <div className="flex items-center justify-between border-t pt-3">
                <span>Total hari ini</span>
                <span className="font-semibold text-lg text-[var(--c-primary)]">
                  {formatCurrency(totalToday)}
                </span>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-6">
            {transactions.map((group) => (
              <section key={group.date_group}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-medium text-gray-700">
                    {group.date_group}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {group.transactions.length} transaksi
                  </span>
                </div>

                <div className="space-y-3">
                  {group.transactions.map((trx) => (
                    <button
                      key={trx.id}
                      onClick={() => navigate(`/pos/transaction/${trx.id}`)}
                      className="w-full"
                    >
                      <div className="bg-white border border-gray-100 rounded-lg p-3 flex flex-col gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-md flex items-center justify-center font-semibold flex-shrink-0">
                            {trx.transaction_type === "sale" ? "S" : "T"}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-gray-800 truncate">
                                {trx.code}
                              </div>
                              <div className="text-xs text-[var(--c-primary)] font-semibold">
                                • {trx.time}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 text-start truncate">
                              oleh: {trx.created_by} • {trx.item_count} item
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-1 border-t pt-2">
                          <div className="text-xs text-gray-500">
                            {trx.payment_method?.name}
                          </div>
                          •
                          <div className="font-semibold text-lg text-[var(--c-primary)]">
                            {formatCurrency(trx.total)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* keep VariantModal import for potential interactions */}
        <VariantModal />
      </div>
    );
  }, [transactions, isLoading]);

  useEffect(() => {
    getListTransactions();
  }, []);

  return renderElements;
}
