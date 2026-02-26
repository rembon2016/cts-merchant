import { lazy, Suspense } from "react";

const POSComponent = lazy(() => import("../../components/pos/POS"));

const POS = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <POSComponent />
    </Suspense>
  );
};

export default POS;
