# Débitos Técnicos

> Levantados no código da branch `develop` em 05/11/2026. Cada item cita onde está a evidência. Prioridade pensando no [Roadmap](../04-backlog/Roadmap-v1.0.md).

| ID | Débito | Evidência | Impacto | Prioridade |
|---|---|---|---|---|
| DT-01 | Petshop único fixo no código | `RegistrationService.SINGLE_PETSHOP_ID = "petshop-unico"`, `existsOwner()`, índice do [ADR-002](adrs.md#adr-002-índice-único-parcial-para-garantir-um-único-owner); `PetshopController` devolve só o primeiro | Bloqueia o épico de vários petshops | Alta |
| DT-02 | `POST /api/agendamentos` não valida janela 9h–18h nem grade de 30 min | `AppointmentService.create` só checa data futura e conflito | Agendamento às 23h é aceito | Alta |
| DT-03 | Checagem de conflito não é atômica | `hasConflict` lê e depois `insert`, sem lock nem índice | Dois tutores podem reservar o mesmo horário ao mesmo tempo | Alta (antes do pagamento) |
| DT-04 | Disponibilidade faz centenas de consultas por chamada | `availability` percorre 14 dias × até 18 horários e cada `hasConflict` chama `findByPetshopId` | Lento com agenda cheia | Média |
| DT-05 | N+1 na agenda do owner | `AppointmentController.list` busca usuário e pet por agendamento ([ADR-004](adrs.md#adr-004-eliminar-n1-na-listagem-de-agendamentos-do-owner)) | Lento com muitos agendamentos | Média |
| DT-06 | Datas e duração guardadas como texto | `Agendamento.dateTime` e `Servico.duration` são `String` | Ordenação e consultas por período frágeis | Média |
| DT-07 | Sem CI | não existe `.github/workflows/` | Nenhum teste roda automaticamente nos PRs | Alta |
| DT-08 | Imagem Docker pula testes | `Dockerfile`: `-Dmaven.test.skip=true` | Build quebrado pode ir para produção | Média |
| DT-09 | Cobertura baixa e não medida | 12 `@Test` no backend em 4 classes; 6 testes Vitest + 2 Playwright no frontend; sem JaCoCo | Regressões passam despercebidas | Alta |
| DT-10 | Status `Concluido` nunca é atribuído | nenhum uso de `AppointmentStatus.COMPLETED` fora do enum | Histórico não diferencia realizado de pendente | Média |
| DT-11 | `services.json` sem uso | nenhum código lê `src/main/resources/services.json` | Recurso morto | Baixa |
| DT-12 | `ApiException` presa na camada web | `infrastructure/web/exception`, usada pelos services ([ADR-003](adrs.md#adr-003-taxonomia-de-erros-da-api)) | Application depende de infraestrutura | Baixa |
| DT-13 | Nome do petshop exibido é o nome do owner | `PetshopController` usa `u.getName()` em vez de `businessName` | Tutor vê o nome da pessoa e não da loja | Baixa |
