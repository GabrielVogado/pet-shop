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
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'lcov'],
      include: ['src/**/*.{js,jsx}', 'apps/*/src/**/*.{ts,tsx}', 'packages/*/src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', '**/*.test.{js,jsx,ts,tsx}', 'src/main.jsx', 'apps/*/src/main.tsx'],
      // O Sonar precisa do lcov mesmo com teste vermelho.
      reportOnFailure: true
    }
  }
});
