import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/sudoku/", // 👈 MUST match repo name exactly

  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      // These files MUST exist in /public
      includeAssets: [
        "favicon.png",
        "icon-192.png",
        "icon-512.png"
      ],

      manifest: {
        name: "Sudoku",
        short_name: "Sudoku",
        description: "Modern Sudoku Puzzle Game",

        theme_color: "#38bdf8",
        background_color: "#ffffff",

        display: "standalone",

        // 👇 IMPORTANT for GitHub Pages
        start_url: "/sudoku/",
        scope: "/sudoku/",

        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});
