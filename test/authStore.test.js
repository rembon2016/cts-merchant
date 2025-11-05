import {
  describe,
  expect,
  it,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import {
  useAuthStore,
  isAuthenticated,
  authStore,
} from "../src/store/authStore.js";

// Mock toast to avoid UI side effects
jest.mock("react-toastify", () => ({
  toast: { warning: jest.fn(), success: jest.fn(), error: jest.fn() },
}));

// sessionStorage keys from authStore.js
const TOKEN_KEY = "authToken";
const EXPIRED_KEY = "authExpireAt";
const TOKEN_POS_KEY = "authPosToken";
const BRANCH_ACTIVE = "branchActive";

const resetStore = () => {
  const initial = useAuthStore.getState();
  useAuthStore.setState(
    {
      ...initial,
      user: null,
      userId: null,
      token: null,
      tokenPos: null,
      activeBranch: null,
      isLoggedIn: false,
      isLoading: false,
      isLogout: false,
      error: null,
      autoLogoutTimer: null,
      checkInterval: null,
      refreshTimer: null,
    },
    true
  );
};

describe("authStore: basics", () => {
  beforeEach(() => {
    sessionStorage.clear();
    resetStore();
    globalThis.fetch.mockReset();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("isAuthenticated() reflects TOKEN presence", () => {
    expect(isAuthenticated()).toBe(false);
    sessionStorage.setItem(TOKEN_KEY, "dummy");
    expect(isAuthenticated()).toBe(true);
  });

  it("setExpiration stores expiry and schedules timers", () => {
    jest.useFakeTimers();
    const future = Date.now() + 6 * 60_000; // 6 minutes
    const spySetup = jest.fn();
    useAuthStore.setState({ setupAutoLogout: spySetup });
    const { setExpiration } = useAuthStore.getState();
    setExpiration(String(future));
    expect(sessionStorage.getItem(EXPIRED_KEY)).toEqual(String(future));
    expect(spySetup).toHaveBeenCalledTimes(1);
  });
});

describe("authStore: timers", () => {
  beforeEach(() => {
    sessionStorage.clear();
    resetStore();
    jest.useFakeTimers();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("setupAutoLogout schedules refresh 5 minutes before expiry and auto logout at expiry", () => {
    const now = Date.now();
    const future = now + 6 * 60_000; // 6 minutes
    sessionStorage.setItem(EXPIRED_KEY, String(future));

    const refreshSpy = jest.fn();
    const autoLogoutSpy = jest.fn();
    useAuthStore.setState({
      refreshToken: refreshSpy,
      handleAutoLogout: autoLogoutSpy,
    });

    const { setupAutoLogout } = useAuthStore.getState();
    setupAutoLogout();

    // Advance 61 seconds (refresh should trigger at 1 minute before expiry)
    jest.advanceTimersByTime(61_000);
    expect(refreshSpy).toHaveBeenCalled();

    // Advance to expiry
    const msToExpiry = future - Date.now();
    jest.advanceTimersByTime(msToExpiry + 20);
    expect(autoLogoutSpy).toHaveBeenCalled();

    // Clear timers
    const { clearAutoLogoutTimer } = useAuthStore.getState();
    clearAutoLogoutTimer();
    const state = useAuthStore.getState();
    expect(state.autoLogoutTimer).toBeNull();
    expect(state.checkInterval).toBeNull();
    expect(state.refreshTimer).toBeNull();
  });
});

describe("authStore: refreshToken", () => {
  beforeEach(() => {
    sessionStorage.clear();
    resetStore();
    global.fetch.mockReset();
    jest.useFakeTimers();
  });

  it("refreshToken updates tokens and reschedules timers", async () => {
    sessionStorage.setItem(TOKEN_KEY, "old-token");

    // Mock refresh endpoint
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "new-token",
        expires_in: 10,
        pos: { token: "pos-new" },
      }),
    });

    const spySetup = jest.fn();
    useAuthStore.setState({ setupAutoLogout: spySetup });

    const { refreshToken } = useAuthStore.getState();
    const res = await refreshToken();

    expect(res.success).toBe(true);
    expect(sessionStorage.getItem(TOKEN_KEY)).toEqual("new-token");
    expect(sessionStorage.getItem(EXPIRED_KEY)).toBeTruthy();
    expect(sessionStorage.getItem(TOKEN_POS_KEY)).toEqual("pos-new");
    expect(spySetup).toHaveBeenCalled();
    expect(useAuthStore.getState().token).toEqual("new-token");
    expect(useAuthStore.getState().tokenPos).toEqual("pos-new");
  });

  it("refreshToken handles failure by auto logout", async () => {
    sessionStorage.setItem(TOKEN_KEY, "old-token");
    const handleSpy = jest.fn();
    useAuthStore.setState({ handleAutoLogout: handleSpy });

    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "bad" }),
    });

    const { refreshToken } = useAuthStore.getState();
    const res = await refreshToken();
    expect(res.success).toBe(false);
    expect(handleSpy).toHaveBeenCalled();
  });
});

describe("authStore: login/register/logout/user", () => {
  beforeEach(() => {
    sessionStorage.clear();
    resetStore();
    global.fetch.mockReset();
  });

  it("login sets state and sessionStorage, then schedules auto-logout", async () => {
    // 1) token issuance
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "token-x",
        expires_in: 600,
        pos: { token: "pos-x", branches: [{ id: 77 }] },
      }),
    });
    // 2) getUser
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { id: 42, name: "Tester" } }),
    });

    const spySetup = jest.fn();
    useAuthStore.setState({ setupAutoLogout: spySetup });

    const { login } = useAuthStore.getState();
    const res = await login({ username: "u", password: "p" });
    expect(res.success).toBe(true);
    expect(useAuthStore.getState().isLoggedIn).toBe(true);
    expect(sessionStorage.getItem(TOKEN_KEY)).toEqual("token-x");
    expect(sessionStorage.getItem(TOKEN_POS_KEY)).toEqual("pos-x");
    expect(sessionStorage.getItem(BRANCH_ACTIVE)).toEqual("77");
    expect(spySetup).toHaveBeenCalled();
  });

  it("register sets state and sessionStorage, then schedules auto-logout", async () => {
    // 1) register response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          soundbox: { auth: { access_token: "token-y", expires_in: 600 } },
          pos: {
            auth: { token: "pos-y", branches: [{ pivot: { branch_id: 88 } }] },
          },
        },
      }),
    });
    // 2) getUser
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { id: 99, name: "RegUser" } }),
    });

    const spySetup = jest.fn();
    useAuthStore.setState({ setupAutoLogout: spySetup });

    const { register } = useAuthStore.getState();
    const res = await register({ username: "u", password: "p" });
    expect(res.success).toBe(true);
    expect(useAuthStore.getState().isLoggedIn).toBe(true);
    expect(sessionStorage.getItem(TOKEN_KEY)).toEqual("token-y");
    expect(sessionStorage.getItem(TOKEN_POS_KEY)).toEqual("pos-y");
    expect(sessionStorage.getItem(BRANCH_ACTIVE)).toEqual("88");
    expect(spySetup).toHaveBeenCalled();
  });

  it("getUser returns data from API", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { id: 1 } }),
    });
    const res = await useAuthStore.getState().getUser("t");
    expect(res).toEqual({ data: { id: 1 } });
  });

  it("logout clears state and flags isLogout", async () => {
    jest.useFakeTimers();
    // Set a token in store
    useAuthStore.setState({ token: "abc" });
    // Mock revoke
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    // Stub clearSession and user data store interaction
    const clearSessionSpy = jest.fn();
    useAuthStore.setState({ clearSession: clearSessionSpy });

    const { logout } = useAuthStore.getState();
    const res = await logout();
    expect(res.success).toBe(true);
    expect(useAuthStore.getState().isLoggedIn).toBe(false);
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().isLogout).toBe(true);
    // isLogout resets after 3s
    jest.advanceTimersByTime(3000);
    expect(useAuthStore.getState().isLogout).toBe(false);
  });
});

describe("authStore: handleAutoLogout and clearSession", () => {
  beforeEach(() => {
    sessionStorage.setItem(TOKEN_KEY, "t");
    sessionStorage.setItem(EXPIRED_KEY, String(Date.now() + 1000));
    sessionStorage.setItem(TOKEN_POS_KEY, "pos");
    sessionStorage.setItem(BRANCH_ACTIVE, "1");
    resetStore();
    jest.useFakeTimers();
  });

  it("handleAutoLogout clears timers, session and resets state", async () => {
    const spyClearTimers = jest.fn();
    const spyClearSession = jest.fn();
    useAuthStore.setState({
      clearAutoLogoutTimer: spyClearTimers,
      clearSession: spyClearSession,
    });

    await useAuthStore.getState().handleAutoLogout();

    expect(spyClearTimers).toHaveBeenCalled();
    expect(spyClearSession).toHaveBeenCalled();
    const st = useAuthStore.getState();
    expect(st.isLoggedIn).toBe(false);
    expect(st.token).toBeNull();
    expect(st.tokenPos).toBeNull();
    expect(st.isLogout).toBe(true);

    // isLogout resets after 3s
    jest.advanceTimersByTime(3000);
    expect(useAuthStore.getState().isLogout).toBe(false);
  });
});

describe("authStore: util export", () => {
  it("authStore() triggers refreshToken", async () => {
    const spyRefresh = jest.fn(async () => ({ success: true }));
    useAuthStore.setState({ refreshToken: spyRefresh });
    const res = await authStore();
    expect(spyRefresh).toHaveBeenCalled();
    expect(res).toEqual({ success: true });
  });
});
