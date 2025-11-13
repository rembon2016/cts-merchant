export default function LoadMoreButton({
  data,
  totalData,
  loading,
  handleLoadMore,
}) {
  return (
    <>
      {data?.length < totalData && (
        <div className="mt-6 text-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 rounded-2xl bg-white hover:text-slate-200 dark:bg-slate-700 text-[var(--c-primary)] dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-600 hover:bg-[var(--c-primary)] dark:hover:bg-slate-600 transition-colors"
          >
            {loading ? "Memuat..." : "Muat Lebih Banyak"}
          </button>
        </div>
      )}
    </>
  );
}
