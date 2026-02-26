import { lazy, Suspense } from "react";
const EditProductComponent = lazy(
  () => import("../../components/pos/products/EditProduct"),
);

const POSEditProducts = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProductComponent />
    </Suspense>
  );
};

export default POSEditProducts;
