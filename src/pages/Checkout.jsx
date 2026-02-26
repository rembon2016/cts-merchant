import { lazy, Suspense } from "react";

const CheckoutComponent = lazy(() => import("../components/pos/Checkout"));

export default function Checkout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutComponent />
    </Suspense>
  );
}
