# Manual do Desenvolvedor

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

## Git-flow

| Branch | Uso |
|---|---|
| `master` | Produção. Recebe merge apenas de `release/*` e `hotfix/*`. |
| `develop` | Integração. Base de todo trabalho e alvo dos PRs. |
| `feature/<descricao>` | Nova funcionalidade, a partir de `develop` |
| `bugfix/<descricao>` | Correção de bug não urgente, a partir de `develop` |
| `hotfix/<descricao>` | Correção urgente em produção, a partir de `master`, com merge em `master` e `develop` |
| `release/<versao>` | Preparação de versão, a partir de `develop` |
| `doc/<descricao>` | Somente documentação |
| `chore/<descricao>` | Manutenção sem mudança de comportamento (build, limpeza, dependências) |

Nomes em minúsculas e kebab-case, por exemplo `feature/cadastro-varios-petshops`.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/pt-br/) em português: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, com escopo opcional (`feat(agendamento): ...`).

## Pull requests

- Um PR por tarefa, sempre para `develop`.
- O PR que muda comportamento atualiza a documentação afetada em `Documentos/` e a linha correspondente em [De-Para-Backlog-Features.md](De-Para-Backlog-Features.md).
- Decisão de arquitetura nova vira um ADR em `Documentos/ADR/`, com o próximo número livre.
- Testes passando localmente antes de abrir o PR.
