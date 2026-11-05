# Regras de Negócio

> Regras medidas em `RegistrationService` e `AppointmentService` na branch `develop` em 05/11/2026.

## Cadastro

| ID | Regra |
|---|---|
| RN-01 | O perfil é `tutor` ou `owner`. |
| RN-02 | O tutor informa telefone e endereço obrigatoriamente; pode cadastrar o primeiro pet junto. |
| RN-03 | O owner informa o nome da loja. |
| RN-04 | Só pode existir **um owner** no sistema. A checagem é feita no código e reforçada por índice único parcial no MongoDB ([ADR-002](ADR/ADR-002-indice-unico-owner.md)). Todo owner recebe `petshopId = petshop-unico`. |
| RN-05 | Senha entre 6 e 100 caracteres, armazenada apenas como hash BCrypt. |

## Agendamento

| ID | Regra |
|---|---|
| RN-10 | Só agenda para data e hora futuras. |
| RN-11 | O pet precisa pertencer ao tutor logado. |
| RN-12 | O petshop precisa existir e o serviço precisa pertencer a ele. |
| RN-13 | A duração vem do serviço (primeiro número do texto, ex. "45 min"); sem número, assume 60 minutos. |
| RN-14 | Funcionamento de 9h às 18h, com horários a cada 30 minutos. O serviço precisa terminar até 18h. **Atenção:** só a consulta de disponibilidade aplica essa janela; o `POST /api/agendamentos` não valida horário de funcionamento nem a grade de 30 minutos. |
| RN-15 | Não pode haver sobreposição com outro agendamento `Agendado` do mesmo petshop: a loja atende **um serviço por vez**. |
| RN-16 | A disponibilidade mostra os dias com vaga entre hoje e os próximos 13 dias. |
| RN-17 | O tipo é `Banho` ou `Vacina`. |

## Cancelamento e notificação

| ID | Regra |
|---|---|
| RN-20 | Só agendamentos com status `Agendado` podem ser cancelados. |
| RN-21 | O tutor cancela apenas os próprios agendamentos. |
| RN-22 | O owner cancela apenas agendamentos da própria loja; o agendamento fica com `canceledBy = petshop`. |
| RN-23 | Cancelamento pelo petshop gera uma notificação para o tutor. |

## Lacunas conhecidas

- O `POST /api/agendamentos` aceita horários fora de 9h–18h (ver RN-14).
- Não existe regra nem endpoint para marcar um serviço como `Concluido`.
- Não há política de antecedência mínima para cancelar nem de no-show.
- Horário de funcionamento e capacidade são fixos no código, iguais para qualquer loja.
