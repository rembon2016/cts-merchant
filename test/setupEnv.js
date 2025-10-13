// Lightweight environment polyfills executed before test framework

// sessionStorage polyfill for modules that read at import time
if (typeof global.sessionStorage === 'undefined') {
  const store = new Map();
  global.sessionStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

// Minimal import.meta.env stub for code paths that expect it
if (!globalThis.import?.meta) {
  globalThis.import = { meta: { env: {} } };
}

