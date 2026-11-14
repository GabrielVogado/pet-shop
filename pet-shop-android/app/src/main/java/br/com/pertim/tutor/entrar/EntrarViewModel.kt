package br.com.pertim.tutor.entrar

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class EntrarEstado(
    val email: String = "",
    val senha: String = "",
    val erroEmail: String? = null,
    val erroSenha: String? = null,
    val falha: String? = null,
)

/** Tela de entrar (T1). Mesmas regras e textos de packages/ui/FormularioEntrar.tsx. */
class EntrarViewModel : ViewModel() {
    private val _estado = MutableStateFlow(EntrarEstado())
    val estado: StateFlow<EntrarEstado> = _estado.asStateFlow()

    fun mudarEmail(valor: String) = _estado.update { it.copy(email = valor, erroEmail = null, falha = null) }

    fun mudarSenha(valor: String) = _estado.update { it.copy(senha = valor, erroSenha = null, falha = null) }

    fun entrar() {
        val atual = _estado.value
        val email = atual.email.trim()
        val erroEmail = when {
            email.isEmpty() -> "Informe seu e-mail."
            !EMAIL.matches(email) -> "Esse e-mail não parece certo. Confira e tente de novo."
            else -> null
        }
        val erroSenha = if (atual.senha.isEmpty()) "Informe sua senha." else null
        // shortcut: sem requisição; o backend ainda não expõe POST /auth/login do contrato v2 (ADR-011, passo 6).
        val falha = if (erroEmail == null && erroSenha == null) SERVIDOR_EM_CONSTRUCAO else null
        _estado.update { it.copy(erroEmail = erroEmail, erroSenha = erroSenha, falha = falha) }
    }

    companion object {
        private val EMAIL = Regex("^\\S+@\\S+\\.\\S+$")
        const val SERVIDOR_EM_CONSTRUCAO = "Ainda não dá para entrar: o servidor novo está em construção."
    }
}
