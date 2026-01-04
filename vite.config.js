import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/quiz16/', // 👈 bardzo ważne dla GitHub Pages
});
