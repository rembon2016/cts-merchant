import { create } from "zustand";
import { useUserDataStore } from "./userDataStore";

// custom hooks for checking authentication
const TOKEN_KEY = "authToken";
const SESSION_KEY = "authUser";
const EXPIRED_KEY = "authExpireAt";
const TOKEN_POS_KEY = "authPosToken";
const BRANCH_ACTIVE = "branchActive";

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null,
  token: sessionStorage.getItem(TOKEN_KEY) || null,
  isLoggedIn: !!sessionStorage.getItem(TOKEN_KEY),
  isLoading: false,
  isLogout: false,
  error: null,

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(
        `${import.meta.env.VITE_API_ROUTES}/v1/auth/token/user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const result = await response.json();

      if (!response?.ok) {
        set({ error: result?.message, isLoading: false });
        throw new Error(result?.message || "Login failed");
      }

      const TOKEN = result?.access_token;
      const EXPIRED_IN = result?.expires_in;

      const userData = await get().getUser(TOKEN);

      // Hitung timestamp expiry (expires_in biasanya dalam detik)
      const expiryTimestamp = Date.now() + EXPIRED_IN * 1000;

      sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData?.data));
      sessionStorage.setItem(TOKEN_KEY, TOKEN);
      sessionStorage.setItem(EXPIRED_KEY, expiryTimestamp.toString());
      if (result?.pos) {
        const TOKEN_POS = result?.pos?.token;
        const BRANCH = result?.pos?.branches?.[0]?.id;
        sessionStorage.setItem(TOKEN_POS_KEY, TOKEN_POS);
        sessionStorage.setItem(BRANCH_ACTIVE, BRANCH);
      }
      const { setUserData } = useUserDataStore.getState();
      setUserData(userData?.data);

      set({
        user: userData?.data,
        token: TOKEN,
        isLoggedIn: true,
        isLoading: false,
        isLogout: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      set({
        error: error?.message,
        isLoading: false,
        isLogout: false,
      });
      return { success: false, error: error.message };
    }
  },

  register: async (formData) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(
        `${import.meta.env.VITE_API_ROUTES}/v1/user/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response?.json();

      if (!response.ok) {
        set({ error: result?.message, isLoading: false });
        throw new Error(result?.message || "Registration failed");
      }

      const TOKEN = result?.data?.soundbox?.auth?.access_token;
      const EXPIRED_IN = result?.data?.soundbox?.auth?.expires_in;

      const userData = await get().getUser(TOKEN);

      // Hitung timestamp expiry (expires_in biasanya dalam detik)
      const expiryTimestamp = Date.now() + EXPIRED_IN * 1000;

      sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData?.data));
      sessionStorage.setItem(TOKEN_KEY, TOKEN);
      sessionStorage.setItem(EXPIRED_KEY, expiryTimestamp.toString());
      if (result?.data?.pos) {
        const TOKEN_POS = result?.data?.pos?.auth?.token;
        const BRANCH = result?.data?.pos?.auth?.branches?.[0]?.pivot?.branch_id;
        sessionStorage.setItem(TOKEN_POS_KEY, TOKEN_POS);
        sessionStorage.setItem(BRANCH_ACTIVE, BRANCH);
      }

      const { setUserData } = useUserDataStore.getState();
      setUserData(userData.data);

      set({
        user: userData?.data,
        token: TOKEN,
        isLoggedIn: true,
        isLoading: false,
        isLogout: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      set({
        error: error?.message,
        isLoading: false,
        isLoggedIn: false,
      });
      return { success: false, error: error?.message };
    }
  },

  getUser: async (tokenParams) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ROUTES}/v1/user`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenParams}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return await response.json();
    } catch (error) {
      return error;
    }
  },

  // Fungsi untuk mengecek apakah token sudah expired
  checkTokenExpiry: () => {
    const expireTime = sessionStorage.getItem(EXPIRED_KEY);

    if (!expireTime) {
      return false;
    }

    const currentTime = Date.now();
    const expiryTimestamp = parseInt(expireTime, 10);

    // Jika waktu sekarang sudah melewati waktu expire
    if (currentTime >= expiryTimestamp) {
      return true;
    }

    return false;
  },

  // Fungsi untuk memulai auto logout checker
  startAutoLogoutTimer: () => {
    const expireTime = sessionStorage.getItem(EXPIRED_KEY);

    if (!expireTime) {
      return;
    }

    const currentTime = Date.now();
    const expiryTimestamp = parseInt(expireTime, 10);
    const timeUntilExpiry = expiryTimestamp - currentTime;

    // Jika sudah expired, logout langsung
    if (timeUntilExpiry <= 0) {
      get().logout();
      return;
    }

    // Set timeout untuk logout otomatis
    const timeoutId = setTimeout(() => {
      get().logout();
    }, timeUntilExpiry);

    // Simpan timeout ID untuk bisa di-clear nanti
    set({ autoLogoutTimerId: timeoutId });
  },

  // Fungsi untuk membersihkan auto logout timer
  clearAutoLogoutTimer: () => {
    const timerId = get().autoLogoutTimerId;
    if (timerId) {
      clearTimeout(timerId);
      set({ autoLogoutTimerId: null });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      const token = get().token;

      // Clear auto logout timer saat logout manual
      get().clearAutoLogoutTimer();

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_ROUTES}/v1/auth/token/revoke`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response?.json();

      if (!response.ok) {
        set({ error: result?.message, isLoading: false });
        throw new Error("Logout failed");
      }

      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(EXPIRED_KEY);
      sessionStorage.removeItem(TOKEN_POS_KEY);
      sessionStorage.removeItem(BRANCH_ACTIVE);

      const { setUserData } = useUserDataStore.getState();
      setUserData({});

      set({
        user: null,
        token: null,
        error: null,
        isLoggedIn: false,
        isLoading: false,
        isLogout: true,
      });

      return { success: true };
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
        isLogout: false,
      });
      return { success: false, error: error.message };
    }
  },
}));

// Helper for checking auth status outside React
export const isAuthenticated = () => !!sessionStorage.getItem(TOKEN_KEY);
