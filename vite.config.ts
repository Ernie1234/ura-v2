import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

    server: {
    host: true, // allows 0.0.0.0
    port: 5173, // optional for local dev
    strictPort: false,
    allowedHosts: ['ura-v2-dnbs.onrender.com'], // add your Render domain here
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: false,
  }
});

