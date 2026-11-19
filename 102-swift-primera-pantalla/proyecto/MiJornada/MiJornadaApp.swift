// LA PUERTA DE ENTRADA: @main dice "la app empieza aquí". Abre una ventana con la pantalla de la jornada.
import SwiftUI

@main
struct MiJornadaApp: App {
    var body: some Scene {
        WindowGroup {
            PantallaJornada()
        }
    }
}
