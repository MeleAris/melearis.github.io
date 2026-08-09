import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/** Repo GitHub Pages utilisateur : https://melearis.github.io */
const BASE = '/';

function spaGitHubPagesFallback() {
  return {
    name: 'spa-github-pages-fallback',
    closeBundle() {
      const indexHtml = resolve('dist/index.html');
      const notFoundHtml = resolve('dist/404.html');
      if (existsSync(indexHtml)) {
        copyFileSync(indexHtml, notFoundHtml);
      }
    },
  };
}

export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss(), spaGitHubPagesFallback()],
  publicDir: 'public',
});
