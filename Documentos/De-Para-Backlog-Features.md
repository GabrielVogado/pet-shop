# De-Para: Backlog × Features

> Regra: o PR que entrega um item atualiza esta tabela no mesmo PR, com o número do PR. Só se marca como entregue o que está no código da `develop`.

Legenda: ✅ entregue · 🟡 parcial · ⬜ não iniciado

## MVP (entregue antes desta documentação)

Os PRs #1 a #6 entregaram o MVP; o detalhamento por funcionalidade foi reconstruído a partir do código e do histórico do Git em 05/11/2026 ("inicial" = commit `3ea91cb`, anterior aos PRs).

| ID | Funcionalidade | Status | Onde está | PR |
|---|---|---|---|---|
| F-01 | Cadastro de tutor e owner com JWT RS256 e BCrypt | ✅ | `AuthController`, `RegistrationService` | #1, #4 |
| F-02 | Rate limit no login (5/min) | ✅ | `AuthController` | #3 |
| F-03 | Cadastro, edição e consulta de pets | ✅ | `PetController`, `features/pet-management` | #1, #3 |
| F-04 | Catálogo de serviços por loja com SSE | ✅ | `ServiceCatalogController`, `SseCatalogBroadcaster`, `useCatalogStream` | #1, #4 |
| F-05 | Agendamento com disponibilidade e sem sobreposição | 🟡 | `AppointmentService` (POST não valida janela, DT-02) | #1 |
| F-06 | Cancelamento por tutor e por petshop com notificação | ✅ | `AppointmentService`, `NotificationService` | #1 |
| F-07 | Dashboard do owner com dados completos de tutor e pet | ✅ | `features/dashboard/owner` | inicial, #5, #6 |
| F-08 | Carteira de vacinação e histórico do tutor | ✅ | `features/vaccination`, `features/scheduling` | inicial, #1 |
| F-09 | Restrição a um único petshop | ✅ | `RegistrationService`, ADR-002 | #2 |
| F-10 | Clean Architecture no backend e FSD no frontend | ✅ | pacotes `domain/application/infrastructure/shared`, `src/app|pages|features|shared` | #4 |

## Fundação

| ID | Item | Status | PR |
|---|---|---|---|
| FD-01 | Documentação do projeto versionada em `Documentos/` | ✅ | #8 |
| FD-02 | Remover backups do `pom.xml` e `dev.log` | ✅ | #7 |
| FD-03 | CI no GitHub Actions | ⬜ | |
| FD-04 | Medição de cobertura | ⬜ | |
| FD-05 | Validar janela e grade no POST de agendamento (DT-02) | ⬜ | |
| FD-06 | Reserva atômica de horário (DT-03) | ⬜ | |

## Épico 1: Vários petshops

| ID | Item | Status | PR |
|---|---|---|---|
| E1-01 | ADR de multi-tenancy substituindo o ADR-002 | ⬜ | |
| E1-02 | Entidade `Petshop` e migração do `petshop-unico` | ⬜ | |
| E1-03 | Cadastro de várias lojas por owner | ⬜ | |
| E1-04 | Busca de petshops pelo tutor | ⬜ | |
| E1-05 | Horário e capacidade configuráveis por loja | ⬜ | |

## Épico 2: Pagamento

| ID | Item | Status | PR |
|---|---|---|---|
| E2-01 | ADR de provedor e modelo de pagamento | ⬜ | |
| E2-02 | Estados de pagamento no agendamento | ⬜ | |
| E2-03 | Webhooks idempotentes | ⬜ | |
| E2-04 | Concluir serviço e repasse | ⬜ | |

## Épico 3: App mobile

| ID | Item | Status | PR |
|---|---|---|---|
| E3-01 | Refresh token | ⬜ | |
| E3-02 | App do tutor | ⬜ | |
| E3-03 | Notificações push | ⬜ | |
| E3-04 | Publicação nas lojas | ⬜ | |
