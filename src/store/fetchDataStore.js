import { create } from "zustand";

const cache = new Map();
const TIMEOUT_DURATION = 10000; // 10 seconds timeout

const useFetchDataStore = create((set, get) => ({
  data: null,
  loading: false,
  error: null,
  success: null,
  abortController: null,
  isFetching: false,
  totalData: null,
  response: null,

  resetStore: () => {
    set({
      data: null,
      loading: false,
      error: null,
      abortController: null,
      isFetching: false,
    });
  },

  fetchData: async (url, options = {}, storeOptions = {}) => {
    const state = get();

    // If already fetching, don't start another fetch
    if (state.isFetching) return;

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

      // Ensure requests use CORS mode by default and provide helpful headers.
      // Note: This does not bypass server-side CORS restrictions — the backend
      // must allow the requesting origin. If you still see CORS errors, add a
      // dev proxy in vite.config.js or enable CORS on the backend (examples
      // provided in the repo docs or below).
      const response = await fetch(url, {
        mode: options.mode || "cors",
        credentials: options.credentials || "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type":
            options.headers?.["Content-Type"] || "application/json",
          ...(options.headers || {}),
        },
        ...options,
        signal: newAbortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        set({ error: `HTTP error! status: ${response.status}` });
        setTimeout(() => {
          set({ error: null });
        }, 2000);
        console.error(response);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (
        response?.code === 200 ||
        response?.status === 200 ||
        response?.ok ||
        response?.success
      ) {
        set({ success: true });
        setTimeout(() => {
          set({ success: false });
        }, 2000);
      }

      const result = await response.json();

      set({ response: result });

      // If storeOptions contains data, use that instead of the response
      const dataToStore = storeOptions.data || result?.data;

      const allDataCount = result?.data?.pagination?.total || null;
      if (allDataCount !== null) {
        set({ totalData: allDataCount });
      }

      // Store in cache
      cache.set(cacheKey, {
        data: dataToStore,
        timestamp: Date.now(),
        totalData: allDataCount,
      });

      set({ data: dataToStore });
    } catch (err) {
      // Distinguish common network / CORS errors
      if (err.name === "AbortError") {
        set({ error: "Request timed out after 10 seconds" });
      } else if (
        err instanceof TypeError &&
        (err.message === "Failed to fetch" ||
          err.message === "NetworkError when attempting to fetch resource.")
      ) {
        // Likely a network error or blocked by CORS
        set({
          error:
            "Network error or cross-origin request blocked (CORS). Check backend CORS headers or configure a dev proxy.",
        });
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
