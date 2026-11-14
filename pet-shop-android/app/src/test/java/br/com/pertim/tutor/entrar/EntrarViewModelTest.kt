package br.com.pertim.tutor.entrar

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class EntrarViewModelTest {

    @Test
    fun `campos vazios mostram os dois erros`() {
        val vm = EntrarViewModel()
        vm.entrar()
        val estado = vm.estado.value
        assertEquals("Informe seu e-mail.", estado.erroEmail)
        assertEquals("Informe sua senha.", estado.erroSenha)
        assertNull(estado.falha)
    }

    @Test
    fun `e-mail sem dominio e recusado`() {
        val vm = EntrarViewModel()
        vm.mudarEmail("ana@exemplo")
        vm.mudarSenha("segredo")
        vm.entrar()
        assertEquals("Esse e-mail não parece certo. Confira e tente de novo.", vm.estado.value.erroEmail)
    }

    @Test
    fun `dados validos avisam que o servidor esta em construcao`() {
        val vm = EntrarViewModel()
        vm.mudarEmail("  ana@exemplo.com ")
        vm.mudarSenha("segredo")
        vm.entrar()
        val estado = vm.estado.value
        assertNull(estado.erroEmail)
        assertNull(estado.erroSenha)
        assertEquals(EntrarViewModel.SERVIDOR_EM_CONSTRUCAO, estado.falha)
    }

    @Test
    fun `digitar de novo limpa o erro do campo`() {
        val vm = EntrarViewModel()
        vm.entrar()
        vm.mudarEmail("a")
        assertNull(vm.estado.value.erroEmail)
        assertEquals("Informe sua senha.", vm.estado.value.erroSenha)
    }
}
