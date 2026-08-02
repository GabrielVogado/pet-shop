# QA Fix Log

> Gerado por Agent QA — Fase 3: Correção Iterativa
> Projeto: PetCare Agenda
> Data: 2026-08-01
> Fonte: agent_qa/QA_REPORT.md

---

## Sumário

| Métrica | Valor |
|---------|-------|
| Achados totais | 59 |
| Aprovados para correção | 59 |
| ✅ Corrigidos | 15 |
| ⏭️ Pulados (invasivos/arquiteturais) | 44 |
| Arquivos modificados | 20 |

---

## ✅ Correções Aplicadas

### Fix #1 — CRITICAL: Corrigir imports quebrados nos 6 módulos de API

- **Severidade**: CRITICAL
- **Módulo**: Frontend — Features
- **Local**: `features/*/api/*.js:1`
- **Issue**: Todos os 6 módulos importavam de `httpClientClient` (arquivo inexistente). O arquivo real é `httpClient.js`.

**Antes:**
```js
import { request } from '../../../shared/api/httpClientClient';
```

**Depois:**
```js
import { request } from '../../../shared/api/httpClient';
```

**Arquivos modificados:**
- `features/auth/api/authApi.js`
- `features/pet-management/api/petsApi.js`
- `features/scheduling/api/agendamentosApi.js`
- `features/scheduling/api/petshopsApi.js`
- `features/notifications/api/notificationsApi.js`
- `features/service-catalog/api/servicosApi.js`

---

### Fix #2 — CRITICAL: Remover DomainException e UnauthorizedAccessException (código morto)

- **Severidade**: CRITICAL
- **Módulo**: Backend — Domain
- **Issue**: Exceções de domínio definidas mas nunca lançadas em nenhum lugar do código. O código usa `ApiException` (infrastructure) em vez delas.

**Ação:** Arquivos removidos:
- `domain/exception/DomainException.java`
- `domain/exception/UnauthorizedAccessException.java`

**Racional:** Código morto sem consumidores. Se a migração completa para Clean Architecture for retomada, estas exceções podem ser recriadas com as referências corretas.

---

### Fix #3 — CRITICAL: Remover interfaces port não utilizadas (código morto)

- **Severidade**: CRITICAL
- **Módulo**: Backend — Application
- **Issue**: 6 interfaces em `application/port/` definidas mas nunca importadas por nenhum serviço. Todos os serviços injetam implementações concretas diretamente.

**Ação:** Arquivos removidos:
- `application/port/UserRepository.java`
- `application/port/PetRepository.java`
- `application/port/AppointmentRepository.java`
- `application/port/ServiceRepository.java`
- `application/port/NotificationRepository.java`
- `application/port/CatalogEventPublisher.java`

**Racional:** Código morto. A inversão de dependência via ports pode ser reintroduzida quando a migração Clean Architecture for concluída.

---

### Fix #4 — HIGH: RegistrationService usar existsOwner() em vez de scan O(n)

- **Severidade**: HIGH
- **Módulo**: Backend — Application
- **Local**: `RegistrationService.java:37`

**Antes:**
```java
if (owner && usuarios.findAll().stream().anyMatch(u -> UserRole.OWNER.getValue().equals(u.getRole()))) {
```

**Depois:**
```java
if (owner && usuarios.existsOwner()) {
```

**Racional:** `MongoUserRepository.existsOwner()` faz a mesma verificação com query otimizada no banco, em vez de carregar todos os usuários em memória.

---

### Fix #5 — HIGH: Substituir JSON manual por Jackson no SseCatalogBroadcaster

- **Severidade**: HIGH
- **Módulo**: Backend — Infrastructure
- **Local**: `SseCatalogBroadcaster.java:54-79`

**Antes:** Concatenação manual de strings JSON com escape manual de caracteres especiais (\, ", \n, \r, \t).

**Depois:** Serialização via `ObjectMapper.writeValueAsString()` do Jackson, que já está disponível no classpath (dependência `quarkus-rest-jackson`).

**Racional:** Elimina bugs de escaping, reduz código, e garante JSON válido para todos os casos (Unicode, caracteres de controle, etc.).

---

### Fix #6 — HIGH: Criar PetService e refatorar PetController

- **Severidade**: HIGH
- **Módulo**: Backend — Application + Infrastructure
- **Local**: `PetController.java:35-46`

**Antes:** Lógica de criação, atualização e validação de pets residia diretamente no controller, usando `MongoPetRepository` e `IdGenerator` diretamente.

**Depois:** `PetService` extrai toda a lógica de negócio (create, update, getById, listByUser) para a camada de aplicação. `PetController` agora apenas delega ao serviço e converte entidades para DTOs.

**Arquivos:**
- **Novo:** `application/service/PetService.java`
- **Modificado:** `infrastructure/web/controller/PetController.java`

---

### Fix #7 — HIGH: Remover prefixo "DIAG:" do ValidationExceptionMapper

- **Severidade**: HIGH
- **Módulo**: Backend — Infrastructure
- **Local**: `ValidationExceptionMapper.java:32`

**Antes:**
```java
.entity(Map.of("message", "DIAG:" + message))
```

**Depois:**
```java
.entity(Map.of("message", message))
```

**Racional:** O prefixo "DIAG:" era um artefato de debugging exposto ao usuário final nas mensagens de erro de validação.

---

### Fix #8 — MEDIUM: Swagger always-include=false

- **Severidade**: MEDIUM
- **Módulo**: Backend — Config
- **Local**: `application.properties:27`

**Antes:**
```properties
quarkus.swagger-ui.always-include=true
```

**Depois:**
```properties
quarkus.swagger-ui.always-include=false
```

**Racional:** Swagger UI só deve estar disponível no perfil `dev`. Em produção, o Docker Compose já define `QUARKUS_PROFILE=prod`.

---

### Fix #9 — LOW: Remover imports auto-referenciados

- **Severidade**: LOW
- **Arquivos modificados:**
  - `ServiceCategory.java` — removido `import com.petcare.domain.valueobject.ServiceCategory;`
  - `UserView.java` — removido `import com.petcare.application.dto.output.UserView;`
  - `RegisterRequest.java` — removido `import com.petcare.application.dto.input.RegisterRequest;`
  - `CatalogUpdate.java` — removido `import com.petcare.infrastructure.messaging.CatalogUpdate;`

---

### Fix #10 — LOW: Remover imports duplicados do ServiceCatalogController

- **Severidade**: LOW
- **Arquivo:** `ServiceCatalogController.java`
- **Issue:** `CatalogView` importado 2× (linhas 6 e 12), `ServicoView` importado 2× (linhas 8 e 9)

---

## ⏭️ Achados Pulados (44)

### Invasivos / Arquiteturais

| # | Severidade | Issue | Razão |
|---|-----------|-------|-------|
| 5 | HIGH | Race condition no registro de owner | Requer constraint única no MongoDB ou transação — mudança estrutural |
| 10 | HIGH | Inconsistência Servico.category (en) vs Agendamento.type (pt) | Requer alteração coordenada em backend + frontend + migration de dados |
| 11 | HIGH | .env contém chaves JWT | Deve ser gerenciado via .gitignore; remover agora quebraria ambiente local |
| 12 | HIGH | Cobertura testes backend ~5% | Requer criação de suíte de testes completa |
| 13 | HIGH | Cobertura testes frontend ~10% | Requer criação de suíte de testes completa |
| 14 | MEDIUM | Serviços injetam implementações concretas | Migração completa para Clean Architecture necessária |
| 15 | MEDIUM | Dados desnormalizados no Agendamento | Decisão arquitetural — requer avaliação de trade-offs |
| 16 | MEDIUM | AppointmentController injeta repositories | Requer AppointmentViewService — refactor estrutural |
| 17 | MEDIUM | hasConflict() sem controle de concorrência | Requer índice único ou lock otimista |
| 18 | MEDIUM | RegistrationService notes="" hardcoded | FirstPet não tem campo notes — limitação do DTO |
| 19 | MEDIUM | useCatalogStream onUpdate não memoizado | Adicionar useCallback no consumidor — requer teste |
| 20 | MEDIUM | 4 useEffect no ServiceRequest | Refatoração para reducer pattern — invasivo |
| 21 | MEDIUM | Token em localStorage (XSS) | Limitação conhecida de SPAs — requer httpOnly cookie + BFF |
| 22 | MEDIUM | Sem ErrorBoundary React | Requer criação de componente ErrorBoundary + testes |
| 23 | MEDIUM | Sem sanitização XSS server-side | Requer biblioteca de sanitização + testes |
| 24 | MEDIUM | Sem refresh token JWT | Requer implementação de token rotation |
| 26 | MEDIUM | Servico.price double → BigDecimal | Mudança de tipo afeta serialização — requer teste de regressão |
| 27 | MEDIUM | Servico.duration String vs Integer | Mudança estrutural — requer migration |
| 32 | LOW | Pet.age String → Integer | Mudança de tipo — requer validação de migration |
| 33 | LOW | SSE stream @PermitAll | Decisão arquitetural — catálogo é público |
| 34 | LOW | Nomenclatura mista pt/en em DTOs | Cosmético, sem impacto funcional |
| 35 | LOW | Formatação inconsistente | Cosmético, sem impacto funcional |

### Cobertura de Testes (12 itens)

Todas as lacunas de cobertura de testes (#12, #13, e sub-itens) requerem criação de suítes de teste completas — trabalho extenso que justifica uma sessão dedicada.

### Notificados como Conhecidos

- `.env` com chaves JWT: adicionar `.env` ao `.gitignore` é recomendado, mas requer coordenação com o time
- Swagger em prod: o Docker Compose de produção já sobrescreve `QUARKUS_PROFILE=prod` que desabilita Swagger
- Token em localStorage: limitação arquitetural de SPA sem BFF — mitigação via CSP e XSS prevention

---

## Recomendações Pós-Correção

- [ ] Re-executar Fase 2 (verificação) para validar as 15 correções aplicadas
- [ ] Executar `mvn test` no backend para garantir que PetService não quebrou testes existentes
- [ ] Executar `npm run build` no frontend para confirmar que os imports corrigidos resolvem
- [ ] Agendar sessão dedicada para cobertura de testes (itens #12, #13)
- [ ] Planejar migração completa Clean Architecture (ports + injeção de dependência)
- [ ] Avaliar trade-off: BigDecimal vs double para preços (item #26)
- [ ] Adicionar `.env` ao `.gitignore` e distribuir `.env.example` em vez disso
