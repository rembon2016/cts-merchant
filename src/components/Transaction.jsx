import { useEffect, useMemo, useReducer, useState } from "react";
import useFetchDataStore from "../store/fetchDataStore";
import { useDebounce } from "../hooks/useDebounce";
import SearchInput from "./SearchInput";
import LoadMoreButton from "./LoadMoreButton";
import CustomLoading from "./CustomLoading";

// Define action types
const SET_FILTER = "SET_FILTER";
const SET_PAGE = "SET_PAGE";
const SET_SEARCH_QUERY = "SET_SEARCH_QUERY";

// Initial state
const initialState = {
  activeFilter: "all",
  searchQuery: "",
  currentPage: 1,
};

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case SET_FILTER:
      return {
        ...state,
        activeFilter: action.payload,
        currentPage: 1, // Reset page when filter changes
      };
    case SET_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    case SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
        currentPage: 1, // Reset page when searching
      };
    default:
      return state;
  }
}

export default function Transaction() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data, totalData, loading, error, fetchData } = useFetchDataStore();
  const [accumulatedData, setAccumulatedData] = useState([]);

  const filterButton = [
    { name: "Semua", type: "all" },
    { name: "Pemasukan", type: "income" },
    { name: "Pengeluaran", type: "outcome" },
  ];

  // Debounce search query with 500ms delay
  const debouncedSearch = useDebounce(state.searchQuery, 500);

  // Effect untuk mengelola accumulated data ketika data berubah
  useEffect(() => {
    if (data?.transactions) {
      if (state.currentPage > 1) {
        setAccumulatedData((prev) => [...prev, ...data.transactions]);
      } else {
        setAccumulatedData(data.transactions);
      }
    }
  }, [data]);

  const fetchTransactions = (page = 1, filter = state.activeFilter) => {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      per_page: "10",
      ...(debouncedSearch && { search: debouncedSearch }),
    });

    let url = `${
      import.meta.env.VITE_API_ROUTES
    }/v1/merchant/transaction?${searchParams.toString()}`;
    if (filter !== "all") {
      url += `&type=${filter}`;
    }
    if (debouncedSearch) {
      url += `&search=${debouncedSearch}`;
    }
    fetchData(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleFilter = (type) => {
    dispatch({ type: SET_FILTER, payload: type });
    fetchTransactions(1, type);
  };

  const handleLoadMore = () => {
    const nextPage = state.currentPage + 1;
    dispatch({ type: SET_PAGE, payload: nextPage });
    fetchTransactions(nextPage);
  };

  // Initial fetch
  useEffect(() => {
    fetchTransactions(1);
  }, [debouncedSearch, state.activeFilter]);

  const renderElement = useMemo(() => {
    if (loading && !accumulatedData.length) {
      return <CustomLoading />;
    }
    if (error) {
      return <div className="text-center text-red-500">Error: {error}</div>;
    }
    if (!accumulatedData.length) {
      return (
        <div className="text-center py-4">
          {state.searchQuery
            ? "Tidak ada Transaksi yang sesuai dengan pencarian Anda."
            : "Tidak ada Transaksi tersedia."}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {accumulatedData.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
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
  }, [accumulatedData, loading, error]);

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
              state.activeFilter === item.type
                ? "bg-[var(--c-accent)]"
                : "bg-white dark:bg-slate-700 dark:text-slate-300"
            } text-slate-600 text-sm font-medium border border-slate-200 dark:border-slate-600 transition-colors`}
            onClick={() => handleFilter(item.type)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <SearchInput
          value={state.searchQuery}
          onChange={(value) =>
            dispatch({ type: SET_SEARCH_QUERY, payload: value })
          }
          placeholder="Cari transaksi..."
        />
      </div>

      {/* Transaction List */}
      {renderElement}

      {/* Load More Button */}
      <LoadMoreButton
        data={accumulatedData}
        totalData={totalData}
        loading={loading}
        handleLoadMore={handleLoadMore}
      />
    </div>
  );
}
