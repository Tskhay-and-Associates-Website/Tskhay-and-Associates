import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// On GitHub Pages the site lives in a sub-folder (for example /tskhay-associates-website/)
// until a custom domain is connected. The GitHub workflow passes that folder in BASE_PATH.
// Everywhere else (local preview, Netlify, a custom domain) the site lives at "/".
const raw = (process.env.BASE_PATH || '').replace(/^\/+|\/+$/g, '');
const base = raw ? `/${raw}/` : '/';

const page = (p) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: page('./index.html'),
        letsTalk: page('./lets-talk/index.html'),
        eltv: page('./eltv/index.html'),
      },
    },
  },
});
