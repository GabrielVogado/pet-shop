# ADRs — PetCare Agenda

Registros de decisão de arquitetura. Numeração sequencial; um ADR substituído continua aqui com o status atualizado.

| ADR | Decisão | Status |
|---|---|---|
| [ADR-001](#adr-001-services-injetam-os-repositórios-mongo-diretamente) | Services injetam os repositórios Mongo diretamente | Aceito, implementado |
| [ADR-002](#adr-002-índice-único-parcial-para-garantir-um-único-owner) | Índice único parcial para um único owner | Aceito, será substituído pelo multi-petshop |
| [ADR-003](#adr-003-taxonomia-de-erros-da-api) | Taxonomia de erros da API | Proposto |
| [ADR-004](#adr-004-eliminar-n1-na-listagem-de-agendamentos-do-owner) | Eliminar N+1 na agenda do owner | Proposto |
| [ADR-005](#adr-005-kid-no-header-do-jwt-para-rotação-de-chaves) | `kid` no header do JWT | Aceito, implementado |

---

## ADR-001: Services injetam os repositórios Mongo diretamente

- **Status:** Aceito, implementado
- **Data:** 01/08/2026 (revisado em 05/11/2026)

### Contexto

A migração para Clean Architecture (PR #4) criou seis interfaces em `application/port/`, cada uma com uma única implementação Mongo. Elas só repassavam chamadas e não havia plano de trocar o banco.

### Decisão

Remover as interfaces de port. Os services em `application/service` injetam diretamente as classes `Mongo*Repository` de `infrastructure/persistence`.

### Consequências

- Menos código e menos indireção.
- A camada `application` depende de `infrastructure`. Se um dia houver segundo banco ou testes que precisem de dublês sem Mockito, as interfaces voltam.
- Verificado em 05/11/2026: não existe `application/port/` e os services usam `Mongo*Repository`.

---

## ADR-002: Índice único parcial para garantir um único owner

- **Status:** Aceito, implementado. **Será substituído** pelo ADR de multi-tenancy do Épico 1 (vários petshops).
- **Data:** 01/08/2026 (revisado em 05/11/2026)

### Contexto

O MVP aceita um único petshop. A checagem `existsOwner()` seguida de `insert` tinha condição de corrida: dois cadastros simultâneos de owner podiam passar.

### Decisão

Criar no MongoDB um índice único parcial sobre `role` com `partialFilterExpression: { role: "owner" }`. O `RegistrationService` trata o erro de chave duplicada (E11000) como conflito HTTP 409.

Script registrado como aplicado na migração MIG-001 (fora do repositório):

```js
db.usuario.createIndex(
  { role: 1 },
  { name: "idx_usuario_role_owner_unique", unique: true, partialFilterExpression: { role: "owner" } }
)
```

O nome da coleção (`usuario`) vem do registro da migração; confirme no banco antes de reaplicar, porque o JNoSQL usa o nome da classe da entidade (`Usuario`) quando `@Entity` não define nome.

### Consequências

- Garante atomicamente um único owner.
- O índice é criado por script manual; o código não o cria. Ambiente novo sem o script fica só com a checagem em código.
- Contradiz diretamente o objetivo de ter vários petshops: o índice precisa ser removido na migração do Épico 1.

---

## ADR-003: Taxonomia de erros da API

- **Status:** Proposto, não implementado
- **Data:** 01/08/2026 (revisado em 05/11/2026)

### Contexto

Os services lançam `ApiException`, que fica em `infrastructure/web/exception` e carrega status HTTP. A camada de aplicação conhece detalhes de HTTP.

### Decisão proposta

1. Mover `ApiException` para `shared/exception`.
2. Depois, criar exceções de domínio sem HTTP (`NotFound`, `Forbidden`, `Conflict`, `BusinessRule`) e mapear para status no `ApiExceptionMapper`.
3. Padronizar o corpo de erro com código estável, mensagem e campo, para o app mobile tratar erros sem depender do texto.

### Situação em 05/11/2026

Nenhuma fase aplicada: `ApiException` continua em `infrastructure/web/exception`. O item 3 ganha importância com o app mobile (Épico 3).

---

## ADR-004: Eliminar N+1 na listagem de agendamentos do owner

- **Status:** Proposto, não implementado
- **Data:** 01/08/2026 (revisado em 05/11/2026)

### Contexto

`AppointmentController.list` para o owner faz, para cada agendamento, `usuarios.findById` e `pets.findById`. Com N agendamentos são 2N consultas extras.

### Decisão proposta

1. Buscar os usuários e pets de uma vez (`$in` com os ids distintos) e montar mapas em memória antes de converter para `AgendamentoView`.
2. Avaliar desnormalizar e-mail e telefone do tutor no agendamento, como já é feito com nome e endereço.

### Situação em 05/11/2026

O N+1 continua no código (débito DT-05). Com vários petshops e agendas maiores, a correção entra junto com a paginação da agenda.

---

## ADR-005: `kid` no header do JWT para rotação de chaves

- **Status:** Aceito, implementado
- **Data:** 01/08/2026 (renumerado em 05/11/2026; antes era um segundo "ADR-003")

### Contexto

Sem identificador de chave no token, trocar o par RSA invalida todas as sessões de uma vez e não permite ter duas chaves válidas durante a transição.

### Decisão

`JwtTokenProvider` assina com `.jws().keyId(...)`, lendo `petcare.jwt.kid` (padrão `petcare-rsa-key`).

### Consequências

- Permite rotação gradual quando a verificação passar a aceitar mais de uma chave pública (JWKS).
- Hoje a verificação usa uma única `JWT_PUBLIC_KEY`; a rotação com duas chaves ainda não está implementada.
