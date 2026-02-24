import { useEffect, useMemo, useReducer, useState } from "react";
import useFetchDataStore from "../../store/fetchDataStore";
import { useDebounce } from "../../hooks/useDebounce";
import SearchInput from "../customs/form/SearchInput";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingSkeletonList from "../customs/loading/LoadingSkeletonList";

// Hide scrollbar CSS
const hideScrollbarStyle = `
  .hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;

const ROOT_API = import.meta.env.VITE_API_ROUTES;

// Categories data - will be populated from API
const getCategoriesFromData = (data) => {
  if (!data?.faqs) return [{ name: "Semua" }];
  return [
    { name: "Semua" },
    ...Object.keys(data.faqs).map((category) => ({ name: category })),
  ];
};

// Define action types
const TOGGLE_INDEX = "TOGGLE_INDEX";
const SET_SEARCH_QUERY = "SET_SEARCH_QUERY";
const SET_PAGE = "SET_PAGE";
const SET_CATEGORY = "SET_CATEGORY";

// Initial state
const initialState = {
  openIndex: null,
  searchQuery: "",
  currentPage: 1,
  selectedCategory: "Semua", // Default to "Semua"
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
    case SET_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload,
        currentPage: 1, // Reset page when changing category
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
  const selectCategory = (categoryName) =>
    dispatch({ type: SET_CATEGORY, payload: categoryName });

  // Debounce search query with 500ms delay
  const debouncedSearch = useDebounce(state.searchQuery, 1000);

  const navigate = useNavigate();

  // Get categories from data
  const categories = useMemo(() => getCategoriesFromData(data), [data]);

  const headersApi = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
  };

  // Effect untuk mengelola accumulated data ketika data berubah
  useEffect(() => {
    if (data?.faqs) {
      // Filter data berdasarkan kategori yang dipilih
      let filteredData = [];
      if (state.selectedCategory === "Semua") {
        // Gabungkan semua kategori
        Object.values(data.faqs).forEach((items) => {
          if (Array.isArray(items)) {
            filteredData = [...filteredData, ...items];
          }
        });
      } else {
        // Filter berdasarkan kategori yang dipilih
        const categoryData = data.faqs[state.selectedCategory];
        filteredData = Array.isArray(categoryData) ? categoryData : [];
      }

      // Filter berdasarkan search query
      if (debouncedSearch) {
        filteredData = filteredData.filter(
          (item) =>
            item.question
              .toLowerCase()
              .includes(debouncedSearch.toLowerCase()) ||
            item.answer.toLowerCase().includes(debouncedSearch.toLowerCase()),
        );
      }

      setAccumulatedData(filteredData);
    }
  }, [data, state.selectedCategory, debouncedSearch]);

  // Function to fetch data
  const fetchFaqs = () => {
    fetchData(`${ROOT_API}/v1/merchant/faq`, {
      method: "GET",
      headers: headersApi,
    });
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchFaqs();
  }, []);

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
            {state.searchQuery || state.selectedCategory !== "Semua" ? (
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
  }, [
    accumulatedData,
    loading,
    error,
    state.openIndex,
    state.selectedCategory,
  ]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <style>{hideScrollbarStyle}</style>
      <h1 className="text-2xl font-bold mb-6">Butuh Bantuan?</h1>

      {/* Category Filter Section */}
      {categories.length > 1 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => selectCategory(category.name)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  state.selectedCategory === category.name
                    ? "bg-[--c-primary] text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

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
    </div>
  );
}
