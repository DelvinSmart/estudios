// LA PUERTA DE ENTRADA: crea el diario UNA vez (guardado en el teléfono) y se lo pasa a todas las pantallas.
import SwiftUI

@main
struct MiJornadaApp: App {
    @State private var diario = Diario(guardado: GuardadoEnElTelefono())

    var body: some Scene {
        WindowGroup {
            PantallaLista()
                .environment(diario)   // todas las pantallas de adentro pueden leerlo con @Environment
        }
    }
}
