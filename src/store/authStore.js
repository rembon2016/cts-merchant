import { create } from "zustand";
import { useUserDataStore } from "./userDataStore";

// custom hooks for checking authentication
const TAX = "tax";
const CART = "cart";
const USER_ID = "userId";
const USER_POS_ID = "userPosId";
const DISCOUNT = "discount";
const TOKEN_KEY = "authToken";
const SESSION_KEY = "authUser";
const EXPIRED_KEY = "authExpireAt";
const EXPIRED_TOKEN_KEY = "tokenExpireAt";
const TOKEN_POS_KEY = "authPosToken";
const BRANCH_ACTIVE = "branchActive";
const TOTAL_PAYMENT = "totalPayment";
const CART_ITEM_ID = "cartItemId";
const ROOT_API = import.meta.env?.VITE_API_ROUTES;
const ROOT_API_POS = import.meta.env?.VITE_API_POS_ROUTES;

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(sessionStorage.getItem(SESSION_KEY)),
  userId: JSON.parse(sessionStorage.getItem(USER_ID)),
  token: sessionStorage.getItem(TOKEN_KEY),
  tokenPos: sessionStorage.getItem(TOKEN_POS_KEY),
  activeBranch: sessionStorage.getItem(BRANCH_ACTIVE),
  isLoggedIn: !!sessionStorage.getItem(TOKEN_KEY),
  isLoading: false,
  isLogout: false,
  error: null,
  autoLogoutTimer: null,
  checkInterval: null,
  refreshTimer: null,

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });

      const apiProperties = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
      };

      const [response, responseApiPOS] = await Promise.all([
        fetch(`${ROOT_API}/v1/auth/token/user`, {
          ...apiProperties,
        }),
        fetch(`${ROOT_API_POS}/auth/login`, {
          ...apiProperties,
        }),
      ]);

      const result = await response.json();
      const resultPOS = await responseApiPOS.json();

      if (!response?.ok) {
        const Response401 = response.status === 401;
        set({
          error: Response401 ? "Username atau password salah" : result?.message,
          isLoading: false,
        });
        throw new Error(
          Response401
            ? "Username atau password salah"
            : result?.message || "Login failed"
        );
      }

      const TOKEN = result?.access_token;
      const EXPIRED_IN = result?.expires_in;

      const userData = await get().getUser(TOKEN);

      // Hitung timestamp expiry (expires_in biasanya dalam detik)
      const expiryTimestamp = Date.now() + EXPIRED_IN * 1000;
      const calculateTImeRefresh =
        import.meta.env.VITE_REFRESH_USER_TOKEN_TIMER * 1000;

      sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData?.data));
      sessionStorage.setItem(USER_ID, result?.data?.id);
      sessionStorage.setItem(USER_POS_ID, resultPOS?.data?.user?.id);
      sessionStorage.setItem(TOKEN_KEY, TOKEN);
      sessionStorage.setItem(EXPIRED_KEY, expiryTimestamp.toString());
      sessionStorage.setItem(TOKEN_POS_KEY, result?.pos?.token);
      sessionStorage.setItem(BRANCH_ACTIVE, result?.pos?.branches?.[0]?.id);
      sessionStorage.setItem(EXPIRED_TOKEN_KEY, calculateTImeRefresh);
      const { setUserData } = useUserDataStore.getState();
      setUserData(userData?.data);

      set({
        user: userData?.data,
        userId: userData?.id,
        token: TOKEN,
        isLoggedIn: true,
        isLoading: false,
        isLogout: false,
        error: null,
      });

      // Mulai penjadwalan auto-refresh dan auto-logout berdasarkan expiry
      get().setupAutoLogout();

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

      const response = await fetch(`${ROOT_API}/v1/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

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
      const calculateTImeRefresh =
        import.meta.env.VITE_REFRESH_USER_TOKEN_TIMER * 1000;

      sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData?.data));
      sessionStorage.setItem(USER_ID, JSON.stringify(userData?.data?.id));
      sessionStorage.setItem(TOKEN_KEY, TOKEN);
      sessionStorage.setItem(EXPIRED_KEY, expiryTimestamp.toString());
      sessionStorage.setItem(EXPIRED_TOKEN_KEY, calculateTImeRefresh);
      sessionStorage.setItem(TOKEN_POS_KEY, result?.data?.pos?.auth?.token);
      sessionStorage.setItem(
        BRANCH_ACTIVE,
        result?.data?.pos?.auth?.branches?.[0]?.pivot?.branch_id
      );

      const { setUserData } = useUserDataStore.getState();
      setUserData(userData.data);

      set({
        user: userData?.data,
        userId: userData?.id,
        token: TOKEN,
        isLoggedIn: true,
        isLoading: false,
        isLogout: false,
        error: null,
      });

      // Mulai penjadwalan auto-refresh dan auto-logout berdasarkan expiry
      get().setupAutoLogout();

      return { success: true, isLoading: false };
    } catch (error) {
      set({
        error: error?.message,
        isLoading: false,
        isLoggedIn: false,
      });
      return { success: false, error: error?.message, isLoading: false };
    }
  },

  getUser: async (tokenParams) => {
    try {
      const response = await fetch(`${ROOT_API}/v1/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenParams}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return await response.json();
    } catch (error) {
      return error;
    }
  },

  // clear session storage
  clearSession: () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(USER_ID);
    sessionStorage.removeItem(USER_POS_ID);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXPIRED_KEY);
    sessionStorage.removeItem(EXPIRED_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_POS_KEY);
    sessionStorage.removeItem(BRANCH_ACTIVE);
    sessionStorage.removeItem(CART);
    sessionStorage.removeItem(TAX);
    sessionStorage.removeItem(DISCOUNT);
    sessionStorage.removeItem(TOTAL_PAYMENT);
    sessionStorage.removeItem(CART_ITEM_ID);
  },

  // Setup auto logout
  setupAutoLogout: () => {
    const expiredAt = sessionStorage.getItem(EXPIRED_KEY);
    const tokenExpiredAt = sessionStorage.getItem(EXPIRED_TOKEN_KEY);

    if (!expiredAt) {
      console.warn("No expiration time found");
      return;
    }

    const expiredTimestamp = Number.parseInt(expiredAt, 10);
    const currentTime = Date.now();
    const timeUntilExpiry = expiredTimestamp - currentTime;
    const FIVE_MINUTES = 5 * 60 * 1000;
    const timeUntilRefresh = timeUntilExpiry - FIVE_MINUTES;

    // Clear existing timers
    get().clearAutoLogoutTimer();

    // Jika sudah expired, coba refresh token terlebih dahulu
    if (tokenExpiredAt <= 0) {
      get().refreshToken();
      return;
    }

    // Jika waktu menuju refresh sudah lewat atau tepat, lakukan refresh segera
    if (timeUntilRefresh <= 0) {
      get().refreshToken();
    } else {
      const refreshTimer = setTimeout(() => {
        get().refreshToken();
      }, timeUntilRefresh);
      set({ refreshTimer });
    }

    // Set timeout untuk auto logout
    const timer = setTimeout(() => get().handleAutoLogout(), timeUntilExpiry);
    const tokenExpireAt = sessionStorage.getItem(EXPIRED_TOKEN_KEY);

    // Set interval untuk check setiap detik (sebagai backup)
    const interval = setInterval(() => {
      const now = Date.now();
      const expired = Number.parseInt(tokenExpireAt, 10);
      // Backup trigger: refresh 5 menit sebelum expired
      if (now >= expired) {
        get().refreshToken();
      }
    }, tokenExpiredAt);

    set({ autoLogoutTimer: timer, checkInterval: interval });
  },

  // Clear auto logout timer
  clearAutoLogoutTimer: () => {
    const { autoLogoutTimer, checkInterval, refreshTimer } = get();

    if (autoLogoutTimer) {
      clearTimeout(autoLogoutTimer);
    }
    if (checkInterval) {
      clearInterval(checkInterval);
    }
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }

    set({ autoLogoutTimer: null, checkInterval: null, refreshTimer: null });
  },

  // Handle auto logout (tanpa API call)
  handleAutoLogout: async () => {
    // Clear timers
    get().clearAutoLogoutTimer();
    get().clearSession();
    get().logout();
    get().clearSession();

    // Clear user data store
    const { setUserData } = useUserDataStore.getState();
    setUserData({});

    // Update state
    set({
      user: null,
      userId: null,
      token: null,
      tokenPos: null,
      activeBranch: null,
      error: null,
      isLoggedIn: false,
      isLoading: false,
      isLogout: true,
    });

    // Reset isLogout setelah 3 detik
    setTimeout(() => {
      set({ isLogout: false });
    }, 3000);
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      const token = sessionStorage.getItem(TOKEN_KEY);
      const tokenPos = sessionStorage.getItem(TOKEN_POS_KEY);

      // Clear auto logout timer saat logout manual
      get().clearAutoLogoutTimer();

      if (!token) {
        throw new Error("No authentication token found");
      }
      if (!tokenPos) {
        throw new Error("No authentication token POS found");
      }

      const [response, responseApiPOS] = await Promise.all([
        fetch(`${ROOT_API}/v1/auth/token/revoke`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }),
        fetch(`${ROOT_API_POS}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenPos}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }),
      ]);

      const result = await response?.json();

      if (!response.ok || !responseApiPOS.ok) {
        set({ error: result?.message, isLoading: false });
        throw new Error("Logout failed");
      }

      get().clearSession();

      const { setUserData } = useUserDataStore.getState();
      setUserData({});

      set({
        user: null,
        userId: null,
        token: null,
        tokenPos: null,
        error: null,
        isLoggedIn: false,
        isLoading: false,
        isLogout: true,
      });

      if (response.ok && responseApiPOS.ok) {
        setTimeout(() => {
          set({ isLogout: false });
        }, 3000);
        return () => clearTimeout();
      }

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

  setExpiration: (expireTimestamp) => {
    sessionStorage.setItem(EXPIRED_KEY, expireTimestamp);
    get().setupAutoLogout();
  },

  // Refresh token ketika sesi habis
  refreshToken: async () => {
    if (get()?.isLogout) return;

    try {
      const currentToken = sessionStorage.getItem(TOKEN_POS_KEY);

      if (!currentToken) {
        throw new Error("No authentication token found");
      }

      set({ isLoading: true, error: null });

      const response = await fetch(`${ROOT_API_POS}/auth/refresh-token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (!response?.ok) {
        set({
          isLoading: false,
          error: result?.message || "Refresh token failed",
        });
        // Jika gagal refresh, lakukan auto logout
        // get().handleAutoLogout();
        return { success: false, error: result?.message, isLoading: false };
      }

      const newPosToken = result?.data?.token || null;

      if (!newPosToken) {
        set({ isLoading: false, error: "Invalid refresh response" });
        get().handleAutoLogout();
        return {
          success: false,
          error: "Invalid refresh response",
          isLoading: false,
        };
      }

      const newExpiry =
        Date.now() +
        Number(import.meta.env.VITE_REFRESH_USER_TOKEN_TIMER) * 1000;

      sessionStorage.setItem(EXPIRED_KEY, newExpiry.toString());
      if (newPosToken) {
        sessionStorage.setItem(TOKEN_POS_KEY, newPosToken);
        set({ tokenPos: newPosToken });
      }

      set({ isLoggedIn: true, isLoading: false, error: null });

      // Reset auto logout timer berdasarkan expiry terbaru
      get().setupAutoLogout();

      // Schedule next refresh in 5 minutes
      const FIVE_MINUTES = 50 * 60 * 1000;
      const nextRefreshTimer = setTimeout(
        () => get().refreshToken(),
        FIVE_MINUTES
      );
      set({ refreshTimer: nextRefreshTimer });

      return { success: true, isLoading: false };
    } catch (error) {
      set({ isLoading: false, error: error?.message });
      // get().handleAutoLogout();
      return { success: false, error: error?.message, isLoading: false };
    }
  },
}));

// Helper for checking auth status outside React
export const isAuthenticated = () => !!sessionStorage.getItem(TOKEN_KEY);

// Ekspor fungsi utilitas untuk memicu refresh token dari luar
export const authStore = async () => {
  const { refreshToken } = useAuthStore.getState();
  return await refreshToken();
};
