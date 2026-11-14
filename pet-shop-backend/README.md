# Backend — Pertim

API REST do Pertim. Quarkus 3.15 (Java 17), MongoDB via JNoSQL, autenticação JWT RS256 e notificações em tempo real por SSE.

> Esta é a implementação atual (um único petshop). A reescrita em Kotlin com Quarkus e Panache Kotlin está decidida no [ADR-006](../Documentos/08-analise-tecnica/adrs.md); o que o sistema deve fazer está no [Documento Negocial](../Documentos/01-negocio/Documento-Negocial-v2.0.md).

## Pré-requisitos

- Java 17 e Maven 3.9+
- MongoDB em `localhost:27017` (ou Docker)
- Par de chaves RSA para o JWT:

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

Na raiz do repositório, copie `.env.example` para `.env` e cole as chaves. Arquivos `.pem` e `.env` não são versionados.

## Rodando

```bash
mvn quarkus:dev          # API em http://localhost:8080, OpenAPI em /q/openapi
```

Com Docker, a partir da raiz do repositório:

```bash
docker compose up -d --build                              # MongoDB + backend + frontend
docker compose -f docker-compose.dev.yml up -d --build    # com hot reload
```

## Testes

```bash
mvn test
```

## Mais informações

- [Arquitetura](../Documentos/02-arquitetura-tecnica/Arquitetura-v1.0.md)
- [Especificação da API](../Documentos/02-arquitetura-tecnica/Especificacao-API-v1.0.md)
- [Guia do ambiente local](../Documentos/02-arquitetura-tecnica/Guia-Ambiente-Local-v1.0.md)
- [Manual do desenvolvedor](../Documentos/10-git-flow/MANUAL.md)
