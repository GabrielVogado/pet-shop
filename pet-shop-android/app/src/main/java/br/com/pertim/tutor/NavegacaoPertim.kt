package br.com.pertim.tutor

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import br.com.pertim.tutor.entrar.EntrarTela

object Rotas {
    const val ENTRAR = "entrar"
}

@Composable
fun NavegacaoPertim() {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = Rotas.ENTRAR) {
        composable(Rotas.ENTRAR) { EntrarTela() }
    }
}
