import { useEffect, useMemo, useReducer, useState } from "react";
import useFetchDataStore from "../../store/fetchDataStore";
import { useDebounce } from "../../hooks/useDebounce";
import SearchInput from "../customs/form/SearchInput";
import LoadMoreButton from "../customs/button/LoadMoreButton";
import LoadingSkeletonList from "../customs/loading/LoadingSkeletonList";
import { formatCurrency } from "../../helper/currency";
import NoData from "../customs/element/NoData";
import { formatDate } from "../../helper/format-date";
import { useThemeStore } from "../../store/themeStore";

// Define action types
const SET_FILTER = "SET_FILTER";
const SET_PAGE = "SET_PAGE";
const SET_SEARCH_QUERY = "SET_SEARCH_QUERY";
const ROOT_API = import.meta.env.VITE_API_ROUTES;

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
  const { isDark } = useThemeStore();
  const [accumulatedData, setAccumulatedData] = useState([]);

  // Debounce search query with 500ms delay
  const debouncedSearch = useDebounce(state.searchQuery, 1000);

  const headersApi = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
  };

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

    let url = `${ROOT_API}/v1/merchant/transaction?${searchParams.toString()}`;
    if (filter !== "all") {
      url += `&type=${filter}`;
    }
    fetchData(url, {
      method: "GET",
      headers: headersApi,
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
      return <LoadingSkeletonList items={accumulatedData?.length} />;
    }
    if (error) {
      return <div className="text-center text-red-500">Error: {error}</div>;
    }
    if (!accumulatedData.length) {
      return <NoData text="Tidak ada transaksi" />;
    }

    return (
      <div className="space-y-3">
        {accumulatedData.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="bg-white dark:bg-slate-700 rounded-2xl p-4 shadow-soft border border-slate-100 dark:border-slate-600"
          >
            <div className="flex gap-2 flex-col justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`size-10 rounded-xl grid place-items-center bg-blue-100 dark:bg-slate-500`}
                >
                  <svg
                    width="20"
                    height="22"
                    viewBox="0 0 20 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-blue-600 dark:text-blue-400"
                  >
                    <path
                      d="M16.75 9.25V8.75C16.75 4.979 16.75 3.093 15.578 1.922C14.406 0.751 12.521 0.75 8.75 0.75C4.979 0.75 3.093 0.75 1.922 1.922C0.751 3.094 0.75 4.979 0.75 8.75V13.25C0.75 16.537 0.75 18.181 1.658 19.288C1.82467 19.4907 2.00933 19.6753 2.212 19.842C3.32 20.75 4.962 20.75 8.25 20.75M4.75 5.75H12.75M4.75 9.75H8.75"
                      stroke={isDark ? "lightskyblue" : "blue"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.75 17.25L14.25 16.7V14.25M9.75 16.25C9.75 16.8409 9.8664 17.4261 10.0925 17.9721C10.3187 18.518 10.6502 19.0141 11.068 19.432C11.4859 19.8498 11.982 20.1813 12.5279 20.4075C13.0739 20.6336 13.6591 20.75 14.25 20.75C14.8409 20.75 15.4261 20.6336 15.9721 20.4075C16.518 20.1813 17.0141 19.8498 17.432 19.432C17.8498 19.0141 18.1813 18.518 18.4075 17.9721C18.6336 17.4261 18.75 16.8409 18.75 16.25C18.75 15.0565 18.2759 13.9119 17.432 13.068C16.5881 12.2241 15.4435 11.75 14.25 11.75C13.0565 11.75 11.9119 12.2241 11.068 13.068C10.2241 13.9119 9.75 15.0565 9.75 16.25Z"
                      stroke={isDark ? "lightskyblue" : "blue"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {item.code}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(item.transaction_at)} *{" "}
                    {new Date(item.transaction_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center justify-end gap-2 m">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.status.toLowerCase()} {"-"}
                </p>
                <p className={`font-semibold text-blue-600 dark:text-blue-400`}>
                  {/* {item.type === "income" ? "+" : "-"}Rp{" "} */}
                  {formatCurrency(item?.amount)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }, [accumulatedData, loading, error, isDark]);

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
      {/* <div className="flex gap-2 mb-6">
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
      </div> */}

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
      {accumulatedData.length > 0 &&
        accumulatedData.length < totalData &&
        !loading &&
        !error && (
          <LoadMoreButton
            data={accumulatedData}
            totalData={totalData}
            loading={loading}
            handleLoadMore={handleLoadMore}
          />
        )}
    </div>
  );
}
