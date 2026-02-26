import { lazy, Suspense } from "react";
const AddCategoriesComponent = lazy(
  () => import("../../components/pos/categories/AddCategories"),
);

const POSAddCategories = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddCategoriesComponent />
    </Suspense>
  );
};

export default POSAddCategories;
