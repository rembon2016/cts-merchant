import { lazy, Suspense } from "react";

const EditCategoriesComponent = lazy(
  () => import("../../components/pos/categories/EditCategories"),
);

const POSEditCategories = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditCategoriesComponent />
    </Suspense>
  );
};

export default POSEditCategories;
