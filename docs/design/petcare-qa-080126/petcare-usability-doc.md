# 📖 Documentação de Usabilidade — PetCare Agenda

> **Data:** 2026-08-01
> **Versão:** v1.0 (MVP — Clean Architecture + FSD)
> **Públicos-alvo:** Donos de Petshop (Owner) e Tutores de Pet (Tutor)
> **Objetivo:** Documentar a experiência do usuário, jornadas principais, pontos fortes e oportunidades de melhoria sob a perspectiva de negócio e usuário final

---

## 🔷 PARTE A — Visão do Usuário Final (Tutor)

### Perfil do Usuário Tutor

**Quem é:** Pessoa física que possui um ou mais animais de estimação (cães, gatos, outros) e precisa agendar serviços em um petshop.

**Objetivo principal:** Agendar banhos e vacinas para seus pets de forma rápida e acompanhar o histórico.

**Contexto de uso:** Mobile-first — provavelmente acessa do celular enquanto está em casa ou no trabalho. Precisa de uma experiência simples e direta.

---

### Jornada 1: Primeiro Acesso — Cadastro e Onboarding

```
[Landing Page] → [Escolher Perfil "Tutor"] → [Preencher Dados] → [Login] → [Dashboard]
```

#### Fluxo Atual

1. **Tela de Auth:** O tutor chega na tela de Login/Cadastro com um layout dividido: branding à esquerda, formulário à direita
2. **Escolha de perfil:** Clica em "Cadastro", depois seleciona "Sou Tutor de Pet" — o card fica destacado com borda ocean
3. **Formulário:** Preenche nome, email, telefone, endereço e senha
4. **Opcional:** Pode marcar "Adicionar primeiro pet agora" e preencher dados do pet
5. **Confirmação:** Clica "Criar conta" e recebe feedback verde: "Cadastro realizado com sucesso"
6. **Redirecionamento:** Volta para tela de Login com email preenchido

#### Avaliação de Usabilidade

| Critério | Nota | Observação |
|----------|------|------------|
| Clareza do propósito | ⭐⭐⭐⭐ | O texto "Cadastros separados para clientes e petshop" explica bem o modelo |
| Facilidade de escolha | ⭐⭐⭐⭐ | Cards "Sou Tutor" / "Sou Empresa" são intuitivos |
| Feedback de ação | ⭐⭐⭐ | Mensagem de sucesso aparece, mas poderia ter transição mais suave para login |
| Tratamento de erros | ⭐⭐ | Mensagens genéricas; usuário não sabe qual campo errou |
| Tempo até valor | ⭐⭐⭐⭐ | Rápido — 5 campos + submit |

#### Oportunidades de Melhoria

1. **Onboarding guiado:** Após primeiro login, mostrar um tooltip ou destaque nos elementos principais (ex: "Cadastre seu primeiro pet aqui")
2. **Validação inline:** Mostrar erros campo a campo em vez de mensagem genérica
3. **Confirmação visual:** Após cadastro bem-sucedido, mostrar animação de sucesso antes de redirecionar

---

### Jornada 2: Agendamento de Serviço

```
[Dashboard Tutor] → [Selecionar Pet] → [Solicitar Serviço] → [Escolher Banho/Vacina] 
→ [Selecionar Serviço] → [Escolher Dia/Horário] → [Agendar] → [Histórico]
```

#### Fluxo Atual

1. **Dashboard:** Tutor vê header com seus pets em tabs horizontais. Seleciona o pet desejado
2. **Navegação:** Clica na tab "Solicitar Serviço" 
3. **Escolha de tipo:** Seleciona "Banhos" ou "Vacinas" via toggle
4. **Cards de serviço:** Vê cards com nome, duração, preço, descrição e benefícios
5. **Seleção:** Clica "Selecionar" em um card — botão muda para "Agendar"
6. **Disponibilidade:** Seleciona dia e horário disponível via dropdowns
7. **Confirmação:** Clica "Agendar" e é redirecionado para o Histórico

#### Avaliação de Usabilidade

| Critério | Nota | Observação |
|----------|------|------------|
| Clareza das opções | ⭐⭐⭐⭐ | Cards com benefícios e preço são informativos |
| Facilidade de seleção | ⭐⭐⭐ | Indicador visual de card selecionado é sutil |
| Disponibilidade | ⭐⭐⭐ | Dropdowns de dia/hora funcionam, mas sem indicação de quantos horários restam |
| Feedback pós-agendamento | ⭐⭐ | Redireciona para histórico, mas sem mensagem de confirmação explícita |
| Prevenção de erros | ⭐⭐ | Sem modal de confirmação antes de agendar |

#### Oportunidades de Melhoria

1. **Indicador de seleção mais forte:** O card selecionado precisa de destaque mais evidente (fundo mint, checkmark)
2. **Mensagem de sucesso:** Após agendar, mostrar toast/banner "Serviço agendado com sucesso!"
3. **Prevenção de duplo clique:** Desabilitar botão "Agendar" durante a requisição
4. **Dica de disponibilidade:** Mostrar "X horários disponíveis nesta data"

---

### Jornada 3: Acompanhamento de Histórico

```
[Dashboard Tutor] → [Selecionar Pet] → [Histórico] → [Visualizar/Cancelar]
```

#### Avaliação

| Critério | Nota | Observação |
|----------|------|------------|
| Legibilidade da tabela | ⭐⭐⭐ | Colunas claras, scroll horizontal em mobile |
| Status visual | ⭐⭐⭐ | Badges coloridos por status (Agendado/Concluído/Cancelado) |
| Ação de cancelar | ⭐⭐ | Botão pequeno (36px) em mobile, sem confirmação |
| Empty state | ⭐⭐⭐ | "Nenhum serviço encontrado para este pet" — mensagem clara |

---

### Análise de Microcopy (Tutor)

| Tela | Texto Atual | Sugestão |
|------|------------|----------|
| AuthScreen | "Gestao para tutores, pets e um petshop" | "Gestão para tutores, pets e petshops" |
| AppShell | "Notificacoes do petshop" | "Notificações do petshop" |
| ServiceRequest | "Horario disponivel" | "Horário disponível" |
| ServiceRequest | "Nao foi possivel carregar agenda disponivel." | "Não foi possível carregar a agenda. Tente novamente." |
| ServiceRequest | "Nenhum petshop disponivel no momento." | "Nenhum petshop disponível no momento." |
| ServiceHistory | "Indisponivel" | "Indisponível" |
| VaccinationWallet | "As vacinas aplicadas para {pet} aparecerao aqui." | "As vacinas aplicadas para {pet} aparecerão aqui." |

---

## 🔶 PARTE B — Visão Negocial (Owner / Dono de Petshop)

### Perfil do Usuário Owner

**Quem é:** Dono ou gerente de um petshop que precisa gerenciar os agendamentos recebidos e manter o catálogo de serviços atualizado.

**Objetivo principal:** Visualizar e gerenciar agendamentos recebidos, cadastrar/remover serviços do catálogo.

**Contexto de uso:** Desktop-first — provavelmente acessa de um computador no estabelecimento. Precisa de visão consolidada e ações rápidas.

---

### Jornada 1: Visão do Negócio — Dashboard

```
[Login Owner] → [Dashboard] → [Métricas] → [Tabela de Agendamentos] → [Detalhes do Cliente]
```

#### Fluxo Atual

1. **Header:** "Dashboard do Petshop" com nome do owner e botão Sair
2. **Métricas:** 4 cards (Total, Agendados, Banhos, Vacinas) com ícones e números grandes
3. **Tabs:** "Serviços agendados" e "Cadastro de serviços"
4. **Tabela:** Lista de agendamentos com Data/Hora, Serviço (com ícone Banho/Vacina), Nome do Tutor, Nome do Pet, Status, Ação
5. **Detalhes:** Ao clicar "Ver detalhes", painel lateral mostra dados completos do agendamento, tutor e pet

#### Avaliação de Usabilidade

| Critério | Nota | Observação |
|----------|------|------------|
| Visão consolidada | ⭐⭐⭐⭐ | Métricas no topo dão visão imediata do negócio |
| Rastreabilidade | ⭐⭐⭐⭐ | Tabela rica com tutor, pet, serviço, status e data |
| Detalhes do cliente | ⭐⭐⭐⭐ | Painel lateral mostra endereço, email, telefone, dados do pet |
| Ações disponíveis | ⭐⭐⭐ | Cancelar agendamento (com notificação ao tutor), ver detalhes |
| Diferenciação visual | ⭐⭐⭐⭐ | Ícones Banho (Waves) e Vacina (Syringe) na tabela |

#### Oportunidades de Melhoria

1. **Filtros e busca:** Tabela não tem busca ou filtro por status/data — essencial com volume crescente
2. **Exportação:** Sem opção de exportar agendamentos (CSV/PDF)
3. **Indicador de urgência:** Agendamentos para hoje/dia seguinte sem destaque
4. **Confirmação de cancelamento:** Modal antes de cancelar evitaria erros

---

### Jornada 2: Gestão de Catálogo

```
[Dashboard] → [Tab "Cadastro de serviços"] → [Formulário] → [Lista de Serviços]
```

#### Fluxo Atual

1. **Toggle tab:** Clica em "Cadastro de serviços"
2. **Formulário:** Layout side-by-side — formulário à esquerda, lista à direita
3. **Campos:** Nome, Categoria (Banho/Vacina), Duração, Preço, Descrição, Benefícios
4. **Submit:** "Adicionar serviço" — serviço aparece instantaneamente na lista
5. **SSE:** O catálogo é transmitido em tempo real para tutores conectados

#### Avaliação de Usabilidade

| Critério | Nota | Observação |
|----------|------|------------|
| Formulário | ⭐⭐⭐ | Campos bem distribuídos, uso de grid 2 colunas |
| Feedback imediato | ⭐⭐⭐⭐ | Serviço aparece na lista instantaneamente após adicionar |
| Remoção | ⭐⭐⭐⭐ | Botão delete com ícone Trash2 e hover coral |
| Tempo real | ⭐⭐⭐⭐⭐ | SSE — diferencial competitivo forte |
| Prevenção de erros | ⭐⭐ | Sem confirmação ao deletar serviço |

---

### Análise de Microcopy (Owner)

| Tela | Texto Atual | Sugestão |
|------|------------|----------|
| OwnerDashboard | "Dono:" | "Proprietário:" |
| OwnerDashboard | "Agenda recebida" | "Agendamentos recebidos" |
| OwnerDashboard | "Sem observacoes" | "Sem observações" |
| OwnerDashboard | "Nao informado" | "Não informado" |
| OwnerServices | "Remover servico" | "Remover serviço" |
| OwnerServices | "Adicionar servico" | "Adicionar serviço" |
| OwnerServices | "Nenhum servico cadastrado ainda" | "Nenhum serviço cadastrado ainda" |

---

## 🔷 PARTE C — Análise Cruzada (Tutor × Owner)

### Consistência entre Perfis

| Aspecto | Status | Detalhe |
|---------|--------|---------|
| Paleta de cores | ✅ Consistente | Mesma paleta ink/coral/ocean/mint/paper em ambos |
| Header | ⚠️ Inconsistente | Tutor: glass-effect (backdrop-blur) / Owner: branco sólido |
| Tabelas | ⚠️ Inconsistente | Estilos similares mas implementações separadas |
| Badges | ⚠️ Inconsistente | StatusBadge tem 2 implementações (shared + OwnerDashboard local) |
| Botões | ✅ Consistente | Mesmos estilos de botão primário/secundário/outline |
| Tipografia | ✅ Consistente | Inter em ambos, mesma hierarquia |

### Funcionalidades Exclusivas

| Funcionalidade | Tutor | Owner |
|---------------|-------|-------|
| Cadastro de pets | ✅ | ❌ |
| Agendamento | ✅ | ❌ |
| Histórico | ✅ | ❌ (vê via dashboard) |
| Cancelamento | ✅ (apenas próprios) | ✅ (qualquer um da loja) |
| Catálogo de serviços | ❌ (apenas visualiza) | ✅ (CRUD completo) |
| Notificações | ✅ (recebe) | ❌ (envia implicitamente ao cancelar) |
| Carteira de Vacinação | ✅ (vazia) | ❌ |
| Métricas do negócio | ❌ | ✅ |
| SSE (tempo real) | ✅ (recebe) | ❌ (dispara) |

---

## 📊 Avaliação Geral de Usabilidade

### Escala SUS Estimada (System Usability Scale)

| Dimensão | Pontuação (1-5) |
|----------|-----------------|
| Frequência de uso desejada | ⭐⭐⭐⭐ (4) |
| Complexidade percebida | ⭐⭐⭐⭐ (4 — simples) |
| Facilidade de uso | ⭐⭐⭐⭐ (4) |
| Necessidade de suporte técnico | ⭐⭐⭐⭐ (4 — pouca) |
| Integração de funções | ⭐⭐⭐ (3) |
| Inconsistências | ⭐⭐⭐ (3 — algumas) |
| Rapidez de aprendizado | ⭐⭐⭐⭐⭐ (5) |
| Facilidade de memorização | ⭐⭐⭐⭐ (4) |
| Eficiência | ⭐⭐⭐ (3) |
| Satisfação | ⭐⭐⭐⭐ (4) |

**SUS Score Estimado:** ~77/100 — **"Bom"** (acima da média de 68)

### Pontos Fortes

1. **Simplicidade** — Cada tela tem propósito único e claro
2. **Feedback visual** — Cores, badges e ícones comunicam estado rapidamente
3. **Tempo real (SSE)** — Diferencial técnico visível ao usuário
4. **Mobile-first** — Experiência funciona bem no celular do tutor
5. **Preço visível** — Serviços mostram preço formatado em BRL (R$)
6. **Separação de papéis** — Tutor e Owner têm experiências totalmente adaptadas

### Pontos Fracos

1. **Acessibilidade** — Contraste, focus indicators e screen readers precisam de atenção
2. **Validação** — Erros não são específicos por campo
3. **Confirmação** — Ações destrutivas (cancelar, deletar) sem modal de confirmação
4. **Acentuação** — Textos sem acentos passam impressão de produto incompleto
5. **Loading states** — Falta feedback visual durante operações assíncronas
6. **Empty states** — Carteira de Vacinação vazia sem orientação

---

## 🎯 Recomendações Estratégicas

### Para o Produto (Alta Prioridade)

1. **Corrigir acentuação em todas as strings** — Impacto imediato na percepção de qualidade
2. **Adicionar loading states** — Previne duplo clique e melhora percepção de resposta
3. **Adicionar modais de confirmação** — Previne cancelamentos acidentais
4. **Melhorar contraste** — Essencial para acessibilidade e usuários com baixa visão

### Para o Negócio (Média Prioridade)

5. **Filtros no Dashboard Owner** — Essencial quando volume de agendamentos crescer
6. **Indicadores de urgência** — Destacar agendamentos do dia
7. **Exportação de dados** — CSV/PDF para relatórios do petshop
8. **Carteira de Vacinação** — Implementar Feature #10 para completar o ciclo de valor

---

*Documento gerado por análise do código-fonte e revisão de usabilidade em 2026-08-01.*
