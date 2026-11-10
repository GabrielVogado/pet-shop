# Identidade visual (v1.0)

> **Sistema-alvo.** Nome, marca, cores, tipografia, formas, ícones e tom de voz do produto. Vale para o app do tutor (Android), para o painel web da loja e para tudo o que for publicado (Play Store, e-mails, avisos).
>
> Decidido pelo PO em 10/11/2026, entre três direções e quatro nomes. Substitui a paleta herdada do protótipo React (tinta, coral, oceano, menta e papel, fonte Inter), que nunca foi decidida e cujo botão principal tinha contraste 3,0:1, abaixo do mínimo AA pedido em [Telas e fluxos, seção 4](Telas-e-Fluxos-v1.0.md).

---

## 1. Nome

**Pertim.** Vem de "pertinho" no jeito mineiro de falar: a loja boa fica perto de casa. A busca por loja próxima é o centro do produto, e o nome conta isso.

| | |
|---|---|
| Grafia | Sempre `Pertim`, com P maiúsculo no texto corrido. Na assinatura visual, tudo em minúsculas: `pertim` |
| Assinatura | *O pet shop pertinho de você.* |
| Pronúncia | "per-TCHIM", oxítona |
| Por que não "PetCare" | Termo genérico em inglês, usado por dezenas de apps e clínicas, difícil de registrar e de achar na Play Store. O produto é só em português (RNF-03) |

**Antes de usar o nome em público:**

1. Busca de marca no INPI nas classes 35 (marketplace), 42 (software) e 44 (serviços para animais).
2. Domínio `.com.br` e nome de usuário nas redes.
3. Só então a troca de "PetCare" para "Pertim" nos documentos, no repositório e no código, num PR próprio. Até lá os outros documentos continuam dizendo PetCare.

---

## 2. Marca

O símbolo é um **alfinete de mapa com uma pegada dentro**: a loja no mapa, perto de casa, com o pet no centro.

| Peça | Arquivo | Uso |
|---|---|---|
| Símbolo | [`marca/pertim-simbolo.svg`](marca/pertim-simbolo.svg) | Cabeçalho do painel, avatar, favicon, marcador do mapa |
| Ícone do app | [`marca/pertim-icone-app.svg`](marca/pertim-icone-app.svg) | Ícone adaptativo do Android (pegada girassol sobre fundo pinheiro), splash |
| Assinatura | Símbolo + `pertim` em Bricolage Grotesque 800, com "per" em Asfalto e "tim" em Pinheiro | Tela de entrada, Play Store, e-mails |

Os arquivos são o conceito aprovado. A versão final (curvas refinadas, assinatura convertida em contorno, versão monocromática) deve ser desenhada antes da publicação na Play Store.

**Regras de uso**

- Área livre em volta do símbolo: no mínimo um quarto da altura dele.
- Tamanho mínimo: símbolo com 24 dp de altura; assinatura com 80 dp de largura.
- Versões permitidas: colorida sobre Calçada ou branco; negativa (alfinete branco, pegada Girassol) sobre Pinheiro; monocromática em Pinheiro ou Asfalto.
- Não pode: girar, esticar, trocar as cores, pôr sombra ou contorno, usar Girassol sobre fundo branco, pôr o símbolo sobre foto sem uma base sólida.

---

## 3. Cores

Os nomes vêm da rua: praça, girassol, folha, calçada e asfalto. Cada cor tem um papel do Material 3 ([ADR-009, item 9](../08-analise-tecnica/adrs.md)), e é pelo papel que as telas pedem a cor, nunca pelo código hexadecimal.

### 3.1 Base

| Nome | Hex | Papel principal |
|---|---|---|
| Pinheiro | `#1F5B4A` | Ação principal, links, navegação ativa |
| Girassol | `#F5B82E` | Destaque, marca, indicador de aba ativa. Nunca texto sobre fundo claro |
| Folha | `#DCEBE3` | Fundo de destaque, selos de estado confirmado |
| Calçada | `#F6F8F4` | Fundo das telas |
| Asfalto | `#14231E` | Texto principal |

### 3.2 Tema claro

| Papel (`ColorScheme`) | Hex | Par de texto | Contraste |
|---|---|---|---|
| `primary` / `onPrimary` | `#1F5B4A` / `#FFFFFF` | Botão principal | 7,9:1 |
| `primaryContainer` / `onPrimaryContainer` | `#DCEBE3` / `#0E2A22` | Selo "Confirmado", avisos | 12,4:1 |
| `secondary` / `onSecondary` | `#F5B82E` / `#14231E` | Destaque de marca | 9,1:1 |
| `secondaryContainer` / `onSecondaryContainer` | `#FDF0CF` / `#5B3F00` | Selo "Aguardando" | 8,6:1 |
| `surface` / `onSurface` | `#F6F8F4` / `#14231E` | Fundo e texto | 15,3:1 |
| `surfaceContainerLowest` | `#FFFFFF` | Cartões | |
| `surfaceContainerHighest` | `#E6ECE8` | Selo "Concluído", campos preenchidos | 6,1:1 com `onSurfaceVariant` |
| `onSurfaceVariant` | `#4A5A53` | Texto secundário | 6,8:1 sobre o fundo |
| `outline` | `#7A8A83` | Borda de campos | 3,4:1 (mínimo 3:1 para componentes) |
| `outlineVariant` | `#DCE3DE` | Divisórias, borda de cartão (decorativa) | |
| `error` / `onError` | `#B3261E` / `#FFFFFF` | Erro, ação destrutiva | 6,5:1 |
| `errorContainer` / `onErrorContainer` | `#F9DEDC` / `#410E0B` | Selo "Recusado" ou "Cancelado" | 12,8:1 |

### 3.3 Tema escuro

O tema escuro não é a inversão do claro: o verde fica mais claro para continuar legível e o Girassol se mantém.

| Papel | Hex | Contraste |
|---|---|---|
| `primary` / `onPrimary` | `#8FD3B8` / `#0A2A20` | 8,9:1 |
| `primaryContainer` / `onPrimaryContainer` | `#1F5B4A` / `#DCEBE3` | 6,4:1 |
| `secondary` / `onSecondary` | `#F5B82E` / `#14231E` | 9,1:1 |
| `secondaryContainer` / `onSecondaryContainer` | `#4A3A10` / `#FDF0CF` | 9,7:1 |
| `surface` / `onSurface` | `#0F1714` / `#E3ECE7` | 15,1:1 |
| `surfaceContainerLowest` | `#17211D` | |
| `surfaceContainerHighest` | `#26312C` | 6,5:1 com `onSurfaceVariant` |
| `onSurfaceVariant` | `#A9B8B1` | 8,8:1 |
| `outline` | `#75857E` | 4,7:1 |
| `outlineVariant` | `#2A3631` | |
| `error` / `onError` | `#F2B8B5` / `#601410` | 7,7:1 |
| `errorContainer` / `onErrorContainer` | `#8C1D18` / `#F9DEDC` | 7,2:1 |

Contrastes calculados pela fórmula da WCAG 2.1. Toda combinação de texto acima passa em AA (4,5:1); as de texto grande e componentes passam em 3:1.

### 3.4 Estados do pedido

O estado nunca é só cor: o selo sempre tem texto ([Telas e fluxos, seção 4](Telas-e-Fluxos-v1.0.md)).

| Estado | Fundo / texto do selo |
|---|---|
| Aguardando pagamento, Aguardando a loja | `secondaryContainer` / `onSecondaryContainer` |
| Confirmado | `primaryContainer` / `onPrimaryContainer` |
| Concluído | `surfaceContainerHighest` / `onSurfaceVariant` |
| Recusado, Cancelado, Expirado | `errorContainer` / `onErrorContainer` |

---

## 4. Tipografia

| Papel | Fonte | Pesos |
|---|---|---|
| Títulos (display, headline e `titleLarge`) | **Bricolage Grotesque** | 700 e 800 |
| Todo o resto (títulos menores, texto, rótulos, números) | **Figtree** | 400, 500, 600 e 700 |

As duas têm licença livre (SIL Open Font License) e ficam **dentro do app** como arquivos de fonte, sem baixar em tempo de execução: o app abre igual sem rede e não chama servidor de terceiros ao abrir.

### Escala (dp, tamanho / altura de linha)

| Estilo M3 | Fonte | Tamanho | Peso |
|---|---|---|---|
| `displaySmall` | Bricolage Grotesque | 36 / 44 | 800 |
| `headlineMedium` | Bricolage Grotesque | 28 / 36 | 700 |
| `headlineSmall` | Bricolage Grotesque | 24 / 32 | 700 |
| `titleLarge` | Bricolage Grotesque | 22 / 28 | 700 |
| `titleMedium` | Figtree | 16 / 24 | 600 |
| `bodyLarge` | Figtree | 16 / 24 | 400 |
| `bodyMedium` | Figtree | 14 / 20 | 400 |
| `labelLarge` (botões) | Figtree | 14 / 20 | 600 |
| `labelMedium` | Figtree | 12 / 16 | 600 |

- Texto corrido nunca abaixo de 14 dp; nada abaixo de 12 dp.
- Valores em reais e horários em colunas usam algarismos de largura fixa (`FontFeature.tabularFigures()`); conferir no protótipo que a Figtree entrega o recurso.
- A fonte acompanha o tamanho de texto do sistema; as telas não podem quebrar com o maior tamanho.

---

## 5. Formas, espaço e movimento

| Item | Valor |
|---|---|
| Grade | Múltiplos de 4 dp |
| Espaçamentos | 4, 8, 12, 16, 24, 32, 48 |
| Margem lateral do app | 16 dp |
| Raio | 8 (selos e chips), 12 (campos), 16 (cartões e botões), 28 (folhas que sobem da base) |
| Elevação | Preferir borda `outlineVariant` ou troca de superfície a sombra |
| Alvo de toque | Mínimo 48 × 48 dp, mesmo quando o ícone é menor |
| Movimento | 150 a 250 ms, saída mais rápida que entrada; respeitar "remover animações" do sistema |

---

## 6. Ícones e imagens

- Uma família só: **Material Symbols, estilo arredondado** (os `Icons.*_rounded` do Flutter), 24 dp, mesmo peso de traço.
- Nada de emoji como ícone.
- Ícone ao lado de texto é decorativo (escondido do leitor de tela); ícone sozinho num botão tem rótulo acessível.
- Fotos de lojas e pets com cantos de 16 dp. Sem foto, um fundo Folha com o símbolo no centro.

---

## 7. Tom de voz

Fala como o vizinho que conhece todo pet shop do bairro: próximo, direto, sem infantilizar.

| Faça | Evite |
|---|---|
| "Pedir agendamento" | "Clique aqui para solicitar" |
| "A loja tem até 2 horas para aceitar. Se recusar, o sinal volta inteiro." | "Sua solicitação está em análise." |
| "Esse horário acabou de ser reservado. Escolha outro." | "Ops! Algo deu errado :(" |
| "Thor", "seu pet" | "Seu filho de quatro patas", "aumigo" |
| "você" | "o usuário", "o cliente" |

Botão diz o que acontece (verbo + objeto). Erro diz o que houve e o que fazer, sem pedir desculpas. Diminutivo só no nome.

---

## 8. Como entra no app

Conforme o [ADR-009](../08-analise-tecnica/adrs.md), o tema vive em `core/tema`, e as telas pedem cores e estilos pelo tema (`Theme.of(context).colorScheme.primary`, `textTheme.titleMedium`), nunca por valor fixo.

```dart
// core/tema/cores.dart (esboço)
const pertimClaro = ColorScheme(
  brightness: Brightness.light,
  primary: Color(0xFF1F5B4A), onPrimary: Color(0xFFFFFFFF),
  primaryContainer: Color(0xFFDCEBE3), onPrimaryContainer: Color(0xFF0E2A22),
  secondary: Color(0xFFF5B82E), onSecondary: Color(0xFF14231E),
  secondaryContainer: Color(0xFFFDF0CF), onSecondaryContainer: Color(0xFF5B3F00),
  surface: Color(0xFFF6F8F4), onSurface: Color(0xFF14231E),
  onSurfaceVariant: Color(0xFF4A5A53),
  outline: Color(0xFF7A8A83), outlineVariant: Color(0xFFDCE3DE),
  error: Color(0xFFB3261E), onError: Color(0xFFFFFFFF),
  errorContainer: Color(0xFFF9DEDC), onErrorContainer: Color(0xFF410E0B),
);
// MaterialApp(theme: ..., darkTheme: ...) com os dois esquemas.
```

O painel web da loja usa o mesmo tema; nas telas largas só muda o layout.

---

## 9. Onde está aplicada

| O que | Situação |
|---|---|
| Variáveis de cor (claro e escuro), estilos de texto e símbolo no Figma | Em andamento, no arquivo das [Telas e fluxos](Telas-e-Fluxos-v1.0.md), página **Identidade** |
| Os 17 wireframes | Em andamento: reaplicar com as variáveis |
| Telas que faltam (seção 5 de Telas e fluxos) | Serão desenhadas já com a identidade |
| Ícone do app, splash e capa da Play Store | A fazer, depois da versão final do símbolo |
| Frontend React atual | Não muda: descreve o código atual e será substituído pelo app Flutter (ADR-006) |

---

## 10. Pendências

| # | Pendência | Quem |
|---|---|---|
| 1 | Busca de marca no INPI e domínio para "Pertim" | PO |
| 2 | Versão final do símbolo e da assinatura (desenho refinado e contorno) | Designer, aprovação do PO |
| 3 | Troca de "PetCare" por "Pertim" nos documentos e no código | PR próprio, depois do item 1 |
