import { lazy, Suspense } from "react";

const TransactionComponent = lazy(
  () => import("../components/transaction/Transaction"),
);

const Transaction = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionComponent />
    </Suspense>
  );
};

export default Transaction;
