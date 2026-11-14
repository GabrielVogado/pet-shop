package br.com.pertim.tutor.ui.tema

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Mesmos papéis de cor de packages/tema/tokens.css (Identidade Visual, seção 4).
private val Claro = lightColorScheme(
    primary = Color(0xFF1F5B4A),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFDCEBE3),
    onPrimaryContainer = Color(0xFF0E2A22),
    secondary = Color(0xFFF5B82E),
    onSecondary = Color(0xFF14231E),
    secondaryContainer = Color(0xFFFDF0CF),
    onSecondaryContainer = Color(0xFF5B3F00),
    background = Color(0xFFF6F8F4),
    onBackground = Color(0xFF14231E),
    surface = Color(0xFFF6F8F4),
    onSurface = Color(0xFF14231E),
    surfaceContainerLowest = Color(0xFFFFFFFF),
    surfaceContainerHighest = Color(0xFFE6ECE8),
    onSurfaceVariant = Color(0xFF4A5A53),
    outline = Color(0xFF7A8A83),
    outlineVariant = Color(0xFFDCE3DE),
    error = Color(0xFFB3261E),
    onError = Color(0xFFFFFFFF),
    errorContainer = Color(0xFFF9DEDC),
    onErrorContainer = Color(0xFF410E0B),
)

private val Escuro = darkColorScheme(
    primary = Color(0xFF8FD3B8),
    onPrimary = Color(0xFF0A2A20),
    primaryContainer = Color(0xFF1F5B4A),
    onPrimaryContainer = Color(0xFFDCEBE3),
    secondary = Color(0xFFF5B82E),
    onSecondary = Color(0xFF14231E),
    secondaryContainer = Color(0xFF4A3A10),
    onSecondaryContainer = Color(0xFFFDF0CF),
    background = Color(0xFF0F1714),
    onBackground = Color(0xFFE3ECE7),
    surface = Color(0xFF0F1714),
    onSurface = Color(0xFFE3ECE7),
    surfaceContainerLowest = Color(0xFF17211D),
    surfaceContainerHighest = Color(0xFF26312C),
    onSurfaceVariant = Color(0xFFA9B8B1),
    outline = Color(0xFF75857E),
    outlineVariant = Color(0xFF2A3631),
    error = Color(0xFFF2B8B5),
    onError = Color(0xFF601410),
    errorContainer = Color(0xFF8C1D18),
    onErrorContainer = Color(0xFFF9DEDC),
)

@Composable
fun TemaPertim(escuro: Boolean = isSystemInDarkTheme(), conteudo: @Composable () -> Unit) {
    MaterialTheme(colorScheme = if (escuro) Escuro else Claro, content = conteudo)
}
