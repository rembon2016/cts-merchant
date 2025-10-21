import { useMemo } from "react";
import { formatCurrency } from "../helper/currency";

const sampleData = {
  invoiceNumber: "INV-20251020-001",
  date: "2025-10-20",
  dueDate: "2025-11-03",
  merchant: {
    name: "CV Contoh Toko",
    address: "Jl. Merdeka No. 1, Jakarta Selatan",
    phone: "+62 21 1234 5678",
    email: "cs@contohtoko.id",
  },
  customer: {
    name: "Budi Santoso",
    address: "Jl. Kebon Jeruk No. 7, Jakarta",
    phone: "+62 812 3456 7890",
  },
  items: [
    { id: 1, name: "Produk A", qty: 2, price: 45000 },
    { id: 2, name: "Produk B (Variant: Merah)", qty: 1, price: 125000 },
    { id: 3, name: "Layanan Pengiriman", qty: 1, price: 20000 },
  ],
  note: "Terima kasih atas pesanan Anda. Pembayaran dianggap sah setelah transfer diterima.",
};

const Invoice = ({ data = sampleData }) => {
  const subtotal = useMemo(
    () => data.items.reduce((s, i) => s + i.qty * i.price, 0),
    [data]
  );
  const tax = Math.round(subtotal * 0.11); // example PPN 11%
  const total = subtotal + tax;

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Invoice</h1>
              <p className="text-sm text-gray-500">
                Invoice #:{" "}
                <span className="font-medium text-gray-700">
                  {data.invoiceNumber}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Tanggal:{" "}
                <span className="font-medium text-gray-700">{data.date}</span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Jatuh tempo</p>
              <p className="text-sm font-medium">{data.dueDate}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-600">Dari</h3>
              <p className="mt-2 text-gray-800 font-medium">
                {data.merchant.name}
              </p>
              <p className="text-sm text-gray-600">{data.merchant.address}</p>
              <p className="text-sm text-gray-600">{data.merchant.phone}</p>
              <p className="text-sm text-gray-600">{data.merchant.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-600">Kepada</h3>
              <p className="mt-2 text-gray-800 font-medium">
                {data.customer.name}
              </p>
              <p className="text-sm text-gray-600">{data.customer.address}</p>
              <p className="text-sm text-gray-600">{data.customer.phone}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {data.items.map((it) => (
                  <tr key={it.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {it.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                      {it.qty}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                      {formatCurrency(it.price)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {formatCurrency(it.qty * it.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <h4 className="text-sm font-semibold text-gray-600">Catatan</h4>
              <p className="mt-2 text-sm text-gray-700">{data.note}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-800">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>PPN (11%)</span>
                <span className="font-medium text-gray-800">
                  {formatCurrency(tax)}
                </span>
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm">
              Kembali
            </button>
            <button className="px-4 py-2 bg-[var(--c-primary)] text-white rounded-md text-sm">
              Cetak / Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
