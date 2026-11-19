// LA PANTALLA: dibuja lo que dice la jornada y avisa lo que se tocó. No hace cuentas.
import SwiftUI

struct PantallaJornada: View {
    @State private var jornada = Jornada()   // @State: cuando cambia, SwiftUI vuelve a dibujar
    @State private var valor = 18.0          // lo que pagó el próximo viaje

    var body: some View {
        VStack(spacing: 24) {
            Text("Mi jornada")
                .font(.largeTitle.bold())

            VStack(spacing: 4) {
                Text(jornada.total.enReales)
                    .font(.system(size: 56, weight: .light))
                Text(jornada.resumen)
                    .foregroundStyle(.secondary)
            }

            // Stepper: un número con − y +, de a 0,50.
            Stepper("Este viaje: \(valor.enReales)", value: $valor, in: 0.5...200, step: 0.5)

            HStack(spacing: 12) {
                Button("＋ Viaje") { jornada.anotar(valor) }
                    .buttonStyle(.borderedProminent)
                Button("Deshacer") { jornada.deshacer() }
                    .buttonStyle(.bordered)
                    .disabled(jornada.viajes.isEmpty)
            }
        }
        .padding(24)
    }
}

// La vista previa: Xcode la dibuja al lado del código, sin abrir el simulador.
#Preview {
    PantallaJornada()
}
