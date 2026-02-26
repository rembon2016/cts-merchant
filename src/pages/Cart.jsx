import { lazy, Suspense } from "react";

const CartComponent = lazy(() => import("../components/pos/Cart"));

export default function Cart() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CartComponent />
    </Suspense>
  );
}
