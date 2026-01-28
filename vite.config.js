import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "CTS Merchant",
        short_name: "CTS Merchant",
        description: "Aplikasi CTS Merchant",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/images/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/images/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/images/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        // Strategi caching
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 tahun
              },
            },
          },
        ],
      },
    }),
    // Gzip compression for production
    mode === "production" &&
      compression({
        verbose: true,
        disable: false,
        threshold: 10240, // Only compress files > 10KB
        algorithm: "gzip",
        ext: ".gz",
        deleteOriginFile: false,
      }),
    // Bundle visualization
    mode === "production" &&
      visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
        filename: "dist/bundle-analysis.html",
      }),
  ].filter(Boolean);

  return {
    plugins,
    server: {
      host: true,
      port: 3000,
      strictPort: true,
      hmr: {
        host: "localhost",
        port: 3000,
      },
      preTransformRequests: ["/src/main.jsx"],
      middlewareMode: false,
    },
    build: {
      target: "esnext",
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ["console.log", "console.info"],
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Split vendor packages more safely
            if (id.includes("node_modules/react")) {
              return "vendor-react";
            }
            if (id.includes("node_modules/zustand")) {
              return "vendor-zustand";
            }
            if (
              id.includes("node_modules/lucide-react") ||
              id.includes("node_modules/boxicons")
            ) {
              return "vendor-ui";
            }
            if (id.includes("node_modules/firebase")) {
              return "vendor-firebase";
            }
            if (id.includes("node_modules/react-router")) {
              return "vendor-router";
            }
          },
          // Optimize chunk naming for caching
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash][extname]",
        },
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
      },
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
      // Optimize chunk size warning
      chunkSizeWarningLimit: 1000,
      // Disable source maps for production
      sourcemap: false,
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "zustand",
        "firebase/app",
        "firebase/auth",
      ],
      exclude: ["vite/modulepreload", "vite-plugin-pwa/web-worker"],
    },
  };
});
