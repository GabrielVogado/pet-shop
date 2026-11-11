# Contrato da API (v2.0)

> **Sistema-alvo.** Contrato REST entre o backend Kotlin e os clientes Flutter (app Android, web do tutor e painel da loja), para que os dois lados possam ser feitos em paralelo. Regras vêm do [Documento Negocial v2.0](../01-negocio/Documento-Negocial-v2.0.md); campos, do [Modelo de dados](Modelo-de-Dados-v2.0.md); estados, dos [Diagramas de engenharia](Diagramas-de-Engenharia-v2.0.md). A API do código atual está na [Especificação v1.0](Especificacao-API-v1.0.md).
>
> É **proposta**. Os nomes de campo e de rota ainda podem mudar até o contrato ser aceito; depois disso, toda mudança segue a regra da seção 9. A especificação OpenAPI será escrita a partir deste documento, antes do primeiro código.

---

## 1. Convenções

| Tema | Regra |
|---|---|
| Base | `/api/v1`. Webhooks em `/webhooks`. Saúde em `/q/health` |
| Formato | JSON em UTF-8, nomes de campo em `camelCase`, rotas em português, sem acento |
| Identificadores | Texto (`ObjectId` em hexadecimal) |
| Dinheiro | Inteiro em centavos, campo terminado em `Centavos` (`valorCentavos: 5000` é R$ 50,00) |
| Datas e horas | ISO 8601 em UTC, com `Z` (`2026-11-20T13:00:00Z`). Datas sem hora em `AAAA-MM-DD`. O app converte para America/Sao_Paulo |
| Enumerações | Texto em maiúsculas (`CONFIRMADO`) |
| Paginação | `?pagina=0&tamanho=20` (máximo 100). Resposta: `{ "itens": [], "pagina": 0, "tamanho": 20, "total": 134 }` |
| Idioma | Mensagens de erro em português; o app usa o `codigo`, nunca o texto |
| Idempotência | `POST` que cria agendamento ou cobrança exige o cabeçalho `Idempotency-Key` (UUID). Repetir a chamada devolve a mesma resposta |
| Limite de chamadas | Login, cadastro e recuperação de senha: 5 por minuto por IP. Demais rotas: limite geral por usuário (valor a definir nos testes de carga) |
| Rastreio | Toda resposta traz `X-Request-Id`; o mesmo valor vai em `idRequisicao` nos erros |

### Perfis de acesso

| Perfil | Quem | Como entra |
|---|---|---|
| `PUBLICO` | Qualquer pessoa | Sem token |
| `TUTOR` | Tutor logado | Token com `perfis` contendo `TUTOR` |
| `LOJA` | Loja logada | Token com `perfis` contendo `LOJA` e `lojaId` |
| `OPERACAO` | Equipe interna do PetCare | Fora dos apps, canal próprio (seção 8) |

Uma pessoa pode ter `TUTOR` e `LOJA` ao mesmo tempo (RN-02). Rotas começam por `/tutor/...` ou `/loja/...` para deixar claro qual perfil está agindo.

### Isolamento entre lojas

O `lojaId` vem **sempre do token**; nenhuma rota `/loja/...` aceita `lojaId` no corpo ou na URL. Pedir um recurso de outra loja devolve **404**, e não 403, para não revelar que ele existe ([ADR-008](../08-analise-tecnica/adrs.md#adr-008-isolamento-entre-lojas-multi-tenancy)).

---

## 2. Autenticação e sessão

Token de acesso JWT RS256 com `kid` ([ADR-005](../08-analise-tecnica/adrs.md#adr-005-kid-no-header-do-jwt-para-rotação-de-chaves)): `sub` (usuário), `perfis`, `lojaId?`, `exp`. Duração do acesso: **15 minutos**; do token de renovação: **30 dias** (propostas). O token de renovação é de uso único e é trocado a cada renovação. **No painel web** ele vai em cookie `HttpOnly`, `Secure` e `SameSite`, definido pelo servidor, e não aparece no corpo da resposta (decisão do PO, 10/11/2026); no app Android vai no corpo e fica no armazenamento seguro do sistema.

| Método | Rota | Perfil | Descrição |
|---|---|---|---|
| POST | `/auth/cadastro-tutor` | PUBLICO | Cria o tutor (nome, e-mail, senha, telefone). Envia e-mail de confirmação (RN-04) |
| POST | `/auth/cadastro-loja` | PUBLICO | Cria a loja: CNPJ, razão social, nome fantasia, e-mail, senha, telefone, primeira unidade. Consulta o CNPJ e define `statusCadastro` (RN-03) |
| POST | `/auth/login` | PUBLICO | E-mail e senha. Devolve `acesso`, `renovacao` e o resumo do usuário |
| POST | `/auth/google` | PUBLICO | Entra ou cadastra com o `idToken` do Google (RN-04) |
| POST | `/auth/renovar` | PUBLICO | Troca o token de renovação por um novo par |
| POST | `/auth/sair` | TUTOR, LOJA | Revoga o token de renovação |
| POST | `/auth/confirmar-email` | PUBLICO | Confirma o e-mail com o código do link |
| POST | `/auth/reenviar-confirmacao` | PUBLICO | Reenvia o e-mail de confirmação |
| POST | `/auth/esqueci-senha` | PUBLICO | Envia o link de redefinição. Sempre responde 202, exista ou não o e-mail |
| POST | `/auth/redefinir-senha` | PUBLICO | Define a nova senha com o código recebido |
| GET | `/eu` | TUTOR, LOJA | Dados da conta e dos perfis |
| PUT | `/eu` | TUTOR, LOJA | Edita nome, telefone e CPF opcional |

---

## 3. Tutor

### 3.1 Pets e carteira de vacinas

| Método | Rota | Perfil | Descrição | Regra |
|---|---|---|---|---|
| GET | `/tutor/pets` | TUTOR | Pets do tutor | RN-20 |
| POST | `/tutor/pets` | TUTOR | Cadastra pet (espécie, raça, porte, nascimento) | RN-20 |
| GET | `/tutor/pets/{petId}` | TUTOR | Detalhe do pet | |
| PUT | `/tutor/pets/{petId}` | TUTOR | Edita pet | |
| DELETE | `/tutor/pets/{petId}` | TUTOR | Remove pet (exige que não haja agendamento ativo) | |
| GET | `/tutor/pets/{petId}/carteira` | TUTOR | Vacinas e histórico, com selo `LOJA` (verificado) ou `TUTOR` | RN-21 |
| POST | `/tutor/pets/{petId}/registros` | TUTOR | Informa vacina ou procedimento feito fora do PetCare (`origem = TUTOR`) | RN-21 |
| PUT | `/tutor/pets/{petId}/registros/{registroId}` | TUTOR | Edita um registro informado pelo tutor. Registro da loja devolve 403 `REGISTRO_VERIFICADO` | RN-21 |
| DELETE | `/tutor/pets/{petId}/registros/{registroId}` | TUTOR | Remove um registro informado pelo tutor | RN-21 |
| POST | `/tutor/pets/{petId}/registros/{registroId}/comprovante` | TUTOR | Anexa foto do comprovante (`multipart`, imagem ou PDF até 5 MB) | RN-21 |
| GET | `/tutor/pets/{petId}/permissoes` | TUTOR | Lojas que podem ver a carteira depois do atendimento | RN-23 |
| PUT | `/tutor/pets/{petId}/permissoes/{lojaId}` | TUTOR | Concede a permissão | RN-23 |
| DELETE | `/tutor/pets/{petId}/permissoes/{lojaId}` | TUTOR | Retira a permissão | RN-23 |
| GET | `/tutor/pets/{petId}/lembretes` | TUTOR | Próximo reforço de vacina e próximo banho | RN-24 |

### 3.2 Cartão de garantia

O PetCare **nunca** recebe o número do cartão (RNF-10). O app envia o cartão direto ao provedor, com o SDK dele, e recebe um token; o token vai para a API.

| Método | Rota | Perfil | Descrição |
|---|---|---|---|
| POST | `/tutor/cartoes-garantia` | TUTOR | Adiciona um cartão (`tokenProvedor`, `bandeira`, `final`) |
| GET | `/tutor/cartoes-garantia` | TUTOR | Cartões cadastrados (bandeira, final e se garante algum pedido) |
| DELETE | `/tutor/cartoes-garantia/{id}` | TUTOR | Remove o cartão. Se ele garante um pedido confirmado, os pedidos passam para outro cartão; sem outro, recusa com `409 CARTAO_GARANTIA_EM_USO` (RN-74) |

### 3.3 Agendamentos do tutor

| Método | Rota | Perfil | Descrição | Regra |
|---|---|---|---|---|
| POST | `/tutor/agendamentos` | TUTOR | Cria o pedido e a cobrança do sinal (se a loja cobra sinal). Guarda a política da loja no pedido. Exige `Idempotency-Key` | RN-40 a RN-42, RN-50, RN-51, RN-58 |
| GET | `/tutor/agendamentos` | TUTOR | Lista (`status`, `de`, `ate`, paginação) | |
| GET | `/tutor/agendamentos/{id}` | TUTOR | Detalhe, itens, pagamentos e histórico de estados | |
| POST | `/tutor/agendamentos/{id}/cancelar` | TUTOR | Cancela. A resposta traz o resultado financeiro (`multaCentavos`, `sinalDevolvidoCentavos`, `diferencaACobrarCentavos`) | RN-46, RN-57 |
| POST | `/tutor/agendamentos/{id}/remarcar` | TUTOR | Muda os horários, mantendo o sinal. Depende de P-08 | RN-46 |
| POST | `/tutor/agendamentos/{id}/pagar-restante` | TUTOR | Cria a cobrança do restante, depois do atendimento | RN-52 |
| GET | `/tutor/agendamentos/{id}/nota-fiscal` | TUTOR | Baixa o PDF ou XML da NFS-e anexada pela loja | RN-55 |
| POST | `/tutor/agendamentos/{id}/avaliacao` | TUTOR | Avalia a loja: `nota` de 1 a 5, `comentario?` | RN-60, RN-61 |

**Criar pedido (exemplo):**

```json
POST /api/v1/tutor/agendamentos
Idempotency-Key: 6f1c1f0e-2f43-4a51-8d5c-9d3f0c1a7b10

{
  "unidadeId": "6710a1...",
  "itens": [
    { "petId": "670f9c...", "servicoId": "6710b2...", "inicio": "2026-11-20T13:00:00Z" },
    { "petId": "670f9d...", "servicoId": "6710b3...", "inicio": "2026-11-20T14:00:00Z" }
  ],
  "metodoSinal": "PIX"
}
```

```json
201 Created
{
  "id": "6711c4...",
  "status": "AGUARDANDO_PAGAMENTO",
  "totalCentavos": 18000,
  "sinalCentavos": 9000,
  "politica": { "sinalPercentual": 50, "multaPercentual": 50, "horasSemMulta": 2 },
  "pagarAte": "2026-11-10T16:45:00Z",
  "pagamento": {
    "id": "6711c5...",
    "metodo": "PIX",
    "pix": { "copiaECola": "000201...", "qrCodeImagem": "https://..." }
  }
}
```

Com `metodoSinal = CARTAO`, o corpo traz o `tokenCartao` (ou usa o cartão de garantia) e a resposta vem com `status = PENDENTE` assim que o provedor aprova. O estado `AGUARDANDO_PAGAMENTO` e o prazo `pagarAte` valem porque o sinal é cobrado ao pedir (P-07, decidido pelo PO).

### 3.4 Busca de lojas (público e tutor)

| Método | Rota | Perfil | Descrição | Regra |
|---|---|---|---|---|
| GET | `/lojas` | PUBLICO | Busca: `lat`, `lng`, `raioKm`, `cidade`, `servico`, `especie`, `precoMax`, `notaMin`, `ordem` (`distancia`, `nota`, `preco`). Só lojas aprovadas e em dia | RN-17, RN-30 |
| GET | `/lojas/{lojaId}` | PUBLICO | Página da loja: unidades, catálogo, política de cancelamento (sinal e multa), nota média, telefone | RN-31, RN-58 |
| GET | `/lojas/{lojaId}/avaliacoes` | PUBLICO | Avaliações publicadas, com a resposta da loja | RN-61 |
| GET | `/unidades/{unidadeId}/disponibilidade` | PUBLICO | Horários livres: `servicoId`, `data`, `petId?`. Desconta os horários ocupados no Google Agenda da loja, quando conectado | RN-41, RN-75 |

**Disponibilidade (exemplo de resposta):**

```json
{
  "unidadeId": "6710a1...",
  "servicoId": "6710b2...",
  "data": "2026-11-20",
  "horarios": [
    { "inicio": "2026-11-20T12:00:00Z", "livre": true },
    { "inicio": "2026-11-20T12:30:00Z", "livre": true },
    { "inicio": "2026-11-20T13:00:00Z", "livre": false }
  ]
}
```

---

## 4. Loja

### 4.1 Cadastro, unidades e catálogo

| Método | Rota | Perfil | Descrição | Regra |
|---|---|---|---|---|
| GET | `/loja` | LOJA | Dados da loja, status do cadastro e da mensalidade | RN-03, RN-17 |
| PUT | `/loja` | LOJA | Edita nome fantasia, telefone e canais de aviso (`painel`, `sms`, `whatsapp`, `email`) | RN-71 |
| GET | `/loja/politica-cancelamento` | LOJA | Sinal e multa vigentes | RN-56 |
| PUT | `/loja/politica-cancelamento` | LOJA | Define `sinalPercentual` (0 a 100) e `multaPercentual` (0 a 50, teto do PO). Vale só para pedidos novos | RN-56, RN-58 |
| GET | `/loja/unidades` | LOJA | Unidades da loja | RN-10 |
| POST | `/loja/unidades` | LOJA | Cria unidade (endereço, horário, capacidade, raio do táxi pet) | RN-10, RN-11, RN-13 |
| PUT | `/loja/unidades/{unidadeId}` | LOJA | Edita unidade. Mudar horário ou capacidade recria os intervalos futuros | RN-13 |
| DELETE | `/loja/unidades/{unidadeId}` | LOJA | Desativa a unidade. Exige que não haja agendamento futuro | |
| PUT | `/loja/unidades/{unidadeId}/veterinarios` | LOJA | Define os veterinários (`nome`, `crmv`) | RN-14 |
| GET | `/loja/servicos` | LOJA | Catálogo da loja | RN-12 |
| POST | `/loja/servicos` | LOJA | Cria serviço (tipo, duração, preço, porte, espécies, unidades). `CONSULTA` exige unidade com veterinário | RN-12, RN-14, RN-15 |
| PUT | `/loja/servicos/{servicoId}` | LOJA | Edita serviço; não altera pedidos já feitos | |
| DELETE | `/loja/servicos/{servicoId}` | LOJA | Desativa o serviço | |

### 4.2 Pedidos e agenda

| Método | Rota | Perfil | Descrição | Regra |
|---|---|---|---|---|
| GET | `/loja/agendamentos` | LOJA | Lista (`unidadeId`, `status`, `de`, `ate`, paginação) | |
| GET | `/loja/agendamentos/{id}` | LOJA | Detalhe, tutor (nome, telefone, indicadores) e pet | RN-63 |
| GET | `/loja/agenda` | LOJA | Agenda do dia ou da semana por unidade (`unidadeId`, `data`, `visao`) | |
| POST | `/loja/agendamentos/{id}/aceitar` | LOJA | `PENDENTE` para `CONFIRMADO`, dentro do prazo | RN-42, RN-43 |
| POST | `/loja/agendamentos/{id}/recusar` | LOJA | `PENDENTE` para `RECUSADO`, com `motivo`. Devolve o sinal | RN-45 |
| POST | `/loja/agendamentos/{id}/cancelar` | LOJA | `CONFIRMADO` para `CANCELADO`, com `motivo`. Devolve o sinal | RN-45 |
| POST | `/loja/agendamentos/{id}/registrar-falta` | LOJA | `CONFIRMADO` para `FALTA` depois do horário. Aplica a multa do pedido; `dispensarMulta: true` abre mão dela (depende de P-14) | RN-47, RN-57 |
| POST | `/loja/agendamentos/{id}/concluir` | LOJA | `CONFIRMADO` para `CONCLUIDO`, com os registros feitos e o restante (`pagarNoApp` ou `pagoNaLoja`) | RN-48, RN-52 |
| POST | `/loja/agendamentos/{id}/nota-fiscal` | LOJA | Anexa o PDF ou XML da NFS-e (`multipart`, até 5 MB) | RN-55 |
| POST | `/loja/agendamentos/{id}/avaliacao-tutor` | LOJA | Avalia o tutor (privada) | RN-63 |
| GET | `/loja/pets/{petId}/carteira` | LOJA | Carteira do pet, só com agendamento ativo ou permissão do tutor; senão 404 | RN-22, RN-23 |

**Concluir (exemplo):**

```json
POST /api/v1/loja/agendamentos/6711c4.../concluir
{
  "registros": [
    {
      "petId": "670f9c...",
      "tipo": "VACINA",
      "nome": "V10",
      "proximaDose": "2027-11-20",
      "profissional": { "nome": "Dra. Ana Lima", "crmv": "SP-12345" }
    },
    { "petId": "670f9d...", "tipo": "BANHO", "nome": "Banho completo" }
  ],
  "restante": { "forma": "PAGO_NA_LOJA" }
}
```

### 4.3 Avaliações, pagamentos e mensalidade

| Método | Rota | Perfil | Descrição | Regra |
|---|---|---|---|---|
| GET | `/loja/avaliacoes` | LOJA | Avaliações recebidas, inclusive as retidas aguardando resposta | RN-61 |
| POST | `/loja/avaliacoes/{id}/resposta` | LOJA | Responde dentro das 72 h | RN-61 |
| POST | `/loja/avaliacoes/{id}/denuncia` | LOJA | Denuncia conteúdo ofensivo. A loja não edita nem apaga | RN-62 |
| GET | `/loja/conta-recebedora` | LOJA | Situação da conta no provedor (`statusKyc`) | RN-53 |
| POST | `/loja/conta-recebedora` | LOJA | Inicia o cadastro no provedor; devolve o link para a loja concluir | RN-53 |
| GET | `/loja/pagamentos` | LOJA | Sinais e restantes recebidos, com o desfecho | |
| GET | `/loja/mensalidades` | LOJA | Mensalidades e situação | RN-17 |
| POST | `/loja/mensalidades/{competencia}/cobranca` | LOJA | Gera cobrança de mensalidade em atraso | RN-17 |
| POST | `/loja/google-agenda` | LOJA | Conecta a agenda do Google nas duas vias (retorno do consentimento): envia pedidos e lê os horários ocupados | RN-72, RN-75 |
| DELETE | `/loja/google-agenda` | LOJA | Desconecta | RN-72 |

### 4.4 Tempo real para o painel

`GET /loja/eventos` (SSE, perfil `LOJA`) mantém uma conexão aberta e envia:

| Evento | Quando |
|---|---|
| `pedido.criado` | Novo pedido em `PENDENTE` |
| `pedido.prazo` | Prazo de aceite perto de vencer |
| `pedido.cancelado` | Tutor cancelou |
| `avaliacao.nova` | Comentário para responder |

O evento leva só o `id` e o tipo; o painel busca o detalhe pela rota normal. Se a conexão cair, o painel refaz a lista dos pedidos pendentes antes de reconectar.

---

## 5. Notificações, conta e privacidade

| Método | Rota | Perfil | Descrição | Regra |
|---|---|---|---|---|
| GET | `/eu/notificacoes` | TUTOR, LOJA | Lista de avisos dentro do app | RN-70 |
| PUT | `/eu/preferencias-aviso` | TUTOR | Liga ou desliga push e WhatsApp | RN-70 |
| POST | `/eu/dispositivos` | TUTOR, LOJA | Registra o token de push (FCM) do aparelho | RN-70 |
| DELETE | `/eu/dispositivos/{dispositivoId}` | TUTOR, LOJA | Remove o aparelho (ao sair) | |
| POST | `/eu/exportacao` | TUTOR | Pede a exportação dos dados (assíncrona, devolve 202) | RNF-07 |
| GET | `/eu/exportacao/{id}` | TUTOR | Situação e link para baixar | RNF-07 |
| POST | `/eu/exclusao` | TUTOR | Pede a exclusão da conta e dos dados. Exige senha ou novo login Google | RNF-06 |

---

## 6. Webhooks do provedor de pagamento

| Método | Rota | Perfil | Descrição |
|---|---|---|---|
| POST | `/webhooks/pagamentos/{provedor}` | Provedor | Recebe eventos de cobrança (pago, falhou, estornado) e de assinatura. Valida a assinatura; grava em `webhooks_recebidos`; responde 200 mesmo para evento repetido |

O provedor reenvia até receber 200. O processamento é idempotente (Modelo de dados, seção 5.3).

---

## 7. Erros

Corpo padronizado ([ADR-003](../08-analise-tecnica/adrs.md#adr-003-taxonomia-de-erros-da-api)):

```json
{
  "codigo": "HORARIO_INDISPONIVEL",
  "mensagem": "O horário escolhido não tem mais vaga.",
  "campo": "itens[0].inicio",
  "detalhes": [],
  "idRequisicao": "f3a1c2d4-..."
}
```

| Status | Quando | Exemplos de `codigo` |
|---|---|---|
| 400 | Dado inválido | `VALIDACAO`, `CNPJ_INVALIDO`, `NOTA_INVALIDA` |
| 401 | Sem token ou token vencido | `NAO_AUTENTICADO`, `TOKEN_EXPIRADO` |
| 403 | Logado, mas sem permissão | `PERFIL_INSUFICIENTE`, `REGISTRO_VERIFICADO`, `EMAIL_NAO_CONFIRMADO` |
| 404 | Não existe, ou é de outra loja | `NAO_ENCONTRADO` |
| 409 | Conflito de estado | `HORARIO_INDISPONIVEL`, `TRANSICAO_INVALIDA`, `PEDIDO_EXPIRADO`, `EMAIL_JA_CADASTRADO`, `CNPJ_JA_CADASTRADO`, `IDEMPOTENCIA_EM_USO`, `CARTAO_GARANTIA_EM_USO` |
| 422 | Regra de negócio | `CARTAO_GARANTIA_OBRIGATORIO`, `POLITICA_INVALIDA`, `LOJA_INADIMPLENTE`, `LOJA_NAO_APROVADA`, `VETERINARIO_OBRIGATORIO`, `PET_COM_AGENDAMENTO_ATIVO`, `FORA_DO_PRAZO` |
| 429 | Muitas chamadas | `LIMITE_EXCEDIDO` (com `Retry-After`) |
| 502 | Provedor de pagamento ou de mensagem fora do ar | `PROVEDOR_INDISPONIVEL` |
| 500 | Erro nosso | `ERRO_INTERNO` (sem detalhes técnicos na resposta) |

Os códigos são parte do contrato: o app decide o que mostrar a partir deles. Adicionar um código novo é compatível; mudar o significado de um existente não é.

---

## 8. Equipe interna (OPERACAO)

O Documento Negocial diz que não há perfil de administrador no produto (RN-01), mas alguém precisa revisar cadastros de loja que a verificação automática não aprovou (RN-03) e tratar denúncias (RN-62). Proposta: rotas `/operacao/...` **fora dos apps**, protegidas por um segredo de serviço e por rede restrita, usadas por uma ferramenta interna simples.

| Método | Rota | Descrição |
|---|---|---|
| GET | `/operacao/lojas?status=EM_REVISAO` | Cadastros em revisão manual |
| POST | `/operacao/lojas/{lojaId}/aprovar` | Aprova |
| POST | `/operacao/lojas/{lojaId}/rejeitar` | Rejeita, com motivo |
| GET | `/operacao/denuncias` | Avaliações denunciadas |
| POST | `/operacao/avaliacoes/{id}/remover` | Remove conteúdo ofensivo |

A forma exata (ferramenta própria, console do banco, painel interno) é uma decisão que falta, listada na seção 10.

---

## 9. Evolução do contrato

- A versão vai na URL (`/api/v1`). Mudança que quebra o cliente cria `/api/v2`; a `v1` continua até o app Android antigo deixar de ser usado.
- **Compatível:** campo novo opcional na resposta, rota nova, código de erro novo, valor novo numa enumeração (o app trata valor desconhecido como "outro").
- **Quebra:** remover ou renomear campo, mudar tipo, tornar obrigatório um campo opcional, mudar o significado de um código.
- Depois de aceito, o OpenAPI vira o arquivo de referência. A API gera o OpenAPI em `/q/openapi` e um teste confere que ele não divergiu do arquivo versionado.
- Os dois lados escrevem **testes de contrato**: o backend contra o OpenAPI, e o app contra respostas de exemplo (*mocks*) geradas dele.

---

## 10. Decisões que faltam

| # | Decisão | Onde |
|---|---|---|
| 1 | ~~Quando o sinal é cobrado~~: decidido, ao pedir; o estado `AGUARDANDO_PAGAMENTO` vale e a loja sem sinal pula o estado | P-07 |
| 1a | ~~Teto da multa, dispensa e cartão de garantia~~: decididos (teto 50%, dispensa sim, cartão só se preciso) | P-13 a P-15 |
| 2 | ~~Remarcação exige novo aceite~~: decidido (sim). Falta detalhar a rota `remarcar` | P-08 |
| 3 | Duração dos tokens de acesso e de renovação | Segurança |
| 4 | Limites de chamadas por rota | Testes de carga |
| 5 | Ferramenta da equipe interna (OPERACAO) | Seção 8 |
| 6 | Formato do OpenAPI e geração do cliente Dart | ADR do app Flutter |
