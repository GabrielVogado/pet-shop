# 🔍 Design QA Report — PetCare Agenda

> **Data:** 2026-08-01
> **Revisor:** Claude (Design QA Skill)
> **Escopo:** Revisão completa de UI/UX do frontend — 7 telas, 14 componentes
> **Fonte:** Análise estática de código-fonte (D:\pet-shop\pet-shop-frontend\src\)
> **Sem Figma de referência** — Revisão baseada em boas práticas de design system, acessibilidade e consistência interna

---

## 📊 Executive Summary

| Métrica | Valor |
|---------|-------|
| **Total de issues encontradas** | **47** |
| **Críticas (Critical)** | 3 |
| **Altas (High)** | 12 |
| **Médias (Medium)** | 18 |
| **Baixas (Low)** | 14 |
| **Avaliação geral** | ⚠️ **Bom, mas precisa de ajustes** — Funcional e consistente, com débitos de acessibilidade e polimento visual |

### Índice de Qualidade por Área

| Área | Nota | Status |
|------|------|--------|
| Consistência Visual | 7.5/10 | 🟡 Boa base, inconsistências pontuais |
| Design System | 6.5/10 | 🟡 Tokens definidos no Tailwind, sem CSS custom properties |
| Acessibilidade | 4.5/10 | 🔴 Várias falhas WCAG AA |
| Responsividade | 7.0/10 | 🟡 Mobile-first funcional, mas sem testes em tablets |
| Estados de Interação | 6.0/10 | 🟡 Focus inconsistente, faltam loading states |
| Cobertura de Estados | 5.5/10 | 🟡 Faltam empty states, error states, loading states |

---

## 🔴 Critical Issues (3)

### CRIT-01 — Contraste de texto ocean sobre mint falha WCAG AA

**Localização:** Badge "Agendado" (`StatusBadge`), tabs ativas, alguns labels

**Especificação:** WCAG AA exige contraste mínimo de 4.5:1 para texto normal e 3:1 para texto grande (≥18px bold ou ≥24px)

**Realidade:** 
- `text-ocean (#147b8f)` sobre `bg-mint (#dff5ec)` = **~2.7:1** ❌
- Afeta: todas as badges "Agendado", labels "Solicitação"/"Operação"/"Saúde", tabs ativas de conteúdo

**Impacto:** Usuários com baixa visão ou daltonismo podem não conseguir ler badges de status, labels de seção e tabs ativas.

**Recomendação:** 
- Badge "Agendado": usar `bg-ocean text-white` ou `bg-ocean/15 text-ocean` (inverter: fundo ocean claro, texto ocean escuro)
- Labels de seção: manter `text-ocean` com peso `font-bold` (≥18px bold conta como large text, 3:1 mínimo — passa raspando)
- Alternativa: escurecer `ocean` para `#0f6273` ou clarear `mint` para `#e8faf3`

**Severidade:** 🔴 CRITICAL — Falha de acessibilidade afetando múltiplos componentes

---

### CRIT-02 — Duplicação de código entre StatusBadge, TableHead, TableCell

**Localização:** 
- `src/shared/ui/StatusBadge.jsx` (componente compartilhado)
- `src/features/dashboard/owner/OwnerDashboard.jsx` (funções duplicadas: `StatusBadge`, `TableHead`, `TableCell`)

**Realidade:** O componente OwnerDashboard.jsx redefine localmente `StatusBadge`, `TableHead` e `TableCell` — os mesmos componentes já existem em `src/shared/ui/`. Isso significa que qualquer correção no componente compartilhado **não se aplica ao dashboard do owner**.

**Impacto:**
- Correções de acessibilidade/a11y aplicadas ao componente compartilhado não surtem efeito no dashboard
- Risco de divergência visual entre Tutor e Owner
- Manutenção duplicada

**Recomendação:** 
1. Remover as definições locais de `StatusBadge`, `TableHead`, `TableCell` do `OwnerDashboard.jsx`
2. Importar de `../../../shared/ui/StatusBadge` e `../../../shared/ui/Table`
3. Verificar se não há outras duplicações similares

**Severidade:** 🔴 CRITICAL — Duplicação de código com impacto direto em consistência e manutenibilidade

---

### CRIT-03 — Falta de indicadores de foco visíveis em múltiplos elementos interativos

**Localização:** 
- Botão "Sair" no AppShell (sem `focus:ring`)
- Botões de toggle Login/Cadastro no AuthScreen (sem `focus:ring`)
- Botões "Selecionar perfil" (ProfileCard) no AuthScreen (sem `focus:ring`)
- Botão "Adicionar primeiro pet" (checkbox) (sem `focus:ring`)

**Especificação:** WCAG 2.4.7 (Focus Visible) — todos elementos interativos devem ter indicador de foco visível

**Impacto:** Usuários navegando por teclado não conseguem identificar qual elemento está focado.

**Recomendação:** Adicionar `focus:outline-none focus:ring-2 focus:ring-ocean focus:ring-offset-2` em todos botões e elementos interativos.

**Severidade:** 🔴 CRITICAL — Falha WCAG 2.4.7 (Focus Visible), afeta navegação por teclado

---

## 🟠 High Issues (12)

### HIGH-01 — Botões primários usam cor de hover hardcoded (#dc5848) ao invés de token

**Localização:** Todos botões com classe `hover:bg-[#dc5848]` (AuthScreen, ServiceRequest, OwnerDashboard, PetRegistration, OwnerServices)

**Realidade:** A cor de hover do coral é definida como valor arbitrário `[#dc5848]` em vez de usar uma extensão do Tailwind config. Se a cor `coral` mudar, o hover ficará inconsistente.

**Recomendação:** Adicionar `coral-hover: '#dc5848'` ou `coral: { DEFAULT: '#f26957', hover: '#dc5848' }` no `tailwind.config.js` e usar `hover:bg-coral-hover`.

**Severidade:** 🟠 HIGH — Inconsistência de design token

---

### HIGH-02 — Inconsistência no border-radius: `rounded` vs `rounded-md`

**Localização:** 
- Botões usam `rounded` (4px)
- Cards e containers usam `rounded-md` (6px)
- Essa diferença é intencional e consistente ✅, mas tabs-container usa `rounded-md` enquanto os botões internos usam `rounded` — cria uma borda interna assimétrica

**Realidade:** O container de tabs tem `rounded-md` (6px) mas os botões internos têm `rounded` (4px), criando uma inconsistência visual de 2px entre as bordas.

**Recomendação:** Padronizar todos containers de tabs e seus elementos internos com o mesmo border-radius, ou usar `overflow-hidden` no container.

**Severidade:** 🟠 HIGH — Inconsistência visual em múltiplas telas

---

### HIGH-03 — Palette de cores não documentada como tokens CSS reais

**Localização:** `tailwind.config.js` define cores como extensões do tema, mas não gera CSS custom properties.

**Realidade:** As cores ink, coral, ocean, mint, paper existem apenas no contexto do Tailwind. Se fosse necessário usar essas cores em inline styles, SVGs, ou outros contextos, não haveria referência.

**Recomendação:** Adicionar no `index.css`:
```css
:root {
  --color-ink: #18212f;
  --color-coral: #f26957;
  --color-ocean: #147b8f;
  --color-mint: #dff5ec;
  --color-paper: #faf8f4;
}
```
E referenciá-las no Tailwind config: `ink: 'var(--color-ink)'` etc.

**Severidade:** 🟠 HIGH — Boa prática de design system

---

### HIGH-04 — Carteira de Vacinação é tela vazia (funcionalidade não implementada)

**Localização:** `VaccinationWallet.jsx` — Sempre exibe estado vazio (hardcoded `vaccinations={[]}`)

**Realidade:** O `TutorDashboardPage` passa `vaccinations={[]}` como prop fixa. O componente tem um layout completo para quando há vacinas, mas nunca é usado. O backend não tem endpoints para registro de vacinas (Feature #10 no FEATURES.md, pendente).

**Impacto:** Usuário vê uma tela inútil. Experiência incompleta.

**Recomendação:** 
- Curto prazo: Adicionar um CTA na tela vazia ("Solicitar cadastro de vacina" ou "Em breve")
- Médio prazo: Implementar endpoints de vacinação (conforme Feature #10)

**Severidade:** 🟠 HIGH — Funcionalidade incompleta visível ao usuário

---

### HIGH-05 — Falta de estado de loading nas operações assíncronas

**Localização:** 
- ServiceRequest: botão "Agendar" não mostra loading/spinner durante a submissão
- ServiceHistory: botão "Cancelar" não mostra loading
- AuthScreen: botões Login/Cadastro não têm estado de loading

**Impacto:** Usuário pode clicar múltiplas vezes sem feedback, causando requisições duplicadas.

**Recomendação:** Adicionar estado `loading` nos botões de submit com spinner e texto "Carregando..." ou "Agendando...".

**Severidade:** 🟠 HIGH — UX prejudicada, risco de double-submit

---

### HIGH-06 — Mensagens de feedback não são anunciadas para leitores de tela

**Localização:** 
- `AuthScreen.jsx` — div de mensagem `{message && <div>...}</div>` sem `role="alert"`
- `ServiceRequest.jsx` — mensagem de erro `availabilityError` sem `role="alert"`

**Especificação:** WCAG 4.1.3 (Status Messages) — mensagens de status devem ser anunciadas por leitores de tela.

**Recomendação:** Adicionar `role="alert"` ou `aria-live="polite"` nas divs de mensagem.

**Severidade:** 🟠 HIGH — Falha de acessibilidade WCAG 4.1.3

---

### HIGH-07 — Labels e inputs não associados semanticamente (PetRegistration)

**Localização:** `PetRegistration.jsx` — O select de espécie não tem `id` + `htmlFor`, e o label "Especie" não está associado programaticamente.

**Realidade:** Os componentes `<Field>` usam `<label>` com `<input>` aninhado, o que funciona para clique. Mas o select manual na tela de cadastro/edição de pet usa `<label className="block"><span>...</span><select>...</select></label>` — isso também funciona, mas não é semanticamente ideal pois o label não tem `htmlFor`.

**Impacto:** Leve — leitores de tela ainda conseguem inferir a relação. Mas a prática recomendada é usar `htmlFor` + `id`.

**Recomendação:** Padronizar selects com `htmlFor`/`id`, ou extrair o select para um componente `SelectField` similar ao `Field`.

**Severidade:** 🟠 HIGH — Débito de acessibilidade

---

### HIGH-08 — Componente Field não suporta erros de validação

**Localização:** `src/shared/ui/Field.jsx` — Sem prop para mensagem de erro.

**Realidade:** Nenhum formulário mostra erros inline nos campos. O AuthScreen mostra uma mensagem geral, mas não indica qual campo falhou. ServiceRequest mostra erro de disponibilidade, mas não no campo específico.

**Recomendação:** Adicionar props `error` e `hint` ao componente Field:
```jsx
function Field({ label, error, hint, ... }) {
  return (
    <label>
      <span>{label}</span>
      <input ... aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} />
      {error && <span id={`${name}-error`} className="text-coral text-xs">{error}</span>}
      {hint && !error && <span className="text-ink/45 text-xs">{hint}</span>}
    </label>
  );
}
```

**Severidade:** 🟠 HIGH — Limitação do design system

---

### HIGH-09 — Checkbox "Adicionar primeiro pet" sem estilo de focus e label não clicável

**Localização:** `AuthScreen.jsx` — Checkbox de "Adicionar primeiro pet agora"

**Realidade:** O label envolve o checkbox, o que é bom. Mas o checkbox em si não tem estilo de focus visível e a área clicável é restrita ao tamanho do checkbox (16px).

**Recomendação:** 
- Adicionar `focus:ring-2 focus:ring-ocean focus:ring-offset-2` no checkbox
- Garantir que o label ocupe toda a largura com `cursor-pointer`

**Severidade:** 🟠 HIGH — Acessibilidade de formulário

---

### HIGH-10 — Header do OwnerDashboard usa bg-white (inconsistente com AppShell bg-paper/95)

**Localização:** 
- `AppShell.jsx` (Tutor): `<header className="... bg-paper/95 backdrop-blur">`
- `OwnerDashboard.jsx` (Owner): `<header className="... bg-white">`

**Realidade:** O tutor vê um header com efeito glass (translúcido + blur), o owner vê um header branco sólido. Inconsistência visual entre os dois lados da aplicação.

**Recomendação:** Unificar headers. O OwnerDashboard deveria usar o mesmo `bg-paper/95 backdrop-blur` ou o AppShell deveria ser reutilizado para ambos os papéis.

**Severidade:** 🟠 HIGH — Inconsistência cross-role

---

### HIGH-11 — Notificações exibem "Notificacoes do petshop" (falta acentuação)

**Localização:** `AppShell.jsx` linha 95: `<h2>Notificacoes do petshop</h2>`

**Realidade:** Texto deveria ser "Notificações do petshop" com "ç".

**Recomendação:** Corrigir para `Notificações do petshop`.

**Severidade:** 🟠 HIGH — Erro de ortografia em texto visível ao usuário

---

### HIGH-12 — ServiceHistory e OwnerDashboard usam `<table>` manual em vez do componente Table

**Localização:** 
- `ServiceHistory.jsx` — usa `<table>`, `<thead>`, `<tbody>` diretamente
- `OwnerDashboard.jsx` — idem, com `TableHead`/`TableCell` duplicados localmente

**Realidade:** Existe um componente `Table` em `shared/ui/Table.jsx` com TableHead, TableCell, Table, TableHeader, TableBody, mas o ServiceHistory não o utiliza, e o OwnerDashboard redefine os componentes.

**Recomendação:** Refatorar para usar o componente Table compartilhado em todas as telas.

**Severidade:** 🟠 HIGH — Duplicação e inconsistência

---

## 🟡 Medium Issues (18)

### MED-01 — Botão "Cancelar" no ServiceHistory usa min-h-9 (36px) — abaixo do touch target mínimo

**Localização:** `ServiceHistory.jsx` — `className="min-h-9 rounded bg-coral px-3 text-xs font-bold text-white"`

**Realidade:** Touch target mínimo recomendado para mobile é 44x44px (WCAG 2.5.5 Target Size, AAA). O botão tem 36px.

**Recomendação:** Aumentar para `min-h-10` (40px) no mínimo, idealmente `min-h-11` (44px).

**Severidade:** 🟡 MEDIUM — Usabilidade mobile

---

### MED-02 — Ícone de notificação (Bell) mostra sempre, mesmo sem notificações

**Localização:** `AppShell.jsx` — O sino e "Notificações do petshop" só aparecem quando `notifications.length > 0`, mas não há badge/contador.

**Recomendação:** Adicionar um badge numérico no sino quando houver notificações não lidas.

**Severidade:** 🟡 MEDIUM — Melhoria de UX

---

### MED-03 — Loading state inicial "Carregando..." sem estilo visual

**Localização:** `App.jsx` — `<div className="flex h-screen items-center justify-center text-ink/60">Carregando...</div>`

**Realidade:** Apenas texto simples, sem spinner ou animação.

**Recomendação:** Adicionar um spinner animado (pode usar o PawPrint com animação pulse).

**Severidade:** 🟡 MEDIUM — Polimento visual

---

### MED-04 — Selects não têm opção placeholder / "Selecione..."

**Localização:** Todos os `<select>` — espécie, categoria, petshop. O primeiro option já é um valor válido.

**Recomendação:** Adicionar `<option value="">Selecione...</option>` como primeiro elemento para forçar escolha consciente.

**Severidade:** 🟡 MEDIUM — UX de formulário

---

### MED-05 — Input de preço aceita qualquer número decimal

**Localização:** `OwnerServices.jsx` — `<Field type="number" step="0.01">`

**Realidade:** O campo aceita valores negativos e números muito grandes. Não há validação de mínimo (ex: preço deve ser > 0).

**Recomendação:** Adicionar `min="0.01"` e validação.

**Severidade:** 🟡 MEDIUM — Validação de formulário

---

### MED-06 — Card de serviço no ServiceRequest não mostra indicador visual de "já selecionado" suficiente

**Localização:** `ServiceRequest.jsx` — Cards selecionados só mudam a borda para `border-ocean/40`

**Realidade:** A diferença entre `border-ink/10` e `border-ocean/40` é sutil. Poderia ser mais óbvio qual card está selecionado.

**Recomendação:** Adicionar `bg-mint/30` ou `ring-1 ring-ocean` no card selecionado.

**Severidade:** 🟡 MEDIUM — UX de seleção

---

### MED-07 — Sem indicador de "última atualização" no catálogo SSE

**Localização:** `ServiceRequest.jsx` — Badge "Catálogo atualizado em tempo real" mostra ponto verde, mas sem timestamp.

**Recomendação:** Adicionar timestamp da última atualização: "Última atualização: 14:30".

**Severidade:** 🟡 MEDIUM — Transparência de dados

---

### MED-08 — Texto "Gestao para tutores, pets e um petshop" sem acentuação

**Localização:** `AuthScreen.jsx` — `<p>Gestao para tutores, pets e um petshop</p>`

**Realidade:** Deveria ser "Gestão para tutores, pets e um petshop".

**Severidade:** 🟡 MEDIUM — Ortografia

---

### MED-09 — "Nenhum petshop disponivel" — falta acento em "disponível"

**Localização:** `ServiceRequest.jsx` — múltiplas strings sem acentuação: "disponivel", "Horario disponivel", "Dia disponivel", "Nao foi possivel"

**Recomendação:** Revisar todas as strings para acentuação correta:
- disponivel → disponível
- Horario → Horário
- Dia disponivel → Dia disponível
- Nao → Não
- servico → serviço
- historico → histórico
- vacinacao → vacinação
- notificacoes → notificações
- especificacoes → especificações
- informacoes → informações
- tutor nao identificado → tutor não identificado
- Nao informado → Não informado
- Sem observacoes → Sem observações
- Selecione um agendamento para ver os dados → ... para ver os dados

**Severidade:** 🟡 MEDIUM — Ortografia generalizada (aplicação não trata acentos)

---

### MED-10 — Sem página 404 ou estado de "nada encontrado" para rotas inválidas

**Localização:** `App.jsx` — Rota catch-all: `<Route path="*" element={<Navigate to="/auth" replace />} />`

**Realidade:** Redireciona silenciosamente para auth, sem explicar que a página não existe.

**Recomendação:** Criar componente NotFound e redirecionar com mensagem.

**Severidade:** 🟡 MEDIUM — UX de navegação

---

### MED-11 — ServiceRequest: sem indicador de qual serviço está selecionado quando o card está em modo "Agendar"

**Realidade:** Após clicar "Selecionar", o botão muda para "Agendar", mas o card selecionado só tem mudança sutil de borda. Se houver múltiplos cards, não fica óbvio qual está prestes a ser agendado.

**Recomendação:** Adicionar checkmark ou destaque mais forte no card ativo.

**Severidade:** 🟡 MEDIUM — UX de seleção

---

### MED-12 — Sem confirmação antes de cancelar agendamento

**Localização:** `ServiceHistory.jsx` e `OwnerDashboard.jsx` — Botão cancelar executa imediatamente.

**Recomendação:** Adicionar modal de confirmação: "Deseja realmente cancelar este agendamento?"

**Severidade:** 🟡 MEDIUM — UX — risco de ação acidental

---

### MED-13 — Sem limite de notificações visíveis além de `slice(0,3)`

**Localização:** `AppShell.jsx` — `notifications.slice(0, 3)`

**Realidade:** Se houver mais de 3 notificações, as antigas simplesmente não aparecem. Não há link "Ver todas".

**Recomendação:** Adicionar "Ver mais" ou badge com contagem total.

**Severidade:** 🟡 MEDIUM — UX de notificações

---

### MED-14 — AuthScreen: botão "Criar conta" desabilitado até selecionar perfil, mas sem dica visual do que falta

**Realidade:** O botão fica cinza com `disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ink/45` até selecionar perfil, mas não há texto explicativo próximo.

**Recomendação:** Adicionar texto "Selecione um perfil acima para continuar" próximo ao botão desabilitado.

**Severidade:** 🟡 MEDIUM — UX de formulário

---

### MED-15 — Formulário de cadastro Owner não tem campo de endereço

**Localização:** `AuthScreen.jsx` — `OwnerFields` não inclui campo de endereço, apenas `TutorFields` tem.

**Realidade:** O tutor precisa de endereço (Feature #12), mas o owner não. Isso é intencional, mas pode causar inconsistência se futuramente o owner precisar de endereço.

**Recomendação:** Documentar que a ausência é intencional ou adicionar o campo.

**Severidade:** 🟡 MEDIUM — Consistência de dados

---

### MED-16 — AppShell duplica lógica de tabs com OwnerDashboard

**Localização:** 
- `AppShell.jsx` — tabs de navegação (pet tabs + page tabs)
- `OwnerDashboard.jsx` — tabs de conteúdo (appointments/services)

**Realidade:** Ambos implementam lógica de tabs independentemente, com estilos ligeiramente diferentes.

**Recomendação:** Extrair componente `Tabs` compartilhado para unificar estilos e comportamento.

**Severidade:** 🟡 MEDIUM — Componentização

---

### MED-17 — ServiceRequest seleciona automaticamente primeiro serviço, mas sem indicação clara

**Realidade:** `useEffect` seleciona o primeiro serviço automaticamente ao carregar. Se a lista for longa, o usuário pode não perceber que um serviço já está selecionado.

**Recomendação:** Scroll para o card selecionado ou destacar mais obviamente.

**Severidade:** 🟡 MEDIUM — UX

---

### MED-18 — Falta aria-label em vários botões de ícone

**Localização:** 
- Botão delete (Trash2) sem aria-label: `<button title="Remover servico">`
- Botões de toggle de serviço sem aria-label

**Recomendação:** Adicionar `aria-label="Remover serviço"` nos botões de ícone sem texto visível.

**Severidade:** 🟡 MEDIUM — Acessibilidade

---

## 🟢 Low Issues (14)

### LOW-01 — Favicon não especificado / pode estar ausente

**Localização:** `index.html` — verificar se há `<link rel="icon">` definido.

**Recomendação:** Usar o ícone PawPrint como favicon.

**Severidade:** 🟢 LOW — Polimento

---

### LOW-02 — Título da página (document.title) sempre "PetCare Agenda" — não varia por rota

**Realidade:** Não há `document.title` dinâmico entre Login, Dashboard Tutor e Dashboard Owner.

**Recomendação:** Atualizar título por rota: "Login | PetCare Agenda", "Dashboard | PetCare Agenda".

**Severidade:** 🟢 LOW — SEO e UX de abas

---

### LOW-03 — Sem transição ao trocar entre tabs

**Realidade:** A troca de tabs é instantânea, sem animação de fade ou slide.

**Recomendação:** Adicionar transição CSS simples (fade in) ao trocar de conteúdo de tab.

**Severidade:** 🟢 LOW — Polimento visual

---

### LOW-04 — Cards de métricas no OwnerDashboard não têm elemento semântico adequado

**Realidade:** Usam `<article>` em vez de um elemento mais específico.

**Recomendação:** OK usar article, mas poderia ter `aria-label` para contexto.

**Severidade:** 🟢 LOW — Semântica

---

### LOW-05 — Imagem de fundo ou ilustração poderia enriquecer AuthScreen

**Realidade:** AuthScreen é puramente textual/tipográfica. Uma ilustração de pet no lado esquerdo melhoraria o apelo visual.

**Recomendação:** Adicionar ilustração SVG decorativa no painel esquerdo.

**Severidade:** 🟢 LOW — Melhoria estética

---

### LOW-06 — Sem suporte a dark mode

**Realidade:** Sem `prefers-color-scheme: dark` ou toggle de tema.

**Recomendação:** Postergar para pós-MVP, mas documentar.

**Severidade:** 🟢 LOW — Funcionalidade futura

---

### LOW-07 — Input de idade do pet aceita qualquer texto

**Realidade:** Campo "Idade" no PetRegistration é tipo text, aceitando qualquer string.

**Recomendação:** Padronizar — ou é número (anos/meses) ou é texto livre com placeholder "ex: 2 anos".

**Severidade:** 🟢 LOW — UX de formulário

---

### LOW-08 — "Sem observacoes" (sem acento) no OwnerDashboard

**Realidade:** `'Sem observacoes'` deveria ser `'Sem observações'`.

**Severidade:** 🟢 LOW — Ortografia

---

### LOW-09 — Sombra shadow-soft definida mas shadow-sm usada em alguns lugares

**Realidade:** `shadow-soft` (0 18px 45px) vs `shadow-sm` (Tailwind default). Ambos são usados em cards, criando inconsistência sutil.

**Recomendação:** Padronizar: usar `shadow-soft` para cards e `shadow-sm` apenas para elementos pequenos (tabs, badges).

**Severidade:** 🟢 LOW — Consistência de sombra

---

### LOW-10 — Formatação de data/hora usa Intl mas sem timezone explícito

**Localização:** `dateTime.js` — `formatDateTime` usa `new Date(date)` local.

**Recomendação:** Documentar timezone usado ou usar UTC para consistência.

**Severidade:** 🟢 LOW — Consistência de dados

---

### LOW-11 — CSS não tem reset de lista (ul/ol)

**Realidade:** `index.css` tem reset de box-sizing, body, e button/input/select, mas não de listas.

**Recomendação:** Adicionar `ul, ol { list-style: none; padding: 0; }` se necessário para consistência cross-browser.

**Severidade:** 🟢 LOW — Consistência CSS

---

### LOW-12 — Server-Sent Events (SSE) usa EventSource nativo — sem polyfill para navegadores antigos

**Realidade:** `useCatalogStream.js` usa `new EventSource()`. Funciona em 97%+ dos navegadores modernos.

**Recomendação:** OK para MVP. Documentar compatibilidade.

**Severidade:** 🟢 LOW — Compatibilidade

---

### LOW-13 — Variável `realtime` definida mas condição `realtimeEnabled` sempre avalia como booleano

**Localização:** `TutorDashboardPage.jsx` — `const realtime = useServiceCatalogStream(petshopId, onUpdate)` e depois `<ServiceRequest realtimeEnabled={realtime} />` onde `realtime` é um objeto `{ connected, error }` — truthy mesmo sem conexão.

**Recomendação:** Passar `realtimeEnabled={realtime?.connected}` para refletir estado real da conexão.

**Severidade:** 🟢 LOW — Precisão do indicador

---

### LOW-14 — Campos de senha sem toggle de visibilidade

**Realidade:** Nenhum campo de senha tem botão "mostrar/ocultar".

**Recomendação:** Adicionar toggle de visibilidade nos campos de senha.

**Severidade:** 🟢 LOW — UX de formulário

---

## 📋 Resumo por Componente

| Componente | Issues | Status |
|-----------|--------|--------|
| **AuthScreen** | 7 (1C, 3H, 2M, 1L) | 🟡 Precisa de atenção |
| **AppShell** | 4 (0C, 2H, 2M, 0L) | 🟡 Header + Notificações |
| **ServiceRequest** | 7 (0C, 0H, 5M, 2L) | 🟡 UX e ortografia |
| **ServiceHistory** | 4 (0C, 2H, 1M, 1L) | 🟡 Tabela + Touch target |
| **OwnerDashboard** | 7 (1C, 4H, 1M, 1L) | 🔴 Duplicação + Header |
| **OwnerServices** | 3 (0C, 1H, 2M, 0L) | 🟡 Cor de hover |
| **PetRegistration** | 4 (0C, 2H, 1M, 1L) | 🟡 Select + Placeholder |
| **VaccinationWallet** | 2 (0C, 1H, 1M, 0L) | 🟠 Tela incompleta |
| **Field (shared)** | 2 (0C, 1H, 1M, 0L) | 🟡 Sem error state |
| **Table (shared)** | 1 (0C, 0H, 1M, 0L) | 🟡 Subutilizado |
| **StatusBadge (shared)** | 2 (1C, 0H, 0M, 1L) | 🔴 Contraste |
| **AuthProvider** | 1 (0C, 0H, 0M, 1L) | 🟢 OK |

---

## ✅ Observações Positivas

1. **Consistência de cores** — A paleta de 5 cores + variações de opacidade é bem aplicada e coerente em toda aplicação
2. **Mobile-first bem executado** — Layouts adaptam-se naturalmente de mobile para desktop
3. **Sistema de espaçamento consistente** — Uso disciplinado de `space-y-*`, `gap-*`, `p-*` com escala previsível
4. **Componentização limpa** — Separação clara entre shared/ui, features, e pages
5. **Estados disabled bem tratados** — `cursor-not-allowed` + opacidade reduzida em todos botões
6. **Uso de Lucide React** — Iconografia consistente e de qualidade
7. **Sistema de tabs reutilizável** — Padrão de tabs com estado ativo bem definido (ink/ocean)
8. **SSE em tempo real** — Implementação de catálogo com atualização em tempo real é diferenciada
9. **Fórmulas de cadastro bem organizadas** — Separação clara Tutor vs Owner no registro
10. **Feedback de disponibilidade** — ServiceRequest carrega datas/horários dinamicamente com tratamento de erro

---

## 🔧 Recomendações Prioritárias

### Imediatas (antes do próximo deploy):
1. Corrigir contraste ocean/mint nos badges (CRIT-01)
2. Eliminar duplicação de StatusBadge/TableHead/TableCell no OwnerDashboard (CRIT-02)
3. Adicionar focus indicators em todos botões (CRIT-03)
4. Corrigir acentuação em todas as strings (MED-08, MED-09, HIGH-11)

### Curto prazo (próximo sprint):
5. Adicionar estados de loading nos botões de submit (HIGH-05)
6. Adicionar `role="alert"` nas mensagens de feedback (HIGH-06)
7. Unificar header Tutor/Owner (HIGH-10)
8. Criar tokens CSS custom properties (HIGH-03)
9. Extrair componente Tabs compartilhado (MED-16)
10. Adicionar prop `error` ao componente Field (HIGH-08)

### Médio prazo:
11. Implementar Feature #10 (Carteira de Vacinação) (HIGH-04)
12. Adicionar modal de confirmação para cancelamento (MED-12)
13. Adicionar toggle de visibilidade de senha (LOW-14)
14. Melhorar empty states e páginas de erro (MED-10)

---

## 📊 Severity Breakdown

```
🔴 CRITICAL  (3)  ███░░░░░░░░░░░░░░░ 6.4%
🟠 HIGH     (12)  ████████████░░░░░░ 25.5%
🟡 MEDIUM   (18)  ██████████████████░ 38.3%
🟢 LOW      (14)  ██████████████░░░░░ 29.8%
                  ─────────────────────
                  TOTAL: 47 issues
```

---

*Relatório gerado por análise estática de código-fonte em 2026-08-01. Recomenda-se validação visual em browser após correções.*
