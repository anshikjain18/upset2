import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [
        react(),
    ],
    optimizeDeps: { exclude: [] },
    server: { hmr: process.env.NODE_TESTING !== 'true' },
  };
});