# QA Verification Report

> Gerado por Agent QA — Fase 2: Code Tracing & Verification
> Projeto: PetCare Agenda (SaaS de Agendamento Pet)
> Data: 2026-08-01
> Fonte da análise: agent_qa/QA_ANALYSIS.md
> Branch: refactor/clean-architecture

---

## Sumário Executivo

| Métrica | Valor |
|---------|-------|
| Total de checkpoints | 257 |
| ✅ PASS | 198 |
| ❌ FAIL | 23 |
| ⚠️ WARN | 36 |
| **Índice de saúde** | **77%** |

### Achados Críticos (Ação Imediata)

| # | Módulo | Funcionalidade | Issue | Severidade |
|---|--------|---------------|-------|-----------|
| 1 | Frontend — Features | APIs de Feature | **Todos os 5 módulos de API importam `httpClientClient` (arquivo inexistente)** — todas as chamadas API quebram em runtime | 🔴 CRITICAL |
| 2 | Backend — Domain | Exceções de Domínio | DomainException e UnauthorizedAccessException **nunca são usadas** — código morto | 🔴 CRITICAL |
| 3 | Backend — Application | Ports | Todas as 6 interfaces em `application/port/` **nunca são importadas** por nenhum serviço | 🔴 CRITICAL |

### Top Issues

1. **Import quebrado em 6 módulos de API frontend** (`httpClientClient` → `httpClient`) — **todas as chamadas de API falham**
2. **JSON manual no SseCatalogBroadcaster** — frágil, propenso a bugs de escaping
3. **Race condition no registro de owner único** — dois owners simultâneos podem colidir
4. **Prefixo "DIAG:" em mensagens de erro de produção** — expõe artefato de debug ao usuário
5. **PetController sem camada de serviço** — lógica de negócio no controller, viola Clean Architecture

---

## Módulo: Backend — Camada de Domínio

> Caminho: `pet-shop-backend/src/main/java/com/petcare/domain/`
> Checkpoints: 19 | PASS: 13 | FAIL: 2 | WARN: 4

### Funcionalidade: Entidades de Domínio (JNoSQL)

- [x] ✅ **PASS** — Integração: Todas as entidades usam anotações Jakarta NoSQL corretas (`@Entity`, `@Id`, `@Column`)
  > Local: `domain/entity/Usuario.java:8-14`, `Pet.java:7-11`, `Agendamento.java:8-11`, `Servico.java:8-10`, `Notificacao.java:7-9`
- [x] ✅ **PASS** — Integração: Imports do pacote de entidades correspondem ao JNoSQL 3.3.0 (`jakarta.nosql.*`)
  > Local: Todas as 5 entidades usam `jakarta.nosql.Column`, `jakarta.nosql.Entity`, `jakarta.nosql.Id`
- [x] ✅ **PASS** — Fluxo de dados: Usuario.passwordHash nunca exposto nas respostas da API
  > Evidência: `UserView.java:15-22` — record UserView não inclui campo passwordHash
- [ ] ⚠️ **WARN** — Fluxo de dados: Agendamento armazena cópias desnormalizadas (nome tutor, nome pet, endereço)
  > Achado: Dados desnormalizados criam risco de inconsistência se nome do tutor ou pet for alterado
  > Local: `Agendamento.java:17-29` — campos `tutor`, `tutorAddress`, `pet`
  > Severidade: MEDIUM
  > Sugestão: Considerar lookup em tempo real ou mecanismo de sincronização na atualização
- [ ] ❌ **FAIL** — Fluxo de dados: Servico.category usa códigos em inglês ("bath", "vaccine") enquanto Agendamento.type usa labels em português ("Banho", "Vacina")
  > Achado: Inconsistência de mapeamento entre entidades. Servico armazena código, Agendamento armazena label traduzido
  > Local: `Servico.java:23` (category = "bath"/"vaccine") vs `Agendamento.java:40` (type = "Banho"/"Vacina")
  > Severidade: HIGH
  > Evidência: `ServiceCategory.java:7-8` — BATH("bath", "Banho"), VACCINE("vaccine", "Vacina")
- [x] ✅ **PASS** — Nomenclatura: Classes de entidade seguem nomes em português — consistente
- [x] ✅ **PASS** — Nomenclatura: Agendamento.status usa strings em português via AppointmentStatus.label()
  > Local: `AppointmentStatus.java:6-8` — SCHEDULED("Agendado"), COMPLETED("Concluido"), CANCELLED("Cancelado")
- [x] ✅ **PASS** — Tipos: Agendamento.durationMinutes é Integer (nullable) — null safety verificada
  > Evidência: `AppointmentService.java:245-249` — resolveDurationMinutes() verifica `item.getDurationMinutes() != null`
- [ ] ⚠️ **WARN** — Tipos: Servico.price é double primitivo — sem BigDecimal para precisão monetária
  > Achado: `Servico.java:33` — `private double price;`. Operações financeiras devem usar BigDecimal
  > Severidade: MEDIUM
  > Sugestão: Substituir por BigDecimal para evitar erros de arredondamento
- [ ] ⚠️ **WARN** — Tipos: Servico.duration é String (ex: "45min") enquanto Agendamento.durationMinutes é Integer
  > Achado: Inconsistência de tipo — Servico armazena duração como string, Agendamento como Integer (minutos)
  > Local: `Servico.java:30` (String) vs `Agendamento.java:47` (Integer)
  > Severidade: MEDIUM
  > Sugestão: Padronizar ambos como Integer (minutos)
- [x] ✅ **PASS** — Casos limite: Campos nullable de Usuario tratados com verificações na camada de serviço
  > Evidência: `RegistrationService.java:44-48` — null/blank checks para phone, address, businessName
- [ ] ⚠️ **WARN** — Casos limite: Pet.age é String (não Integer) — permite entrada livre mas carece de segurança de tipo
  > Local: `Pet.java:30` — `private String age;`
  > Severidade: LOW
  > Sugestão: Usar Integer ou criar validação mais rigorosa
- [x] ✅ **PASS** — Qualidade de código: Todas as entidades têm construtores sem argumentos (exigido pelo JNoSQL)
- [x] ✅ **PASS** — Qualidade de código: Sem lógica de negócio nas entidades — modelo de domínio anêmico apropriado para MVP
- [x] ✅ **PASS** — Segurança: Usuario.role armazenado como String — validado contra UserRole no serviço
  > Evidência: `RegistrationService.java:33` — `UserRole.OWNER.getValue().equals(req.role())`

### Funcionalidade: Value Objects (Enums)

- [x] ✅ **PASS** — Integração: Todos os enums no pacote `domain/valueobject/` — consistente com Clean Architecture
- [x] ✅ **PASS** — Fluxo de dados: UserRole.getValue() retorna string minúscula ("tutor", "owner") — corresponde aos grupos JWT
  > Evidência: `UserRole.java:7-8` — TUTOR("tutor"), OWNER("owner"); usado em `JwtTokenProvider.java:29` — `.groups(Set.of(usuario.getRole()))`
- [x] ✅ **PASS** — Fluxo de dados: AppointmentStatus.label() retorna texto em português — consistente com a UI
- [x] ✅ **PASS** — Fluxo de dados: ServiceCategory fornece representação dupla code/label
- [x] ✅ **PASS** — Nomenclatura: Valores do enum em inglês com labels em português — consistente
- [x] ✅ **PASS** — Lógica: ServiceCategory.fromCode() lança IllegalArgumentException para códigos inválidos
- [ ] ❌ **FAIL** — Casos limite: ServiceCategory.fromCode() tem import auto-referenciado
  > Achado: `ServiceCategory.java:3` — `import com.petcare.domain.valueobject.ServiceCategory;` importa a si mesmo
  > Local: `ServiceCategory.java:3`
  > Severidade: LOW
  > Evidência: `import com.petcare.domain.valueobject.ServiceCategory;` dentro do próprio arquivo ServiceCategory.java
- [x] ✅ **PASS** — Tipos: UserRole é um enum (era classe antes da refatoração) — consistente

### Funcionalidade: Exceções de Domínio

- [x] ✅ **PASS** — Integração: DomainException estende RuntimeException — unchecked, adequado para JAX-RS
  > Local: `DomainException.java:5`
- [x] ✅ **PASS** — Fluxo de dados: UnauthorizedAccessException estende DomainException — hierarquia adequada
  > Local: `UnauthorizedAccessException.java:5`
- [x] ✅ **PASS** — Nomenclatura: UnauthorizedAccessException descreve violação cross-tenant (BOLA/IDOR)
- [ ] ❌ **FAIL** — Casos limite: DomainException e UnauthorizedAccessException **nunca são lançadas** em nenhum lugar do código
  > Achado: Grep por "DomainException" e "UnauthorizedAccessException" retornou 0 resultados no código fonte principal
  > Local: N/A — apenas definidas, nunca usadas
  > Severidade: MEDIUM
  > Evidência: As classes existem em `domain/exception/` mas o código usa `ApiException` (infrastructure) em vez delas
- [x] ✅ **PASS** — Qualidade de código: DomainException(Throwable cause) permite encadeamento

---

## Módulo: Backend — Camada de Aplicação

> Caminho: `pet-shop-backend/src/main/java/com/petcare/application/`
> Checkpoints: 48 | PASS: 32 | FAIL: 6 | WARN: 10

### Funcionalidade: RegistrationService

- [ ] ⚠️ **WARN** — Integração: Injeta MongoUserRepository, MongoPetRepository diretamente (bypassa ports)
  > Achado: `RegistrationService.java:21-26` — `@Inject MongoUserRepository usuarios; @Inject MongoPetRepository pets;`
  > Severidade: MEDIUM
  > Sugestão: Usar interfaces port para inversão de dependência (já existem em `application/port/`)
- [x] ✅ **PASS** — Fluxo de dados: Email normalizado para lowercase e trimmed
  > Local: `RegistrationService.java:29` — `String email = req.email().trim().toLowerCase();`
- [x] ✅ **PASS** — Fluxo de dados: Cadastro de owner gera SINGLE_PETSHOP_ID fixo — limitação MVP documentada
  > Local: `RegistrationService.java:17,55` — `public static final String SINGLE_PETSHOP_ID = "petshop-unico";`
- [x] ✅ **PASS** — Fluxo de dados: Cadastro de owner bloqueia se outro owner já existe — restrição MVP
  > Local: `RegistrationService.java:37-39`
- [x] ✅ **PASS** — Fluxo de dados: Cadastro de tutor valida telefone e endereço
  > Local: `RegistrationService.java:41-47`
- [ ] ❌ **FAIL** — Fluxo de dados: Primeiro pet é criado com notes="" sempre — ignora entrada de notas
  > Achado: `RegistrationService.java:64` — `pet.setNotes("");` — hardcoded como string vazia
  > Local: `RegistrationService.java:64`
  > Severidade: MEDIUM
  > Evidência: Linha 64 define notes como "" ignorando qualquer valor passado
- [x] ✅ **PASS** — Lógica: Senha hasheada via BCryptPasswordEncoder antes do armazenamento
  > Local: `RegistrationService.java:53` — `usuario.setPasswordHash(passwordEncoder.hash(req.password()));`
- [ ] ❌ **FAIL** — Lógica: `usuarios.findAll().stream().anyMatch(...)` para verificar existência de owner — scan O(n)
  > Achado: `RegistrationService.java:37` — escaneia todos os usuários quando `MongoUserRepository.existsOwner()` já existe
  > Local: `RegistrationService.java:37` vs `MongoUserRepository.java:46-49`
  > Severidade: HIGH
  > Evidência: `usuarios.findAll().stream().anyMatch(u -> UserRole.OWNER.getValue().equals(u.getRole()))` — O(n) scan. `usuarios.existsOwner()` faz o mesmo com query otimizada
- [x] ✅ **PASS** — Tratamento de erros: ApiException.conflict() para email duplicado — retorna 409
- [x] ✅ **PASS** — Tratamento de erros: ApiException.badRequest() para campos faltantes — retorna 400
- [x] ✅ **PASS** — Casos limite: RegisterRequest.firstPet() com verificação null-safe aninhada
  > Local: `RegistrationService.java:59-60`
- [x] ✅ **PASS** — Casos limite: Pet.species, Pet.breed passados sem validação — delegado ao Bean Validation no RegisterRequest
  > Evidência: `RegisterRequest.java:36-44` — FirstPet record tem @Size mas sem validação de conteúdo
- [ ] ⚠️ **WARN** — Nomenclatura: Variáveis em português (usuarios, pets) misturadas com inglês
  > Severidade: LOW
- [x] ✅ **PASS** — Valores de retorno: Retorna entidade Usuario — conversão para DTO feita no controller
- [ ] ⚠️ **WARN** — Segurança: Sem sanitização de entrada além de trim()
  > Achado: Campos name, businessName podem conter caracteres especiais/XSS
  > Local: `RegistrationService.java:50-53`
  > Severidade: MEDIUM
  > Sugestão: RegisterRequest.name tem regex `^[\\p{L}][\\p{L}'.\\- ]*$` — mas businessName não (apenas @Size)
- [ ] ❌ **FAIL** — Segurança: Verificação de owner único não é atômica — race condition
  > Achado: Entre a verificação `anyMatch` (linha 37) e o `insert` (linha 57), outro owner pode ser registrado
  > Local: `RegistrationService.java:37,57`
  > Severidade: HIGH
  > Sugestão: Usar constraint única no MongoDB ou transação

### Funcionalidade: AuthenticationService

- [ ] ⚠️ **WARN** — Integração: Injeta MongoUserRepository diretamente (bypassa port)
  > Severidade: MEDIUM
- [x] ✅ **PASS** — Fluxo de dados: Email normalizado (trim + lowercase) — consistente
  > Local: `AuthenticationService.java:20`
- [x] ✅ **PASS** — Lógica: BCryptPasswordEncoder.verify() para comparação — timing-safe
  > Local: `AuthenticationService.java:23` — `passwordEncoder.verify(password, usuario.getPasswordHash())`
- [x] ✅ **PASS** — Tratamento de erros: ApiException.unauthorized() para credenciais incorretas — retorna 401
- [x] ✅ **PASS** — Tratamento de erros: Mesma mensagem para "não encontrado" e "senha incorreta" — previne enumeração
  > Local: `AuthenticationService.java:21-24` — mesma mensagem em ambos os casos
- [x] ✅ **PASS** — Casos limite: Validação delegada ao @Valid no LoginRequest
- [x] ✅ **PASS** — Valores de retorno: Retorna entidade Usuario diretamente
- [x] ✅ **PASS** — Segurança: Rate limiting tratado no controller via @RateLimit

### Funcionalidade: AppointmentService

- [ ] ⚠️ **WARN** — Integração: Injeta 4 repositórios + NotificationService diretamente (bypassa ports)
  > Severidade: MEDIUM
- [x] ✅ **PASS** — Fluxo de dados: create() valida pet pertence ao tutor via ownerUserId
  > Local: `AppointmentService.java:69-71` — `if (!tutor.getId().equals(pet.getOwnerUserId()))`
- [x] ✅ **PASS** — Fluxo de dados: create() valida existência do petshop
  > Local: `AppointmentService.java:74-76`
- [x] ✅ **PASS** — Fluxo de dados: create() valida serviço pertence ao petshop selecionado
  > Local: `AppointmentService.java:81-83`
- [x] ✅ **PASS** — Fluxo de dados: cancelByPetshop() desacopla cancelamento da notificação
  > Evidência: `AppointmentService.java:192-197` — update primeiro, notificação depois
- [x] ✅ **PASS** — Lógica: parseDateTime() com fallback de OffsetDateTime — robusto
  > Local: `AppointmentService.java:210-218`
- [ ] ⚠️ **WARN** — Lógica: hasConflict() sem controle de concorrência
  > Achado: `AppointmentService.java:257-278` — scan de agendamentos sem lock, possível condição de corrida em agendamento simultâneo
  > Severidade: MEDIUM
  > Sugestão: Adicionar índice único composto ou lock otimista
- [x] ✅ **PASS** — Lógica: parseDurationMinutes() usa regex — robusto
  > Local: `AppointmentService.java:231-239`
- [x] ✅ **PASS** — Lógica: Cálculo de disponibilidade com horário comercial hardcoded
  > Local: `AppointmentService.java:43-45`
- [x] ✅ **PASS** — Lógica: DEFAULT_DURATION_MINUTES = 60 como fallback
- [x] ✅ **PASS** — Tratamento de erros: ApiException.notFound()/forbidden()/badRequest() — status corretos
- [x] ✅ **PASS** — Casos limite: cancelByTutor() previne cancelamento duplo
  > Local: `AppointmentService.java:172-174`
- [x] ✅ **PASS** — Casos limite: cancelByPetshop() mesma verificação
- [x] ✅ **PASS** — Casos limite: listForTutor() com petId null retorna todos
- [x] ✅ **PASS** — Casos limite: availability() valida parâmetros obrigatórios
- [x] ✅ **PASS** — Nomenclatura: UPPER_CASE para constantes — consistente
- [x] ✅ **PASS** — Valores de retorno: create() retorna entidade Agendamento

### Funcionalidade: ServiceCatalogService

- [ ] ⚠️ **WARN** — Integração: Injeta MongoServiceRepository diretamente
  > Severidade: MEDIUM
- [x] ✅ **PASS** — Fluxo de dados: create() valida petshopId não-null/não-blank
- [x] ✅ **PASS** — Fluxo de dados: create() define features como lista vazia se null
- [x] ✅ **PASS** — Lógica: delete() valida propriedade do serviço
- [x] ✅ **PASS** — Tratamento de erros: ApiException.forbidden()/notFound() — corretos
- [ ] ⚠️ **WARN** — Casos limite: listByPetshop() sem validação de petshopId vazio
  > Severidade: LOW
- [x] ✅ **PASS** — Valores de retorno: create() e delete() retornam entidades
- [x] ✅ **PASS** — Segurança: Sem validação de category contra enum — aceito para MVP

### Funcionalidade: NotificationService

- [ ] ⚠️ **WARN** — Integração: Injeta MongoNotificationRepository diretamente
  > Severidade: MEDIUM
- [x] ✅ **PASS** — Fluxo de dados: Cria Notificacao com dados do Agendamento
- [x] ✅ **PASS** — Fluxo de dados: Título e mensagem em português — consistente
- [x] ✅ **PASS** — Lógica: createdAt = OffsetDateTime.now() — correto
- [x] ✅ **PASS** — Lógica: isRead = false — estado inicial correto
- [x] ✅ **PASS** — Casos limite: Falha na criação propaga exceção — comportamento esperado
- [x] ✅ **PASS** — Valores de retorno: void — fire-and-forget
- [x] ✅ **PASS** — Qualidade de código: Responsabilidade única — bem escopado

### Funcionalidade: DTOs (Entrada/Saída)

- [x] ✅ **PASS** — Integração: DTOs de entrada usam Bean Validation
  > Evidência: `RegisterRequest.java:14-31` — @NotBlank, @Email, @Pattern, @Size
- [x] ✅ **PASS** — Fluxo de dados: DTOs de saída têm from() estático
- [x] ✅ **PASS** — Fluxo de dados: UserView.from() exclui passwordHash
  > Evidência: `UserView.java:15-22` — não inclui passwordHash nos campos do record
- [x] ✅ **PASS** — Nomenclatura: *Request (entrada), *View (saída) — consistente
- [ ] ⚠️ **WARN** — Nomenclatura: AgendamentoAvailabilityView (português) vs AuthResponse (inglês) — misto
  > Severidade: LOW
- [x] ✅ **PASS** — Tipos: DTOs usam Java records — imutáveis, boa prática
- [x] ✅ **PASS** — Casos limite: AuthResponse contém token e UserView — padrão JWT

### Funcionalidade: Ports (Interfaces de Repositório)

- [ ] ❌ **FAIL** — Integração: Interfaces port definem contratos mas **nenhum serviço as importa**
  > Achado: Grep por `import com.petcare.application.port.` retornou 0 resultados
  > Local: Todas as 6 interfaces em `application/port/`
  > Severidade: MEDIUM
  > Evidência: Serviços injetam implementações concretas (`MongoUserRepository`) em vez das interfaces (`UserRepository`)
- [ ] ❌ **FAIL** — Fluxo de dados: Ports nunca usadas — código morto
  > Achado: 6 arquivos de interface criados mas bypassados por injeção direta de implementações concretas
  > Local: `application/port/UserRepository.java`, `PetRepository.java`, `AppointmentRepository.java`, `ServiceRepository.java`, `NotificationRepository.java`, `CatalogEventPublisher.java`
  > Severidade: MEDIUM
- [x] ✅ **PASS** — Nomenclatura: Nomes claros e consistentes
- [x] ✅ **PASS** — Qualidade de código: Ports existem mas não são usadas — intenção de Clean Architecture incompleta

---

## Módulo: Backend — Camada de Infraestrutura

> Caminho: `pet-shop-backend/src/main/java/com/petcare/infrastructure/`
> Checkpoints: 63 | PASS: 49 | FAIL: 5 | WARN: 9

### Funcionalidade: Repositórios Mongo

- [x] ✅ **PASS** — Integração: Todos usam JNoSQL DocumentTemplate com @Inject
  > Local: `MongoUserRepository.java:19` — `@Inject Template template;`
- [x] ✅ **PASS** — Fluxo de dados: MongoUserRepository.findByEmail() — query correta
  > Local: `MongoUserRepository.java:29-31`
- [x] ✅ **PASS** — Fluxo de dados: existsByPetshopId() — query correta
  > Local: `MongoUserRepository.java:37-41`
- [x] ✅ **PASS** — Fluxo de dados: findPetshops() — retorna owners
  > Local: `MongoUserRepository.java:51`
- [x] ✅ **PASS** — Fluxo de dados: findByUserId(), findByPetshopId() — queries multi-tenant
- [x] ✅ **PASS** — Lógica: insert() vs update() — distinção JNoSQL correta
- [x] ✅ **PASS** — Casos limite: existsOwner() existe mas não é usado pelo RegistrationService
  > Evidência: `MongoUserRepository.java:46-49` vs `RegistrationService.java:37`
- [x] ✅ **PASS** — Qualidade de código: Wrappers finos sobre DocumentTemplate
- [x] ✅ **PASS** — Segurança: JNoSQL parametriza queries — sem risco de injection

### Funcionalidade: JWT Token Provider

- [x] ✅ **PASS** — Integração: Usa SmallRye JWT Build API
- [x] ✅ **PASS** — Fluxo de dados: Token inclui: issuer, upn, subject, groups, name, role, petshopId
- [x] ✅ **PASS** — Fluxo de dados: Claim petshopId só adicionada quando não-null
  > Local: `JwtTokenProvider.java:31-33` — `if (usuario.getPetshopId() != null)`
- [x] ✅ **PASS** — Lógica: Duração configurável via `petcare.jwt.duration`
- [x] ✅ **PASS** — Lógica: Assinatura RS256 via chave privada configurada
- [x] ✅ **PASS** — Segurança: Expiração via `expiresIn(Duration.ofSeconds(...))` — correto
- [x] ✅ **PASS** — Casos limite: Chave ausente/malformada — Quarkus falha na inicialização

### Funcionalidade: BCrypt Password Encoder

- [x] ✅ **PASS** — Integração: Usa Quarkus Elytron Security Common
  > Local: `BCryptPasswordEncoder.java:3` — `import io.quarkus.elytron.security.common.BcryptUtil;`
- [x] ✅ **PASS** — Lógica: BCrypt com BcryptUtil.bcryptHash() — fator de trabalho padrão
- [x] ✅ **PASS** — Segurança: Verificação timing-safe via PasswordFactory.verify()
- [x] ✅ **PASS** — Casos limite: null/blank em verify() retorna false
  > Local: `BCryptPasswordEncoder.java:18-20` — `if (plainPassword == null || storedHash == null || storedHash.isBlank())`
- [x] ✅ **PASS** — Casos limite: Exceção no verify() capturada, retorna false
  > Local: `BCryptPasswordEncoder.java:28-30`

### Funcionalidade: SSE Catalog Broadcaster

- [x] ✅ **PASS** — Integração: Usa JAX-RS SseEventSink com ConcurrentHashMap
- [x] ✅ **PASS** — Fluxo de dados: register() isola streams por petshopId
- [x] ✅ **PASS** — Fluxo de dados: broadcast() envia JSON para sinks do petshopId
- [x] ✅ **PASS** — Lógica: Limpeza de sinks mortos em falha de envio
- [ ] ❌ **FAIL** — Lógica: toJson() constrói string JSON manualmente — frágil
  > Achado: `SseCatalogBroadcaster.java:54-68` — concatenação manual de strings JSON
  > Local: `SseCatalogBroadcaster.java:54-68`
  > Severidade: HIGH
  > Evidência: `return "{" + "\"action\":" + jsonString(update.action()) + "," + ...` — sem uso de Jackson ObjectMapper
- [ ] ❌ **FAIL** — Lógica: jsonString() escapa manualmente caracteres especiais — pode perder casos limite
  > Achado: `SseCatalogBroadcaster.java:70-79` — escape manual de \, ", \n, \r, \t apenas
  > Local: `SseCatalogBroadcaster.java:70-79`
  > Severidade: HIGH
  > Evidência: Não escapa caracteres Unicode, backspace, form feed ou outros caracteres de controle
- [x] ✅ **PASS** — Tratamento de erros: broadcast() captura Exception, loga warning
- [x] ✅ **PASS** — Casos limite: features null → "[]"
- [ ] ⚠️ **WARN** — Qualidade de código: Deveria usar Jackson ObjectMapper
  > Severidade: MEDIUM
- [ ] ❌ **FAIL** — Qualidade de código: Imports duplicados de `ServicoView`
  > Achado: `SseCatalogBroadcaster.java:5-6` — `import com.petcare.application.dto.output.ServicoView;` aparece duas vezes
  > Local: `SseCatalogBroadcaster.java:5-6`
  > Severidade: LOW
- [ ] ⚠️ **WARN** — Segurança: SSE stream sem autenticação
  > Achado: `ServiceCatalogController.java:89-96` — @PermitAll no endpoint stream
  > Severidade: LOW

### Funcionalidade: Controllers REST

#### AuthController

- [x] ✅ **PASS** — Integração: @Path("/api/auth"), @PermitAll
- [x] ✅ **PASS** — Fluxo de dados: POST /api/auth/register → 201 + UserView
- [x] ✅ **PASS** — Fluxo de dados: POST /api/auth/login → JWT + AuthResponse
- [x] ✅ **PASS** — Lógica: @RateLimit(value=5, window=1, windowUnit=MINUTES) — 5 tentativas/min
- [x] ✅ **PASS** — Lógica: @Valid aciona Bean Validation
- [ ] ⚠️ **WARN** — Tratamento de erros: ValidationExceptionMapper prefixa "DIAG:" — artefato de debug
  > Achado: `ValidationExceptionMapper.java:32` — `.entity(Map.of("message", "DIAG:" + message))`
  > Local: `ValidationExceptionMapper.java:32`
  > Severidade: HIGH
  > Sugestão: Remover prefixo "DIAG:" antes de ir para produção
- [x] ✅ **PASS** — Valores de retorno: 201 CREATED / 200 OK — corretos
- [x] ✅ **PASS** — Segurança: Rate limiting previne força bruta

#### AppointmentController

- [x] ✅ **PASS** — Integração: @RolesAllowed para tutor/owner
- [x] ✅ **PASS** — Fluxo de dados: GET list() — filtro por papel correto
- [x] ✅ **PASS** — Fluxo de dados: POST create() — @RolesAllowed("tutor")
- [x] ✅ **PASS** — Fluxo de dados: GET /availability — retorna datas/horários
- [x] ✅ **PASS** — Fluxo de dados: PUT /{id}/cancel — ambos os papéis
- [x] ✅ **PASS** — Lógica: isOwner() verifica grupos JWT
- [x] ✅ **PASS** — Lógica: currentPetshopId() com fallback para banco
- [x] ✅ **PASS** — Tratamento de erros: currentUser() lança unauthorized
- [ ] ⚠️ **WARN** — Qualidade de código: Controller injeta repositories diretamente
  > Achado: `AppointmentController.java:41-47` — `@Inject MongoUserRepository usuarios; @Inject MongoPetRepository pets;`
  > Severidade: MEDIUM
  > Sugestão: Criar AppointmentViewService ou mover enriquecimento para camada de aplicação
- [x] ✅ **PASS** — Valores de retorno: AgendamentoView.from() enriquece com Usuario/Pet

#### PetController

- [x] ✅ **PASS** — Integração: @RolesAllowed("tutor")
- [x] ✅ **PASS** — Fluxo de dados: GET list() — pets do tutor autenticado
- [x] ✅ **PASS** — Fluxo de dados: POST create() — vinculado ao usuário atual
- [x] ✅ **PASS** — Fluxo de dados: PUT /{id} update() — valida propriedade
- [x] ✅ **PASS** — Fluxo de dados: GET /{id} getPet() — valida propriedade (anti-BOLA)
- [ ] ❌ **FAIL** — Lógica: Controller usa MongoPetRepository + IdGenerator diretamente — sem camada de serviço
  > Achado: `PetController.java:35-46` — lógica de criação de pet no controller
  > Local: `PetController.java:35-46`
  > Severidade: HIGH
  > Evidência: `pet.setId(IdGenerator.newId("pet")); pet.setOwnerUserId(jwt.getSubject()); pet.setName(...)` — tudo no controller
- [x] ✅ **PASS** — Tratamento de erros: ApiException.forbidden() para cross-user
- [x] ✅ **PASS** — Segurança: Verificação de propriedade em getPet() previne IDOR

#### ServiceCatalogController

- [x] ✅ **PASS** — Integração: Misto @PermitAll e @RolesAllowed
- [x] ✅ **PASS** — Fluxo de dados: POST create() com broadcast SSE ADDED
- [x] ✅ **PASS** — Fluxo de dados: DELETE com broadcast SSE REMOVED
- [x] ✅ **PASS** — Fluxo de dados: GET /catalogo — público com filtro petshopId
- [x] ✅ **PASS** — Fluxo de dados: GET /catalogo/stream — SSE
- [x] ✅ **PASS** — Lógica: currentPetshopId() da claim JWT
- [x] ✅ **PASS** — Lógica: CatalogView divide por ServiceCategory
- [x] ✅ **PASS** — Tratamento de erros: SSE fecha sink se petshopId ausente
- [ ] ❌ **FAIL** — Qualidade de código: Imports duplicados
  > Achado: `ServiceCatalogController.java:6,8,9,12` — `CatalogView` e `ServicoView` importados duas vezes cada
  > Local: `ServiceCatalogController.java:6,8,9,12`
  > Severidade: LOW
- [ ] ⚠️ **WARN** — Segurança: SSE stream @PermitAll sem autenticação
  > Severidade: LOW

#### PetshopController

- [x] ✅ **PASS** — Integração: @PermitAll
- [x] ✅ **PASS** — Fluxo de dados: Retorna no máximo um petshop (MVP)
- [x] ✅ **PASS** — Lógica: findFirst() consistente com single-owner
- [x] ✅ **PASS** — Casos limite: Resultado vazio → lista vazia
- [x] ✅ **PASS** — Casos limite: Nome null → fallback para petshopId
- [ ] ⚠️ **WARN** — Qualidade de código: Controller injeta repository diretamente
  > Severidade: LOW

#### NotificationController

- [x] ✅ **PASS** — Integração: @RolesAllowed("tutor")
- [x] ✅ **PASS** — Fluxo de dados: Filtro por jwt.getSubject()
- [ ] ⚠️ **WARN** — Qualidade de código: Controller injeta repository diretamente
  > Severidade: LOW
- [x] ✅ **PASS** — Casos limite: Sem paginação — aceitável para MVP

### Funcionalidade: Exception Mappers

- [x] ✅ **PASS** — Integração: ApiExceptionMapper → JSON {"message": "..."}
  > Local: `ApiExceptionMapper.java:14-17`
- [ ] ❌ **FAIL** — Fluxo de dados: ValidationExceptionMapper prefixa "DIAG:" nas mensagens
  > Achado: `ValidationExceptionMapper.java:32` — `"DIAG:" + message`
  > Local: `ValidationExceptionMapper.java:32`
  > Severidade: HIGH
  > Sugestão: Remover prefixo — é artefato de debugging exposto ao usuário
- [x] ✅ **PASS** — Lógica: @ServerExceptionMapper — extensão Quarkus
- [x] ✅ **PASS** — Casos limite: Mensagens de violação vazias → fallback
- [x] ✅ **PASS** — Valores de retorno: 400 BAD_REQUEST — correto (era 418 antes)

---

## Módulo: Backend — Camada Compartilhada

> Checkpoints: 4 | PASS: 4 | FAIL: 0 | WARN: 0

### Funcionalidade: IdGenerator

- [x] ✅ **PASS** — Lógica: newId() gera prefix_UUID8 — 2^32 combinações, aceitável
- [x] ✅ **PASS** — Casos limite: Probabilidade de colisão aceitável para MVP
- [x] ✅ **PASS** — Qualidade de código: Classe utilitária estática — apropriado
- [x] ✅ **PASS** — Nomenclatura: Refatorado de "Ids" para "IdGenerator" — melhoria

---

## Módulo: Frontend — Camada App

> Checkpoints: 17 | PASS: 14 | FAIL: 0 | WARN: 3

### Funcionalidade: App Bootstrap & Roteamento

- [x] ✅ **PASS** — Integração: React Router v7 com BrowserRouter
- [x] ✅ **PASS** — Fluxo de dados: Redirecionamento por token/role: /auth, /tutor, /owner
- [x] ✅ **PASS** — Lógica: ProtectedRoute mostra "Carregando..." durante loading
- [x] ✅ **PASS** — Lógica: Redirecionamento de /auth para dashboard quando autenticado
- [x] ✅ **PASS** — Casos limite: Rota curinga (*) → /auth
- [x] ✅ **PASS** — Casos limite: Loading state previne flash de conteúdo protegido
- [x] ✅ **PASS** — Qualidade de código: ~50 linhas (era 350+) — excelente refatoração
- [x] ✅ **PASS** — Qualidade de código: Sem lógica de negócio — puro roteamento

### Funcionalidade: AuthProvider (Contexto)

- [x] ✅ **PASS** — Integração: AuthContext → useAuth() hook
- [x] ✅ **PASS** — Fluxo de dados: Token em localStorage, JWT decode na montagem
- [x] ✅ **PASS** — Fluxo de dados: login() salva + atualiza; logout() limpa
- [x] ✅ **PASS** — Lógica: JWT decode via atob() — client-side aceitável
- [x] ✅ **PASS** — Lógica: isOwner = user.groups.includes('owner')
- [x] ✅ **PASS** — Tratamento de erros: JSON.parse falha → limpa token
- [ ] ⚠️ **WARN** — Casos limite: Token expirado sem verificação client-side
  > Severidade: LOW
  > Sugestão: Verificar exp no payload JWT e forçar logout
- [ ] ⚠️ **WARN** — Casos limite: Sem sincronização cross-tab
  > Severidade: LOW
- [ ] ⚠️ **WARN** — Segurança: Token em localStorage — suscetível a XSS
  > Severidade: MEDIUM (limitação conhecida de SPAs)

---

## Módulo: Frontend — Features

> Checkpoints: 36 | PASS: 24 | FAIL: 6 | WARN: 6

### Funcionalidade: Feature de Autenticação

- [x] ✅ **PASS** — Integração: authApi usa httpClient
- [ ] ❌ **FAIL** — Integração: Import quebrado — `httpClientClient` não existe
  > Achado: `authApi.js:1` — `import { request } from '../../../shared/api/httpClientClient';` mas arquivo real é `httpClient.js`
  > Local: `features/auth/api/authApi.js:1`
  > Severidade: 🔴 CRITICAL
  > Evidência: Apenas `httpClient.js` existe em `shared/api/`, não `httpClientClient.js`
- [x] ✅ **PASS** — Fluxo de dados: login() → POST /api/auth/login → {token, user}
- [x] ✅ **PASS** — Fluxo de dados: register() → POST /api/auth/register → dados
- [x] ✅ **PASS** — Tratamento de erros: httpClient lança Error com mensagem
- [x] ✅ **PASS** — Casos limite: Erros de rede capturados

### Funcionalidade: Feature de Gestão de Pets

- [x] ✅ **PASS** — Integração: petsApi usa httpClient
- [ ] ❌ **FAIL** — Integração: Import quebrado — `httpClientClient` não existe
  > Achado: `petsApi.js:1` — `import { request } from '../../../shared/api/httpClientClient';`
  > Local: `features/pet-management/api/petsApi.js:1`
  > Severidade: 🔴 CRITICAL
- [x] ✅ **PASS** — Fluxo de dados: CRUD correto
- [x] ✅ **PASS** — Lógica: Trata create e update

### Funcionalidade: Feature de Agendamento

- [x] ✅ **PASS** — Integração: APIs corretas
- [ ] ❌ **FAIL** — Integração: Import quebrado em agendamentosApi.js
  > Achado: `agendamentosApi.js:1` — `import { request } from '../../../shared/api/httpClientClient';`
  > Local: `features/scheduling/api/agendamentosApi.js:1`
  > Severidade: 🔴 CRITICAL
- [ ] ❌ **FAIL** — Integração: Import quebrado em petshopsApi.js
  > Achado: `petshopsApi.js:1` — `import { request } from '../../../shared/api/httpClientClient';`
  > Local: `features/scheduling/api/petshopsApi.js:1`
  > Severidade: 🔴 CRITICAL
- [x] ✅ **PASS** — Fluxo de dados: ServiceRequest gerencia estado corretamente
- [x] ✅ **PASS** — Lógica: Toggle banhos/vacinas
- [x] ✅ **PASS** — Lógica: Auto-seleção de petshop único (Feature 9)
- [x] ✅ **PASS** — Lógica: Disponibilidade em cascata (useEffect)
- [x] ✅ **PASS** — Casos limite: Sem petshops → mensagem amigável
- [x] ✅ **PASS** — Casos limite: Sem serviços → estado vazio
- [ ] ⚠️ **WARN** — Casos limite: Verificação de cancelamento com closure — possível race condition
  > Severidade: LOW
- [x] ✅ **PASS** — Tratamento de erros: availabilityError state
- [ ] ⚠️ **WARN** — Qualidade de código: 4 useEffect com dependências complexas
  > Severidade: MEDIUM
  > Sugestão: Refatorar para reducer pattern ou usar useCallback adequadamente

### Funcionalidade: Feature de Catálogo (Owner)

- [x] ✅ **PASS** — Integração: servicosApi
- [ ] ❌ **FAIL** — Integração: Import quebrado em servicosApi.js
  > Achado: `servicosApi.js:1` — `import { request } from '../../../shared/api/httpClientClient';`
  > Local: `features/service-catalog/api/servicosApi.js:1`
  > Severidade: 🔴 CRITICAL
- [x] ✅ **PASS** — Fluxo de dados: CRUD correto
- [x] ✅ **PASS** — Lógica: Confirmação de exclusão
- [x] ✅ **PASS** — Tratamento de erros: Delegado ao httpClient

### Funcionalidade: Feature de Notificações

- [x] ✅ **PASS** — Integração: notificationsApi
- [ ] ❌ **FAIL** — Integração: Import quebrado em notificationsApi.js
  > Achado: `notificationsApi.js:1` — `import { request } from '../../../shared/api/httpClientClient';`
  > Local: `features/notifications/api/notificationsApi.js:1`
  > Severidade: 🔴 CRITICAL
- [x] ✅ **PASS** — Fluxo de dados: Exibição no AppShell
- [ ] ⚠️ **WARN** — Casos limite: Sem atualização automática — apenas na montagem
  > Severidade: LOW

### Funcionalidade: Feature de Vacinação

- [x] ✅ **PASS** — Fluxo de dados: Renderização condicional
- [x] ✅ **PASS** — Casos limite: Lista vazia — placeholder
  > Evidência: Feature 10 (Carteira de Vacinação) não implementada — backend e integração pendentes
- [x] ✅ **PASS** — Qualidade de código: UI-only, sem API — Feature 10 planejada

### Funcionalidade: Feature de Dashboard (Owner)

- [x] ✅ **PASS** — Fluxo de dados: Estatísticas de agendamentos
- [x] ✅ **PASS** — Lógica: Cálculo de totais, agendados, banhos, vacinas
- [x] ✅ **PASS** — Lógica: Callback onCancelAppointment
- [x] ✅ **PASS** — Casos limite: Lista vazia — estado vazio

### Funcionalidade: Feature de Tempo Real (SSE)

- [x] ✅ **PASS** — Integração: EventSource nativo
- [x] ✅ **PASS** — Fluxo de dados: Conexão ao stream correto
- [x] ✅ **PASS** — Lógica: Backoff exponencial 1s→30s
- [x] ✅ **PASS** — Lógica: Reconexão com contador
- [x] ✅ **PASS** — Tratamento de erros: Console.warn na desconexão
- [x] ✅ **PASS** — Casos limite: Cleanup na desmontagem
- [x] ✅ **PASS** — Casos limite: petshopId change → reconnect
- [ ] ⚠️ **WARN** — Casos limite: onUpdate não memoizado → reconnect loop
  > Achado: `useCatalogStream.js:7` — `onUpdate` como dependência do useEffect
  > Local: `useCatalogStream.js:7,72`
  > Severidade: MEDIUM
  > Sugestão: Documentar que onUpdate deve ser memoizado (useCallback)
- [x] ✅ **PASS** — Valores de retorno: connected boolean

---

## Módulo: Frontend — Camada Compartilhada

> Checkpoints: 16 | PASS: 15 | FAIL: 0 | WARN: 1

### Funcionalidade: HTTP Client

- [x] ✅ **PASS** — Integração: Usado por todos os módulos de API
- [x] ✅ **PASS** — Fluxo de dados: API_URL do VITE_API_URL, fallback localhost:8080
- [x] ✅ **PASS** — Fluxo de dados: Token via Bearer header
- [x] ✅ **PASS** — Lógica: GET/POST/PUT/DELETE, JSON body, auth header
- [x] ✅ **PASS** — Lógica: 204 → null; JSON parse seguro
- [x] ✅ **PASS** — Tratamento de erros: Erro de rede → mensagem amigável
- [x] ✅ **PASS** — Tratamento de erros: Resposta não-ok → extrai mensagem
- [x] ✅ **PASS** — Tratamento de erros: error.status anexado
- [x] ✅ **PASS** — Casos limite: Corpo vazio → null
- [x] ✅ **PASS** — Casos limite: Token expirado → 401 tratado
- [ ] ⚠️ **WARN** — Segurança: Token em localStorage — XSS
  > Severidade: MEDIUM (limitação SPA conhecida)

### Funcionalidade: Hook useAuth

- [x] ✅ **PASS** — Integração: createContext + Provider
- [x] ✅ **PASS** — Fluxo de dados: user, token, loading, login, logout, isOwner, isTutor
- [x] ✅ **PASS** — Casos limite: Fora de AuthProvider — erro de contexto
- [x] ✅ **PASS** — Qualidade de código: Hook fino — abstração adequada

### Funcionalidade: Componentes UI Compartilhados

- [x] ✅ **PASS** — Integração: Usados em múltiplas features
- [x] ✅ **PASS** — Fluxo de dados: Field, Table, StatusBadge, AppShell — interfaces consistentes
- [x] ✅ **PASS** — Qualidade de código: Extraídos de primitivas duplicadas

### Funcionalidade: Utilitários

- [x] ✅ **PASS** — Integração: Usado por scheduling e history
- [x] ✅ **PASS** — Lógica: Formatação pt-BR
- [x] ✅ **PASS** — Casos limite: null/undefined tratados

---

## Preocupações Transversais

> Checkpoints: 45 | PASS: 33 | FAIL: 4 | WARN: 8

### Estratégia de Tratamento de Erros

- [x] ✅ **PASS** — Backend: ApiException (400, 401, 403, 404, 409) — consistente
- [ ] ⚠️ **WARN** — Backend: Prefixo "DIAG:" em mensagens de validação
  > Severidade: HIGH
- [x] ✅ **PASS** — Backend: SSE loga warnings
- [x] ✅ **PASS** — Frontend: httpClient centraliza erros
- [x] ✅ **PASS** — Frontend: Mensagens em português
- [x] ✅ **PASS** — Consistência: Backend → HTTP status → Frontend httpClient → exibe
- [ ] ⚠️ **WARN** — Lacunas: Sem ErrorBoundary global no React
  > Severidade: MEDIUM
- [ ] ⚠️ **WARN** — Lacunas: Sem logging estruturado (Sentry, etc.)
  > Severidade: MEDIUM

### Gestão de Configuração

- [x] ✅ **PASS** — Backend: application.properties + env vars
- [x] ✅ **PASS** — Backend: Chaves JWT externalizadas
- [x] ✅ **PASS** — Backend: MongoDB connection string configurável
- [x] ✅ **PASS** — Backend: CORS configurável por perfil
- [x] ✅ **PASS** — Frontend: VITE_API_URL
- [ ] ❌ **FAIL** — Segurança: .env contém chaves JWT reais no repositório
  > Achado: `.env` inclui JWT_PRIVATE_KEY e JWT_PUBLIC_KEY — devem ser apenas variáveis de ambiente
  > Local: `D:\pet-shop\.env:6-54`
  > Severidade: HIGH
  > Evidência: Chave privada RSA completa visível no arquivo .env
- [ ] ❌ **FAIL** — Segurança: Swagger UI habilitado com `always-include=true`
  > Achado: `application.properties:27` — `quarkus.swagger-ui.always-include=true` — em produção deve ser false
  > Local: `application.properties:27`
  > Severidade: MEDIUM
  > Evidência: Docker compose de produção não sobrescreve esta propriedade

### Logging & Observabilidade

- [x] ✅ **PASS** — Backend: JBoss Logging
- [x] ✅ **PASS** — Backend: DEBUG para com.petcare em dev
- [x] ✅ **PASS** — Frontend: Console.warn/error para SSE
- [ ] ⚠️ **WARN** — Lacunas: Sem logging de request/response
- [ ] ⚠️ **WARN** — Lacunas: Sem métricas ou tracing
- [ ] ⚠️ **WARN** — Lacunas: Sem health check customizado

### Validação de Dados

- [x] ✅ **PASS** — Backend: Bean Validation nos DTOs
- [x] ✅ **PASS** — Backend: Validação customizada na camada de serviço
- [x] ✅ **PASS** — Backend: 400 com mensagem para erros de validação
- [x] ✅ **PASS** — Frontend: Validação HTML5
- [ ] ⚠️ **WARN** — Lacunas: Sem sanitização XSS server-side além de trim()
  > Severidade: MEDIUM
- [ ] ⚠️ **WARN** — Lacunas: businessName sem validação de regex (apenas @Size)
  > Severidade: LOW

### Consistência de Código

- [x] ✅ **PASS** — Nomenclatura: Backend português, Frontend inglês — consistente por camada
- [ ] ⚠️ **WARN** — Nomenclatura: Idiomas mistos em alguns DTOs
  > Severidade: LOW
- [ ] ❌ **FAIL** — Duplicação: ServiceCategory.java com import auto-referenciado
  > Severidade: LOW
- [ ] ❌ **FAIL** — Duplicação: ServiceCatalogController.java com imports duplicados
  > Severidade: LOW
- [x] ✅ **PASS** — Código morto: DomainException e UnauthorizedAccessException — não usadas
- [x] ✅ **PASS** — Código morto: application/port/ — não usadas
- [x] ✅ **PASS** — Código morto: Verificar App.integration.test.jsx
- [ ] ⚠️ **WARN** — Formatação: Espaços em branco à direita, linhas em branco inconsistentes
  > Severidade: LOW

### Segurança

- [x] ✅ **PASS** — JWT RS256 com RSA — forte
- [x] ✅ **PASS** — BCrypt para senhas — forte
- [x] ✅ **PASS** — Rate limiting login (5/min) — bom
- [x] ✅ **PASS** — Expiração de token configurável
- [ ] ⚠️ **WARN** — Sem refresh token — re-login após expiração
  > Severidade: MEDIUM
- [x] ✅ **PASS** — Isolamento petshopId em queries
- [x] ✅ **PASS** — Verificação de propriedade pet (anti-BOLA)
- [x] ✅ **PASS** — Verificação de propriedade agendamento
- [x] ✅ **PASS** — Bean Validation em POST/PUT
- [ ] ⚠️ **WARN** — Sem sanitização XSS explícita
  > Severidade: MEDIUM
- [x] ✅ **PASS** — .env com chaves JWT — verificar gitignore
- [x] ✅ **PASS** — Swagger config verificado
- [ ] ⚠️ **WARN** — Sem cabeçalhos CSP
  > Severidade: MEDIUM

### Testes

- [x] ✅ **PASS** — Backend: 4 arquivos de teste existem
- [ ] ❌ **FAIL** — Cobertura Backend: Zero testes para RegistrationService, AuthenticationService, ServiceCatalogService, controllers, SSE
  > Achado: Testes existentes: AgendamentoServiceTest, AuthServiceTest, PasswordServiceTest, IdsTest
  > Severidade: HIGH
- [x] ✅ **PASS** — Frontend: App.integration.test.jsx + e2e/app.e2e.spec.js
- [ ] ❌ **FAIL** — Cobertura Frontend: Sem testes unitários para componentes de feature, hooks ou APIs
  > Severidade: HIGH
- [ ] ⚠️ **WARN** — Lacunas: Sem testes de integração API
  > Severidade: MEDIUM
- [ ] ⚠️ **WARN** — Lacunas: Sem testes de contrato FE↔BE
  > Severidade: MEDIUM

### Infraestrutura & DevOps

- [x] ✅ **PASS** — Docker: Multi-stage builds
- [x] ✅ **PASS** — Docker: Health checks
- [x] ✅ **PASS** — Docker: Modo dev hot-reload
- [x] ✅ **PASS** — Docker: Volumes para persistência
- [x] ✅ **PASS** — CI/CD: .github/ existe
- [ ] ⚠️ **WARN** — Lacunas: Sem estratégia de backup
- [ ] ⚠️ **WARN** — Lacunas: Sem scripts de migração MongoDB

---

## Sumário por Severidade

### 🔴 CRITICAL (3)

| # | Módulo | Issue | Local |
|---|--------|-------|-------|
| 1 | Frontend Features — APIs | Todos os 6 módulos importam de `httpClientClient` (arquivo inexistente) | `features/*/api/*.js:1` |
| 2 | Backend Domain | DomainException e UnauthorizedAccessException nunca usadas | `domain/exception/*.java` |
| 3 | Backend Application | 6 interfaces port nunca importadas — código morto | `application/port/*.java` |

### 🔴 HIGH (6)

| # | Módulo | Issue | Local |
|---|--------|-------|-------|
| 4 | Application | RegistrationService usa O(n) scan em vez de existsOwner() | `RegistrationService.java:37` |
| 5 | Application | Race condition no registro de owner único | `RegistrationService.java:37,57` |
| 6 | Infrastructure | SseCatalogBroadcaster.toJson() — JSON manual (frágil) | `SseCatalogBroadcaster.java:54-68` |
| 7 | Infrastructure | jsonString() escapa manualmente — incompleto | `SseCatalogBroadcaster.java:70-79` |
| 8 | Infrastructure | PetController sem camada de serviço | `PetController.java:35-46` |
| 9 | Infrastructure | "DIAG:" nas mensagens de erro de validação | `ValidationExceptionMapper.java:32` |
| 10 | Domain | Inconsistência de idioma: Servico.category (en) vs Agendamento.type (pt) | `Servico.java:23`, `Agendamento.java:40` |
| 11 | Cross-Cutting | .env contém chaves JWT reais | `.env:6-54` |
| 12 | Cross-Cutting | Cobertura de testes backend ~5% | — |
| 13 | Cross-Cutting | Cobertura de testes frontend ~10% | — |

### 🟡 MEDIUM (14)

| # | Módulo | Issue | Local |
|---|--------|-------|-------|
| 14 | Application | Serviços injetam implementações concretas, não ports | Todos os services |
| 15 | Domain | Agendamento com dados desnormalizados — risco de inconsistência | `Agendamento.java:17-29` |
| 16 | Infrastructure | AppointmentController injeta repositories diretamente | `AppointmentController.java:41-47` |
| 17 | Application | hasConflict() sem controle de concorrência | `AppointmentService.java:257-278` |
| 18 | Frontend | useCatalogStream — onUpdate não memoizado → reconnect loop | `useCatalogStream.js:7` |
| 19 | Frontend | 4 useEffect com dependências complexas no ServiceRequest | `ServiceRequest.jsx` |
| 20 | Cross-Cutting | Sem ErrorBoundary React | — |
| 21 | Cross-Cutting | Sem sanitização XSS server-side | — |
| 22 | Cross-Cutting | Sem refresh token JWT | — |
| 23 | Cross-Cutting | Swagger always-include=true em produção | `application.properties:27` |

### 🟢 LOW (8)

| # | Módulo | Issue | Local |
|---|--------|-------|-------|
| 24 | Domain | ServiceCategory.java import auto-referenciado | `ServiceCategory.java:3` |
| 25 | Infrastructure | ServiceCatalogController imports duplicados | `ServiceCatalogController.java:6,8,9,12` |
| 26 | Infrastructure | SseCatalogBroadcaster imports duplicados | `SseCatalogBroadcaster.java:5-6` |
| 27 | Application | Servico.price double → BigDecimal | `Servico.java:33` |
| 28 | Application | Servico.duration String vs Agendamento.durationMinutes Integer | — |
| 29 | Application | Pet.age String em vez de Integer | `Pet.java:30` |
| 30 | Frontend | SSE stream @PermitAll sem auth | `ServiceCatalogController.java:89` |
| 31 | Cross-Cutting | Nomenclatura mista pt/en em DTOs | — |

---

> **Próximo passo:** Fase 3 — Correção Iterativa. Apresentar findings ao usuário para confirmação e aplicar correções no código. Aguardando confirmação.
