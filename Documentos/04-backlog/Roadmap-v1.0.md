# Roadmap

> Direção definida pelo PO em 05/11/2026: **vários petshops, pagamento e app mobile**. A ordem abaixo segue as dependências: o modelo multi-loja vem antes do pagamento, e a API estável vem antes do app.

## Stack (ADR-006, aceito em 05/11/2026)

> Decisão do PO registrada no [ADR-006](../08-analise-tecnica/adrs.md#adr-006-flutter-no-app-mobile-e-kotlin-no-backend-quarkus):
> - **Web:** continua em React.
> - **App mobile (Épico 3):** Flutter, para Android e iOS.
> - **Backend:** reescrito em Kotlin no mesmo Quarkus, **de uma vez e junto com o Épico 1**. A persistência recomendada é `quarkus-mongodb-panache-kotlin`, que aguarda confirmação do PO.
>
> O Épico 1 começa portando os testes de integração REST para o backend Kotlin. Eles precisam passar antes de entrarem as funcionalidades multi-petshop.

## Fase 0: Fundação (pré-requisito)

Sem isso os épicos seguintes ficam arriscados.

- CI no GitHub Actions rodando testes do backend e do frontend em todo PR (DT-07, DT-08).
- Medir cobertura (JaCoCo e Vitest) e definir uma meta (DT-09).
- Corrigir validação de horário no `POST` e tornar a reserva atômica (DT-02, DT-03).
- Ambiente publicado (dev) para testes reais.

## Épico 1: Vários petshops (marketplace)

- Reescrita do backend em Kotlin com Panache (ADR-006): primeiro os testes de integração REST atuais, depois as 48 classes, mantendo o contrato da API.
- Entidade `Petshop` própria (nome, CNPJ, endereço, geolocalização, horário de funcionamento, capacidade por horário), separada do usuário owner.
- Cadastro de várias lojas; um owner pode administrar uma ou mais lojas, e uma loja pode ter funcionários.
- Substituir o [ADR-002](../08-analise-tecnica/adrs.md#adr-002-índice-único-parcial-para-garantir-um-único-owner) (owner único) por um novo ADR de multi-tenancy.
- Busca de petshops pelo tutor (por cidade ou proximidade), página da loja com catálogo e avaliações.
- Horário de funcionamento e capacidade configuráveis por loja (hoje são fixos: 9h–18h, um serviço por vez).
- Migração de dados: `petshop-unico` vira o primeiro registro de `Petshop`.

## Épico 2: Pagamento

- Escolher o provedor (ex.: Mercado Pago, Stripe, Pagar.me) e o modelo: pagamento antecipado, sinal ou pagamento no local.
- Split de pagamento entre plataforma e petshop (comissão), se o modelo for marketplace.
- Estados do agendamento ligados ao pagamento (pendente, pago, estornado) e política de cancelamento e reembolso.
- Webhooks idempotentes do provedor; nenhum dado de cartão passa pelo nosso backend.
- Fluxo de concluir serviço (DT-10), que dispara repasse e histórico.

## Épico 3: App mobile

- App Flutter (Android e iOS) para o tutor, consumindo a mesma API ([ADR-006](../08-analise-tecnica/adrs.md#adr-006-flutter-no-app-mobile-e-kotlin-no-backend-quarkus)).
- Notificações push (lembrete de agendamento, cancelamento, vacina vencendo).
- Login persistente com refresh token (hoje o JWT expira em 1 hora e não há refresh).
- Publicação nas lojas Apple e Google.

## Perguntas em aberto

- Modelo de receita: comissão por agendamento, mensalidade da loja ou ambos?
- O app mobile é só para tutor ou também para o petshop?
- A web do tutor continua existindo depois do app?
