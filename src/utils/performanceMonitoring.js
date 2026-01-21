/**
 * Performance Monitoring & Core Web Vitals Tracking
 * Monitors LCP, FID, CLS for production optimization
 */

/**
 * Measure Largest Contentful Paint (LCP)
 * Target: < 2.5 seconds
 */
export const measureLCP = (callback) => {
  if (!("PerformanceObserver" in window)) return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];

    callback({
      name: "LCP",
      value: lastEntry.renderTime || lastEntry.loadTime,
      rating: lastEntry.renderTime < 2500 ? "good" : "poor",
    });
  });

  observer.observe({ entryTypes: ["largest-contentful-paint"] });
};

/**
 * Measure First Input Delay (FID)
 * Target: < 100 ms
 */
export const measureFID = (callback) => {
  if (!("PerformanceObserver" in window)) return;

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      callback({
        name: "FID",
        value: entry.processingDuration,
        rating: entry.processingDuration < 100 ? "good" : "poor",
      });
    });
  });

  observer.observe({ entryTypes: ["first-input"] });
};

/**
 * Measure Cumulative Layout Shift (CLS)
 * Target: < 0.1
 */
export const measureCLS = (callback) => {
  if (!("PerformanceObserver" in window)) return;

  let clsValue = 0;

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        callback({
          name: "CLS",
          value: clsValue,
          rating: clsValue < 0.1 ? "good" : "poor",
        });
      }
    });
  });

  observer.observe({ entryTypes: ["layout-shift"] });
};

/**
 * Measure First Contentful Paint (FCP)
 * Target: < 1.8 seconds
 */
export const measureFCP = (callback) => {
  if (!("PerformanceObserver" in window)) return;

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      callback({
        name: "FCP",
        value: entry.startTime,
        rating: entry.startTime < 1800 ? "good" : "poor",
      });
    });
  });

  observer.observe({ entryTypes: ["paint"] });
};

/**
 * Initialize all Core Web Vitals monitoring
 */
export const initializePerformanceMonitoring = () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("🚀 Performance Monitoring Initialized");
  }

  measureLCP((metric) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `📊 ${metric.name}: ${metric?.value?.toFixed(2)}ms (${metric.rating})`,
      );
    }
  });

  measureFID((metric) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `📊 ${metric.name}: ${metric?.value?.toFixed(2)}ms (${metric.rating})`,
      );
    }
  });

  measureCLS((metric) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `📊 ${metric.name}: ${metric?.value?.toFixed(3)} (${metric.rating})`,
      );
    }
  });

  measureFCP((metric) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `📊 ${metric.name}: ${metric?.value?.toFixed(2)}ms (${metric.rating})`,
      );
    }
  });
};

/**
 * Measure resource timing
 */
export const measureResourceTiming = () => {
  if (!("PerformanceObserver" in window)) return;

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      const duration = entry.responseEnd - entry.fetchStart;
      if (duration > 1000) {
        // Log slow resources (> 1 second)
        console.warn(
          `⚠️ Slow resource: ${entry?.name} (${duration?.toFixed(0)}ms)`,
        );
      }
    });
  });

  observer.observe({ entryTypes: ["resource"] });
};

/**
 * Get navigation timing data
 */
export const getNavigationTiming = () => {
  const nav = performance.getEntriesByType("navigation")[0];
  if (!nav) return null;

  return {
    dnsLookup: nav.domainLookupEnd - nav.domainLookupStart,
    tcpConnection: nav.connectEnd - nav.connectStart,
    timeToFirstByte: nav.responseStart - nav.requestStart,
    domInteractive: nav.domInteractive - nav.fetchStart,
    domComplete: nav.domComplete - nav.fetchStart,
    loadComplete: nav.loadEventEnd - nav.fetchStart,
  };
};

/**
 * Optimize long tasks
 */
export const optimizeLongTasks = () => {
  if ("PerformanceObserver" in globalThis) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.warn(
            `⚠️ Long task detected: ${entry?.duration?.toFixed(0)}ms`,
          );
        });
      });

      observer.observe({ entryTypes: ["longtask"] });
    } catch (e) {
      // longtask might not be available in all browsers
      console.debug("Long task monitoring not available");
    }
  }
};

export default {
  measureLCP,
  measureFID,
  measureCLS,
  measureFCP,
  initializePerformanceMonitoring,
  measureResourceTiming,
  getNavigationTiming,
  optimizeLongTasks,
};
