# ADRs — PetCare Agenda

Registros de decisão de arquitetura. Numeração sequencial; um ADR substituído continua aqui com o status atualizado.

| ADR | Decisão | Status |
|---|---|---|
| [ADR-001](#adr-001-services-injetam-os-repositórios-mongo-diretamente) | Services injetam os repositórios Mongo diretamente | Aceito, implementado |
| [ADR-002](#adr-002-índice-único-parcial-para-garantir-um-único-owner) | Índice único parcial para um único owner | Aceito, será substituído pelo multi-petshop |
| [ADR-003](#adr-003-taxonomia-de-erros-da-api) | Taxonomia de erros da API | Proposto |
| [ADR-004](#adr-004-eliminar-n1-na-listagem-de-agendamentos-do-owner) | Eliminar N+1 na agenda do owner | Proposto |
| [ADR-005](#adr-005-kid-no-header-do-jwt-para-rotação-de-chaves) | `kid` no header do JWT | Aceito, implementado |
| [ADR-006](#adr-006-flutter-no-app-mobile-e-kotlin-no-backend-quarkus) | Flutter no app mobile e Kotlin no backend Quarkus | Aceito |

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

## ADR-006: Flutter no app mobile e Kotlin no backend Quarkus

- **Status:** Aceito pelo PO em 05/11/2026, não implementado. A ferramenta de persistência (item 3) está recomendada e aguarda confirmação do PO.
- **Data:** 05/11/2026
- **Decisor:** Gabriel Vogado (PO)

### Contexto

O roadmap pede **app mobile** (Épico 3) e continua precisando de interface web para tutor e petshop. Hoje o frontend é uma SPA React 19 + Vite, só web (36 arquivos em `pet-shop-frontend/src`), e o backend é Quarkus 3.15 em Java 17 (48 classes em `pet-shop-backend/src/main`), com persistência em JNoSQL 3.3.0 sobre MongoDB.

O PO propôs:

> "ao inves de utilizar o React, estou pensando em utilizar Flutter e para o backend quero utilizar Quarkus com Kotlin"

### Decisão

Respostas do PO em 05/11/2026 às perguntas que ficaram em aberto na proposta:

| Pergunta | Resposta do PO |
|---|---|
| A troca vem antes do Épico 1 (vários petshops) ou junto com ele? | **Junto com o Épico 1** |
| O backend migra para Kotlin aos poucos ou de uma vez? | **De uma vez** |
| A persistência fica no JNoSQL ou passa para Panache Kotlin? | PO pediu a recomendação da melhor ferramenta (ver abaixo) |
| A web também vai para Flutter, ou só o app mobile? | **Só o app mobile** |

Com isso, a decisão fica:

1. **Web continua em React** (SPA atual, React 19 + Vite). Não há reescrita da web.
2. **App mobile em Flutter** (Android e iOS), consumindo a mesma API REST. É a opção C do frontend.
3. **Backend reescrito em Kotlin de uma vez**, no mesmo Quarkus, junto com o Épico 1. A API REST, o MongoDB, o JWT RS256 e o SSE continuam iguais para os clientes.
4. **Persistência: `quarkus-mongodb-panache-kotlin`** (recomendação, aguardando confirmação do PO).

### Opções consideradas

**Frontend**

| Opção | Complexidade | Familiaridade da equipe | Web | Mobile | Observação |
|---|---|---|---|---|---|
| A. Flutter para web e mobile | Alta: reescrita total, Dart novo | Baixa | Funciona, carregamento inicial pesado e SEO fraco | Nativo, uma base | Descartada: o PO manteve a web em React |
| B. React web + React Native/Expo no mobile | Média: web aproveitada, app novo | Alta: já é React; o Saúde Monitor usa Expo | Mantém a SPA atual | Bom, base separada da web | Não escolhida |
| **C. React web mantido + Flutter só no mobile** (escolhida) | Média | Mista | Mantém a SPA atual | Nativo | Duas bases em duas linguagens |

**Backend**

| Opção | Complexidade | Familiaridade | Observação |
|---|---|---|---|
| **A. Quarkus em Kotlin, de uma vez** (escolhida) | Média/alta: reescrever 48 classes e os testes | A desenvolver | Menos código repetitivo, null-safety |
| A'. Quarkus em Kotlin, aos poucos (Java e Kotlin convivendo) | Média | A desenvolver | Não escolhida pelo PO |
| B. Quarkus em Java (atual, subir para Java 21) | Baixa | Alta | Não escolhida |

**Persistência (MongoDB)**

O código atual usa o `Template` do Jakarta NoSQL em 5 repositórios (`infrastructure/persistence/Mongo*Repository`) com consultas simples (`select(...).where(...).eq(...)`). As necessidades que já estão no backlog pesam mais que o código atual: reserva atômica de horário (DT-03), disponibilidade sem centenas de consultas (DT-04), lista de agendamentos sem N+1 (DT-05) e, com o Épico 1, filtro por `petshopId` em todas as consultas.

| Critério | JNoSQL (`quarkus-jnosql-document-mongodb`, atual) | **Panache Kotlin (`quarkus-mongodb-panache-kotlin`)** | Driver Kotlin com coroutines (`mongodb-driver-kotlin-coroutine`) |
|---|---|---|---|
| Quem mantém | Quarkiverse (comunidade), versão própria (3.3.0) fora do BOM do Quarkus | Projeto Quarkus, no BOM, sai junto com cada versão | MongoDB, fora do Quarkus |
| Kotlin | Funciona, mas a API é Java (Optional, builders); entidades precisam do plugin `no-arg` | API feita para Kotlin: `PanacheMongoRepository`, `PanacheMongoCompanion`, retorno anulável em vez de `Optional` | Nativo de Kotlin, com `suspend` |
| Operação atômica (DT-03) | O `Template` não expõe `findOneAndUpdate`; precisa descer ao driver | `mongoCollection().findOneAndUpdate(...)` disponível no próprio repositório | Disponível |
| Agregações (DT-04, DT-05) | Não tem API de agregação; precisa descer ao driver | `mongoCollection().aggregate(...)` | Disponível |
| Transações | Sem suporte declarativo | `@Transactional` com MongoDB em replica set | Manual, com `ClientSession` |
| Integração Quarkus (Dev Services, health, métricas, build nativo) | Parcial | Completa | Nenhuma: configuração e ciclo de vida à mão |
| Esforço na reescrita | Mantém as anotações `jakarta.nosql`, mas segue com a API Java | Troca as anotações por `@MongoEntity`/`@BsonId` e reescreve 5 repositórios | Reescreve tudo e perde a integração com Quarkus |

**Recomendação: Panache Kotlin.** Como o backend será reescrito de uma vez, o custo de trocar a persistência já está dentro da reescrita. O Panache Kotlin é mantido pelo próprio Quarkus, tem API pensada para Kotlin e dá acesso direto ao driver para as três correções de dados que o backlog já pede (reserva atômica, disponibilidade e N+1). Com JNoSQL, essas correções precisariam contornar a biblioteca. O driver com coroutines só compensaria num backend todo reativo, o que não é o caso hoje.

### Análise dos trade-offs

- Manter a web em React elimina o maior custo da proposta original: não há reescrita de 36 arquivos nem dos testes de interface, e a página pública de busca de petshops (Épico 1) continua sem o problema de SEO do Flutter web.
- O preço é ter duas bases de interface em duas linguagens (TypeScript e Dart). As regras de negócio ficam no backend, então a duplicação se limita a telas e validações de formulário.
- Reescrever o backend de uma vez **junto** com o Épico 1 concentra risco: a troca de linguagem, de persistência e o novo modelo multi-petshop entram no mesmo período. A mitigação é tratar a API atual como contrato: os testes de integração REST existentes são portados primeiro e precisam passar contra o backend Kotlin antes das funcionalidades novas.
- Fazer a troca junto com o Épico 1 evita escrever o modelo multi-petshop em Java e reescrevê-lo logo depois em Kotlin.

### Consequências

**Ganhos**
- A web atual segue funcionando e evoluindo sem reescrita.
- O app mobile nasce nativo em Flutter para Android e iOS.
- Kotlin reduz código repetitivo no backend (data classes, null-safety no compilador).
- Com Panache Kotlin, reserva atômica, agregações e transações ficam disponíveis sem contornar a biblioteca.

**Custos e riscos**
- A equipe precisa dominar Dart/Flutter e Kotlin.
- Testes do app passam a ser `flutter_test` e `integration_test`; os da web (Vitest, Testing Library, Playwright) continuam.
- Kotlin no Quarkus precisa do plugin `all-open` para os beans CDI.
- A reescrita de uma vez trava o backend Java: correções em Java durante a reescrita precisam ser repetidas no Kotlin.
- As anotações e a migração dos índices (MIG-001, índice único do ADR-002) precisam ser refeitas no Panache; o ADR-002 será substituído pelo ADR de multi-tenancy do Épico 1.

### Próximos passos

1. [x] Responder às perguntas em aberto e mudar o status para Aceito.
2. [ ] PO confirmar Panache Kotlin como persistência.
3. [ ] Spike de Kotlin + Panache no Quarkus: uma entidade, um repositório, um endpoint e a reserva atômica com `findOneAndUpdate`.
4. [ ] Spike de Flutter mobile com login e listagem de pets contra a API atual.
5. [ ] Estórias de migração no Roadmap (junto com o Épico 1) e no De-Para.

### Situação em 05/11/2026

Decisão aceita e documentada. O código continua em React e Java até as estórias de migração entrarem no Roadmap.
