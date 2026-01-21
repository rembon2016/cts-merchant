import { Suspense } from "react";
import { RouteLoadingFallback } from "../../../utils/routeLoading";

export default function ButtonFilter({ setIsSheetOpen }) {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <button
        onClick={() => setIsSheetOpen(true)}
        className="bg-[var(--c-primary)] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
      >
        <svg
          width="17"
          height="12"
          viewBox="0 0 17 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.75 0.75H15.75M3.25 5.75H13.25M6.25 10.75H10.25"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Filter
      </button>
    </Suspense>
  );
}
