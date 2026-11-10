# Diagramas de engenharia (v2.0)

> **Sistema-alvo.** Estados e sequências do agendamento e do pagamento, a partir das regras RN-40 a RN-55 do [Documento Negocial v2.0](../01-negocio/Documento-Negocial-v2.0.md). Os campos citados estão no [Modelo de dados](Modelo-de-Dados-v2.0.md); os módulos, na [Arquitetura-alvo](Arquitetura-Alvo-v2.0.md#3-componentes-do-backend).
>
> É **proposta**. Esta versão acrescenta ao ciclo do Documento Negocial o estado **Aguardando pagamento**, que depende da resposta do PO à pergunta P-07 (o sinal é cobrado ao pedir).

---

## 1. Estados do agendamento

```mermaid
stateDiagram-v2
  [*] --> AguardandoPagamento: tutor pede
  AguardandoPagamento --> Pendente: sinal pago
  AguardandoPagamento --> Abandonado: sinal não pago a tempo
  Pendente --> Confirmado: loja aceita
  Pendente --> Recusado: loja recusa
  Pendente --> Expirado: prazo de aceite vence
  Pendente --> Cancelado: tutor cancela
  Confirmado --> Concluido: loja conclui
  Confirmado --> Falta: loja registra falta
  Confirmado --> Cancelado: tutor ou loja cancela
  Concluido --> [*]
  Falta --> [*]
  Cancelado --> [*]
  Recusado --> [*]
  Expirado --> [*]
  Abandonado --> [*]
```

### Transições

| De | Para | Quem | Condição | Vaga | Sinal (50%) |
|---|---|---|---|---|---|
| (novo) | Aguardando pagamento | Tutor | Pedido válido: horário com capacidade livre (RN-41), cartão de garantia cadastrado (RN-50), loja aprovada e em dia (RN-17) | Reservada por tempo curto | Cobrança criada |
| Aguardando pagamento | Pendente | Sistema | Webhook confirma o sinal | Mantida | Pago |
| Aguardando pagamento | Abandonado | Sistema | Tempo para pagar acabou (15 minutos, proposta) | Liberada | Cobrança cancelada |
| Pendente | Confirmado | Loja | Dentro do prazo de aceite | Mantida | Pago |
| Pendente | Recusado | Loja | Em qualquer momento do prazo | Liberada | **Devolvido** (RN-45) |
| Pendente | Expirado | Sistema | Prazo de aceite venceu (RN-43) | Liberada | **Devolvido** (RN-44) |
| Pendente | Cancelado | Tutor | Antes da resposta da loja | Liberada | Devolvido |
| Confirmado | Cancelado | Tutor | Faltam **mais** de 2 h para o horário (RN-46) | Liberada | **Devolvido** |
| Confirmado | Cancelado | Tutor | Faltam **menos** de 2 h (RN-46) | Liberada | **Retido pela loja** |
| Confirmado | Cancelado | Loja | Qualquer momento | Liberada | **Devolvido** (RN-45) |
| Confirmado | Falta | Loja | Depois do horário marcado (RN-47) | Já consumida | **Retido pela loja** |
| Confirmado | Concluído | Loja | Depois do atendimento; exige os registros do que foi feito (RN-48) | Já consumida | Abatido do total |

Regras de integridade:
- Toda transição grava uma linha em `historico` (de, para, quem, quando, motivo).
- Estados finais (Concluído, Falta, Cancelado, Recusado, Expirado, Abandonado) não mudam mais.
- **Remarcar** (RN-46) ainda não está no desenho: depende da pergunta P-08.
- O prazo de aceite é calculado na criação do pedido (RN-43) e guardado em `prazoAceiteEm`.

---

## 2. Estados do pagamento do sinal

```mermaid
stateDiagram-v2
  [*] --> Criado: cobrança enviada ao provedor
  Criado --> Pendente: aguardando Pix ou cartão
  Pendente --> Pago: webhook confirma
  Pendente --> Falhou: recusado ou vencido
  Pago --> Estornado: pedido recusado, expirado ou cancelado sem multa
  Pago --> RetidoPelaLoja: cancelamento tardio ou falta
  Falhou --> [*]
  Estornado --> [*]
  RetidoPelaLoja --> [*]
```

`RetidoPelaLoja` é o `pagamentos.desfecho = RETIDO_PELA_LOJA` do modelo de dados: o pagamento continua pago e a loja simplesmente fica com o valor. O restante (RN-52) é outro pagamento, do tipo `RESTANTE`, cobrado depois do atendimento, ou registrado pela loja como `NA_LOJA`.

---

## 3. Sequências

### 3.1 Pedir o horário e pagar o sinal

```mermaid
sequenceDiagram
  actor T as Tutor (app)
  participant A as API
  participant G as Agendamento
  participant O as Ocupação
  participant P as Pagamentos
  participant PR as Provedor
  participant N as Notificações

  T->>A: POST pedido (unidade, itens, horários)
  A->>G: validar e criar
  G->>O: reservar vagas (transação)
  O-->>G: reservado ou esgotado
  G->>P: criar cobrança do sinal
  P->>PR: cobrança na conta da loja
  PR-->>P: dados do Pix ou do cartão
  P-->>T: instruções de pagamento
  T->>PR: paga
  PR->>A: webhook "pago"
  A->>P: registrar (idempotente)
  P->>G: sinal pago
  G->>G: status Pendente, calcula prazo de aceite
  G->>N: evento PedidoCriado
  N-->>N: avisa a loja (painel, SMS, WhatsApp, e-mail)
```

Se as vagas esgotarem entre a busca do tutor e o pedido, a API devolve o erro de horário indisponível e o app mostra horários próximos.

### 3.2 A loja aceita ou recusa

```mermaid
sequenceDiagram
  actor L as Loja (painel)
  participant A as API
  participant G as Agendamento
  participant O as Ocupação
  participant P as Pagamentos
  participant N as Notificações

  L->>A: POST aceitar ou recusar
  A->>G: aplicar transição
  alt aceitar
    G->>G: Pendente para Confirmado
    G->>N: evento PedidoAceito
  else recusar
    G->>O: liberar vagas
    G->>P: estornar o sinal
    G->>G: Pendente para Recusado
    G->>N: evento PedidoRecusado com sugestões
  end
  N-->>N: avisa o tutor (push e WhatsApp)
```

### 3.3 O prazo de aceite vence

```mermaid
sequenceDiagram
  participant J as Tarefa de expiração
  participant G as Agendamento
  participant O as Ocupação
  participant P as Pagamentos
  participant N as Notificações

  loop a cada minuto
    J->>J: pegar a trava da tarefa
    J->>G: pedidos Pendente com prazoAceiteEm vencido
    G->>O: liberar vagas
    G->>P: estornar o sinal
    G->>G: Pendente para Expirado
    G->>N: evento PedidoExpirado com sugestões
  end
```

Antes do vencimento, a tarefa de aviso (a cada 5 minutos) manda um lembrete à loja.

### 3.4 O tutor cancela

```mermaid
sequenceDiagram
  actor T as Tutor
  participant A as API
  participant G as Agendamento
  participant O as Ocupação
  participant P as Pagamentos
  participant N as Notificações

  T->>A: POST cancelar
  A->>G: cancelar
  G->>G: horas até o início
  alt faltam mais de 2 horas
    G->>P: estornar o sinal
    G->>O: liberar vagas
  else faltam menos de 2 horas
    G->>P: marcar sinal como retido pela loja
    G->>O: liberar vagas
  end
  G->>G: Confirmado para Cancelado
  G->>N: evento Cancelado (tutor e loja)
```

### 3.5 Atendimento concluído, restante e avaliação

```mermaid
sequenceDiagram
  actor L as Loja
  actor T as Tutor
  participant G as Agendamento
  participant S as Registros de saúde
  participant P as Pagamentos
  participant V as Avaliações
  participant N as Notificações

  L->>G: concluir com os procedimentos feitos
  G->>S: gravar vacinas e serviços (origem LOJA)
  G->>P: cobrar o restante ou registrar pago na loja
  G->>G: Confirmado para Concluído
  G->>N: evento Concluído
  N-->>T: atendimento concluído
  T->>V: avaliar a loja (nota e comentário)
  V->>V: nota entra na média agora
  V->>V: comentário fica retido por 72 horas
  V->>N: avisa a loja para responder
  Note over V: depois das 72 horas o comentário é publicado, com a resposta se houver
  L->>V: avaliar o tutor (privada)
```

A avaliação do tutor pela loja nunca aparece para outras lojas; elas só veem os indicadores (`concluidos`, `faltas`, `notaMedia`) de RN-63.

### 3.6 A loja vê a carteira de vacinas

```mermaid
sequenceDiagram
  actor L as Loja
  participant A as API
  participant S as Registros de saúde
  participant Pe as Permissões

  L->>A: GET carteira do pet
  A->>S: pedir carteira (lojaId do token, petId)
  S->>S: existe agendamento ativo deste pet com a loja?
  alt sim
    S-->>L: registros, com selo de origem
  else não
    S->>Pe: existe permissão ativa do tutor?
    alt sim
      Pe-->>L: registros, com selo de origem
    else não
      Pe-->>L: 404
    end
  end
```

Quando a loja não tem acesso, a resposta é "não encontrado", e não "proibido", para não revelar que o pet existe.

---

## 4. O que ficou fora

- Fluxo de cadastro e verificação da loja (RN-03) e de recuperação de senha.
- Cobrança da mensalidade e inadimplência (RN-17).
- Exportação e exclusão de dados (RNF-06, RNF-07).

Entram no contrato da API v2.0 e nos diagramas de sequência dele, que são o próximo documento.
