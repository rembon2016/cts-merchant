import { lazy, Suspense } from "react";
import LoadingSkeletonList from "../../components/customs/loading/LoadingSkeletonList";

const DetailInvoiceComponent = lazy(
  () => import("../../components/invoice/DetailInvoice"),
);

export default function AddInvoice() {
  return (
    <Suspense fallback={<LoadingSkeletonList />}>
      <DetailInvoiceComponent />
    </Suspense>
  );
}
