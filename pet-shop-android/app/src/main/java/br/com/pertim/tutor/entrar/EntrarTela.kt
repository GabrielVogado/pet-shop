package br.com.pertim.tutor.entrar

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import br.com.pertim.tutor.R
import br.com.pertim.tutor.ui.marca.ASSINATURA
import br.com.pertim.tutor.ui.marca.Marca
import br.com.pertim.tutor.ui.tema.TemaPertim

@Composable
fun EntrarTela(viewModel: EntrarViewModel = viewModel()) {
    val estado by viewModel.estado.collectAsStateWithLifecycle()
    EntrarConteudo(
        estado = estado,
        onEmail = viewModel::mudarEmail,
        onSenha = viewModel::mudarSenha,
        onAlternarSenha = viewModel::alternarSenhaVisivel,
        onEntrar = viewModel::entrar,
        onOpcaoIndisponivel = viewModel::opcaoIndisponivel,
    )
}

/** Disposição do protótipo T1 (Documentos/03-ui-ux/apresentacao/telas/t1.png). */
@Composable
private fun EntrarConteudo(
    estado: EntrarEstado,
    onEmail: (String) -> Unit,
    onSenha: (String) -> Unit,
    onAlternarSenha: () -> Unit,
    onEntrar: () -> Unit,
    onOpcaoIndisponivel: () -> Unit,
) {
    val cores = MaterialTheme.colorScheme
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(cores.surface)
            .safeDrawingPadding()
            .imePadding(),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .widthIn(max = 448.dp)
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Spacer(Modifier.height(48.dp))
            Marca()
            Text(
                text = ASSINATURA,
                style = MaterialTheme.typography.bodyLarge,
                color = cores.onSurfaceVariant,
                modifier = Modifier.padding(top = 4.dp),
            )
            Spacer(Modifier.height(32.dp))

            CampoRotulado(
                rotulo = "E-mail",
                valor = estado.email,
                onValor = onEmail,
                exemplo = "voce@email.com",
                erro = estado.erroEmail,
                teclado = KeyboardOptions(keyboardType = KeyboardType.Email, imeAction = ImeAction.Next),
            )
            Spacer(Modifier.height(16.dp))
            CampoRotulado(
                rotulo = "Senha",
                valor = estado.senha,
                onValor = onSenha,
                exemplo = "Sua senha",
                erro = estado.erroSenha,
                teclado = KeyboardOptions(keyboardType = KeyboardType.Password, imeAction = ImeAction.Done),
                acoes = KeyboardActions(onDone = { onEntrar() }),
                transformacao = if (estado.senhaVisivel) VisualTransformation.None else PasswordVisualTransformation(),
                acessorio = {
                    IconButton(onClick = onAlternarSenha) {
                        Icon(
                            painter = painterResource(if (estado.senhaVisivel) R.drawable.ic_olho_fechado else R.drawable.ic_olho),
                            contentDescription = if (estado.senhaVisivel) "Esconder senha" else "Mostrar senha",
                            tint = cores.onSurfaceVariant,
                        )
                    }
                },
            )
            Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.CenterEnd) {
                LinkTexto("Esqueci a senha", onOpcaoIndisponivel)
            }

            estado.falha?.let { falha ->
                Text(
                    text = falha,
                    style = MaterialTheme.typography.bodyMedium,
                    color = cores.onErrorContainer,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp)
                        .background(cores.errorContainer, RoundedCornerShape(12.dp))
                        .padding(horizontal = 12.dp, vertical = 8.dp)
                        .semantics { liveRegion = LiveRegionMode.Polite },
                )
            }

            Spacer(Modifier.height(16.dp))
            Button(
                onClick = onEntrar,
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp),
            ) {
                Text("Entrar", style = MaterialTheme.typography.titleMedium)
            }

            Row(
                modifier = Modifier.fillMaxWidth().padding(vertical = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                HorizontalDivider(Modifier.weight(1f), color = cores.outlineVariant)
                Text("ou", style = MaterialTheme.typography.bodyMedium, color = cores.onSurfaceVariant)
                HorizontalDivider(Modifier.weight(1f), color = cores.outlineVariant)
            }

            OutlinedButton(
                onClick = onOpcaoIndisponivel,
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp),
            ) {
                Text("G", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = cores.primary)
                Spacer(Modifier.padding(horizontal = 6.dp))
                Text("Entrar com Google", style = MaterialTheme.typography.titleMedium, color = cores.primary)
            }
            Spacer(Modifier.height(24.dp))
        }

        Row(
            modifier = Modifier.padding(bottom = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text("Ainda não tem conta?", style = MaterialTheme.typography.bodyLarge, color = cores.onSurface)
            LinkTexto("Criar conta", onOpcaoIndisponivel)
        }
    }
}

@Composable
private fun CampoRotulado(
    rotulo: String,
    valor: String,
    onValor: (String) -> Unit,
    exemplo: String,
    erro: String?,
    teclado: KeyboardOptions,
    acoes: KeyboardActions = KeyboardActions.Default,
    transformacao: VisualTransformation = VisualTransformation.None,
    acessorio: (@Composable () -> Unit)? = null,
) {
    val cores = MaterialTheme.colorScheme
    Column(Modifier.fillMaxWidth()) {
        Text(
            rotulo,
            style = MaterialTheme.typography.labelLarge,
            color = cores.onSurfaceVariant,
            modifier = Modifier.padding(bottom = 6.dp),
        )
        OutlinedTextField(
            value = valor,
            onValueChange = onValor,
            placeholder = { Text(exemplo, style = MaterialTheme.typography.bodyLarge) },
            isError = erro != null,
            supportingText = erro?.let { mensagem -> @Composable { Text(mensagem) } },
            singleLine = true,
            textStyle = MaterialTheme.typography.bodyLarge,
            visualTransformation = transformacao,
            keyboardOptions = teclado,
            keyboardActions = acoes,
            trailingIcon = acessorio,
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedContainerColor = cores.surfaceContainerLowest,
                unfocusedContainerColor = cores.surfaceContainerLowest,
                errorContainerColor = cores.surfaceContainerLowest,
                unfocusedBorderColor = cores.outline,
            ),
            modifier = Modifier.fillMaxWidth(),
        )
    }
}

@Composable
private fun LinkTexto(texto: String, onClick: () -> Unit) {
    TextButton(onClick = onClick) {
        Text(
            texto,
            style = MaterialTheme.typography.bodyLarge,
            fontWeight = FontWeight.SemiBold,
            textDecoration = TextDecoration.Underline,
            color = MaterialTheme.colorScheme.primary,
        )
    }
}

@Preview(showBackground = true, widthDp = 390, heightDp = 844)
@Composable
private fun EntrarPreview() {
    TemaPertim { EntrarConteudo(EntrarEstado(), {}, {}, {}, {}, {}) }
}
