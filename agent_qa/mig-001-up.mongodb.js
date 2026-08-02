// ============================================================================
// MIG-001: Índice único parcial — garante no máximo 1 owner na coleção usuario
// Engine: MongoDB 7 (WiredTiger)
// Projeto: PetCare Agenda
// Autor: Gabriel Vogado
// Data: 2026-08-01
//
// Executar via:
//   mongosh < mig-001-up.mongodb.js
// ou:
//   mongosh --eval "load('mig-001-up.mongodb.js')"
//
// Para ambiente Docker (dev):
//   docker exec -it petcare-mongo-dev mongosh -u petcare -p petcare \
//     --authenticationDatabase admin petcare < mig-001-up.mongodb.js
// ============================================================================

// ──────────────────────────────────────────────────────────────────────────
// 1. Pré-verificação: quantos owners já existem?
// ──────────────────────────────────────────────────────────────────────────
const ownerCount = db.usuario.countDocuments({ role: "owner" });
print(`\n[MIG-001] Owners existentes antes do índice: ${ownerCount}`);

if (ownerCount > 1) {
    // Se houver mais de 1 owner, o índice NÃO pode ser criado.
    // É necessário resolver manualmente antes de prosseguir.
    const owners = db.usuario
        .find({ role: "owner" }, { _id: 1, email: 1, name: 1, businessName: 1 })
        .toArray();
    print("\n[MIG-001] ⛔ ABORTADO: múltiplos owners detectados.");
    print("[MIG-001] O índice único parcial não pode ser aplicado enquanto houver");
    print("[MIG-001] mais de 1 owner. Remova owners duplicados manualmente e tente novamente.");
    print("\n[MIG-001] Owners atuais:");
    printjson(owners);
    quit(1);
}

// ──────────────────────────────────────────────────────────────────────────
// 2. Criação do índice único parcial
// ──────────────────────────────────────────────────────────────────────────
// MongoDB 4.2+ cria índices em background por padrão — sem bloqueio de coleção.
// O partialFilterExpression garante que apenas documentos com role:"owner"
// são indexados. Tutores e documentos sem role não são afetados.
print("\n[MIG-001] Criando índice único parcial idx_usuario_role_owner_unique...");

const result = db.usuario.createIndex(
    { role: 1 },
    {
        name: "idx_usuario_role_owner_unique",
        unique: true,
        partialFilterExpression: { role: "owner" }
    }
);

print(`[MIG-001] ✅ Resultado: ${JSON.stringify(result)}`);

// ──────────────────────────────────────────────────────────────────────────
// 3. Pós-verificação: confirmar que o índice está ativo e configurado
// ──────────────────────────────────────────────────────────────────────────
const indexes = db.usuario.getIndexes();
const created = indexes.find(function (ix) {
    return ix.name === "idx_usuario_role_owner_unique";
});

if (created && created.unique && created.partialFilterExpression) {
    print("\n[MIG-001] ✅ Índice único parcial confirmado:");
    printjson({
        name: created.name,
        unique: created.unique,
        partialFilterExpression: created.partialFilterExpression,
        key: created.key,
        v: created.v
    });
} else {
    print("\n[MIG-001] ⚠️ Índice criado mas verificação falhou — inspecione manualmente.");
    print("[MIG-001] Execute: db.usuario.getIndexes()");
}

// ──────────────────────────────────────────────────────────────────────────
// 4. Teste funcional rápido
// ──────────────────────────────────────────────────────────────────────────
print("\n[MIG-001] Executando teste funcional...");

// 4a. Inserir um tutor — deve funcionar (não é owner)
try {
    db.usuario.insertOne({
        _id: "mig001-verify-tutor",
        role: "tutor",
        email: "mig001-verify-tutor@test.com",
        name: "Tutor de Teste MIG-001",
        phone: "11999999999",
        address: "Rua Teste, 123",
        passwordHash: "test-hash"
    });
    print("[MIG-001]   ✅ Insert de tutor: OK");
} catch (e) {
    print(`[MIG-001]   ❌ Insert de tutor falhou inesperadamente: ${e.message}`);
}

// 4b. Tentar inserir um segundo owner (além do existente) — deve falhar
try {
    db.usuario.insertOne({
        _id: "mig001-verify-owner-dup",
        role: "owner",
        email: "mig001-verify-owner@test.com",
        name: "Owner Duplicado",
        businessName: "Petshop Teste",
        petshopId: "test",
        passwordHash: "test-hash"
    });
    print("[MIG-001]   ❌ Insert de 2º owner deveria ter falhado — índice pode não estar ativo!");
} catch (e) {
    if (e.code === 11000 || (e.message && e.message.includes("E11000"))) {
        print("[MIG-001]   ✅ Insert de 2º owner: rejeitado com E11000 (comportamento esperado)");
    } else {
        print(`[MIG-001]   ⚠️ Insert de 2º owner falhou com erro inesperado: ${e.message}`);
    }
}

// 4c. Inserir documento sem campo role — deve funcionar (fora do partialFilter)
try {
    db.usuario.insertOne({
        _id: "mig001-verify-no-role",
        email: "mig001-verify-norole@test.com",
        name: "Sem Role",
        passwordHash: "test-hash"
    });
    print("[MIG-001]   ✅ Insert sem campo 'role': OK (fora do partialFilterExpression)");
} catch (e) {
    print(`[MIG-001]   ⚠️ Insert sem role falhou: ${e.message}`);
}

// ──────────────────────────────────────────────────────────────────────────
// 5. Limpeza dos documentos de teste
// ──────────────────────────────────────────────────────────────────────────
const deleteResult = db.usuario.deleteMany({ _id: /^mig001-verify-/ });
print(`\n[MIG-001] 🧹 Limpeza: ${deleteResult.deletedCount} documentos de teste removidos.`);

// ──────────────────────────────────────────────────────────────────────────
// 6. Conclusão
// ──────────────────────────────────────────────────────────────────────────
print("\n[MIG-001] 🏁 Migração concluída com sucesso.");
print("[MIG-001] Próximos passos:");
print("[MIG-001]   1. Confirmar no backend: deploy pode seguir sem alterações obrigatórias");
print("[MIG-001]   2. A race condition 'existsOwner + insert' está neutralizada pelo índice");
print("[MIG-001]   3. Erro E11000 (HTTP 500) pode ser mapeado para 409 via ApiExceptionMapper");
print("[MIG-001]   4. Rollback disponível em: mig-001-down.mongodb.js\n");
