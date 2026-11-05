# ADR-001: Services injetam os repositórios Mongo diretamente

- **Status:** Aceito, implementado
- **Data:** 01/08/2026 (revisado em 05/11/2026)

## Contexto

A migração para Clean Architecture (PR #4) criou seis interfaces em `application/port/`, cada uma com uma única implementação Mongo. Elas só repassavam chamadas e não havia plano de trocar o banco.

## Decisão

Remover as interfaces de port. Os services em `application/service` injetam diretamente as classes `Mongo*Repository` de `infrastructure/persistence`.

## Consequências

- Menos código e menos indireção.
- A camada `application` depende de `infrastructure`. Se um dia houver segundo banco ou testes que precisem de dublês sem Mockito, as interfaces voltam.
- Verificado em 05/11/2026: não existe `application/port/` e os services usam `Mongo*Repository`.
