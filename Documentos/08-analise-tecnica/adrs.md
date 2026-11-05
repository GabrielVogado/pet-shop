# ADRs — PetCare Agenda

Registros de decisão de arquitetura. Numeração sequencial; um ADR substituído continua aqui com o status atualizado.

| ADR | Decisão | Status |
|---|---|---|
| [ADR-001](#adr-001-services-injetam-os-repositórios-mongo-diretamente) | Services injetam os repositórios Mongo diretamente | Aceito, implementado |
| [ADR-002](#adr-002-índice-único-parcial-para-garantir-um-único-owner) | Índice único parcial para um único owner | Aceito, será substituído pelo multi-petshop |
| [ADR-003](#adr-003-taxonomia-de-erros-da-api) | Taxonomia de erros da API | Proposto |
| [ADR-004](#adr-004-eliminar-n1-na-listagem-de-agendamentos-do-owner) | Eliminar N+1 na agenda do owner | Proposto |
| [ADR-005](#adr-005-kid-no-header-do-jwt-para-rotação-de-chaves) | `kid` no header do JWT | Aceito, implementado |
| [ADR-006](#adr-006-flutter-na-web-e-no-mobile-e-kotlin-no-backend-quarkus) | Flutter na web e no mobile e Kotlin no backend Quarkus | Aceito |
| [ADR-007](#adr-007-provedor-de-pagamento) | Provedor de pagamento | Proposto |

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

## ADR-006: Flutter na web e no mobile e Kotlin no backend Quarkus

- **Status:** Aceito pelo PO em 05/11/2026, com mudança de escopo no mesmo dia (web também em Flutter). Não implementado.
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
| A persistência fica no JNoSQL ou passa para Panache Kotlin? | **Panache Kotlin**, escolhido pelo PO após a comparação abaixo |
| A web também vai para Flutter, ou só o app mobile? | Primeiro "só o app mobile"; no mesmo dia o PO mudou o escopo: **a web também vai para Flutter** |

Com isso, a decisão fica:

1. **Frontend em Flutter, web e mobile numa base só** (Android, iOS e web), substituindo a SPA React. É a opção A do frontend.
2. A reescrita do frontend acompanha a do backend, junto com o Épico 1.
3. **Backend reescrito em Kotlin de uma vez**, no mesmo Quarkus, junto com o Épico 1. A API REST, o MongoDB, o JWT RS256 e o SSE continuam iguais para os clientes.
4. **Persistência: `quarkus-mongodb-panache-kotlin`**, substituindo o JNoSQL.

### Opções consideradas

**Frontend**

| Opção | Complexidade | Familiaridade da equipe | Web | Mobile | Observação |
|---|---|---|---|---|---|
| **A. Flutter para web e mobile** (escolhida) | Alta: reescrita total, Dart novo | Baixa | Funciona, carregamento inicial pesado e SEO fraco | Nativo, uma base | Uma base para tudo |
| B. React web + React Native/Expo no mobile | Média: web aproveitada, app novo | Alta: já é React | Mantém a SPA atual | Bom, base separada da web | Não escolhida |
| C. React web mantido + Flutter só no mobile | Média | Mista | Mantém a SPA atual | Nativo | Escolhida no início, substituída pela A na mudança de escopo |

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

**Recomendação: Panache Kotlin** (confirmada pelo PO em 05/11/2026). Como o backend será reescrito de uma vez, o custo de trocar a persistência já está dentro da reescrita. O Panache Kotlin é mantido pelo próprio Quarkus, tem API pensada para Kotlin e dá acesso direto ao driver para as três correções de dados que o backlog já pede (reserva atômica, disponibilidade e N+1). Com JNoSQL, essas correções precisariam contornar a biblioteca. O driver com coroutines só compensaria num backend todo reativo, o que não é o caso hoje.

### Análise dos trade-offs

- Uma base única em Flutter elimina a duplicação de telas entre web e mobile: o Épico 3 (app mobile) deixa de ser um projeto separado.
- O custo é reescrever do zero os 36 arquivos da SPA React e todos os testes de interface, sem ganho funcional imediato para o usuário.
- Flutter na web tem carregamento inicial pesado e SEO fraco. Isso pesa pouco no painel do petshop e na área logada do tutor, mas pesa na página pública de busca de petshops (Épico 1). Se essa página precisar ser encontrada por buscadores, ela pode ficar como página estática/servidor à parte; a decisão fica para o ADR do Épico 1.
- Reescrever backend e frontend de uma vez **junto** com o Épico 1 concentra risco: a troca de linguagens, de persistência, de toda a interface e o novo modelo multi-petshop entram no mesmo período. A mitigação é tratar a API atual como contrato: os testes de integração REST existentes são portados primeiro e precisam passar contra o backend Kotlin antes das funcionalidades novas.
- Fazer a troca junto com o Épico 1 evita escrever o modelo multi-petshop em Java e reescrevê-lo logo depois em Kotlin.

### Consequências

**Ganhos**
- Uma base de interface para web, Android e iOS.
- O app mobile sai da mesma base da web, sem projeto separado.
- Kotlin reduz código repetitivo no backend (data classes, null-safety no compilador).
- Com Panache Kotlin, reserva atômica, agregações e transações ficam disponíveis sem contornar a biblioteca.

**Custos e riscos**
- A equipe precisa dominar Dart/Flutter e Kotlin.
- O frontend React é reescrito do zero: nada do React, do Tailwind, da organização FSD nem dos testes (Vitest, Testing Library, Playwright) é aproveitado. Os testes passam a ser `flutter_test` e `integration_test`.
- Flutter web: carregamento inicial pesado e SEO fraco (ver trade-offs).
- Até a troca, a SPA React fica congelada: só correções, para não haver trabalho duplicado.
- Kotlin no Quarkus precisa do plugin `all-open` para os beans CDI.
- A reescrita de uma vez trava o backend Java: correções em Java durante a reescrita precisam ser repetidas no Kotlin.
- As anotações e a migração dos índices (MIG-001, índice único do ADR-002) precisam ser refeitas no Panache; o ADR-002 será substituído pelo ADR de multi-tenancy do Épico 1.

### Próximos passos

1. [x] Responder às perguntas em aberto e mudar o status para Aceito.
2. [x] PO confirmar Panache Kotlin como persistência.
3. [ ] Spike de Kotlin + Panache no Quarkus: uma entidade, um repositório, um endpoint e a reserva atômica com `findOneAndUpdate`.
4. [ ] Spike de Flutter (web e mobile) com login e listagem de pets contra a API atual, medindo o tempo de carregamento inicial na web.
5. [ ] Estórias de migração no Roadmap (junto com o Épico 1) e no De-Para.

### Situação em 05/11/2026

Decisão aceita e documentada. O código continua em React e Java até as estórias de migração entrarem no Roadmap.


---

## ADR-007: Provedor de pagamento

- **Status:** Proposto (recomendação aguardando validação em sandbox e decisão do PO). O teste em sandbox fica pendente para depois da fase de documentação.
- **Data:** 05/11/2026
- **Decisor:** Gabriel Vogado (PO)

### Contexto

O [Documento Negocial v2.0](../01-negocio/Documento-Negocial-v2.0.md) define o fluxo de dinheiro (RN-50 a RN-55). O provedor escolhido precisa cobrir:

1. **Recebimento direto pela loja (RN-53):** cada loja tem a própria conta recebedora; o PetCare cria a cobrança e não recebe nem repassa o dinheiro.
2. **Sinal de 50% (RN-51):** cobrado na confirmação da loja, em cartão de crédito, Pix ou débito. O sinal vira multa se o tutor cancelar depois de 2h antes ou faltar (RN-46, RN-47), e é devolvido nos demais casos.
3. **Cartão de garantia (RN-50):** cartão de crédito guardado (tokenizado), sem que o PetCare toque nos dados do cartão (RNF-10).
4. **Restante após o atendimento (RN-52):** cobrado pelo app ou pago na loja.
5. **Estorno** total do sinal.
6. **Mensalidade da loja:** cobrança recorrente de valor fixo, paga ao PetCare, sem período grátis; inadimplência tira a loja da busca (RN-17).
7. **Taxa do provedor** fica com a loja (RN-54).
8. Brasil inteiro, em reais; volume inicial de ~30 lojas (RNF-01).

### Decisão proposta

Por decisão do PO em 05/11/2026, a fase de documentação segue só com estimativas; o teste em sandbox é uma **pendência para depois dela**. Escolher o provedor depois de um **spike em sandbox** com os dois candidatos mais fortes (abaixo). A recomendação atual é o **Asaas**, com o **Stripe Connect** como alternativa. Nada disso foi testado: a recomendação vem da leitura da documentação pública e muda se o spike mostrar que um requisito não se cumpre.

### Como foi verificado

Pesquisa na documentação pública em 05/11/2026. A coluna "Fonte" diz o que foi confirmado e o que ficou em aberto.

| Provedor | O que a documentação confirma | O que ficou em aberto |
|---|---|---|
| **Asaas** | Split para subcontas por `walletId`, em valor fixo ou percentual sobre o valor líquido. Estorno da cobrança estorna os repasses. Há split em assinaturas e webhook por split (`PAYMENT_SPLIT_DONE`). | A cobrança nasce na conta que a criou e o split reparte o saldo. Falta confirmar se o PetCare consegue criar a cobrança **na conta da loja** (para não passar o dinheiro pela conta do PetCare). Cartão tokenizado, Pix e débito não foram detalhados na página consultada. |
| **Stripe Connect** | Pix funciona em contas do Brasil, inclusive em Connect (cobranças diretas na conta conectada). Reembolso total e parcial de Pix em até 90 dias. Billing disponível para a mensalidade. | Disponibilidade de contas conectadas brasileiras e o custo não foram confirmados. Pix Automático não existe para empresas do Brasil. O Pix não tem captura manual nem pré-autorização. A lista de categorias proibidas para Pix inclui serviços médicos (MCC 8099); falta confirmar com o Stripe como a consulta veterinária é classificada. |
| **Mercado Pago** | Marketplace com OAuth do vendedor; modelo 1:1 documentado. | O modelo 1:N (um pagamento para vários vendedores) só para "carteira assessorada". A página consultada era a do México; a elegibilidade no Brasil não foi confirmada. |
| **Pagar.me** | Citado como alternativa de recebedores e split. | A busca não retornou a documentação oficial: nada foi confirmado. |
| **Iugu** | Documentação de marketplace com "split por fatura". | Nada além disso foi confirmado. |

### Opções consideradas

| Opção | Aderência aos requisitos | Complexidade | Observação |
|---|---|---|---|
| **A. Asaas** (recomendada, a validar) | Alta no papel: subcontas, split, assinaturas, Pix e cartão no Brasil | Média | Provedor brasileiro; o ponto crítico é cobrar na conta da loja (RN-53) |
| **B. Stripe Connect** | Alta em Pix e Connect; Billing resolve a mensalidade | Média/alta | Boa documentação e SDKs; confirmar contas conectadas no Brasil e a classificação (MCC) das lojas com consulta veterinária |
| C. Mercado Pago | Média: 1:1 funciona, 1:N exige carteira assessorada | Média | Elegibilidade no Brasil a confirmar |
| D. Pagar.me | Não verificada | — | Reavaliar se A e B falharem |
| E. Iugu | Não verificada | — | Reavaliar se A e B falharem |
| F. Cada loja conecta o próprio provedor | Atende RN-53 por definição | Alta | Cada loja teria um contrato diferente; difícil de suportar e de padronizar |

### Análise dos trade-offs

- **O requisito que mais pesa é RN-53.** Se o PetCare criar as cobranças na própria conta e repartir por split, o dinheiro passa pela conta do PetCare, ainda que por instantes. Isso pode trazer exigências de responsabilidade por estornos e disputas. O spike precisa dizer se cada provedor permite cobrar diretamente na conta da loja.
- **Pix e sinal:** o Pix não pré-autoriza. O sinal em Pix é pago na hora e devolvido por estorno, o que funciona. Já o "cartão de garantia" só serve para crédito.
- **Mensalidade:** é uma cobrança do PetCare para a loja, em conta própria, e não entra no split. Os dois candidatos têm assinatura recorrente.
- **Risco de dependência:** o provedor fica atrás de uma interface do backend (`PagamentoGateway`), para trocar de provedor sem reescrever as regras de agendamento.
- **Segurança:** o cartão é tokenizado no provedor e o PetCare só guarda o token (RNF-10). O backend valida a assinatura dos webhooks.

### Consequências

**Ganhos**
- O PetCare não guarda dados de cartão e, se RN-53 for cumprida, também não guarda o dinheiro das lojas.
- A troca de provedor fica isolada atrás de uma interface.

**Custos e riscos**
- Cada loja passa por um cadastro (KYC) no provedor antes de receber, o que é mais uma etapa no onboarding.
- Estornos, disputas e conciliação dos 50% precisam de tratamento no backend (webhooks e uma tabela de pagamentos).
- A multa de 50% pode ser contestada pelo tutor junto ao banco ou ao cartão.
- Os termos de uso precisam descrever o sinal, a multa e o estorno com clareza (revisão jurídica, como no RNF-11).

### Perguntas em aberto

1. Cada provedor permite que o PetCare crie a cobrança direto na conta da loja?
2. As lojas com consulta veterinária são aceitas para Pix no Stripe (MCC)?
3. Qual é o custo real: taxa por transação (cartão e Pix), taxa por assinatura e prazo de repasse para a loja?
4. O repasse para a loja pode ser imediato ou segue um prazo (D+1, D+30 no cartão)? Isso afeta o fluxo de caixa das lojas.

### Próximos passos

1. [ ] (Pendente, depois da fase de documentação) Spike em sandbox com Asaas e Stripe: criar uma subconta, cobrar 50% em cartão e em Pix **na conta da loja**, estornar, e criar uma assinatura de mensalidade.
2. [ ] Levantar o custo real dos dois (tabela de taxas) e o prazo de repasse.
3. [ ] PO decidir com os resultados e mudar o status para Aceito.
4. [ ] Atualizar RN-53 e a pendência P-04 do Documento Negocial.

### Situação em 05/11/2026

Proposto. Nada foi testado, e nenhum provedor foi contratado. O PO decidiu seguir por enquanto só com estimativas e fazer o teste em sandbox depois da fase de documentação.
