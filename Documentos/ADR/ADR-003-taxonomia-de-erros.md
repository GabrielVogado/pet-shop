# ADR-003: Taxonomia de erros da API

- **Status:** Proposto, não implementado
- **Data:** 01/08/2026 (revisado em 05/11/2026)

## Contexto

Os services lançam `ApiException`, que fica em `infrastructure/web/exception` e carrega status HTTP. A camada de aplicação conhece detalhes de HTTP.

## Decisão proposta

1. Mover `ApiException` para `shared/exception`.
2. Depois, criar exceções de domínio sem HTTP (`NotFound`, `Forbidden`, `Conflict`, `BusinessRule`) e mapear para status no `ApiExceptionMapper`.
3. Padronizar o corpo de erro com código estável, mensagem e campo, para o app mobile tratar erros sem depender do texto.

## Situação em 05/11/2026

Nenhuma fase aplicada: `ApiException` continua em `infrastructure/web/exception`. O item 3 ganha importância com o app mobile (Épico 3).
