import { create } from "zustand";

// custom hooks for checking authentication
const TOKEN_KEY = "authToken";
const SESSION_KEY = "authUser";
const EXPIRED_KEY = "authExpireAt";
const TOKEN_POS_KEY = "authPosToken";
const BRANCH_ACTIVE = "branchActive";

export const useSessionStore = create((set) => ({
  user: JSON.parse(sessionStorage.getItem(SESSION_KEY)),
  token: sessionStorage.getItem(TOKEN_KEY),
  isLoggedIn: !!sessionStorage.getItem(TOKEN_KEY),
  expiredKey: sessionStorage.getItem(EXPIRED_KEY),
  tokenPos: sessionStorage.getItem(TOKEN_POS_KEY),
  activeBranch: sessionStorage.getItem(BRANCH_ACTIVE),
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setTokenPos: (tokenPos) => set({ tokenPos }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setExpiredKey: (expiredKey) => set({ expiredKey }),
  setActiveBranch: (activeBranch) => set({ activeBranch }),
}));
