import { lazy, Suspense } from "react";

const CustomerSupportComponent = lazy(
  () => import("../components/user/CustomerSupport"),
);

export default function CustomerSupport() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerSupportComponent />
    </Suspense>
  );
}
