import VariantModal from "../../customs/modal/VariantModal";
import SearchInput from "../../customs/form/SearchInput";
import LoadingSkeletonList from "../../customs/loading/LoadingSkeletonList";
import { formatCurrency } from "../../../helper/currency";
import { formatDate } from "../../../helper/format-date";
import { formatTime24 } from "../../../helper/format-time";
import { useTransactionStore } from "../../../store/transactionStore";
import { useEffect, useMemo, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import NoData from "../../customs/element/NoData";
import { useDebounce } from "../../../hooks/useDebounce";

function ListTransaction() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5; // Show 5 groups per page

  const { transactions, isLoading, getListTransactions } =
    useTransactionStore();

  // Debounce search input
  const debouncedSearch = useDebounce(search, 500);

  const navigate = useNavigate();

  // Pre-calculate totals to avoid expensive calculations
  const totalsData = useMemo(() => {
    const todayGroup = transactions.find((g) => g.date_group === "Today") || {
      transactions: [],
    };

    const totalToday = todayGroup.transactions.reduce(
      (sum, t) => sum + (Number(t.total) || 0),
      0,
    );

    const paginatedGroups = transactions.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE,
    );

    return {
      totalToday,
      paginatedGroups,
      totalPages: Math.ceil(transactions.length / ITEMS_PER_PAGE),
    };
  }, [transactions, page]);

  const handleNavigate = useCallback(
    (trxId) => {
      navigate(`/pos/transaction/${trxId}`);
    },
    [navigate],
  );

  // Memoized transaction item component - MUST be before renderElements
  const TransactionItem = memo(({ trx, onNavigate }) => (
    <button onClick={() => onNavigate(trx.id)} className="w-full">
      <div className="bg-white border border-gray-100 dark:border-none rounded-lg p-3 flex flex-col gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-500 text-indigo-600 dark:text-indigo-200 rounded-md flex items-center justify-center font-semibold flex-shrink-0">
            {trx.transaction_type === "sale" ? "S" : "T"}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-800 dark:text-gray-300 truncate">
                {trx.code}
              </div>
              <div className="text-xs text-[var(--c-primary)] dark:text-blue-300 font-semibold">
                • {formatTime24(trx.time)}
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-300 mt-1 text-start truncate">
              oleh: {trx.created_by} • {trx.item_count} item
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-1 border-t pt-2">
          <div className="text-xs text-gray-500 dark:text-gray-300">
            {trx.payment_method?.name}
          </div>
          •
          <div className="font-semibold text-lg text-[var(--c-primary)] dark:text-gray-200">
            {formatCurrency(trx.total)}
          </div>
        </div>
      </div>
    </button>
  ));
  TransactionItem.displayName = "TransactionItem";

  const renderElements = useMemo(() => {
    if (isLoading) {
      return <LoadingSkeletonList items={6} />;
    }

    if (!isLoading && transactions.length === 0) {
      return <NoData text="Tidak ada transaksi" />;
    }

    return (
      <div className="min-h-[70vh]">
        <div className="w-full">
          {/* Transactions List */}
          <div className="space-y-6">
            {totalsData.paginatedGroups.map((group) => (
              <section key={group.date_group}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-200">
                    {group?.date_group === "Today"
                      ? "Hari Ini"
                      : formatDate(group?.date_group)}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    {group?.transactions.length} transaksi
                  </span>
                </div>

                <div className="space-y-3">
                  {group.transactions.map((trx) => (
                    <TransactionItem
                      key={trx.id}
                      trx={trx}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Pagination controls */}
        {totalsData.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6 mb-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 bg-gray-200 dark:bg-slate-600 disabled:opacity-50 rounded hover:bg-gray-300"
            >
              Sebelumnya
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {page} / {totalsData.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(totalsData.totalPages, p + 1))
              }
              disabled={page === totalsData.totalPages}
              className="px-3 py-2 bg-[var(--c-primary)] text-white disabled:opacity-50 rounded hover:bg-blue-700"
            >
              Berikutnya
            </button>
          </div>
        )}

        {/* keep VariantModal import for potential interactions */}
        <VariantModal />
      </div>
    );
  }, [transactions, isLoading, totalsData, handleNavigate]);

  useEffect(() => {
    getListTransactions({
      search: debouncedSearch,
    });
    setPage(1); // Reset to page 1 on search
  }, [debouncedSearch, getListTransactions]);

  return (
    <div className="py-2">
      <div className="bg-white border border-gray-100 dark:border-none rounded-lg shadow-sm mb-4 p-4">
        <div className="p-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Transaksi POS
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
            Transaksi terbaru berdasarkan tanggal
          </p>
        </div>

        <div className="mt-4">
          <div className="w-full">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari transaksi..."
            />
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center justify-between border-t pt-3">
            <span className="dark:text-gray-300">Total hari ini</span>
            <span className="font-semibold text-lg text-[var(--c-primary)] dark:text-gray-200">
              {formatCurrency(totalsData.totalToday)}
            </span>
          </div>
        </div>
      </div>
      {renderElements}
    </div>
  );
}

export default memo(ListTransaction);
