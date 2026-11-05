# Estimativa de Custo de Nuvem — PetCare (v1.0)

> **Estimativa**, não orçamento. Preços consultados na documentação pública em 05/11/2026, em dólares. Nada foi contratado nem testado. O teste prático dos provedores fica para depois da fase de documentação (ver [ADR-007](../08-analise-tecnica/adrs.md#adr-007-provedor-de-pagamento)).
>
> Atende à pendência P-06 do [Documento Negocial v2.0](../01-negocio/Documento-Negocial-v2.0.md) (RNF-09: nuvem ainda não definida).

## 1. Resumo

- A **infraestrutura é barata e quase fixa**: de **~US$ 21 a ~US$ 161 por mês**, conforme o perfil, mesmo com 30 lojas.
- O custo que **cresce com o uso** é o **WhatsApp**, porque o tutor é avisado por ele a cada etapa do agendamento. No cenário alto com infraestrutura enxuta, ele chega a ~96% do total.
- Isso muda a conta da mensalidade (P-05): o que pesa no preço por loja é o número de mensagens, não o servidor.
- O **SMS custa cerca de 9 vezes mais que o WhatsApp** por mensagem nas tarifas encontradas. Se as lojas escolherem SMS em vez de WhatsApp (RN-71), o custo variável sobe muito (seção 5.1). O e-mail é desprezível.
- Servidor virtual (VPS) e EC2 têm custo fixo menor, mas ficam fora do Brasil ou sem redundância (seção 4.1).
- Alguns itens **não foram estimados** (seção 6).

## 2. Premissas

| # | Premissa | Origem |
|---|---|---|
| 1 | 30 lojas e 100 tutores no primeiro ano | PO (RNF-01) |
| 2 | Disponibilidade o tempo todo; uma janela de 1h de madrugada é aceitável | PO (RNF-02) |
| 3 | Backend em Kotlin/Quarkus; web e app em Flutter; MongoDB | [ADR-006](../08-analise-tecnica/adrs.md#adr-006-flutter-na-web-e-no-mobile-e-kotlin-no-backend-quarkus) |
| 4 | Referência de nuvem: Google Cloud (Cloud Run) com Firebase Hosting e MongoDB Atlas. AWS e servidor virtual foram comparados só no backend (seção 4.1); **Azure e Oracle não** | Escolha desta estimativa |
| 5 | 8 mensagens por agendamento: 5 para o tutor (WhatsApp) e 3 para a loja (pedido novo, prazo de aceite perto de vencer e lembrete) | Suposição |
| 5b | 3 e-mails por agendamento | Suposição |
| 6 | Mês de 30 dias (2.592.000 segundos) | — |
| 7 | Câmbio de R$ 5,50 por US$ 1, só para o custo por loja | Suposição, atualizar |

## 3. Preços encontrados

| Componente | Preço | O que a fonte não deixou claro |
|---|---|---|
| **Cloud Run**, cobrança por requisição | US$ 0,0000025 por vCPU-segundo e por GiB-segundo de **instância mínima ociosa**; cota grátis mensal de 2 milhões de requisições, 180 mil vCPU-s e 360 mil GiB-s | O preço de São Paulo é de **faixa 2**, mais caro que os valores acima (faixa 1). O valor exato de São Paulo não foi obtido: **os números abaixo são um piso**. |
| **Cloud Run**, cobrança por instância | US$ 0,000018 por vCPU-s e US$ 0,000002 por GiB-s, com a instância ativa o tempo todo | Mesma ressalva de faixa. |
| **MongoDB Atlas Flex** | US$ 8 por mês (até 100 operações por segundo), 5 GB; sobe até US$ 30 | A página não confirma São Paulo como região de cluster. |
| **MongoDB Atlas M10** (dedicado) | A partir de US$ 56,94 por mês, 2 vCPU, 2 GB de RAM | Idem. |
| **Firebase Hosting** | 10 GB de armazenamento e 10 GB de tráfego por mês grátis; depois US$ 0,026/GB e US$ 0,15/GB | Se o plano grátis aceita domínio próprio não ficou claro. |
| **SMS** (Twilio, para o Brasil) | **US$ 0,0599 por segmento** de SMS enviado. Taxas de operadora podem se somar; a página não traz valores para o Brasil | Preço de rota internacional. Provedores brasileiros de SMS **não foram pesquisados** e podem cobrar menos. |
| **E-mail** (Amazon SES) | **US$ 0,10 por mil e-mails**. Contas novas recebem até US$ 200 em créditos | Não há cota grátis permanente. |
| **WhatsApp Business Platform** | Cobrança **por mensagem** entregue, por categoria e país. A única tarifa do Brasil encontrada foi **0,68 centavo** por mensagem de utilidade ou autenticação | A moeda não vinha indicada (tratada aqui como dólar). Tarifa de **marketing** (mais cara) não encontrada. Mensagem de utilidade dentro da janela de 24h passa a ser cobrada desde 01/10/2026. |

## 4. Perfis de infraestrutura

| Perfil | Backend | Banco | Web | Total por mês |
|---|---|---|---|---|
| **A. Enxuto** | Cloud Run por requisição, 1 instância mínima de 1 vCPU e 1 GiB: **US$ 12,96** | Atlas Flex: **US$ 8,00** | Firebase Hosting: **US$ 0** | **~US$ 21** |
| **B. Conservador** | Cloud Run por instância, 2 instâncias de 1 vCPU e 1 GiB sempre ativas: **US$ 103,68** | Atlas M10: **US$ 56,94** | Firebase Hosting: **US$ 0** | **~US$ 161** |

Como os valores saem:
- Perfil A: (1 vCPU + 1 GiB) × 2.592.000 s × US$ 0,0000025 = US$ 12,96. O tempo de atendimento de requisições, a US$ 0,000024 por vCPU-s, é desprezível nesse volume e cabe na cota grátis.
- Perfil B: 2 instâncias × 2.592.000 s × (US$ 0,000018 + US$ 0,000002) = US$ 103,68.

**Por que existem dois perfis:** a atualização em tempo real do catálogo hoje usa SSE, conexão que fica aberta. Na cobrança por requisição, uma conexão aberta mantém a instância "ativa" e o custo tende ao da cobrança por instância. Se o novo sistema trocar o SSE por notificação push, o Perfil A vale. Se mantiver o SSE, o Perfil B é mais realista. O Perfil B também dá redundância (2 instâncias) e banco dedicado.

### 4.1 Outras opções de hospedagem do backend

Comparação só do servidor (sem banco), por mês de 30 dias. Valores de fontes públicas; só os do DigitalOcean e do Hetzner vieram de páginas oficiais.

| Opção | Custo do servidor | Redundância | Região | Observação |
|---|---|---|---|---|
| **Cloud Run** (referência) | US$ 12,96 a US$ 103,68 | Sim (Perfil B) | São Paulo | Piso; São Paulo é faixa 2 |
| **AWS EC2** t4g.small (2 vCPU, 2 GiB) | ~US$ 19,30 | Não, servidor único | São Paulo | Preço de fonte **não oficial**, conferir na AWS |
| **AWS EC2** t3.small (2 vCPU, 2 GiB) | ~US$ 24,19 | Não, servidor único | São Paulo | Idem |
| **AWS App Runner** | Preços só dos EUA (US$ 0,007 por GB-hora de memória ociosa, US$ 0,064 por vCPU-hora ativa) | Sim | Sem preço para São Paulo | Não dá para comparar |
| **DigitalOcean** (2 vCPU, 2 GiB) | US$ 18 (4 GiB: US$ 24) | Não, servidor único | EUA, Europa, Ásia e Austrália; **sem Brasil** | |
| **Hetzner** (plano compartilhado mais barato) | €6,49, sem imposto | Não, servidor único | Alemanha, Finlândia, Singapura e EUA; **sem América do Sul** | Núcleos e memória não vinham na página |

Leitura:
- Servidor virtual e EC2 saem mais baratos que o Perfil B, mas são **um servidor só**: sem redundância, e a equipe cuida de atualizações, backup e deploy.
- Os servidores da DigitalOcean e do Hetzner ficam **fora do Brasil**. Como o sistema guarda dados pessoais de brasileiros (RNF-06 a RNF-08), hospedar fora pode exigir cuidados da LGPD para transferência internacional de dados. Vale uma revisão jurídica. O mesmo vale para o MongoDB Atlas se não houver cluster em São Paulo.
- Nenhuma dessas opções foi testada.

## 5. Cenários de volume e resultado

| Cenário | Agendamentos por mês | Mensagens de WhatsApp (×8) | WhatsApp por mês (a US$ 0,0068) |
|---|---|---|---|
| **1. Piloto** | 200 (100 tutores, 2 por mês cada) | 1.600 | **US$ 10,88** |
| **2. Esperado** | 2.700 (30 lojas, 3 por dia) | 21.600 | **US$ 146,88** |
| **3. Alto** | 9.000 (30 lojas, 10 por dia) | 72.000 | **US$ 489,60** |

| Cenário | Perfil A (enxuto) | Perfil B (conservador) |
|---|---|---|
| 1. Piloto | **~US$ 32** por mês | **~US$ 172** por mês |
| 2. Esperado | **~US$ 168** por mês | **~US$ 308** por mês |
| 3. Alto | **~US$ 511** por mês | **~US$ 650** por mês |

### Custo por loja (30 lojas, sem margem)

| Cenário | Perfil A | Perfil B |
|---|---|---|
| 1. Piloto | US$ 1,06 (R$ 5,8) | US$ 5,72 (R$ 31,4) |
| 2. Esperado | US$ 5,59 (R$ 30,8) | US$ 10,25 (R$ 56,4) |
| 3. Alto | US$ 17,02 (R$ 93,6) | US$ 21,67 (R$ 119,2) |

Esse é o **custo mínimo por loja** só destes itens. A mensalidade ainda precisa cobrir o SMS, a equipe, a margem e os itens da seção 6.

### 5.1 Se as lojas escolherem SMS

A loja escolhe os canais (RN-71). O SMS custa US$ 0,0599 contra US$ 0,0068 do WhatsApp, cerca de **8,8 vezes mais**. Considerando que as 3 mensagens da loja por agendamento vão por SMS e as 5 do tutor por WhatsApp:

| Cenário | Mensagens da loja por SMS | Mensalidade de mensagens (SMS + WhatsApp) | Mesmo cenário com tudo por WhatsApp |
|---|---|---|---|
| 1. Piloto | 600 | **US$ 42,74** | US$ 10,88 |
| 2. Esperado | 8.100 | **US$ 576,99** | US$ 146,88 |
| 3. Alto | 27.000 | **US$ 1.923,30** | US$ 489,60 |

Cada loja que prefere SMS pode custar ao PetCare várias vezes mais que uma que prefere WhatsApp. Isso pede uma decisão de produto: o SMS como canal de reserva, um limite de mensagens na mensalidade, ou outro provedor de SMS mais barato.

### 5.2 E-mail

O e-mail custa US$ 0,10 por mil. Com 3 e-mails por agendamento, o cenário alto (27.000 e-mails) custa cerca de **US$ 2,70 por mês**. É desprezível.

## 6. O que não foi estimado

| Item | Situação |
|---|---|
| **SMS e e-mail** | Estimados nas seções 5.1 e 5.2, mas **fora dos totais da seção 5**. O SMS usa a tarifa de uma rota internacional; provedores brasileiros não foram pesquisados. |
| **Notificação push** (app Android) | Não verificado; costuma ter cota grátis. |
| **Armazenamento de arquivos** (foto de comprovante de vacina, PDF/XML da NFS-e) | Não estimado. O volume inicial é pequeno, mas cresce e deve ser guardado pelo prazo legal (RNF-08). |
| **Domínio**, certificados, logs e monitoramento | Não estimados. |
| **Conta de desenvolvedor da Google Play** | Taxa única de valor conhecido, não reverificada. |
| **Taxas dos provedores de pagamento** | Ficam com a loja (RN-54); não entram no custo do PetCare. Detalhes no ADR-007. |
| **Mensagens de marketing no WhatsApp** | Lembretes de vacina e de banho podem ser classificados como marketing pela Meta e custar mais que utilidade. Não encontrei a tarifa. |
| **Outras nuvens** | Azure e Oracle não foram comparados. AWS e servidor virtual só no backend (seção 4.1). |
| **Impostos** sobre serviços em dólar (IOF, ISS) | Não considerados. |

## 6.1 O que dá para fazer dentro do próprio sistema

Por decisão do PO, o que puder ser feito com recursos do próprio desenvolvimento deve evitar provedores de terceiros.

| Necessidade | Dentro do sistema | Observação |
|---|---|---|
| E-mail | `quarkus-mailer` (equivalente ao Spring Mail) | Ainda precisa de um servidor SMTP. Servidor próprio exige SPF, DKIM e DMARC, e a nuvem costuma bloquear a porta 25. Manter um relé barato por trás do `quarkus-mailer`, trocável sem mexer no código. |
| Prazos de aceite e lembretes | `quarkus-scheduler` | Sem agendador da nuvem. |
| Login e senha | `quarkus-security` com hash próprio | Só o "entrar com Google" depende do Google. |
| Fotos e comprovantes (cartão de vacina, NFS-e PDF/XML) | GridFS do MongoDB | Sem serviço de arquivos separado. |
| Cache e filas simples | Memória ou MongoDB | Sem Redis ou fila gerenciada. |

Não dá para internalizar: SMS (exige operadora ou agregador), WhatsApp (só pela API oficial da Meta; bibliotecas não oficiais violam os termos e arriscam banir o número), pagamento (ADR-007) e push no Android (FCM, gratuito).

## 7. Riscos e o que revisitar

- **O WhatsApp domina o custo.** Revisitar o número de mensagens por agendamento (hoje 8) e quais eventos realmente precisam de WhatsApp. Avisos de menor importância podem ir por push ou e-mail, e a loja já pode escolher os canais (RN-71).
- **O SMS pode virar o maior custo.** Se muitas lojas escolherem SMS, o custo variável fica quase 9 vezes o do WhatsApp (seção 5.1). Pesquisar provedores brasileiros de SMS e decidir o papel do SMS.
- **Preço de São Paulo.** Confirmar a tarifa de faixa 2 do Cloud Run e se o Atlas oferece cluster em São Paulo. Se não oferecer, o banco ficaria em outra região, com mais latência.
- **Tarifas em dólar.** O custo flutua com o câmbio.
- **Crescimento acima de 100 operações por segundo no banco** tira o Atlas Flex do plano básico; acima de 500, passa ao M10.
- **Esta é uma estimativa de piso.** Reavaliar com medição real depois do piloto.

## 8. Próximos passos

1. [ ] Pesquisar provedores brasileiros de SMS, que podem custar menos que a rota internacional usada aqui.
2. [ ] Obter a tarifa de São Paulo do Cloud Run e a tabela oficial de tarifas do WhatsApp para o Brasil, em reais.
3. [ ] Conferir os preços da AWS (EC2 e Fargate em São Paulo) em fonte oficial e confirmar se o Atlas tem cluster em São Paulo.
4. [ ] Decidir o papel do SMS (canal de reserva, limite na mensalidade ou outro provedor).
5. [ ] Usar o resultado para definir o valor da mensalidade (P-05).
6. [ ] Depois da fase de documentação, medir o consumo real no piloto.
