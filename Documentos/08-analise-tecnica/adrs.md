# ADRs — PetCare Agenda

Registros de decisão de arquitetura. Numeração sequencial; um ADR substituído continua aqui com o status atualizado.

| ADR | Decisão | Status |
|---|---|---|
| [ADR-001](#adr-001-services-injetam-os-repositórios-mongo-diretamente) | Services injetam os repositórios Mongo diretamente | Aceito, implementado |
| [ADR-002](#adr-002-índice-único-parcial-para-garantir-um-único-owner) | Índice único parcial para um único owner | Substituído pelo ADR-008 |
| [ADR-003](#adr-003-taxonomia-de-erros-da-api) | Taxonomia de erros da API | Proposto |
| [ADR-004](#adr-004-eliminar-n1-na-listagem-de-agendamentos-do-owner) | Eliminar N+1 na agenda do owner | Proposto |
| [ADR-005](#adr-005-kid-no-header-do-jwt-para-rotação-de-chaves) | `kid` no header do JWT | Aceito, implementado |
| [ADR-006](#adr-006-flutter-na-web-e-no-mobile-e-kotlin-no-backend-quarkus) | Flutter na web e no mobile e Kotlin no backend Quarkus | Aceito |
| [ADR-007](#adr-007-provedor-de-pagamento) | Provedor de pagamento | Proposto |
| [ADR-008](#adr-008-isolamento-entre-lojas-multi-tenancy) | Isolamento entre lojas (multi-tenancy) | Aceito |
| [ADR-009](#adr-009-arquitetura-do-app-flutter) | Arquitetura do app Flutter | Aceito |

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

- **Status:** Substituído pelo [ADR-008](#adr-008-isolamento-entre-lojas-multi-tenancy) em 10/11/2026. O índice continua no código atual até a reescrita.
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
2. **Sinal definido pela loja (RN-51, RN-56):** percentual do total, de 0% a 100%, cobrado em cartão de crédito, Pix ou débito. O sinal é cobrado ao pedir (P-07, decidido pelo PO em 10/11/2026). Se o tutor cancelar com menos de 2h ou faltar, o sinal é aplicado na multa da loja (RN-46, RN-47, RN-57); nos demais casos, é devolvido ou abatido do serviço. Estorno parcial: quando o sinal é maior que a multa, a diferença volta ao tutor.
3. **Cartão de garantia (RN-50):** cartão de crédito guardado (tokenizado), sem que o PetCare toque nos dados do cartão (RNF-10). O provedor precisa permitir **cobrar o cartão guardado depois, sem o tutor presente**, na conta da loja, para cobrar a diferença quando a multa for maior que o sinal (RN-57).
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
- Estornos (inclusive parciais), cobranças da diferença da multa, disputas e conciliação precisam de tratamento no backend (webhooks e uma tabela de pagamentos).
- A multa, sobretudo a cobrada no cartão depois do atendimento, pode ser contestada pelo tutor junto ao banco ou ao cartão.
- Os termos de uso precisam descrever o sinal, a multa e o estorno com clareza (revisão jurídica, como no RNF-11).

### Perguntas em aberto

1. Cada provedor permite que o PetCare crie a cobrança direto na conta da loja?
2. As lojas com consulta veterinária são aceitas para Pix no Stripe (MCC)?
3. Qual é o custo real: taxa por transação (cartão e Pix), taxa por assinatura e prazo de repasse para a loja?
4. O repasse para a loja pode ser imediato ou segue um prazo (D+1, D+30 no cartão)? Isso afeta o fluxo de caixa das lojas.

### Próximos passos

1. [ ] (Pendente, depois da fase de documentação) Spike em sandbox com Asaas e Stripe: criar uma subconta, cobrar um sinal em cartão e em Pix **na conta da loja**, estornar total e parcialmente, cobrar depois o cartão guardado sem o tutor presente, e criar uma assinatura de mensalidade.
2. [ ] Levantar o custo real dos dois (tabela de taxas) e o prazo de repasse.
3. [ ] PO decidir com os resultados e mudar o status para Aceito.
4. [ ] Atualizar RN-53 e a pendência P-04 do Documento Negocial.

### Situação em 05/11/2026

Proposto. Nada foi testado, e nenhum provedor foi contratado. O PO decidiu seguir por enquanto só com estimativas e fazer o teste em sandbox depois da fase de documentação.


---

## ADR-008: Isolamento entre lojas (multi-tenancy)

- **Status:** Aceito pelo PO em 10/11/2026. Substitui o ADR-002. Não implementado.
- **Data:** 10/11/2026
- **Decisor:** Gabriel Vogado (PO)

### Contexto

O sistema-alvo é um marketplace: muitas lojas (CNPJ), cada uma com várias unidades, usando a mesma plataforma ([Documento Negocial v2.0](../01-negocio/Documento-Negocial-v2.0.md), RN-10). Uma loja nunca pode ler nem alterar dados de outra. O tutor, por outro lado, não pertence a nenhuma loja: pets, carteira e histórico são dele, e cada loja só vê o que as regras RN-22 e RN-23 permitem.

Volume previsto para o primeiro ano: pelo menos 30 lojas e 100 tutores (RNF-01). O ADR-002 (índice único para um único owner) deixa de valer.

### Decisão proposta

1. **Tenant = loja** (empresa, CNPJ). A unidade é parte da loja e não é tenant.
2. **Um banco MongoDB e coleções compartilhadas.** Todo documento que pertence a uma loja tem o campo `lojaId` (unidades, catálogo, capacidade, agendamentos, pagamentos, avaliações recebidas).
3. **Dados do tutor ficam fora do tenant:** usuário tutor, pets, carteira de vacinas e histórico não têm `lojaId`. A loja os acessa só por serviços de aplicação que conferem a regra (agendamento com a loja, ou permissão do tutor).
4. **O `lojaId` vem do token**, nunca do corpo ou da URL fornecidos pelo cliente. Para uma loja logada, qualquer consulta é montada com `lojaId` do token.
5. **Os repositórios de dados de loja só têm métodos que exigem `lojaId`.** Não existe `findById(id)` sem `lojaId` nessas coleções. Um repositório base em Kotlin aplica o filtro e a revisão de código verifica o uso.
6. **Índices começam por `lojaId`** (por exemplo `lojaId + unidadeId + inicio` na agenda), o que também acelera as consultas.
7. **Teste de isolamento obrigatório:** para cada recurso de loja, um teste cria duas lojas e confirma que a loja A recebe 404 ao pedir dado da loja B.

### Opções consideradas

| Opção | Isolamento | Complexidade | Custo | Observação |
|---|---|---|---|---|
| **A. Coleções compartilhadas com `lojaId`** (proposta) | Por código e testes | Baixa | Baixo: um banco | Risco de esquecer o filtro, mitigado pelo repositório base e pelo teste de isolamento |
| B. Um banco por loja | Forte | Alta | Alto: 30 bancos a operar, migrar e fazer backup; limites do plano do Atlas | Exagero para 30 lojas |
| C. Uma coleção por loja | Média | Média/alta | Médio | Milhares de coleções e índices; difícil buscar entre lojas, que é a função da busca (RN-30) |
| D. Sem separação (confiar só em permissões da tela) | Fraca | Baixa | Baixo | Rejeitada: uma falha de tela expõe dados de outra loja |

### Análise dos trade-offs

- A busca entre lojas (RN-30) e a média de avaliações atravessam todas as lojas. Com coleções compartilhadas, são consultas simples; nas opções B e C exigiriam juntar dados de vários lugares.
- O ganho de B (isolamento físico) não compensa para 30 lojas. Se um cliente grande exigir isolamento físico no futuro, o `lojaId` em todos os documentos permite migrar essa loja para um banco próprio.
- O ponto fraco da opção A é humano: um filtro esquecido vaza dados. Por isso o repositório base e o teste de isolamento fazem parte da decisão, e não são opcionais.

### Consequências

**Ganhos**
- Um único banco para operar, fazer backup e consultar.
- Busca e agregações entre lojas simples.
- Migrar uma loja para um banco próprio continua possível.

**Custos e riscos**
- Todo código de loja precisa passar pelo repositório base; um acesso direto ao driver sem filtro fura o isolamento.
- Exportar ou excluir os dados de uma loja é filtrar por `lojaId` em várias coleções (cabe ao módulo de privacidade).
- O RN-05 (um login por loja no MVP) guarda uma lista de membros da loja desde o início, para que o login por funcionário não exija migração.

### Próximos passos

1. [x] PO aceitar ou ajustar a decisão e mudar o status para Aceito.
2. [ ] Detalhar as coleções, os campos e os índices no modelo de dados.
3. [ ] Incluir o teste de isolamento na definição de pronto.
4. [x] Marcar o ADR-002 como substituído.

### Situação em 10/11/2026

Aceito em 10/11/2026. Nada implementado.

---

## ADR-009: Arquitetura do app Flutter

- **Status:** Aceito pelo PO em 10/11/2026. Não implementado.
- **Data:** 10/11/2026
- **Decisor:** Gabriel Vogado (PO)

### Contexto

O [ADR-006](#adr-006-flutter-na-web-e-no-mobile-e-kotlin-no-backend-quarkus) escolheu Flutter para web e mobile, e o app é desenvolvido do zero. As [telas](../03-ui-ux/Telas-e-Fluxos-v1.1.md) mostram dois produtos de público diferente: o **app do tutor** (Android no MVP, web depois) e o **painel da loja** (web, telas largas). O [contrato da API](../02-arquitetura-tecnica/Contrato-API-v2.0.md) define rotas, erros por `codigo`, idempotência e SSE.

Sem um padrão antes da primeira tela, cada feature escolhe seu próprio jeito de guardar estado, navegar e falar com a API, e o custo aparece na terceira feature.

### Decisão proposta

1. **Um projeto Flutter, dois pontos de entrada** (`main_tutor.dart` e `main_loja.dart`), com o código comum em `core/`. Cada ponto de entrada gera seu próprio build (Android do tutor, web da loja, web do tutor depois). Separar em pacotes só se o tempo de build ou o acoplamento pedir.
2. **Pastas por feature**, cada uma com `data` (cliente da API e mapeamento), `domain` (modelos e regras de tela) e `presentation` (telas e controladores). Não há camada de casos de uso: o backend já guarda as regras de negócio, e o app só as exibe.
3. **Estado com Riverpod.** Um controlador por tela, estado imutável, erro e carregamento como parte do estado.
4. **Navegação com `go_router`**, com redirecionamento por perfil: tutor sem login vai para T1; loja não aprovada vê só o aviso de aprovação.
5. **Cliente da API gerado do OpenAPI** (a ser escrito a partir do contrato) com `dio`. Interceptores: token de acesso, renovação com o refresh token, `Idempotency-Key` em POST de dinheiro e agendamento, e conversão do corpo de erro em uma exceção com `codigo`, `mensagem` e `campo`.
6. **Mensagens de erro por `codigo`**, num único arquivo de textos em português, nunca o texto vindo do servidor (Telas, seção 4).
7. **Dinheiro em centavos (`int`) até a hora de mostrar**, formatado com `intl` como `R$ 0,00`; datas chegam em UTC e são mostradas no fuso do aparelho como `dd/mm/aaaa`.
8. **Tempo real:** painel da loja assina o SSE `/loja/eventos`; o app do tutor recebe push. Em ambos o evento só avisa, e a tela busca de novo o recurso (Telas, seção 4).
9. **Tema Material 3** com tokens num só lugar (`core/tema`), para a identidade visual ([Identidade visual v1.0](../03-ui-ux/Identidade-Visual-v1.0.md)) entrar sem mexer nas telas. Contraste AA, alvo de toque de 48 dp, fonte escalável.
10. **Só português do Brasil**, mas com textos em arquivos ARB desde o início, porque trocar depois custa mais.
11. **Testes:** unitários nos controladores e no mapeamento, de widget nas telas com os estados vazio, carregando e erro, golden nas telas principais, e de integração do fluxo pedir e pagar o sinal contra a API de teste. Detalhes na estratégia de testes.
12. **Sem modo offline no MVP.** A carteira de vacinas guarda a última leitura para consulta rápida, mas toda escrita exige conexão.

### Opções consideradas

**Estado**

| Opção | Complexidade | Testabilidade | Observação |
|---|---|---|---|
| **A. Riverpod** (proposta) | Média | Alta: controladores sem widget | Dependências explícitas, bom com assíncrono |
| B. Bloc/Cubit | Média/alta | Alta | Mais código por tela; bom para equipes grandes |
| C. Provider + ChangeNotifier | Baixa | Média | Escala mal quando as telas dependem umas das outras |

**Navegação**

| Opção | Observação |
|---|---|
| **A. `go_router`** (proposta) | Mantido pela equipe do Flutter, URLs na web, redirecionamento por perfil |
| B. `Navigator` direto | Sem URLs na web; o painel da loja precisa delas |

**Cliente da API**

| Opção | Observação |
|---|---|
| **A. Gerado do OpenAPI** (proposta) | O contrato manda; mudar o contrato quebra a compilação, não a produção |
| B. Escrito à mão | Divergência silenciosa entre app e API |

### Análise dos trade-offs

- Dois pontos de entrada num projeto evitam duplicar o código de login, API e tema, ao custo de o build do tutor carregar pastas da loja se o código não for bem separado. Por isso as features da loja e do tutor ficam em pastas distintas e só `core/` é compartilhado.
- Riverpod pesa mais no começo que Provider, mas as telas de pedido dependem de várias fontes (loja, disponibilidade, pet, política) e isso fica explícito.
- A geração do cliente exige manter um OpenAPI. Isso é desejado: o contrato passa a ser um arquivo e não só um texto.
- Flutter na web tem carregamento inicial pesado e busca fraca em buscadores. Para o painel da loja, que exige login, isso não pesa; para a vitrine pública, está na lista de decisões das Telas.

### Consequências

**Ganhos**
- Toda feature nova segue o mesmo molde, o que acelera revisão e onboarding.
- Erros, dinheiro e datas tratados num lugar só.
- A identidade visual entra trocando o tema.

**Custos e riscos**
- Gerar e versionar o OpenAPI vira parte da rotina; sem ele o item 5 não vale.
- Dart é novo para a equipe (ADR-006).
- Guardar o refresh token na web tem risco de XSS se ficar no armazenamento do navegador. No Android usa-se o armazenamento seguro do sistema.

### Decisões que faltam

| Decisão | Quem |
|---|---|
| ~~Refresh token na web~~: **cookie `HttpOnly`** (PO, 10/11/2026); o backend emite o cookie | decidido |
| ~~Push no Android~~: **push do sistema** (PO, 10/11/2026), porque não existe alternativa própria | decidido |
| ~~Mapas na busca~~: **mapa gratuito com tiles abertos** (PO, 10/11/2026); falta escolher a biblioteca ao iniciar a busca | decidido |
| ~~Identidade visual (nome, cores, tipografia)~~ Decidida em 10/11/2026: [Identidade visual v1.0](../03-ui-ux/Identidade-Visual-v1.0.md) | PO |

### Próximos passos

1. [x] PO aceitar ou ajustar a decisão e mudar o status para Aceito.
2. [ ] Escrever o OpenAPI a partir do contrato e gerar o cliente Dart.
3. [ ] Criar o esqueleto do projeto com `core/`, o tema, a navegação e uma feature de exemplo (T1 Entrar).
4. [ ] Incluir os testes de estado vazio, carregando e erro na definição de pronto.

### Situação em 10/11/2026

Aceito em 10/11/2026. Nada implementado.
