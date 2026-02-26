import { lazy, Suspense } from "react";

const OrderComponent = lazy(() => import("../components/Order"));

export default function Order() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderComponent />
    </Suspense>
  );
}
