import { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "../../helper/currency";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../../helper/format-date";
import { useInvoiceStore } from "../../store/invoiceStore";
import { ElementsNoData } from "../customs/element/NoData";
import FloatingButton from "../customs/button/FloatingButton";
import BottomSheet from "../customs/menu/BottomSheet";
import SearchInput from "../customs/form/SearchInput";
import SimpleInput from "../customs/form/SimpleInput";

const Invoice = () => {
  const navigate = useNavigate();

  const { invoices, getInvoices, isLoading } = useInvoiceStore();

  // Filter states
  const [formData, setFormData] = useState({
    status: "",
    due_date: "",
    search: "",
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const location = useLocation();
  const invoicePath = location.pathname.includes("/invoice");

  useEffect(() => {
    if (!invoicePath) return;

    // Selalu fetch data ketika komponen di-mount atau navigasi ke halaman invoice
    getInvoices();
  }, [invoicePath, getInvoices]);

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
        invoices?.filter((inv) => inv.status === s.id).length
    );

    return { total, paid, unpaid, canceled, expired };
  }, [invoices]);

  // Build unique due date options from API data
  const dueDateOptions = useMemo(() => {
    if (!Array.isArray(invoices)) return [];
    const unique = Array.from(
      new Set(invoices.map((inv) => inv?.invoice_due_date).filter(Boolean))
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const applyFilter = () => {
    getInvoices({ ...formData });
    resetFilter();
  };

  const resetFilter = () => {
    setFormData({
      status: "",
      due_date: "",
      search: "",
    });
    setIsSheetOpen(false);
  };

  const renderLoading = () => {
    return (
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-1">
          <div className="col-span-2 w-1/2 h-[25px] bg-gray-200 rounded-lg animate-pulse mb-2"></div>
          <div className="w-full h-[75px] bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="w-full h-[75px] bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="w-full h-[75px] bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="w-full h-[75px] bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div className="w-full h-[125px] bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="w-full h-[125px] bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  };

  const renderFilter = useMemo(() => {
    return (
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex gap-2">
          <SearchInput
            name="search"
            value={formData?.search}
            onChange={handleChange}
            placeholder="Cari invoice..."
          />
          <button
            onClick={() => setIsSheetOpen(true)}
            className="bg-[var(--c-primary)] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
          >
            <svg
              width="17"
              height="12"
              viewBox="0 0 17 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.75 0.75H15.75M3.25 5.75H13.25M6.25 10.75H10.25"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Filter
          </button>
        </div>
      </div>
    );
  }, []);

  const renderElementsFilter = useMemo(() => {
    const conditionDisable =
      isLoading || formData?.status === "" || formData?.end_date === "";

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
            className="w-full py-4 bg-[var(--c-primary)] text-white rounded-md font-semibold hover:bg-indigo-700 transition-colors duration-200"
            onClick={applyFilter}
            disabled={conditionDisable}
          >
            Terapkan Filter
          </button>
          <button
            className="w-full py-4 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300 transition-colors duration-200"
            onClick={resetFilter}
            disabled={conditionDisable}
          >
            Reset
          </button>
        </div>
      </>
    );
  }, [isLoading, formData]);

  const renderCatalogInvoice = useMemo(() => {
    return (
      <div className="grid grid-cols-2 gap-1 mt-2">
        <div className="w-full flex-shrink-0 p-4 bg-white border rounded-lg shadow-sm">
          <div className="text-xs text-gray-500">Sudah Lunas</div>
          <div className="mt-2 text-xl font-medium text-gray-900">
            {summary.paid || 0}
          </div>
        </div>
        <div className="w-full flex-shrink-0 p-4 bg-white border rounded-lg shadow-sm">
          <div className="text-xs text-gray-500">Belum Bayar</div>
          <div className="mt-2 text-xl font-medium text-gray-900">
            {summary.unpaid || 0}
          </div>
        </div>
        <div className="w-full flex-shrink-0 p-4 bg-white border rounded-lg shadow-sm">
          <div className="text-xs text-gray-500">Dibatalkan</div>
          <div className="mt-2 text-xl font-medium text-gray-900">
            {summary.canceled || 0}
          </div>
        </div>
        <div className="w-full flex-shrink-0 p-4 bg-white border rounded-lg shadow-sm">
          <div className="text-xs text-gray-500">Kadaluarsa</div>
          <div className="mt-2 text-xl font-medium text-gray-900">
            {summary.expired || 0}
          </div>
        </div>
      </div>
    );
  }, [summary]);

  const renderInvoiceList = useMemo(() => {
    return (
      <div className="divide-y flex flex-col gap-3">
        {Array.isArray(invoices) &&
          invoices?.map((inv) => (
            <button
              key={inv.id}
              onClick={() =>
                navigate(`/invoice/detail/${inv.id}`, {
                  replace: true,
                })
              }
              className={`bg-white dark:bg-slate-700 rounded-lg p-4 shadow-soft border border-slate-100 dark:border-slate-600`}
            >
              <div className="flex flex-col gap-1 items-start">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {inv.code}
                </div>
                <div className="text-xs text-gray-500">
                  Mulai: {formatDate(inv.invoice_date)} • Jatuh tempo:{" "}
                  {formatDate(inv.invoice_due_date)}
                </div>
              </div>

              <div className="text-sm font-medium text-gray-900 flex items-center gap-3 justify-between mt-3">
                <span
                  className={
                    dataStatus.find((item) => item.id === inv.status)?.color +
                    " inline-block px-2 py-1 rounded-full text-xs"
                  }
                >
                  {dataStatus.find((item) => item.id === inv.status)?.name}
                </span>
                <span className="font-semibold text-lg text-[var(--c-primary)]">
                  {formatCurrency(inv.invoice_amount)}
                </span>
              </div>
            </button>
          ))}
      </div>
    );
  }, [invoices]);

  const renderElements = useMemo(() => {
    if (isLoading) return renderLoading();

    if (!isLoading && invoices?.length === 0)
      return <ElementsNoData text="Tidak ada invoice" />;

    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Invoice
            </h1>
            <p className="text-sm text-gray-500">
              Daftar invoice dan detail transaksi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary + list */}
          <div className="lg:col-span-3 space-y-4">
            {renderCatalogInvoice}
            {/* Filters */}
            {renderFilter}
            {renderInvoiceList}
          </div>
        </div>
      </div>
    );
  }, [isLoading, invoices, summary, navigate]);

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {renderElements}
      {!isSheetOpen && (
        <FloatingButton
          handleOnClick={() => navigate("/invoice/add", { replace: true })}
        />
      )}
      <BottomSheet
        title="Filter"
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onItemClick={() => setIsSheetOpen(false)}
        renderContent={renderElementsFilter}
      />
    </div>
  );
};

export default Invoice;
