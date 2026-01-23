import { lazy, Suspense, memo } from "react";
import LoadingSkeletonCard from "../../customs/loading/LoadingSkeletonCard";

const DashboardTransaction = lazy(() => import("./DashboardTransaction"));
const ListTransaction = lazy(() => import("./ListTransaction"));

function Transaction() {
  return (
    <div className="px-4 py-2">
      <Suspense fallback={<LoadingSkeletonCard />}>
        <DashboardTransaction />
      </Suspense>
      <Suspense fallback={<LoadingSkeletonCard />}>
        <ListTransaction />
      </Suspense>
    </div>
  );
}

export default memo(Transaction);
