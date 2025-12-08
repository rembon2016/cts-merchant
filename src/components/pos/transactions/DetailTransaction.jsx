import { useEffect, useMemo } from "react";
import { useCheckoutStore } from "../../../store/checkoutStore";
import { formatCurrency } from "../../../helper/currency";
import BackButton from "../../customs/button/BackButton";
import LoadingSkeletonCard from "../../customs/loading/LoadingSkeletonCard";

export default function DetailTransaction() {
  const date = (iso) =>
    new Date(iso).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const { getTransactionDetail, transactionData, isLoading } =
    useCheckoutStore();

  const getIdFromUrl = globalThis.location.pathname.split("/")[3];
  const pathname = globalThis.location.pathname;

  useEffect(() => {
    if (pathname !== `/pos/transaction/${getIdFromUrl}`) return;
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

  const renderElements = useMemo(() => {
    if (isLoading) {
      return <LoadingSkeletonCard />;
    }

    return (
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-5">
                Detail Transaksi
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                Kode:{" "}
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {trx.code || "-"}
                </span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                Tanggal:{" "}
                <span className="font-medium text-gray-700 dark:text-gray-200">
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
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-5">
                Tipe:{" "}
                <span className="font-medium text-gray-700 dark:text-gray-200 capitalize">
                  {trx.transaction_type || "-"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-300">
                Cabang
              </h3>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {trx.branch?.name || "-"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-300">
                Pembayaran
              </h3>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {trx.payment_method?.name || "-"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-300">
                Kasir
              </h3>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {trx.created_by || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
            Items
          </h4>

          <div className="divide-y border border-gray-300 dark:border-gray-500 rounded-md">
            {items.length === 0 && (
              <div className="p-4 text-gray-500 dark:text-gray-300">
                Tidak ada item
              </div>
            )}

            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-4 p-4 ">
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
                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {it.product?.name || "Produk"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-300">
                        Kode: {it.product?.code || "-"}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-200">
                        {formatCurrency(Number(it.price))} x {it.qty || 0} pcs
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-full">
                      Subtotal:{" "}
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {formatCurrency(Number(it.subtotal))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 dark:bg-slate-700">
          <div className="max-w-md ml-auto">
            <div className="flex justify-between py-1 text-sm text-gray-600 dark:text-gray-300">
              <div>Subtotal</div>
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {formatCurrency(Number(trx.subtotal || 0))}
              </div>
            </div>
            <div className="flex justify-between py-1 text-sm text-gray-600 dark:text-gray-300">
              <div>Pajak</div>
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {formatCurrency(Number(trx.tax || 0))}
              </div>
            </div>
            <div className="flex justify-between py-1 text-sm text-gray-600 dark:text-gray-300">
              <div>Diskon</div>
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {formatCurrency(Number(trx.discount || 0))}
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t mt-3 items-center">
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Total
              </div>
              <div className="text-lg font-semibold text-indigo-600 dark:text-gray-200">
                {formatCurrency(Number(trx.total || 0))}
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              <div>
                Jumlah Pembayaran:{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {formatCurrency(Number(trx.payment_amount || 0))}
                </span>
              </div>
              <div>
                Kembalian:{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {formatCurrency(Number(trx.change || 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [isLoading]);

  return (
    <div className="p-6">
      <BackButton to="/pos/transaction" />
      {renderElements}
    </div>
  );
}
