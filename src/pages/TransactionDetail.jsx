import { lazy, Suspense } from "react";

const TransactionDetailComponent = lazy(
  () => import("../components/transaction/TransactionDetail"),
);

const TransactionDetail = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionDetailComponent />
    </Suspense>
  );
};

export default TransactionDetail;
