# App Android — Pertim

App do tutor em Kotlin com Jetpack Compose, conforme o [ADR-011](../Documentos/08-analise-tecnica/adrs.md#adr-011-app-android-em-kotlin-e-módulo-compartilhado-kmp). Hoje é o esqueleto: tema Pertim (claro e escuro), navegação e a tela de entrar (T1), que valida o formulário mas ainda não chama a API.

## Pegar o APK pronto

A esteira **APK Android** gera um APK a cada PR ou push que mexe em `pet-shop-android/`:

1. Abra o PR (ou a aba **Actions**) e entre na execução da esteira **APK Android**.
2. Em **Artifacts**, baixe `pertim-tutor-debug-<commit>` e descompacte.
3. No celular, permita instalar de fontes desconhecidas e abra o `pertim-tutor-debug.apk`.

Para gerar de qualquer branch sem PR: **Actions > APK Android > Run workflow**.

O APK é de debug (assinado com a chave de debug). O de release para a Play Store depende da chave da loja guardada como secret.

## Rodar local

Pré-requisitos: JDK 17 e Android SDK (Android Studio já traz os dois).

```bash
./gradlew testDebugUnitTest   # testes
./gradlew assembleDebug       # APK em app/build/outputs/apk/debug/
./gradlew installDebug        # instala no aparelho ou emulador conectado
```

## Decisões deste esqueleto

- Android 8 (API 26) como versão mínima, a proposta do ADR-011, ainda a confirmar pelo PO.
- `applicationId` `br.com.pertim.tutor`, provisório até o domínio e o INPI.
- Projeto Gradle próprio. O multimódulo com `shared` e backend (ADR-011, passos 1 e 2) vem depois.
- Sem Koin ou Hilt: ainda não há dependência para injetar.
- Fontes do sistema por enquanto. Figtree e Bricolage Grotesque entram junto com a próxima tela.
