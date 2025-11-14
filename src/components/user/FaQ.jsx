import { useEffect, useMemo, useReducer, useState } from "react";
import useFetchDataStore from "../../store/fetchDataStore";
import { useDebounce } from "../../hooks/useDebounce";
import SearchInput from "../customs/form/SearchInput";
import LoadMoreButton from "../customs/button/LoadMoreButton";
import CustomLoading from "../customs/loading/CustomLoading";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSkeletonList from "../customs/loading/LoadingSkeletonList";

const ROOT_API = import.meta.env.VITE_API_ROUTES;

// Define action types
const TOGGLE_INDEX = "TOGGLE_INDEX";
const SET_SEARCH_QUERY = "SET_SEARCH_QUERY";

// Define action types
const SET_PAGE = "SET_PAGE";

// Initial state
const initialState = {
  openIndex: null,
  searchQuery: "",
  currentPage: 1,
};

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case TOGGLE_INDEX:
      return {
        ...state,
        openIndex: state.openIndex === action.payload ? null : action.payload,
      };
    case SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
        currentPage: 1, // Reset page when searching
      };
    case SET_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };
    default:
      return state;
  }
}

export default function FaQ() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data, totalData, loading, error, fetchData } = useFetchDataStore();
  const [accumulatedData, setAccumulatedData] = useState([]);

  const toggleIndex = (idx) => dispatch({ type: TOGGLE_INDEX, payload: idx });

  // Debounce search query with 500ms delay
  const debouncedSearch = useDebounce(state.searchQuery, 500);

  const navigate = useNavigate();

  const headersApi = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
  };

  // Effect untuk mengelola accumulated data ketika data berubah
  useEffect(() => {
    if (data?.faqs) {
      if (state.currentPage > 1) {
        setAccumulatedData((prev) => [...prev, ...data.faqs]);
      } else {
        setAccumulatedData(data.faqs);
      }
    }
  }, [data]);

  // Function to fetch data
  const fetchFaqs = (page = 1) => {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      per_page: "10",
      ...(debouncedSearch && { search: debouncedSearch }),
    });

    fetchData(`${ROOT_API}/v1/merchant/faq?${searchParams.toString()}`, {
      method: "GET",
      headers: headersApi,
    });
  };

  // Fetch data when component mounts or when search changes
  useEffect(() => {
    fetchFaqs(1);
  }, [debouncedSearch]);

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = state.currentPage + 1;
    dispatch({ type: SET_PAGE, payload: nextPage });
    fetchFaqs(nextPage);
  };

  const renderElement = useMemo(() => {
    if (loading) {
      return <LoadingSkeletonList items={accumulatedData.length} />;
    }
    if (error) {
      return <div className="text-center text-red-500">Error: {error}</div>;
    }
    if (!accumulatedData.length) {
      return (
        <div className="flex flex-col items-center text-center py-4">
          <XCircle className="w-16 h-16 mb-2 text-gray-400" />
          <div className="flex gap-2">
            {state.searchQuery ? (
              <div className="flex flex-col items-center gap-2">
                FAQ tidak ditemukan{" "}
                <button
                  className="bg-gray-200 px-4 py-2 rounded-md"
                  onClick={() =>
                    navigate("/customer-support", { replace: true })
                  }
                >
                  Hubungi Customer Support
                </button>
              </div>
            ) : (
              "FAQ tidak tersedia."
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {accumulatedData.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="bg-white rounded-2xl shadow"
          >
            <button
              className="w-full flex justify-between items-center p-4 focus:outline-none"
              onClick={() => toggleIndex(idx)}
            >
              <span className="font-semibold text-start">{item.question}</span>
              <span>
                {state.openIndex === idx ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M6 15l6-6 6 6"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                )}
              </span>
            </button>
            {state.openIndex === idx && (
              <div className="px-4 pb-4">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    );
  }, [accumulatedData, loading, error, state.openIndex]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Butuh Bantuan?</h1>
      <div className="mb-6">
        <SearchInput
          value={state.searchQuery}
          onChange={(value) =>
            dispatch({ type: SET_SEARCH_QUERY, payload: value })
          }
          placeholder="Cari pertanyaan..."
        />
      </div>
      {renderElement}
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
