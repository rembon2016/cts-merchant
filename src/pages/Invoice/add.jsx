import { lazy, Suspense } from "react";
const InvoiceForm = lazy(() => import("../../components/invoice/InvoiceForm"));

export default function AddInvoice() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvoiceForm />
    </Suspense>
  );
}
