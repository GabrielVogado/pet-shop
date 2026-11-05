# Documentação do PetCare Agenda

Índice da documentação versionada. Cada documento descreve o estado **medido no código** na data indicada no topo; quando o código mudar, o PR que muda o comportamento atualiza o documento correspondente.

| Documento | Para que serve |
|---|---|
| [MANUAL.md](MANUAL.md) | Como rodar, testar e contribuir (git-flow, commits, PRs) |
| [Visao-do-Produto.md](Visao-do-Produto.md) | Problema, perfis de usuário e o que o MVP entrega hoje |
| [Arquitetura.md](Arquitetura.md) | Camadas do backend e do frontend, modelo de dados, segurança, infraestrutura |
| [API.md](API.md) | Endpoints REST e SSE com perfis de acesso |
| [Regras-de-Negocio.md](Regras-de-Negocio.md) | Regras de cadastro, agendamento, cancelamento e notificação |
| [Roadmap.md](Roadmap.md) | Próximos épicos: vários petshops, pagamento, app mobile |
| [De-Para-Backlog-Features.md](De-Para-Backlog-Features.md) | Rastreabilidade entre backlog e entregas (PRs) |
| [Debitos-Tecnicos.md](Debitos-Tecnicos.md) | Débitos conhecidos, com evidência no código |
| [ADR/](ADR/) | Registros de decisão de arquitetura |

## ADRs

| ADR | Decisão | Status |
|---|---|---|
| [ADR-001](ADR/ADR-001-remocao-dos-ports.md) | Services injetam os repositórios Mongo diretamente | Aceito, implementado |
| [ADR-002](ADR/ADR-002-indice-unico-owner.md) | Índice único parcial para garantir um único owner | Aceito, a ser substituído pelo épico multi-petshop |
| [ADR-003](ADR/ADR-003-taxonomia-de-erros.md) | Taxonomia de erros da API | Proposto, não implementado |
| [ADR-004](ADR/ADR-004-n-mais-1-agendamentos.md) | Eliminar N+1 na listagem de agendamentos do owner | Proposto, não implementado |
| [ADR-005](ADR/ADR-005-jwt-kid.md) | `kid` no header do JWT para rotação de chaves | Aceito, implementado |
