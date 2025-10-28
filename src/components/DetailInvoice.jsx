import { useParams, useSearchParams } from "react-router-dom";
import { formatCurrency } from "../helper/currency";
import { formatDate } from "../helper/format-date";

const statusBadge = (status) => {
  if (status.toLowerCase() === "paid") return "Sudah Bayar";
  if (status.toLowerCase() === "unpaid") return "Belum Bayar";
  if (status.toLowerCase() === "overdue") return "Terlambat";
  return "-";
};

const DetailInvoice = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();

  const sampleData = [
    {
      invoiceNumber: "INV-20251020-001",
      fullName: "John Doe",
      date: "2025-10-20",
      dueDate: "2025-11-03",
      amount: 125000,
      status: "Paid",
      paymentAddress: "Jl. Jend. Sudirman No. 20, Jakarta Pusat, Indonesia",
      goods: [
        {
          name: "Kopi Susu",
          amount: 15000,
          quantity: 2,
        },
        {
          name: "Kopi Liong",
          amount: 12000,
          quantity: 1,
        },
      ],
    },
    {
      invoiceNumber: "INV-20251020-002",
      name: "John Doe",
      date: "2025-10-21",
      dueDate: "2025-11-03",
      amount: 250000,
      status: "Unpaid",
      paymentAddress: "Jl. Jend. Sudirman No. 20, Jakarta Pusat, Indonesia",
      goods: [
        {
          name: "Teh Kotak",
          amount: 12000,
          quantity: 4,
        },
        {
          name: "Susu Kotak Ultramilk",
          amount: 8000,
          quantity: 1,
        },
      ],
    },
    {
      invoiceNumber: "INV-20251020-003",
      name: "John Doe",
      date: "2025-10-22",
      dueDate: "2025-11-03",
      amount: 75000,
      status: "Unpaid",
      paymentAddress: "Jl. Jend. Sudirman No. 20, Jakarta Pusat, Indonesia",
      goods: [
        {
          name: "Sayur Bayem",
          amount: 24000,
          quantity: 2,
        },
      ],
    },
    {
      invoiceNumber: "INV-20251020-004",
      name: "John Doe",
      date: "2025-10-23",
      dueDate: "2025-11-03",
      amount: 425000,
      status: "Paid",
      paymentAddress: "Jl. Jend. Sudirman No. 20, Jakarta Pusat, Indonesia",
      goods: [
        {
          name: "Buah Jeruk",
          amout: 32000,
          quantity: 2,
        },
        {
          name: "Sayur Kangkung",
          amount: 12000,
          quantity: 11,
        },
      ],
    },
    {
      invoiceNumber: "INV-20251020-005",
      name: "John Doe",
      date: "2025-10-24",
      dueDate: "2025-11-03",
      amount: 50000,
      status: "Overdue",
      paymentAddress: "Jl. Jend. Sudirman No. 20, Jakarta Pusat, Indonesia",
      goods: [
        {
          name: "Ikan Asin",
          amount: 12000,
          quantity: 2,
        },
        {
          name: "Ikan Tongkol",
          amount: 16000,
          quantity: 1,
        },
        {
          name: "Wafer Nabati",
          amount: 7000,
          quantity: 14,
        },
      ],
    },
  ];
  // Accept either query param ?invoiceNumber=... or route param /invoice/detail/:id
  const invoiceNumber = searchParams.get("invoiceNumber") || params.id;

  const invoice = sampleData.find((i) => i.invoiceNumber === invoiceNumber);

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="w-full mx-auto bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <div className="flex w-full justify-end">
          <button className="py-4 px-6 rounded-lg bg-[var(--c-primary)] hover:bg-blue-700 transition-colors ease-linear duration-300 ml-auto text-white mb-4">
            Cetak
          </button>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xl font-semibold">
              {invoice ? invoice.invoiceNumber : invoiceNumber || "-"}
            </div>
            <div className="text-sm text-gray-700 mt-1">
              {invoice ? invoice.name || invoice.fullName || "-" : "-"}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {statusBadge(invoice?.status)}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between gap-4">
          <div>
            <div className="text-xs text-gray-500">Tanggal Penagihan</div>
            <div className="mt-1">
              {invoice ? formatDate(invoice.date) : "-"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Tenggat Waktu</div>
            <div className="mt-1">
              {invoice ? formatDate(invoice.dueDate) : "-"}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-gray-500">Alamat Penagihan</div>
          <div className="mt-1 text-sm">{invoice?.paymentAddress || "-"}</div>
        </div>

        <div className="mt-8">
          <div className="text-sm font-medium mb-2">Daftar Barang</div>
          {invoice?.goods?.length > 0 ? (
            <ul className="divide-y">
              {invoice.goods.map((g, idx) => (
                <li
                  key={idx}
                  className="py-2 flex justify-between items-center"
                >
                  <div className="flex items-center gap-1">
                    <div className="truncate">{g.name}</div>
                    <div className="text-sm text-gray-600">x{g.quantity}</div>
                  </div>
                  <div className="text-sm font-medium">
                    {formatCurrency(g.amount * g.quantity)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No items</div>
          )}
        </div>

        <div className="text-right mt-4 border-t pt-4">
          <div className="text-xs text-gray-500">Total Pembayaran</div>
          <div className="text-lg font-medium mt-1">
            {invoice ? formatCurrency(invoice.amount) : "-"}
          </div>
        </div>

        {!invoice && (
          <div className="mt-4 text-sm text-red-600">
            Invoice tidak ditemukan untuk "{invoiceNumber}"
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailInvoice;
