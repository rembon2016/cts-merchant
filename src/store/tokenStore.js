import { create } from "zustand";
import CryptoJS from "crypto-js";

// Zustand Store
const useTokenStore = create((set) => ({
  token: "",
  loading: false,
  error: null,
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearToken: () => set({ token: "", error: null }),
}));

// Custom Hook: useGenerateToken
function useGenerateToken() {
  const { token, loading, error, setToken, setLoading, setError, clearToken } =
    useTokenStore();

  const generateToken = (value) => {
    setLoading(true);
    setError(null);

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const payload = `${value}:${timestamp}:${import.meta.env.VITE_APP_SALT}`;

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

  // console.log("Testing: ", generateToken("13"));

  return {
    token,
    loading,
    error,
    generateToken,
    clearToken,
  };
}

export { useTokenStore, useGenerateToken };
