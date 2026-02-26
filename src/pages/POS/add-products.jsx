import { lazy, Suspense } from "react";
const AddProductComponent = lazy(
  () => import("../../components/pos/products/AddProduct"),
);

const POSAddProducts = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddProductComponent />
    </Suspense>
  );
};

export default POSAddProducts;
