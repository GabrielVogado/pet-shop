# Definição de pronto e estratégia de testes (v1.0)

> **Sistema-alvo.** Vale para todas as histórias do [Backlog v2.0](Backlog-v2.0.md). É **proposta**: o PO aceita ou ajusta, e o que for aceito passa para o [manual de git-flow](../10-git-flow/MANUAL.md).

---

## 1. Definição de pronto

Uma história só está pronta quando **todos** os itens valem:

1. Os critérios de aceite da história foram demonstrados, e não só descritos.
2. Testes automatizados cobrem cada critério (seção 2), e o CI está verde.
3. Se a história mexe em dado da loja, existe **teste de isolamento**: a loja A recebe 404 ao pedir dado da loja B (ADR-008).
4. Se mexe em dinheiro, o valor é em centavos de ponta a ponta e há teste de arredondamento (seção 3).
5. Se mexe em pedido ou pagamento, a transição de estado segue a tabela dos [Diagramas de engenharia](../02-arquitetura-tecnica/Diagramas-de-Engenharia-v2.0.md) e grava a linha em `historico`.
6. Se chama o provedor ou recebe webhook, o fluxo é **idempotente** e há teste de repetição.
7. Se mostra uma tela, ela tem os estados vazio, carregando e erro, contraste AA, alvo de toque de 48 dp e texto em português com `R$ 0,00` e `dd/mm/aaaa` (Telas, seção 4).
8. O contrato (`Contrato-API-v2.0.md` e o OpenAPI) e os demais documentos afetados foram atualizados **no mesmo PR**, com linha no `00-INDICE.md` e no `HISTORICO.md`.
9. Nenhum dado pessoal ou de cartão aparece em log (RNF-10) e o `idRequisicao` acompanha cada erro.
10. Revisão de código aprovada por outra pessoa; PR com título e corpo explicando o que muda.

## 2. Pirâmide de testes

| Camada | O que cobre | Ferramenta (proposta) | Quando roda |
|---|---|---|---|
| Unitário, backend | Regras puras: prazo de aceite, cálculo de sinal e multa, transições de estado | JUnit 5 + Kotlin | Todo PR |
| Integração, backend | Rotas REST com MongoDB real, JWT, erros, idempotência, isolamento entre lojas | `@QuarkusTest` + Testcontainers (MongoDB) | Todo PR |
| Contrato | A API não diverge do OpenAPI | Comparação do OpenAPI gerado com o versionado | Todo PR |
| Unitário e componente, web | Mapeamento, formatação de dinheiro e data; telas nos estados vazio, carregando e erro | Vitest + Testing Library | Todo PR |
| Unitário e interface, Android | `ViewModel`, mapeamento; telas nos estados vazio, carregando e erro | JUnit + testes de interface do Compose | Todo PR |
| Módulo compartilhado | Cálculo de sinal, multa e prazos, usado pelo backend e pelo app | JUnit (alvo JVM) | Todo PR |
| Integração, app | Pedir e pagar o sinal; aceitar um pedido no painel | `integration_test` contra o ambiente de desenvolvimento | Antes de mesclar em `master` |
| Provedor | Pix, webhook, estorno, cartão guardado | Sandbox do provedor, atrás da porta `PagamentoGateway` | Manual até o ADR-007; depois no CI noturno |
| Carga | 30 lojas e 100 tutores com folga de dez vezes; corrida pela mesma vaga | k6 ou similar | Antes da publicação |
| Segurança | Dependências vulneráveis, segredos no repositório, rotas sem token | Verificação de dependências e do repositório no CI | Todo PR |

O teste unitário usa dublê só para o que é externo (provedor, e-mail). O banco **não** é simulado: as regras de vaga e de índice único dependem do MongoDB de verdade.

## 3. Casos que não podem faltar

**Isolamento (ADR-008).** Para cada recurso da loja: pedidos, agenda, serviços, política, avaliações e carteira. Loja A pedindo dado da loja B recebe 404. Tutor pedindo dado de outro tutor recebe 404.

**Vaga atômica.** Duas requisições simultâneas pela última vaga: uma passa, a outra recebe horário indisponível. Pedido com vários serviços que falha na metade não deixa vaga presa.

**Sinal e multa.** Tabela do [diagrama de pagamento](../02-arquitetura-tecnica/Diagramas-de-Engenharia-v2.0.md#2-estados-do-pagamento-do-sinal), com o exemplo R$ 100, sinal de 30% e multa de 50%: a loja fica com R$ 30 e cobra R$ 20; com sinal de 60%, fica com R$ 50 e devolve R$ 10. Além disso: multa 0%, sinal 0%, sinal igual à multa, centavos que não dividem exato (arredondamento definido num lugar só) e política alterada depois do pedido (o pedido mantém a antiga).

**Prazos.** Pedido com mais de 48 h, entre 24 h e 48 h e com menos de 24 h; expiração no minuto exato; cancelamento a 2 h e 1 minuto contra 1 h e 59 minutos.

**Webhook.** O mesmo evento duas vezes não paga duas vezes; evento fora de ordem; assinatura inválida é recusada.

**Tarefas agendadas.** Duas instâncias não executam a mesma tarefa; tarefa parada gera alerta.

**Estados finais.** Concluído, Falta, Cancelado, Recusado, Expirado e Abandonado não mudam mais; tentativa devolve conflito.

**LGPD.** Exclusão apaga o perfil e mantém só o que a lei exige; exportação traz pets, carteira e histórico do tutor, e nada de outros tutores.

## 4. Dados de teste

- Cada teste cria seus próprios dados e não depende de ordem.
- Lojas e tutores de teste vêm de uma fábrica única no código de teste.
- Relógio injetável: nenhum teste de prazo espera tempo real.
- Cartões e Pix só do sandbox do provedor. Nada de dado real em ambiente que não seja produção.

## 5. Ambientes

| Ambiente | Testes que rodam |
|---|---|
| Local | Unitários e de integração (Testcontainers sobe o MongoDB) |
| CI | Tudo da pirâmide, menos carga e provedor |
| Desenvolvimento | Integração do app e testes manuais da história |
| Homologação | Regressão completa e carga antes de cada versão |
| Produção | Verificação de saúde e acompanhamento depois de publicar |

## 6. Meta de cobertura

Meta inicial proposta: **80%** de linhas nas camadas de regra do backend (agendamento e pagamentos) e **70%** nos controladores do app, medida no CI. Cobertura é piso, não prova: os casos da seção 3 valem mais que o número.

## 7. Decisões que faltam

| Decisão | Quem |
|---|---|
| Aceitar a meta de cobertura e as ferramentas | PO |
| Escolher onde roda o CI noturno do provedor | Depende do ADR-007 |
| Definir a carga de teste (usuários e duração) | Depende da nuvem escolhida |
