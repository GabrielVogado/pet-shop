# ADR-004: Eliminar N+1 na listagem de agendamentos do owner

- **Status:** Proposto, não implementado
- **Data:** 01/08/2026 (revisado em 05/11/2026)

## Contexto

`AppointmentController.list` para o owner faz, para cada agendamento, `usuarios.findById` e `pets.findById`. Com N agendamentos são 2N consultas extras.

## Decisão proposta

1. Buscar os usuários e pets de uma vez (`$in` com os ids distintos) e montar mapas em memória antes de converter para `AgendamentoView`.
2. Avaliar desnormalizar e-mail e telefone do tutor no agendamento, como já é feito com nome e endereço.

## Situação em 05/11/2026

O N+1 continua no código (débito DT-05). Com vários petshops e agendas maiores, a correção entra junto com a paginação da agenda.
