import { useMemo } from "react";
import { formatCurrency } from "../helper/currency";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../helper/format-date";

const sampleData = [
  {
    invoiceNumber: "INV-20251020-001",
    date: "2025-10-20",
    dueDate: "2025-11-03",
    amount: 125000,
    status: "Paid",
  },
  {
    invoiceNumber: "INV-20251020-002",
    date: "2025-10-21",
    dueDate: "2025-11-03",
    amount: 250000,
    status: "Unpaid",
  },
  {
    invoiceNumber: "INV-20251020-003",
    date: "2025-10-22",
    dueDate: "2025-11-03",
    amount: 75000,
    status: "Unpaid",
  },
  {
    invoiceNumber: "INV-20251020-004",
    date: "2025-10-23",
    dueDate: "2025-11-03",
    amount: 425000,
    status: "Paid",
  },
  {
    invoiceNumber: "INV-20251020-005",
    date: "2025-10-24",
    dueDate: "2025-11-03",
    amount: 50000,
    status: "Overdue",
  },
];

const Invoice = () => {
  const navigate = useNavigate();

  const summary = useMemo(() => {
    const total = sampleData.length;
    const paid = sampleData.filter((s) => s.status === "Paid").length;
    const unpaid = sampleData.filter((s) => s.status === "Unpaid").length;
    const overdue = sampleData.filter((s) => s.status === "Overdue").length;
    return { total, paid, unpaid, overdue };
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-10">
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
                  {summary.total}
                </div>
              </div>
              <div className="w-full flex-shrink-0 p-4 bg-white border rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Belum Bayar</div>
                <div className="mt-2 text-xl font-medium text-gray-900">
                  {summary.unpaid}
                </div>
              </div>
              <div className="w-full flex-shrink-0 p-4 bg-white border rounded-lg shadow-sm">
                <div className="text-xs text-gray-500">Terlambat</div>
                <div className="mt-2 text-xl font-medium text-gray-900">
                  {summary.overdue}
                </div>
              </div>
            </div>

            <div className="p-2">
              <div className="divide-y flex flex-col gap-3">
                {sampleData.map((inv) => (
                  <button
                    key={inv.invoiceNumber}
                    onClick={() =>
                      navigate(`/invoice/detail/${inv.invoiceNumber}`, {
                        replace: true,
                      })
                    }
                    className={`bg-white dark:bg-slate-700 rounded-lg p-4 shadow-soft border border-slate-100 dark:border-slate-600`}
                  >
                    <div className="flex flex-col gap-1 items-start">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {inv.invoiceNumber}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Mulai: {formatDate(inv.date)} • Jatuh tempo:{" "}
                        {formatDate(inv.dueDate)}
                      </div>
                    </div>

                    <div className="text-sm font-medium text-gray-900 flex items-center gap-1 justify-end mt-3">
                      {formatCurrency(inv.amount)}
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                          inv.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : inv.status === "Overdue"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
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

          {/* Detail panel */}
          {/* <aside className="lg:col-span-1">
            <div className="sticky top-6 p-4 bg-white border rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-900">
                Detail Invoice
              </h3>
              {selected ? (
                <div className="mt-3 text-sm text-gray-700 space-y-2">
                  <div>
                    <div className="text-xs text-gray-500">Nomor</div>
                    <div className="font-medium">{selected.invoiceNumber}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Tanggal</div>
                    <div>{selected.date}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Jatuh Tempo</div>
                    <div>{selected.dueDate}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Jumlah</div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(selected.amount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Status</div>
                    <div>
                      <span
                        className={`inline-block mt-1 px-3 py-1 rounded-full text-xs ${
                          selected.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : selected.status === "Overdue"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selected.status}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md text-sm">
                      Cetak
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-sm text-gray-500">
                  Pilih invoice untuk melihat detail
                </div>
              )}
            </div>
          </aside> */}
        </div>
      </div>
    </div>
  );
};

export default Invoice;
