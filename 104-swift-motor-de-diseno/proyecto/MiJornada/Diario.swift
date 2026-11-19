// EL DIARIO: los viajes de la app, compartidos por todas las pantallas.
// Es una class (clase 100): se comparte, no se copia. @Observable: cuando cambia, las pantallas que lo leen se dibujan de nuevo.
import Foundation
import Observation

@Observable
final class Diario {
    private(set) var viajes: [Viaje]
    private let guardado: Guardado

    init(guardado: Guardado) {
        self.guardado = guardado
        viajes = guardado.leer()
    }

    var total: Double { viajes.reduce(0) { $0 + $1.valor } }

    var promedio: Double { viajes.isEmpty ? 0 : total / Double(viajes.count) }

    /// La línea chica debajo del total. Muestra el promedio, no el total otra vez
    /// (encontrado mirando la tarjeta: "R$ 85,00" aparecía dos veces).
    var resumen: String {
        switch viajes.count {
        case 0: return "Sin viajes todavía"
        case 1: return "1 viaje · promedio \(promedio.enReales)"
        default: return "\(viajes.count) viajes · promedio \(promedio.enReales)"
        }
    }

    /// Anota un viaje arriba de todo (el más nuevo primero). Un valor de 0 o negativo no se anota.
    func anotar(valor: Double, app: String) {
        guard valor > 0 else { return }
        viajes.insert(Viaje(valor: valor, app: app), at: 0)
        guardado.guardar(viajes)
    }

    /// Borra los viajes de esas posiciones (lo que manda la lista al deslizar el dedo).
    func borrar(en posiciones: IndexSet) {
        viajes.remove(atOffsets: posiciones)
        guardado.guardar(viajes)
    }
}
