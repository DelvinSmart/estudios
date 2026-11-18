// EL DIRECTOR: la ventana de la app. Crea el repositorio del teléfono y el ViewModel, y pone la pantalla.
package com.tuusuario.gastosdelcarro

import android.graphics.Color
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.lifecycle.viewmodel.compose.viewModel
import com.tuusuario.gastosdelcarro.datos.RepositorioDataStore
import com.tuusuario.gastosdelcarro.pantalla.GastosViewModel
import com.tuusuario.gastosdelcarro.pantalla.PantallaGastos
import com.tuusuario.gastosdelcarro.tema.TemaGastos

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // La app usa toda la pantalla y el Scaffold cuida los bordes. Las barras del sistema van en modo OSCURO:
        // si no, en un teléfono con tema claro, el reloj y la batería salen negros sobre nuestro fondo oscuro.
        enableEdgeToEdge(
            statusBarStyle = SystemBarStyle.dark(Color.TRANSPARENT),
            navigationBarStyle = SystemBarStyle.dark(Color.TRANSPARENT),
        )
        val repositorio = RepositorioDataStore(applicationContext)
        setContent {
            TemaGastos {
                // viewModel(): Android lo crea una vez y lo guarda aunque gires el teléfono.
                val vm: GastosViewModel = viewModel(factory = GastosViewModel.fabrica(repositorio))
                PantallaGastos(vm)
            }
        }
    }
}
