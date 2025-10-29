import { useEffect, useMemo } from "react";
import { formatCurrency } from "../helper/currency";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../helper/format-date";
import { useInvoiceStore } from "../store/invoiceStore";
import CustomLoading from "./CustomLoading";

const Invoice = () => {
  const navigate = useNavigate();

  const { invoices, getInvoices, isLoading } = useInvoiceStore();

  const location = useLocation();
  const invoicePath = location.pathname.includes("/invoice");

  useEffect(() => {
    if (!invoicePath) return;
    getInvoices();
  }, [invoicePath]);

  const summary = useMemo(() => {
    const total = invoices?.length;
    const paid =
      Array.isArray(invoices) &&
      invoices?.filter((s) => s.status === "paid").length;
    const unpaid =
      Array.isArray(invoices) &&
      invoices?.filter((s) => s.status === "pending").length;
    return { total, paid, unpaid };
  }, [invoices]);

  const renderElements = useMemo(() => {
    if (isLoading) {
      return <CustomLoading />;
    }

    if (invoices?.length === 0) {
      <div className="w-full text-center">
        <p className="text-gray-800">Data Invoice Kosong</p>
      </div>;
    }

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
          <div className="flex items-center gap-3">
            <button
              className="p-4 bg-[var(--c-primary)] text-white rounded-md text-sm hover:bg-indigo-700"
              onClick={() => navigate("/invoice/add", { replace: true })}
            >
              Buat Invoice
            </button>
            <input
              type="search"
              placeholder="Cari invoice..."
              className="hidden sm:block border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Summary + list */}
          <div className="lg:col-span-3 space-y-2">
            <div className="grid grid-cols-3 gap-1">
              <div className="w-full flex-shrink-0 p-4 bg-white border rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Total Invoice</div>
                <div className="mt-2 text-xl font-medium text-gray-900">
                  {summary.total || 0}
                </div>
              </div>
              <div className="w-full flex-shrink-0 p-4 bg-white border rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Belum Bayar</div>
                <div className="mt-2 text-xl font-medium text-gray-900">
                  {summary.unpaid || 0}
                </div>
              </div>
              <div className="w-full flex-shrink-0 p-4 bg-white border rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Sudah Lunas</div>
                <div className="mt-2 text-xl font-medium text-gray-900">
                  {summary.paid || 0}
                </div>
              </div>
              {/* <div className="w-full flex-shrink-0 p-4 bg-white border rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Terlambat</div>
                <div className="mt-2 text-xl font-medium text-gray-900">
                  {summary.overdue}
                </div>
              </div> */}
            </div>

            <div className="p-2">
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
                        <div className="text-xs text-gray-500 mt-1">
                          Mulai: {formatDate(inv.invoice_date)} • Jatuh tempo:{" "}
                          {formatDate(inv.invoice_due_date)}
                        </div>
                      </div>

                      <div className="text-sm font-medium text-gray-900 flex items-center gap-1 justify-end mt-3">
                        {formatCurrency(inv.invoice_amount)}
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            inv.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : inv.status === "pending"
                              ? "bg-red-100 text-yellow-800"
                              : "bg-yellow-100 text-red-800"
                          }`}
                        >
                          {inv.status.toLocaleLowerCase() === "paid"
                            ? "Lunas"
                            : inv.status.toLocaleLowerCase() === "overdue"
                            ? "Terlambat"
                            : "Belum Bayar"}
                        </span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [isLoading, invoices]);

  return <div className="p-4 sm:p-6 lg:p-10">{renderElements}</div>;
};

export default Invoice;
