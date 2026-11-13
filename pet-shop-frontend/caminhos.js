import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';

const aqui = (caminho) => fileURLToPath(new URL(caminho, import.meta.url));

// Pacotes comuns dos aplicativos web (ADR-010), resolvidos por alias em vez de workspaces.
export const alias = {
  '@pertim/tema': aqui('./packages/tema'),
  '@pertim/ui': aqui('./packages/ui/src')
};

// Arquivos servidos na raiz de todo aplicativo (símbolo e favicon).
export const publicDir = aqui('./packages/tema/publico');

/** Configuração Vite de um aplicativo em apps/<nome>. Cada um tem porta e cache próprios; o .env fica na raiz do frontend. */
export const configDoApp = (nome, porta) => ({
  root: aqui(`./apps/${nome}`),
  publicDir,
  envDir: aqui('.'),
  cacheDir: aqui(`./node_modules/.vite-${nome}`),
  plugins: [react()],
  resolve: { alias },
  server: { port: porta, strictPort: true }
});
