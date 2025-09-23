import { create } from "zustand";
import { useUserDataStore } from "./userDataStore";

const SESSION_KEY = "authUser";
const TOKEN_KEY = "authToken";

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null,
  token: sessionStorage.getItem(TOKEN_KEY) || null,
  isLoggedIn: !!sessionStorage.getItem(TOKEN_KEY),
  isLoading: false,
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const getUserResponse = await fetch(
        `${import.meta.env.VITE_API_ROUTES}/v1/user`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.access_token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const userData = await getUserResponse.json();

      sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData.data));
      sessionStorage.setItem(TOKEN_KEY, data.access_token);

      const { setUserData } = useUserDataStore.getState();
      setUserData(userData.data);

      set({
        user: userData?.data,
        token: data?.access_token,
        isLoggedIn: true,
        error: null,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      const token = get().token;

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

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(TOKEN_KEY);

      const { setUserData } = useUserDataStore.getState();
      setUserData({});

      set({
        user: null,
        token: null,
        isLoggedIn: false,
        error: null,
        isLoading: false,
      });

      return { success: true };
    } catch (error) {
      set({
        error: error,
        isLoading: false,
      });
      return { success: false, error: error.message };
    }
  },
}));

// Helper for checking auth status outside React
export const isAuthenticated = () => !!sessionStorage.getItem(TOKEN_KEY);
