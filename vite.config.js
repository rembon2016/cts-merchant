import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
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
            src: "/images/pwa-192x192.svg",
            sizes: "192x192",
            type: "image/svg",
          },
          {
            src: "/images/pwa-512x512.svg",
            sizes: "512x512",
            type: "image/svg",
          },
          {
            src: "/images/pwa-512x512.svg",
            sizes: "512x512",
            type: "image/svg",
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
    port: 3000,
    // server: {
    //   proxy: {
    //     "/api": {
    //       target: "https://pos.ctsolution.id/api",
    //       changeOrigin: true,
    //       rewrite: (p) => p.replace(/^\/api/, ""),
    //     },
    //   },
    // },
  },
});
