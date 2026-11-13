import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config';
import { alias, publicDir } from './caminhos.js';

export default defineConfig({
  plugins: [react()],
  publicDir,
  resolve: { alias },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
    css: true,
    exclude: [...configDefaults.exclude, 'tests/e2e/**']
  }
});
