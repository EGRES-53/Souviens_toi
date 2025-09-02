import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow all external connections
    port: 5173,
    strictPort: true,
    cors: true,
    hmr: {
      port: 5173,
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});