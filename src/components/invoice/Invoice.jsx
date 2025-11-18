import { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "../../helper/currency";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../../helper/format-date";
import { useInvoiceStore } from "../../store/invoiceStore";
import CustomLoading from "../customs/loading/CustomLoading";
import SimpleInput from "../customs/form/SimpleInput";
import { Plus, XCircle } from "lucide-react";
import FloatingButton from "../customs/button/FloatingButton";

const Invoice = () => {
  const navigate = useNavigate();

  const { invoices, getInvoices, isLoading } = useInvoiceStore();

  // Filter states
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDueDate, setFilterDueDate] = useState("");

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

  const handleChangeStatus = (e) => setFilterStatus(e.target.value);
  const handleChangeDueDate = (e) => setFilterDueDate(e.target.value);

  const applyFilter = () => {
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (filterDueDate) params.end_date = filterDueDate;
    getInvoices(params);
  };

  const resetFilter = () => {
    setFilterStatus("");
    setFilterDueDate("");
    getInvoices();
  };

  const renderElements = useMemo(() => {
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
        {/* Filters */}
        <div className="mb-4 flex gap-2">
          <SimpleInput
            label="Status"
            name="status"
            type="text"
            value={filterStatus}
            isSelectBox={true}
            selectBoxData={statusOptions}
            handleChange={handleChangeStatus}
          />
          <SimpleInput
            label="Jatuh Tempo"
            name="end_date"
            type="text"
            value={filterDueDate}
            isSelectBox={true}
            selectBoxData={dueDateOptions}
            handleChange={handleChangeDueDate}
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            className="w-full py-4 bg-[var(--c-primary)] text-white rounded-md font-semibold hover:bg-indigo-700 transition-colors duration-200"
            onClick={applyFilter}
          >
            Terapkan Filter
          </button>
          <button
            className="w-full py-4 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300 transition-colors duration-200"
            onClick={resetFilter}
          >
            Reset
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary + list */}
          <div className="lg:col-span-3 space-y-2">
            {
              /* Tampilkan loading jika sedang loading */
              isLoading ? (
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
              ) : /* Tampilkan konten berdasarkan apakah ada data atau tidak */
              invoices.length > 0 ? (
                /* Ada data invoice - tampilkan summary cards dan list */
                <>
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {/* <div className="col-span-2 w-full my-2">
                      <span>Jumlah Invoice:</span>
                      <span className="inline-block font-bold ms-2">
                        {summary.total || 0}
                      </span>
                    </div> */}

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
                              Mulai: {formatDate(inv.invoice_date)} • Jatuh
                              tempo: {formatDate(inv.invoice_due_date)}
                            </div>
                          </div>

                          <div className="text-sm font-medium text-gray-900 flex items-center gap-3 justify-between mt-3">
                            <span
                              className={
                                dataStatus.find(
                                  (item) => item.id === inv.status
                                )?.color +
                                " inline-block px-2 py-1 rounded-full text-xs"
                              }
                            >
                              {
                                dataStatus.find(
                                  (item) => item.id === inv.status
                                )?.name
                              }
                            </span>
                            <span className="font-semibold text-lg text-[var(--c-primary)]">
                              {formatCurrency(inv.invoice_amount)}
                            </span>
                          </div>
                        </button>
                      ))}
                  </div>
                </>
              ) : (
                /* Tidak ada data invoice - tampilkan empty state */
                <div className="col-span-2 flex flex-col items-center justify-center text-gray-500 p-4 bg-gray-100 rounded-lg h-[250px]">
                  <XCircle className="w-20 h-20 mb-2 text-gray-400" />
                </div>
              )
            }
          </div>
        </div>
        =
        <FloatingButton
          handleOnClick={() => navigate("/invoice/add", { replace: true })}
        />
      </div>
    );
  }, [isLoading, invoices, summary, navigate, filterStatus, filterDueDate]);

  return <div className="p-4 sm:p-6 lg:p-10">{renderElements}</div>;
};

export default Invoice;
