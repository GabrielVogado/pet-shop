# 📚 Índice Central da Documentação — PetCare Agenda

> **Plataforma que conecta tutores de pets a petshops para agendar banhos e vacinas.**
> Última atualização: 05/11/2026 · Responsável: Gabriel Vogado

Cada documento descreve o estado **medido no código** na data indicada nele. O PR que muda comportamento atualiza o documento afetado e ganha uma linha na seção de revisões abaixo ([MANUAL §7](10-git-flow/MANUAL.md#7-documentação)).

---

## 📌 Revisão 05/11/2026 — ADR-007: provedor de pagamento (proposto)

**O que mudou:** novo ADR-007 compara Asaas, Stripe Connect, Mercado Pago, Pagar.me, Iugu e "cada loja com o próprio provedor" contra os requisitos de pagamento do Documento Negocial v2.0. A documentação pública foi consultada; o que foi confirmado e o que ficou em aberto está na tabela do ADR. Recomendação provisória: Asaas, com Stripe Connect como alternativa, a validar em sandbox. Nenhuma mudança de código.
**Sem mudança:** `De-Para-Backlog-Features.md` e `MELHORIAS.md` (decisão ainda não tomada).

---

## 📌 Revisão 05/11/2026 — Documento Negocial v2.0 (sistema-alvo)

**O que mudou:** a partir de uma entrevista com o PO em seis blocos, o `Documento-Negocial-v2.0.md` descreve o sistema-alvo, que será desenvolvido do zero:
- marketplace de lojas com mensalidade fixa;
- tutor sem custo;
- sinal de 50% que funciona como multa;
- prazo de aceite pela loja;
- carteira de vacinas com origem verificada e permissão do tutor;
- avaliações com direito de resposta;
- notificações por app, WhatsApp, SMS e e-mail;
- requisitos não funcionais e pendências.

A v1.0 foi para `_historico/` e continua descrevendo o código atual. `MANUAL.md`, `Especificacao-API-v1.0.md` e `HISTORICO.md` ajustados. Nenhuma mudança de código.
**Sem mudança:** `De-Para-Backlog-Features.md` e `MELHORIAS.md` (documentação, nada entregue).

---

## 📌 Revisão 05/11/2026 — ADR-006: web também em Flutter

**O que mudou:** o PO mudou o escopo do ADR-006: a web também vai para Flutter, junto com o app mobile, numa base só. O ADR passa a se chamar "Flutter na web e no mobile e Kotlin no backend Quarkus", com a opção A do frontend escolhida e os custos da reescrita da SPA React. O `Roadmap-v1.0.md` e o `HISTORICO.md` foram atualizados. Nenhuma mudança de código.
**Sem mudança:** `De-Para-Backlog-Features.md` e `MELHORIAS.md` (decisão registrada, nada entregue).

---

## 📌 Revisão 05/11/2026 — ADR-006 aceito pelo PO

**O que mudou:** o PO respondeu às quatro perguntas do ADR-006. A web continua em React, o app mobile será em Flutter e o backend será reescrito em Kotlin de uma vez, junto com o Épico 1 (vários petshops). Para a persistência, o ADR compara JNoSQL, Panache Kotlin e o driver Kotlin com coroutines e o PO escolheu `quarkus-mongodb-panache-kotlin`. O ADR foi renomeado para "Flutter no app mobile e Kotlin no backend Quarkus", e o `Roadmap-v1.0.md` e o `HISTORICO.md` foram atualizados. Nenhuma mudança de código.
**Sem mudança:** `De-Para-Backlog-Features.md` e `MELHORIAS.md` (decisão registrada, nada entregue).

---

## 📌 Revisão 05/11/2026 — Proposta de troca de stack (ADR-006)

**O que mudou:** o PO propôs trocar o frontend React por Flutter (web e mobile numa base só) e escrever o backend Quarkus em Kotlin. Registrado como ADR-006, **proposto**, com ganhos, custos e quatro perguntas em aberto; o `Roadmap-v1.0.md` passa a citar a proposta. Nenhuma mudança de código.
**Sem mudança:** `De-Para-Backlog-Features.md` e `MELHORIAS.md` (decisão ainda não aprovada nem entregue).

---

## 📌 Revisão 05/11/2026 — Nova estrutura de Documentos/

**O que mudou:** a pedido do PO, `Documentos/` passa a ter pastas numeradas, este índice, `MELHORIAS.md` e `HISTORICO.md`. O `MANUAL.md` adota o git-flow (`feature/* → develop → master → release/<tag>`). Visão e regras foram unidas no `Documento-Negocial-v1.0.md` e os ADRs reunidos em `adrs.md`. Registro em `MELHORIAS.md` (M-004).
**Sem mudança:** `De-Para-Backlog-Features.md` (documentação, sem estória entregue).

---

## 📌 Revisão 05/11/2026 — Documentação a partir do código

**O que mudou:** documentação volta ao repositório, escrita a partir do código da `develop` (PR #8). Registro em `MELHORIAS.md` (M-003).

---

## Estrutura

| Pasta | Documento | Para que serve |
|---|---|---|
| `01-negocio/` | [Documento-Negocial-v2.0](01-negocio/Documento-Negocial-v2.0.md) | Sistema-alvo: visão, modelo de negócio, perfis, regras de negócio (RN-01 a RN-72), requisitos não funcionais e pendências. O código atual segue descrito na [v1.0](_historico/Documento-Negocial-v1.0.md) |
| `02-arquitetura-tecnica/` | [Arquitetura-v1.0](02-arquitetura-tecnica/Arquitetura-v1.0.md) | Camadas do backend e do frontend, modelo de dados, segurança, tempo real, infraestrutura |
| | [Especificacao-API-v1.0](02-arquitetura-tecnica/Especificacao-API-v1.0.md) | Endpoints REST e SSE com perfis de acesso |
| | [Guia-Ambiente-Local-v1.0](02-arquitetura-tecnica/Guia-Ambiente-Local-v1.0.md) | Pré-requisitos, como rodar e testar na máquina |
| `04-backlog/` | [Roadmap-v1.0](04-backlog/Roadmap-v1.0.md) | Fase 0 (fundação) e épicos: vários petshops, pagamento, app mobile |
| `08-analise-tecnica/` | [adrs](08-analise-tecnica/adrs.md) | ADR-001 a ADR-007 |
| | [Debitos-Tecnicos-v1.0](08-analise-tecnica/Debitos-Tecnicos-v1.0.md) | Débitos com evidência no código |
| `09-melhoria-continua/` | [MELHORIAS](09-melhoria-continua/MELHORIAS.md) | Melhorias aplicadas (M-NNN), com PR |
| `10-git-flow/` | [MANUAL](10-git-flow/MANUAL.md) | Git-flow, ambientes, CI/CD, release, testes, regras de documentação |
| | [homologacoes/](10-git-flow/homologacoes/README.md) | Registro de cada promoção para homologação |
| `_historico/` | [HISTORICO](_historico/HISTORICO.md) | Linha do tempo do projeto e documentos substituídos |
| raiz | [De-Para-Backlog-Features](De-Para-Backlog-Features.md) | Rastreabilidade backlog × entregas (PRs) |

Pastas reservadas, criadas quando houver conteúdo: `03-ui-ux`, `05-features`, `06-sprints`, `07-dados`, `11-desempenho`, `12-seguranca`, `13-marketing`.

## ADRs

| ADR | Decisão | Status |
|---|---|---|
| [ADR-001](08-analise-tecnica/adrs.md#adr-001-services-injetam-os-repositórios-mongo-diretamente) | Services injetam os repositórios Mongo diretamente | Aceito, implementado |
| [ADR-002](08-analise-tecnica/adrs.md#adr-002-índice-único-parcial-para-garantir-um-único-owner) | Índice único parcial para garantir um único owner | Aceito, a ser substituído pelo épico multi-petshop |
| [ADR-003](08-analise-tecnica/adrs.md#adr-003-taxonomia-de-erros-da-api) | Taxonomia de erros da API | Proposto, não implementado |
| [ADR-004](08-analise-tecnica/adrs.md#adr-004-eliminar-n1-na-listagem-de-agendamentos-do-owner) | Eliminar N+1 na listagem de agendamentos do owner | Proposto, não implementado |
| [ADR-005](08-analise-tecnica/adrs.md#adr-005-kid-no-header-do-jwt-para-rotação-de-chaves) | `kid` no header do JWT para rotação de chaves | Aceito, implementado |
| [ADR-006](08-analise-tecnica/adrs.md#adr-006-flutter-na-web-e-no-mobile-e-kotlin-no-backend-quarkus) | Flutter na web e no mobile e Kotlin no backend Quarkus | Aceito pelo PO |
| [ADR-007](08-analise-tecnica/adrs.md#adr-007-provedor-de-pagamento) | Provedor de pagamento | Proposto |

## Espelho no Obsidian

O vault `D:\Mega Brain` tem uma cópia destes documentos em `Projetos/PetCare/`. **O repositório é a fonte**: quando divergirem, vale o que está aqui.
