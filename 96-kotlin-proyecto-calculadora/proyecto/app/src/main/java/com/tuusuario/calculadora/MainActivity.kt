// LA VENTANA DE LA APP: elige el tema según el teléfono y pone la pantalla.
package com.tuusuario.calculadora

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.lifecycle.viewmodel.compose.viewModel
import com.tuusuario.calculadora.pantalla.CalculadoraViewModel
import com.tuusuario.calculadora.pantalla.PantallaCalculadora
import com.tuusuario.calculadora.tema.Claro
import com.tuusuario.calculadora.tema.Oscuro

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge() // las barras del sistema se adaptan solas al modo claro u oscuro
        setContent {
            // isSystemInDarkTheme(): el useColorScheme() de React Native.
            val colores = if (isSystemInDarkTheme()) Oscuro else Claro
            val vm: CalculadoraViewModel = viewModel() // Android lo crea una vez y lo guarda aunque gires el teléfono
            PantallaCalculadora(vm, colores)
        }
    }
}
