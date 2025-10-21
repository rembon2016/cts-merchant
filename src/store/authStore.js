import { create } from "zustand";
import { useUserDataStore } from "./userDataStore";

// custom hooks for checking authentication
const TOKEN_KEY = "authToken";
const SESSION_KEY = "authUser";
const EXPIRED_KEY = "authExpireAt";
const TOKEN_POS_KEY = "authPosToken";
const BRANCH_ACTIVE = "branchActive";
const USER_ID = "userId";
const CART = "cart";

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
      sessionStorage.setItem(USER_ID, JSON.stringify(userData?.data?.id));
      sessionStorage.setItem(TOKEN_KEY, TOKEN);
      sessionStorage.setItem(EXPIRED_KEY, expiryTimestamp.toString());
      sessionStorage.setItem(TOKEN_POS_KEY, result?.pos?.token);
      sessionStorage.setItem(BRANCH_ACTIVE, result?.pos?.branches?.[0]?.id);
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
      sessionStorage.setItem(USER_ID, JSON.stringify(userData?.data?.id));
      sessionStorage.setItem(TOKEN_KEY, TOKEN);
      sessionStorage.setItem(EXPIRED_KEY, expiryTimestamp.toString());
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

  // clear session storage
  clearSession: () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(USER_ID);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXPIRED_KEY);
    sessionStorage.removeItem(TOKEN_POS_KEY);
    sessionStorage.removeItem(BRANCH_ACTIVE);
    sessionStorage.removeItem(CART);
  },

  // Setup auto logout
  setupAutoLogout: () => {
    const expiredAt = sessionStorage.getItem(EXPIRED_KEY);

    if (!expiredAt) {
      console.warn("No expiration time found");
      return;
    }

    const expiredTimestamp = Number.parseInt(expiredAt, 10);
    const currentTime = Date.now();
    const timeUntilExpiry = expiredTimestamp - currentTime;

    // Clear existing timers
    get().clearAutoLogoutTimer();

    // Jika sudah expired, logout langsung
    if (timeUntilExpiry <= 0) {
      console.log("Session expired, logging out...");
      get().handleAutoLogout();
      return;
    }

    // Set timeout untuk auto logout
    const timer = setTimeout(() => {
      get().handleAutoLogout();
    }, timeUntilExpiry);

    // Set interval untuk check setiap detik (sebagai backup)
    const interval = setInterval(() => {
      const now = Date.now();
      const expired = Number.parseInt(sessionStorage.getItem(EXPIRED_KEY), 10);

      if (now >= expired) {
        get().handleAutoLogout();
      }
    }, 1000);

    set({ autoLogoutTimer: timer, checkInterval: interval });
  },

  // Clear auto logout timer
  clearAutoLogoutTimer: () => {
    const { autoLogoutTimer, checkInterval } = get();

    if (autoLogoutTimer) {
      clearTimeout(autoLogoutTimer);
    }
    if (checkInterval) {
      clearInterval(checkInterval);
    }

    set({ autoLogoutTimer: null, checkInterval: null });
  },

  // Handle auto logout (tanpa API call)
  handleAutoLogout: async () => {
    // Clear timers
    get().clearAutoLogoutTimer();
    get().clearSession();
    get().logout();

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

    // Optional: Show notification
    alert("Sesi Anda telah berakhir. Silakan login kembali.");
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

      get().clearSession();

      const { setUserData } = useUserDataStore.getState();
      setUserData({});

      set({
        user: null,
        userId: null,
        token: null,
        error: null,
        isLoggedIn: false,
        isLoading: false,
        isLogout: true,
      });

      if (response.ok) {
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
}));

// Helper for checking auth status outside React
export const isAuthenticated = () => !!sessionStorage.getItem(TOKEN_KEY);
