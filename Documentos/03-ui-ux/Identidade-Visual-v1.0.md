# Identidade visual (v1.0)

> **Sistema-alvo.** Nome, marca, cores, tipografia, formas, ícones e tom de voz do produto. Vale para o app do tutor (Android), para o painel web da loja e para tudo o que for publicado (Play Store, e-mails, avisos).
>
> Decidido pelo PO em 10/11/2026, entre três direções e quatro nomes. Substitui a paleta herdada do protótipo React (tinta, coral, oceano, menta e papel, fonte Inter), que nunca foi decidida e cujo botão principal tinha contraste 3,0:1, abaixo do mínimo AA pedido em [Telas e fluxos, seção 4](Telas-e-Fluxos-v1.1.md).

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
3. Só então a troca de "PetCare" para "Pertim" nos documentos, no repositório e no código, num PR próprio. Até lá os outros documentos continuam dizendo PetCare. Em 14/11/2026 o PO decidiu exibir "Pertim" nas telas e nos READMEs antes da busca (veja a seção 9).

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

Os nomes vêm da rua: praça, girassol, folha, calçada e asfalto. Cada cor tem um papel do Material 3, usado no `ColorScheme` do Compose e, em kebab-case, no Tailwind (veja a [seção 8](#8-como-entra-nos-aplicativos)). É pelo papel que as telas pedem a cor, nunca pelo código hexadecimal.

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

O estado nunca é só cor: o selo sempre tem texto ([Telas e fluxos, seção 4](Telas-e-Fluxos-v1.1.md)).

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

As duas têm licença livre (SIL Open Font License) e ficam **dentro dos aplicativos** como arquivos de fonte (`res/font` no Android; arquivos servidos junto com o site na web), sem baixar de servidor de terceiros: abre igual sem rede e não chama ninguém de fora.

### Escala (dp no Android, px na web; tamanho / altura de linha)

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
- Valores em reais e horários em colunas usam algarismos de largura fixa (`tabular-nums` no Tailwind; `fontFeatureSettings = "tnum"` no Compose); conferir no protótipo que a Figtree entrega o recurso.
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

- Uma família só: **Material Symbols, estilo arredondado** (`Icons.Rounded.*` do Compose, pacote material-icons-extended; na web, Material Symbols Rounded servido pelo próprio site), 24 dp, mesmo peso de traço.
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

## 8. Como entra nos aplicativos

Os papéis de cor e os estilos de texto são os mesmos nas duas plataformas ([ADR-010](../08-analise-tecnica/adrs.md) para a web e [ADR-011](../08-analise-tecnica/adrs.md) para o Android). As telas pedem cor, texto e raio pelo tema (`bg-primary`, `text-title-md` no Tailwind; `MaterialTheme.colorScheme.primary`, `typography.titleMedium` no Compose), nunca por valor fixo.

### 8.1 Web: Tailwind

As cores ficam como variáveis CSS em `packages/tema/tokens.css`, escritas como trio RGB para o Tailwind aplicar transparência (`bg-primary/10`).

```css
/* packages/tema/tokens.css (esboço) */
:root {
  --c-primary: 31 91 74;          --c-on-primary: 255 255 255;
  --c-primary-container: 220 235 227; --c-on-primary-container: 14 42 34;
  --c-secondary: 245 184 46;      --c-on-secondary: 20 35 30;
  --c-secondary-container: 253 240 207; --c-on-secondary-container: 91 63 0;
  --c-surface: 246 248 244;       --c-on-surface: 20 35 30;
  --c-surface-container-lowest: 255 255 255;
  --c-surface-container-highest: 230 236 232;
  --c-on-surface-variant: 74 90 83;
  --c-outline: 122 138 131;       --c-outline-variant: 220 227 222;
  --c-error: 179 38 30;           --c-on-error: 255 255 255;
  --c-error-container: 249 222 220; --c-on-error-container: 65 14 11;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) { /* mesmos nomes, valores do tema escuro */ }
}
:root[data-theme='dark'] {
  --c-primary: 143 211 184;       --c-on-primary: 10 42 32;
  --c-primary-container: 31 91 74; --c-on-primary-container: 220 235 227;
  --c-secondary: 245 184 46;      --c-on-secondary: 20 35 30;
  --c-secondary-container: 74 58 16; --c-on-secondary-container: 253 240 207;
  --c-surface: 15 23 20;          --c-on-surface: 227 236 231;
  --c-surface-container-lowest: 23 33 29;
  --c-surface-container-highest: 38 49 44;
  --c-on-surface-variant: 169 184 177;
  --c-outline: 117 133 126;       --c-outline-variant: 42 54 49;
  --c-error: 242 184 181;         --c-on-error: 96 20 16;
  --c-error-container: 140 29 24; --c-on-error-container: 249 222 220;
}
```

O bloco do `prefers-color-scheme` repete os valores do tema escuro, para seguir o sistema quando a pessoa não escolheu um tema.

```js
// tailwind.config.js (esboço)
const cor = (n) => `rgb(var(--c-${n}) / <alpha-value>)`;
export default {
  theme: {
    colors: {
      transparent: 'transparent', current: 'currentColor',
      primary: cor('primary'), 'on-primary': cor('on-primary'),
      'primary-container': cor('primary-container'), 'on-primary-container': cor('on-primary-container'),
      secondary: cor('secondary'), 'on-secondary': cor('on-secondary'),
      'secondary-container': cor('secondary-container'), 'on-secondary-container': cor('on-secondary-container'),
      surface: cor('surface'), 'on-surface': cor('on-surface'),
      'surface-lowest': cor('surface-container-lowest'), 'surface-highest': cor('surface-container-highest'),
      'on-surface-variant': cor('on-surface-variant'),
      outline: cor('outline'), 'outline-variant': cor('outline-variant'),
      error: cor('error'), 'on-error': cor('on-error'),
      'error-container': cor('error-container'), 'on-error-container': cor('on-error-container'),
    },
    fontFamily: {
      display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
      sans: ['Figtree', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      'display-sm': ['2.25rem', { lineHeight: '2.75rem', fontWeight: '800' }],
      'headline-md': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '700' }],
      'headline-sm': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
      'title-lg': ['1.375rem', { lineHeight: '1.75rem', fontWeight: '700' }],
      'title-md': ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],
      'body-lg': ['1rem', { lineHeight: '1.5rem' }],
      'body-md': ['0.875rem', { lineHeight: '1.25rem' }],
      'label-lg': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],
      'label-md': ['0.75rem', { lineHeight: '1rem', fontWeight: '600' }],
    },
    extend: { borderRadius: { sheet: '28px' } },
  },
};
```

Os títulos (`display-*`, `headline-*`, `title-lg`) usam também `font-display`. Equivalência com a seção 5:

| Item | Classe Tailwind |
|---|---|
| Espaçamentos 4, 8, 12, 16, 24, 32, 48 | `1`, `2`, `3`, `4`, `6`, `8`, `12` (`p-4`, `gap-2`…) |
| Margem lateral | `px-4` |
| Raio 8, 12, 16, 28 | `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-sheet` |
| Alvo de toque 48 | `min-h-12 min-w-12` |
| Movimento 150 a 250 ms | `duration-150` a `duration-250`, com `motion-reduce:transition-none` |
| Algarismos de largura fixa | `tabular-nums` |

As fontes vêm de pacotes `@fontsource` empacotados com o site, sem Google Fonts.

### 8.2 Android: Compose

O tema fica em `ui/tema/` do módulo do app.

```kotlin
// ui/tema/Cores.kt (esboço)
val PertimClaro = lightColorScheme(
    primary = Color(0xFF1F5B4A), onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFDCEBE3), onPrimaryContainer = Color(0xFF0E2A22),
    secondary = Color(0xFFF5B82E), onSecondary = Color(0xFF14231E),
    secondaryContainer = Color(0xFFFDF0CF), onSecondaryContainer = Color(0xFF5B3F00),
    surface = Color(0xFFF6F8F4), onSurface = Color(0xFF14231E),
    surfaceContainerLowest = Color(0xFFFFFFFF), surfaceContainerHighest = Color(0xFFE6ECE8),
    onSurfaceVariant = Color(0xFF4A5A53),
    outline = Color(0xFF7A8A83), outlineVariant = Color(0xFFDCE3DE),
    error = Color(0xFFB3261E), onError = Color(0xFFFFFFFF),
    errorContainer = Color(0xFFF9DEDC), onErrorContainer = Color(0xFF410E0B),
)
val PertimEscuro = darkColorScheme(
    primary = Color(0xFF8FD3B8), onPrimary = Color(0xFF0A2A20),
    primaryContainer = Color(0xFF1F5B4A), onPrimaryContainer = Color(0xFFDCEBE3),
    secondary = Color(0xFFF5B82E), onSecondary = Color(0xFF14231E),
    secondaryContainer = Color(0xFF4A3A10), onSecondaryContainer = Color(0xFFFDF0CF),
    surface = Color(0xFF0F1714), onSurface = Color(0xFFE3ECE7),
    surfaceContainerLowest = Color(0xFF17211D), surfaceContainerHighest = Color(0xFF26312C),
    onSurfaceVariant = Color(0xFFA9B8B1),
    outline = Color(0xFF75857E), outlineVariant = Color(0xFF2A3631),
    error = Color(0xFFF2B8B5), onError = Color(0xFF601410),
    errorContainer = Color(0xFF8C1D18), onErrorContainer = Color(0xFFF9DEDC),
)

// ui/tema/Tipografia.kt (esboço)
private val Bricolage = FontFamily(Font(R.font.bricolage_700, FontWeight.Bold), Font(R.font.bricolage_800, FontWeight.ExtraBold))
private val Figtree = FontFamily(
    Font(R.font.figtree_400, FontWeight.Normal), Font(R.font.figtree_500, FontWeight.Medium),
    Font(R.font.figtree_600, FontWeight.SemiBold), Font(R.font.figtree_700, FontWeight.Bold),
)
val PertimTipografia = Typography(
    displaySmall = TextStyle(fontFamily = Bricolage, fontWeight = FontWeight.ExtraBold, fontSize = 36.sp, lineHeight = 44.sp),
    headlineMedium = TextStyle(fontFamily = Bricolage, fontWeight = FontWeight.Bold, fontSize = 28.sp, lineHeight = 36.sp),
    headlineSmall = TextStyle(fontFamily = Bricolage, fontWeight = FontWeight.Bold, fontSize = 24.sp, lineHeight = 32.sp),
    titleLarge = TextStyle(fontFamily = Bricolage, fontWeight = FontWeight.Bold, fontSize = 22.sp, lineHeight = 28.sp),
    titleMedium = TextStyle(fontFamily = Figtree, fontWeight = FontWeight.SemiBold, fontSize = 16.sp, lineHeight = 24.sp),
    bodyLarge = TextStyle(fontFamily = Figtree, fontSize = 16.sp, lineHeight = 24.sp),
    bodyMedium = TextStyle(fontFamily = Figtree, fontSize = 14.sp, lineHeight = 20.sp),
    labelLarge = TextStyle(fontFamily = Figtree, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, lineHeight = 20.sp),
    labelMedium = TextStyle(fontFamily = Figtree, fontWeight = FontWeight.SemiBold, fontSize = 12.sp, lineHeight = 16.sp),
)

// ui/tema/Formas.kt e Espaco.kt (esboço)
val PertimFormas = Shapes(
    extraSmall = RoundedCornerShape(8.dp), small = RoundedCornerShape(12.dp),
    medium = RoundedCornerShape(16.dp), extraLarge = RoundedCornerShape(28.dp),
)
object Espaco {
    val xs = 4.dp; val s = 8.dp; val m = 12.dp; val l = 16.dp; val xl = 24.dp; val xxl = 32.dp; val xxxl = 48.dp
}

// ui/tema/PertimTema.kt (esboço)
@Composable
fun PertimTema(escuro: Boolean = isSystemInDarkTheme(), conteudo: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = if (escuro) PertimEscuro else PertimClaro,
        typography = PertimTipografia,
        shapes = PertimFormas,
        content = conteudo,
    )
}
```

Regras do app:

- Cor dinâmica (Material You) fica desligada: a marca vale mais que o papel de parede.
- Alvo de toque mínimo de 48 dp: componentes do Material 3 já cumprem; em componente próprio, usar `Modifier.minimumInteractiveComponentSize()`.
- Algarismos de largura fixa: `fontFeatureSettings = "tnum"` no `TextStyle` de valores e horários.
- Texto em `sp`, para acompanhar o tamanho de fonte do sistema.
- Movimento com `tween(durationMillis = 150..250)`; ler a escala de animação do sistema.
- As fontes ficam em `res/font`, dentro do app.

O painel web da loja usa o mesmo tema da seção 8.1; nas telas largas só muda o layout.

---

## 9. Onde está aplicada

| O que | Situação |
|---|---|
| Variáveis de cor e estilos de texto no Figma | Feito no arquivo das [Telas e fluxos](Telas-e-Fluxos-v1.1.md): coleções **Pertim / Cor (claro)** e **Pertim / Cor (escuro)**, com os papéis da seção 3, e estilos de texto **Pertim/…** da seção 4. O plano gratuito do Figma permite um modo por coleção, por isso claro e escuro são duas coleções e não dois modos |
| Os 17 wireframes | Feito: cores ligadas às variáveis do tema claro, fontes trocadas para Bricolage Grotesque e Figtree (texto de 11 passou a 12) e "PetCare" trocado por "Pertim" nos textos das telas |
| Página **Identidade** no Figma, com símbolo, paleta e amostra de tipos | A fazer no Figma. No Open Design (projeto **Pertim – telas e fluxos**), a página de identidade e componentes já mostra símbolo, ícone, assinatura, paleta, temas claro e escuro, tipos e componentes |
| Telas novas da v1.1 de [Telas e fluxos](Telas-e-Fluxos-v1.1.md) | Desenhadas com a identidade no Open Design |
| Ícone do app, splash e capa da Play Store | A fazer, depois da versão final do símbolo |
| Protótipo React (`pet-shop-frontend/src`) | Usa os tokens e as fontes do pacote `packages/tema`. Exibe o nome "Pertim" desde 14/11/2026 (decisão do PO); o protótipo será aposentado quando as telas novas o substituírem |
| Web nova (`apps/loja` e `apps/tutor`, ADR-010) | Em TypeScript, com o tema em `packages/tema` e os componentes base em `packages/ui` (botão, campo, selo de estado, cartão, marca e tela de entrar). Nome exibido: Pertim (decisão do PO em 13/11/2026); o texto fica em `packages/ui/src/marca.ts`, a assinatura visual em `Marca.tsx` e os títulos das abas nos `index.html`. Faltam ícones Material Symbols, símbolo negativo no tema escuro e as demais telas |

---

## 10. Pendências

| # | Pendência | Quem |
|---|---|---|
| 1 | Busca de marca no INPI e domínio para "Pertim" | PO |
| 2 | Versão final do símbolo e da assinatura (desenho refinado e contorno) | Designer, aprovação do PO |
| 3 | Troca de "PetCare" por "Pertim" | Telas e READMEs feitos em 14/11/2026, por decisão do PO, antes da busca no INPI. Faltam os outros documentos e os identificadores técnicos (pacote Java `com.petcare`, nomes de contêiner e de banco) |
