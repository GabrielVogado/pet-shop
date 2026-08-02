// ============================================================================
// MIG-001 ROLLBACK: Remove o índice único parcial de owner
// Engine: MongoDB 7 (WiredTiger)
// Projeto: PetCare Agenda
// Autor: Gabriel Vogado
// Data: 2026-08-01
//
// Executar via:
//   mongosh < mig-001-down.mongodb.js
// ou:
//   mongosh --eval "load('mig-001-down.mongodb.js')"
//
// ⚠️ ATENÇÃO:
//   - Após rollback, a proteção contra duplicação de owner DESAPARECE
//   - A race condition no RegistrationService.register() volta a existir
//   - dropIndex é instantâneo — não bloqueia a coleção
// ============================================================================

// ──────────────────────────────────────────────────────────────────────────
// 1. Verificar se o índice existe
// ──────────────────────────────────────────────────────────────────────────
const indexes = db.usuario.getIndexes();
const idx = indexes.find(function (ix) {
    return ix.name === "idx_usuario_role_owner_unique";
});

if (!idx) {
    print("\n[MIG-001-ROLLBACK] ℹ️ Índice idx_usuario_role_owner_unique já não existe.");
    print("[MIG-001-ROLLBACK] Nada a fazer.\n");
    quit(0);
}

print(`\n[MIG-001-ROLLBACK] Índice encontrado: ${idx.name}`);
print(`[MIG-001-ROLLBACK]   unique: ${idx.unique}`);
print(`[MIG-001-ROLLBACK]   partialFilterExpression: ${JSON.stringify(idx.partialFilterExpression)}`);

// ──────────────────────────────────────────────────────────────────────────
// 2. Verificar se há múltiplos owners (inseguro remover índice neste caso)
// ──────────────────────────────────────────────────────────────────────────
const ownerCount = db.usuario.countDocuments({ role: "owner" });
print(`[MIG-001-ROLLBACK] Owners atuais na coleção: ${ownerCount}`);

if (ownerCount > 1) {
    print("\n[MIG-001-ROLLBACK] ⚠️ AVISO: Existem múltiplos owners na coleção.");
    print("[MIG-001-ROLLBACK] O índice está atualmente bloqueando a criação de mais owners.");
    print("[MIG-001-ROLLBACK] Remover o índice agora permitirá que mais owners sejam criados.");
    print("[MIG-001-ROLLBACK] Isso NÃO removerá os owners existentes — apenas removerá a constraint.");
    print("\n[MIG-001-ROLLBACK] Owners atuais:");
    const owners = db.usuario
        .find({ role: "owner" }, { _id: 1, email: 1, name: 1, businessName: 1 })
        .toArray();
    printjson(owners);
    print("\n[MIG-001-ROLLBACK] Continuando com a remoção do índice...");
}

// ──────────────────────────────────────────────────────────────────────────
// 3. Remover o índice
// ──────────────────────────────────────────────────────────────────────────
print("\n[MIG-001-ROLLBACK] Removendo índice idx_usuario_role_owner_unique...");

const dropResult = db.usuario.dropIndex("idx_usuario_role_owner_unique");
print(`[MIG-001-ROLLBACK] ✅ Resultado: ${JSON.stringify(dropResult)}`);

// ──────────────────────────────────────────────────────────────────────────
// 4. Pós-verificação: confirmar que o índice foi removido
// ──────────────────────────────────────────────────────────────────────────
const postIndexes = db.usuario.getIndexes();
const stillExists = postIndexes.some(function (ix) {
    return ix.name === "idx_usuario_role_owner_unique";
});

if (stillExists) {
    print("\n[MIG-001-ROLLBACK] ❌ ERRO: O índice ainda existe após tentativa de remoção!");
    print("[MIG-001-ROLLBACK] Inspecione manualmente: db.usuario.getIndexes()");
} else {
    print("\n[MIG-001-ROLLBACK] ✅ Verificação: índice removido com sucesso.");
}

// ──────────────────────────────────────────────────────────────────────────
// 5. Conclusão
// ──────────────────────────────────────────────────────────────────────────
print("\n[MIG-001-ROLLBACK] 🏁 Rollback concluído.");
print("[MIG-001-ROLLBACK] ⚠️ A race condition de registro de owner voltou a existir.");
print("[MIG-001-ROLLBACK] Reaplique mig-001-up.mongodb.js para restaurar a proteção.\n");
