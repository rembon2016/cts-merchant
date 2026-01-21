import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { formatCurrency } from "../../helper/currency";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../../helper/format-date";
import { useInvoiceStore } from "../../store/invoiceStore";
import FloatingButton from "../customs/button/FloatingButton";
import NoData from "../customs/element/NoData";
import BottomSheet from "../customs/menu/BottomSheet";
import SearchInput from "../customs/form/SearchInput";
import SimpleInput from "../customs/form/SimpleInput";
import { useDebounce } from "../../hooks/useDebounce";
import ButtonFilter from "../customs/button/ButtonFilter";
import LoadingSkeletonCard from "../customs/loading/LoadingSkeletonCard";
import LoadingSkeletonList from "../customs/loading/LoadingSkeletonList";

const Invoice = () => {
  const navigate = useNavigate();
  const { invoices, getInvoices, isLoading } = useInvoiceStore();

  // Pagination & optimization
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Show 10 items per page
  const initialLoadDone = useRef(false);

  // Filter states
  const [formData, setFormData] = useState({
    status: "",
    end_date: "",
    reset: false,
  });
  const [search, setSearch] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const debouncedSearch = useDebounce(search || "", 1000);

  const location = useLocation();
  const invoicePath = location.pathname.includes("/invoice");

  // Optimize: Only fetch on mount and when search/filter changes
  useEffect(() => {
    if (!invoicePath || initialLoadDone.current === true) return;

    // Initial load only
    initialLoadDone.current = true;
    getInvoices({ search: "", page: 1, limit });
  }, [invoicePath, getInvoices, limit]);

  // Fetch when search changes
  useEffect(() => {
    if (!invoicePath) return;
    setPage(1); // Reset to first page on search
    getInvoices({ search: debouncedSearch, page: 1, limit });
  }, [debouncedSearch, invoicePath, getInvoices, limit]);

  const dataStatus = [
    { id: "paid", name: "Dibayar", color: "bg-green-300 text-green-800" },
    {
      id: "pending",
      name: "Belum Bayar",
      color: "bg-yellow-300 text-yellow-800",
    },
    { id: "canceled", name: "Dibatalkan", color: "bg-red-300 text-red-800" },
    {
      id: "expired",
      name: "Kadaluarsa",
      color: "bg-orange-300 text-orange-800",
    },
  ];

  const summary = useMemo(() => {
    const total = invoices?.length;
    const [paid, unpaid, canceled, expired] = dataStatus.map(
      (s) =>
        Array.isArray(invoices) &&
        invoices?.filter((inv) => inv.status === s.id).length,
    );

    return { total, paid, unpaid, canceled, expired };
  }, [invoices]);

  // Build unique due date options from API data
  const dueDateOptions = useMemo(() => {
    if (!Array.isArray(invoices)) return [];
    const unique = Array.from(
      new Set(invoices.map((inv) => inv?.invoice_due_date).filter(Boolean)),
    );
    return unique.map((d) => ({ id: d, name: formatDate(d) }));
  }, [invoices]);

  const statusOptions = useMemo(() => {
    return [
      { id: "pending", name: "Belum Bayar" },
      { id: "paid", name: "Dibayar" },
      { id: "canceled", name: "Dibatalkan" },
      { id: "expired", name: "Kadaluarsa" },
    ];
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const applyFilter = useCallback(() => {
    getInvoices({ status: formData.status, end_date: formData.end_date });
    resetFilter();
  }, [formData, getInvoices]);

  const resetFilter = useCallback(() => {
    setFormData({
      status: "",
      end_date: "",
      reset: true,
    });
    setIsSheetOpen(false);
  }, []);

  const renderElementsFilter = useMemo(() => {
    const conditionDisable =
      formData?.status === "" && formData?.end_date === "";

    return (
      <>
        <div className="mb-4 flex gap-2">
          <SimpleInput
            label="Status"
            name="status"
            type="text"
            value={formData?.status}
            isSelectBox={true}
            selectBoxData={statusOptions}
            handleChange={handleChange}
          />
          <SimpleInput
            label="Jatuh Tempo"
            name="end_date"
            type="text"
            value={formData?.end_date}
            isSelectBox={true}
            selectBoxData={dueDateOptions}
            handleChange={handleChange}
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            className="w-full py-4 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-md font-semibold hover:bg-gray-300 dark:hover:bg-slate-500 active:bg-gray-400 dark:active:bg-slate-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={resetFilter}
            disabled={conditionDisable}
          >
            Reset
          </button>
          <button
            className="w-full py-4 bg-[var(--c-primary)] text-white rounded-md font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={applyFilter}
            disabled={conditionDisable}
          >
            Terapkan Filter
          </button>
        </div>
      </>
    );
  }, [
    formData,
    statusOptions,
    dueDateOptions,
    handleChange,
    applyFilter,
    resetFilter,
  ]);

  const renderCatalogInvoice = useMemo(() => {
    return (
      <div className="grid grid-cols-2 gap-1 mt-2">
        {/* Paid */}
        <div className="w-full h-[92px] p-4 bg-white dark:bg-slate-700 border border-gray-50 dark:border-slate-600 rounded-lg shadow-sm flex flex-col justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Sudah Lunas
          </div>
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-200">
            {summary.paid ?? 0}
          </div>
        </div>

        {/* Unpaid */}
        <div className="w-full h-[92px] p-4 bg-white dark:bg-slate-700 border border-gray-50 dark:border-slate-600 rounded-lg shadow-sm flex flex-col justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Belum Bayar
          </div>
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-200">
            {summary.unpaid ?? 0}
          </div>
        </div>

        {/* Canceled */}
        <div className="w-full h-[92px] p-4 bg-white dark:bg-slate-700 border border-gray-50 dark:border-slate-600 rounded-lg shadow-sm flex flex-col justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Dibatalkan
          </div>
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-200">
            {summary.canceled ?? 0}
          </div>
        </div>

        {/* Expired */}
        <div className="w-full h-[92px] p-4 bg-white dark:bg-slate-700 border border-gray-50 dark:border-slate-600 rounded-lg shadow-sm flex flex-col justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Kadaluarsa
          </div>
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-200">
            {summary.expired ?? 0}
          </div>
        </div>
      </div>
    );
  }, [summary]);

  // Pre-calculate paginated data to avoid re-renders
  const totalPages = useMemo(() => {
    return Math.ceil((invoices?.length || 0) / limit);
  }, [invoices?.length, limit]);

  const paginatedInvoices = useMemo(() => {
    if (!Array.isArray(invoices)) return [];
    const start = (page - 1) * limit;
    return invoices.slice(start, start + limit);
  }, [invoices, page, limit]);

  // Pre-format dates to avoid expensive operations in render
  const formattedInvoices = useMemo(() => {
    return paginatedInvoices.map((inv) => ({
      ...inv,
      invoice_date_formatted: formatDate(inv.invoice_date),
      invoice_due_date_formatted: formatDate(inv.invoice_due_date),
    }));
  }, [paginatedInvoices]);

  const renderInvoiceList = useMemo(() => {
    return (
      <div className="divide-y flex flex-col gap-3">
        {Array.isArray(formattedInvoices) &&
          formattedInvoices?.map((inv) => (
            <button
              key={inv.id}
              onClick={() =>
                navigate(`/invoice/detail/${inv.id}`, {
                  replace: true,
                })
              }
              className="h-[110px] bg-white dark:bg-slate-700 rounded-lg p-4 shadow-soft border border-slate-100 dark:border-slate-600 flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col gap-1 items-start">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-200 truncate">
                  {inv.code}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                  Mulai: {inv.invoice_date_formatted} • Jatuh tempo:{" "}
                  {inv.invoice_due_date_formatted}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span
                  className={
                    dataStatus.find((item) => item.id === inv.status)?.color +
                    " inline-block px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"
                  }
                >
                  {dataStatus.find((item) => item.id === inv.status)?.name}
                </span>
                <span className="font-semibold text-lg text-[var(--c-primary)] dark:text-blue-300 flex-shrink-0">
                  {formatCurrency(inv.invoice_amount)}
                </span>
              </div>
            </button>
          ))}
      </div>
    );
  }, [formattedInvoices, dataStatus, navigate]);

  const renderFilter = useMemo(() => {
    return (
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex gap-2 h-[42px]">
          <SearchInput
            value={search || ""}
            onChange={(value) => setSearch(value)}
            placeholder="Cari invoice..."
          />
          <ButtonFilter setIsSheetOpen={setIsSheetOpen} />
        </div>
      </div>
    );
  }, [search, setSearch, setIsSheetOpen]);

  // Pagination controls
  const renderPaginationControls = useMemo(() => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-2 mt-6 h-[42px]">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
        >
          Sebelumnya
        </button>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Halaman {page} dari {totalPages}
        </div>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-[var(--c-primary)] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Berikutnya
        </button>
      </div>
    );
  }, [page, totalPages]);

  const renderElements = useMemo(() => {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-200">
              Invoice
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Daftar invoice dan detail transaksi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary + list */}
          <div className="lg:col-span-3 space-y-4 pb-20">
            {renderCatalogInvoice}
            {renderFilter}
            {isLoading && <LoadingSkeletonList items={10} />}
            {!isLoading && invoices?.length === 0 && (
              <NoData text="Tidak ada invoice" />
            )}
            {renderInvoiceList}
            {renderPaginationControls}
          </div>
        </div>
      </div>
    );
  }, [
    isLoading,
    invoices,
    summary,
    navigate,
    search,
    renderCatalogInvoice,
    renderInvoiceList,
    renderPaginationControls,
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {renderElements}
      {!isSheetOpen && (
        <FloatingButton
          handleOnClick={() => navigate("/invoice/add", { replace: true })}
        />
      )}
      <BottomSheet
        title="Filter Invoice"
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onItemClick={() => setIsSheetOpen(false)}
        renderContent={renderElementsFilter}
      />
    </div>
  );
};

export default memo(Invoice);
