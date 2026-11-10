# Comparativo Kotlin x Node.js e hospedagem do backend (v1.0)

> **Sistema-alvo.** Responde à dúvida do PO de 10/11/2026: a Vercel só aceita aplicações baseadas em Node.js e é a opção mais barata do mercado, então vale trocar Kotlin por Node? Este documento é **proposta de análise**, não decisão: o [ADR-006](../08-analise-tecnica/adrs.md#adr-006-flutter-na-web-e-no-mobile-e-kotlin-no-backend-quarkus) (Kotlin com Quarkus) continua valendo até o PO decidir o contrário.
>
> Os limites e preços da Vercel foram lidos na documentação oficial em 10/11/2026 (seção 8). Nada aqui foi medido nem testado neste projeto.

---

## 1. Resumo

- **A premissa mudou.** A Vercel não é só Node.js: a documentação atual lista também Bun, Python, Go, Ruby, Rust e, em **Beta**, o **Container Runtime**, que roda qualquer imagem OCI (Dockerfile). Um backend Kotlin com Quarkus cabe nele, e a própria Vercel cita uma API Java em container como exemplo.
- **A Vercel não é um servidor virtual (VPS).** É uma plataforma de funções sob demanda, com limite de duração por chamada. O servidor virtual mais barato da estimativa de custo é o da Hetzner (€ 6,49 por mês), mas fica fora do Brasil.
- **Preço não é o que separa as opções.** Na estimativa de nuvem, o backend no Cloud Run custa a partir de ~US$ 13 por mês (a estimativa avisa que o preço de São Paulo é mais alto); a Vercel Pro custa US$ 20 por mês com US$ 20 de uso incluído. O **plano grátis (Hobby) é só para uso não comercial**, então não serve para um produto que cobra mensalidade.
- **O que pesa de verdade** são três regras do Pertim que pedem processo vivo: as **tarefas agendadas** (prazo de aceite), o **SSE** do painel e a **conexão com o MongoDB**. Em funções sob demanda, cada uma precisa de um ajuste.
- **Kotlin ou Node não muda o app Flutter nem o contrato da API.** O cliente é gerado do OpenAPI (ADR-009), então a linguagem do backend pode mudar sem refazer telas.
- **Recomendação:** manter Kotlin com Quarkus no Cloud Run em São Paulo (decisão atual). Se o PO quiser mesmo a Vercel, o caminho mais seguro é **Node com TypeScript** e região `gru1`, e antes disso vale um teste de um dia (seção 7).

---

## 2. O que a Vercel oferece hoje

| Tema | O que a documentação diz | Efeito no Pertim |
|---|---|---|
| Linguagens oficiais | Node.js, Bun, Python, Rust, Go, Ruby, Wasm, Edge e **Container** | Kotlin só entra pelo Container |
| Container Runtime | **Beta** em todos os planos; roda imagem OCI e escala sozinho; cobrança por CPU ativa | Kotlin com Quarkus é possível, mas é recurso em Beta |
| Duração máxima de uma chamada | Hobby: 300 s. Pro: 800 s (1.800 s em Beta) | Conexões SSE caem e o painel precisa reconectar (a E8 já desenha isso) |
| Memória | Hobby: 2 GB. Pro: até 4 GB | Cabe para uma JVM, sem folga grande |
| Processo vivo | Funções sob demanda; instâncias sem tráfego desligam (container: após 5 minutos) | `quarkus-scheduler` e `node-cron` dentro do processo **não são confiáveis** |
| Tarefas agendadas | Cron da Vercel chama uma função. Pro: a cada minuto. Hobby: uma vez por dia, com atraso de até 59 minutos | O prazo de aceite (24 h, 12 h, 4 h) exige o plano Pro |
| Daemons | Containers que rodam sem receber tráfego, com instâncias fixas | Alternativa para o trabalho de fundo; a página não informa o status (Beta ou geral) |
| WebSocket | Beta público | Não usamos; o painel usa SSE |
| Descritores de arquivo | 1.024 compartilhados entre execuções simultâneas | Exige pool de conexões com o MongoDB |
| Corpo de requisição | 4,5 MB (sem limite para resposta em streaming) | Cabe: o app envia o token do cartão, e não o número |
| Regiões | 19, incluindo `gru1` (São Paulo). O padrão é `iad1` (EUA) | Precisa configurar `gru1` por causa da LGPD (RNF-06 a RNF-08) |
| Plano grátis | Hobby: "uso pessoal e não comercial" | Não serve para o Pertim em produção |
| Plano Pro | US$ 20 por mês com US$ 20 de uso incluído; depois, uso pago | Custo real depende do tráfego e da memória da JVM |
| Preço de uso | A partir de US$ 0,128 por hora de CPU ativa, US$ 0,0106 por GB-hora de memória e US$ 0,60 por milhão de chamadas | Espera por banco e por provedor não conta como CPU ativa |

---

## 3. Kotlin com Quarkus x Node.js com TypeScript

Comparação para as necessidades do Pertim. O volume é pequeno (30 lojas e 100 tutores no primeiro ano, RNF-01), então desempenho bruto **não decide**.

| Critério | Kotlin + Quarkus | Node.js + TypeScript | Para o Pertim |
|---|---|---|---|
| Tipagem | Estática, com tipos nulos no compilador | Estática no editor e no build, mas some em tempo de execução | Empate prático; Kotlin é mais rígido |
| Dinheiro | `Long` em centavos | `number` (inteiro seguro até 2⁵³) em centavos | Ambos servem, desde que o dinheiro seja sempre inteiro (RN do contrato) |
| Concorrência | Várias threads; Quarkus reativo ou bloqueante | Uma thread de eventos; trabalho pesado bloqueia | A vaga atômica depende do MongoDB, não da linguagem |
| Memória e partida | JVM pesa mais e parte mais devagar; imagem nativa melhora, com build mais lento | Leve e parte rápido | **Node ganha** em hospedagem que desliga e liga a instância |
| Acesso ao MongoDB | Panache Kotlin (ADR-006) | Driver oficial, Mongoose ou Prisma | Ambos maduros |
| Tarefas agendadas | `quarkus-scheduler`, com trava no banco | `node-cron` ou agendador externo, com trava no banco | Igual: precisa de trava (F-08) em qualquer caso |
| SSE | Suporte nativo no Quarkus | Simples de escrever | Igual; o limite está na hospedagem |
| Testes de integração | `@QuarkusTest` + Testcontainers | Jest ou Vitest + Testcontainers | Igual |
| Contrato OpenAPI | Gerado do código ou escrito à mão | Idem | Igual; o app gera o cliente do arquivo |
| Documentação e decisões | ADR-006, ADR-008, diagramas, backlog F-01, F-02 e F-08 citam Quarkus e Panache | Teria de ser reescrita | **Kotlin ganha**: o custo de trocar é de documentação e backlog |
| Equipe e contratação | Menos pessoas; mais comum em empresas grandes | Muito mais pessoas; mesma linguagem de uma futura vitrine web | **Node ganha** se a equipe for pequena e vier do JavaScript |
| Código herdado | O backend atual é Java 17 com Quarkus 3.15 | Nada aproveitável (o frontend React também será substituído) | Kotlin reaproveita lógica e regras do backend atual |

Leitura: Kotlin e Node resolvem o Pertim igualmente bem. O que decide é **onde o backend roda** e **quem vai programar**.

---

## 4. Onde o backend pode rodar

| Opção | Custo mensal (servidor) | Processo vivo | Região | Observação |
|---|---|---|---|---|
| **A. Cloud Run, São Paulo** (decisão atual) | US$ 12,96 (por requisição) a US$ 103,68 (por instância) | Perfil B mantém instâncias ativas; Perfil A usa Cloud Scheduler | São Paulo | Já estimado no documento de custo |
| **B. Vercel Pro com Node** | US$ 20 com US$ 20 de uso incluído, mais uso | Não: precisa do Cron da Vercel, e o SSE reconecta | `gru1` | Funciona com ajustes; troca a linguagem do ADR-006 |
| **C. Vercel Pro com Kotlin em container** | Igual ao B, com mais memória por causa da JVM | Não; instância desliga após 5 minutos sem tráfego | `gru1` | Recurso em Beta; partida da JVM sentida |
| **D. Servidor virtual (Hetzner ou DigitalOcean)** | € 6,49 a US$ 24 | Sim, um processo sempre vivo | **Fora do Brasil** | Mais barato, sem redundância e com revisão jurídica da LGPD |

O MongoDB Atlas é o mesmo em todas as opções, e a estimativa de custo já avisa que a página dele não confirma cluster em São Paulo.

---

## 5. Como cada regra do Pertim se comporta numa função sob demanda

| Regra ou requisito | Em Cloud Run (A) | Em Vercel com Node (B) |
|---|---|---|
| Prazo de aceite vence (RN-43, RN-44) | `quarkus-scheduler` com instância ativa, ou Cloud Scheduler chamando uma rota interna | Cron da Vercel a cada minuto chamando uma rota; exige Pro |
| Sinal não pago em 15 minutos vira Abandonado | Mesma tarefa | Mesma tarefa, mais uma chamada a cada minuto |
| SSE do painel da loja (`/loja/eventos`) | Conexão aberta mantém a instância ativa e o custo sobe (Perfil B) | Cai em até 300 s no Hobby e 800 s no Pro; o painel reconecta e busca de novo |
| Webhook do provedor de pagamento | Rota normal, idempotente | Rota normal, idempotente |
| Conexão com o MongoDB | Pool por instância | Pool compartilhado com atenção ao limite de 1.024 descritores |
| Partida a frio | Instância mínima evita | O plano Pro lista "cold start prevention"; o alcance dela não foi verificado |
| Região do dado (LGPD) | São Paulo | `gru1`, que precisa ser escolhida (o padrão é os EUA) |

---

## 6. Cenários e recomendação

| Cenário | Vantagem | Risco ou custo | Veredito |
|---|---|---|---|
| **1. Manter Kotlin + Quarkus no Cloud Run** | Nada a refazer; aproveita o backend atual; São Paulo; SSE e agendador funcionam | Equipe precisa conhecer Kotlin; custo fixo a partir de ~US$ 13 | **Recomendado** |
| **2. Node + TypeScript na Vercel** | Plataforma simples de operar, deploy por Git, Node é o caminho principal da Vercel | Reescreve ADR-006, Panache, F-01, F-02 e F-08; exige Pro; agendador e SSE ganham remendos; custo de uso imprevisível | Viável se o PO quiser a Vercel ou a equipe for de JavaScript |
| **3. Kotlin em container na Vercel** | Mantém Kotlin e usa a Vercel | Recurso Beta, partida lenta da JVM, instância desliga em 5 minutos, mesmos remendos do cenário 2 | Não recomendado para o MVP |
| **4. Servidor virtual na Alemanha ou nos EUA** | Menor custo fixo | Fora do Brasil, sem redundância, a equipe cuida de atualização e backup | Só com revisão jurídica |

**Porque manter o Kotlin:** a economia da Vercel não aparece nos números disponíveis (US$ 20 por mês de base contra ~US$ 13 do Cloud Run no perfil enxuto), e o ganho de simplicidade vem com agendador externo, SSE que cai e uma região que precisa ser configurada. O custo de **trocar de linguagem** é todo de documentação e backlog, e fica menor **antes** da primeira linha de código, que é o momento atual.

**Quando trocar para Node:** se a equipe que vai programar for de JavaScript ou TypeScript, se o PO quiser a Vercel por outro motivo (deploy por Git, prévias por PR) ou se o teste da seção 7 mostrar partida a frio e custo melhores.

---

## 7. Teste de um dia antes de decidir (proposta)

Um serviço mínimo nos dois ambientes, com o MongoDB real:

1. Rota `GET /q/health` e uma rota que lê e grava no MongoDB.
2. Uma conexão SSE aberta por 10 minutos, para ver quando cai e como o painel reconecta.
3. Uma tarefa chamada a cada minuto, que grava um registro com trava, para provar que não duplica.
4. Partida a frio: tempo da primeira resposta depois de 10 minutos sem tráfego.
5. Custo observado em um dia, com um tráfego simulado de 100 tutores.

Resultado vira uma linha no ADR-006 (manter) ou um novo ADR (trocar). Entra no backlog junto com o F-09, o teste do provedor de pagamento.

---

## 8. Perguntas ao PO

| # | Pergunta | Por que importa |
|---|---|---|
| 1 | O requisito é usar a **Vercel** ou pagar **pouco**? | Se for pagar pouco, o Cloud Run enxuto ou o servidor virtual competem; se for Vercel, o cenário 2 é o caminho |
| 2 | Quem vai programar o backend: quem conhece **Kotlin ou Java**, ou quem vem do **JavaScript**? | É o critério que mais pesa entre as duas linguagens |
| 3 | A hospedagem pode ficar **fora do Brasil**? | O PO já escolheu São Paulo em 10/11/2026; fora dele só com revisão da LGPD |
| 4 | Faz sentido o **teste de um dia** da seção 7 antes do M0? | Troca opinião por medida |

---

## 9. Fontes

Documentação oficial da Vercel, lida em 10/11/2026 (campo `last_updated` entre parênteses):

- Runtimes oficiais (12/08/2026): <https://vercel.com/docs/functions/runtimes>
- Container Runtime, Beta (07/07/2026): <https://vercel.com/docs/functions/runtimes/container>
- Limites das funções (24/08/2026): <https://vercel.com/docs/functions/limitations>
- Cron jobs, uso e preço (15/07/2026): <https://vercel.com/docs/cron-jobs/usage-and-pricing>
- Regiões, incluindo `gru1` (11/08/2026): <https://vercel.com/docs/regions>
- Planos e preços: <https://vercel.com/pricing>
- Funções, containers e Daemons: <https://vercel.com/kb/guide/vercel-functions-containers-daemons>

Neste repositório: [Estimativa de custo de nuvem](Estimativa-Custo-Nuvem-v1.0.md), [Arquitetura-alvo](Arquitetura-Alvo-v2.0.md) e [ADR-006](../08-analise-tecnica/adrs.md#adr-006-flutter-na-web-e-no-mobile-e-kotlin-no-backend-quarkus).

As colunas de memória, partida e equipe da seção 3 são regras gerais de mercado, e não medições deste projeto.
