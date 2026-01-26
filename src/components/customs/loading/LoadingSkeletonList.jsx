import React from "react";

/**
 * LoadingSkeletonList
 * Skeleton untuk daftar (list) item, mobile-first dan dark-mode ready.
 *
 * Props:
 * - items: jumlah item skeleton yang dirender (default 6)
 * - showAvatar: tampilkan bulatan avatar di kiri (default true)
 * - className: kelas tambahan untuk container
 */
export default function LoadingSkeletonList({ items = 1, className = "" }) {
  return (
    <div className="relative">
      {Array.from({ length: Number(items) || 1 }).map((item) => (
        <div
          key={item?.id + Math?.random()}
          className={`border rounded-lg shadow overflow-hidden bg-white dark:bg-slate-800 animate-pulse mb-4 p-4 ${className}`}
          aria-busy="true"
          aria-live="polite"
        >
          <div className="flex-1">
            <div className="w-2/3 h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
            <div className="w-1/3 h-3 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
