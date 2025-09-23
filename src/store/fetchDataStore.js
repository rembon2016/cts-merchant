import { create } from "zustand";

const cache = new Map();
const TIMEOUT_DURATION = 10000; // 10 seconds timeout

const useFetchDataStore = create((set, get) => ({
  data: null,
  loading: false,
  error: null,
  abortController: null,
  isFetching: false,

  resetStore: () => {
    set({
      data: null,
      loading: false,
      error: null,
      abortController: null,
      isFetching: false,
    });
  },

  fetchData: async (url, options = {}) => {
    const state = get();

    // If already fetching, don't start another fetch
    if (state.isFetching) {
      return;
    }

    // Check cache first
    const cacheKey = JSON.stringify({ url, options });
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      const { data: cachedResult, timestamp } = cachedData;
      // Cache is valid for 5 minutes
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        set({ data: cachedResult });
        return;
      }
      cache.delete(cacheKey);
    }

    // Set fetching state
    set({ loading: true, error: null, isFetching: true });

    try {
      // Create new AbortController for this request
      if (state.abortController) {
        state.abortController.abort();
      }
      const newAbortController = new AbortController();
      set({ abortController: newAbortController });

      // Set up timeout
      const timeoutId = setTimeout(() => {
        if (newAbortController) {
          newAbortController.abort();
        }
      }, TIMEOUT_DURATION);

      const response = await fetch(url, {
        ...options,
        signal: newAbortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Store in cache
      cache.set(cacheKey, {
        data: result?.data,
        timestamp: Date.now(),
      });

      set({ data: result?.data });
    } catch (err) {
      if (err.name === "AbortError") {
        set({ error: "Request timed out after 10 seconds" });
      } else {
        set({ error: err.message });
      }
    } finally {
      set({
        loading: false,
        isFetching: false,
        abortController: null,
      });
    }
  },
}));

export default useFetchDataStore;
