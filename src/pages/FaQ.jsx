import { lazy, Suspense } from "react";

const FaQComponent = lazy(() => import("../components/user/FaQ"));

const FaQ = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FaQComponent />
    </Suspense>
  );
};

export default FaQ;
