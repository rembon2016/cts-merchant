import { lazy, Suspense } from "react";

const DetailTransaction = lazy(
  () => import("../../components/pos/transactions/DetailTransaction"),
);
export default function Order() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailTransaction />
    </Suspense>
  );
}
