# 🎨 Design System — PetCare Agenda

> **Tipo:** Especificação de Design (Reverse-Engineered do Código)
> **Data:** 2026-08-01
> **Fonte:** Análise do código-fonte React + Tailwind CSS (D:\pet-shop\pet-shop-frontend\)
> **Versão:** v1.0 (MVP — Clean Architecture + FSD)

---

## 1. 🎯 Visão Geral do Design

O PetCare Agenda adota uma identidade visual moderna, amigável e profissional voltada ao mercado pet. A linguagem visual é limpa, com amplo uso de espaços brancos, cantos arredondados suaves e uma paleta equilibrada entre tons quentes (coral) e frios (ocean), transmitindo confiança e profissionalismo.

**Princípios de Design:**
- **Simplicidade funcional** — Cada tela tem uma única responsabilidade clara
- **Hierarquia por cores** — Coral para ações primárias, Ocean para navegação, Ink para conteúdo
- **Espaçamento generoso** — Uso de espaço negativo para respirar entre seções
- **Consistência tipográfica** — Família Inter como fonte única, pesos bem definidos
- **Feedback visual imediato** — Hover, focus, disabled states em todos elementos interativos

---

## 2. 🎨 Paleta de Cores

### Cores da Marca

| Token CSS | Hex | RGB | Uso |
|-----------|-----|-----|-----|
| `--color-ink` | `#18212f` | (24, 33, 47) | Texto principal, fundo escuro, header ativo |
| `--color-coral` | `#f26957` | (242, 105, 87) | CTAs primários, ações destrutivas, destaque |
| `--color-ocean` | `#147b8f` | (20, 123, 143) | Navegação ativa, badges, links, destaque secundário |
| `--color-mint` | `#dff5ec` | (223, 245, 236) | Background de destaque, hover states, badges positivos |
| `--color-paper` | `#faf8f4` | (250, 248, 244) | Background principal da página |

### Variações Opacas (usadas em texto secundário e bordas)

| Token | Uso |
|-------|-----|
| `ink/10` | Bordas leves, dividers |
| `ink/20` | Bordas de botões secundários |
| `ink/35` | Texto desabilitado |
| `ink/45` | Texto muito sutil, timestamps |
| `ink/55` | Texto placeholder, estados vazios |
| `ink/60` | Texto secundário |
| `ink/65` | Texto de descrição, labels do header |
| `ink/70` | Labels de formulário, corpo de texto |
| `ink/75` | Células de tabela |
| `ink/80` | Dados semi-destacados |
| `ink/90` | Hover de botão escuro |

### Variações de Coral e Ocean

| Token | Uso |
|-------|-----|
| `coral/10` | Hover de botão delete |
| `coral/15` | Background de badge "Cancelado" |
| `coral/20` | Fundo de seção de notificações |
| `coral/30` | Borda de botão delete |
| `ocean/15` | Ring de focus em inputs |
| `ocean/20` | Fundo de mensagem de feedback |
| `ocean/40` | Borda de card selecionado |
| `ocean/90` | Hover de botão ocean |

### Cores de Estado (Status Badges)

| Status | Background | Texto |
|--------|-----------|-------|
| Agendado | `bg-mint` | `text-ocean` |
| Concluído | `bg-ink` | `text-white` |
| Cancelado | `bg-coral/15` | `text-coral` |

---

## 3. 📝 Tipografia

### Família

```
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Escala Tipográfica

| Nível | Classes Tailwind | Tamanho | Peso | Uso |
|-------|-----------------|---------|------|-----|
| **Hero Title** | `text-3xl sm:text-4xl font-bold` | 30px / 36px | 700 (bold) | Títulos de página |
| **Page Title** | `text-2xl sm:text-3xl font-bold` | 24px / 30px | 700 (bold) | Headers de seção |
| **Section Title** | `text-xl font-bold` | 20px | 700 (bold) | AppShell header |
| **Card Title** | `text-lg font-bold` | 18px | 700 (bold) | Nomes de serviços |
| **Body Bold** | `text-sm font-bold` | 14px | 700 (bold) | Botões, labels, opções |
| **Body Semibold** | `text-sm font-semibold` | 14px | 600 (semibold) | Labels de seção, tabs |
| **Body Regular** | `text-sm` | 14px | 400 (normal) | Texto corrido |
| **Small Bold** | `text-xs font-bold` | 12px | 700 (bold) | Badges, uppercase labels |
| **Small Semibold** | `text-xs font-semibold` | 12px | 600 (semibold) | Texto "Indisponível" |
| **Small Regular** | `text-xs` | 12px | 400 (normal) | Timestamps |

### Line Height
- Títulos: tracking-normal
- Corpo: `leading-6` (24px para 14px) ou `leading-7` (28px para 16px)
- Labels uppercase: `tracking-wide`

---

## 4. 🧱 Componentes

### 4.1 Botões

#### Botão Primário (Coral)
```html
<button class="flex min-h-11 items-center justify-center gap-2 rounded bg-coral px-4 text-sm font-bold text-white 
               transition hover:bg-[#dc5848] focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2 
               disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ink/45">
```
- Altura mínima: 44px (min-h-11)
- Padding horizontal: 16px (px-4)
- Border-radius: 4px (rounded)
- Cor de hover: #dc5848 (escurecimento manual)
- **Usado em:** Login, Cadastro, Agendar, Salvar alterações, Criar conta

#### Botão Secundário (Ink)
```html
<button class="flex min-h-10 items-center justify-center gap-2 rounded bg-ink px-3 text-sm font-bold text-white 
               transition hover:bg-ink/90">
```
- Altura mínima: 40px (min-h-10)
- **Usado em:** Novo pet, Editar dados, Ver detalhes

#### Botão Outline
```html
<button class="flex min-h-10 items-center justify-center gap-2 rounded border border-ink/10 bg-white px-3 
               text-sm font-bold text-ink/70 transition hover:bg-mint hover:text-ink">
```
- **Usado em:** Sair (AppShell e OwnerDashboard)

#### Botão Delete
```html
<button class="grid h-9 w-9 place-items-center rounded border border-coral/30 text-coral 
               transition hover:bg-coral/10">
```
- **Usado em:** Remover serviços (OwnerServices)

#### Botão Destrutivo
```html
<button class="min-h-9 rounded bg-coral px-3 text-xs font-bold text-white transition hover:bg-[#dc5848] 
               focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2">
```
- **Usado em:** Cancelar agendamento (ServiceHistory)

#### Botão Cancelar (Neutro)
```html
<button class="flex min-h-11 items-center justify-center rounded border border-ink/20 bg-white px-4 
               text-sm font-bold text-ink/70 transition hover:bg-paper">
```
- **Usado em:** Cancelar edição de pet

### 4.2 Inputs (Field Component)

```html
<input class="mt-1 min-h-11 w-full rounded border border-ink/10 bg-white px-3 text-sm text-ink 
              outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/15">
```
- Altura mínima: 44px (min-h-11)
- Padding: 12px horizontal (px-3)
- Border: 1px solid ink/10
- Focus: border-ocean + ring-2 ocean/15
- Label: text-sm font-bold text-ink/70

### 4.3 Select

```html
<select class="mt-1 min-h-11 w-full rounded border border-ink/10 bg-white px-3 text-sm text-ink 
               outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/15 
               disabled:cursor-not-allowed disabled:bg-paper">
```
- Mesmo estilo do input
- Disabled: cursor-not-allowed + bg-paper

### 4.4 Tabs / Segment Control

#### Tabs de Navegação (Ink quando ativo)
```html
<button class="flex min-h-10 shrink-0 items-center gap-2 rounded px-3 text-sm font-semibold
               bg-ink text-white">  <!-- ativo -->
<button class="flex min-h-10 shrink-0 items-center gap-2 rounded px-3 text-sm font-semibold
               text-ink/65 hover:bg-mint hover:text-ink">  <!-- inativo -->
```
- Container: `rounded-md border border-ink/10 bg-white p-1 shadow-sm`

#### Tabs de Conteúdo (Ocean quando ativo)
```html
<button class="flex min-h-11 items-center justify-center gap-2 rounded px-4 text-sm font-bold
               bg-ocean text-white">  <!-- ativo -->
<button class="flex min-h-11 items-center justify-center gap-2 rounded px-4 text-sm font-bold
               text-ink/65 hover:bg-mint">  <!-- inativo -->
```

### 4.5 Cards

#### Card Padrão
```html
<div class="rounded-md border border-ink/10 bg-white p-5 shadow-soft">
```
- Border-radius: 6px (rounded-md)
- Sombra: `0 18px 45px rgba(24, 33, 47, 0.08)` (shadow-soft)
- Padding: 20px (p-5)

#### Card de Serviço (selecionável)
```html
<article class="flex min-h-[320px] flex-col justify-between rounded-md border bg-white p-5 shadow-soft
                  border-ocean/40">  <!-- selecionado -->
<article class="flex min-h-[320px] flex-col justify-between rounded-md border bg-white p-5 shadow-soft
                  border-ink/10">  <!-- normal -->
```
- Altura mínima: 320px

### 4.6 Tabelas

```html
<table class="min-w-full divide-y divide-ink/10">
  <thead class="bg-mint/65">
    <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink/65">
    <td class="whitespace-nowrap px-4 py-4 text-sm text-ink/75">
```
- Header: bg-mint/65, uppercase tracking-wide
- Células: whitespace-nowrap
- Hover de linha: hover:bg-paper (ServiceHistory) / bg-mint/40 (OwnerDashboard selecionado)
- Estado vazio: texto centralizado `text-ink/55`

### 4.7 Badges de Status

| Status | Classes |
|--------|---------|
| Agendado | `bg-mint text-ocean` |
| Concluído | `bg-ink text-white` |
| Cancelado | `bg-coral/15 text-coral` |
| Fallback | `bg-ink/10 text-ink` |

Todos: `inline-flex min-w-24 justify-center rounded px-3 py-1 text-xs font-bold`

### 4.8 Header / AppShell

```html
<header class="sticky top-0 z-20 border-b border-ink/10 bg-paper/95 backdrop-blur">
```
- Sticky no topo com backdrop-blur
- Container interno: `max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8`
- Logo: `h-11 w-11 rounded-md bg-coral text-white shadow-soft` (Tutor) / `bg-ocean` (Owner)

### 4.9 Seções de Notificação

```html
<section class="rounded-md border border-coral/20 bg-white p-4 shadow-soft">
  <div class="flex items-center gap-2">
    <Bell size={18} class="text-coral" />
    <h2 class="font-bold text-ink">Notificações do petshop</h2>
  </div>
  <!-- cards de notificação -->
  <article class="rounded border border-ink/10 bg-paper p-3">
```

---

## 5. 📐 Grid e Layout

### Sistema de Grid

- **Container máximo:** `max-w-7xl` (1280px)
- **Padding responsivo:** `px-4 sm:px-6 lg:px-8`
- **Gap entre seções:** `space-y-6` (24px)

### Breakpoints

| Breakpoint | Largura | Uso Principal |
|-----------|---------|---------------|
| Default (mobile) | < 640px | Layout empilhado, full-width |
| `sm` | ≥ 640px | 2 colunas em forms, header row |
| `md` | ≥ 768px | Grid de 2 colunas, flex-row |
| `lg` | ≥ 1024px | 2-colunas assimétricas (hero + form) |
| `xl` | ≥ 1280px | 3-5 colunas para cards, grid complexo |

### Grid Patterns Comuns

- **Forms:** `grid gap-4 sm:grid-cols-2` → `grid gap-4 md:grid-cols-2 xl:grid-cols-5`
- **Cards de serviço:** `grid gap-4 md:grid-cols-2 xl:grid-cols-3`
- **Métricas:** `grid gap-4 md:grid-cols-2 xl:grid-cols-4`
- **Serviços Owner:** `grid gap-5 xl:grid-cols-[0.8fr_1.2fr]`
- **Dashboard:** `grid gap-5 xl:grid-cols-[1.35fr_0.65fr]`

---

## 6. 🔲 Sistema de Espaçamento

### Escala de Espaçamento (4px base)

| Token Tailwind | Valor | Uso |
|---------------|-------|-----|
| `p-1` / `gap-1` | 4px | Container interno de tabs, labels pequenos |
| `p-2` / `gap-2` | 8px | Gap entre ícone e texto, botões |
| `p-3` / `gap-3` | 12px | Padding de cards de notificação, espaçamento entre cards |
| `p-4` / `gap-4` | 16px | Forms, métricas, grids principais |
| `p-5` / `gap-5` | 20px | Cards padrão, OwnerServices grid |
| `p-6` / `gap-6` | 24px | Espaçamento entre seções principais (space-y-6) |
| `py-4` | 16px | Header vertical padding |
| `py-6` | 24px | Main vertical padding |
| `py-8` | 32px | AuthScreen top padding |

### Min-Heights (Touch Targets)

| Classe | Valor | Uso |
|--------|-------|-----|
| `min-h-9` | 36px | Botão cancelar tabela, botão delete |
| `min-h-10` | 40px | Botões secundários, tabs de pet, botão sair |
| `min-h-11` | 44px | Inputs, selects, botões primários, botões de submit |
| `min-h-[320px]` | 320px | Cards de serviço (ServiceRequest) |

---

## 7. 🎭 Estados de Interação

### Botões
| Estado | Visual |
|--------|--------|
| **Default** | bg-coral text-white (primário) / bg-ink text-white (secundário) |
| **Hover** | bg-[#dc5848] (primário) / bg-ink/90 (secundário) / bg-mint (outline) |
| **Focus** | ring-2 ring-coral ring-offset-2 (primário) / ring-2 ring-ocean/15 (input) |
| **Disabled** | cursor-not-allowed bg-ink/20 text-ink/45 |

### Inputs
| Estado | Visual |
|--------|--------|
| **Default** | border-ink/10 bg-white |
| **Focus** | border-ocean ring-2 ring-ocean/15 |
| **Disabled** | cursor-not-allowed bg-paper |

### Tabs
| Estado | Visual |
|--------|--------|
| **Ativo** | bg-ink text-white (nav) / bg-ocean text-white (conteúdo) |
| **Inativo** | text-ink/65 hover:bg-mint hover:text-ink |
| **Disabled** | cursor-not-allowed opacity-45 |

### Cards Selecionáveis
| Estado | Visual |
|--------|--------|
| **Default** | border-ink/10 bg-white |
| **Hover** | border-ocean/40 hover:bg-paper |
| **Selecionado** | border-ocean/40 (serviço) / border-ocean bg-mint shadow-soft (profile card) |

---

## 8. 🖼️ Iconografia

**Biblioteca:** Lucide React v0.468.0
**Tamanhos utilizados:** 16px, 17px, 18px, 21px, 22px, 23px, 25px

| Ícone | Uso |
|-------|-----|
| `PawPrint` | Logo, pet tabs, ícone de pet |
| `LogIn` | Botão login |
| `UserPlus` | Botão cadastro |
| `LogOut` | Botão sair |
| `Bell` | Notificações |
| `Dog` | Perfil tutor (seleção de role) |
| `Building2` | Perfil owner (seleção de role) |
| `Waves` | Serviços de banho |
| `Syringe` | Serviços de vacina |
| `CalendarClock` | Agendamento |
| `Check` | Benefícios do serviço |
| `Store` | Identificação do petshop |
| `Plus` | Adicionar (pet/serviço) |
| `Trash2` | Remover serviço |
| `BadgeCheck` | Vacina aplicada |
| `CalendarDays` | Datas da carteira de vacinação |
| `Hash` | Número de lote |
| `Stethoscope` | Veterinário |
| `CalendarCheck` | Métrica de agendamentos |
| `ShieldCheck` | Métrica de agendados |
| `User` | Detalhes do tutor |

---

## 9. 🌈 Acessibilidade Atual (Baseline)

### Contraste

| Combinação | Contraste Estimado | WCAG AA |
|------------|-------------------|---------|
| `#18212f (ink)` sobre `#faf8f4 (paper)` | ~15.2:1 ✅ | AAA |
| `#18212f (ink)` sobre `#ffffff (white)` | ~15.2:1 ✅ | AAA |
| `#ffffff (white)` sobre `#f26957 (coral)` | ~4.6:1 ✅ | AA (large text) |
| `#ffffff (white)` sobre `#147b8f (ocean)` | ~4.7:1 ✅ | AA (large text) |
| `#147b8f (ocean)` sobre `#dff5ec (mint)` | ~2.7:1 ⚠️ | Falha AA |
| `text-ink/60` (#18212f 60%) sobre paper | ~8.5:1 ✅ | AAA |
| `text-ink/55` (#18212f 55%) sobre paper | ~7.8:1 ✅ | AAA |
| `#f26957 (coral)` sobre `#ffffff` | ~4.6:1 ✅ | AA (large) |

### Touch Targets
- ✅ Botões primários: 44px (min-h-11) — atende recomendação de 44x44
- ✅ Inputs: 44px (min-h-11)
- ✅ Tabs: 40px (min-h-10) — aceitável
- ⚠️ Botão cancelar (tabela): 36px (min-h-9) — abaixo do recomendado

### Estados de Focus
- ✅ Inputs: ring-2 visível
- ✅ Botões primários (alguns): ring-2 ring-coral ring-offset-2
- ⚠️ Falta focus visível consistente em todos botões (alguns têm, outros não)
- ⚠️ Botão "Sair" não tem estilo de focus explícito

---

## 10. 📱 Responsividade

### Mobile-First
Todos os componentes são construídos com mobile-first approach. O comportamento padrão é empilhado, com breakpoints para layouts side-by-side:

- **320px-639px:** Tudo empilhado verticalmente, full width
- **640px+:** Forms em 2 colunas, header com flex-row
- **768px+:** Cards em 2 colunas, header sections em row
- **1024px+:** Layout assimétrico (AuthScreen), header items em row
- **1280px+:** Grid de 3+ colunas, layout de dashboard side-by-side

### Comportamentos Responsivos
- Tabs de pet: `overflow-x-auto` com scroll horizontal em telas pequenas
- Tabelas: `overflow-x-auto` wrapper para scroll horizontal
- OwnerServices: empilhado → side-by-side em 1280px+
- AuthScreen: empilhado → 2 colunas assimétricas em 1024px+

---

## 11. 🔄 Animações e Transições

| Elemento | Transição |
|----------|-----------|
| Todos botões | `transition` (all properties, default 150ms) |
| Inputs/Selects | `transition` (all properties) |
| Header | `backdrop-blur` + `bg-paper/95` (glass effect) |
| Indicador SSE | `h-2 w-2 rounded-full bg-green-500` (ponto pulsante status) |

---

## 12. 📋 Sumário de Tokens de Design (CSS Custom Properties Recomendadas)

```css
:root {
  /* Cores da Marca */
  --color-ink: #18212f;
  --color-coral: #f26957;
  --color-coral-hover: #dc5848;
  --color-ocean: #147b8f;
  --color-mint: #dff5ec;
  --color-paper: #faf8f4;

  /* Tipografia */
  --font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */

  /* Espaçamento (escala 4px) */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */

  /* Bordas */
  --radius-default: 0.25rem;  /* 4px (rounded) */
  --radius-md: 0.375rem;      /* 6px (rounded-md) */

  /* Sombras */
  --shadow-soft: 0 18px 45px rgba(24, 33, 47, 0.08);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  /* Touch Targets */
  --touch-target-min: 2.75rem;  /* 44px (min-h-11) */
  --touch-target-sm: 2.5rem;    /* 40px (min-h-10) */
}
```

---

*Documento gerado por reverse-engineering do código-fonte em 2026-08-01. Próxima etapa: criar variáveis CSS reais para substituir classes arbitrárias e garantir consistência.*
