import { useEffect, useMemo, useState } from "react";
import useFetchDataStore from "../store/fetchDataStore";

export default function Transaction() {
  const { data, loading, error, fetchData } = useFetchDataStore();
  const [activeFilter, setActiveFilter] = useState("all");

  const filterButton = [
    { name: "Semua", type: "all" },
    { name: "Pemasukan", type: "income" },
    { name: "Pengeluaran", type: "outcome" },
  ];

  const handleFilter = (type) => {
    setActiveFilter(type);
    let url = `${
      import.meta.env.VITE_API_ROUTES
    }/v1/merchant/transaction?page=1&per_page=10`;
    if (type !== "all") {
      url += `&type=${type}`;
    }
    fetchData(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  useEffect(() => {
    fetchData(
      `${
        import.meta.env.VITE_API_ROUTES
      }/v1/merchant/transaction?page=1&per_page=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }, []);

  const renderElement = useMemo(() => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!data || data?.transactions?.length === 0)
      return <div>No Transaction available.</div>;

    return (
      <div className="space-y-3">
        {data?.transactions?.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-soft border border-slate-100 dark:border-slate-600"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`size-10 rounded-xl grid place-items-center ${
                    item.type === "income"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  {item.type === "income" ? (
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-red-600 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(item.transaction_at).toISOString().split("T")[0]}{" "}
                    *{" "}
                    {new Date(item.transaction_at).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    item.type === "income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {item.type === "income" ? "+" : "-"}Rp{" "}
                  {item.amount.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }, [data, loading, error]);

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary dark:text-slate-200 mb-2">
          Riwayat Transaksi
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Lihat semua transaksi terbaru Anda
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        {filterButton.map((item) => (
          <button
            key={item.type}
            className={`px-4 py-2 rounded-full ${
              activeFilter === item.type
                ? "bg-[var(--c-accent)]"
                : "bg-white dark:bg-slate-700 dark:text-slate-300"
            } text-slate-600 text-sm font-medium border border-slate-200 dark:border-slate-600 transition-colors`}
            onClick={() => handleFilter(item.type)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      {renderElement}

      {/* Load More Button */}
      <div className="mt-6 text-center">
        <button className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
          Muat Lebih Banyak
        </button>
      </div>
    </div>
  );
}
