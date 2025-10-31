import { useLocation, useNavigate } from "react-router-dom";
import { useInvoiceStore } from "../store/invoiceStore";
import { useEffect, useMemo } from "react";
import { formatDate } from "../helper/format-date";
import { formatCurrency } from "../helper/currency";
import CustomLoading from "./CustomLoading";

const statusBadge = (status) => {
  if (status?.toLowerCase() === "paid") return "Sudah Bayar";
  if (status?.toLowerCase() === "pending") return "Belum Bayar";
  if (status?.toLowerCase() === "overdue") return "Terlambat";
  return "-";
};

const DetailInvoice = () => {
  const { invoices, getDetailInvoices, printInvoices, isLoading } =
    useInvoiceStore();

  const location = useLocation();
  const navigate = useNavigate();
  const invoicePath = location.pathname.includes(`/invoice/detail`);

  const invoiceId = globalThis?.location?.pathname?.split("/").pop();

  const handlePrintInvoices = async () => await printInvoices(invoiceId);

  useEffect(() => {
    if (!invoicePath && !invoiceId) return;
    getDetailInvoices(invoiceId);
  }, [invoicePath, invoiceId]);

  const renderElements = useMemo(() => {
    if (isLoading) {
      return <CustomLoading />;
    }

    return (
      <div className="w-full mx-auto bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <div className="flex w-full  justify-end gap-2 mb-2">
          <button
            onClick={() => navigate("/invoice", { replace: true })}
            className="py-4 px-6 rounded-lg bg-[var(--c-accent)] hover:bg-yellow-300 transition-colors ease-linear duration-300 ml-auto text-gray-700 mb-4"
          >
            Kembali
          </button>
          <button
            onClick={handlePrintInvoices}
            className="py-4 px-6 rounded-lg bg-[var(--c-primary)] hover:bg-blue-700 transition-colors ease-linear duration-300 text-white mb-4"
          >
            Cetak
          </button>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xl font-semibold">
              {invoices ? invoices.code : "-"}
            </div>
            <div className="text-sm text-gray-700 mt-1">
              {invoices ? invoices.customer_name : "-"}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {statusBadge(invoices?.status)}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between gap-4">
          <div>
            <div className="text-xs text-gray-500">Tanggal Penagihan</div>
            <div className="mt-1">
              {invoices ? formatDate(invoices.invoice_date) : "-"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Tenggat Waktu</div>
            <div className="mt-1">
              {invoices ? formatDate(invoices.invoice_due_date) : "-"}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-gray-500">Alamat Penagihan</div>
          <div className="mt-1 text-sm">{invoices?.bill_address || "-"}</div>
        </div>

        <div className="mt-8">
          <div className="text-sm font-medium mb-2">Daftar Barang</div>
          {invoices?.products?.length > 0 ? (
            <ul className="divide-y">
              {invoices?.products.map((g) => (
                <li
                  key={g.id}
                  className="py-2 flex justify-between items-center"
                >
                  <div className="flex items-center gap-1">
                    <div className="truncate">{g.product_name}</div>
                    <div className="text-sm text-gray-600">x{g.quantity}</div>
                  </div>
                  <div className="text-sm font-medium">
                    {formatCurrency(g.price)}
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
            {invoices ? formatCurrency(invoices?.invoice_amount) : "-"}
          </div>
        </div>

        {!invoices && (
          <div className="mt-4 text-sm text-red-600">
            Invoice tidak ditemukan untuk "{invoices?.code}"
          </div>
        )}
      </div>
    );
  }, [isLoading]);

  return <div className="p-4 sm:p-6 lg:p-10">{renderElements}</div>;
};

export default DetailInvoice;
