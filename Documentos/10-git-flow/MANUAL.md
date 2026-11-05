# 📘 Manual de Funcionamento — PetCare Agenda

Manual operacional do projeto: fluxo de desenvolvimento (git-flow), ambientes, CI/CD, release, testes e como manter a documentação.

> **Revisão 05/11/2026.** Primeira versão no padrão `Documentos/10-git-flow/`. Hoje o projeto **não tem CI/CD nem ambiente publicado**: as seções 2 e 4 descrevem o modelo adotado e marcam com ⚠️ o que ainda não existe.

---

## 1. Visão Geral

- **Backend:** Quarkus 3.15 (Java 17) + MongoDB via JNoSQL, em `pet-shop-backend/`.
- **Frontend:** React 19 + Vite 7 + Tailwind, SPA web, em `pet-shop-frontend/`.
- **Infra local:** Docker Compose (`docker-compose.yml` e `docker-compose.dev.yml`).
- **Documentação:** `Documentos/` (este diretório), índice em [`00-INDICE.md`](../00-INDICE.md).

---

## 2. Ambientes

| Ambiente | Branch | Backend | Banco | Estado |
|---|---|---|---|---|
| **local** | qualquer | `docker compose` ou `mvn quarkus:dev` | MongoDB local (`petcare`) | ✅ existe |
| **dev** | `develop` | a definir | `petcare_dev` | ⚠️ não criado |
| **hom** (homologação) | `master` | a definir | `petcare_hom` | ⚠️ não criado |
| **prod** (produção) | `release/<tag>` | a definir | `petcare_prod` | ⚠️ não criado |

> **Regra de ouro:** cada ambiente usa **banco separado** e **par de chaves JWT próprio** (`JWT_PUBLIC_KEY`/`JWT_PRIVATE_KEY`). Nunca compartilhe dados nem chaves entre ambientes.

Como subir o ambiente local: [`Guia-Ambiente-Local-v1.0.md`](../02-arquitetura-tecnica/Guia-Ambiente-Local-v1.0.md).

---

## 3. Fluxo de Desenvolvimento (Gitflow)

```
feature/* ──► develop ──► master ──► release/<tag>
 (trabalho)      (dev)      (hom)     (prod, versão fixada)
```

### 3.1 Branches

| Prefixo | Parte de | Vai para | Uso |
|---|---|---|---|
| `feature/<nome>` | `develop` | `develop` | Nova funcionalidade |
| `bugfix/<nome>` ou `hotfix/<nome>` | `develop` | `develop` | Correção de bug em funcionalidade já entregue |
| `doc/<nome>` | `develop` | `develop` | Somente documentação |
| `chore/<nome>` | `develop` | `develop` | Manutenção sem mudança de comportamento (limpeza, build, dependências) |
| `release/<versão>` | tag homologada | — | Produção, versão fixada |

Nomes em minúsculas e kebab-case, por exemplo `feature/cadastro-varios-petshops`. Nunca use prefixos gerados automaticamente (ex.: `claude/`).

### 3.2 Nova funcionalidade ou correção

1. Crie a branch a partir de `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/<nome-da-feature>
   ```
2. Desenvolva e commite (§6).
3. Abra um **Pull Request** para `develop`. **Um PR por tarefa.**
4. No mesmo PR, atualize a documentação afetada (§7).

### 3.3 Promoção para homologação

1. Abra um PR de `develop` → `master`. **Só de `develop`:** um PR de feature direto para `master` pularia a integração.
2. Cada promoção ganha um registro em [`homologacoes/`](./homologacoes/) com o que entrou, o roteiro de teste e o resultado.

> ⚠️ Enquanto o ambiente de homologação não existir, `master` só recebe promoções de `develop` já validadas localmente.

### 3.4 Release de produção

1. Valide em homologação (`master`).
2. Crie a branch `release/<versão>` a partir da **tag homologada**, não da ponta da `master`.
3. Depois de validar em produção, faça merge de `release/<versão>` de volta em `master` e `develop`.

> ⚠️ Não há produção ainda. O processo acima vale a partir da primeira release.

### 3.5 Proteção de branches

> ⚠️ `develop` e `master` **não estão protegidas** (verificado pela API do GitHub em 05/11/2026: `protected: false`). Hoje um PR pode ser mergeado sem revisão nem CI. A proteção entra junto com o CI (Fase 0 do [Roadmap](../04-backlog/Roadmap-v1.0.md)).

---

## 4. CI/CD

> ⚠️ **Não existe** `.github/workflows/`. Nenhum teste roda automaticamente nos PRs (débito DT-07 em [`Debitos-Tecnicos-v1.0.md`](../08-analise-tecnica/Debitos-Tecnicos-v1.0.md)).

Modelo previsto (Fase 0):

| Workflow | Gatilho | Ação |
|---|---|---|
| `ci.yml` | PR para `develop` e `master`; push em `develop`/`master` | `mvn test` no backend, `npm test` e `npm run build` no frontend |
| `cd-*.yml` | push em `develop`, `master`, `release/**` | Deploy do ambiente correspondente (§2) |

---

## 5. Testes

| Onde | Comando |
|---|---|
| Backend | `cd pet-shop-backend && mvn test` |
| Frontend (Vitest) | `cd pet-shop-frontend && npm test` |
| Frontend E2E (Playwright) | `cd pet-shop-frontend && npm run test:e2e` |

Rode os testes da área alterada antes de abrir o PR.

---

## 6. Commits e Pull Requests

- [Conventional Commits](https://www.conventionalcommits.org/pt-br/) em português: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, com escopo opcional (`feat(agendamento): ...`).
- Autor e committer: o PO (`GabrielVogado <gabriel.vogado@gmail.com>`).
- O PR aponta para `develop` e descreve o que muda, por quê e como foi verificado.

---

## 7. Documentação

Toda entrega mantém `Documentos/` em dia **no mesmo PR**:

| Quando | Atualizar |
|---|---|
| Sempre | Uma linha em [`00-INDICE.md`](../00-INDICE.md) (seção de revisões) |
| Entrega de estória do backlog | A linha correspondente em [`De-Para-Backlog-Features.md`](../De-Para-Backlog-Features.md), com o número do PR |
| Melhoria de processo, qualidade, infraestrutura ou correção relevante | Uma entrada `M-NNN` em [`MELHORIAS.md`](../09-melhoria-continua/MELHORIAS.md) |
| Mudança de regra de negócio | [`Documento-Negocial-v2.0.md`](../01-negocio/Documento-Negocial-v2.0.md) |
| Mudança de endpoint | [`Especificacao-API-v1.0.md`](../02-arquitetura-tecnica/Especificacao-API-v1.0.md) |
| Decisão de arquitetura | Novo ADR em [`adrs.md`](../08-analise-tecnica/adrs.md), próximo número livre |
| Documento substituído por versão nova | A versão antiga vai para [`_historico/`](../_historico/) e ganha linha em [`HISTORICO.md`](../_historico/HISTORICO.md) |

Versões: quando um documento muda de forma significativa, ele ganha nova versão no nome (`-v1.1`, `-v2.0`) e a anterior vai para `_historico/`.

O vault Obsidian (`D:\Mega Brain\Projetos\PetCare`) espelha estes documentos; **o repositório é a fonte**.
