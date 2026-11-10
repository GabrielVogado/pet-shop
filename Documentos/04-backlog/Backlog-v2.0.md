# Backlog do sistema-alvo (v2.0)

> **Sistema-alvo.** Histórias organizadas em marcos, com critérios de aceite. Cada história aponta as regras do [Documento Negocial v2.0](../01-negocio/Documento-Negocial-v2.0.md) (RN), as rotas do [Contrato da API](../02-arquitetura-tecnica/Contrato-API-v2.0.md) e as telas das [Telas e fluxos](../03-ui-ux/Telas-e-Fluxos-v1.1.md).
>
> É **proposta**, sujeita às respostas do PO às pendências P-07 a P-15. A ordem substitui a dos épicos do [Roadmap v1.0](Roadmap-v1.0.md), que continua descrevendo a direção de 05/11/2026. A [definição de pronto e a estratégia de testes](Definicao-de-Pronto-e-Testes-v1.0.md) valem para todas as histórias.

---

## 1. Como ler

- **Marco** é um pedaço que entrega algo que se consegue demonstrar.
- **Tamanho** é relativo: P (dias), M (uma a duas semanas), G (mais que isso; deve ser quebrada antes de entrar em sprint). Não há estimativa de horas, porque a equipe e o ritmo ainda não foram medidos.
- Toda história cumpre a definição de pronto, inclusive o teste de isolamento entre lojas quando mexe em dado da loja.
- Os marcos M1 a M9 dependem do M0. O M4 depende também do resultado do teste do provedor de pagamento (ADR-007).

## 2. Visão dos marcos

| Marco | Entrega | Depende de |
|---|---|---|
| **M0 Fundação** | Esqueletos do backend e do app, CI, ambiente de desenvolvimento, isolamento entre lojas | |
| **M1 Contas e lojas** | Tutor e loja entram no sistema; loja aprovada configura unidades, serviços, capacidade e política | M0 |
| **M2 Pets e carteira** | Tutor cadastra pets e vê a carteira de vacinas | M1 |
| **M3 Busca** | Tutor encontra lojas e vê a página de cada uma | M1 |
| **M4 Pedido e sinal** | Tutor escolhe horário, vê o dinheiro e paga o sinal | M2, M3, ADR-007 |
| **M5 Ciclo do pedido** | Loja aceita ou recusa; prazos, cancelamento, falta e conclusão | M4 |
| **M6 Avaliações** | Tutor avalia, loja responde, plataforma modera | M5 |
| **M7 Avisos** | Push, e-mail e SSE; canais da loja | M5 |
| **M8 Privacidade e mensalidade** | Exportação e exclusão de dados; cobrança da loja | M1, M5 |
| **M9 Publicação** | Android na Google Play e painel web em produção | todos |

---

## 3. Histórias

### M0 Fundação

| ID | História | Critérios de aceite | Tam. |
|---|---|---|---|
| F-01 | Como equipe, quero um backend Kotlin/Quarkus que sobe e responde `/q/health`, para ter onde construir | Sobe com `docker compose`; testes rodam no CI; Panache Kotlin ligado ao MongoDB local | M |
| F-02 | Como equipe, quero o repositório base que exige `lojaId`, para o isolamento não depender de memória (ADR-008) | Consulta sem `lojaId` não compila ou falha no teste; índices começam por `lojaId`; **teste de isolamento** de exemplo passa: loja A recebe 404 ao pedir dado da loja B | M |
| F-03 | Como equipe, quero o corpo de erro padrão e o `idRequisicao`, para os clientes tratarem erros por `codigo` (Contrato, seção 7) | Todo erro devolve `codigo`, `mensagem`, `campo`, `detalhes`, `idRequisicao`; teste cobre 400, 401, 403, 404, 409 e 500 | P |
| F-04 | Como equipe, quero o OpenAPI gerado do contrato, para o app gerar o cliente (ADR-009) | Arquivo versionado; o CI falha se a API divergir dele | M |
| F-05 | Como equipe, quero o esqueleto do app Flutter com tema, navegação, cliente da API e a tela T1 vazia (ADR-009) | Dois pontos de entrada compilam; tema em um lugar; erro por `codigo` mostrado em português | M |
| F-06 | Como equipe, quero CI em todo PR, para nenhum código entrar sem teste | Testes do backend e do app, análise estática e verificação de links dos documentos rodam; PR com teste vermelho não é mesclado | M |
| F-07 | Como equipe, quero o ambiente de desenvolvimento publicado, para testar de verdade | Backend e app web acessíveis, banco `petcare_dev`, chaves JWT próprias (Manual de git-flow, seção 2). Depende da escolha da nuvem | M |
| F-08 | Como equipe, quero a tarefa agendada com trava, para os prazos funcionarem sem duplicar execução | Duas instâncias não rodam a mesma tarefa ao mesmo tempo; teste prova a trava (Arquitetura-alvo, seção 6) | P |
| F-09 | Como equipe, quero o teste do provedor de pagamento em sandbox, para decidir o ADR-007 | Cobrança Pix, webhook idempotente, estorno e cobrança de cartão guardado sem o tutor presente funcionam no sandbox; resultado registrado no ADR | M |

### M1 Contas e lojas

| ID | História | Critérios de aceite | Rotas / telas | Tam. |
|---|---|---|---|---|
| C-01 | Como tutor, quero criar conta com e-mail e senha e confirmar o e-mail (RN-04) | Senha forte; e-mail não confirmado não agenda; confirmação reenviável | `/auth/*` | M |
| C-02 | Como tutor, quero entrar com Google (RN-04) | Conta criada no primeiro acesso; mesmo e-mail não duplica conta | T1 | P |
| C-03 | Como usuário, quero recuperar a senha | Link expira; senha antiga deixa de valer; resposta igual para e-mail existente ou não | T1 | P |
| C-04 | Como usuário, quero sessão que renova sozinha | Acesso de 15 min e renovação de 30 dias; renovação revoga a anterior; sair invalida a sessão | `/auth/refresh` | M |
| C-05 | Como loja, quero me cadastrar com CNPJ (RN-03, RN-10) | CNPJ ativo, CNAE compatível e e-mail confirmado aprovam sozinho; senão vai para revisão manual; loja não aprovada não aparece na busca | W1 | G |
| C-06 | Como equipe, quero revisar manualmente as lojas pendentes (OPERACAO) | Lista, aprova e recusa com motivo; a loja é avisada; fica registrado quem decidiu | `/operacao/*` | M |
| C-07 | Como loja, quero cadastrar unidades com endereço e horário (RN-10, RN-11) | Várias unidades por CNPJ; horário por dia da semana; geolocalização do endereço | `/loja/unidades` | M |
| C-08 | Como loja, quero montar o catálogo (RN-12, RN-14, RN-15) | Tipo, duração, preço por porte e unidades; consulta veterinária exige CRMV; táxi pet com raio | W6 | M |
| C-09 | Como loja, quero informar a capacidade por tipo de serviço (RN-13) | Número de atendimentos simultâneos por unidade e tipo; muda só para o futuro | W6 | P |
| C-10 | Como loja, quero definir sinal e multa (RN-56 a RN-58) | Sinal de 0 a 100 e multa de 0 a 50; exemplo calculado na tela; aviso de que só vale para pedidos novos; `POLITICA_INVALIDA` para valor fora da faixa | W5 | P |

### M2 Pets e carteira

| ID | História | Critérios de aceite | Rotas / telas | Tam. |
|---|---|---|---|---|
| P-01 | Como tutor, quero cadastrar meus pets (RN-20) | Espécie, raça, porte e idade; editar e remover; só o dono vê | `/tutor/pets` | M |
| P-02 | Como tutor, quero lançar vacinas na carteira (RN-21) | Registro com selo "Informado por você"; editável por mim | T9 | M |
| P-03 | Como tutor, quero ver o próximo reforço (RN-24) | Calculado do registro; aparece na carteira | T9 | P |
| P-04 | Como tutor, quero permitir ou retirar o acesso de uma loja à carteira (RN-22, RN-23) | Permissão por loja; retirar vale na hora; loja sem acesso recebe 404, não 403 | T9 | M |
| P-05 | Como loja, quero ver a carteira do pet com agendamento comigo (RN-22) | Mostra os selos; loja sem agendamento ativo nem permissão recebe 404 | W4 | M |

### M3 Busca

| ID | História | Critérios de aceite | Rotas / telas | Tam. |
|---|---|---|---|---|
| B-01 | Como tutor, quero buscar lojas por cidade, serviço, espécie, preço e nota (RN-30) | Só lojas aprovadas e em dia (RN-17); paginação; estado vazio com próxima ação | T2 | G |
| B-02 | Como tutor, quero ordenar por distância (RN-30) | Usa a localização com permissão do usuário; sem permissão, cai na cidade. Depende da decisão do provedor de mapas | T2 | M |
| B-03 | Como tutor, quero ver a página da loja (RN-31) | Fotos, nota, endereço, telefone, política de cancelamento em reais de exemplo e catálogo | T3 | M |

### M4 Pedido e sinal

| ID | História | Critérios de aceite | Rotas / telas | Tam. |
|---|---|---|---|---|
| A-01 | Como tutor, quero ver horários livres (RN-41) | Intervalos de 30 min com capacidade livre; pendente ocupa a vaga (RN-42) | T4 | M |
| A-02 | Como tutor, quero pedir vários serviços e pets de uma vez (RN-40) | Cada serviço indica o pet; vagas reservadas de forma atômica; corrida entre dois tutores deixa só um com a vaga | T4 | G |
| A-03 | Como tutor, quero ver o total, o sinal e a multa em reais antes de confirmar (RN-56 a RN-58) | Valores batem com a política da loja; a política é copiada para o pedido e não muda depois | T5 | M |
| A-04 | Como tutor, quero guardar um cartão de garantia quando a multa puder passar do sinal (RN-50) | Cartão tokenizado no provedor; o PetCare não guarda dados de cartão (RNF-10); troca e remoção; não remove o único cartão (RN-74) | `/tutor/cartao` | G |
| A-05 | Como tutor, quero pagar o sinal no Pix (RN-51) | QR Code e copia e cola; 15 min para pagar; webhook idempotente muda o pedido para Pendente; sem pagar, vira Abandonado e a vaga volta | T6 | G |
| A-06 | Como tutor de loja sem sinal, quero que o pedido já nasça Pendente | Pula o pagamento; mesmas regras de vaga | T5 | P |

### M5 Ciclo do pedido

| ID | História | Critérios de aceite | Rotas / telas | Tam. |
|---|---|---|---|---|
| O-01 | Como loja, quero ver os pedidos pendentes com o prazo de aceite (RN-42, RN-43) | Lista em tempo real (SSE); indicadores do tutor (RN-63); prazo conforme a antecedência | W2 | M |
| O-02 | Como loja, quero aceitar ou recusar | Aceitar confirma; recusar devolve o sinal e libera a vaga (RN-45); tutor avisado com sugestões | W2 | M |
| O-03 | Como sistema, quero expirar pedidos sem resposta (RN-44) | Tarefa a cada minuto; sinal devolvido; vaga liberada; lembrete 5 min antes para a loja | | M |
| O-04 | Como tutor, quero cancelar sabendo o que acontece (RN-46, RN-73) | Mais de 2 h: sem multa. Menos de 2 h: multa da política do pedido; excedente devolvido ou diferença cobrada no cartão de garantia. Remarcação recusada pela loja: cancelamento sem multa a qualquer momento | T8 | G |
| O-05 | Como loja, quero cancelar por imprevisto (RN-45) | Sinal devolvido por inteiro, sempre | W4 | P |
| O-06 | Como loja, quero registrar a falta do tutor (RN-47) | Só depois do horário; aplica a multa; `dispensarMulta` quando a loja abrir mão (P-14) | W4 | M |
| O-07 | Como loja, quero concluir o atendimento com os registros (RN-48) | Exige os procedimentos; vacina exige CRMV; grava na carteira com selo "Verificado pela loja" | W4 | G |
| O-08 | Como tutor, quero pagar o restante pelo app ou como pago na loja (RN-52) | Sinal abatido do total; a loja pode marcar "pago na loja" | T8, W4 | M |
| O-09 | Como loja, quero anexar a nota fiscal (RN-55) | Anexo no pedido; tutor baixa no detalhe | W4, T8 | P |
| O-10 | Como tutor e loja, quero ver a agenda (RN-42) | Tutor: próximos e histórico; loja: grade por hora e tipo | T7, W3 | M |

### M6 Avaliações

| ID | História | Critérios de aceite | Rotas / telas | Tam. |
|---|---|---|---|---|
| V-01 | Como tutor, quero avaliar a loja depois do atendimento (RN-60) | Nota de 1 a 5, comentário opcional; só quem concluiu avalia; uma vez por pedido | T10 | M |
| V-02 | Como sistema, quero reter o comentário por 72 h (RN-61) | A nota entra na média na hora; o comentário publica depois das 72 h, com a resposta se houver | | M |
| V-03 | Como loja, quero responder e denunciar (RN-61, RN-62) | Responder dentro das 72 h; a loja não edita nem apaga; denúncia vai para a revisão da plataforma | W7 | M |
| V-04 | Como loja, quero avaliar o tutor em privado (RN-63) | Outras lojas veem só `concluidos`, `faltas` e `notaMedia` | W4 | P |

### M7 Avisos

| ID | História | Critérios de aceite | Tam. |
|---|---|---|---|
| N-01 | Como tutor, quero receber push dos eventos do meu pedido (RN-70) | Aceito, recusado, expirado, cancelado e lembrete do horário; preferências por tipo | G |
| N-02 | Como loja, quero escolher os canais de aviso (RN-71) | Painel e e-mail sempre disponíveis; SMS e WhatsApp dependem de decisões do PO | M |
| N-03 | Como loja, quero integrar ao Google Agenda nas duas vias (RN-72, RN-75) | Pedido confirmado vira evento; cancelado remove; compromissos do Google deixam o horário indisponível no app | M |
| N-04 | Como tutor, quero lembretes de reforço de vacina e do próximo banho (RN-24) | Tarefa diária; respeita preferências | M |

### M8 Privacidade e mensalidade

| ID | História | Critérios de aceite | Tam. |
|---|---|---|---|
| L-01 | Como tutor, quero baixar meus dados (RNF-07) | Histórico e carteira em formato aberto; pedido registrado e entregue em prazo definido | M |
| L-02 | Como tutor, quero excluir minha conta (RNF-06) | Dados apagados; pagamentos e notas retidos pelo prazo legal (RNF-08) sem ligação com o perfil | G |
| L-03 | Como loja, quero pagar a mensalidade (RN-17) | Cobrança recorrente; atraso tira a loja da busca e bloqueia novos pedidos, sem afetar os já confirmados. Valor pendente do PO | G |
| L-04 | Como PO e encarregado, quero atender pedidos da LGPD (RNF-11) | Canal de privacidade publicado; pedidos registrados em `solicitacoes_lgpd` | P |

### M9 Publicação

| ID | História | Critérios de aceite | Tam. |
|---|---|---|---|
| R-01 | Como equipe, quero o ambiente de produção separado | Banco, chaves e segredos próprios; cópia de segurança testada; janela de manutenção de 1 h (RNF-02) | G |
| R-02 | Como equipe, quero publicar o app Android na Google Play | Conta de desenvolvedor, política de privacidade publicada, versão assinada | G |
| R-03 | Como equipe, quero monitorar a produção | Saúde, erros por `idRequisicao` e alerta de falha de webhook e de tarefa parada | M |

---

## 4. Telas que ainda faltam desenhar

As histórias C-01, C-03, P-01, A-04, N-01, L-01, L-02, L-03 e N-02 precisam das telas listadas na seção 5 das [Telas e fluxos](../03-ui-ux/Telas-e-Fluxos-v1.1.md). Elas entram na v1.1 desse documento antes de a história ser puxada.

## 5. Riscos que mexem no backlog

| Risco | Efeito | Onde está |
|---|---|---|
| Provedor de pagamento não cobrar o cartão guardado sem o tutor | A multa acima do sinal não funciona; muda A-04 e O-04 | ADR-007 |
| Cloud Run cobrado por requisição não roda tarefas agendadas | Pedidos não expiram; muda F-08 e O-03 | Arquitetura-alvo, seção 8 |
| Pendências P-07 a P-15 respondidas diferente da proposta | Muda os estados do pedido e a ordem do M4 e M5 | Modelo de dados |
| Escolha do provedor de mapas | Muda B-02 e o custo | Telas, seção 6 |
