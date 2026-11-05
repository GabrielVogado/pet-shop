# Documento Negocial — PetCare (v2.0)

> **Sistema-alvo**, definido em entrevista com o PO (Gabriel Vogado) em 05/11/2026. O sistema será desenvolvido do zero na stack do [ADR-006](../08-analise-tecnica/adrs.md#adr-006-flutter-na-web-e-no-mobile-e-kotlin-no-backend-quarkus). O comportamento do código atual (MVP de um petshop) está registrado na [v1.0](../_historico/Documento-Negocial-v1.0.md).
>
> Itens marcados **(proposta)** foram sugeridos durante a entrevista e aceitos pelo PO.

---

## 1. Visão do produto

### Problema

O PetCare aproxima petshops e donos de pet. O tutor encontra lojas, agenda serviços e mantém num só lugar o histórico de vacinas e de cuidados de higiene de cada animal. A loja recebe agendamentos com sinal pago, organiza a agenda e registra os atendimentos.

### Modelo de negócio

- A loja paga uma **mensalidade de valor fixo**. Não há período de teste grátis.
- O tutor usa o app **de graça**.
- A plataforma **não cobra taxa por transação**. A taxa do provedor de pagamento fica com a loja.
- O custo de WhatsApp e SMS entra no cálculo da mensalidade.
- **Piloto:** um petshop parceiro já conhecido usa o sistema sem pagar mensalidade, como primeiro usuário e testador.

### Abrangência

- Brasil inteiro, em português e em reais.

### Escopo do MVP

| Entra | Fica fora (versões futuras) |
|---|---|
| Banho, tosa, vacina, consulta veterinária e táxi pet | Hotel e creche |
| Busca de lojas, agendamento, sinal e pagamento | Venda de produtos |
| Carteira de vacinas e histórico de cuidados | Chat entre tutor e loja |
| Avaliações | Login por funcionário da loja |
| App Android (Google Play) e web | App iOS (App Store) |

---

## 2. Perfis e acesso

| Perfil | Onde usa | Como é validado |
|---|---|---|
| **Tutor** | App Flutter (Android) e web | E-mail confirmado; CPF opcional |
| **Loja** | Painel web (Flutter web) | E-mail da loja confirmado e CNPJ verificado (RN-03) |

| ID | Regra |
|---|---|
| RN-01 | Existem só dois perfis: tutor e loja. Não há perfil de funcionário nem de administrador no produto. A operação da plataforma é interna. |
| RN-02 | Uma mesma pessoa pode ter os dois perfis, cada um com a sua validação. |
| RN-03 | **Verificação automática da loja (proposta):** no cadastro, o CNPJ é consultado em base pública da Receita. A loja é aprovada automaticamente se a situação estiver **ativa**, se houver CNAE de serviços para animais (ex.: 9609-2/08, 7500-1/00) e se o e-mail estiver confirmado. Se algo não bater, o cadastro vai para revisão manual. |
| RN-04 | Login com e-mail e senha, ou com conta Google. |
| RN-05 | No MVP, todos os funcionários da loja usam o **mesmo login**. O modelo de dados já guarda a loja com uma lista de membros **(proposta)**, para que o login por funcionário venha depois sem migração. |

---

## 3. Loja, unidades e serviços

| ID | Regra |
|---|---|
| RN-10 | Uma empresa (CNPJ) pode ter **várias unidades**, cada uma com endereço, horário de funcionamento e agenda próprios. |
| RN-11 | Cadastro da unidade: endereço, horário de funcionamento e, se oferecer táxi pet, o raio de atendimento em km. |
| RN-12 | A loja monta o **catálogo de serviços**: tipo (banho, tosa, vacina, consulta veterinária, táxi pet), duração e preço. A loja decide se o preço varia por porte. |
| RN-13 | **Capacidade (proposta):** cada unidade informa quantos atendimentos de cada tipo de serviço faz ao mesmo tempo (ex.: 2 banhos e 1 consulta). Um horário fica indisponível quando a capacidade daquele tipo se esgota. |
| RN-14 | A consulta veterinária só pode ser oferecida por uma unidade que tenha **veterinário com CRMV** cadastrado. |
| RN-15 | O táxi pet é ao mesmo tempo uma informação da loja (o raio) e um serviço agendável, com preço. |
| RN-16 | O sistema aceita **todas as espécies**. A loja decide se atende, aceitando ou recusando o pedido. |
| RN-17 | **Inadimplência:** a loja com mensalidade em atraso some da busca e não pode aceitar novos agendamentos. |

---

## 4. Pet, carteira de vacinas e histórico

| ID | Regra |
|---|---|
| RN-20 | O tutor cadastra seus pets (espécie, raça, porte, idade). |
| RN-21 | **Origem do registro (proposta):** cada vacina ou procedimento tem uma origem. **Aplicado pela loja** é verificado: inclui o nome do profissional (e o CRMV no caso de vacina ou consulta) e o tutor não pode editar. **Informado pelo tutor** não é verificado (por exemplo, uma vacina tomada fora do PetCare) e pode ter foto do comprovante. Um registro nunca sobrescreve o outro, e a carteira mostra os dois com selo. |
| RN-22 | A loja só vê a carteira de vacinas do pet que tem agendamento com ela. |
| RN-23 | Depois do atendimento, a loja só continua vendo a carteira se o tutor **permitir**. O tutor pode retirar a permissão a qualquer momento. |
| RN-24 | O sistema lembra o tutor do **reforço de vacina** e do **próximo banho**. |

---

## 5. Busca

| ID | Regra |
|---|---|
| RN-30 | O tutor busca lojas aprovadas e em dia, filtrando por localização ("perto de mim"), cidade, serviço, espécie atendida, preço e nota. |
| RN-31 | A página da loja mostra unidades, catálogo, avaliações e o **telefone** para contato. Não há chat no MVP. |

---

## 6. Agendamento

### Ciclo de vida

```
Pendente ──(loja aceita)──► Confirmado ──(loja conclui)──► Concluído
   │                           │  └─(tutor não aparece)──► Falta (no-show)
   │                           └─(cancelamento)──────────► Cancelado
   ├─(loja recusa)──────────► Recusado
   └─(prazo de aceite vence)─► Expirado
```

| ID | Regra |
|---|---|
| RN-40 | Um agendamento pode ter **vários pets e vários serviços**, desde que cada serviço indique o pet. |
| RN-41 | O tutor só escolhe horários com capacidade livre na agenda da unidade. Não há antecedência mínima nem máxima além da agenda da loja. |
| RN-42 | Todo pedido nasce **Pendente** e precisa ser **aceito pela loja**. Enquanto está pendente, a vaga fica bloqueada. |
| RN-43 | **Prazo de aceite (proposta):** horário a mais de 48h, a loja tem 24h; entre 24h e 48h, tem 12h; a menos de 24h, tem 4h. O prazo nunca passa de 1h antes do horário. |
| RN-44 | Se o prazo vencer sem resposta, o pedido fica **Expirado**, o sinal é devolvido e o tutor recebe sugestões de outro horário ou de outra loja. |
| RN-45 | Se a loja recusar ou cancelar, o sinal é devolvido integralmente e o tutor recebe sugestões de outro horário ou de outra loja. |
| RN-46 | O tutor pode **cancelar ou remarcar sem penalidade até 2h antes** do horário. Depois disso, a loja fica com o sinal (50%). |
| RN-47 | **Falta (no-show):** é registrada, e a loja fica com o sinal (50%). O tutor não é bloqueado. |
| RN-48 | A **loja marca o atendimento como concluído** e, nesse momento, registra os procedimentos realizados (vacinas, banho, tosa, consulta) no histórico do pet. |

---

## 7. Pagamento

| ID | Regra |
|---|---|
| RN-50 | Para agendar, o tutor precisa ter um **cartão de crédito cadastrado** como garantia. O débito não permite cobrança posterior sem a presença do tutor. |
| RN-51 | Na confirmação, o tutor paga **50% de sinal** pelo app (crédito, débito ou Pix). O sinal funciona como a multa de RN-46 e RN-47. |
| RN-52 | O restante é pago depois do atendimento, pelo app ou direto na loja. |
| RN-53 | **Recebimento (proposta):** cada loja tem a própria conta recebedora no provedor de pagamento. O PetCare cria a cobrança em nome da loja e nunca recebe nem repassa o dinheiro. O provedor será escolhido num ADR próprio. |
| RN-54 | A taxa do provedor é descontada da loja. |
| RN-55 | A **nota fiscal de serviço (NFS-e)** é emitida pela loja no sistema da prefeitura. A loja anexa o PDF ou o XML ao atendimento, e o tutor consulta no app. |

---

## 8. Avaliações

| ID | Regra |
|---|---|
| RN-60 | Depois de um atendimento concluído, o tutor avalia a loja com nota de 1 a 5 e um comentário opcional. |
| RN-61 | **Direito de resposta (proposta):** a nota entra na média na hora. O comentário fica 72h aguardando a resposta da loja e depois é publicado, com a resposta ao lado se houver. |
| RN-62 | A loja não edita, não apaga nem bloqueia avaliações. A plataforma só remove conteúdo ofensivo, mediante denúncia. |
| RN-63 | A loja avalia o tutor depois do atendimento. Essa avaliação **não é pública**: quando outra loja recebe um pedido, vê só indicadores objetivos do tutor, como número de faltas e nota média. |

---

## 9. Notificações

| Evento | Tutor | Loja |
|---|---|---|
| Novo pedido | | ✓ |
| Prazo de aceite perto de vencer | | ✓ |
| Pedido aceito, recusado ou expirado | ✓ | |
| Lembrete antes do horário | ✓ | ✓ |
| Cancelamento | ✓ | ✓ |
| Atendimento concluído | ✓ | |
| Lembrete de vacina e de banho | ✓ | |
| Novo comentário para responder | | ✓ |

| ID | Regra |
|---|---|
| RN-70 | O tutor recebe avisos pelo **app (push)** e pelo **WhatsApp**. |
| RN-71 | A loja escolhe os canais que quer usar: painel, **SMS e WhatsApp** no número cadastrado, e **e-mail**. |
| RN-72 | A loja pode integrar a agenda ao **Google Agenda**. |

---

## 10. Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF-01 | **Volume no primeiro ano:** pelo menos 30 lojas e 100 tutores. A arquitetura não precisa de escala horizontal no início. |
| RNF-02 | **Disponibilidade:** no ar o tempo todo. Uma janela de manutenção de até 1h de madrugada é aceitável. |
| RNF-03 | **Idioma e moeda:** português e real. |
| RNF-04 | **Plataformas:** app Android na Google Play, e web para o tutor e para o painel da loja. O iOS fica fora do MVP. |
| RNF-05 | **Exige internet.** Não há modo offline. |
| RNF-06 | **LGPD, exclusão:** o tutor pode pedir a exclusão dos seus dados. Os dados são apagados, sem anonimização, exceto os registros que a lei obriga a guardar (pagamentos e notas fiscais), que ficam retidos pelo prazo legal. |
| RNF-07 | **LGPD, portabilidade:** o tutor pode baixar o histórico e a carteira de vacinas dos seus pets. |
| RNF-08 | **Retenção:** cada dado fica guardado pelo prazo legal mínimo. Para notas fiscais e pagamentos, são 5 anos. |
| RNF-09 | **Hospedagem:** ainda sem nuvem definida. O custo de infraestrutura será estimado antes do desenvolvimento. |
| RNF-10 | **Dados de pagamento:** o PetCare não guarda dados de cartão. O cartão fica tokenizado no provedor. |
| RNF-11 | **Encarregado de dados (DPO):** o PO, Gabriel Vogado, é o encarregado no início, com um e-mail próprio de privacidade publicado na política de privacidade. A Resolução CD/ANPD nº 2/2022 dispensa empresas de pequeno porte de nomear um encarregado, mas exige um canal de contato com o titular. Com o crescimento, avaliar a contratação de "DPO como serviço". A política de privacidade e os termos de uso devem passar por revisão jurídica antes do lançamento. |

---

## Pendências

| # | Ponto | Situação |
|---|---|---|
| P-01 | Encarregado de dados (DPO) | Resolvido: o PO é o encarregado (RNF-11) |
| P-02 | Avaliação do tutor pela loja não pública (RN-63) | Confirmado pelo PO |
| P-03 | iOS fora do MVP (RNF-04) | Confirmado pelo PO |
| P-04 | Provedor de pagamento (RN-53) | [ADR-007](../08-analise-tecnica/adrs.md#adr-007-provedor-de-pagamento) proposto; spike em sandbox pendente |
| P-05 | Valor da mensalidade, considerando o custo de WhatsApp e SMS | A definir |
| P-06 | Nuvem e custo de infraestrutura (RNF-09) | Estimativa a fazer antes do desenvolvimento |
