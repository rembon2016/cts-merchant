import { lazy, Suspense } from "react";
import LoadingSkeletonList from "../components/customs/loading/LoadingSkeletonList";

const DetailProductComponent = lazy(
  () => import("../components/pos/DetailProduct"),
);

const DetailProduct = () => {
  return (
    <Suspense fallback={<LoadingSkeletonList />}>
      <DetailProductComponent />
    </Suspense>
  );
};

export default DetailProduct;
