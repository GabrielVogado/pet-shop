package br.com.pertim.tutor.ui.marca

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import br.com.pertim.tutor.R

const val NOME_PRODUTO = "Pertim"
const val ASSINATURA = "O pet shop pertinho de você."

/** Marca empilhada da tela de entrar (T1): símbolo em cima, "per" na cor do texto e "tim" na primária. */
@Composable
fun Marca(modifier: Modifier = Modifier) {
    Column(
        modifier = modifier.semantics(mergeDescendants = true) { contentDescription = NOME_PRODUTO },
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Image(
            painter = painterResource(R.drawable.pertim_simbolo),
            contentDescription = null,
            modifier = Modifier.size(64.dp),
        )
        Text(
            text = buildAnnotatedString {
                withStyle(SpanStyle(color = MaterialTheme.colorScheme.onSurface)) { append("per") }
                withStyle(SpanStyle(color = MaterialTheme.colorScheme.primary)) { append("tim") }
            },
            style = MaterialTheme.typography.displaySmall,
            maxLines = 1,
            softWrap = false,
        )
    }
}
