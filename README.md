# PetCare Agenda

Plataforma que conecta donos de pets (tutores) a petshops para agendar banhos e vacinas.

Hoje o sistema é um MVP web com **um único petshop**. O próximo ciclo leva o produto para **vários petshops, pagamento e app mobile** (ver [Documentos/Roadmap.md](Documentos/Roadmap.md)).

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `pet-shop-backend/` | API REST em Quarkus 3.15 (Java 17) com MongoDB via JNoSQL, JWT RS256 e SSE |
| `pet-shop-frontend/` | SPA em React 19 + Vite 7 + Tailwind + React Router, organizada em FSD |
| `Documentos/` | Documentação do projeto (arquitetura, API, regras, ADRs, backlog, manual) |
| `docker-compose.yml` | Ambiente completo: MongoDB + backend + frontend (nginx) |
| `docker-compose.dev.yml` | Ambiente de desenvolvimento com hot reload |

## Como rodar

```bash
cp .env.example .env        # preencha JWT_PUBLIC_KEY e JWT_PRIVATE_KEY
docker compose up -d --build
```

- Frontend: http://localhost:8081
- API: http://localhost:8080 (OpenAPI em `/q/openapi`)

Desenvolvimento local, testes e fluxo de branches estão no [Manual](Documentos/MANUAL.md).

## Documentação

Comece pelo índice em [Documentos/README.md](Documentos/README.md).
