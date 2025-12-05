import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
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
      host: true,
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
