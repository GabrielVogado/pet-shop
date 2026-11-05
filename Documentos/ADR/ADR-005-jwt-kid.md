# ADR-005: `kid` no header do JWT para rotação de chaves

- **Status:** Aceito, implementado
- **Data:** 01/08/2026 (renumerado em 05/11/2026; antes era um segundo "ADR-003")

## Contexto

Sem identificador de chave no token, trocar o par RSA invalida todas as sessões de uma vez e não permite ter duas chaves válidas durante a transição.

## Decisão

`JwtTokenProvider` assina com `.jws().keyId(...)`, lendo `petcare.jwt.kid` (padrão `petcare-rsa-key`).

## Consequências

- Permite rotação gradual quando a verificação passar a aceitar mais de uma chave pública (JWKS).
- Hoje a verificação usa uma única `JWT_PUBLIC_KEY`; a rotação com duas chaves ainda não está implementada.
