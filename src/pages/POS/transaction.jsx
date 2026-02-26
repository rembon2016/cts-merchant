import { lazy, Suspense } from "react";

const TrsansactionComponent = lazy(
  () => import("../../components/pos/transactions/Transaction"),
);

const POSTransaction = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrsansactionComponent />
    </Suspense>
  );
};

export default POSTransaction;
