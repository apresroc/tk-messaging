import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    dyadComponentTagger(), 
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Twilio Messaging Platform',
        short_name: 'TwilioMsg',
        description: 'A powerful messaging platform built with Twilio',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'public/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          },
          {
            src: 'public/placeholder.svg',
            type: 'image/svg+xml',
            sizes: '192x192'
          },
          {
            src: 'public/placeholder.svg',
            type: 'image/svg+xml',
            sizes: '512x512'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));