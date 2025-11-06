import { create } from "zustand";
import CryptoJS from "crypto-js";

// Zustand Store
const useTokenStore = create((set) => ({
  token: "",
  loading: false,
  error: null,
  refreshIntervalId: null,
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearToken: () => set({ token: "", error: null }),
  setRefreshIntervalId: (id) => set({ refreshIntervalId: id }),
  clearRefreshInterval: () => set({ refreshIntervalId: null }),
}));

// Custom Hook: useGenerateToken
function useGenerateToken() {
  const { token, loading, error, setToken, setLoading, setError, clearToken } =
    useTokenStore();
  const { refreshIntervalId, setRefreshIntervalId, clearRefreshInterval } =
    useTokenStore();

  const USER_ID = sessionStorage.getItem("userId");

  const generateToken = () => {
    setLoading(true);
    setError(null);

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const payload = `${USER_ID}:${timestamp}:${
        import.meta.env.VITE_APP_SALT
      }`;

      // Generate HMAC-SHA256 signature
      const signature = CryptoJS.HmacSHA256(
        payload,
        import.meta.env.VITE_APP_SECRET
      ).toString(CryptoJS.enc.Hex);

      // Create full payload with signature
      const fullPayload = `${payload}:${signature}`;

      // Base64 encode
      const base64Token = btoa(fullPayload);

      // URL-safe base64 (replace +/ with -_ and remove =)
      const urlSafeToken = base64Token
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");

      setToken(urlSafeToken);
      return urlSafeToken;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    token,
    loading,
    error,
    generateToken,
    clearToken,
    startAutoRefresh: (intervalSeconds = 3500) => {
      try {
        // Clear existing interval if any
        if (refreshIntervalId) {
          clearInterval(refreshIntervalId);
        }
        // Generate immediately, then schedule next regenerations
        generateToken();
        const ms = Number(intervalSeconds) * 1000;
        const id = setInterval(() => {
          try {
            generateToken();
          } catch (_) {}
        }, ms);
        setRefreshIntervalId(id);
        return id;
      } catch (e) {
        setError(e?.message || "Failed to start token auto refresh");
        return null;
      }
    },
    stopAutoRefresh: () => {
      try {
        if (refreshIntervalId) {
          clearInterval(refreshIntervalId);
        }
        clearRefreshInterval();
      } catch (_) {}
    },
  };
}

export { useTokenStore, useGenerateToken };
