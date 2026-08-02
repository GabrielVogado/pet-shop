# 📐 Design Specification Improvements — PetCare Agenda

> **Data:** 2026-08-01
> **Objetivo:** Recomendações para amadurecer o design system do PetCare Agenda, transformando o sistema atual (cores no Tailwind config) em uma especificação de design completa e sustentável
> **Público:** Equipe de desenvolvimento e design

---

## 1. 🎨 Evolução da Paleta de Cores

### Situação Atual
Cores definidas como extensões arbitrárias no `tailwind.config.js`. A cor de hover do coral é hardcoded como `[#dc5848]`.

### Recomendação: Escala de Cores Completa

```js
// tailwind.config.js
colors: {
  ink: {
    DEFAULT: '#18212f',
    10: 'rgba(24, 33, 47, 0.10)',
    20: 'rgba(24, 33, 47, 0.20)',
    35: 'rgba(24, 33, 47, 0.35)',
    45: 'rgba(24, 33, 47, 0.45)',
    55: 'rgba(24, 33, 47, 0.55)',
    60: 'rgba(24, 33, 47, 0.60)',
    65: 'rgba(24, 33, 47, 0.65)',
    70: 'rgba(24, 33, 47, 0.70)',
    75: 'rgba(24, 33, 47, 0.75)',
    80: 'rgba(24, 33, 47, 0.80)',
    90: 'rgba(24, 33, 47, 0.90)',
  },
  coral: {
    50: '#fef0ee',
    100: '#fde0db',
    200: '#fbc1b7',
    300: '#f9a293',
    400: '#f5836f',
    DEFAULT: '#f26957',
    500: '#f26957',
    600: '#dc5848',  // hover
    700: '#c4483a',
    800: '#9c382c',
    900: '#74281e',
  },
  ocean: {
    50: '#e6f3f5',
    100: '#cce7eb',
    200: '#99cfd7',
    300: '#66b7c3',
    400: '#339faf',
    DEFAULT: '#147b8f',
    500: '#147b8f',
    600: '#116b7d',
    700: '#0e5b6b',
    800: '#0b4b59',
    900: '#083b47',
  },
  mint: {
    50: '#f5fdf9',
    100: '#eafaf3',
    200: '#dff5ec',  // DEFAULT atual
    DEFAULT: '#dff5ec',
    300: '#c5eddb',
    400: '#a0e0c5',
    500: '#7bd3af',
  },
  paper: {
    DEFAULT: '#faf8f4',
    50: '#fefdfb',
    100: '#faf8f4',
  },
}
```

**Benefício:** Elimina valores arbitrários `[#dc5848]`, permite hover states consistentes (`hover:bg-coral-600`), facilita dark mode futuro.

---

## 2. 📐 Tokens de Design como CSS Custom Properties

### Recomendação

```css
/* index.css — Adicionar antes de @tailwind base */
:root {
  /* === Cores da Marca === */
  --color-ink: #18212f;
  --color-coral: #f26957;
  --color-coral-hover: #dc5848;
  --color-ocean: #147b8f;
  --color-mint: #dff5ec;
  --color-paper: #faf8f4;

  /* === Tipografia === */
  --font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

  /* === Espaçamento === */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;

  /* === Bordas === */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;

  /* === Sombras === */
  --shadow-soft: 0 18px 45px rgba(24, 33, 47, 0.08);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  /* === Touch Targets === */
  --touch-min: 2.75rem;
  --touch-sm: 2.5rem;
}
```

---

## 3. 🧱 Componentes a Serem Extraídos/Refinados

### 3.1 Componente `Tabs` (NOVO — extrair de AppShell e OwnerDashboard)

```jsx
// src/shared/ui/Tabs.jsx
export function Tabs({ tabs, activeTab, onTabChange, variant = 'ink' }) {
  return (
    <nav className="flex gap-2 overflow-x-auto rounded-md border border-ink/10 bg-white p-1 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          disabled={tab.disabled}
          className={`flex min-h-10 shrink-0 items-center gap-2 rounded px-3 text-sm font-semibold transition 
            focus:outline-none focus:ring-2 focus:ring-ocean focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-45
            ${activeTab === tab.id
              ? variant === 'ocean' ? 'bg-ocean text-white' : 'bg-ink text-white'
              : 'text-ink/65 hover:bg-mint hover:text-ink'
            }`}
        >
          {tab.icon && <tab.icon size={17} />}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
```

**Benefício:** Elimina duplicação de lógica de tabs, unifica estilos, adiciona focus indicators.

### 3.2 Componente `Field` — Adicionar suporte a erro

```jsx
export function Field({ 
  label, type = 'text', step, value, placeholder, onChange, 
  required = true, error, hint, name, id 
}) {
  const fieldId = id || name || label.toLowerCase().replace(/\s+/g, '-');
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  return (
    <label className="block" htmlFor={fieldId}>
      <span className="text-sm font-bold text-ink/70">{label}</span>
      <input
        id={fieldId}
        name={name}
        required={required}
        type={type}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={`mt-1 min-h-11 w-full rounded border bg-white px-3 text-sm text-ink outline-none transition
          focus:border-ocean focus:ring-2 focus:ring-ocean/15
          ${error ? 'border-coral focus:border-coral focus:ring-coral/15' : 'border-ink/10'}`}
      />
      {error && (
        <span id={errorId} role="alert" className="mt-1 block text-xs font-semibold text-coral">
          {error}
        </span>
      )}
      {hint && !error && (
        <span id={hintId} className="mt-1 block text-xs text-ink/45">{hint}</span>
      )}
    </label>
  );
}
```

### 3.3 Componente `SelectField` (NOVO)

```jsx
export function SelectField({ 
  label, value, onChange, options, placeholder, 
  required = true, error, hint, name, id, disabled = false 
}) {
  const fieldId = id || name || label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <label className="block" htmlFor={fieldId}>
      <span className="text-sm font-bold text-ink/70">{label}</span>
      <select
        id={fieldId}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        disabled={disabled}
        className="mt-1 min-h-11 w-full rounded border border-ink/10 bg-white px-3 text-sm text-ink outline-none transition 
          focus:border-ocean focus:ring-2 focus:ring-ocean/15 
          disabled:cursor-not-allowed disabled:bg-paper"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}
```

### 3.4 Componente `LoadingButton` (NOVO)

```jsx
export function LoadingButton({ 
  children, loading = false, disabled, variant = 'primary', ...props 
}) {
  const variants = {
    primary: 'bg-coral text-white hover:bg-coral-600',
    secondary: 'bg-ink text-white hover:bg-ink/90',
    outline: 'border border-ink/10 bg-white text-ink/70 hover:bg-mint hover:text-ink',
    danger: 'bg-coral text-white hover:bg-coral-600',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`flex min-h-11 w-full items-center justify-center gap-2 rounded px-4 text-sm font-bold transition
        focus:outline-none focus:ring-2 focus:ring-ocean focus:ring-offset-2
        disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ink/45
        ${variants[variant]}`}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
          Carregando...
        </>
      ) : children}
    </button>
  );
}
```

---

## 4. 📱 Especificações de Breakpoints e Grid

### Breakpoints Padronizados (já existentes no Tailwind — documentar uso)

| Breakpoint | Largura Mínima | Uso Principal | Layout |
|-----------|---------------|---------------|--------|
| **Base** | 0px (todos) | Mobile | 1 coluna, empilhado |
| **sm** | 640px | Phablets / Tablets pequenos | 2 colunas (forms) |
| **md** | 768px | Tablets | 2 colunas (cards), flex-row |
| **lg** | 1024px | Desktops pequenos | Layout assimétrico |
| **xl** | 1280px | Desktops | 3-5 colunas (grid complexo) |

### Grid Templates Recomendados

```css
/* Dashboard Owner — side-by-side */
grid-template-columns: 1.35fr 0.65fr;

/* OwnerServices — form + lista */
grid-template-columns: 0.8fr 1.2fr;

/* AuthScreen — hero + form */
grid-template-columns: 0.95fr 1.05fr;
```

---

## 5. ♿ Especificações de Acessibilidade

### Cores e Contraste (WCAG AA)
- Todo texto normal deve ter contraste ≥ 4.5:1 contra o fundo
- Texto grande (≥18px bold) deve ter contraste ≥ 3:1
- **Ação imediata:** badge "Agendado" precisa de contraste ≥ 3:1 (large text bold) ou ≥ 4.5:1 (normal)

### Focus Indicators (WCAG 2.4.7)
- Todo elemento interativo deve ter `focus:ring-2 focus:ring-ocean focus:ring-offset-2`
- Exceção: inputs usam `focus:border-ocean`

### Touch Targets (WCAG 2.5.5 AAA)
- Mínimo 44×44px para todos elementos interativos
- Exceções justificadas: botões inline em tabelas (mín. 36px)

### Status Messages (WCAG 4.1.3)
- Usar `role="alert"` para mensagens de erro/sucesso
- Usar `aria-live="polite"` para atualizações assíncronas

### Form Labels (WCAG 1.3.1)
- Todo input/select deve ter `<label htmlFor="id">` associado
- Erros devem usar `aria-describedby` apontando para o elemento de erro

---

## 6. 🎯 Roadmap de Maturidade do Design System

### Fase 1 — Foundation (1-2 sprints)
- [ ] Criar CSS custom properties para cores, tipografia, espaçamento
- [ ] Corrigir contraste ocean/mint (CRIT-01)
- [ ] Corrigir acentuação em todas as strings
- [ ] Adicionar focus indicators em todos botões
- [ ] Padronizar border-radius entre tabs e containers
- [ ] Extrair componente Tabs compartilhado

### Fase 2 — Components (2-3 sprints)
- [ ] Componente Field com suporte a erro
- [ ] Componente SelectField
- [ ] Componente LoadingButton
- [ ] Unificar StatusBadge (remover duplicação OwnerDashboard)
- [ ] Usar componente Table em ServiceHistory
- [ ] Adicionar loading states nos formulários

### Fase 3 — Quality (3-4 sprints)
- [ ] Implementar Feature #10 (Carteira de Vacinação)
- [ ] Adicionar modais de confirmação
- [ ] Melhorar empty states
- [ ] Adicionar animações de transição
- [ ] Testes de acessibilidade com Lighthouse/axe
- [ ] Validação de formulários com mensagens inline

### Fase 4 — Excellence (futuro)
- [ ] Dark mode
- [ ] Temas customizáveis por petshop
- [ ] Ilustrações e micro-animações
- [ ] Design tokens exportáveis para Figma
- [ ] Storybook com todos componentes

---

*Documento gerado em 2026-08-01 como parte do ciclo Design QA.*
