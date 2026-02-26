import { lazy, Suspense } from "react";

const EditMerchantComponent = lazy(
  () => import("../components/user/EditMerchant"),
);

export default function EditMerchant() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditMerchantComponent />
    </Suspense>
  );
}
