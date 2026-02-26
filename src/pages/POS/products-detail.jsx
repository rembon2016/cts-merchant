import { lazy, Suspense } from "react";

const ProductsDetailComponent = lazy(
  () => import("../../components/pos/products/DetailProduct"),
);

export default function POSProductsDetail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsDetailComponent />
    </Suspense>
  );
}
