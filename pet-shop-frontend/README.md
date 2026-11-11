# Frontend — PetCare Agenda

Interface web do PetCare Agenda. React 19, Vite 7, Tailwind e React Router, organizada em FSD (Feature-Sliced Design).

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
