import React from "react";

export default function LoadingSkeletonCard({ items = 1, className = "" }) {
  return (
    <div
      className={`border  rounded-lg shadow overflow-hidden bg-white dark:bg-slate-800 animate-pulse mb-4 ${className}`}
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: Number(items) || 1 }).map((item) => (
        <div key={item?.id}>
          <div className="relative w-full">
            <div className="w-full h-[100px] bg-gray-200 dark:bg-slate-700" />
          </div>
          <div className="p-2 w-full h-full flex flex-col justify-between">
            <div>
              {/* Harga */}
              <div className="w-24 h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
              {/* Nama produk (2 baris) */}
              <div className="w-full h-3 bg-gray-200 dark:bg-slate-700 rounded mb-1" />
              <div className="w-2/3 h-3 bg-gray-200 dark:bg-slate-700 rounded mb-3" />
              {/* Stok */}
              <div className="w-20 h-4 bg-gray-300 dark:bg-slate-600 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
