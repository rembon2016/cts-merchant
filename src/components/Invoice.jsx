import { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "../helper/currency";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../helper/format-date";
import { useInvoiceStore } from "../store/invoiceStore";
import CustomLoading from "./CustomLoading";
import SimpleInput from "./form/SimpleInput";
import { Plus } from "lucide-react";

const Invoice = () => {
  const navigate = useNavigate();

  const { invoices, getInvoices, isLoading } = useInvoiceStore();

  const location = useLocation();
  const invoicePath = location.pathname.includes("/invoice");

  useEffect(() => {
    if (!invoicePath) return;
    getInvoices();
  }, [invoicePath]);

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
              className="p-3 bg-[var(--c-primary)] text-white rounded-md text-sm hover:bg-indigo-700"
              onClick={() => navigate("/invoice/add", { replace: true })}
            >
              <Plus />
            </button>
            {/* <input
              type="search"
              placeholder="Cari invoice..."
              className="hidden sm:block border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            /> */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary + list */}
          <div className="lg:col-span-3 space-y-2">
            <div className="grid grid-cols-2 gap-1">
              {/* <div className="w-full flex-shrink-0 p-4 bg-white border rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Total Invoice</div>
                <div className="mt-2 text-xl font-medium text-gray-900">
                  {summary.total || 0}
                </div>
              </div> */}

              <div className="col-span-2 w-full mb-2">
                <span>Jumlah Invoice:</span>
                <span className="inline-block font-bold ms-2">
                  {summary.total || 0}
                </span>
              </div>

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

            {/* <div className="w-full p-4 bg-white flex gap-2">
              <SimpleInput
                name="status"
                type="text"
                label=""
                selectBoxData={dataStatus}
                value={selectStatus}
                handleChange={(e) => setSelectStatus(e.target.value)}
                isSelectBox={true}
              />
              <button className="py-4 px-6 bg-[var(--c-primary)] text-white rounded-lg">
                Filter
              </button>
            </div> */}

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
                          dataStatus.find((item) => item.id === inv.status)
                            ?.color +
                          " inline-block px-2 py-1 rounded-full text-xs"
                        }
                      >
                        {
                          dataStatus.find((item) => item.id === inv.status)
                            ?.name
                        }
                      </span>
                      <span className="font-semibold text-lg text-[var(--c-primary)]">
                        {formatCurrency(inv.invoice_amount)}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }, [isLoading, invoices]);

  return <div className="p-4 sm:p-6 lg:p-10">{renderElements}</div>;
};

export default Invoice;
