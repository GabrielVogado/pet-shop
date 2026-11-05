# ADR-002: Índice único parcial para garantir um único owner

- **Status:** Aceito, implementado. **Será substituído** pelo ADR de multi-tenancy do Épico 1 (vários petshops).
- **Data:** 01/08/2026 (revisado em 05/11/2026)

## Contexto

O MVP aceita um único petshop. A checagem `existsOwner()` seguida de `insert` tinha condição de corrida: dois cadastros simultâneos de owner podiam passar.

## Decisão

Criar no MongoDB um índice único parcial sobre `role` com `partialFilterExpression: { role: "owner" }`. O `RegistrationService` trata o erro de chave duplicada (E11000) como conflito HTTP 409.

Script registrado como aplicado na migração MIG-001 (fora do repositório):

```js
db.usuario.createIndex(
  { role: 1 },
  { name: "idx_usuario_role_owner_unique", unique: true, partialFilterExpression: { role: "owner" } }
)
```

O nome da coleção (`usuario`) vem do registro da migração; confirme no banco antes de reaplicar, porque o JNoSQL usa o nome da classe da entidade (`Usuario`) quando `@Entity` não define nome.

## Consequências

- Garante atomicamente um único owner.
- O índice é criado por script manual; o código não o cria. Ambiente novo sem o script fica só com a checagem em código.
- Contradiz diretamente o objetivo de ter vários petshops: o índice precisa ser removido na migração do Épico 1.
