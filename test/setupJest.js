import { jest, afterEach } from '@jest/globals';

// Mock fetch by default to avoid accidental network calls in tests
global.fetch = jest.fn();

// Ensure fake timers can be used in tests that need them
afterEach(() => {
  try {
    jest.runOnlyPendingTimers();
  } catch (_) {
    // ignore if no timers pending
  }
  jest.useRealTimers();
});
