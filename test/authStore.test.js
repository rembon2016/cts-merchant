import { describe, expect, it, beforeEach, afterEach, jest } from '@jest/globals';
import { useAuthStore, isAuthenticated } from '../src/store/authStore.js';

// sessionStorage keys from authStore.js
const TOKEN_KEY = 'authToken';
const EXPIRED_KEY = 'authExpireAt';

const resetStore = () => {
  // Snapshot initial state, then reset to a clean baseline
  const initial = useAuthStore.getState();
  useAuthStore.setState({
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
    autoLogoutTimerId: null,
  }, true);
};

describe('authStore basic behavior', () => {
  beforeEach(() => {
    sessionStorage.clear();
    resetStore();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('isAuthenticated() reflects TOKEN presence', () => {
    expect(isAuthenticated()).toBe(false);
    sessionStorage.setItem(TOKEN_KEY, 'dummy');
    expect(isAuthenticated()).toBe(true);
  });

  it('checkTokenExpiry returns false when no expiry set', () => {
    const { checkTokenExpiry } = useAuthStore.getState();
    expect(checkTokenExpiry()).toBe(false);
  });

  it('checkTokenExpiry returns true when expired', () => {
    const past = Date.now() - 1000; // 1s in the past
    sessionStorage.setItem(EXPIRED_KEY, String(past));
    const { checkTokenExpiry } = useAuthStore.getState();
    expect(checkTokenExpiry()).toBe(true);
  });

  it('checkTokenExpiry returns false when not yet expired', () => {
    const future = Date.now() + 60_000; // 1 minute in the future
    sessionStorage.setItem(EXPIRED_KEY, String(future));
    const { checkTokenExpiry } = useAuthStore.getState();
    expect(checkTokenExpiry()).toBe(false);
  });
});

describe('auto logout timer', () => {
  beforeEach(() => {
    sessionStorage.clear();
    resetStore();
    jest.useFakeTimers();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('startAutoLogoutTimer schedules logout at expiry time', () => {
    const futureMs = 1500; // 1.5s
    const future = Date.now() + futureMs;
    sessionStorage.setItem(EXPIRED_KEY, String(future));

    const store = useAuthStore.getState();
    const mockLogout = jest.fn();

    // override logout to avoid network calls
    useAuthStore.setState({ logout: mockLogout });

    store.startAutoLogoutTimer();

    const { autoLogoutTimerId } = useAuthStore.getState();
    expect(autoLogoutTimerId).toBeTruthy();

    // advance to trigger timer
    jest.advanceTimersByTime(futureMs + 10);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('clearAutoLogoutTimer clears pending timer', () => {
    const futureMs = 5000;
    const future = Date.now() + futureMs;
    sessionStorage.setItem(EXPIRED_KEY, String(future));

    const store = useAuthStore.getState();
    const mockLogout = jest.fn();
    useAuthStore.setState({ logout: mockLogout });

    store.startAutoLogoutTimer();
    expect(useAuthStore.getState().autoLogoutTimerId).toBeTruthy();

    store.clearAutoLogoutTimer();
    expect(useAuthStore.getState().autoLogoutTimerId).toBeNull();

    // advance timers; logout should not be called
    jest.advanceTimersByTime(futureMs + 50);
    expect(mockLogout).not.toHaveBeenCalled();
  });
});

