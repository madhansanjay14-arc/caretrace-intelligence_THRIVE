import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api/gas': {
          target: 'https://script.google.com',
          changeOrigin: true,
          followRedirects: true,
          rewrite: (p) =>
            p.replace(
              /^\/api\/gas/,
              '/macros/s/AKfycbyZcUAMhR0dSpdObymomjvMLXs1wJmVLKVnPw-udJEAdT5DAPJvda_u24n9-ejTygsgrA/exec'
            ),
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
