import { lazy, Suspense } from "react";
import LoadingSkeletonList from "../../components/customs/loading/LoadingSkeletonList";

const InvoiceComponent = lazy(() => import("../../components/invoice/Invoice"));

export default function Invoice() {
  return (
    <Suspense fallback={<LoadingSkeletonList />}>
      <InvoiceComponent />
    </Suspense>
  );
}
