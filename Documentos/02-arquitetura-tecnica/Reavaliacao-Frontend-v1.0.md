# Reavaliação do frontend: web e mobile (v1.0)

> **Decidido pelo PO em 11/11/2026: opção A** (React na web, Kotlin no Android, módulo KMP enxuto). Registrado nos [ADR-010 e ADR-011](../08-analise-tecnica/adrs.md#adr-010-web-em-react-e-vite). Os números de esforço são estimativas sem medição, para comparar as opções entre si.

## 1. Os argumentos do especialista, um a um

| Argumento | Procede? | Comentário |
|---|---|---|
| React + Vite é mais leve e rápido na web | **Sim** | O Flutter na web baixa um motor próprio (alguns MB) antes de mostrar a primeira tela, desenha tudo em canvas e tem pior suporte a leitor de tela, seleção de texto, autopreenchimento e busca do navegador. Para o painel da loja (tabelas, agenda, formulários longos) isso pesa. Para uma tela de login do tutor, pesa menos |
| O projeto já tem base web | **Em parte** | Existe uma SPA React 19 + Vite de 36 arquivos, feita para o MVP de um petshop só. O ADR-006 definiu reescrever tudo, então o que se aproveita é o conhecimento e parte dos componentes, não o produto pronto |
| Com backend Kotlin, faria sentido KMP | **Em parte** | KMP compartilha **lógica** (modelos da API, cálculo de multa e prazo, cliente HTTP) entre backend, Android e, depois, iOS. Não compartilha a tela, a menos que se use Compose Multiplatform. A web em Kotlin ainda é a parte menos madura; confira o estado atual antes de apostar nela |
| App só Android: compensa ir direto em Kotlin | **Sim, para o MVP** | Kotlin com Jetpack Compose é o caminho oficial do Android: melhor integração com push, câmera, localização e mais fácil de achar desenvolvedor. O custo aparece se o iOS virar requisito |

O argumento de que "Dart não foi feito para web" é exagerado: o Flutter web funciona e é usado em produção. Ele só é uma escolha pior para aplicações de dados, como o painel da loja.

## 2. As opções

| | A. React web + Kotlin Android + KMP enxuto | B. React web + Flutter só no mobile | C. Flutter em tudo (ADR-006 atual) |
|---|---|---|---|
| Web (tutor e loja) | React + Vite | React + Vite | Flutter web |
| Android | Kotlin nativo (Compose) | Flutter | Flutter |
| iOS depois | KMP + SwiftUI ou Compose Multiplatform | Flutter, quase de graça | Flutter, quase de graça |
| Bases de código de interface | 2 (web e Android) | 2 (web e mobile) | 1 |
| Linguagens no projeto | Kotlin e TypeScript | Dart, TypeScript e Kotlin | Dart e Kotlin |
| Reaproveita com o backend | Modelos e regras de negócio (KMP) | Só o contrato OpenAPI | Só o contrato OpenAPI |
| Desempenho e acessibilidade web | Melhores | Melhores | Piores |
| Esforço de interface no MVP (estimativa relativa) | Maior: cerca de 1,3 a 1,5 vez a opção C | Cerca de 1,2 vez a C | Base (1) |
| Esforço extra para o iOS | Médio a alto | Baixo | Baixo |
| Risco principal | Duas interfaces para manter; KMP exige disciplina | Três linguagens; Dart sem ligação com o backend | Web pesada e menos acessível; Dart sem ligação com o backend |

## 3. Recomendação (aceita)

**Opção A**, com KMP limitado ao que dá retorno claro:

1. **Web (painel da loja e web do tutor): React + Vite + TypeScript.** É onde o Flutter é mais fraco, e a loja usa o painel o dia todo.
2. **Android do tutor: Kotlin nativo com Jetpack Compose.** O MVP é só Android e o backend já é Kotlin.
3. **Módulo KMP compartilhado e pequeno** (modelos da API, política de multa e prazos, cliente HTTP), usado pelo backend e pelo app. Isso evita que o cálculo da multa seja escrito em duas linguagens e saia diferente. Interface **não** entra no KMP.
4. **Contrato OpenAPI como fonte única**, com clientes gerados em TypeScript e Kotlin.

Por que não a B: ela mantém o Flutter só para resolver o iOS, que está fora do MVP, e deixa o projeto com três linguagens. Por que não a C: é a mais barata de construir, mas é a que mais se afasta do que o especialista aponta e de onde o produto mais usa a tela (o painel).

**Quando eu mudaria de ideia:** se o iOS entrar nos primeiros 12 meses, a B passa a ser competitiva. Se a equipe de desenvolvimento for de uma pessoa só, a C reduz o risco de manter duas interfaces.

## 4. O que muda se a decisão for A

| Item | Impacto |
|---|---|
| ADR-006 | A parte do frontend é substituída por um ADR novo; a do backend (Kotlin, Quarkus, Panache) continua |
| ADR-009 | Substituído por dois ADRs curtos (web React e Android Kotlin). As decisões do PO sobre cookie HttpOnly, push do sistema e mapa gratuito continuam valendo |
| Contrato da API, modelo de dados, diagramas de engenharia | Nenhum, o contrato não depende da linguagem do cliente |
| Telas e fluxos (Figma) | Nenhum, são wireframes independentes de tecnologia |
| Backlog | F-05 (esqueleto do app) vira dois itens; F-04 gera dois clientes; a definição de pronto troca as ferramentas de teste |
| Arquitetura-alvo | Ajuste nos contêineres e na implantação: a web estática pode ir para CDN ou hospedagem estática |
| Esforço de documentação | Cerca de meio dia |
| Estimativa de custo de nuvem | Sem mudança relevante; hospedar o React estático costuma ser mais barato que servir Flutter web |

## 5. Decisão

O PO escolheu a opção A em 11/11/2026. O ADR-006 mantém o backend em Kotlin; a parte do frontend e o ADR-009 foram substituídos pelos ADR-010 e ADR-011.
