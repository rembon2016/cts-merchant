import VariantModal from "./VariantModal";
import SearchInput from "./SearchInput";
import { formatCurrency } from "../helper/currency";
import { useTransactionStore } from "../store/transactionStore";
import { useEffect, useMemo } from "react";
import CustomLoading from "./CustomLoading";

export default function POSTransaction() {
  const { transactions, isLoading, getListTransactions } =
    useTransactionStore();

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

    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-white min-h-[70vh]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: search / filters */}
          <aside className="md:col-span-1">
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
                  <span className="font-semibold">
                    {formatCurrency(totalToday)}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right: transactions list */}
          <main className="md:col-span-2">
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
                      <div
                        key={trx.id}
                        className="bg-white border border-gray-100 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-md flex items-center justify-center font-semibold flex-shrink-0">
                            {trx.transaction_type === "sale" ? "S" : "T"}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-gray-800 truncate">
                                {trx.code}
                              </div>
                              <div className="text-xs text-gray-400">
                                • {trx.time}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 truncate">
                              {trx.branch?.name} • {trx.item_count} item
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                              oleh {trx.created_by}
                            </div>
                          </div>
                        </div>

                        <div className="ml-auto flex items-center gap-4 mt-2  w-full ">
                          <div className="ml-auto flex flex-row-reverse items-center gap-2">
                            <div className="text-sm font-semibold text-gray-800">
                              {formatCurrency(trx.total)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {trx.payment_method?.name}
                            </div>
                          </div>

                          {/* <div>
                          <StatusBadge status={trx.status} />
                        </div> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </main>
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
