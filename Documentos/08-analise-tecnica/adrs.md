# ADRs — PetCare Agenda

Registros de decisão de arquitetura. Numeração sequencial; um ADR substituído continua aqui com o status atualizado.

| ADR | Decisão | Status |
|---|---|---|
| [ADR-001](#adr-001-services-injetam-os-repositórios-mongo-diretamente) | Services injetam os repositórios Mongo diretamente | Aceito, implementado |
| [ADR-002](#adr-002-índice-único-parcial-para-garantir-um-único-owner) | Índice único parcial para um único owner | Aceito, será substituído pelo multi-petshop |
| [ADR-003](#adr-003-taxonomia-de-erros-da-api) | Taxonomia de erros da API | Proposto |
| [ADR-004](#adr-004-eliminar-n1-na-listagem-de-agendamentos-do-owner) | Eliminar N+1 na agenda do owner | Proposto |
| [ADR-005](#adr-005-kid-no-header-do-jwt-para-rotação-de-chaves) | `kid` no header do JWT | Aceito, implementado |
| [ADR-006](#adr-006-flutter-no-frontend-e-kotlin-no-backend-quarkus) | Flutter no frontend e Kotlin no backend Quarkus | Proposto |

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

---

## ADR-006: Flutter no frontend e Kotlin no backend Quarkus

- **Status:** Proposto (pelo PO em 05/11/2026), não implementado
- **Data:** 05/11/2026
- **Decisor:** Gabriel Vogado (PO)

### Contexto

O roadmap pede **app mobile** (Épico 3) e continua precisando de interface web para tutor e petshop. Hoje o frontend é uma SPA React 19 + Vite, só web (36 arquivos em `pet-shop-frontend/src`), e o backend é Quarkus 3.15 em Java 17 (48 classes em `pet-shop-backend/src/main`). Manter React na web e criar um app mobile à parte significaria duas bases de interface.

O PO propôs:

> "ao inves de utilizar o React, estou pensando em utilizar Flutter e para o backend quero utilizar Quarkus com Kotlin"

### Decisão proposta

1. **Frontend em Flutter**, uma base para Android, iOS e web, substituindo a SPA React.
2. **Backend continua em Quarkus, escrito em Kotlin**, substituindo o Java. A API REST, o MongoDB, o JWT RS256 e o SSE continuam iguais.

### Opções consideradas

**Frontend**

| Opção | Complexidade | Familiaridade da equipe | Web | Mobile | Observação |
|---|---|---|---|---|---|
| **A. Flutter para web e mobile** (proposta) | Alta: reescrita total, Dart novo | Baixa | Funciona, carregamento inicial pesado e SEO fraco | Nativo, uma base | Uma base para tudo |
| B. React web + React Native/Expo no mobile | Média: web aproveitada, app novo | Alta: já é React; o Saúde Monitor usa Expo | Mantém a SPA atual | Bom, base separada da web | Duas bases, mesma linguagem e parte da lógica compartilhável |
| C. React web mantido + Flutter só no mobile | Média | Mista | Mantém a SPA atual | Nativo | Duas bases em duas linguagens |

**Backend**

| Opção | Complexidade | Familiaridade | Observação |
|---|---|---|---|
| **A. Quarkus em Kotlin** (proposta) | Média: plugins `all-open`/`no-arg`, migração classe a classe possível | A desenvolver | Menos código repetitivo, null-safety |
| B. Quarkus em Java (atual, subir para Java 21) | Baixa | Alta | Records e pattern matching já reduzem boa parte do código repetitivo |

### Análise dos trade-offs

- O maior custo da proposta está no frontend: é uma reescrita de 36 arquivos e de todos os testes de interface, sem ganho funcional imediato para o usuário. O ganho aparece no Épico 3, quando o app mobile sai da mesma base.
- A opção B do frontend chega ao app mobile com menos risco para quem já sabe React e mantém a web como está, ao custo de duas bases.
- No backend, Kotlin é uma troca de linguagem dentro do mesmo framework: a API, o banco e a segurança não mudam, e Java e Kotlin podem conviver durante a migração. O risco é baixo se for gradual.

### Consequências (se a proposta A for aceita)

**Ganhos**
- Uma base de código de interface para web e mobile: o Épico 3 deixa de ser um app separado.
- Kotlin reduz código repetitivo no backend (data classes no lugar de getters/setters, null-safety no compilador) e convive com Java no mesmo projeto Maven, o que permite migrar classe por classe.

**Custos e riscos**
- O frontend é **reescrito do zero**: nada do React, do Tailwind, da organização FSD nem dos testes (Vitest, Testing Library, Playwright) é aproveitado. Testes passam a ser `flutter_test` e `integration_test`.
- Flutter na web gera uma aplicação pesada no primeiro carregamento e fraca para SEO. Para o painel do petshop isso pesa pouco; para uma página pública de busca de petshops (Épico 1), pesa mais.
- Kotlin no Quarkus precisa dos plugins `all-open` (beans CDI) e `no-arg` (entidades persistidas), e o JNoSQL com Kotlin precisa ser validado. Alternativa a avaliar: `quarkus-mongodb-panache-kotlin`.
- A equipe precisa dominar Dart/Flutter e Kotlin.

### Perguntas em aberto (para o PO)

1. A troca acontece **antes** do Épico 1 (vários petshops) ou junto com ele?
2. Backend: migrar para Kotlin **aos poucos** (Java e Kotlin convivendo) ou reescrever de uma vez?
3. Persistência: manter JNoSQL ou trocar por Panache Kotlin?
4. A web do tutor e do petshop também vai para Flutter, ou só o app mobile?

### Próximos passos (se aceito)

1. [ ] Responder às perguntas em aberto e mudar o status para Aceito.
2. [ ] Spike de Kotlin no Quarkus com JNoSQL (uma entidade, um repositório, um endpoint) antes de migrar o resto.
3. [ ] Spike de Flutter web + mobile com login e listagem de pets contra a API atual.
4. [ ] Estórias de migração no Roadmap e no De-Para.

### Situação em 05/11/2026

Somente documentado. O código continua em React e Java. Quando o PO aprovar, este ADR passa a "Aceito" e o [Roadmap](../04-backlog/Roadmap-v1.0.md) ganha as estórias de migração.
