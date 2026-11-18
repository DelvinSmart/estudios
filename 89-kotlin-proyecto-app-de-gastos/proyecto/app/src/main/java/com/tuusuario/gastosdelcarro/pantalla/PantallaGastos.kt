// LA PANTALLA, con Jetpack Compose (clase 66). Como en React: funciones que dibujan, los datos bajan
// (parámetros) y los avisos suben (alGuardar, alBorrar). Solo MUESTRA el estado del ViewModel.
package com.tuusuario.gastosdelcarro.pantalla

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.tuusuario.gastosdelcarro.logica.Borrador
import com.tuusuario.gastosdelcarro.logica.Gasto
import com.tuusuario.gastosdelcarro.logica.Semana
import com.tuusuario.gastosdelcarro.logica.Tipo
import com.tuusuario.gastosdelcarro.logica.dinero
import com.tuusuario.gastosdelcarro.tema.Motor
import com.tuusuario.gastosdelcarro.tema.TemaGastos
import java.time.LocalDate

/** La que usa la app: lee el estado del ViewModel y le pasa los avisos. */
@Composable
fun PantallaGastos(vm: GastosViewModel) {
    val estado by vm.estado.collectAsStateWithLifecycle() // como useState + onSnapshot: se redibuja sola
    ContenidoGastos(estado = estado, hoy = LocalDate.now(), alGuardar = vm::guardar, alBorrar = vm::borrar)
}

/** Sin ViewModel: solo datos y avisos. Así se puede ver en la vista previa de Android Studio. */
@Composable
fun ContenidoGastos(estado: EstadoPantalla, hoy: LocalDate, alGuardar: (Borrador) -> Boolean, alBorrar: (Long) -> Unit) {
    // Scaffold deja el contenido lejos de la barra de arriba y de la de abajo (como SafeAreaView);
    // imePadding lo sube cuando aparece el teclado (como KeyboardAvoidingView).
    Scaffold(containerColor = Motor.Colores.fondo) { bordes ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(bordes).imePadding(),
            contentPadding = PaddingValues(Motor.Espacio.medio),
            verticalArrangement = Arrangement.spacedBy(Motor.Espacio.medio),
        ) {
            item { Text("Gastos del carro", color = Motor.Colores.texto, fontSize = Motor.Letra.grande, fontWeight = FontWeight.Bold) }
            item { Resumen(estado.semana) }
            item { FormularioGasto(hoy = hoy, problemas = estado.problemas, habilitado = !estado.cargando, alGuardar = alGuardar) }
            estado.aviso?.let { aviso -> item { Text(aviso, color = Motor.Colores.peligro, fontSize = Motor.Letra.chica) } }
            when {
                estado.cargando -> item {
                    CircularProgressIndicator(color = Motor.Colores.acento, modifier = Modifier.padding(Motor.Espacio.grande))
                }
                estado.gastos.isEmpty() -> item {
                    Text(
                        "Todavía no anotaste gastos",
                        color = Motor.Colores.tenue,
                        fontSize = Motor.Letra.normal,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth().padding(top = Motor.Espacio.grande),
                    )
                }
                // Como FlatList con keyExtractor: solo dibuja lo que se ve, y cada tarjeta con su id.
                else -> items(estado.gastos, key = { it.id }) { gasto -> TarjetaGasto(gasto, alBorrar) }
            }
        }
    }
}

@Composable
private fun Tarjeta(contenido: @Composable () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Motor.Colores.tarjeta, RoundedCornerShape(Motor.Forma.radio))
            .padding(Motor.Espacio.medio),
        verticalArrangement = Arrangement.spacedBy(Motor.Espacio.chico),
    ) { contenido() }
}

@Composable
fun Resumen(semana: Semana) = Tarjeta {
    Text("Esta semana", color = Motor.Colores.tenue, fontSize = Motor.Letra.chica)
    Text(dinero(semana.total), color = Motor.Colores.acento, fontSize = Motor.Letra.grande, fontWeight = FontWeight.Bold)
    Text(if (semana.cantidad == 1) "1 gasto" else "${semana.cantidad} gastos", color = Motor.Colores.tenue, fontSize = Motor.Letra.chica)
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun FormularioGasto(hoy: LocalDate, problemas: List<String>, habilitado: Boolean, alGuardar: (Borrador) -> Boolean) = Tarjeta {
    // El estado de cada campo (como useState). rememberSaveable: no se pierde al girar el teléfono.
    var tipo by rememberSaveable { mutableStateOf(Tipo.COMBUSTIBLE) }
    var valor by rememberSaveable { mutableStateOf("") }
    var fecha by rememberSaveable { mutableStateOf(hoy.toString()) }

    Text("Tipo", color = Motor.Colores.tenue, fontSize = Motor.Letra.chica)
    // FlowRow: si los tipos no caben en una fila, pasan a la siguiente (como flexWrap: 'wrap').
    FlowRow(horizontalArrangement = Arrangement.spacedBy(Motor.Espacio.chico)) {
        Tipo.entries.forEach { t ->
            FilterChip(
                selected = t == tipo,
                onClick = { tipo = t },
                label = { Text(t.texto) },
                // El elegido, con el verde del motor (si no, Material pone su propio color).
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = Motor.Colores.acento,
                    selectedLabelColor = Motor.Colores.sobreAcento,
                ),
            )
        }
    }
    Row(horizontalArrangement = Arrangement.spacedBy(Motor.Espacio.chico)) {
        OutlinedTextField(
            value = valor,
            onValueChange = { valor = it },
            label = { Text("Valor (R$)") },
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
            modifier = Modifier.weight(1f).semantics { contentDescription = "Valor" },
        )
        OutlinedTextField(
            value = fecha,
            onValueChange = { fecha = it },
            label = { Text("Fecha") },
            singleLine = true,
            modifier = Modifier.weight(1f).semantics { contentDescription = "Fecha" },
        )
    }
    problemas.forEach { Text(it, color = Motor.Colores.peligro, fontSize = Motor.Letra.chica) }
    Button(
        onClick = { if (alGuardar(Borrador(tipo, valor, fecha))) valor = "" }, // listo para el próximo
        enabled = habilitado,
        shape = RoundedCornerShape(Motor.Forma.radioChico),
        modifier = Modifier.fillMaxWidth(),
    ) { Text("Guardar", fontWeight = FontWeight.Bold, fontSize = Motor.Letra.normal) }
}

@Composable
fun TarjetaGasto(gasto: Gasto, alBorrar: (Long) -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Motor.Colores.tarjeta, RoundedCornerShape(Motor.Forma.radio))
            .padding(Motor.Espacio.medio),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(Motor.Espacio.medio),
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(gasto.tipo.texto, color = Motor.Colores.texto, fontSize = Motor.Letra.normal)
            Text(gasto.fecha.toString(), color = Motor.Colores.tenue, fontSize = Motor.Letra.chica)
        }
        Text(dinero(gasto.valor), color = Motor.Colores.texto, fontSize = Motor.Letra.normal, fontWeight = FontWeight.Bold)
        OutlinedButton(
            onClick = { alBorrar(gasto.id) },
            border = BorderStroke(1.dp, Motor.Colores.peligro),
            shape = RoundedCornerShape(Motor.Forma.radioChico),
            modifier = Modifier.semantics { contentDescription = "Borrar ${gasto.tipo.texto} de ${dinero(gasto.valor)}" },
        ) { Text("Borrar", color = Motor.Colores.peligro, fontSize = Motor.Letra.chica) }
    }
}

/** La vista previa de Android Studio: la pantalla con datos de mentira, sin correr la app. */
@Preview(showBackground = true, widthDp = 380)
@Composable
private fun VistaPrevia() = TemaGastos {
    val hoy = LocalDate.of(2026, 11, 18)
    ContenidoGastos(
        estado = EstadoPantalla(
            cargando = false,
            gastos = listOf(Gasto(2, Tipo.LAVADO, 30.5, hoy), Gasto(1, Tipo.PEAJE, 12.0, hoy)),
            semana = Semana(total = 42.5, cantidad = 2),
        ),
        hoy = hoy,
        alGuardar = { true },
        alBorrar = {},
    )
}
