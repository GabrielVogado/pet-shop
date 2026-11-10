# 🕰️ Histórico do Projeto — PetCare Agenda

> **Para que serve:** registro cronológico do projeto (entregas, decisões e documentos que deixaram de valer), para que o *porquê* não se perca. O estado atual está nos documentos vigentes listados em [`00-INDICE.md`](../00-INDICE.md).
>
> **Regra permanente:** quando um documento é substituído por uma versão nova, a versão antiga vem para esta pasta (`_historico/`) e ganha uma linha na seção 2. Cada marco do projeto (merge relevante, release, decisão do PO) ganha uma linha na seção 1.

---

## 1. Linha do tempo

Reconstruída do histórico do Git em 05/11/2026.

| Data | Marco | Referência |
|---|---|---|
| 20/06/2026 | Primeira versão: SPA para agendamento de banhos e vacinas (frontend React, componentes `AuthScreen`, `OwnerDashboard`, `PetRegistration`, `VaccinationWallet`) | commit `3ea91cb` |
| 01/07/2026 | Backend Quarkus + MongoDB, migração do frontend para FSD, regras de agendamento, proteção de dados e edição de pets | PR #1 |
| 02/07/2026 | Decisão de aceitar **um único petshop** por enquanto | PR #2, commit `e736bb8` |
| 01/08/2026 | Rate limit no login e `GET /pets/{id}` | PR #3 |
| 01–02/08/2026 | Backend migrado para Clean Architecture (domain/application/infrastructure/shared) e frontend para FSD com React Router; hardening de auth | PR #4 |
| 01–02/08/2026 | Ciclos de auditoria: QA de código (análise, relatório, correções, revisões por especialista, veredito final) e QA de design (design system, 47 problemas de UI/UX, usabilidade). Documentos mantidos fora do repositório, no vault Obsidian | seção 2 |
| 02/08/2026 | Correção do dashboard do owner: "Ver detalhes" e dados completos de tutor e pet | PRs #5 e #6 |
| 02/08/2026 | Remoção de `docs/design/petcare-qa-080126/` do repositório (relatórios de design QA); a documentação passou a viver só no vault | commit `4c2558b` |
| 04/08/2026 | Três commits diretos na `master`, **sem PR**, chamados "commits faltantes": ajustes de UI do owner e do shell, e uma reorganização de 108 arquivos do frontend que removeu 3 arquivos de teste (`AuthScreen.test.jsx`, `OwnerDashboard.test.jsx`, `ServiceRequest.test.jsx`) | commits `9ba6773`, `1cf64a3`, `1b0a1bf` |
| 05/11/2026 | Criada a branch `develop` a partir de `master`; PRs passam a apontar para `develop` | [M-001](../09-melhoria-continua/MELHORIAS.md) |
| 05/11/2026 | Limpeza de backups do `pom.xml` e `dev.log` versionados | PR #7 |
| 05/11/2026 | Documentação do projeto volta ao repositório, escrita a partir do código | PR #8 |
| 05/11/2026 | `Documentos/` reorganizado (pastas numeradas, `MELHORIAS.md`, `HISTORICO.md`, git-flow `develop → master → release/<tag>`) | PR #9 |
| 05/11/2026 | PO propõe Flutter no frontend e Kotlin no backend Quarkus | [ADR-006](../08-analise-tecnica/adrs.md#adr-006-flutter-na-web-e-no-mobile-e-kotlin-no-backend-quarkus) |
| 05/11/2026 | PO aceita o ADR-006: web segue em React, app mobile em Flutter, backend reescrito em Kotlin de uma vez junto com o Épico 1; persistência em Panache Kotlin | [ADR-006](../08-analise-tecnica/adrs.md#adr-006-flutter-na-web-e-no-mobile-e-kotlin-no-backend-quarkus) |
| 05/11/2026 | Mudança de escopo do PO: a web também vai para Flutter (web e mobile numa base só) | [ADR-006](../08-analise-tecnica/adrs.md#adr-006-flutter-na-web-e-no-mobile-e-kotlin-no-backend-quarkus) |
| 10/11/2026 | PO decide documentar tudo antes de desenvolver; propostas a arquitetura-alvo e o ADR-008 (multi-tenancy) | [Arquitetura-Alvo-v2.0](../02-arquitetura-tecnica/Arquitetura-Alvo-v2.0.md) |
| 05/11/2026 | Direção do produto definida pelo PO: vários petshops, pagamento e app mobile, com foco em documentação antes de desenvolver | [Roadmap](../04-backlog/Roadmap-v1.0.md) |
| 05/11/2026 | Entrevista com o PO define o sistema-alvo: marketplace com mensalidade da loja, sinal de 50%, carteira de vacinas com origem verificada, avaliações com direito de resposta, Android e web | [Documento-Negocial-v2.0](../01-negocio/Documento-Negocial-v2.0.md) |
| 05/11/2026 | ADR-007 propõe o caminho para escolher o provedor de pagamento (Asaas recomendado, Stripe Connect como alternativa, a validar em sandbox) | [ADR-007](../08-analise-tecnica/adrs.md#adr-007-provedor-de-pagamento) |
| 05/11/2026 | Estimativa de custo de nuvem para 30 lojas e 100 tutores: infraestrutura de ~US$ 21 a ~US$ 161 por mês, com o WhatsApp como custo variável principal | [Estimativa-Custo-Nuvem](../02-arquitetura-tecnica/Estimativa-Custo-Nuvem-v1.0.md) |

---

## 2. Documentos substituídos

### 2.1 Documentação de 06–08/2026 (vault Obsidian)

Antes de 05/11/2026 a documentação existia só no vault `D:\Mega Brain`. Ela foi preservada em `Projetos/PetCare/Historico/` no vault, separada por tipo, e substituída pelos documentos vigentes deste diretório. Esses arquivos **não** foram copiados para o repositório porque descrevem um estado que não vale mais e contêm afirmações que o código não confirma (ver 2.2).

| Grupo | Documentos antigos (vault) | Substituídos por |
|---|---|---|
| Contexto e arquitetura | `CONTEXTO`, `ARQUITETURA`, `FSD_ARCHITECTURE`, `ARCHITECTURAL_ASSESSMENT`, `VEREDITO_PROJETO`, `FEATURES`, `CHANGELOG`, `RELATORIO_MELHORIAS`, `GUIA_DE_DESENVOLVIMENTO`, `GUIA_CONTRIBUICAO` | [`Documento-Negocial-v1.0`](Documento-Negocial-v1.0.md), [`Arquitetura-v1.0`](../02-arquitetura-tecnica/Arquitetura-v1.0.md), [`MANUAL`](../10-git-flow/MANUAL.md), este histórico |
| QA de código (01/08) | `QA_ANALYSIS`, `QA_REPORT`, `QA_FIXES`, `QA_REVISAO_*` (3), `QA_ACAO_*` (3), `QA_CORRECAO_API`, `QA_VEREDITO_FINAL`, `QA_RUNBOOK` | [`Debitos-Tecnicos-v1.0`](../08-analise-tecnica/Debitos-Tecnicos-v1.0.md) |
| QA de design (02/08) | `DESIGN_SYSTEM`, `QA_DESIGN_FINAL`, `QA_DESIGN_REPORT`, `QA_DESIGN_ISSUES` (+ `.csv`), `QA_DESIGN_TRACEABILITY`, `USABILIDADE_DOC`, `DESIGN_SPEC_IMPROVEMENTS` | Sem substituto ainda (futuro `03-ui-ux/`) |
| Segurança e performance | `SECURITY_HARDENING_PLAN`, `SECURITY_PENTEST_PLAN`, `JMETER_ANALYSIS`, `RELATORIO_PERFORMANCE`, `BASELINE_TESTES` | Sem substituto ainda (futuros `11-desempenho/` e `12-seguranca/`) |
| ADRs e migração | `ADR-001-ports-remocao`, `ADR-002-indice-parcial-owner`, `ADR-003-taxonomia-erros`, `ADR-003-jwt-kid-rotacao`, `ADR-004-bulk-lookup-n+1`, `MIG-001-indice-unico-owner`, `MIG-001-APLICADA` | [`adrs.md`](../08-analise-tecnica/adrs.md) |
| Correções pontuais | `CORRECAO_REDIRECIONAMENTO_OWNER_DASHBOARD`, `CORRECAO_OWNER_VER_DETALHES_E_DADOS_COMPLETOS` | Linha do tempo (PRs #5 e #6) |

### 2.2 Divergências encontradas ao substituir

- ADR-002, ADR-003 e ADR-004 antigos diziam `status: Aceito` no cabeçalho e "Proposto" no corpo. No código, só o ADR-002 está aplicado; ADR-003 e ADR-004 seguem propostos.
- Havia dois ADR-003. O de `kid` no JWT virou **ADR-005**.
- `AVALIAÇÃO_ARQUITETURAL.md` estava vazio e era referenciado por 9 notas.
- O relatório de validação do vault afirmava "0 problemas", o que não conferia.
- `CONTEXTO.md` apontava como ativa a branch `refactor/clean-architecture`, já mergeada.

### 2.3 Versões anteriores de documentos deste diretório

| Documento | Versão | Data | Motivo da troca |
|---|---|---|---|
| [Documento-Negocial](Documento-Negocial-v1.0.md) | v1.0 | 05/11/2026 | Substituído pela v2.0, que descreve o sistema-alvo definido em entrevista com o PO. A v1.0 continua sendo a referência do comportamento do código atual (MVP de um petshop). |
