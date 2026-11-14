package br.com.pertim.tutor.ui.marca

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import br.com.pertim.tutor.R

const val NOME_PRODUTO = "Pertim"
const val ASSINATURA = "O pet shop pertinho de você."

/** Assinatura visual: símbolo + "per" na cor do texto e "tim" na cor primária, como em packages/ui/Marca.tsx. */
@Composable
fun Marca(modifier: Modifier = Modifier) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Image(
            painter = painterResource(R.drawable.pertim_simbolo),
            contentDescription = null,
            modifier = Modifier.size(40.dp),
        )
        Text(
            text = buildAnnotatedString {
                withStyle(SpanStyle(color = MaterialTheme.colorScheme.onSurface)) { append("per") }
                withStyle(SpanStyle(color = MaterialTheme.colorScheme.primary)) { append("tim") }
            },
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.ExtraBold,
        )
    }
}
