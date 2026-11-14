# Frontend — Pertim

Interface web do Pertim. React 19, Vite 7, Tailwind e React Router, organizada em FSD (Feature-Sliced Design).

> Esta é a implementação atual. O sistema-alvo mantém React + Vite na web (painel da loja e web do tutor), reescrito conforme o [ADR-010](../Documentos/08-analise-tecnica/adrs.md#adr-010-web-em-react-e-vite). O app Android será em Kotlin ([ADR-011](../Documentos/08-analise-tecnica/adrs.md#adr-011-app-android-em-kotlin-e-módulo-compartilhado-kmp)).

## Pré-requisitos

- Node.js 20+
- Backend rodando em `http://localhost:8080` (veja o [README do backend](../pet-shop-backend/README.md))

## Rodando

```bash
npm install
npm run dev              # http://localhost:5173
npm run build            # build de produção
npm run preview          # serve o build
```

Com Docker, a partir da raiz do repositório: `docker compose up -d --build` (frontend em http://localhost:8081).

## Web nova (ADR-010)

A reescrita em TypeScript convive com o protótipo no mesmo `package.json`:

| Pasta | O que é |
|---|---|
| `apps/loja`, `apps/tutor` | Os dois aplicativos novos (hoje, só a tela de entrar) |
| `packages/tema` | Tokens de cor, fontes e base CSS da identidade, usados também pelo protótipo |
| `packages/ui` | Componentes base: `Botao`, `Campo`, `Selo`, `Cartao`, `Marca`, `PaginaEntrar` |
| `src/` | Protótipo em JavaScript, até as telas novas o substituírem |

```bash
npm run dev:loja         # painel da loja, http://localhost:5174
npm run dev:tutor        # web do tutor, http://localhost:5175
npm run typecheck        # tsc nos apps e pacotes
npm run build            # typecheck + build do protótipo e dos dois apps
```

Os pacotes são importados como `@pertim/ui` e `@pertim/tema/...` (alias em `caminhos.js` e `tsconfig.json`). `npm test` roda os testes do protótipo e os novos.

## Testes

| Tipo | Comando |
|---|---|
| Unitário e integração (Vitest) | `npm test` |
| Unitário em modo observação | `npm run test:watch` |
| E2E (Playwright) | `npm run test:e2e` |
| E2E com navegador visível | `npm run test:e2e:headed` |

## Mais informações

- [Arquitetura](../Documentos/02-arquitetura-tecnica/Arquitetura-v1.0.md)
- [Guia do ambiente local](../Documentos/02-arquitetura-tecnica/Guia-Ambiente-Local-v1.0.md)
- [Manual do desenvolvedor](../Documentos/10-git-flow/MANUAL.md)
