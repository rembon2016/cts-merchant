import { lazy, Suspense } from "react";

const POSProductComponent = lazy(
  () => import("../../components/pos/products/ListProduct"),
);

const POSProducts = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <POSProductComponent />
    </Suspense>
  );
};

export default POSProducts;
