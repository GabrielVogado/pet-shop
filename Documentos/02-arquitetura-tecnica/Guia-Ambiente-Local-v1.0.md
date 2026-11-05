# Guia do Ambiente Local — PetCare Agenda (v1.0)

> Como subir e testar o projeto na sua máquina. Fluxo de branches, PRs e documentação: [MANUAL](../10-git-flow/MANUAL.md).

## Pré-requisitos

- Java 17 e Maven 3.9+
- Node.js 20+
- Docker e Docker Compose
- Par de chaves RSA para o JWT:

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

Copie `.env.example` para `.env` e cole as chaves. Arquivos `.pem` e `.env` não são versionados.

## Rodando

### Tudo em containers

```bash
docker compose up -d --build                       # produção local: front 8081, API 8080
docker compose -f docker-compose.dev.yml up -d --build   # dev com hot reload: front 5173, API 8080
```

### Sem Docker

```bash
# MongoDB em localhost:27017
cd pet-shop-backend && mvn quarkus:dev
cd pet-shop-frontend && npm install && npm run dev
```

## Testes

| Onde | Comando |
|---|---|
| Backend | `cd pet-shop-backend && mvn test` |
| Frontend unitário e integração (Vitest) | `cd pet-shop-frontend && npm test` |
| Frontend E2E (Playwright) | `cd pet-shop-frontend && npm run test:e2e` |
