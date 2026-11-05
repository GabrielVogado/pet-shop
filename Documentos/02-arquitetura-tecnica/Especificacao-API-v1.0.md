# API REST

> Estado medido nos controllers da branch `develop` em 05/11/2026. A especificação OpenAPI gerada pelo Quarkus fica em `GET /q/openapi`.

Autenticação: `Authorization: Bearer <JWT>` obtido em `/api/auth/login` ou `/api/auth/register`. Erros retornam o status HTTP com mensagem em português.

## Autenticação (`/api/auth`, público)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cria tutor (exige telefone e endereço; pode incluir o primeiro pet) ou owner (exige nome da loja; bloqueado se já houver um owner) |
| POST | `/api/auth/login` | Login por e-mail e senha. Limite de 5 chamadas por minuto |

## Petshops (`/api/petshops`, público)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/petshops` | Lista o petshop cadastrado (retorna no máximo um; o nome exibido é o nome do owner, não `businessName`) |

## Pets (`/api/pets`, perfil tutor)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/pets` | Pets do tutor logado |
| POST | `/api/pets` | Cadastra pet |
| GET | `/api/pets/{id}` | Detalhe de um pet do tutor |
| PUT | `/api/pets/{id}` | Edita pet do tutor |

## Serviços e catálogo (`/api/servicos`)

| Método | Rota | Perfil | Descrição |
|---|---|---|---|
| POST | `/api/servicos` | owner | Cria serviço na própria loja e emite evento SSE `ADDED` |
| GET | `/api/servicos` | owner | Serviços da própria loja |
| DELETE | `/api/servicos/{id}` | owner | Remove serviço da própria loja e emite evento SSE `REMOVED` |
| GET | `/api/servicos/catalogo?petshopId=` | público | Catálogo do petshop separado em banhos e vacinas |
| GET | `/api/servicos/catalogo/stream?petshopId=` | público | Stream SSE de mudanças no catálogo |

## Agendamentos (`/api/agendamentos`)

| Método | Rota | Perfil | Descrição |
|---|---|---|---|
| GET | `/api/agendamentos?petId=` | tutor, owner | Tutor: seu histórico (opcionalmente de um pet). Owner: agenda da loja com e-mail, telefone e dados do pet |
| POST | `/api/agendamentos` | tutor | Cria agendamento (ver [Regras de Negócio](../_historico/Documento-Negocial-v1.0.md#regras-de-negócio)) |
| GET | `/api/agendamentos/availability?petshopId=&serviceId=&date=` | tutor | Dias com vaga nos próximos 14 dias e horários livres da data |
| PUT | `/api/agendamentos/{id}/cancel` | tutor, owner | Cancela agendamento com status Agendado |

## Notificações (`/api/notifications`, perfil tutor)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/notifications` | Notificações do tutor logado |
