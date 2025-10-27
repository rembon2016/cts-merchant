import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
        manifest: {
          name: "CTS Soundbox Merchant",
          short_name: "CTSMerchant",
          description: "Aplikasi CTS Soundbox Merchant",
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
    ],
    server: {
      // host: "0.0.0.0",
      port: 3000,
      // proxy: {
      //   "/api": {
      //     target: env.VITE_API1_TARGET,
      //     changeOrigin: true,
      //     secure: false,
      //     rewrite: (path) => path.replace(/^\/api/, "/api"),
      //   },
      //   "/api2": {
      //     target: env.VITE_API2_TARGET,
      //     changeOrigin: true,
      //     secure: false,
      //     rewrite: (path) => path.replace(/^\/api2/, "/api"),
      //   },
      // },
    },
  };
});
