import { useEffect } from "react";
import { useCheckoutStore } from "../../store/checkoutStore";
import { formatCurrency } from "../../helper/currency";

const Order = () => {
  const date = (iso) =>
    new Date(iso).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const { getTransactionDetail, transactionData } = useCheckoutStore();

  const getIdFromUrl = globalThis.location.pathname.split("/")[2];
  const pathname = globalThis.location.pathname;

  useEffect(() => {
    if (pathname !== `/order/${getIdFromUrl}`) return;
    getTransactionDetail(getIdFromUrl);
  }, [pathname, getIdFromUrl]);

  const trx = transactionData || {};
  const items = trx.items || [];
  let statusClass = "bg-gray-100 text-gray-800";
  if (trx.status === "completed") {
    statusClass = "bg-green-100 text-green-800";
  } else if (trx.status === "pending") {
    statusClass = "bg-yellow-100 text-yellow-800";
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Detail Transaksi
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Kode:{" "}
                <span className="font-medium text-gray-700">
                  {trx.code || "-"}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Tanggal:{" "}
                <span className="font-medium text-gray-700">
                  {trx.datetime ? date(trx.datetime) : "-"}
                </span>
              </p>
            </div>

            <div className="text-right">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}
              >
                {trx.status || "N/A"}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Tipe:{" "}
                <span className="font-medium text-gray-700 capitalize">
                  {trx.transaction_type || "-"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm text-gray-500">Cabang</h3>
              <p className="font-medium text-gray-800">
                {trx.branch?.name || "-"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500">Pembayaran</h3>
              <p className="font-medium text-gray-800">
                {trx.payment_method?.name || "-"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500">Kasir</h3>
              <p className="font-medium text-gray-800">
                {trx.created_by || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Items</h4>

          <div className="divide-y border rounded-md">
            {items.length === 0 && (
              <div className="p-4 text-gray-500">Tidak ada item</div>
            )}

            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-4 p-4">
                {/* <img
                  src={
                    it.product?.image
                      ? `${import.meta.env.VITE_API_IMAGE}/${it.product.image}`
                      : "/public/images/no-image.png"
                  }
                  alt={it.product?.name}
                  className="w-16 h-16 object-cover rounded"
                /> */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {it.product?.name || "Produk"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Kode: {it.product?.code || "-"}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">
                      {formatCurrency(Number(it.price))}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                    <div>
                      Jumlah:{" "}
                      <span className="font-medium text-gray-800">
                        {it.qty}
                      </span>
                    </div>
                    <div>
                      Subtotal:{" "}
                      <span className="font-medium text-gray-800">
                        {formatCurrency(Number(it.subtotal))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="max-w-md ml-auto">
            <div className="flex justify-between py-1 text-sm text-gray-600">
              <div>Subtotal</div>
              <div className="font-medium text-gray-800">
                {formatCurrency(Number(trx.subtotal || 0))}
              </div>
            </div>
            <div className="flex justify-between py-1 text-sm text-gray-600">
              <div>Pajak</div>
              <div className="font-medium text-gray-800">
                {formatCurrency(Number(trx.tax || 0))}
              </div>
            </div>
            <div className="flex justify-between py-1 text-sm text-gray-600">
              <div>Diskon</div>
              <div className="font-medium text-gray-800">
                {formatCurrency(Number(trx.discount || 0))}
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t mt-3 items-center">
              <div className="text-lg font-semibold text-gray-800">Total</div>
              <div className="text-lg font-semibold text-indigo-600">
                {formatCurrency(Number(trx.total || 0))}
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              <div>
                Jumlah Pembayaran:{" "}
                <span className="font-medium text-gray-800">
                  {formatCurrency(Number(trx.payment_amount || 0))}
                </span>
              </div>
              <div>
                Kembalian:{" "}
                <span className="font-medium text-gray-800">
                  {formatCurrency(Number(trx.change || 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
