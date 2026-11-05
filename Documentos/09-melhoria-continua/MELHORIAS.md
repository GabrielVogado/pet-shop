# 🔁 Melhorias Aplicadas — PetCare Agenda

> **Como funciona:** uma observação (do PO, de uma revisão, de um teste ou de uso real) vira uma melhoria; **o que efetivamente entrou é registrado aqui, com o PR**. Mesmo modelo do `Historico-Melhorias.md` do Saúde Monitor.
>
> **Regra permanente:** toda melhoria de processo, qualidade, infraestrutura ou correção relevante ganha uma linha no índice e uma seção abaixo, com data, origem, PR e efeito. Sem a linha, a melhoria não está entregue. Nunca registre melhoria sem entrega correspondente.

---

## Índice de melhorias

| # | Data | Origem | O que mudou | PR | Estado |
|---|---|---|---|---|---|
| **M-001** | 05/11/2026 | Pedido do PO | Branch `develop` criada a partir de `master`; PRs passam a apontar para ela | — (criação de branch) | ✅ Aplicada |
| **M-002** | 05/11/2026 | Levantamento do repositório | Removidos 7 backups do `pom.xml` e o `dev.log` versionados; `.gitignore` passa a barrar `*.log` e `pom.xml.*` | #7 | ✅ Aplicada |
| **M-003** | 05/11/2026 | Pedido do PO: projeto sem documentação correta | Documentação volta ao repositório, escrita a partir do código; ADRs revisados contra o código | #8 | ✅ Aplicada |
| **M-004** | 05/11/2026 | Pedido do PO: não depender só do Obsidian | `Documentos/` no padrão do Saúde Monitor: pastas numeradas, `00-INDICE`, `MELHORIAS.md`, `HISTORICO.md`, git-flow `develop → master → release/<tag>` | #9 | ✅ Aplicada |

---

## M-001 — Branch `develop`

**Data:** 05/11/2026 · **PR:** nenhum (criação de branch no GitHub)

**Observação.** O repositório só tinha `master`; os PRs #1 a #6 foram direto para ela, e em 04/08/2026 houve três commits diretos sem PR.

**O que entrou.** `develop` criada a partir de `master` (`1b0a1bf`). Todo PR passa a apontar para `develop`; `master` só recebe promoções de `develop` ([MANUAL §3](../10-git-flow/MANUAL.md#3-fluxo-de-desenvolvimento-gitflow)).

**Pendente.** Proteção de branch nas duas (hoje `protected: false`), junto com o CI.

---

## M-002 — Arquivos de backup e log fora do repositório

**Data:** 05/11/2026 · **PR:** #7

**Observação.** `pet-shop-backend/` tinha 7 cópias do `pom.xml` (`.bak`, `.bak2`, `.backup2`, `.backup3`, `.before_fault`, `.notest`, `.test`) e um `dev.log` com a saída de uma execução com POM inválido. Nenhum era usado no build.

**O que entrou.** Arquivos removidos; `.gitignore` com `*.log` e `pom.xml.*`.

---

## M-003 — Documentação a partir do código

**Data:** 05/11/2026 · **PR:** #8

**Observação.** A documentação vivia só no vault Obsidian, desatualizada: branch ativa já mergeada, ADRs marcados como aceitos sem implementação, dois ADR-003, arquivo vazio referenciado por 9 notas.

**O que entrou.** README na raiz e `Documentos/` com visão, regras, arquitetura, API, roadmap, débitos técnicos, De-Para e ADRs, cada um conferido no código. Débitos novos encontrados nessa leitura: `POST /api/agendamentos` aceita horário fora de 9h–18h (DT-02), reserva não atômica (DT-03), ausência de CI (DT-07).

---

## M-004 — `Documentos/` no padrão do Saúde Monitor

**Data:** 05/11/2026 · **PR:** #9

**Observação do PO.**

> "vamos crie uma pasta Documentos/ na pasta do projeto, para não ficarmos dependentes somente do Obsidian, as melhorias devem ser documentados em um arquivo MELHORIAS.md e deve haver um HISTORICO.md, seguindo a mesma estrutura de arquivos e gitflow de D:\saude-monitor"

**O que entrou.**

- Pastas numeradas como no Saúde Monitor: `01-negocio`, `02-arquitetura-tecnica`, `04-backlog`, `08-analise-tecnica`, `09-melhoria-continua`, `10-git-flow`, `_historico`. Números sem conteúdo ainda (`03-ui-ux`, `05-features`, `06-sprints`, `07-dados`, `11-desempenho`, `12-seguranca`, `13-marketing`) ficam reservados e só são criados quando houver documento.
- `00-INDICE.md` com o índice e o registro de revisões no topo.
- Visão do produto e regras de negócio unidas em `Documento-Negocial-v1.0.md`; os 5 ADRs reunidos em `adrs.md`; guia do ambiente local separado do manual.
- `MANUAL.md` com o mesmo git-flow do Saúde Monitor (`feature/* → develop → master → release/<tag>`), marcando o que ainda não existe (ambientes, CI/CD, proteção de branch).
- Este `MELHORIAS.md` e o [`HISTORICO.md`](../_historico/HISTORICO.md).

**Diferença em relação ao Saúde Monitor.** A pasta de análise técnica usa `08-analise-tecnica` (com hífen) em vez de `08-analise tecnica` (com espaço), para evitar caminhos com espaço em links e scripts.
